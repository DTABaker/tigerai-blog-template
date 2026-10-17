import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, readdir, mkdir, stat, lstat, copyFile, rename, rm, access } from 'node:fs/promises';
import MarkdownIt from 'markdown-it';
import { LineCounter, parseDocument } from 'yaml';
import { escapeHtml, makeRenderer } from './render.mjs';
import { renderWorkshop } from './workshop-page.mjs';
import { renderSetup } from './setup-page.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
const stage = path.join(root, `.build-stage-${process.pid}-${Date.now()}`);
const backup = path.join(root, `.build-backup-${process.pid}-${Date.now()}`);
const e = escapeHtml;
const knownKeys = new Set(['name', 'initials', 'headline', 'description', 'role', 'location', 'email', 'url', 'github', 'linkedin', 'resumePdf', 'accent', 'templateMode']);
const entryKeys = new Set(['title', 'description', 'date', 'tags', 'featured', 'draft', 'template']);
let outputReplaced = false;

function fail(file, field, message, location = {}) {
  const error = new Error(`${file}${field ? ` → ${field}` : ''}${location.line ? ` (line ${location.line}, column ${location.column})` : ''}: ${message}`);
  Object.assign(error, { file, ...location });
  throw error;
}

function yaml(text, filename, lineOffset = 0) {
  const lineCounter = new LineCounter();
  const document = parseDocument(text, { uniqueKeys: true, prettyErrors: false, strict: true, lineCounter });
  if (document.errors.length) {
    const problem = document.errors[0];
    const position = lineCounter.linePos(problem.pos[0]);
    // Parser excerpts can contain personal settings. Report location and repair instructions only.
    const reason = problem.code === 'DUPLICATE_KEY' ? 'A setting name appears more than once.'
      : /Missing closing ["']quote/.test(problem.message) ? 'A quotation mark is missing, or a quoted value continues on an unindented line.'
      : 'The settings format has a punctuation or indentation problem.';
    const repair = filename === 'content/site.yml'
      ? 'Keep each quoted value on one line with an opening and closing quotation mark. The easiest repair is to use Personalize your site (/setup/) on your latest working site, check every field, and download fresh settings; then replace the complete contents of content/site.yml. If your site has not published yet, use the workshop demo studio and fill in your own details.'
      : 'Keep quoted titles and descriptions on one line. Check that each setting has a colon and that the opening and closing --- lines are present. You can use the post builder in Personalize your site (/setup/) to make a fresh file.';
    fail(filename, 'YAML', `${reason} ${repair}`, { line: position.line + lineOffset, column: position.col });
  }
  let value;
  try { value = document.toJS({ maxAliasCount: 20 }); } catch { fail(filename, 'YAML', 'The settings contain unsupported references. Use plain text values in quotation marks; the setup studio can create a fresh file.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(filename, 'YAML', 'Expected named settings, one per line.');
  return value;
}

function textField(value, filename, field, { required = false, fallback = '' } = {}) {
  if (value === undefined || value === null) {
    if (required) fail(filename, field, 'Add a nonempty value.');
    return fallback;
  }
  if (typeof value !== 'string') fail(filename, field, 'Use text in quotation marks.');
  const result = value.trim();
  if (required && !result) fail(filename, field, 'Add a nonempty value.');
  return result;
}

function booleanField(value, filename, field, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') fail(filename, field, 'Use true or false without quotation marks.');
  return value;
}

function dateField(value, filename, field = 'date') {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(filename, field, 'Use a date in YYYY-MM-DD format, such as "2026-01-15".');
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) fail(filename, field, `"${value}" is not a real calendar date.`);
  return value;
}

function absoluteUrl(value, filename, field) {
  if (!value) return '';
  let url;
  try { url = new URL(value); } catch { fail(filename, field, 'Use a complete https:// address, or leave this blank.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || /[\u0000-\u0020\\]/.test(value)) fail(filename, field, 'Only complete http:// or https:// addresses without credentials or whitespace are allowed.');
  return url.toString();
}

function safeLink(value, filename) {
  const text = String(value).trim();
  if (/^[\\]|^\/\/|[\u0000-\u001f\u007f]/.test(text)) fail(filename, 'link', `Unsafe link "${text}". Use an https:// address or a site path.`);
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(text);
  if (scheme && !['http', 'https', 'mailto', 'tel'].includes(scheme[1].toLowerCase())) fail(filename, 'link', `Unsafe URL scheme "${scheme[1]}:". Use https://, mailto:, or a site path.`);
  return true;
}

async function source(filename) {
  try { return (await readFile(path.join(root, filename), 'utf8')).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); }
  catch (error) { if (error.code === 'ENOENT') fail(filename, '', 'File is missing. Restore it or add it before building.'); throw error; }
}

async function checkSettingsLocation() {
  const misplaced = [];
  const excludedFolders = new Set(['node_modules', 'dist']);
  const settingsName = /^site(?:[ _-]*(?:\(\d+\)|\d+|copy(?:[ _-]*\(\d+\))?))?\.ya?ml(?:\.txt)?$/i;
  async function walk(folder = '') {
    const entries = await readdir(path.join(root, folder), { withFileTypes: true });
    for (const entry of entries) {
      const filename = path.posix.join(folder, entry.name);
      if ((entry.isFile() || entry.isSymbolicLink()) && settingsName.test(entry.name) && filename !== 'content/site.yml') misplaced.push(filename);
      // Search ordinary folders, including accidental outer folders. Dirents do not follow symlinks.
      if (entry.isDirectory() && !entry.isSymbolicLink() && !entry.name.startsWith('.') && !excludedFolders.has(entry.name.toLowerCase())) await walk(filename);
    }
  }
  await walk();
  if (misplaced.length) {
    misplaced.sort();
    fail(misplaced[0], 'settings file location', `Found settings outside the one supported location: ${misplaced.map(filename => `"${filename}"`).join(', ')}. The blog reads only content/site.yml. Open the file with the settings you want, copy all of its text into content/site.yml, and verify the saved text there. Then remove the extra settings file(s) listed above. Keep the filename exactly site.yml inside the content folder; do not keep a numbered download such as site (1).yml. No settings files were changed automatically.`);
  }
  if (!(await exists(path.join(root, 'content/site.yml')))) fail('content/site.yml', 'settings file location', 'The required settings file is missing. In GitHub, open the content folder and create a file named exactly site.yml, then paste the complete settings from your downloaded file or restore the supplied template. The final path must be content/site.yml; a file at the repository top level will not work.');
}

async function readSite() {
  const filename = 'content/site.yml';
  await checkSettingsLocation();
  const data = yaml(await source(filename), filename);
  for (const key of Object.keys(data)) if (!knownKeys.has(key)) fail(filename, key, 'Unknown setting. Check the spelling against the supplied site.yml template.');
  const site = {};
  for (const key of ['name', 'initials', 'headline', 'description']) site[key] = textField(data[key], filename, key, { required: true });
  for (const key of ['role', 'location', 'email', 'url', 'github', 'linkedin', 'resumePdf']) site[key] = textField(data[key], filename, key);
  if (site.initials.length > 5) fail(filename, 'initials', 'Keep this to 1–5 characters for the profile mark.');
  if (site.email && !/^[^\s<>"@]+@[^\s<>"@]+\.[^\s<>"@]+$/.test(site.email)) fail(filename, 'email', 'Use a valid email address without mailto:, or leave this blank.');
  for (const key of ['url', 'github', 'linkedin']) site[key] = absoluteUrl(site[key], filename, key);
  site.accent = textField(data.accent, filename, 'accent', { fallback: 'teal' });
  if (!['teal', 'blue', 'plum'].includes(site.accent)) fail(filename, 'accent', 'Choose teal, blue, or plum.');
  site.templateMode = booleanField(data.templateMode, filename, 'templateMode', true);
  if (site.resumePdf) {
    site.resumePdf = site.resumePdf.replace(/^\/(?=assets\/)/, '');
    if (!/^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_. -]+\.pdf$/i.test(site.resumePdf) || site.resumePdf.includes('..')) fail(filename, 'resumePdf', 'Use a PDF inside assets/, for example "assets/resume.pdf", or leave this blank.');
    try { if (!(await stat(path.join(root, site.resumePdf))).isFile()) throw new Error(); } catch { fail(filename, 'resumePdf', `The file "${site.resumePdf}" was not found. Upload it first or leave this blank.`); }
  }
  return site;
}

function markdown(text, filename, href, { doc = false } = {}) {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false, breaks: false });
  md.validateLink = value => safeLink(value, filename);
  const headings = [];
  const usedIds = new Set(['main', 'site-nav', 'copy-status']);
  const tokens = md.parse(text, {});
  const rewrite = value => {
    safeLink(value, filename);
    if (value.startsWith('/') && !value.startsWith('//')) return href(value);
    if (doc && !/^[a-z][a-z\d+.-]*:/i.test(value)) {
      const match = /^(?:\.\/)?([A-Za-z0-9_-]+)\.md(#[^\s]*)?$/.exec(value);
      if (match) return href(`/workshop/${match[1].toLowerCase()}/${match[2] || ''}`);
      const template = /^(?:\.\.\/)?templates\/([A-Za-z0-9_.-]+\.md)(#[^\s]*)?$/.exec(value);
      if (template) return href(`/workshop/templates/${template[1]}${template[2] || ''}`);
      if (value === '../content/site.yml' || value === 'content/site.yml') return href('/setup/');
    }
    return value;
  };
  const visit = token => {
    for (const attribute of ['href', 'src']) {
      const current = token.attrGet(attribute);
      if (current !== null) token.attrSet(attribute, rewrite(current));
    }
    if (token.type === 'image') token.attrSet('loading', 'lazy');
    for (const child of token.children || []) visit(child);
  };
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type === 'heading_open') {
      const text = (tokens[index + 1]?.children || []).map(child => child.content || '').join('');
      const base = text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      let id = base; let suffix = 2;
      while (usedIds.has(id)) id = `${base}-${suffix++}`;
      usedIds.add(id);
      token.attrSet('id', id);
      if (token.tag === 'h2') headings.push({ id, text });
    }
    visit(token);
  }
  return { html: md.renderer.render(tokens, md.options, {}), headings, readingMinutes: Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220)) };
}

