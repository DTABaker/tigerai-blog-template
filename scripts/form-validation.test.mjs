import test from 'node:test';
import assert from 'node:assert/strict';
import { settingsErrors, postErrors, dateError, webAddressError } from '../assets/form-validation.js';
const settings = { name:'Your Name', initials:'YN', headline:'Your focus', description:'Your introduction', accent:'teal' };
const post = { title:'Your title', description:'Your summary', tag:'Your topic', slug:'your-title', kind:'project', date:'2026-10-12' };

test('settings accept optional blanks, Unicode, punctuation, and uploaded PDF paths', () => {
  assert.deepEqual(settingsErrors(settings), {});
  assert.deepEqual(settingsErrors({...settings, name:'José “Q”', description:'A colon: and\na new line.', resumePdf:'/assets/uploads/cv.pdf'}, ['assets/uploads/cv.pdf']), {});
});
test('settings stop unusable names, emails, URLs, and missing PDFs before download', () => {
  assert.ok(settingsErrors({...settings, name:'   '}).name);
  assert.ok(settingsErrors({...settings, initials:'TOOLONG'}).initials);
  assert.ok(settingsErrors({...settings, email:'student@localhost'}).email);
  for (const url of ['javascript:alert(1)', 'ftp://example.com', 'https://person:example@example.com', 'https://example.com/a b']) assert.ok(webAddressError(url));
  assert.ok(settingsErrors({...settings, url:'https://example.com/#about'}).url);
  assert.ok(settingsErrors({...settings, url:'https://example.com/?query=1'}).url);
  assert.ok(settingsErrors({...settings, resumePdf:'/assets/uploads/missing.pdf'}).resumePdf);
  assert.ok(settingsErrors({...settings, resumePdf:'../private.pdf'}).resumePdf);
  assert.equal(webAddressError('https://example.com/profile?view=public'), '');
});
test('post drafts enforce real dates, usable unique names, and nonblank metadata', () => {
  assert.deepEqual(postErrors(post), {});
  assert.ok(postErrors(post, ['your-title']).slug);
  assert.ok(postErrors({...post, title:'   '}).title);
  for (const slug of ['bad name','double--dash','UPPER','a.md','../a']) assert.ok(postErrors({...post, slug}).slug);
  for (const date of ['2026-02-30','2025-02-29','10000-01-01','2026-1-1']) assert.ok(dateError(date));
  assert.equal(dateError('2024-02-29'), '');
});
