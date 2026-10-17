# Customize your site

Edit files in your own GitHub repository, commit your changes, and check the latest **Actions → Deploy blog** run. Your live website updates after a successful deployment. The [workshop](WORKSHOP.md) shows the full browser process.

## Site settings

All homepage settings live in **`content/site.yml`**. Keep the field names exactly as supplied. **Your own published site's `/setup/` page** offers a form that downloads a complete replacement settings file; you must upload it into `content/` yourself. For later edits, wait for your latest deployment, reload that page, and check its current values before downloading. An instructor's setup page or an old open tab can replace your settings with different or stale values.

Open the **content** folder before **Add file → Upload files**. Rename downloads such as `site (1).yml` to exactly `site.yml` first. A top-level `site.yml` is one folder too high. The updated build reports likely misplaced settings files and stops; it does not merge or delete them. [Recover your intended settings](TROUBLESHOOTING.md#the-build-found-a-misplaced-settings-file) before removing an extra file.

| Field | What to enter |
| --- | --- |
| `name` | Your public name, as you want it displayed |
| `initials` | A short monogram of 1–5 characters for the site mark, such as your initials |
| `headline` | A short phrase describing your professional focus |
| `description` | Two or three accurate sentences introducing you and the site |
| `role` | Your current field, role, or developing focus; avoid inflated credentials |
| `location` | Optional public location, or `""` to omit it |
| `email` | Optional public email address, or `""`; do not add `mailto:` |
| `url` | Usually `""`; the GitHub workflow supplies your Pages address automatically |
| `github` | Your complete `https://` GitHub profile URL, or `""` |
| `linkedin` | Your complete `https://` LinkedIn profile URL, or `""` |
| `resumePdf` | A path such as `"/assets/uploads/resume.pdf"` after uploading the matching file, or `""` |
| `accent` | Exactly `"teal"`, `"blue"`, or `"plum"` |
| `templateMode` | `true` while learning; `false` after the launch checklist, to hide flagged sample posts/projects and workshop navigation |

The GitHub workflow supplies the detected Pages URL and takes priority over `url`, including when Pages uses a custom domain. For other hosting, if you set `url` manually, use the actual full website URL, including any project path. Do not enter the repository's `github.com` address. Changing this field does not register a domain or configure GitHub Pages. Leave it empty during the workshop.

Hyphens in GitHub usernames are supported. Copy your address from **Settings → Pages → Visit site**, keeping the username's hyphens and the repository path's spelling and letter case. Use **GitHub Actions** as the Pages source; **Deploy from a branch** does not run this generator correctly.

Keep a space after each colon. Text can be quoted; booleans are the bare words `true` and `false`. Use ordinary straight quotes, not the curly quotation marks a word processor may insert. For a simple direct edit, keep each quoted value on one line. Use the studio for embedded quotation marks or multiline text. Do not paste AI explanations, Markdown code fences, or extra paragraphs into the settings file.

Example syntax, with instructional values:

```yaml
name: "Your public name"
headline: "Your professional focus in a short phrase."
email: ""
accent: "teal"
templateMode: true
```

This is only part of the file. Edit the existing fields rather than replacing the entire file with this short example.

## About and résumé

Edit **`content/about.md`** and **`content/resume.md`** as ordinary Markdown. The site supplies the page title, so start your sections with `##`. Remove unused sections rather than filling them with invented experience.

Useful About content answers: What do you work on or study? What questions interest you? What are you exploring next? How can a relevant reader contact you?

A useful résumé page lists accurate education, experience, projects, and skills, with context. A student may omit sections that do not apply. The optional PDF download is separate from the text résumé; updating one does not update the other.

## Posts and projects

Posts live in **`content/posts/`**. Project pages live in **`content/projects/`**. The workshop uses the `/setup/` post builder to download a new post for upload. You can also copy a file from `templates/` to create a post or project; the original templates are not published as content.

Use a lowercase, hyphen-separated filename ending in `.md`. The filename without `.md` becomes the final part of its address:

| Source file | Page path within your website |
| --- | --- |
| `content/posts/your-topic.md` | `posts/your-topic/` |
| `content/projects/your-project.md` | `projects/your-project/` |

These are naming examples, not supplied files. Choose an unused filename for a new item: uploading an existing filename replaces that file. Keep filenames stable after sharing a link. Renaming a file changes the page address; this template does not automatically redirect an old address.

### Front matter

The block between the first two `---` lines is the page's metadata. The text after the second line is your article.

```yaml
---
title: "Replace with your title"
description: "Replace with a one-sentence summary for readers."
date: "2026-01-01"
tags: ["Your topic", "Your second topic"]
featured: false
draft: true
template: true
---
```

Replace the sample date using `YYYY-MM-DD`. Keep the date quoted. Use `draft: false` to publish and `template: false` once all instructional content has been replaced. Setting `featured: true` highlights a published item on the homepage. Topic labels come from `tags`; use consistent spelling so closely related posts group together.

| Switch | What it controls |
| --- | --- |
| `draft: true` | Excludes that item from the generated website |
| `draft: false` | Allows publication once the item's date is on or before the build's UTC date and it is not hidden as a sample |
| `template: true` | Labels the item as instructional sample content in workshop mode; hides it from generated pages, feed, and sitemap when site-wide `templateMode` is `false` |
| `template: false` | Marks the item as your own content so it remains eligible for publication after launch; drafts and future dates still stay hidden |
| `featured: true` | Marks the published item for homepage emphasis |
| Site-wide `templateMode: true` | Keeps workshop guidance and eligible sample entries visible and asks search engines not to index the starter |
| Site-wide `templateMode: false` | Hides all entries marked `template: true` and workshop navigation, and enables normal indexing instructions; does not rewrite your profile text |

These switches do not make files private. Source files in a public repository can be read even when they are drafts. Future-dated entries are excluded using the build's UTC date, and there is no automatic scheduled rebuild. Run **Deploy blog** on or after a future date to publish an otherwise-ready entry. For immediate publication, use today or an earlier date and `draft: false`. The template switches cannot verify whether a personal claim is true, so review the writing yourself.

### Search and topic filters

The writing archive searches published posts' **titles, summaries, and topic labels** and provides filters based on their tags. It does not search article bodies. Try a distinctive word from one of those searchable fields and one of the post's topic labels. Clear both search and the active filter if a post seems missing. Drafts and samples hidden by launch mode are not part of the published archive.

Use tags that help readers navigate your interests. Two specific labels are usually more useful than many near-duplicates. Replace the sample `Template` tags when you replace the sample writing.

## Markdown essentials

Markdown is plain text with a few formatting marks. You can type it directly into GitHub's editor and use **Preview** before saving.

| You want | Type |
| --- | --- |
| A section heading | `## Your heading` |
| A smaller heading | `### Your subheading` |
| Bold text | `**important words**` |
| Italic text | `*emphasized words*` |
| A bullet | `- Your list item` |
| A numbered item | `1. Your first step` |
| A link | `[Useful link text](https://example.com/)` |
| A new paragraph | Leave a blank line between paragraphs |

`https://example.com/` is a syntax example; replace it with your actual destination. Use link text that explains where it goes. Do not paste raw HTML, scripts, or embed codes into posts; ordinary Markdown keeps the site predictable.

To show a quotation, start the line with `>` and credit the source. Quote only what you are entitled to share. To show code, use fenced code blocks if they help the reader, but the workshop does not require writing code.

## Images and a resume PDF

### Add an image

1. Prepare a JPG, PNG, or WebP you have permission to share. Use a compressed copy for the web and keep your original elsewhere.
2. Give it a short lowercase filename, such as `project-overview.jpg`.
3. In GitHub, open **`assets/uploads`**, choose **Add file → Upload files**, upload the file, and commit.
4. Edit your post or project and add an image line:

```markdown
![Describe the meaningful information in this image.](/assets/uploads/project-overview.jpg)
```

The filename in that example must match the file you actually upload. Describe the image's purpose or useful information; do not use the filename as the alternative text. A chart needs its main point explained in nearby text too.

Use the `/assets/uploads/` form shown above even for a project site. The site builder adjusts these internal asset paths for your GitHub Pages project path. Do not put a Windows path or a link to a GitHub file-view page in the image syntax.

The browser upload flow has a 25 MiB per-file limit; practical web images should usually be much smaller. See [GitHub's file-upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

### Add a résumé PDF

Upload your reviewed PDF as **`assets/uploads/resume.pdf`**, then set:

```yaml
resumePdf: "/assets/uploads/resume.pdf"
```

in **`content/site.yml`**. If your PDF has another name, change the field to match it exactly. Leave the field empty to omit the download button. Check the downloaded PDF after publication; the text résumé and PDF are independent files.

All uploads in a public repository are public source files. Review a public-facing résumé before uploading it and remove private details you do not want online.

## Finish workshop mode

Complete the [launch checklist](WORKSHEET.md#launch-checklist), then edit `content/site.yml` to change `templateMode` to `false`. This hides posts and projects still marked `template: true` from all generated pages, the feed, and the sitemap, and hides workshop navigation and the starter banner. Source sample files may remain in your public repository for reference; deleting them later is optional.

Your own ready posts and projects need both `draft: false` and `template: false`. Launch mode does not rewrite the homepage, About, or Résumé, make any source file private, or certify readiness. Check those pages yourself. Search engines decide whether and when to index a website; this setting only supplies indexing instructions. For a one-field change, GitHub's pencil editor avoids replacing the rest of your settings with an old studio download.

You can still open your site's `setup/` and `workshop/` paths directly when you need them. For a project site, keep the repository part of the URL before those paths.

## What you do not need to edit

The workshop does not require edits to `scripts/`, `.github/workflows/`, `package.json`, or the stylesheet. Those files provide the generator, publishing workflow, and design. If you want to redesign the site later, make a separate experiment and keep a working copy of your current site.
