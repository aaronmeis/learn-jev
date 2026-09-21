# Learn Jev

Personal **GitHub Pages** learning hub for **Jev** (TypeSafe AI’s System One model): typed decisions for software.

**Live:** https://aaronmeis.github.io/learn-jev/

**Not** a one-day-mastery product site. Study-pack notes are reframed as an untimed reference library (cheatsheet, topic guide, deep notes).

Pattern: research-insight-hub-shell / [learn-aero-IP-law](https://aaronmeis.github.io/learn-aero-IP-law/) split-scene SPA.

## What’s on the hub

- **Jev overview** — PNG slideshow + PPTX download + full presentation **MP4**
- **Shorts** — six ~30s NotebookLM vertical explainers
- **Media** — overview video + NEXUS audio
- **Library** — cheatsheet, topic guide, NEXUS reports/study guide/playbook, PDFs
- **Sources** — in-app references panel + [`sources.md`](./sources.md) ledger

## Local preview

```powershell
cd C:\projects\learn-jev
python -m http.server 8765
# open http://localhost:8765
```

`app.js` fetches `content.json` — use HTTP, not `file://`.

## Refresh from vault + output

```powershell
powershell -ExecutionPolicy Bypass -File C:\projects\learn-jev\scripts\sync-from-output.ps1
```

Then adjust `content.json` if new decks/media appear, commit, and update `gh-pages`.

## Layout

| Path | Contents |
|------|----------|
| `notes/jev/` | Cheatsheet, topic guide, glossary, mind map, deep notes |
| `reports/jev/` | Decision Layer PDF + `notebooklm/` NEXUS docs |
| `reports/jev-overview.pptx` | Slide deck PPTX |
| `decks/jev-overview/` | PNG slides for clean in-browser presentation |
| `media/jev-overview-presentation.mp4` | Full overview presentation video |
| `media/shorts-nblm/` | NEXUS-titled ~30s shorts |
| `media/shorts/` | Stable-named shorts copies |
| `reports/almeida/` + `decks/almeida-rlhf/` | Related Almeida / RLHF pack |
| `sources.md` | Canonical source & reference ledger |
| `visuals/` | Concept diagrams + NBLM infographic |

## GitHub Pages

Landing URL serves **`index.html`** as the SPA.

- Deploy branch: `gh-pages` (root)
- After content changes: push `master`, then `git checkout gh-pages && git reset --hard master && git push -f origin gh-pages`

## Disclaimer

Unofficial personal learning materials. Not affiliated with TypeSafe AI. See [DISCLAIMER.md](./DISCLAIMER.md).
