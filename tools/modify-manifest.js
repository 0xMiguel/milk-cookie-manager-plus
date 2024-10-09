const fs = require('fs');
const path = require('path');

const browser = process.argv[2];
const manifestPath = path.join(__dirname, '..', 'dist', 'manifest.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (browser === 'chrome') {
  delete manifest.background.scripts;
  delete manifest.browser_specific_settings;
} else if (browser === 'firefox') {
  delete manifest.background.service_worker;
  delete manifest.offline_enabled;
  delete manifest.incognito;
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));