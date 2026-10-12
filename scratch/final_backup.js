const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:\\Culture flow\\culture_flow\\src\\app\\homepage');
const backupPath = path.join('C:\\Culture flow\\culture_flow', 'beige_theme_backup.md');

const files = [
  'HeroSection.tsx',
  'HeroSection.css',
  'GlobeLineDrawing.tsx',
  'ShaderBackground.tsx'
];

let mdContent = '# Beige Theme Backup\n\nThis file contains a backup of the beige theme components and styles.\n\n';

for (const file of files) {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(file).replace('.', '');
    const content = fs.readFileSync(filePath, 'utf-8');
    mdContent += `## ${file}\n\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
  } else {
    mdContent += `## ${file}\n\nFile not found.\n\n`;
  }
}

fs.writeFileSync(backupPath, mdContent);
console.log('Backup created successfully at ' + backupPath);
