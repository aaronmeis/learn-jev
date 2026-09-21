"""Convert Learn Jev markdown notes to standalone HTML for iframe reading."""
from __future__ import annotations

import json
import re
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content.json"

CSS = """
:root {
  --bg: #f8fafc;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #2563eb;
  --border: #e2e8f0;
  --code-bg: #f1f5f9;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  height: auto;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.65;
}
.wrap {
  max-width: 820px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}
h1, h2, h3, h4 {
  line-height: 1.25;
  color: var(--text);
}
h1 { font-size: 1.75rem; margin: 0 0 1rem; }
h2 { font-size: 1.35rem; margin: 1.75rem 0 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.35rem; }
h3 { font-size: 1.1rem; margin: 1.35rem 0 0.5rem; color: var(--accent); }
p, li { color: var(--text); }
a { color: var(--accent); }
code, pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: var(--code-bg);
  border-radius: 6px;
}
code { padding: 0.1rem 0.35rem; font-size: 0.9em; }
pre { padding: 0.9rem 1rem; overflow: auto; border: 1px solid var(--border); }
pre code { padding: 0; background: transparent; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.92rem;
  background: var(--card);
}
th, td {
  border: 1px solid var(--border);
  padding: 0.55rem 0.65rem;
  text-align: left;
  vertical-align: top;
}
th { background: var(--code-bg); }
blockquote {
  margin: 1rem 0;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 4px solid var(--accent);
  color: var(--muted);
}
hr { border: 0; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.meta {
  color: var(--muted);
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
.frontmatter {
  display: none;
}
"""


def strip_frontmatter(text: str) -> tuple[str, str]:
    if not text.startswith("---"):
        return "", text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return "", text
    return parts[1].strip(), parts[2].lstrip("\n")


def rewrite_md_links(html: str) -> str:
    # Point relative .md links to sibling .html for in-iframe navigation
    return re.sub(
        r'href="([^"]+)\.md(#[^"]*)?"',
        lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"',
        html,
    )


def convert_file(md_path: Path) -> Path:
    raw = md_path.read_text(encoding="utf-8")
    _fm, body = strip_frontmatter(raw)
    # Obsidian wikilinks -> plain text / anchors
    body = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", body)
    body = re.sub(r"\[\[([^\]]+)\]\]", r"\1", body)
    # Callout-ish markers
    body = re.sub(r"^> \[!(\w+)\][^\n]*\n", r"> **\1**\n", body, flags=re.M)

    html_body = markdown.markdown(
        body,
        extensions=[
            "tables",
            "fenced_code",
            "toc",
            "sane_lists",
            "smarty",
        ],
    )
    html_body = rewrite_md_links(html_body)
    title = md_path.stem
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html_body, flags=re.I | re.S)
    if m:
        title = re.sub(r"<[^>]+>", "", m.group(1)).strip() or title

    out = md_path.with_suffix(".html")
    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>{CSS}</style>
</head>
<body>
  <main class="wrap">
    <div class="meta">Learn Jev · rendered from {md_path.name}</div>
    {html_body}
  </main>
</body>
</html>
"""
    out.write_text(doc, encoding="utf-8")
    return out


def main() -> None:
    data = json.loads(CONTENT.read_text(encoding="utf-8"))
    paths: set[Path] = set()
    for item in data.get("library", []):
        f = item.get("file") or ""
        if f.lower().endswith(".md"):
            paths.add(ROOT / f)
    # Always include sources.md
    paths.add(ROOT / "sources.md")

    converted = []
    for md in sorted(paths):
        if not md.is_file():
            print("skip missing", md)
            continue
        out = convert_file(md)
        converted.append(out.relative_to(ROOT).as_posix())
        # Point library entries at HTML for reading
        rel_md = md.relative_to(ROOT).as_posix()
        rel_html = out.relative_to(ROOT).as_posix()
        for item in data.get("library", []):
            file_norm = str(item.get("file") or "").replace("\\", "/")
            if file_norm == rel_md or item.get("file") == rel_md:
                item["file"] = rel_md
                item["html"] = rel_html
                item["source_md"] = rel_md
                # Keep type readable; viewer uses html
                if item.get("type") in {"MD", "HTML", None, ""}:
                    item["type"] = "HTML"

    # Prefer sources.html in library if present as sources.md
    for item in data.get("library", []):
        if item.get("file") == "sources.md":
            item["html"] = "sources.html"
            item["source_md"] = "sources.md"
            item["type"] = "HTML"

    CONTENT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"converted {len(converted)} files")
    for c in converted:
        print(" ", c)


if __name__ == "__main__":
    main()
