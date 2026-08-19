async function run() {
  const res = await fetch('http://127.0.0.1:3000/skills/python');
  const html = await res.text();
  require('fs').writeFileSync('apps/api/test-skill.html', html);
  console.log('Done');
}
run();
