import { appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const retrySteps = [
  'Wait a minute, then open Actions → Deploy blog → Run workflow, select main, and click Run workflow.',
  'If the same message appears again, show this message to your workshop helper. Do not change your blog text or create a personal access token.'
];

function result(ok, code, title, detail, steps = [], links = {}) {
  return { ok, code, title, detail, steps, ...links };
}

// The function is read-only. Tests inject fetch so a test never changes GitHub settings.
export async function checkPages({ repository, token, fetchImpl = fetch, timeoutMs = 15000, apiUrl = 'https://api.github.com' } = {}) {
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/.test(repository || '')) {
    return result(false, 'environment', 'GitHub Pages setup could not be checked', 'The repository name is missing or invalid. This check is meant to run inside the supplied Deploy blog workflow.', retrySteps);
  }
  const [owner, repo] = repository.split('/');
  const links = {
    settingsUrl: `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/settings/pages`,
    actionsUrl: `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/actions/workflows/pages.yml`
  };
  const setupSteps = [
    'Open this repository’s Settings → Pages.',
    'Under Build and deployment, change Source to GitHub Actions. Do not choose Deploy from a branch, and do not add a suggested workflow: this template already includes one.',
    'Open Actions → Deploy blog → Run workflow, select main, and click Run workflow. Wait for a green check before opening your website.'
  ];
  if (!token) {
    return result(false, 'authentication', 'GitHub Pages setup could not be checked', 'The automatic GitHub Actions token is missing. The supplied workflow provides this token; you do not need to create one.', retrySteps, links);
  }
  let api;
  try {
    api = new URL(apiUrl);
    if (api.protocol !== 'https:' || api.username || api.password || api.search || api.hash) throw new Error('Invalid API URL');
  } catch {
    return result(false, 'environment', 'GitHub Pages setup could not be checked', 'The GitHub API address is invalid. Ask your workshop helper to check the supplied workflow.', [], links);
  }
  let response;
  let page;
  try {
    response = await fetchImpl(`${api.href.replace(/\/$/, '')}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pages`, {
      method: 'GET',
      redirect: 'error',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (response.status === 200) page = await response.json();
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return result(false, timedOut ? 'timeout' : 'connection', 'GitHub Pages setup could not be checked', timedOut
      ? 'GitHub did not answer the Pages check in time. This does not mean your settings or blog text are wrong.'
      : 'The Pages check could not read a usable response from GitHub. This does not mean your settings or blog text are wrong.', retrySteps, links);
  }
  // Do not print API bodies or exception text: either could contain credentials or untrusted text.
  if (response.status === 404) {
    return result(false, 'missing', 'Enable GitHub Pages for this repository', 'GitHub could not find this repository’s Pages setup (HTTP 404). Usually Pages has not been enabled yet; restricted access can also cause this response.', [
      ...setupSteps,
      'If Source already says GitHub Actions and a new run still shows this message, ask your workshop helper to check repository access and Pages availability.'
    ], links);
  }
  if (response.status === 401 || response.status === 403) {
    return result(false, 'permission', 'GitHub could not read the Pages settings', `GitHub refused the Pages check (HTTP ${response.status}). This does not tell us whether Source is correct.`, [
      retrySteps[0],
      'If it keeps failing, ask your workshop helper to check that the supplied workflow still has pages: read permission and that your organization permits GitHub Pages and Actions. Do not create a personal access token.'
    ], links);
  }
  if (response.status !== 200) {
    return result(false, 'service', 'GitHub Pages setup could not be checked', 'GitHub returned an unsuccessful response. Publishing stopped because the Pages setup could not be verified.', retrySteps, links);
  }
  if (page?.build_type === 'legacy') {
    return result(false, 'source', 'Choose GitHub Actions as the Pages source', 'Pages is currently set to Deploy from a branch. This template builds and publishes through GitHub Actions.', setupSteps, links);
  }
  if (page?.build_type !== 'workflow') {
    return result(false, 'unexpected', 'GitHub Pages setup could not be checked', 'GitHub returned Pages settings in an unexpected format. Publishing stopped because Source could not be verified.', retrySteps, links);
  }
  return result(true, 'ready', 'GitHub Pages is ready', 'Source is GitHub Actions. The workflow can now check, build, and publish your blog.', [], links);
}

export function escapeAnnotation(value) {
  return String(value).replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

function escapeMarkdown(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/[\\`*_{}[\]()#+.!|]/g, '\\$&');
}

export function pagesReport(check) {
  const instructions = check.steps.map((step, index) => `${index + 1}. ${step}`);
  const plain = [check.title, check.detail, ...instructions].join('\n');
  const summary = [
    `## ${check.ok ? '✓' : 'Fix needed:'} ${escapeMarkdown(check.title)}`,
    '', escapeMarkdown(check.detail), '',
    ...check.steps.map((step, index) => `${index + 1}. ${escapeMarkdown(step)}`),
    '',
    ...(check.settingsUrl ? [`[Open this repository’s Pages settings](${check.settingsUrl}) · [Open Deploy blog](${check.actionsUrl})`, ''] : [])
  ].join('\n');
  return { plain, summary, annotation: check.ok ? '' : `::error title=GitHub Pages setup::${escapeAnnotation(plain)}` };
}

async function main() {
  const check = await checkPages({ repository: process.env.GITHUB_REPOSITORY, token: process.env.GITHUB_TOKEN, apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com' });
  const report = pagesReport(check);
  console.log(report.plain);
  if (process.env.GITHUB_ACTIONS === 'true' && report.annotation) console.log(report.annotation);
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, `${report.summary}\n`, 'utf8');
    } catch {
      console.log('The run summary could not be written. Follow the same instructions printed above.');
    }
  }
  if (!check.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
