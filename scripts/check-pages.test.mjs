import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPages, pagesReport, escapeAnnotation } from './check-pages.mjs';

const token = 'test-only-secret-that-must-never-be-printed';
const defaults = { repository: 'Gloria-Obeng/Tigers-AI-Test', token };
function response(status, body) {
  return async () => ({ status, json: async () => body });
}

test('Pages workflow source passes with hyphenated, mixed-case account and repository names', async () => {
  let called = 0;
  const check = await checkPages({ ...defaults, fetchImpl: async (url, options) => {
    called++;
    assert.equal(url, 'https://api.github.com/repos/Gloria-Obeng/Tigers-AI-Test/pages');
    assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    assert.ok(options.signal instanceof AbortSignal);
    return { status: 200, json: async () => ({ build_type: 'workflow', html_url: 'https://gloria-obeng.github.io/Tigers-AI-Test/' }) };
  } });
  assert.equal(called, 1);
  assert.equal(check.ok, true);
  assert.equal(check.code, 'ready');
  assert.equal(check.settingsUrl, 'https://github.com/Gloria-Obeng/Tigers-AI-Test/settings/pages');
  assert.equal(pagesReport(check).annotation, '');
});

test('legacy main/root publishing stops with exact beginner recovery steps', async () => {
  const check = await checkPages({ ...defaults, fetchImpl: response(200, { build_type: 'legacy', source: { branch: 'main', path: '/' } }) });
  assert.equal(check.ok, false);
  assert.equal(check.code, 'source');
  const { plain, summary, annotation } = pagesReport(check);
  assert.match(plain, /Deploy from a branch/);
  assert.match(plain, /1\. Open this repository’s Settings → Pages/);
  assert.match(plain, /2\. Under Build and deployment, change Source to GitHub Actions/);
  assert.match(plain, /3\. Open Actions → Deploy blog → Run workflow, select main/);
  assert.match(summary, /settings\/pages/);
  assert.match(annotation, /^::error title=GitHub Pages setup::/);
  assert.ok(!annotation.includes('\n'));
});

test('missing Pages setup explains 404, setup steps, and the access ambiguity', async () => {
  const check = await checkPages({ ...defaults, fetchImpl: response(404, { message: token }) });
  assert.equal(check.code, 'missing');
  assert.equal(check.ok, false);
  assert.match(check.detail, /HTTP 404/);
  assert.match(check.detail, /restricted access/);
  assert.match(check.steps.join('\n'), /Source to GitHub Actions/);
  assert.match(check.steps.join('\n'), /Source already says GitHub Actions/);
  assert.ok(!JSON.stringify(pagesReport(check)).includes(token));
});

test('401 and 403 report access problems without misdiagnosing Source or reading the body', async () => {
  for (const status of [401, 403]) {
    const check = await checkPages({ ...defaults, fetchImpl: async () => ({ status, json: async () => { throw new Error('The error body must not be read'); } }) });
    assert.equal(check.code, 'permission');
    assert.match(check.detail, /does not tell us whether Source is correct/);
    assert.match(check.steps.join('\n'), /pages: read/);
    assert.ok(!pagesReport(check).plain.includes('change Source'));
  }
});

test('rate limits, server errors, failed network, and unreadable JSON offer retry without leaking details', async () => {
  for (const status of [429, 500, 502, 503]) {
    const check = await checkPages({ ...defaults, fetchImpl: response(status, { message: token }) });
    assert.equal(check.ok, false);
    assert.equal(check.code, 'service');
    assert.match(check.steps[0], /Wait a minute/);
    assert.ok(!JSON.stringify(pagesReport(check)).includes(token));
  }
  for (const fetchImpl of [
    async () => { throw new Error(`private exception ${token}\n::error::injected`); },
    async () => ({ status: 200, json: async () => { throw new SyntaxError(token); } })
  ]) {
    const check = await checkPages({ ...defaults, fetchImpl });
    assert.equal(check.code, 'connection');
    assert.match(check.detail, /does not mean your settings or blog text are wrong/);
    assert.ok(!JSON.stringify(pagesReport(check)).includes(token));
    assert.ok(!JSON.stringify(pagesReport(check)).includes('injected'));
  }
});

test('request timeout aborts and returns a useful retry message', async () => {
  let aborted = false;
  const check = await checkPages({ ...defaults, timeoutMs: 5, fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
    const hold = setTimeout(() => reject(new Error('test guard elapsed')), 1000);
    signal.addEventListener('abort', () => { aborted = true; clearTimeout(hold); reject(signal.reason); }, { once: true });
  }) });
  assert.equal(aborted, true);
  assert.equal(check.code, 'timeout');
  assert.equal(check.ok, false);
  assert.match(check.detail, /did not answer/);
});

test('unknown payloads fail closed without inventing a source diagnosis', async () => {
  for (const body of [null, [], {}, { build_type: 'unexpected-source' }, { source: { branch: 'main', path: '/' } }]) {
    const check = await checkPages({ ...defaults, fetchImpl: response(200, body) });
    assert.equal(check.code, 'unexpected');
    assert.equal(check.ok, false);
    assert.match(check.detail, /unexpected format/);
    assert.ok(!pagesReport(check).plain.includes('currently set to Deploy from a branch'));
  }
});

test('missing authentication and invalid environment stop before any request', async () => {
  const fetchImpl = async () => { throw new Error('must not request'); };
  assert.equal((await checkPages({ repository: defaults.repository, fetchImpl })).code, 'authentication');
  for (const repository of ['', 'bad/repo\n::error::injected', '../repo', 'owner/path/repo']) {
    const check = await checkPages({ ...defaults, repository, fetchImpl });
    assert.equal(check.code, 'environment');
    assert.ok(!pagesReport(check).plain.includes('injected'));
  }
  for (const apiUrl of ['http://api.github.com', 'https://name:password@api.github.com', 'invalid']) {
    assert.equal((await checkPages({ ...defaults, apiUrl, fetchImpl })).code, 'environment');
  }
});

test('report text escapes workflow-command and Markdown controls', () => {
  assert.equal(escapeAnnotation('100%\r\n::notice::injected'), '100%25%0D%0A::notice::injected');
  const report = pagesReport({ ok: false, title: '<script>**title**', detail: '100%\n::notice::injected', steps: ['[unsafe](example)'] });
  assert.ok(!report.annotation.includes('\n'));
  assert.match(report.annotation, /100%25%0A/);
  assert.ok(!report.summary.includes('<script>'));
  assert.ok(report.summary.includes('&lt;script&gt;'));
  assert.ok(report.summary.includes('\\[unsafe\\]\\(example\\)'));
});
