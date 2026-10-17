# Troubleshooting without a terminal

Start with **your own repository → Actions → Deploy blog → the latest run**. Check that the run corresponds to your latest commit; an older failed run can remain visible after you have fixed the issue. Read the run's summary, then open the failed job and expand the step with the red mark. Read the first useful message that names a file or setting. Lines beginning with `##[debug]` are diagnostic detail; they are usually not the repair instruction.

If you also see **pages build and deployment**, that is a separate workflow GitHub may have generated for branch publishing. A green mark on that workflow does not mean **Deploy blog** succeeded. Follow the Pages-source repair below, then check the latest **Deploy blog** run.

## I cannot find “Use this template”

Confirm you opened the facilitator's template repository and are signed in. The facilitator must enable **Template repository** in its settings. Use the supplied template link rather than editing the facilitator's files. [GitHub template instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

## My preferred repository name already exists

Do not replace an existing personal site during the workshop. Create a new repository named `professional-blog` or another unused name. Its live URL will include that repository name, for example `https://YOUR-USERNAME.github.io/professional-blog/`. The supplied workflow obtains the correct Pages address automatically.

## My GitHub username contains a hyphen

That is supported. Keep the hyphen in the website address. For example, `https://gloria-obeng.github.io/Tigers-AI-Test/` has a hyphenated username and a project path. Neither requires a special setting in this template. Use **Settings → Pages → Visit site** to copy your own exact address, keeping the repository path and its letter case. Leave `url: ""` in `content/site.yml` for GitHub Pages; the workflow supplies the address automatically.

A message about a missing quotation mark in `content/site.yml` concerns the settings file's formatting, not your username. Follow the YAML repair below.

## The Actions list has no “Deploy blog” workflow

In **Code**, verify that **`.github/workflows/pages.yml`** exists at the repository root. If every source file is inside an extra `tigerai-blog-template/` folder, the repository was uploaded one level too deep. Ask the facilitator to repair the shared source layout before copying it again.

If GitHub asks you to enable Actions for your own repository, review that prompt and enable the supplied workflow. If an organization restricts Actions, ask its administrator or use a personal repository for the workshop.

## There is no “Run workflow” button

Select **Deploy blog** in the Actions sidebar, rather than staying on the all-workflows view. The workflow must be present on the default branch and you must have write access. The supplied file includes the manual-run trigger. [GitHub's manual-run requirements](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)

The kit uses `main` for automatic deployment after commits. If your repository's default branch has a different name, ask the facilitator to align the workflow and the branch. Avoid editing branch settings at random.

## “Check GitHub Pages setup” fails, or Pages uses the wrong source

The check reads your repository's Pages configuration before the blog is built. It does not change that setting for you.

1. Open **your repository → Settings → Pages**.
2. Under **Build and deployment**, set **Source: GitHub Actions**. Do not select **Deploy from a branch** or `main / (root)`.
3. The kit already includes its publishing workflow. Do not create a new workflow from a suggested card.
4. Open **Actions → Deploy blog → Run workflow**, choose `main`, and run it again. Changing the Pages setting alone may not start the supplied workflow.
5. Open the newest **Deploy blog** run. Check its **Check GitHub Pages setup** step, then wait for the full run to succeed. Use **Settings → Pages → Visit site** to open the result.

The initial run may have started before Pages was configured. If the check cannot read the configuration because of access permissions or a GitHub service problem, read its exact message and ask the facilitator for help. Do not assume the source is correct simply because that check could not read it.

If the message names a deployment environment or policy, copy that exact error for the facilitator. Do not broadly disable repository protections. The supplied workflow already declares the Pages permissions it requires. [Custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## The build found a misplaced settings file

The blog reads exactly **`content/site.yml`**. A file such as top-level `site.yml` or `content/site (1).yml` is a different file, even if it contains your newest settings. The updated build stops instead of silently ignoring a likely misplaced upload. It does not decide which file contains the work you want to keep.

**Preserve your newest work before removing anything:**

1. In **Code**, open each settings file named by the error. Identify the one with the complete settings you want. Keep a copy of that text or download it before editing. Do not assume the older `content/site.yml` has your newest changes.
2. If the misplaced file has your desired, valid settings, use its raw view or copy-raw control to copy the **entire file**. Open **content → site.yml → pencil**, replace the entire contents with that copied text, review it, and commit. If the intended settings themselves have broken quotation marks, use the next section to repair them first.
3. Reopen **content/site.yml** on `main` and confirm your desired name, introduction, links, and theme are saved there. This is the preservation check; the build can still be red while the extra file exists.
4. Only after confirming the correct file, delete the mistaken extra file named by the error using its **… → Delete file** control and commit. Delete the extra path, **not `content/site.yml`**. If there are several extras, review and remove each one after preserving any needed changes.
5. Check the latest **Deploy blog** run after the final correction. When it succeeds, refresh the website.

Before future uploads, rename browser downloads such as `site (1).yml` to exactly **`site.yml`**, then open the repository's **content** folder before **Add file → Upload files**. Do not create another nested `content` folder.

## The build reports a YAML or field error

YAML is the settings format used by `content/site.yml` and the top of posts and projects. Open the named file with the pencil button and use any line and column in the message to locate the formatting problem. A reported location can be just after the mistake, so check the previous line too.

For **`Missing closing "quote`** in `content/site.yml`, a headline or introduction may start with `"` and never close correctly. Do not paste explanatory AI advice into a setting, or insert an unindented new paragraph inside quoted text. For a simple edit, keep the whole quoted value on one line:

```yaml
headline: "Replace with one accurate sentence about your focus."
```

That is one example line, **not a complete settings file**. Replace only the affected line if you are editing directly. If a valid, newer downloaded file exists in the wrong folder, recover its complete contents using the steps above rather than discarding your new details.

For safer editing, open the studio on your own last successfully deployed site. It may show older values because the latest build failed. Enter or restore **all** desired values, download the generated file, rename it to `site.yml` if necessary, and upload it into `content/`. The studio handles quotes and line breaks. Check every field before replacing the file; do not copy an AI response, Markdown code fences, or just a short example over the whole settings file.

If your site has never successfully published, use the [shared starter's studio](https://dtabaker.github.io/tigerai-blog-template/setup/) for this recovery only and fill in **every field** with your intended values. Its defaults are instructional examples. After your own site publishes, use your own studio for all later updates.

| Error or symptom | Check and repair |
| --- | --- |
| `content/site.yml → YAML` | Check the reported line, the line above it, matching straight quotes, indentation, and duplicated keys. Use your own `/setup/` form if quoting is difficult; review every field because it reflects the last successful deployment. |
| `Unknown setting` or `Unknown front matter field` | Restore the exact field name. For example, use `templateMode`, not `template-mode`. Do not add custom keys during the workshop. |
| `Use true or false without quotation marks` | Use `draft: false`, not `draft: "false"`; likewise for `featured`, `template`, and `templateMode`. |
| A required text field is empty | Add a real value for the named field. Site name, initials, headline, and description need text. Posts and projects need a title and description. |
| An initials error | Keep `initials` to 1–5 characters. |
| An accent error | Use exactly `teal`, `blue`, or `plum`. |
| An email error | Use an email address without `mailto:`, or leave `email: ""`. |
| A profile-URL error | Use the complete `https://` address, not only a username; or leave the optional field empty. |
| A date error | Use a real date in quoted `YYYY-MM-DD` form. Check the month and day, not just the number of digits. |
| A tags error | Use a list such as `["Your topic"]` or `[]`, replacing the instructional label. |
| A front-matter error | Begin the file with `---`, keep settings below it, and close the block with a second `---`. Put article text after that block. |
| A filename error | Use lowercase letters or digits separated by hyphens and end in `.md`, such as the pattern `your-post-title.md`. |

Commit the corrected file and check the new run. The [customization guide](CUSTOMIZE.md) contains the complete field reference.

## My new post does not appear

Check all of these:

1. The file is in **`content/posts/`**, not `templates/`, the repository root, or a new nested folder.
2. Its filename ends in `.md`, not `.md.txt`.
3. Its metadata has **`draft: false`**.
4. Its date is on or before the build's **UTC date**. Future-dated entries are excluded. There is no automatic scheduled rebuild; run **Deploy blog** again on or after the date.
5. Its metadata has **`template: false`** if your site's `templateMode` is `false`. Launch mode intentionally hides entries still flagged as samples. Only change this flag after replacing their instructional text with your finished writing.
6. Your change was committed to `main` and the latest run succeeded.
7. You cleared both the writing search and the topic filter. Search covers titles, summaries, and topic labels, not the article body.

Check `content/projects/` instead when troubleshooting a project page. A post need not be featured to appear in Writing; `featured` controls homepage emphasis.

## My edit is saved on GitHub but the website looks unchanged

Check the path and filename you edited. Settings belong at **`content/site.yml`**, not top-level `site.yml` or `content/site (1).yml`. The About page uses **`content/about.md`**, not the README. Writing belongs in `content/posts/`.

Check that you committed directly to `main`. If GitHub offered a new branch and you chose it, the change is not on the publishing branch yet; ask the facilitator to help merge that change or repeat the edit on `main` after reviewing it.

Then wait for the latest deployment, refresh the page, and try a private browser window if you suspect cached content. Publication is not instantaneous. [GitHub's publication timing guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## The setup form did not save my site

The form only creates a download in your browser. To apply settings, upload the downloaded **`site.yml`** into your repository's **`content/`** folder and commit it. To add a post, upload the generated `.md` file into **`content/posts/`**.

If a browser adds a number to a repeated download, rename it back to the intended filename before uploading. Read the replacement file before committing; it contains the full set of settings.

For a new post, choose an unused filename before uploading. Reusing an existing post's filename replaces that file. If that happened accidentally, recover its previous text using the History instructions below.

## The studio shows defaults or downloading settings undid my changes

Check the address bar: open **your own live site's** `/setup/`, not the instructor's demo. Wait for your latest successful deployment, reload the studio, and confirm that all fields show your current details before editing. The page is not connected to GitHub; its fields reflect the deployed site version when the page loaded. An old open tab can contain older values even after your repository changes.

A downloaded `site.yml` replaces the complete settings file. If you already uploaded the wrong version, restore the correct text from `content/site.yml` history, commit it, wait for deployment, and reload your studio. To change only the launch setting, use GitHub's pencil editor and edit `templateMode` directly.

## Samples disappeared after I switched workshop mode off

This is the intended launch behavior. With `templateMode: false`, all posts and projects marked `template: true` are hidden from generated pages, the feed, and the sitemap. Their public GitHub source files remain. Your own ready article needs `draft: false`, `template: false`, and a current or past publication date.

If your homepage, About, or Résumé still shows instructional prompts, edit those files yourself. Launch mode only hides flagged post/project entries; it does not rewrite profile content. Keep workshop mode on while composing if you need its guidance, and complete the launch checklist before sharing the site as your finished professional profile.

## The website returns 404

Use **Settings → Pages → Visit site** to obtain the actual published address. A project site needs the repository path. Confirm the latest deployment succeeded; a repository existing on GitHub does not by itself mean Pages is configured.

For a single missing post, verify the filename-derived address. Renaming a file changes its URL. Correct any links you shared to its old name. For an unknown path, the site's 404 page offers navigation back to the site.

## Styles, navigation, or images break on a project site

Keep `url: ""` in **`content/site.yml`** for the automatic Pages address. The workflow supplies the project path. Use **GitHub Actions** as the Pages source, not a branch-based Jekyll configuration.

For an image, check that the actual uploaded file exists and that spelling and uppercase/lowercase match. Use a site path such as `/assets/uploads/project-overview.jpg` in Markdown. Do not use a local computer path, a `github.com/.../blob/...` page address, or manually prepend the repository name to the template's root asset path.

## My résumé PDF causes a build error or the button is missing

The file must exist before you set **`content/site.yml → resumePdf`**. Upload the PDF into **`assets/uploads/`** and match the filename exactly, including its `.pdf` extension.

Use `resumePdf: "/assets/uploads/resume.pdf"` for that exact uploaded file. If you do not want a PDF yet, use `resumePdf: ""`. You can still edit and publish the text résumé in `content/resume.md`.

## I changed something incorrectly or deleted a file

For text changes, open the file's **History**, inspect the earlier version, and copy the text you want to restore. Return to the current file on `main`, edit it, review the diff, and commit a correction. For a deleted file, recreate the same path from its earlier content.

You can also correct a small mistake by re-editing the current file directly. Neither approach requires deleting the repository or starting over. GitHub documents the [file editor](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files) and [file deletion controls](https://docs.github.com/en/repositories/working-with-files/managing-files/deleting-files-in-a-repository).

## I accidentally uploaded private information

Stop sharing the file and tell the facilitator what kind of information was uploaded, without reposting the sensitive content into public issues. Deleting the current file does not remove historical versions. Follow [GitHub's sensitive-data removal guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository). If a password or token was exposed, revoke or rotate that credential through its provider.

## Update an existing copy with these fixes

New copies made from the current template include the settings-file and Pages checks. **A copy you already created does not receive later template changes automatically.** Fixing your content or selecting the correct Pages source does not install the new checks.

Ask a facilitator to help if you have an earlier copy. Keep your existing repository, writing, and uploads. Review and back up your current files first, especially if you have customized the generator or workflow. From the [current shared template](https://github.com/DTABaker/tigerai-blog-template), copy the complete contents of these files to the **same paths** in your repository, adding the two new files where needed:

- `.github/workflows/pages.yml`
- `scripts/build.mjs`
- `scripts/check.mjs`
- `scripts/check-pages.mjs` — new
- `scripts/check-pages.test.mjs` — new
- `package.json`

The dependency lockfile does not need a change for this update. Do not overwrite **`content/`** or **`assets/uploads/`** with the template's defaults. Do not recreate the repository or replace your personal blog. To also update the help shown on your site, copy `scripts/setup-page.mjs`, `scripts/workshop-page.mjs`, the current `README.md`, and **every file in the current `docs/` folder**, including `REHEARSAL.md` if your older copy does not have it. The guides link to each other, so copying only some can cause a missing-page error. Review any help text you have customized before replacing it.

Commit the updated files to `main`, confirm **Settings → Pages → Source: GitHub Actions**, and run **Deploy blog**. If the new checks find an existing misplaced upload or malformed setting, follow the instructions above; installing the checks does not automatically move files or repair personal text.

## It still fails

Give a helper your repository URL, the failing workflow-run URL, the exact error, and the last file you edited. Exclude private details from screenshots. A specific error and path are more useful than “the website is broken.” No GitHub deployment or account permissions were exercised simply by receiving this kit; those must be checked in your own repository.
