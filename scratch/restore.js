const fs = require('fs');

const lines = fs.readFileSync('C:\\Culture flow\\culture_flow\\scratch\\css_full.txt', 'utf8').split('\n');
let json = lines[2]; // line 3 is the updated one
if (json && json.startsWith('{')) {
  const parsed = JSON.parse(json);
  const code = parsed.tool_calls[0].args.CodeContent;
  fs.writeFileSync('C:\\Culture flow\\culture_flow\\src\\app\\homepage\\HeroSection.css', code);
  console.log("Restored HeroSection.css");
}
