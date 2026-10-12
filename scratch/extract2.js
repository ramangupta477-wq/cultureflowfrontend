const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\SHRISH\\.gemini\\antigravity-ide\\brain\\b232e8fe-e70b-4c92-82a3-bff3d7ca8e51\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let out = '';
  for await (const line of rl) {
    if (line.includes('HeroSection.css') && line.includes('hero-section {') && line.includes('CodeContent')) {
      out += line + '\n\n';
    }
  }
  fs.writeFileSync('C:\\Culture flow\\culture_flow\\scratch\\css_full.txt', out);
}
extract();
