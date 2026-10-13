# Facilitate the TigerAI blog workshop

**Duration: 90 minutes.** Participants use a browser and their own GitHub accounts. The core outcome is a working personal website with an accurate introduction, concise About and Résumé pages, and one short piece of original writing. A few clear paragraphs are enough for the first post. Projects, images, a résumé PDF, and longer writing are optional follow-up work.

This guide describes preparation you still need to perform. The presence of these files does not mean that a template repository, demo site, or participant site has been published.

Shared access addresses for this kit are [the GitHub template](https://github.com/DTABaker/tigerai-blog-template) and [the public workshop guide](https://dtabaker.github.io/tigerai-blog-template/workshop/). Verify both signed out and record the deployment evidence below before distributing them. The recommended live workshop route is a new project repository named `professional-blog` (or another unused name), preserving existing personal sites.

## Prepare the shared template before the session

### 1. Create a standalone repository

Create a new, public repository for the workshop kit in the account that will maintain it. Use `main` as the default branch for the supplied workflow.

Extract the source ZIP first. Upload the **contents** of `tigerai-blog-template` to the repository's root, preserving the folder structure; do not upload the ZIP itself. Use the source files from the distribution, not a local build output folder. If using a browser, choose **Add file → Upload files** and upload folders and root files; check the resulting tree before continuing. GitHub's [file-upload documentation](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) describes the browser flow and limits.

Verify these root paths in GitHub:

```text
.github/workflows/pages.yml
assets/
content/
docs/
scripts/
templates/
package.json
package-lock.json
README.md
LICENSE
```

The enclosing `tigerai-blog-template/` directory must not become another layer inside the repository. Do not upload `node_modules/`, `dist/`, screenshots, test outputs, or temporary build folders. They are not needed for the source template.

Pay particular attention to **`.github/workflows/pages.yml`**. A file picker may hide or skip dot-prefixed folders. If needed, create that exact file path with **Add file → Create new file** and paste the supplied workflow contents unchanged. Confirm that the **Actions** tab lists **Deploy blog**. Confirm `.gitignore` is also present at the root; it prevents a future local editor from accidentally tracking build output and installed packages.

### 2. Enable template and Pages settings

In **Settings → General**, enable **Template repository**. This requires repository administration access. [GitHub's template-setting instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)

In **Settings → Pages**, select **GitHub Actions** as the source. Run **Actions → Deploy blog → Run workflow** on `main`. Open the completed run and then **Settings → Pages → Visit site**. Keep `templateMode: true` in the shared kit; its default content should remain instructional.

Record the actual addresses in your own event notes:

| What participants need | Fill in before the event |
| --- | --- |
| Shared GitHub template repository | `https://github.com/DTABaker/tigerai-blog-template` — verify signed out |
| Live starter and workshop guide | `https://dtabaker.github.io/tigerai-blog-template/` and its `/workshop/` page — verify signed out |
| Participant guide | The repository's `docs/WORKSHOP.md` or the live workshop guide |
| Help contact for this event | The contact route you choose to offer |

Do not distribute placeholder URLs as if they were live destinations. A local preview or a private preview that requires ChatGPT sign-in is not the public participant destination. Test the actual shared template and GitHub Pages workshop URLs in a signed-out or private browser window before sending event materials.

### 3. Rehearse the participant journey

Make a fresh copy with **Use this template** in a new, separate project repository. Use `professional-blog` or another unused name. Work through the [participant guide](WORKSHOP.md) in a browser. Do not change an existing personal blog, its repository, or its Pages settings.

- Confirm a new copy can deploy after Pages is set to GitHub Actions.
- Confirm a project-site address includes its repository path and that navigation and images still work.
- Continue on the fresh copy's own live **Workshop** page and personalize its homepage with a downloaded setup file.
- Wait for the deployment, reload that copy's `/setup/`, and confirm it contains the new values. Check that updating one field preserves the others.
- Publish a real test post, then check the archive search, tags, and post page.
- Try an intentional, harmless settings typo; confirm the build message identifies it, then repair the file.
- Set the real post to `draft: false` and `template: false`, then switch `templateMode` to `false`. Confirm the real post stays visible and the flagged sample posts and projects disappear from the generated site, feed, and sitemap.
- Confirm a site without published projects leads readers to its writing and has a usable empty Projects page.
- Open the site on a phone and with keyboard navigation.
- Restore the shared template's instructional state if you used it for any rehearsal edits.

These are preparation checks, not a claim that they have already been executed against your GitHub account.

### Event GO or NO-GO preflight

Fill in this record for the event. Do not mark a check complete using a local build or private preview as the only evidence.

| Required evidence | Record the actual value or result |
| --- | --- |
| Event date and person running the rehearsal | Fill in before the event |
| Public shared template repository URL; **Use this template** available | Fill in URL and check result |
| Public demo URL and its `/workshop/` URL; both open signed out | Fill in URLs and check result |
| Fresh template-copy repository URL and successful latest Actions-run URL | Fill in both URLs |
| Required live project-site rehearsal: repository path, navigation, and image links working | Fill in project-site rehearsal URL and result |
| Generator's root-path regression check | Record command, version, and result; this is local test evidence only |
| Own-site studio upload, one real post, and launch hiding demonstrated | Record rehearsal date and result |
| Laptop/network/account access checked; source ZIP and guide available | Record result and where backups are held |
| Plan B and helper contact route | Fill in before the event |

**GO for the recommended project-site workshop:** the shared links are public and a fresh template copy has completed the project-site deployment and editing journey. **NO-GO for promising live publication:** any required access or deployment check remains unverified or fails. Resolve it before the event, or explicitly run a writing-and-demo session using the backup plan below. A green local build is useful evidence about the kit, but does not establish GitHub account permissions or public deployment.

**Optional advanced root user-site route:** the generator supports a root URL, but a live root-site rehearsal is a separate check and is not required for the project-site workshop. Record it as **unverified** until a fresh root deployment has actually succeeded under a separate account without an existing site. Record that site's URL, successful Actions-run URL, and navigation/image checks before teaching this route as rehearsed. Never replace an existing personal blog merely to run this test.

### 4. Reduce day-of friction

Ask participants beforehand to create or sign into GitHub, verify their account email, bring a laptop, and bring a short description of a real project or learning experience. A few private notes about context, one useful detail, and a takeaway reduce writing time during the session. Use a separate project site for everyone in the live workshop. Ask them to choose another unused project name if `professional-blog` already exists; existing personal blogs stay unchanged.

Have the template URL visible in large text and make the worksheet available. Keep a copy of the source ZIP and the guide available if network access is unreliable. Arrange helpers so people who get stuck signing in do not miss every later step.

## The 90-minute run of show

| Time | Lead demonstration | Participant action | Checkpoint |
| --- | --- | --- | --- |
| 0–10 min | Show the starter and explain audience, evidence, and the four GitHub terms | Choose an audience and first-post idea | One-sentence focus and real topic |
| 10–25 min | Create a template copy, set Pages source, start Deploy blog | Create their own repository and deploy | Starter website opens |
| 25–40 min | Switch to each participant's own studio; download `site.yml`, upload into `content/`, commit | Replace name, headline, introduction, and links | Personal homepage is live |
| 40–60 min | Use the post builder; upload a unique `.md` file, explain front matter, edit, preview, publish | Write and publish a few focused paragraphs | Post opens from Writing |
| 60–75 min | Edit short About and Résumé text; defer project and PDF options | Replace essential profile text; remove unused sections | Core profile is accurate |
| 75–85 min | Check finished post flags and profile pages; edit only `templateMode` to launch | Pair review, fix issues, hide flagged samples when ready | Own post stays visible; sample cards disappear |
| 85–90 min | Show the difference between repository and website URLs | Save live URL and choose one next improvement | A usable link and a realistic next step |

The time blocks total 90 minutes. Keep the first publication simple; students can improve visual detail after they can edit and publish reliably.

## Teach the repeatable editing loop

Demonstrate the same small loop each time: **open the right file → change text → preview or review the diff → commit → check Actions → refresh the live page**. Independent edits can be committed while a prior build runs; wait for the latest run at each checkpoint rather than after every file. Do not make a participant pause for an uploaded draft's deployment before opening it to write.

Say the file path aloud and keep the browser's repository owner visible. Beginners can accidentally edit the instructor's repository or upload a file one folder too high. Explain that a downloaded file is not yet saved to GitHub and a commit is not yet a finished deployment.

After initial publication, have everyone open **Workshop** on their own live site. The studio's settings come from whichever site serves it. For later updates, have participants reload their own `/setup/` after the latest deployment and verify their current details. Downloading from the instructor's studio or a stale tab can replace personalized settings with defaults. During launch, demonstrate changing only `templateMode` with GitHub's pencil editor.

Use the studio as the main route in the live demonstration. Direct YAML edits and copying `templates/post.md` remain useful alternatives in the guide, but teaching both routes at once adds unnecessary steps. Source sample files may remain in the repository: `templateMode: false` hides posts and projects marked `template: true` while leaving their public source files available. Deleting them is optional follow-up cleanup.

Use a deliberately modest writing example. A well-explained lesson from a course can be useful. Avoid modeling fabricated metrics, titles, testimonials, or research outcomes just to make the demo look impressive.

## When someone falls behind

If sign-in or account verification blocks a participant, let them prepare their introduction and first post in a private document while a helper resolves access. If GitHub is unavailable, demonstrate the prepared site and practice the text changes locally in that document; publication remains unfinished until the participant can use GitHub.

If a build fails, ask for the exact **first useful error message** and the file path. Fix one issue at a time. Use [troubleshooting](TROUBLESHOOTING.md); do not ask the participant to recreate the repository as a first response.

If time is short, prioritize a live homepage, concise About and Résumé text, and one real post. Defer projects, PDFs, images, and source-file cleanup. Let the participant keep template mode on and finish the checklist afterward if profile prompts remain. Do not ask them to present an unfinished template as a finished professional site. Launch mode hides flagged post/project samples; it does not fix the profile pages for them.

## Optional extensions after the session

- Add a project page with a public artifact and an honest account of the student's contribution.
- Add an image with useful alternative text and a caption in nearby prose.
- Review the résumé PDF and the website together for consistency.
- Use the [AI helper prompts](AI-PROMPTS.md) to revise supplied facts while preserving the file format.
- Invite a peer outside the student's field to explain what they understood from the homepage.

Custom domains, major redesigns, and analytics are outside the core 90-minute workflow. They can be separate follow-up topics after the basic editing process is comfortable.

## Completion evidence

Ask each participant to show their actual website URL, their own introductory text, and a published post. A green build alone does not establish that the content is ready for a résumé. Use the [worksheet's launch checklist](WORKSHEET.md#launch-checklist) for content and reader experience too.

The design inspiration and source documentation are recorded in [provenance](PROVENANCE.md). GitHub's interface can change; rehearse the linked official steps again before each event.
