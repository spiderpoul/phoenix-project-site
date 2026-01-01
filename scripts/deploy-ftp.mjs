import { Client } from "basic-ftp";
import path from "path";
import process from "process";

const required = ["FTP_HOST", "FTP_USER", "FTP_PASS", "FTP_REMOTE_DIR"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const client = new Client();
client.ftp.verbose = true;

const localDir = path.resolve("out");

try {
  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false
  });

  const remoteDir = process.env.FTP_REMOTE_DIR;
  await client.ensureDir(remoteDir);
  await client.clearWorkingDir();
  await client.uploadFromDir(localDir);
  console.log(`Deployed ${localDir} to ${remoteDir}`);
} catch (error) {
  console.error("FTP deploy failed:", error);
  process.exit(1);
} finally {
  client.close();
}
