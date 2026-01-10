require('dotenv').config();
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const ftp = require('basic-ftp');

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_REMOTE_DIR
} = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_DIR) {
  console.error('Missing FTP configuration. Check .env for FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_DIR');
  process.exit(1);
}

const localDir = path.join(process.cwd(), 'out');
const MANIFEST_NAME = '.deploy-manifest.json';

const IGNORED_DIRS = new Set(['admin']);
const IGNORED_BASENAMES = new Set(['.DS_Store', 'Thumbs.db']);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function walkDir(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORED_DIRS.has(e.name)) continue; // skip whole directory
      out.push(...await walkDir(full));
    } else if (e.isFile()) {
      if (IGNORED_BASENAMES.has(e.name)) continue;
      out.push(full);
    }
  }
  return out;
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const s = fs.createReadStream(filePath);
    s.on('data', (c) => hash.update(c));
    s.on('error', reject);
    s.on('end', () => resolve(hash.digest('hex')));
  });
}

async function buildLocalManifest() {
  const files = {};
  const all = await walkDir(localDir);

  for (const abs of all) {
    const rel = toPosix(path.relative(localDir, abs));
    const st = await fs.promises.stat(abs);
    files[rel] = { size: st.size, hash: await sha256File(abs) };
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    files
  };
}

function isMissingRemoteFile(err) {
  if (!err) return false;
  if (err.code === 550) return true;
  if (typeof err.message === 'string' && err.message.includes('550')) return true;
  return false;
}

async function downloadRemoteManifest(client, remoteManifestPath) {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'deploy-manifest-'));
  const tempPath = path.join(tempDir, 'manifest.json');
  try {
    await client.downloadTo(tempPath, remoteManifestPath);
    const raw = await fs.promises.readFile(tempPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.files !== 'object') {
      throw new Error('Remote manifest is corrupted; remove it or fix JSON');
    }
    return parsed;
  } catch (err) {
    if (isMissingRemoteFile(err)) return { files: {} };
    if (err instanceof SyntaxError) {
      throw new Error('Remote manifest is corrupted; remove it or fix JSON');
    }
    throw err;
  } finally {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  }
}

async function uploadRemoteManifest(client, remoteManifestPath, manifest) {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'deploy-manifest-'));
  const tempPath = path.join(tempDir, 'manifest.json');
  try {
    await fs.promises.writeFile(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    await client.uploadFrom(tempPath, remoteManifestPath);
  } finally {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  }
}

async function ensureRemoteDir(client, remoteDir, baseDir) {
  await client.ensureDir(remoteDir);
  await client.cd(baseDir);
}

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  const remoteBase = toPosix(FTP_REMOTE_DIR);
  const remoteManifestPath = path.posix.join(remoteBase, MANIFEST_NAME);

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    });

    await client.ensureDir(remoteBase);

    // 1) Build manifests
    const localManifest = await buildLocalManifest();
    const remoteManifest = await downloadRemoteManifest(client, remoteManifestPath);

    const localFiles = localManifest.files || {};
    const remoteFiles = (remoteManifest && remoteManifest.files) ? remoteManifest.files : {};

    // 2) Plan: upload only when hash changed; delete when missing locally
    const toUpload = [];
    const toSkip = [];

    for (const [rel, meta] of Object.entries(localFiles)) {
      const r = remoteFiles[rel];
      if (!r) {
        toUpload.push(rel);
      } else if (r.hash !== meta.hash) {
        toUpload.push(rel);
      } else {
        toSkip.push(rel);
      }
    }

    const toDelete = Object.keys(remoteFiles).filter((rel) => !(rel in localFiles));

    console.log(
      `Summary: total=${Object.keys(localFiles).length}, ` +
      `upload=${toUpload.length}, ` +
      `skip=${toSkip.length}, ` +
      `delete=${toDelete.length}`
    );

    // 3) Upload changed/new files
    for (const rel of toUpload) {
      const localAbs = path.join(localDir, rel.split('/').join(path.sep));
      const remoteAbs = path.posix.join(remoteBase, rel);
      const remoteDir = path.posix.dirname(remoteAbs);
      await ensureRemoteDir(client, remoteDir, remoteBase);
      await client.uploadFrom(localAbs, remoteAbs);
      console.log(`Uploaded: ${rel}`);
    }

    // 4) Delete removed files (based on previous manifest)
    for (const rel of toDelete) {
      const remoteAbs = path.posix.join(remoteBase, rel);
      try {
        await client.remove(remoteAbs);
        console.log(`Deleted: ${rel}`);
      } catch (err) {
        if (!isMissingRemoteFile(err)) throw err;
      }
    }

    // 5) Update manifest last
    await uploadRemoteManifest(client, remoteManifestPath, localManifest);

    console.log('Deploy complete');
  } catch (error) {
    console.error('Deploy failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
