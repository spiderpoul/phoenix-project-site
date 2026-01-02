const nextBin = require('next/dist/bin/next');

process.env.NEXT_DISABLE_PATCH_INCORRECT_LOCKFILE = '1';

const args = process.argv.slice(2);
process.argv = ['node', 'next', ...args];

nextBin();
