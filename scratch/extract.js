const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\SHRISH\\.gemini\\antigravity-ide\\brain\\b232e8fe-e70b-4c92-82a3-bff3d7ca8e51\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let out = '';
  for await (const line of rl) {
    if (line.includes('HeroSection.css')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name.includes('view_file') || tc.name.includes('replace_file_content')) {
              out += JSON.stringify(tc.arguments, null, 2) + '\n\n';
            }
          }
        }
        if (parsed.content) {
           out += 'CONTENT: ' + parsed.content.substring(0, 500) + '\n\n';
        }
      } catch (e) {
        // ignore
      }
    }
  }
  fs.writeFileSync('C:\\Culture flow\\culture_flow\\scratch\\css_history.txt', out);
}
extract();
