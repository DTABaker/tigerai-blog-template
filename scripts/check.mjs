// Integration checks use an isolated temporary copy; your content and dist stay untouched.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, mkdir, writeFile, readFile, readdir, cp, rm, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { stringify } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await mkdtemp(path.join(root, '.check-workspace-'));
const site = { name: 'Your Name', initials: 'YN', headline: 'A clear headline', description: 'An honest introduction.', role: '', location: '', email: '', url: '', github: '', linkedin: '', resumePdf: '', accent: 'teal', templateMode: true };
const write = async (file, text) => { await mkdir(path.dirname(path.join(temporary, file)), { recursive: true }); await writeFile(path.join(temporary, file), text); };
const read = file => readFile(path.join(temporary, file), 'utf8');
const setSite = changes => write('content/site.yml', stringify({ ...site, ...changes }));
const post = (changes = {}, body = '## A useful section\n\nAn explanation.\n\n[Projects](/projects/)\n\n## Résumé & next steps\n\nCafé, 日本語, and an honest perspective.\n\n## Main\n\nA heading must not duplicate the layout main ID.\n\n## Site nav\n\nA second reserved ID.\n\n<script>alert("unsafe")</script>') => `---\n${stringify({ title: 'Title <script>alert("metadata")</script>', description: 'A "quoted" description & context.', date: '2020-01-15', tags: ['Learning', ' Learning ', 'café', '日本語'], featured: true, draft: false, template: false, ...changes })}---\n${body}\n`;
const run = (extra = {}) => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: temporary, encoding: 'utf8', env: { ...process.env, SITE_URL: '', BUILD_DATE: '2026-01-15', ...extra } });
const succeed = result => assert.equal(result.status, 0, result.stdout + result.stderr);
const failed = (result, pattern) => { assert.equal(result.status, 1, result.stdout + result.stderr); assert.match(result.stderr, pattern); };
const digest = async () => {
  const hash = createHash('sha256');
  for (const filename of (await files(path.join(temporary, 'dist'))).sort()) {
    hash.update(path.relative(temporary, filename)).update('\0').update(await readFile(filename)).update('\0');
  }
  return hash.digest('hex');
};
const allOutputText = async () => (await Promise.all((await files(path.join(temporary, 'dist'))).map(file => readFile(file, 'utf8')))).join('\n');

async function files(folder) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await files(filename));
    else result.push(filename);
  }
  return result;
}

