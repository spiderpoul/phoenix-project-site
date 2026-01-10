require('dotenv').config();
const path = require('path');
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

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    });

    await client.ensureDir(FTP_REMOTE_DIR);
    await client.clearWorkingDir();
    await client.uploadFromDir(localDir);
    console.log('Deploy complete');
  } catch (error) {
    console.error('Deploy failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
