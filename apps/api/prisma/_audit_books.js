const fs = require('fs');
const src = fs.readFileSync('roadmaps.data.ts', 'utf8');

function grab(re) {
  const a = [];
  let m;
  while ((m = re.exec(src)) !== null) a.push(m[1]);
  return a;
}

const titles = grab(/"recommendedBookTitle":\s*"([^"]*)"/g);
const authors = grab(/"recommendedBookAuthor":\s*"([^"]*)"/g);
const urls = grab(/"recommendedBookUrl":\s*"([^"]*)"/g);
const rtypes = grab(/"resourceType":\s*"([^"]*)"/g);

console.log('counts -> titles:', titles.length, 'authors:', authors.length, 'urls:', urls.length, 'resourceType:', rtypes.length);

const PAID = new Set([
  'pearson.com','oreilly.com','wiley.com','elsevier.com','mheducation.com','manning.com',
  'nostarch.com','mitpress.mit.edu','ciscopress.com','routledge.com','cambridge.org','packtpub.com',
  'amazon.com','us.artechhouse.com','mhprofessional.com','link.springer.com','global.oup.com',
  'gameenginebook.com','microsoftpressstore.com','jbpub.com','chelseagreen.com','incose.org',
  'industrialpress.com','dataintensive.net','nigelpoulton.com','nodejsdesignpatterns.com',
  'bytebytego.com','databass.dev','terraformupandrunning.com','realtimecollisiondetection.net',
  'ansiblefordevops.com','realtimerendering.com'
]);

const host = (u) => { try { return new URL(u).host.replace(/^www\./,''); } catch(e){ return '(invalid)'; } };

const out = [];
for (let i = 0; i < urls.length; i++) {
  const h = host(urls[i]);
  out.push({ i, paid: PAID.has(h), host: h, title: titles[i], author: authors[i], url: urls[i] });
}

const paid = out.filter(o => o.paid);
console.log('\nPAID candidates:', paid.length, '\n');
paid.forEach(o => {
  console.log(`[${o.i}] ${o.host}\n    T: ${o.title}\n    A: ${o.author}\n    U: ${o.url}`);
});
