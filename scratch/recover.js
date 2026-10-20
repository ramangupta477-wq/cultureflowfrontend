const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\SHRISH\\.gemini\\antigravity-ide\\brain\\b232e8fe-e70b-4c92-82a3-bff3d7ca8e51\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let fullFile = null;

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      // look for view_file response that shows the whole file, or write_to_file that writes it.
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'write_to_file' || tc.name === 'default_api:write_to_file') {
            const args = tc.arguments;
            if (args.TargetFile && args.TargetFile.endsWith('HeroSection.css')) {
              fullFile = args.CodeContent;
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  if (fullFile) {
    fs.writeFileSync('c:\\Culture flow\\culture_flow\\scratch\\recovered.css', fullFile);
    console.log('Recovered!');
  } else {
    console.log('Not found in write_to_file. Trying to reconstruct from diffs.');
  }
}

processLineByLine();
