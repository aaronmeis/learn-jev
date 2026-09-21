# Learn Jev

Personal **GitHub Pages** learning hub for **Jev** (TypeSafe AI’s System One model): typed decisions for software — concepts, sources, decks, and related Almeida / RLHF “assistance vs automation” material.

**Not** a one-day-mastery product site. Timed study notes are in the library as reference only.

Pattern: [research-insight-hub-shell](https://github.com/aaronmeis) / [learn-aero-IP-law](https://aaronmeis.github.io/learn-aero-IP-law/) split-scene SPA.

## Local preview

```powershell
cd C:\projects\learn-jev
python -m http.server 8765
# open http://localhost:8765
```

`app.js` fetches `content.json` — use HTTP, not `file://`.

## Refresh from vault + output

After new NotebookLM downloads (especially Jev slides/shorts):

```powershell
powershell -ExecutionPolicy Bypass -File C:\projects\learn-jev\scripts\sync-from-output.ps1
```

Then update `content.json` `decks` / `media` if new files appear (e.g. set `jev-overview` `slide_count`).

## Layout

| Path | Contents |
|------|----------|
| `notes/jev/` | Glossary, mind map, ledger, blocks, mission |
| `reports/jev/` | Staged NotebookLM source markdown |
| `reports/almeida/` | Related briefings + Calibration Blueprint PDF |
| `decks/almeida-rlhf/` | 15-slide related deck (JPG) |
| `decks/jev-overview/` | Reserved for Jev W8 slides |
| `visuals/` | Concept diagrams |
| `media/` | Related audio overview |

## GitHub Pages

```powershell
cd C:\projects\learn-jev
git init
git add .
git commit -m "Initial learn-jev hub (Jev reference + related Almeida pack)"
gh repo create aaronmeis/learn-jev --public --source=. --remote=origin --push
# Settings → Pages → Deploy from branch main / root
```

Expected URL: `https://aaronmeis.github.io/learn-jev/`

## Disclaimer

Unofficial personal learning materials. Not affiliated with TypeSafe AI. See [DISCLAIMER.md](./DISCLAIMER.md).
