const { spawn } = require('child_process');

const adminPort = process.env.ADMIN_PORT || '3000';
const cmsPort = process.env.ADMIN_CMS_PORT || '8081';

const env = { ...process.env, PORT: adminPort };

const nextDev = spawn('npm', ['run', 'dev', '--', '-p', adminPort], {
  stdio: 'inherit',
  shell: true,
  env
});

const cmsServer = spawn('decap-server', ['--port', cmsPort], {
  stdio: 'inherit',
  shell: true
});

const shutdown = (signal) => {
  if (nextDev) {
    nextDev.kill(signal);
  }
  if (cmsServer) {
    cmsServer.kill(signal);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

nextDev.on('exit', (code) => {
  if (code !== 0) {
    shutdown('SIGTERM');
  }
});