async function readCollection(collection, href, today, includeTemplates) {
  const folder = `content/${collection}`;
  let folderNames;
  try { folderNames = await readdir(path.join(root, folder)); }
  catch (error) { if (error.code === 'ENOENT') folderNames = []; else throw error; }
  const names = folderNames.filter(name => name.endsWith('.md')).sort();
  const slugs = new Set();
  const entries = [];
  let excluded = 0;
  let excludedTemplates = 0;
  for (const name of names) {
    const filename = `${folder}/${name}`;
    const slug = name.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(filename, 'filename', 'Use lowercase words separated by hyphens, such as my-first-post.md.');
    if (slugs.has(slug.toLowerCase())) fail(filename, 'filename', `Duplicate URL slug "${slug}".`);
    slugs.add(slug.toLowerCase());
    const text = await source(filename);
    const match = /^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/.exec(text);
    if (!match) fail(filename, 'front matter', 'Start with a --- line, add the title/date/settings, then close with another --- line.');
    const data = yaml(match[1], filename, 1);
    for (const key of Object.keys(data)) if (!entryKeys.has(key)) fail(filename, key, 'Unknown front matter field. Use title, description, date, tags, featured, draft, or template.');
    const entry = { collection, slug, title: textField(data.title, filename, 'title', { required: true }), description: textField(data.description, filename, 'description', { required: true }), date: dateField(data.date, filename) };
    if (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string' || !tag.trim())) fail(filename, 'tags', 'Use a list of quoted topics, such as ["Learning", "Projects"], or [].');
    entry.tags = [...new Set(data.tags.map(tag => tag.trim()))];
    for (const key of ['featured', 'draft', 'template']) entry[key] = booleanField(data[key], filename, key);
    if (entry.draft || entry.date > today) { excluded += 1; continue; }
    if (entry.template && !includeTemplates) { excludedTemplates += 1; continue; }
    if (!match[2].trim()) fail(filename, 'body', 'Add some Markdown below the closing --- line.');
    Object.assign(entry, markdown(match[2], filename, href));
    entries.push(entry);
  }
  entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return { entries, excluded, excludedTemplates };
}

async function publicFiles(folder, destinationFolder) {
  const results = [];
  async function walk(relative = '') {
    const entries = await readdir(path.join(root, folder, relative), { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'Thumbs.db') continue;
      const next = path.posix.join(relative.replace(/\\/g, '/'), entry.name);
      if (entry.isSymbolicLink()) fail(path.posix.join(folder, next), '', 'Symbolic links are not allowed in public files. Copy the actual file instead.');
      if (entry.isDirectory()) await walk(next);
      else if (entry.isFile()) results.push({ source: path.join(root, folder, next), target: path.posix.join(destinationFolder, next) });
    }
  }
  await walk();
  return results;
}

async function exists(filename) { try { await access(filename); return true; } catch { return false; } }

async function renameWithRetry(from, to) {
  // Windows file indexers can briefly hold a freshly written directory open.
  for (let attempt = 0; ; attempt += 1) {
    try { return await rename(from, to); }
    catch (error) {
      if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code) || attempt >= 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }
}

function verifyLocalLinks(outputs, publicFileList, base) {
  const available = new Set([...outputs.keys(), ...publicFileList.map(file => file.target)]);
  const decodeAttribute = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  for (const [filename, html] of outputs) {
    if (!filename.endsWith('.html')) continue;
    const pageUrl = `https://local.invalid${base}/${filename}`;
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = decodeAttribute(match[1]);
      if (/^(?:https?:|mailto:|tel:)/i.test(value)) continue;
      let url;
      try { url = new URL(value, pageUrl); } catch { fail(filename, 'link', `Invalid address "${value}".`); }
      if (!url.pathname.startsWith(`${base}/`)) fail(filename, 'link', `"${value}" leaves the site's deployment path. Use a site-root path such as /assets/uploads/image.jpg in your Markdown.`);
      let target;
      try { target = decodeURIComponent(url.pathname.slice(base.length + 1)); } catch { fail(filename, 'link', `Invalid encoding in "${value}".`); }
      if (!target || target.endsWith('/')) target += 'index.html';
      if (!available.has(target)) fail(filename, 'link', `"${value}" points to a missing page or file. Check the filename and upload the asset before linking to it.`);
      if (url.hash && outputs.has(target) && target.endsWith('.html')) {
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { fail(filename, 'link', `Invalid anchor in "${value}".`); }
        if (!outputs.get(target).includes(`id="${e(id)}"`)) fail(filename, 'link', `"${value}" points to a missing heading. Check the heading name after #.`);
      }
    }
  }
}

