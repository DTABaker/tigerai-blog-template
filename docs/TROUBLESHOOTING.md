# Troubleshooting without a terminal

Start with **your own repository → Actions → the latest Deploy blog run**. Open the failed job and expand the step with the red mark. Read the first useful error that names a file or setting. Check that the run corresponds to your latest commit; an older failed run can remain visible after you have fixed the issue.

## I cannot find “Use this template”

Confirm you opened the facilitator's template repository and are signed in. The facilitator must enable **Template repository** in its settings. Use the supplied template link rather than editing the facilitator's files. [GitHub template instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

## My preferred repository name already exists

Do not replace an existing personal site during the workshop. Create a new repository named `professional-blog` or another unused name. Its live URL will include that repository name, for example `https://YOUR-USERNAME.github.io/professional-blog/`. The supplied workflow obtains the correct Pages address automatically.

## The Actions list has no “Deploy blog” workflow

In **Code**, verify that **`.github/workflows/pages.yml`** exists at the repository root. If every source file is inside an extra `tigerai-blog-template/` folder, the repository was uploaded one level too deep. Ask the facilitator to repair the shared source layout before copying it again.

If GitHub asks you to enable Actions for your own repository, review that prompt and enable the supplied workflow. If an organization restricts Actions, ask its administrator or use a personal repository for the workshop.

## There is no “Run workflow” button

Select **Deploy blog** in the Actions sidebar, rather than staying on the all-workflows view. The workflow must be present on the default branch and you must have write access. The supplied file includes the manual-run trigger. [GitHub's manual-run requirements](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)

The kit uses `main` for automatic deployment after commits. If your repository's default branch has a different name, ask the facilitator to align the workflow and the branch. Avoid editing branch settings at random.

## The first deployment fails at Pages configuration or publishing

Open **Settings → Pages** and select **GitHub Actions** as the source. Then start a new **Deploy blog** run on `main`. The initial run may have happened before Pages was configured.

If the message names a deployment environment or policy, copy that exact error for the facilitator. Do not broadly disable repository protections. The supplied workflow already declares the Pages permissions it requires. [Custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## The build reports a YAML or field error

Open the named file with the pencil button and compare the relevant line with its template. YAML is the simple settings format used by `content/site.yml` and the top of posts and projects.

| Error or symptom | Check and repair |
| --- | --- |
| `content/site.yml → YAML` | Check colons, matching straight quotes, indentation, and duplicated keys. Use the `/setup/` form if quoting is difficult. |
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

## It still fails

Give a helper your repository URL, the failing workflow-run URL, the exact error, and the last file you edited. Exclude private details from screenshots. A specific error and path are more useful than “the website is broken.” No GitHub deployment or account permissions were exercised simply by receiving this kit; those must be checked in your own repository.
