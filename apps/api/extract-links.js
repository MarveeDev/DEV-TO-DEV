const fs = require('fs');
const html = fs.readFileSync('apps/api/test-skill.html', 'utf-8');
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Go to Course Material')) {
    console.log('Match found in HTML:');
    // Print the context
    console.log(lines.slice(Math.max(0, i - 2), i + 3).join('\n'));
  }
}
