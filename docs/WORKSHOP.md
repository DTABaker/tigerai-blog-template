# Build your professional blog · 90-minute workshop

By the end of this session, aim to have a live website, a truthful introduction, concise About and Résumé pages, and one short piece of your own writing. A few clear paragraphs are enough for the first post. Projects, images, a résumé PDF, and longer writing can come later.

You need a laptop, internet access, a GitHub account you can sign into, and the template link from your facilitator. A GitHub Free account can host this workshop's public repository on GitHub Pages. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

Workshop access: [shared GitHub template](https://github.com/DTABaker/tigerai-blog-template) · [public workshop guide](https://dtabaker.github.io/tigerai-blog-template/workshop/). Your facilitator verifies these public links before the event. After your first deployment, use the guide on your own website.

Keep three browser tabs open: this guide, your GitHub repository, and your live website. After your first deployment, use the **Workshop** link on your own site to continue this guide there. Its setup links will then open your own studio. No terminal or coding installation is needed.

## 0–10 minutes · Choose what you want to say

Use the [participant worksheet](WORKSHEET.md) to make three decisions:

1. Who should understand your work: a recruiter, a prospective collaborator, a graduate program, or another audience?
2. What is your current focus, in one plain sentence?
3. What real project, idea, or learning experience can you explain in a short first post?

Choose a project or experience you can discuss publicly. It can be a class exercise, club activity, personal exploration, or volunteer contribution when you describe its context honestly. You do not need an invented job title or a dramatic result.

### Four words you will see

| Word | What it means here |
| --- | --- |
| Repository, or repo | Your website's folder on GitHub |
| Commit | A saved version of a file or group of files, with a short note |
| Actions | The automated steps that turn your files into a website |
| Pages | GitHub's hosting service for the finished website |

## 10–25 minutes · Make your copy and publish the starter

### 1. Create your own repository

Sign in to GitHub and open the [shared template repository](https://github.com/DTABaker/tigerai-blog-template). Select **Use this template → Create a new repository**. If you cannot find that control, use the [direct create-a-copy link](https://github.com/DTABaker/tigerai-blog-template/generate) after signing in. Select your own account as the owner and choose **Public**. You only need the default branch. [GitHub's template instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)

For the live workshop, name the repository **`professional-blog`**. If that name already exists in your account, choose a new name such as `professional-blog-workshop`. The resulting project site normally lives at `https://YOUR-USERNAME.github.io/professional-blog/`. Replace `YOUR-USERNAME` with your actual lowercase GitHub username, and keep your chosen repository name in the address. Use **Settings → Pages → Visit site** for the authoritative address.

A hyphen in a username works normally. Keep it: the address shape `https://gloria-obeng.github.io/Tigers-AI-Test/` has the hyphen in the username and the repository name after `.io/`. Copy your own Pages address rather than typing or guessing it, and preserve the repository name's letter case.

This workshop uses a separate project repository even if you do not yet have a personal blog. Keep any existing `YOUR-USERNAME.github.io` repository and its settings unchanged. [GitHub's naming requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

Click **Create repository from template**. Check that the address bar now shows **your account**, not the instructor's account.

**Optional advanced route, outside the live workshop:** a new repository named exactly `YOUR-USERNAME.github.io` can host at `https://YOUR-USERNAME.github.io/`. Use it only when that repository does not already exist and your facilitator has rehearsed a root user-site deployment separately. The generator has root-path regression checks; a local check is not evidence of a live root-site rehearsal. Do not rename, replace, or repurpose an existing personal site to follow this option.

### 2. Enable the supplied publishing workflow

In your repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source: GitHub Actions**. Do not choose **Deploy from a branch** or a `main / (root)` branch-and-folder combination. The kit already contains a workflow; you do not need to create a second one.
3. Open the **Actions** tab.
4. Select **Deploy blog** in the workflow list.
5. Select **Run workflow**, choose `main`, and run it. If you named the default branch differently, use that branch and ask the facilitator to check the workflow's branch setting.

This template supplies a custom workflow to build and deploy the site. GitHub documents [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and the [Run workflow control](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).

The first run may have started before you selected the Pages source. If **Check GitHub Pages setup** fails, open that step or the run's summary and follow its instructions. Change the Pages source yourself, then start a new **Deploy blog** run; the check reports the problem but does not change repository settings for you. Do not edit random workflow settings in response to an error; use the [troubleshooting guide](TROUBLESHOOTING.md).

### 3. Open your live site

Open the latest **Deploy blog** run for your latest commit and wait for it to complete successfully. A separate automatically generated **pages build and deployment** run can appear if branch publishing was enabled; its green mark does not show that this blog was built correctly. Then return to **Settings → Pages → Visit site**. Save that exact address in your worksheet. A repository address beginning with `github.com/` is the source-code page; your website address normally uses `github.io`.

Publishing can take several minutes. Continue planning your introduction while it runs. GitHub notes that publication can take up to ten minutes after a change. [Publishing timing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

**Checkpoint:** your starter website opens and displays clearly labeled instructional content. This is a rehearsal publication, not your finished professional profile.

Before continuing, open **Workshop** on **your own live site**. Check that the address uses your GitHub username and, for a project site, your repository name. Continue from that page; the instructor's demo is useful for reference, but its setup form contains the instructor's starter settings.

## 25–40 minutes · Make the homepage yours

### 4. Personalize with your own site's studio

Open the **personalization studio** from the workshop page on **your own live site**, or append `setup/` to the website address you saved. For a project site, keep the project part: `https://YOUR-USERNAME.github.io/professional-blog/setup/`. Check the address before editing; do not use the instructor's studio for later settings updates.

Fill in your display name, initials, professional headline, introduction, and field or focus. Optional contact and profile fields can stay empty. Choose `teal`, `blue`, or `plum` for the accent color. Leave **Keep workshop mode on** checked while you are composing. See [all settings](CUSTOMIZE.md#site-settings) for explanations.

Download the generated settings file before leaving the page. Form entries are not stored. The form does not sign into GitHub or publish changes; its download is a file on your computer.

To apply it:

1. Ensure the downloaded filename is exactly `site.yml`. If your browser named it `site (1).yml`, rename it to `site.yml` on your computer before uploading. Do not add `.txt` to the name.
2. In **your repository**, open the `content` folder.
3. Check the folder breadcrumb reads **your repository / content**, then choose **Add file → Upload files** and select the downloaded `site.yml`.
4. Review the replacement, then **Commit changes** to `main` with a note such as `Personalize homepage`.
5. Wait for the latest Actions run and refresh the website.

Check the saved file's location:

```text
Your repository
└── content
    └── site.yml       ← correct: the file the blog reads

Your repository
└── site.yml           ← wrong: uploaded one folder too high
```

The updated build stops if it finds a misplaced settings file and tells you how to recover. It will not merge or delete your files automatically. If this happens, preserve your desired settings by following [the recovery steps](TROUBLESHOOTING.md#the-build-found-a-misplaced-settings-file).

A downloaded settings file replaces the **whole settings file**. For later updates, wait for the latest successful deployment, reload your own `/setup/` page, and check that every field shows your current details before changing anything. An old tab or the instructor's studio may contain old or default settings.

A commit saves your edit and starts a new build. You can make another independent edit while a build is running; you do not need to wait after every file. At each checkpoint, check the run for your latest commit before judging the live result.

### Optional: edit settings directly

Open **Code → content → site.yml** in your repository and select the pencil icon. Change text on the right side of each colon and leave the field names unchanged. Keep each quoted setting on one line, between straight double quotes, and keep `true` and `false` unquoted. Do not paste a paragraph of AI advice or press Enter in the middle of a quoted headline. Text wrapping on your screen is fine; adding a new line to the file is different. Use the studio for text with quotation marks or multiple paragraphs—it writes the required formatting for you. Review the changes and commit to `main`.

**Checkpoint:** your real name and accurate introduction appear on the live homepage.

## 40–60 minutes · Publish your first real post

### 5. Download a starting structure

On your own `/setup/` page, find **Start your next post**. Enter an accurate title, short summary, today's date or an earlier intended publication date, and one useful topic label. Choose a writing structure and optionally feature the post on your homepage.

Check the file name: use lowercase words separated by hyphens, with no spaces or slashes. The builder adds `.md` to the download. Choose a **new, unique filename** for a new post; uploading the same filename as an existing post replaces that file. The name becomes part of the website address, so keep it short and stable after sharing.

Select **Download post template**. In your repository, open **`content/posts` → Add file → Upload files**, select the downloaded `.md` file, and commit it to `main`. If your browser added a number such as `(1)`, rename the file to your chosen unused filename before uploading. This first file is a draft, so it will not appear on the generated website yet. You can open and edit it immediately without waiting for that draft build.

### Optional: copy a Markdown template instead

Open `templates/post.md` in the repository and use its raw view or copy-raw control to copy the complete text, including both `---` lines. In `content/posts`, select **Add file → Create new file**, enter an unused name such as `your-post-title.md`, and paste the text. Replace that naming example with your real topic. Do not add an extra `.txt` extension. Continue with the same editing steps below.

### 6. Replace the settings and writing prompts

Open the uploaded post in GitHub and select the pencil icon. The settings between its two `---` lines are called **front matter**. Check them before writing:

- Write an accurate `title` and a one-sentence `description`.
- Check the quoted `date` in `YYYY-MM-DD` form. If you copied the optional Markdown template, replace its sample `"2026-01-01"` with your intended publication date. For today's workshop, choose today or an earlier date. The bundled dates are examples, not dates of your work.
- Add one or two topic labels in `tags`, such as `["Your topic", "Your other topic"]`, replacing those words too.
- Set `featured: true` if you want this post highlighted on the homepage.
- Keep `draft: true` until the writing is ready.
- Set `template: false` after replacing all instructional content.

Replace the body with your own short post: a few clear paragraphs explaining the context, one useful idea or piece of work, and the takeaway. Remove headings you do not need. You can use the instructional examples for structure, but do not leave their prompts in your finished post. Credit sources and distinguish your contribution from any team's work.

### 7. Preview, then publish

Use GitHub's **Preview** tab to check paragraphs, headings, lists, and links. This preview shows your writing's formatting; the deployed website supplies the final layout.

Read the post once for accuracy. When it is ready, set:

```yaml
draft: false
template: false
```

Commit with a note such as `Publish first post`. After the latest workflow succeeds, open the site's **Writing** page and select your post. Try searching for a word from its **title, summary, or topic labels**, then filter by one of its tags. Search does not scan the article body. Open the post and check its links.

`draft: true` keeps a post out of the generated site, but **does not hide it in a public GitHub repository**. Use a private document outside this repository for private drafts. Future-dated posts are also excluded, using the build's UTC date. They do not publish automatically when that date arrives: run **Deploy blog** again on or after the date. For immediate publication, use today or an earlier date and `draft: false`.

**Checkpoint:** your own post has a working page and appears in the writing archive.

## 60–75 minutes · Add context about you

### 8. Edit About and Résumé

Edit `content/about.md` and `content/resume.md` with the pencil button. Replace the instructional text with accurate information and remove unused sections. Aim for a short About paragraph and only the Résumé sections you can fill accurately today. Keep the focus on relevant evidence: what you have studied, done, made, or learned. Commit each file to `main`; you can edit the second while the first build runs.

The résumé page works as text without uploading a PDF. To add a download button later, upload a reviewed PDF into `assets/uploads/` and set `resumePdf: "/assets/uploads/resume.pdf"` in `content/site.yml`. The filename must match. See [images and files](CUSTOMIZE.md#images-and-a-resume-pdf).

### 9. Optional: add a project later

If you have a real project you can describe, copy `templates/project.md` into `content/projects/your-project-title.md` and follow the same process as a post. A project page summarizes a piece of work; a post can explore one lesson or decision in more detail.

You do not need a project page during this session. Leave unused sample posts and projects marked `template: true`; the launch step below hides them from the finished generated site. Keep unfinished work marked `draft: true`. An empty project collection is acceptable.

## 75–85 minutes · Finish and review together

### 10. Check what will appear at launch

Your finished first post must have **`draft: false` and `template: false`**. Leave the instructional sample posts and projects marked **`template: true`**. Switching workshop mode off in the next step hides those flagged samples from all generated pages, the feed, and the sitemap. Their source files can remain for reference. Delete unused examples later if desired.

This flag only applies to posts and projects. **It does not rewrite the homepage settings, About, or Résumé.** Check those pages for remaining instructions before launch. If you have replaced a sample with your own finished writing, set its `template` to `false` so it stays visible after launch. Keep unfinished writing at `draft: true`.

### 11. Complete the launch checklist

Use the [worksheet checklist](WORKSHEET.md#launch-checklist) with a partner. Check desktop and phone layouts, the About and résumé text, the writing archive, links, and images. Read every claim as if an interviewer might ask about it.

When the site is ready, edit `content/site.yml` to set:

```yaml
templateMode: false
```

This hides all posts and projects still marked `template: true`, removes the workshop banner and navigation, and enables normal search-engine indexing instructions. It does not rewrite any text, guarantee a search-engine listing, or make any source file private. Keep `templateMode: true` until your profile pages and first post are ready. The direct workshop and setup URLs remain available for future editing.

For this one setting, use GitHub's pencil editor on `content/site.yml` so you do not replace the rest of your settings with an old download. Commit, wait for the latest successful deployment, and review the live website again. Confirm your own post is visible and the sample cards are gone. If time runs out, keep workshop mode on, save your progress, and finish the checklist later before presenting the site as a finished professional profile.

## 85–90 minutes · Share a useful link and choose your next step

Copy your verified **live website** URL into your worksheet. Add it to the website or portfolio field on your résumé or profile when you are satisfied with what it shows. Use a clear label such as `Website` or `Portfolio` with the actual link.

Choose one small next task: improve your first post, add a relevant image, write a second post, or ask someone in your target audience for feedback. You can continue using this guide at your own pace.

## Optional cleanup after the workshop

You may keep the flagged samples as public source references, or delete unused ones later:

- `content/posts/project-story.md`
- `content/posts/explain-an-idea.md`
- `content/posts/learning-reflection.md`
- `content/posts/draft-example.md`
- `content/projects/project-case-study.md`
- `content/projects/learning-project.md`

To remove an example in GitHub, open the file and use its file menu's delete control, then commit the change. Check the path first. If you have rewritten a sample, keep your writing instead of deleting it. The reusable files in `templates/` can remain; they are not published as posts or projects. Deleting a file does not remove previous versions from GitHub history.

## Recover from an edit without starting over

If something looks wrong, first open the latest **Actions** run. A failed build often identifies the file and field to fix. Re-edit that file and commit a correction.

To recover earlier text, open the file in GitHub, select **History**, and inspect the version before the mistake. Copy the earlier file content, return to the current version of that file on `main`, use the pencil button, paste the earlier text, and commit a note such as `Restore previous introduction`. Review the diff before committing so you can see exactly what changed. This creates a new saved version; it does not erase your history.

If you delete a file accidentally, find it in the earlier commit, copy its content, and recreate it at the same path with **Add file → Create new file**. For a sensitive accidental upload, deletion alone does not remove historical copies; ask the facilitator to help follow GitHub's documented removal process.

See [troubleshooting](TROUBLESHOOTING.md) for specific errors. You do not need to rebuild the entire repository because of one bad edit.
