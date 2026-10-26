# Blog content

One folder per article, one Markdown file per language:

```
src/content/blog/<translation-id>/en.md
src/content/blog/<translation-id>/ru.md
... ja, ko, zh, tr, fr, pt
```

Frontmatter: `title`, `description` (max 200 chars), `slug` (lowercase-hyphenated, unique per language), `published` (YYYY-MM-DD), optional `updated`, optional `draft: true`.

The build fails if an article is published without all eight editions, or if only some editions are drafts. Keep every edition `draft: true` until all eight are written and reviewed. Never publish machine filler to reach eight.
