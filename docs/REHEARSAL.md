# Publication and fresh-copy rehearsal record

**Technical rehearsal completed October 12, 2026, America/Chicago (October 13 UTC).** The recommended project-site workshop route was published and exercised on GitHub Pages. This record describes a particular test, not a guarantee about future service availability or every participant account.

## Share these links with students

- [Public template repository](https://github.com/DTABaker/tigerai-blog-template)
- [Create your own copy](https://github.com/DTABaker/tigerai-blog-template/generate) — sign in to GitHub first
- [Live workshop guide](https://dtabaker.github.io/tigerai-blog-template/workshop/)
- [Starter blog](https://dtabaker.github.io/tigerai-blog-template/)

Participants should create a new `professional-blog` repository, or another unused name, and continue on their own live site's Workshop page after deployment. The shared template retains only instructional placeholders.

## Fresh-copy evidence

The separate [rehearsal repository](https://github.com/DTABaker/tigerai-blog-rehearsal) was generated through GitHub's template-generation endpoint. GitHub identifies `DTABaker/tigerai-blog-template` as its template repository. All 36 initial source files matched the template byte-for-byte by Git blob identity. The [rehearsal website](https://dtabaker.github.io/tigerai-blog-rehearsal/) contains clearly labeled test material, not a student's profile.

| Stage | Observed result | GitHub evidence |
| --- | --- | --- |
| Publish shared template | Successful Pages build and deployment | [Template run](https://github.com/DTABaker/tigerai-blog-template/actions/runs/38339680066) |
| Generate fresh copy and enable Pages | Successful initial deployment | [Fresh-copy run](https://github.com/DTABaker/tigerai-blog-rehearsal/actions/runs/38339737223) |
| Download settings and a draft from the copy's own studio | Personalized settings deployed; draft remained unpublished | [Personalization run](https://github.com/DTABaker/tigerai-blog-rehearsal/actions/runs/38340002093) |
| Reload studio, change one field, and publish first post | Download changed only the accent; published post, search, topic filter, and image worked | [First-post run](https://github.com/DTABaker/tigerai-blog-rehearsal/actions/runs/38340130022) |
| Commit an intentionally invalid accent in the rehearsal copy | Build failed and deployment was skipped; three previous live page hashes remained unchanged | [Expected failed run](https://github.com/DTABaker/tigerai-blog-rehearsal/actions/runs/38340256064) |
| Repair accent and set `templateMode: false` | Successful deployment; own post retained and flagged samples hidden | [Recovery and launch run](https://github.com/DTABaker/tigerai-blog-rehearsal/actions/runs/38340322679) |

The intentional failure named the affected setting: `content/site.yml → accent: Choose teal, blue, or plum.` The shared template's first automatic push run also started before Pages was enabled and failed at reading the Pages address. Enabling Pages and manually running the supplied workflow resolved that setup-order issue without changing workflow code; the participant guide describes this case.

## Checks completed

- Anonymous access to the shared repository, starter, and workshop; all checked local page, asset, and anchor links retained the project path.
- Live browser settings and post downloads; exact preservation of unchanged settings on a later one-field edit. Reloading the studio after deployment is necessary to avoid a cached earlier form, as the guide instructs.
- Draft exclusion, a published first post, search, topic filtering, and a loaded uploaded image with alt text.
- Failed-build recovery, with the previous Home, post, and Setup HTML hashes preserved while the bad source was present.
- Launch mode: one finished post in the feed; sample posts and projects removed from lists, feed, sitemap, and generated routes; source files retained. Sample URLs returned 404. A site without projects directed visitors to Writing and displayed a useful empty Projects page.
- Final studio showed the personalized name, `plum` accent, and workshop mode off after reload.
- Browser checks of keyboard navigation and the mobile menu, and no horizontal overflow on the checked 320-pixel Home and Writing views. No console errors were observed in the tested interactions.
- Node 24 regression tests covering both root and project paths; successful Linux GitHub Actions builds using the supplied workflow.

Repository creation, Pages configuration, and commits used GitHub's API and Git. The live studio, downloads, search, navigation, and reload behavior were exercised in a browser. This was not a timed session with first-time participants or a complete click-through of GitHub's browser editor. Venue internet, participant sign-in, and helper availability remain event-specific checks.

## Existing blog and scope

This task made no writes to `DTABaker/DTABaker.github.io`; its Pages URL, source branch/path, build type, custom-domain setting, and HTTPS setting were unchanged. Its branch advanced during the session from `6f1fa508e80bacb007ca439f6a65c4f76f6bfc5c` to `955904fd08dfcd601f97d50c8f610b6c84ba3a83`, with the separate commit “Publish Gen Chem II lab practice tool” at `2026-10-13T03:04:20Z`. That work was preserved. An exact unchanged-branch claim would therefore be incorrect.

The live rehearsal used a separate project-site path. Root-path behavior passed local regression checks, but no new root user-site deployment was attempted because an existing blog already occupies that address. The root route remains an optional separately rehearsed extension, not the recommended workshop path.

Before each event, use the [facilitator preflight](FACILITATOR.md#event-go-or-no-go-preflight) to recheck access and event logistics. Workflow logs may expire according to GitHub's retention settings.