async function cleanGeneratedDirectory(filename) {
  if (path.dirname(filename) !== path.resolve(root) || !/^\.build-(?:stage|backup)-\d+-\d+$/.test(path.basename(filename))) throw new Error('Refusing to remove a directory outside the generated build workspace.');
  await rm(filename, { recursive: true, force: true });
}

async function build() {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22 or newer is required. Install Node.js 22 LTS, then try again.');
  const site = await readSite();
  const address = process.env.SITE_URL?.trim() || site.url;
  let base = '';
  let origin = '';
  if (address) {
    const url = new URL(absoluteUrl(address, process.env.SITE_URL ? 'SITE_URL environment variable' : 'content/site.yml', 'url'));
    if (url.search || url.hash) fail('content/site.yml / SITE_URL', 'url', 'Use the site home address without a query string or #fragment.');
    base = url.pathname.replace(/\/+$/, '');
    origin = url.origin;
  }
  const href = route => `${base}/${String(route).replace(/^\/+/, '')}`;
  const canonical = origin ? route => `${origin}${href(route)}` : null;
  const today = process.env.BUILD_DATE ? dateField(process.env.BUILD_DATE, 'BUILD_DATE environment variable') : new Date().toISOString().slice(0, 10);
  const [postsResult, projectsResult, aboutSource, resumeSource, assets, docFiles, templateFiles] = await Promise.all([
    readCollection('posts', href, today, site.templateMode), readCollection('projects', href, today, site.templateMode), source('content/about.md'), source('content/resume.md'), publicFiles('assets', 'assets'), publicFiles('docs', 'workshop'), publicFiles('templates', 'workshop/templates')
  ]);
  const posts = postsResult.entries;
  const projects = projectsResult.entries;
  const render = makeRenderer(site, href, canonical);
  const outputs = new Map();
  const routes = [];
  function page(route, properties) {
    const filename = route === '/404.html' ? '404.html' : `${route.replace(/^\//, '')}index.html`;
    if (outputs.has(filename)) fail(filename, '', 'Two pages have the same destination URL.');
    outputs.set(filename, render.layout({ ...properties, route }));
    if (route !== '/404.html' && !properties.noindex) routes.push({ route, date: properties.article?.date });
  }
  page('/', { title: 'Home', body: render.home(posts, projects) });
  page('/writing/', { title: 'Writing', section: 'Writing', body: render.listing(posts, 'posts') });
  page('/projects/', { title: 'Projects', section: 'Projects', body: render.listing(projects, 'projects') });
  page('/about/', { title: 'About', section: 'About', body: render.page('About', markdown(aboutSource, 'content/about.md', href).html) });
  page('/resume/', { title: 'Resume', section: 'Resume', body: render.page('Resume', markdown(resumeSource, 'content/resume.md', href).html) });
  for (const entry of [...posts, ...projects]) page(`/${entry.collection}/${entry.slug}/`, { title: entry.title, description: entry.description, section: entry.collection === 'posts' ? 'Writing' : 'Projects', body: render.article(entry), article: entry });
  page('/workshop/', { title: 'TigerAI workshop', section: 'Workshop', body: renderWorkshop({ site, href }), noindex: true });
  page('/setup/', { title: 'Personalize your site', section: 'Workshop', body: renderSetup({ site, href, postSlugs: posts.map(entry => entry.slug), resumePaths: assets.filter(file => file.target.toLowerCase().endsWith('.pdf')).map(file => file.target) }), noindex: true });
  page('/404.html', { title: 'Page not found', body: render.notFound(), noindex: true });
  for (const file of docFiles.filter(file => file.target.endsWith('.md'))) {
    const stem = path.basename(file.target, '.md').toLowerCase();
    const text = await readFile(file.source, 'utf8');
    const title = /^#\s+(.+)$/m.exec(text)?.[1] || stem;
    page(`/workshop/${stem}/`, { title, section: 'Workshop', noindex: true, body: `<section class="container"><header class="page-header"><a class="back-link" href="${e(href('/workshop/'))}">← Workshop home</a><p class="eyebrow">TIGERAI WORKSHOP GUIDE</p></header><div class="prose page-prose workshop-document">${markdown(text, `docs/${path.basename(file.source)}`, href, { doc: true }).html}</div></section>` });
  }
  outputs.set('.nojekyll', '');
  if (canonical) {
    outputs.set('feed.xml', `<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${e(site.name)} — Writing</title><link>${e(canonical('/'))}</link><description>${e(site.description)}</description><language>en</language><atom:link href="${e(canonical('/feed.xml'))}" rel="self" type="application/rss+xml"/>${posts.map(entry => `<item><title>${e(entry.title)}</title><link>${e(canonical(`/posts/${entry.slug}/`))}</link><guid isPermaLink="true">${e(canonical(`/posts/${entry.slug}/`))}</guid><description>${e(entry.description)}</description><pubDate>${new Date(`${entry.date}T12:00:00Z`).toUTCString()}</pubDate>${entry.tags.map(tag => `<category>${e(tag)}</category>`).join('')}</item>`).join('')}</channel></rss>\n`);
    outputs.set('sitemap.xml', `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(({ route, date }) => `<url><loc>${e(canonical(route))}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`).join('')}</urlset>\n`);
  }
  outputs.set('robots.txt', site.templateMode ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${canonical ? `Sitemap: ${canonical('/sitemap.xml')}\n` : ''}`);
  verifyLocalLinks(outputs, [...assets, ...docFiles, ...templateFiles], base);
  // Write only validated, public inputs. Source content/ is never copied.
  await mkdir(stage);
  for (const [filename, text] of outputs) {
    const target = path.join(stage, filename);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, text, 'utf8');
  }
  for (const file of [...assets, ...docFiles, ...templateFiles]) {
    const target = path.join(stage, file.target);
    if (await exists(target)) fail(file.target, '', 'A public file would overwrite a generated page. Rename the source file.');
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(file.source, target);
  }
  // Keep the previous good dist until the entire new build is ready.
  const previousExists = await exists(destination);
  if (previousExists) {
    if (!(await lstat(destination)).isDirectory() || (await lstat(destination)).isSymbolicLink()) fail('dist', '', 'Expected a regular build directory. Move the conflicting file or link before building.');
    await renameWithRetry(destination, backup);
  }
  try { await renameWithRetry(stage, destination); outputReplaced = true; }
  catch (error) { if (previousExists) await renameWithRetry(backup, destination); throw error; }
  if (previousExists) await cleanGeneratedDirectory(backup);
  console.log(`Built ${outputs.size} generated files in dist/ (${posts.length} posts, ${projects.length} projects).`);
  console.log(`Excluded ${postsResult.excluded + projectsResult.excluded} draft or future-dated entries. Build date: ${today} (UTC).`);
  if (!site.templateMode) console.log(`Excluded ${postsResult.excludedTemplates + projectsResult.excludedTemplates} template entries because workshop mode is off. Their source files are unchanged.`);
  console.log(canonical ? `Public address: ${canonical('/')}` : 'No site URL set: canonical links, RSS, and sitemap are omitted until GitHub Pages supplies the address.');
  if (site.templateMode) console.log('Template mode is on: search engines are asked not to index this starter. Turn it off after replacing the placeholders.');
}

const previousOutputExists = (await lstat(destination).catch(() => null))?.isDirectory() && await exists(path.join(destination, 'index.html'));
try { await build(); }
catch (error) {
  if (await exists(stage)) await cleanGeneratedDirectory(stage);
  if (process.env.GITHUB_ACTIONS === 'true') {
    const escapeData = value => String(value).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    const escapeProperty = value => escapeData(value).replace(/:/g, '%3A').replace(/,/g, '%2C');
    const properties = ['title=Blog needs one correction'];
    if (error.file) properties.push(`file=${escapeProperty(error.file)}`, `line=${error.line || 1}`, `col=${error.column || 1}`);
    console.error(`::error ${properties.join(',')}::${escapeData(error.message)}`);
  }
  const outcome = outputReplaced ? 'The new dist/ output was created, but final cleanup did not finish.'
    : previousOutputExists && await exists(path.join(destination, 'index.html')) ? 'Your existing dist/ output has been kept.'
    : 'No new dist/ output was published. If a website is already live, this failed build does not replace it.';
  console.error(`\nBuild stopped. ${error.message}\n${outcome}\nFix the item above and commit the correction in GitHub to try again. For a local preview, run npm run build again.\n`);
  process.exitCode = 1;
}
