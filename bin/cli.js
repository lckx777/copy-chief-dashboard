#!/usr/bin/env node
'use strict';
const { Command } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DASHBOARD_DIR = path.join(__dirname, '..', 'dashboard');

const program = new Command();
program.name('copy-chief-dashboard').version('1.0.0')
  .description('Copy Chief BLACK — Dashboard');

program.command('install')
  .description('Install dashboard dependencies and build')
  .action(() => {
    console.log('Copy Chief Dashboard — Installing...\n');

    if (!fs.existsSync(path.join(DASHBOARD_DIR, 'package.json'))) {
      console.error('Dashboard source not found');
      process.exit(1);
    }

    console.log('[1/2] Installing dependencies...');
    execSync('npm install', { cwd: DASHBOARD_DIR, stdio: 'inherit' });

    console.log('\n[2/2] Building...');
    execSync('npm run build', { cwd: DASHBOARD_DIR, stdio: 'inherit' });

    console.log('\n✅ Dashboard installed! Run: copy-chief-dashboard start');
  });

program.command('dev')
  .description('Run dashboard in development mode (port 3000)')
  .action(() => {
    execSync('npm run dev', { cwd: DASHBOARD_DIR, stdio: 'inherit' });
  });

program.command('start')
  .description('Start dashboard server (port 3000)')
  .option('-p, --port <port>', 'Port number', '3000')
  .action((opts) => {
    const port = opts.port || '3000';
    console.log(`Starting dashboard on http://localhost:${port}`);
    execSync(`npx next start -p ${port}`, { cwd: DASHBOARD_DIR, stdio: 'inherit' });
  });

program.parse();
