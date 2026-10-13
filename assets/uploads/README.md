# Your images and optional résumé PDF

Upload your own public-facing files into this folder. Use short, lowercase filenames with hyphens, such as `project-overview.jpg` or `resume.pdf`. Keep filenames exactly consistent with the links in your writing.

In a post or project Markdown file, add an image like this:

```markdown
![Describe the useful information shown in your image.](/assets/uploads/project-overview.jpg)
```

The example is syntax guidance only; no file named `project-overview.jpg` is supplied. Do not leave this example in a published post unless you upload a matching image and write appropriate alternative text.

For a downloadable résumé, upload `resume.pdf`, then set this field in `content/site.yml`:

```yaml
resumePdf: "/assets/uploads/resume.pdf"
```

Leave `resumePdf: ""` if you do not want a PDF link. The website's text résumé works without a PDF.

Review files before uploading. Uploaded source files are public in a public repository, even if you do not link to them. Keep a copy of originals outside the repository; use a compressed copy of images for the web. Prefer JPG, PNG, or WebP for workshop images.
