const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const partialsDir = path.join(__dirname, 'partials');
const distDir = path.join(__dirname, 'dist');

const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8').trimEnd();
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8').trimEnd();

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync(path.join(partialsDir, 'chrome.css'), path.join(distDir, 'chrome.css'));

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith('.html')) continue;
  let html = fs.readFileSync(path.join(srcDir, file), 'utf8');
  html = html.replace('<!--@@HEADER@@-->', header).replace('<!--@@FOOTER@@-->', footer);
  fs.writeFileSync(path.join(distDir, file), html);
  console.log(`built ${file}`);
}