async function checkLinks(base) {
  const output = path.join(temporary, 'dist');
  const htmlFiles = (await files(output)).filter(file => file.endsWith('.html'));
  for (const filename of htmlFiles) {
    const relative = path.relative(output, filename).replace(/\\/g, '/');
    const pageUrl = `https://preview.invalid${base}/${relative}`;
    const html = await readFile(filename, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      if (/^(?:https?:|mailto:|tel:)/.test(value)) continue;
      const url = new URL(value, pageUrl);
      assert.ok(url.pathname.startsWith(`${base}/`), `Link escapes deployment prefix: ${relative} → ${value}`);
      let target = path.join(output, decodeURIComponent(url.pathname.slice(base.length)));
      const info = await stat(target).catch(() => null);
      assert.ok(info, `Broken local link: ${relative} → ${value}`);
      if (info.isDirectory()) target = path.join(target, 'index.html');
      assert.ok(await stat(target).catch(() => null), `Missing page: ${relative} → ${value}`);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${relative} → ${value}`);
      }
    }
  }
}

try {
  await cp(path.join(root, 'scripts'), path.join(temporary, 'scripts'), { recursive: true });
  await cp(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), { recursive: true });
  for (const dir of ['content/posts', 'content/projects', 'docs', 'templates', 'assets']) await mkdir(path.join(temporary, dir), { recursive: true });
  await write('package.json', '{"type":"module"}');
  await setSite({});
  await write('content/about.md', '## About\n\nYour accurate introduction.');
  await write('content/resume.md', '## Experience\n\nYour real experience.');
  await write('content/posts/first-post.md', post());
  await write('content/posts/draft-post.md', post({ title: 'DRAFT_SENTINEL', draft: true }, 'PRIVATE_DRAFT_SENTINEL'));
  await write('content/posts/future-post.md', post({ title: 'FUTURE_SENTINEL', date: '2099-01-01' }, 'FUTURE_BODY_SENTINEL'));
  await write('content/projects/first-project.md', post({ title: 'A real project' }));
  const samplePost = post({ title: 'SAMPLE_POST_SENTINEL', template: true }, 'SAMPLE_POST_BODY_SENTINEL');
  const sampleProject = post({ title: 'SAMPLE_PROJECT_SENTINEL', template: true }, 'SAMPLE_PROJECT_BODY_SENTINEL');
  await write('content/posts/sample-post.md', samplePost);
  await write('content/projects/sample-project.md', sampleProject);
  for (const name of ['WORKSHOP', 'FACILITATOR', 'CUSTOMIZE', 'TROUBLESHOOTING', 'AI-PROMPTS', 'WORKSHEET']) await write(`docs/${name}.md`, `# ${name}\n\nRead the [workshop](WORKSHOP.md).`);
  for (const name of ['styles.css', 'app.js', 'favicon.svg']) await write(`assets/${name}`, '');
  succeed(run());
  const homepage = await read('dist/index.html');
  assert.match(homepage, /noindex, nofollow/);
  assert.match(homepage, /SAMPLE_POST_SENTINEL/);
  assert.match(await read('dist/posts/sample-post/index.html'), /SAMPLE_POST_BODY_SENTINEL/);
  assert.match(await read('dist/projects/sample-project/index.html'), /SAMPLE_PROJECT_BODY_SENTINEL/);
  assert.doesNotMatch(homepage, /rel="canonical"/);
  assert.match(await read('dist/posts/first-post/index.html'), /&lt;script&gt;alert/);
  assert.doesNotMatch(await read('dist/posts/first-post/index.html'), /<script>alert/);
  assert.match(await read('dist/posts/first-post/index.html'), /id="resume-next-steps"/);
  assert.match(await read('dist/posts/first-post/index.html'), /id="main-2"/);
  assert.match(await read('dist/posts/first-post/index.html'), /id="site-nav-2"/);
  const articleIds = [...(await read('dist/posts/first-post/index.html')).matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(articleIds).size, articleIds.length, 'All article IDs must be unique.');
  assert.match(await read('dist/writing/index.html'), /data-tags="\[&quot;Learning&quot;,&quot;café&quot;,&quot;日本語&quot;\]"/);
  assert.ok(!(await readdir(path.join(temporary, 'dist'))).includes('content'));
  await checkLinks('');
  console.log('PASS: root deployment, internal links, escaped HTML, Unicode, normalized tags, and template noindex.');

  succeed(run({ SITE_URL: 'https://username.github.io/professional-blog/' }));
  await checkLinks('/professional-blog');
  assert.match(await read('dist/index.html'), /rel="canonical" href="https:\/\/username\.github\.io\/professional-blog\/"/);
  assert.match(await read('dist/feed.xml'), /https:\/\/username\.github\.io\/professional-blog\/posts\/first-post\//);
  const outputText = await allOutputText();
  assert.doesNotMatch(outputText, /DRAFT_SENTINEL|PRIVATE_DRAFT_SENTINEL|FUTURE_SENTINEL|FUTURE_BODY_SENTINEL/);
  console.log('PASS: project-subdirectory deployment, RSS, sitemap, and draft/future exclusion.');

  const originalDigest = await digest();
  await setSite({ github: 'javascript:alert(1)' });
  failed(run(), /github.*http:\/\//);
  assert.equal(await digest(), originalDigest);
  await setSite({});
  await write('content/posts/first-post.md', post({ date: '2026-02-30' }));
  failed(run(), /first-post\.md.*not a real calendar date/);
  assert.equal(await digest(), originalDigest);
  await write('content/posts/first-post.md', post({}, '[Unsafe link](javascript:alert%281%29)'));
  failed(run(), /Unsafe URL scheme/);
  assert.equal(await digest(), originalDigest);
  await write('content/posts/first-post.md', post({}, '![Description](/assets/uploads/missing-image.png)'));
  failed(run(), /missing-image\.png.*missing page or file/);
  assert.equal(await digest(), originalDigest);
  await write('content/posts/first-post.md', post({}, '[Missing heading](#no-such-heading)'));
  failed(run(), /missing heading/);
  assert.equal(await digest(), originalDigest);
  await write('content/posts/first-post.md', post());
  await write('content/site.yml', 'name: "Unclosed quote\n');
  failed(run(), /site\.yml.*YAML/);
  assert.equal(await digest(), originalDigest);
  console.log('PASS: unsafe URL, impossible date, missing image/heading, and malformed YAML failures preserve the entire prior build.');

  await setSite({ templateMode: false, resumePdf: '/assets/uploads/resume.pdf', github: 'https://github.com/example' });
  failed(run(), /resumePdf.*not found/);
  await write('assets/uploads/resume.pdf', '%PDF-1.7\nFixture PDF');
  succeed(run({ SITE_URL: 'https://username.github.io/professional-blog/' }));
  assert.doesNotMatch(await read('dist/index.html'), /noindex, nofollow|template-banner/);
  assert.match(await read('dist/resume/index.html'), /href="\/professional-blog\/assets\/uploads\/resume.pdf" download/);
  assert.match(await read('dist/robots.txt'), /Allow: \/\nSitemap:/);
  assert.doesNotMatch(await allOutputText(), /SAMPLE_(?:POST|PROJECT)_(?:BODY_)?SENTINEL/);
  assert.equal(await read('content/posts/sample-post.md'), samplePost);
  assert.equal(await read('content/projects/sample-project.md'), sampleProject);
  assert.equal(await stat(path.join(temporary, 'dist/posts/sample-post/index.html')).catch(() => null), null);
  assert.equal(await stat(path.join(temporary, 'dist/projects/sample-project/index.html')).catch(() => null), null);
  assert.doesNotMatch(await read('dist/feed.xml'), /sample-post/);
  assert.doesNotMatch(await read('dist/sitemap.xml'), /sample-post|sample-project/);
  console.log('PASS: launch mode hides template pages, lists, feeds, and sitemap entries while preserving source; optional social URL and resume download work.');

  const realProject = path.resolve(temporary, 'content/projects/first-project.md');
  assert.ok(realProject.startsWith(path.resolve(temporary) + path.sep));
  await rm(realProject);
  succeed(run());
  const writingOnlyHome = await read('dist/index.html');
  assert.match(writingOnlyHome, /class="button button-primary" href="\/writing\/">Read my writing/);
  assert.match(writingOnlyHome, /aria-label="Browse all work"><a class="text-link" href="\/writing\/">All writing/);
  assert.doesNotMatch(writingOnlyHome, />All projects </);
  console.log('PASS: a participant with one real post is directed to their writing, with no empty-project promotion.');
  for (const collection of ['posts', 'projects']) {
    const fixturePath = path.resolve(temporary, 'content', collection);
    assert.ok(fixturePath.startsWith(path.resolve(temporary) + path.sep));
    await rm(fixturePath, { recursive: true });
  }
  succeed(run());
  assert.match(await read('dist/writing/index.html'), /The next story starts here/);
  assert.match(await read('dist/projects/index.html'), /Make room for your next project/);
  console.log('PASS: missing post and project folders produce useful empty pages.');
  console.log('\nAll integration checks passed. Your actual content and dist were not changed.');
} finally {
  const temporaryRoot = path.resolve(root);
  const resolved = path.resolve(temporary);
  if (path.dirname(resolved) !== temporaryRoot || !path.basename(resolved).startsWith('.check-workspace-')) throw new Error('Refusing to clean an unexpected temporary path.');
  await rm(resolved, { recursive: true, force: true });
}
