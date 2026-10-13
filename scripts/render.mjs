export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function readableDate(value) {
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
}

export function makeRenderer(site, href, canonical) {
  const e = escapeHtml;
  const templateBadge = entry => entry.template ? '<span class="template-label">Template · replace with your work</span>' : '';
  const entryUrl = entry => href(`/${entry.collection === 'posts' ? 'posts' : 'projects'}/${entry.slug}/`);
  const tags = entry => entry.tags.map(tag => `<span class="tag">${e(tag)}</span>`).join('');
  const metadata = entry => `<div class="post-meta"><time datetime="${e(entry.date)}">${e(readableDate(entry.date))}</time><span aria-hidden="true"> · </span><span>${entry.readingMinutes} min read</span></div>`;
  const socialLinks = () => [site.github && `<a href="${e(site.github)}">GitHub<span class="sr-only"> profile</span></a>`, site.linkedin && `<a href="${e(site.linkedin)}">LinkedIn<span class="sr-only"> profile</span></a>`, site.email && `<a href="mailto:${e(site.email)}">Email<span class="sr-only"> ${e(site.name)}</span></a>`].filter(Boolean).join('');

  function layout({ title, description = site.description, route = '/', section = '', body, article, noindex = false }) {
    const pageTitle = route === '/' ? `${site.name} — ${site.headline}` : `${title} · ${site.name}`;
    const canonicalUrl = canonical ? canonical(route) : '';
    const navigation = [['/', 'Home'], ['/writing/', 'Writing'], ['/projects/', 'Projects'], ['/about/', 'About'], ['/resume/', 'Resume']];
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(pageTitle)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="author" content="${e(site.name)}">
  <meta name="color-scheme" content="light">
  ${site.templateMode || noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
  ${canonicalUrl ? `<link rel="canonical" href="${e(canonicalUrl)}">` : ''}
  <meta property="og:type" content="${article ? 'article' : 'website'}">
  <meta property="og:title" content="${e(pageTitle)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:site_name" content="${e(site.name)}">
  ${canonicalUrl ? `<meta property="og:url" content="${e(canonicalUrl)}">` : ''}
  ${article ? `<meta property="article:published_time" content="${e(article.date)}T12:00:00Z">` : ''}
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="${e(href('/assets/favicon.svg'))}" type="image/svg+xml">
  <link rel="stylesheet" href="${e(href('/assets/styles.css'))}">
  ${canonical ? `<link rel="alternate" type="application/rss+xml" title="${e(site.name)} — Writing" href="${e(href('/feed.xml'))}">` : ''}
  <script type="module" src="${e(href('/assets/app.js'))}"></script>
</head>
<body data-accent="${e(site.accent)}"${route === '/' ? ' class="home-page"' : ''}>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="${e(href('/'))}" aria-label="${e(site.name)} — home"><span class="brand-mark" aria-hidden="true">${e(site.initials)}</span><span class="brand-name">${e(site.name)}</span></a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" data-enhance hidden>Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Main navigation">${navigation.map(([path, label]) => `<a href="${e(href(path))}"${section === label || route === path ? ' aria-current="page"' : ''}>${label}</a>`).join('')}${site.templateMode ? `<a class="workshop-link" href="${e(href('/workshop/'))}"${section === 'Workshop' ? ' aria-current="page"' : ''}>Workshop <span aria-hidden="true">↗</span></a>` : ''}</nav>
    </div>
  </header>
  ${site.templateMode ? `<aside class="template-banner"><div class="container"><span>This is your starting point. Replace the prompts with your story.</span><a href="${e(href('/setup/'))}">Personalize your site <span aria-hidden="true">→</span></a></div></aside>` : ''}
  <main id="main" tabindex="-1">${body}</main>
  <footer class="site-footer"><div class="footer-inner container"><div><a class="footer-name" href="${e(href('/'))}">${e(site.name)}</a><p>${e(site.role || 'A space for ideas, projects, and progress.')}</p></div><nav aria-label="Social and footer links">${socialLinks()}${canonical ? `<a href="${e(href('/feed.xml'))}">RSS</a>` : ''}${site.templateMode ? `<a href="${e(href('/workshop/'))}">TigerAI workshop</a>` : ''}<a href="#main">Back to top ↑</a></nav></div></footer>
</body>
</html>\n`;
  }

  function card(entry, index = 0) {
    return `<article class="post-card" data-entry data-search="${e([entry.title, entry.description, ...entry.tags].join(' ').toLowerCase())}" data-tags="${e(JSON.stringify(entry.tags))}">
      <a class="card-visual card-visual-${(index % 3) + 1}" href="${e(entryUrl(entry))}" tabindex="-1" aria-hidden="true"><span class="visual-number">${String(index + 1).padStart(2, '0')}</span><span class="visual-label">${entry.collection === 'posts' ? 'Field notes' : 'Selected project'}</span><span class="visual-orbit"></span><span class="visual-dot"></span></a>
      <div class="card-body">${templateBadge(entry)}<div class="card-tags">${tags(entry)}</div><h3 class="post-title"><a href="${e(entryUrl(entry))}">${e(entry.title)}</a></h3><p class="post-description">${e(entry.description)}</p>${metadata(entry)}<a class="post-link" href="${e(entryUrl(entry))}">Read ${entry.collection === 'posts' ? 'story' : 'project'} <span aria-hidden="true">↗</span><span class="sr-only">: ${e(entry.title)}</span></a></div>
    </article>`;
  }

  function writingRow(entry) {
    return `<article class="writing-row" data-entry data-search="${e([entry.title, entry.description, ...entry.tags].join(' ').toLowerCase())}" data-tags="${e(JSON.stringify(entry.tags))}"><div class="writing-date"><time datetime="${e(entry.date)}">${e(readableDate(entry.date))}</time></div><div class="writing-content">${templateBadge(entry)}<h3 class="post-title"><a href="${e(entryUrl(entry))}">${e(entry.title)}</a></h3><p class="post-description">${e(entry.description)}</p><div class="card-tags">${tags(entry)}</div></div><a class="writing-arrow" href="${e(entryUrl(entry))}" aria-label="Read ${e(entry.title)}">↗</a></article>`;
  }

  function empty(collection) {
    return `<div class="empty-state"><h2>${collection === 'posts' ? 'The next story starts here.' : 'Make room for your next project.'}</h2><p>${site.templateMode ? `Add a Markdown file to content/${collection}/, then rebuild to see it here.` : 'Check back soon for new work.'}</p></div>`;
  }

  function home(posts, projects) {
    const featured = [...posts, ...projects].filter(entry => entry.featured).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    const mainRoute = projects.length ? '/projects/' : '/writing/';
    const mainLabel = projects.length ? 'Explore my work' : 'Read my writing';
    const collectionLinks = [
      posts.length && `<a class="text-link" href="${e(href('/writing/'))}">All writing <span aria-hidden="true">↗</span></a>`,
      projects.length && `<a class="text-link" href="${e(href('/projects/'))}">All projects <span aria-hidden="true">↗</span></a>`
    ].filter(Boolean).join('');
    return `<section class="hero container"><div class="hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${e(site.role || 'Your professional space')}</p><h1 class="hero-title">${e(site.headline)}</h1><p class="hero-description">${e(site.description)}</p><div class="hero-actions"><a class="button button-primary" href="${e(href(mainRoute))}">${mainLabel} <span aria-hidden="true">↗</span></a><a class="button button-secondary" href="${e(href('/about/'))}">A little about me <span aria-hidden="true">→</span></a></div></div><aside class="hero-aside" aria-label="Profile introduction"><div class="profile-card"><div class="profile-card-top"><span>THE PERSON BEHIND THE WORK</span><span aria-hidden="true">✳</span></div><div class="profile-monogram" aria-hidden="true">${e(site.initials)}</div><div class="profile-card-bottom"><h2>${e(site.name)}</h2>${site.role ? `<p>${e(site.role)}</p>` : ''}${site.location ? `<span class="profile-location">${e(site.location)}</span>` : ''}</div></div><p class="profile-caption">${site.templateMode ? 'Your name. Your perspective. Your next chapter.' : 'Ideas, projects, and the work along the way.'}</p></aside></section>
    ${featured.length ? `<section class="featured-section container"><div class="section-heading"><div><p class="section-kicker">A GOOD PLACE TO START</p><h2>Selected work<span class="accent-dot">.</span></h2></div><nav class="hero-actions" aria-label="Browse all work">${collectionLinks}</nav></div><div class="card-grid">${featured.map(card).join('')}</div></section>` : ''}
    <section class="recent-section container"><div class="section-heading"><div><p class="section-kicker">THINKING OUT LOUD</p><h2>Recent writing<span class="accent-dot">.</span></h2></div><a class="text-link" href="${e(href('/writing/'))}">All writing <span aria-hidden="true">↗</span></a></div>${posts.length ? `<div class="writing-list">${posts.slice(0, 4).map(writingRow).join('')}</div>` : empty('posts')}</section>
    <section class="about-strip container"><p class="section-kicker">MORE THAN A RESUME</p><h2>A little context goes a long way.</h2><p>${e(site.description)}</p><a class="text-link" href="${e(href('/about/'))}">Meet ${e(site.name)} <span aria-hidden="true">→</span></a></section>`;
  }

  function listing(entries, collection) {
    const isPosts = collection === 'posts';
    const title = isPosts ? 'Writing' : 'Projects';
    const allTags = [...new Set(entries.flatMap(entry => entry.tags))].sort((a, b) => a.localeCompare(b));
    return `<div class="container"><header class="page-header"><p class="eyebrow">${isPosts ? 'NOTES, IDEAS & DISCOVERIES' : 'IDEAS PUT INTO PRACTICE'}</p><h1 class="page-title">${title}<span class="accent-dot">.</span></h1><p class="page-description">${isPosts ? 'A place to share what I am learning, exploring, and making sense of.' : 'A closer look at the questions, process, and work behind each project.'}</p></header>${entries.length ? `<div class="filter-bar" data-enhance hidden><div class="search-field"><label for="search">Search ${title.toLowerCase()}</label><input class="search-input" id="search" type="search" placeholder="Search titles, descriptions, or topics…" autocomplete="off"></div><div class="tag-filters" role="group" aria-label="Filter by topic"><button type="button" class="tag-filter active" data-filter="" aria-pressed="true">All topics</button>${allTags.map(tag => `<button type="button" class="tag-filter" data-filter="${e(tag)}" aria-pressed="false">${e(tag)}</button>`).join('')}</div><p class="results-count" id="results-count" aria-live="polite">${entries.length} ${entries.length === 1 ? 'result' : 'results'}</p></div><div class="${isPosts ? 'writing-list' : 'card-grid'}">${entries.map(isPosts ? writingRow : card).join('')}</div><p id="no-results" class="empty-state" hidden>No matching results. Try another search or choose All topics.</p>` : empty(collection)}</div>`;
  }

  function article(entry) {
    const collectionLabel = entry.collection === 'posts' ? 'Writing' : 'Projects';
    const collectionRoute = entry.collection === 'posts' ? '/writing/' : '/projects/';
    return `<article class="container"><header class="page-header article-header"><a class="back-link" href="${e(href(collectionRoute))}">← ${collectionLabel}</a>${templateBadge(entry)}<div class="card-tags">${tags(entry)}</div><h1 class="page-title">${e(entry.title)}</h1><p class="page-description">${e(entry.description)}</p>${metadata(entry)}</header><div class="article-layout"><aside class="article-sidebar"><p class="section-kicker">ON THIS PAGE</p>${entry.headings.length ? `<nav aria-label="Article contents">${entry.headings.map(heading => `<a href="#${e(heading.id)}">${e(heading.text)}</a>`).join('')}</nav>` : '<p>A short read.</p>'}<button type="button" class="button button-secondary copy-link" data-copy-link data-enhance hidden>Copy page link</button><p class="copy-status" data-copy-status aria-live="polite"></p></aside><div class="prose">${entry.html}<nav class="article-nav" aria-label="Article navigation"><a href="${e(href(collectionRoute))}">← Back to ${collectionLabel.toLowerCase()}</a></nav></div></div></article>`;
  }

  function page(kind, html) {
    const isResume = kind === 'Resume';
    return `<section class="container"><header class="page-header"><p class="eyebrow">${isResume ? 'EXPERIENCE, SKILLS & DIRECTION' : 'THE PERSON BEHIND THE WORK'}</p><h1 class="page-title">${isResume ? 'Resume' : 'About me'}<span class="accent-dot">.</span></h1><p class="page-description">${isResume ? 'A concise view of my experience and the skills I am building.' : e(site.description)}</p>${isResume && site.resumePdf ? `<a class="button button-primary" href="${e(href(`/${site.resumePdf}`))}" download>Download resume PDF <span aria-hidden="true">↓</span></a>` : ''}</header><div class="prose page-prose">${html}</div>${isResume ? '<p class="print-note">You can also use your browser’s Print menu to save this page as a PDF.</p>' : ''}</section>`;
  }

  function notFound() {
    return `<section class="container page-header"><p class="eyebrow">404 · PAGE NOT FOUND</p><h1 class="page-title">This page took a different path.</h1><p class="page-description">The address may have changed, or the page has not been published yet.</p><div class="hero-actions"><a class="button button-primary" href="${e(href('/'))}">Back home</a><a class="button button-secondary" href="${e(href('/writing/'))}">Browse writing</a></div></section>`;
  }

  return { layout, home, listing, article, page, notFound, entryUrl };
}
