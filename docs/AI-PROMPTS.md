# Optional AI help for your blog

You can complete the workshop without an AI tool. If you use one, supply your own facts, review its output, and keep private information out of prompts. Ask for a small edit, then compare the result before changing your file. You remain responsible for the accuracy of the finished site.

The bracketed phrases in these prompts are instructions for you to replace. They are not content to publish.

## Turn your notes into a clear introduction

```text
Help me write the introduction for my professional blog. Use only the facts
I provide below. Do not invent a job title, qualification, employer, award,
skill level, project result, or future achievement. If a fact is missing,
ask me or leave it out. Keep developing interests distinct from expertise.

My intended audience: [describe the reader]
My current role or field: [provide accurate facts]
My interests: [provide accurate facts]
What this site will contain: [describe your actual plan]

Give me a short headline and a two- or three-sentence introduction in plain
language. Keep my voice and avoid grand claims. Afterward, list any statement
that you think I should verify before publishing.
```

Copy the approved text into the matching settings fields or the setup form. Do not paste the AI's entire response into `content/site.yml`.

## Edit a post while preserving its format

```text
Edit the Markdown post below for clarity and flow. Preserve the front-matter
keys exactly: title, description, date, tags, featured, draft, template.
Keep valid YAML between the two opening --- lines. Keep the date as a quoted
YYYY-MM-DD string, tags as an array of strings, and booleans as unquoted
true or false. Preserve the supplied date; do not invent a replacement.
Keep draft: true while I review the result. Do not change template to false
until I have replaced all instructional content and verified the writing.

Use only the facts I supply. Do not invent sources, quotations, results,
numbers, credentials, or experiences. Keep my contribution distinct from
team outcomes and label plans as plans. Flag gaps after the Markdown rather
than filling them with plausible guesses. Use ordinary Markdown, no HTML
or scripts. Give the revised file in one code block, then a short review list.

[paste your complete post, including its front matter]
```

Copy only the file content inside the code block, without its opening and closing backticks. Check the date, links, claims, and writing yourself before setting `draft: false` and `template: false`.

## Make a project description more useful

```text
Help me explain this real project to a reader outside my field. Use only the
facts below. Separate the problem, my contribution, the approach, the actual
outcome, limitations, and possible next steps. If evidence is missing, say
what information I should add. Do not invent metrics, client names, awards,
tools used, or a successful outcome. Preserve uncertainty and credit others.

Context and dates: [your facts]
My role and collaborators: [your facts]
What I actually did: [your facts]
Evidence or shareable artifact: [your checked source or description]
Outcome and limits: [your facts]

Return a concise outline I can fill in, followed by questions about missing
information. Do not write as though the outline's prompts are completed work.
```

## Improve an image description

```text
Help me write useful alternative text for an image in my blog. Describe what
matters for the reader's understanding, using only the image or description
I supply. Do not infer people, data values, or conclusions that are not visible.

The surrounding paragraph: [paste the relevant paragraph]
What the image shows: [attach an image you can share or describe it accurately]
Why it is included: [explain its purpose]

Suggest concise alternative text. If a chart needs a longer explanation,
suggest what to include in the surrounding prose separately.
```

## Understand a build error

```text
I am using the TigerAI blog template and editing through GitHub in a browser.
Help me understand the following error. First name the file and field involved,
then explain the smallest correction. Do not rewrite the whole project, change
the workflow, add dependencies, or suggest deleting my repository. If there is
not enough information, tell me exactly what additional non-sensitive text
to inspect. Preserve the existing field names and valid YAML/Markdown.

Error from the latest Actions run: [paste the exact error]
Relevant file path: [paste the path]
Relevant non-sensitive lines: [paste the few relevant lines]
```

Compare advice with the [field reference](CUSTOMIZE.md) and [troubleshooting guide](TROUBLESHOOTING.md). A confident answer can still be wrong. Never paste passwords, tokens, private data, or another person's private information into a debugging prompt.

## Review before publishing

Read your final page out loud. Open the sources and links yourself. Remove generated claims that you cannot substantiate, and check that the page still sounds like you. The [launch checklist](WORKSHEET.md#launch-checklist) is the final step even when an AI tool helped with editing.
