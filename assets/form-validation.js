// Pure browser-safe validation. Build validation remains authoritative.
const string = value => String(value ?? '').trim();
const required = (value, label) => string(value) ? '' : `Enter ${label}; spaces alone are not enough.`;

export function webAddressError(value, homeAddress = false) {
  const text = string(value);
  if (!text) return '';
  let url;
  try { url = new URL(text); } catch { return 'Enter a complete https:// address, or leave this field blank.'; }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || /[\u0000-\u0020\\]/.test(text)) return 'Use an http:// or https:// address without sign-in details, spaces, or backslashes.';
  if (homeAddress && (url.search || url.hash)) return 'Use your site’s home address without a query (?) or section link (#).';
  return '';
}

export function dateError(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(string(value))) return 'Choose a date with a four-digit year (YYYY-MM-DD).';
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value ? 'Choose a real calendar date.' : '';
}

export function settingsErrors(values, resumePaths = []) {
  const errors = {};
  for (const key of ['name', 'initials', 'headline', 'description']) {
    const error = required(values[key], `your ${key === 'description' ? 'introduction' : key}`);
    if (error) errors[key] = error;
  }
  if (string(values.initials).length > 5) errors.initials = 'Keep your initials to 1–5 characters.';
  const email = string(values.email);
  if (email && !/^[^\s<>"@]+@[^\s<>"@]+\.[^\s<>"@]+$/.test(email)) errors.email = 'Use a full email address such as name@example.com, without mailto:, or leave it blank.';
  for (const key of ['url', 'github', 'linkedin']) {
    const error = webAddressError(values[key], key === 'url');
    if (error) errors[key] = error;
  }
  if (!['teal', 'blue', 'plum'].includes(values.accent)) errors.accent = 'Choose teal, blue, or plum.';
  const pdf = string(values.resumePdf).replace(/^\/(?=assets\/)/, '');
  if (pdf) {
    if (!/^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_. -]+\.pdf$/i.test(pdf) || pdf.includes('..')) errors.resumePdf = 'Use an uploaded PDF path such as /assets/uploads/resume.pdf, or leave it blank.';
    else if (!resumePaths.includes(pdf)) errors.resumePdf = 'This PDF is not in this published site. Upload it first, wait for deployment, then reload this page; or leave the field blank.';
  }
  return errors;
}

export function postErrors(values, publishedSlugs = []) {
  const errors = {};
  for (const key of ['title', 'description', 'tag', 'slug']) {
    const error = required(values[key], key === 'slug' ? 'a filename' : `a ${key === 'description' ? 'summary' : key === 'tag' ? 'topic' : 'title'}`);
    if (error) errors[key] = error;
  }
  const slug = string(values.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = 'Use lowercase letters, numbers, and single hyphens; omit .md.';
  else if (publishedSlugs.includes(slug)) errors.slug = 'A published post already uses this filename. Choose a different name for a new post; edit the existing file in GitHub to update it.';
  const error = dateError(string(values.date));
  if (error) errors.date = error;
  if (!['project', 'reflection', 'explanation'].includes(values.kind)) errors.kind = 'Choose a writing structure.';
  return errors;
}
