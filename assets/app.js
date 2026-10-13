import { settingsErrors, postErrors } from './form-validation.js';
// Progressive enhancement only: the generated blog remains readable without JavaScript.
(() => {
  'use strict';
  document.querySelectorAll('[data-enhance]').forEach(el => { el.hidden = false; });
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    navToggle.hidden = false;
    document.documentElement.classList.add('nav-ready');
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  const search = document.getElementById('search');
  if (search) {
    const entries = [...document.querySelectorAll('[data-entry]')];
    const filters = [...document.querySelectorAll('[data-filter]')];
    let selected = '';
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      entries.forEach(entry => {
        let tags = [];
        try { tags = JSON.parse(entry.dataset.tags || '[]'); } catch { /* malformed markup stays searchable */ }
        const matchesTag = selected === '' || tags.some(tag => tag.toLocaleLowerCase() === selected.toLocaleLowerCase());
        entry.hidden = !(matchesTag && (entry.dataset.search || entry.textContent).toLocaleLowerCase().includes(query));
        if (!entry.hidden) count++;
      });
      const counter = document.getElementById('results-count');
      if (counter) counter.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
      const empty = document.getElementById('no-results');
      if (empty) empty.hidden = count !== 0;
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
    };
    search.addEventListener('input', update);
    filters.forEach(button => button.addEventListener('click', () => { selected = button.dataset.filter; update(); }));
    update();
  }

  document.querySelectorAll('[data-copy-link]').forEach(button => {
    button.addEventListener('click', async () => {
      const status = document.getElementById('copy-status') || button.nextElementSibling;
      try {
        if (!navigator.clipboard) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(location.href);
        if (status) status.textContent = 'Link copied.';
      } catch {
        if (status) status.textContent = 'Select and copy the address from your browser’s address bar.';
      }
    });
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));

  const stepInputs = [...document.querySelectorAll('[data-step]')];
  if (stepInputs.length) {
    const storageKey = `tigerai-workshop-v1:${location.pathname}`;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* checklist still works without storage */ }
    const update = () => {
      const count = stepInputs.filter(input => input.checked).length;
      document.getElementById('workshop-progress').textContent = `${count} of ${stepInputs.length} steps complete`;
      document.getElementById('workshop-meter').value = count;
      try { localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(stepInputs.map(input => [input.dataset.step, input.checked])))); } catch { /* storage is optional */ }
    };
    stepInputs.forEach(input => { input.checked = saved[input.dataset.step] === true; input.addEventListener('change', update); });
    document.getElementById('reset-progress')?.addEventListener('click', () => { stepInputs.forEach(input => { input.checked = false; }); update(); });
    update();
  }

  function download(filename, text, mime) {
    const url = URL.createObjectURL(new Blob([text], {type: mime}));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  const yamlString = value => JSON.stringify(String(value ?? ''));
  const validateForm = (form, errors, status) => {
    for (const field of form.elements) {
      if (!field.setCustomValidity) continue;
      field.setCustomValidity(errors[field.name] || '');
    }
    const invalid = [...form.elements].find(field => field.willValidate && !field.validity.valid);
    if (invalid) {
      const details = invalid.closest('details');
      if (details) details.open = true;
      status.textContent = invalid.validationMessage;
      invalid.focus();
      form.reportValidity();
      return false;
    }
    return true;
  };
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    const liveFields = ['name','initials','role','headline','description'];
    const updatePreview = () => {
      liveFields.forEach(key => { document.getElementById(`preview-${key}`).textContent = settingsForm.elements[key].value; });
      document.getElementById('mini-preview').dataset.accent = settingsForm.elements.accent.value;
    };
    settingsForm.addEventListener('input', event => { event.target.setCustomValidity?.(''); updatePreview(); });
    settingsForm.addEventListener('submit', event => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(settingsForm));
      const status = document.getElementById('settings-status');
      const pdfs = JSON.parse(settingsForm.dataset.resumePaths || '[]');
      if (!validateForm(settingsForm, settingsErrors(values, pdfs), status)) return;
      const keys = ['name','initials','headline','description','role','location','email','url','github','linkedin','resumePdf','accent'];
      const content = '# Your personal blog settings. Keep the field names; edit the values.\n# Upload this file as content/site.yml in your GitHub repository.\n' + keys.map(key => `${key}: ${yamlString(settingsForm.elements[key].value.trim())}`).join('\n') + `\ntemplateMode: ${settingsForm.elements.templateMode.checked}\n`;
      download('site.yml', content, 'text/yaml;charset=utf-8');
      document.getElementById('settings-status').textContent = 'Your file is ready. Upload site.yml into your repository’s content folder to apply it.';
    });
  }
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('input', event => event.target.setCustomValidity?.(''));
    const now = new Date();
    postForm.elements.date.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    let slugEdited = false;
    postForm.elements.slug.addEventListener('input', () => { slugEdited = true; });
    postForm.elements.title.addEventListener('input', () => {
      if (!slugEdited) postForm.elements.slug.value = postForm.elements.title.value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    });
    const structures = {
      project: '## The question or problem\n\n[Describe the context and why it mattered.]\n\n## My contribution\n\n[Explain your role. Separate your work from team contributions.]\n\n## The process\n\n[Explain your choices and what you did.]\n\n## The result\n\n[Describe the outcome and link to evidence. Be clear about limitations.]\n\n## What I learned\n\n[Explain what changed in your understanding and what you would try next.]\n\n## Sources and acknowledgments\n\n[Credit collaborators and link to any sources you used.]\n',
      reflection: '## What I set out to learn\n\n[Describe your question or goal.]\n\n## What I tried\n\n[Explain the exercise, course, reading, or experiment.]\n\n## What changed in my understanding\n\n[Use a concrete example. Distinguish what you know from what is uncertain.]\n\n## What I would do next\n\n[Choose a practical next step.]\n\n## Sources and acknowledgments\n\n[Link to resources and credit anyone whose work helped you.]\n',
      explanation: '## The central idea\n\n[Explain the idea in plain language and say who this explanation is for.]\n\n## A useful example\n\n[Walk through one accurate example. Label any hypothetical example clearly.]\n\n## Where this explanation has limits\n\n[Clarify assumptions, exceptions, and uncertainty.]\n\n## Why it matters\n\n[Connect the idea to a real question or application.]\n\n## Sources\n\n[Link to authoritative material you have read and checked.]\n'
    };
    postForm.addEventListener('submit', event => {
      event.preventDefault();
      const values = new FormData(postForm);
      const status = document.getElementById('post-status');
      const slugs = JSON.parse(postForm.dataset.existingSlugs || '[]');
      if (!validateForm(postForm, postErrors(Object.fromEntries(values), slugs), status)) return;
      const front = `---\ntitle: ${yamlString(values.get('title'))}\ndescription: ${yamlString(values.get('description'))}\ndate: ${yamlString(values.get('date'))}\ntags: [${yamlString(values.get('tag'))}]\nfeatured: ${postForm.elements.featured.checked}\ndraft: true\ntemplate: true\n---\n\n`;
      download(`${values.get('slug')}.md`, front + structures[values.get('kind')], 'text/markdown;charset=utf-8');
      document.getElementById('post-status').textContent = 'Draft ready. Upload it to content/posts, replace the prompts, then set draft and template to false when ready.';
    });
  }
})();
