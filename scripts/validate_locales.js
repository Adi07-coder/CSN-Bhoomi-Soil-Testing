const fs = require('fs');
const path = require('path');

const LOCALES = path.join(__dirname, '..', 'frontend', 'src', 'locales');
const LANGS = ['en', 'hi', 'mr'];
const NS = ['common', 'farm', 'soil', 'crops', 'fertilizers', 'reports'];

let errors = 0;
let totalKeys = 0;

for (const lang of LANGS) {
  for (const ns of NS) {
    const file = path.join(LOCALES, lang, ns + '.json');
    try {
      let content = fs.readFileSync(file, 'utf8');
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[BOM Removed] ${file}`);
      }
      const data = JSON.parse(content);
      const count = Object.keys(data).length;
      totalKeys += count;
      console.log(`✓ [${lang.toUpperCase()}] ${ns}.json: Valid JSON (${count} top-level sections)`);
    } catch (e) {
      console.error(`✗ [${lang.toUpperCase()}] ${file} parse error:`, e.message);
      errors++;
    }
  }
}

console.log(`\nAudit completed: ${errors === 0 ? 'ALL CLEAR' : 'FAILURES DETECTED'}. Total top-level sections checked: ${totalKeys}`);
if (errors > 0) process.exit(1);
