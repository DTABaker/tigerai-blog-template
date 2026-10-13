# TigerAI · Your professional blog

A personal website and a **90-minute, browser-only workshop** for people who do not code. Make your own copy, replace the instructional placeholders with accurate writing, and publish with GitHub Pages. No terminal, paid theme, AI subscription, or custom domain is required for the workshop.

The kit includes a homepage, searchable writing archive, topic filters, project pages, About page, text résumé, optional résumé PDF, theme choices, RSS feed, and a guided setup form. Every example is instructional placeholder content. Nothing in this template claims that you have completed a project, held a role, or earned a credential.

**Participants: start with [the follow-along workshop](docs/WORKSHOP.md).**  
**Facilitators: prepare the shared template using [the instructor guide](docs/FACILITATOR.md).**

Workshop access: [shared GitHub template](https://github.com/DTABaker/tigerai-blog-template) · [public workshop guide](https://dtabaker.github.io/tigerai-blog-template/workshop/). Facilitators should verify these links open signed out before each event. After publishing your own copy, continue from **Workshop on your own site**.

## Your first session

1. Open the GitHub template link supplied by your facilitator. Choose **Use this template → Create a new repository**.
2. Create a public repository named `professional-blog`. If that name already exists in your account, choose a new name such as `professional-blog-workshop`. This project-site route gives the workshop its own repository and address; keep any existing personal blog unchanged.
3. In your new repository, open **Settings → Pages** and select **GitHub Actions** as the publishing source.
4. Open **Actions → Deploy blog → Run workflow**, select `main`, and start the workflow. After it succeeds, open **Settings → Pages → Visit site**.
5. Open **Workshop** on your own live site and follow its guide. Use your own site's personalization studio to create settings and a first post, then upload those files to your repository. Finish the launch checklist when your introduction, About, Résumé, and first post are ready.

Keep this README open in one tab and your own repository in another. A **repository** is your site's folder on GitHub. A **commit** is a saved version. An **Action** builds your site from the files you edit. **GitHub Pages** hosts the resulting website. [GitHub's template guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) describes making your own copy.

Your project-site address normally looks like `https://YOUR-USERNAME.github.io/professional-blog/`; use the exact address shown in Settings → Pages. An optional advanced route uses `YOUR-USERNAME.github.io` as the repository name to host at the account's root address. Only use that route when the repository does not already exist and your facilitator has separately rehearsed it; it is outside the recommended live workshop path.

## The files you will edit

| Change you want | File or folder |
| --- | --- |
| Name, introduction, links, accent color, workshop banner | `content/site.yml` |
| About page | `content/about.md` |
| Text résumé | `content/resume.md` |
| Blog posts | `content/posts/` |
| Project pages | `content/projects/` |
| Images and optional résumé PDF | `assets/uploads/` |
| A reusable starting point for a new post or project | `templates/post.md` and `templates/project.md` |

The main workshop route uses **your own published site's `/setup/` page** to generate a settings file and a new post. GitHub's pencil button lets you edit the downloaded post after uploading it, and you can also edit settings directly. **The setup form does not update GitHub or publish anything.** Upload the downloaded file into the correct folder of your own repository and commit the change.

For later settings changes, wait for the latest successful deployment, reload your own `/setup/` page, and check that it shows your current details. A downloaded `site.yml` replaces the complete settings file. Using the instructor's studio or an old open tab can restore its defaults over your changes.

## Your workshop materials

- [Follow-along workshop](docs/WORKSHOP.md): the complete browser workflow, including publication and recovery.
- [Participant worksheet](docs/WORKSHEET.md): a short planning sheet and launch checklist.
- [Customization guide](docs/CUSTOMIZE.md): every setting, Markdown examples, images, tags, and publishing switches.
- [Troubleshooting](docs/TROUBLESHOOTING.md): what to inspect when something goes wrong.
- [AI helper prompts](docs/AI-PROMPTS.md): optional editing help that preserves your voice and factual accuracy.
- [Facilitator guide](docs/FACILITATOR.md): preparation and a 90-minute teaching plan.
- [Provenance and scope](docs/PROVENANCE.md): design inspiration, primary documentation, and what this kit does.

## Before you put the link on your résumé

Replace the homepage, About page, and résumé prompts. Publish at least one piece of your own writing with `draft: false` and `template: false`. Check contact links and images. Set `templateMode: false` in `content/site.yml` after completing the [launch checklist](docs/WORKSHEET.md). This hides posts and projects still marked `template: true` from the generated website, feed, and sitemap; you can keep their source files for reference and delete them later if desired. It does not rewrite your homepage, About, or Résumé, and it does not make GitHub source files private. Open the deployed website on your phone and verify the final live URL.

A published draft is not a private workspace: files in a public repository are readable even when `draft: true` keeps a post off the generated site. Put only material you are comfortable sharing in this repository.

## For the facilitator or a technical helper

Publish the **contents of this folder** as a standalone GitHub repository, including `.github/`, then enable **Template repository** in its settings. The workflow belongs at `.github/workflows/` in that repository's root. Do not upload the enclosing `tigerai-blog-template` folder as another nested folder. See [the preparation checklist](docs/FACILITATOR.md) before the session.

The site is built with a small Node.js generator and Markdown files, then deployed using GitHub Actions. Participants edit content; they do not need to edit the build scripts, install Node.js, or run commands. Deployment to any account is a separate step; this kit's files alone do not mean a live GitHub site has been published.

The design takes inspiration from the editorial structure of [dtabaker.github.io](https://dtabaker.github.io/). The implementation, teaching materials, and placeholders are a fresh workshop kit, not a copy of the reference site's personal content or assets. The kit is released under the [MIT License](LICENSE). Your own writing and uploaded media remain subject to the rights you hold in them.
