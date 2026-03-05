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
  .description('Install dashboard (uses pre-built static export)')
  .action(() => {
    console.log('Copy Chief Dashboard — Installing...\n');

    const outDir = path.join(DASHBOARD_DIR, 'out');
    if (fs.existsSync(outDir)) {
      console.log('[1/1] Pre-built dashboard found — no build needed.');
      console.log('\n✅ Dashboard installed! Run: npx @lucapimenta/copy-chief-dashboard start');
      return;
    }

    // Fallback: build from source if out/ not present
    if (!fs.existsSync(path.join(DASHBOARD_DIR, 'package.json'))) {
      console.error('Dashboard source not found');
      process.exit(1);
    }

    console.log('[1/2] Installing dependencies...');
    execSync('npm install', { cwd: DASHBOARD_DIR, stdio: 'inherit' });

    console.log('\n[2/2] Building...');
    try {
      execSync('npm run build', { cwd: DASHBOARD_DIR, stdio: 'inherit' });
    } catch (e) {
      console.log('\n⚠️  Build failed. Dashboard source is included for manual build.');
      console.log('    cd dashboard && npm install && npm run build');
      return;
    }

    console.log('\n✅ Dashboard installed! Run: npx @lucapimenta/copy-chief-dashboard start');
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
    const outDir = path.join(DASHBOARD_DIR, 'out');

    if (fs.existsSync(outDir)) {
      // Serve pre-built static export
      console.log(`Starting dashboard on http://localhost:${port} (static)`);
      execSync(`npx serve -s "${outDir}" -l ${port}`, { stdio: 'inherit' });
    } else {
      // Fallback to next start if built with node_modules
      console.log(`Starting dashboard on http://localhost:${port}`);
      execSync(`npx next start -p ${port}`, { cwd: DASHBOARD_DIR, stdio: 'inherit' });
    }
  });

program.parse();
