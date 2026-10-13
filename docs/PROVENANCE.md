# Provenance and scope

## Design reference

This workshop kit takes inspiration from [dtabaker.github.io](https://dtabaker.github.io/) and its [public source repository](https://github.com/DTABaker/DTABaker.github.io): an editorial introduction, featured writing, an archive, and a personal biography help readers navigate a professional profile.

The kit is a fresh implementation with its own layout code, instructional placeholders, and teaching materials. It does not copy the reference site's personal writing, résumé, images, or achievements. The reference was used as a design example, not as a source of participant identity or experience. No permission to reuse unrelated source-site material should be inferred from this kit's MIT license.

## What the kit provides

- A static professional website generated from a small settings file and Markdown content.
- A GitHub Actions workflow for deployment to GitHub Pages, including project-site paths.
- Browser-only editing instructions and a 90-minute facilitator plan.
- Instructional sample posts and projects, clearly marked as templates and hidden from the generated site when workshop mode is turned off.
- A setup form that generates downloadable files for the user to upload; it is not a connected publishing service.

The default `2026-01-01` content dates are sample metadata. Placeholder text is guidance about what to write, not evidence of real work. Participants must supply and verify their own content.

## Primary documentation

The workshop's GitHub instructions were checked against these official sources on **October 12, 2026**. Interface labels and service behavior can change; facilitators should rehearse before each event.

- [Create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template): making an independent copy of the starter.
- [Create a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository): the facilitator's template setting.
- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): repository naming, publication, and the live site address.
- [Use custom workflows with Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): the supplied build and deployment approach.
- [Manually run a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow): the Run workflow control.
- [Edit files](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files): the browser editor and commits.
- [Add files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository): browser uploads.
- [Delete files](https://docs.github.com/en/repositories/working-with-files/managing-files/deleting-files-in-a-repository): removing examples and the distinction between current files and history.

## Publication and verification boundary

Receiving the kit does not create a GitHub repository, enable Pages, or publish a website. Those actions require the participant or facilitator to use their own account and check the resulting workflow and live URL. A successful build verifies that the files can produce a site; it does not verify personal claims, copyright permissions, external sources, or professional readiness.

Before an event, the facilitator's [GO / NO-GO preflight](FACILITATOR.md#event-go-or-no-go-preflight) calls for real public links, signed-out access checks, and a fresh template-copy deployment rehearsal. A local preview or a private preview requiring an account is not evidence that participants can open the workshop or deploy their own copies. Launch mode hides only flagged sample posts and projects, while their source files remain public; participants must replace their profile text and verify their own claims.

The kit's original code and teaching materials use the MIT License supplied in the repository. Participants are responsible for the rights and accuracy of their own writing and uploaded media.
