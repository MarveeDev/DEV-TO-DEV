async function run() {
  const res = await fetch('http://127.0.0.1:3001/api/v1/skills/python');
  const data = await res.json();
  data.roadmaps.forEach(rs => {
    console.log(`Generated URL: /roadmaps/${rs.node.roadmap.slug}/${rs.node.id}`);
  });
}
run();
