require('dotenv').config();
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const ftp = require('basic-ftp');

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_REMOTE_DIR,
  FTP_VERBOSE,
  DEPLOY_FULL,
  DEPLOY_DELETE,
  DEPLOY_DRY_RUN,
  DEPLOY_CONCURRENCY,
  DEPLOY_MANIFEST_NAME,
  DEPLOY_IGNORE
} = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_DIR) {
  console.error('Missing FTP configuration. Check .env for FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_DIR');
  process.exit(1);
}

const localDir = path.join(process.cwd(), 'out');
const manifestName = DEPLOY_MANIFEST_NAME || '.deploy-manifest.json';
const deployFull = parseBoolean(DEPLOY_FULL);
const deployDelete = DEPLOY_DELETE === undefined ? true : parseBoolean(DEPLOY_DELETE);
const deployDryRun = parseBoolean(DEPLOY_DRY_RUN);
const deployConcurrency = Number.parseInt(DEPLOY_CONCURRENCY, 10) || 3;
const ignoredBasenames = new Set(['.DS_Store', 'Thumbs.db']);
const ignoredDirnames = new Set(['admin']);

function parseBoolean(value) {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function toPosixPath(inputPath) {
  return inputPath.split(path.sep).join('/');
}

async function walkDir(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirnames.has(entry.name)) {
        continue;
      }
      files.push(...await walkDir(resolved));
    } else if (entry.isFile()) {
      files.push(resolved);
    }
  }
  return files;
}

async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

async function buildLocalManifest() {
  const files = {};
  const allFiles = await walkDir(localDir);
  for (const filePath of allFiles) {
    const baseName = path.basename(filePath);
    if (ignoredBasenames.has(baseName)) {
      continue;
    }
    if (DEPLOY_IGNORE) {
      // TODO: support patterns in DEPLOY_IGNORE
    }
    const stats = await fs.promises.stat(filePath);
    const relPath = toPosixPath(path.relative(localDir, filePath));
    files[relPath] = {
      size: stats.size,
      hash: await hashFile(filePath)
    };
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    files
  };
}

function isMissingRemoteManifest(error) {
  if (!error) return false;
  if (error.code === 550) return true;
  if (typeof error.message === 'string' && error.message.includes('550')) return true;
  return false;
}

async function downloadRemoteManifest(client, remotePath) {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'deploy-manifest-'));
  const tempPath = path.join(tempDir, 'manifest.json');
  try {
    await client.downloadTo(tempPath, remotePath);
    const raw = await fs.promises.readFile(tempPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.files !== 'object') {
      throw new Error('Remote manifest is corrupted; remove it or fix JSON');
    }
    return parsed;
  } catch (error) {
    if (isMissingRemoteManifest(error)) {
      return { files: {} };
    }
    if (error instanceof SyntaxError) {
      throw new Error('Remote manifest is corrupted; remove it or fix JSON');
    }
    throw error;
  } finally {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  }
}

async function uploadManifest(client, remotePath, manifest) {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'deploy-manifest-'));
  const tempPath = path.join(tempDir, 'manifest.json');
  try {
    await fs.promises.writeFile(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    await client.uploadFrom(tempPath, remotePath);
  } finally {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  }
}

async function ensureRemoteDir(client, remoteDir, baseDir) {
  await client.ensureDir(remoteDir);
  await client.cd(baseDir);
}

async function runPool(items, limit, createWorker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    const worker = await createWorker();
    try {
      while (queue.length) {
        const item = queue.shift();
        if (!item) return;
        await worker(item);
      }
    } finally {
      if (typeof worker.close === 'function') {
        await worker.close();
      }
    }
  });
  await Promise.all(workers);
}

function logPlan(title, items, limit = 50) {
  const sample = items.slice(0, limit);
  if (!sample.length) {
    return;
  }
  console.log(`${title} (showing ${sample.length} of ${items.length})`);
  for (const item of sample) {
    console.log(` - ${item}`);
  }
}

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = parseBoolean(FTP_VERBOSE);
  const remoteBase = toPosixPath(FTP_REMOTE_DIR);
  const remoteManifestPath = path.posix.join(remoteBase, manifestName);

  async function createPoolClient() {
    const poolClient = new ftp.Client();
    poolClient.ftp.verbose = parseBoolean(FTP_VERBOSE);
    await poolClient.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    });
    await poolClient.ensureDir(remoteBase);
    return poolClient;
  }

  async function createUploadWorker() {
    const poolClient = await createPoolClient();
    const worker = async (relPath) => {
      const localAbs = path.join(localDir, relPath.split('/').join(path.sep));
      const remoteAbs = path.posix.join(remoteBase, relPath);
      const remoteDir = path.posix.dirname(remoteAbs);
      await ensureRemoteDir(poolClient, remoteDir, remoteBase);
      await poolClient.uploadFrom(localAbs, remoteAbs);
    };
    worker.close = async () => {
      poolClient.close();
    };
    return worker;
  }

  async function createDeleteWorker() {
    const poolClient = await createPoolClient();
    const worker = async (relPath) => {
      const remoteAbs = path.posix.join(remoteBase, relPath);
      try {
        await poolClient.remove(remoteAbs);
      } catch (error) {
        if (!isMissingRemoteManifest(error)) {
          throw error;
        }
      }
    };
    worker.close = async () => {
      poolClient.close();
    };
    return worker;
  }

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    });

    await client.ensureDir(remoteBase);

    const localManifest = await buildLocalManifest();

    if (deployFull) {
      console.log('Running full deploy.');
      if (deployDryRun) {
        console.log('Dry run enabled; skipping remote operations.');
        console.log(`Full deploy would upload ${Object.keys(localManifest.files).length} files.`);
        return;
      }
      await client.clearWorkingDir();
      await client.uploadFromDir(localDir);
      await uploadManifest(client, remoteManifestPath, localManifest);
      console.log('Deploy complete');
      return;
    }

    const remoteManifest = await downloadRemoteManifest(client, remoteManifestPath);
    const remoteFiles = remoteManifest.files || {};

    const toUpload = [];
    const toSkip = [];
    const localFiles = localManifest.files;

    for (const [relPath, metadata] of Object.entries(localFiles)) {
      const remoteEntry = remoteFiles[relPath];
      if (!remoteEntry) {
        toUpload.push(relPath);
        continue;
      }
      if (remoteEntry.size !== metadata.size || remoteEntry.hash !== metadata.hash) {
        toUpload.push(relPath);
      } else {
        toSkip.push(relPath);
      }
    }

    const toDelete = deployDelete
      ? Object.keys(remoteFiles).filter((relPath) => !(relPath in localFiles))
      : [];

    console.log(`Summary: total=${Object.keys(localFiles).length}, upload=${toUpload.length}, skip=${toSkip.length}, delete=${toDelete.length}`);

    if (deployDryRun) {
      console.log('Dry run enabled; skipping remote operations.');
      logPlan('Files to upload', toUpload);
      logPlan('Files to delete', toDelete);
      return;
    }

    await runPool(toUpload, deployConcurrency, createUploadWorker);

    if (deployDelete && toDelete.length) {
      await runPool(toDelete, deployConcurrency, createDeleteWorker);
    }

    await uploadManifest(client, remoteManifestPath, localManifest);
    console.log('Deploy complete');
  } catch (error) {
    console.error('Deploy failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
