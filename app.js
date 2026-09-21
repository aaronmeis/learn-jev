/**
 * Research Insight Hub shell — renders content.json into the split-scene SPA.
 * Fill content.json, drop files under reports/, visuals/, decks/, media/.
 */
(function () {
  const state = {
    data: null,
    activeSection: "overview",
    deckIndex: {},
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function assetUrl(rel) {
    // Resolve against the page URL so GitHub Pages project roots
    // (…/learn-jev/ and …/learn-jev/index.html) both work.
    return new URL(rel, window.location.href).toString();
  }

  async function loadContent() {
    const res = await fetch(assetUrl("content.json"), { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not load content.json (${res.status})`);
    return res.json();
  }

  function modePill(mode) {
    return mode === "learn" ? "Learning Resource" : "Company / Research Insight";
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function countStats(data) {
    const decks = (data.decks || []).filter(
      (d) =>
        (Array.isArray(d.slides) && d.slides.length > 0) ||
        (Number(d.slide_count) || 0) > 0
    ).length;
    const shorts = Array.isArray(data.media?.shorts) ? data.media.shorts.length : 0;
    const longformMedia =
      (data.media?.video ? 1 : 0) +
      (data.media?.audio ? 1 : 0) +
      (data.overview?.hero_media ? 1 : 0);
    return {
      decks,
      shorts,
      visuals: (data.visuals || []).length,
      reports: (data.library || []).length,
      media: longformMedia,
      sources: Array.isArray(data.sources) ? data.sources.length : 0,
    };
  }

  function buildNav(data) {
    const nav = $("#nav-links");
    const items = [
      { id: "overview", label: "Overview" },
      { id: "visuals", label: "Visual Assets" },
      { id: "library", label: "Research Library" },
    ];

    (data.decks || []).forEach((d) => {
      const hasSlides =
        (Array.isArray(d.slides) && d.slides.length > 0) ||
        (Number(d.slide_count) || 0) > 0;
      if (!hasSlides) return; // hide pending empty decks from nav (law-site style)
      items.push({ id: `deck-${d.id}`, label: d.nav_label || d.title || d.id });
    });

    if (Array.isArray(data.media?.shorts) && data.media.shorts.length) {
      items.push({ id: "shorts", label: "Shorts" });
    }
    if (data.media?.video || data.media?.audio) {
      items.push({ id: "media", label: "Media" });
    }
    if (Array.isArray(data.sources) && data.sources.length) {
      items.push({ id: "sources", label: "Sources" });
    }

    nav.innerHTML = items
      .map(
        (it, i) =>
          `<li class="nav-item${i === 0 ? " active" : ""}" data-target="${escapeHtml(
            it.id
          )}" role="button" tabindex="0">${escapeHtml(it.label)}</li>`
      )
      .join("");
  }

  function imgOrMissing(src, alt, className = "thumb") {
    if (!src) {
      return `<div class="${className} missing">Add image</div>`;
    }
    return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(
      alt || ""
    )}" loading="lazy" data-fallback="1">`;
  }

  function renderOverview(data) {
    const stats = countStats(data);
    const cards = (data.overview?.cards || [])
      .map(
        (c) => `
      <article class="card" data-jump="${escapeHtml(c.target || "overview")}">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.body)}</p>
      </article>`
      )
      .join("");

    const topics = (data.overview?.topics || [])
      .map(
        (t) => `
      <article class="topic-card">
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.body)}</p>
      </article>`
      )
      .join("");

    const heroMedia = data.overview?.hero_media
      ? `<div class="media-block" style="margin-top:1.25rem">
          <video src="${escapeHtml(data.overview.hero_media)}" controls playsinline></video>
         </div>`
      : "";

    return `
      <div class="hero">
        <span class="pill">${escapeHtml(modePill(data.mode))}</span>
        <h2>${escapeHtml(data.hub_title || data.display_name)}</h2>
        <p>${escapeHtml(data.tagline || "")}</p>
      </div>
      <div class="intro-card">
        <p>${escapeHtml(data.overview?.blurb || "")}</p>
        ${
          data.audience
            ? `<p style="margin-top:0.85rem"><strong style="color:var(--text)">Audience:</strong> ${escapeHtml(
                data.audience
              )}</p>`
            : ""
        }
        ${heroMedia}
      </div>
      <div class="stats-row">
        <div class="stat-card" data-jump="deck-jev-overview"><div class="n">${stats.decks}</div><div class="l">Presentations</div></div>
        <div class="stat-card" data-jump="shorts"><div class="n">${stats.shorts}</div><div class="l">Shorts (~30s)</div></div>
        <div class="stat-card" data-jump="visuals"><div class="n">${stats.visuals}</div><div class="l">Visuals</div></div>
        <div class="stat-card" data-jump="library"><div class="n">${stats.reports}</div><div class="l">Library items</div></div>
        <div class="stat-card" data-jump="media"><div class="n">${stats.media}</div><div class="l">Long-form media</div></div>
        <div class="stat-card" data-jump="sources"><div class="n">${stats.sources}</div><div class="l">Sources</div></div>
      </div>
      ${topics ? `<h3 style="margin:0 0 0.75rem;font-size:1.05rem">Focus areas</h3><div class="grid">${topics}</div>` : ""}
      <h3 style="margin:0 0 0.75rem;font-size:1.05rem">Explore</h3>
      <div class="grid">${cards}</div>
    `;
  }

  function renderVisuals(data) {
    const items = data.visuals || [];
    if (!items.length) {
      return `<p class="section-desc">Add entries to <code>content.json → visuals</code> and drop PNGs under <code>visuals/</code>.</p>`;
    }
    return `
      <p class="section-desc">Click any asset for a large lightbox view.</p>
      <div class="asset-grid">
        ${items
          .map(
            (v, i) => `
          <article class="asset-card" data-visual-index="${i}">
            ${imgOrMissing(v.file, v.title)}
            <div class="asset-info">
              <h4>${escapeHtml(v.title)}</h4>
              <p>${escapeHtml(v.caption || "")}</p>
            </div>
          </article>`
          )
          .join("")}
      </div>`;
  }

  function libraryViewerUrl(item) {
    if (item.html) return item.html;
    const file = item.file || "";
    const lower = file.toLowerCase();
    if (lower.endsWith(".html")) return file;
    if (lower.endsWith(".md")) return file.replace(/\.md$/i, ".html");
    if (lower.endsWith(".pdf")) return file;
    return "";
  }

  function renderLibrary(data) {
    const items = data.library || [];
    if (!items.length) {
      return `<p class="section-desc">Add PDFs/PPTX paths under <code>content.json → library</code>.</p>`;
    }
    const firstView = items.map(libraryViewerUrl).find(Boolean) || "";
    return `
      <p class="section-desc">Click a document to read it here. HTML notes open in the reader; PDFs embed when possible. Binary downloads stay one click away.</p>
      <div class="library-layout">
        <ul class="file-list library-list" id="library-list">
          ${items
            .map((f, i) => {
              const view = libraryViewerUrl(f);
              const canView = !!view;
              const openHref = f.source_md || f.file;
              return `
            <li class="file-item${canView ? " is-readable" : ""}" data-library-index="${i}"${
                canView ? ` data-view-url="${escapeHtml(view)}"` : ""
              }>
              <div>
                <button type="button" class="library-open"${
                  canView ? "" : " disabled"
                }>${escapeHtml(f.title)}</button>
                ${f.note ? `<div class="meta">${escapeHtml(f.note)}</div>` : ""}
                <div class="library-actions">
                  <a href="${escapeHtml(openHref)}" target="_blank" rel="noopener">Open file</a>
                  ${
                    f.html && f.source_md
                      ? `<a href="${escapeHtml(f.source_md)}" target="_blank" rel="noopener">Markdown</a>`
                      : ""
                  }
                </div>
              </div>
              <span class="badge">${escapeHtml(f.type || "FILE")}</span>
            </li>`;
            })
            .join("")}
        </ul>
        <div class="library-reader">
          <div class="library-reader-bar">
            <span id="library-reader-title">Select a document</span>
            <a id="library-reader-open" href="#" target="_blank" rel="noopener" hidden>Open in new tab</a>
          </div>
          <iframe id="library-frame" title="Research library reader" src="${escapeHtml(
            firstView
          )}"></iframe>
          <div class="library-reader-empty" id="library-reader-empty"${
            firstView ? " hidden" : ""
          }>Choose an HTML or PDF item from the list to preview it here.</div>
        </div>
      </div>`;
  }

  function resolveSlides(deck) {
    if (Array.isArray(deck.slides) && deck.slides.length) {
      return deck.slides.map((s, i) => {
        if (typeof s === "string") {
          return { file: s, title: `Slide ${i + 1}` };
        }
        return {
          file: s.file,
          title: s.title || `Slide ${i + 1}`,
        };
      });
    }
    const n = Number(deck.slide_count) || 0;
    const pattern = deck.slide_pattern || "Slide{n}.png";
    const folder = (deck.folder || "").replace(/\/$/, "");
    const out = [];
    for (let i = 1; i <= n; i++) {
      const name = pattern.replace("{n}", String(i));
      out.push({
        file: folder ? `${folder}/${name}` : name,
        title: `Slide ${i}`,
      });
    }
    return out;
  }

  function renderDeck(deck) {
    const slides = resolveSlides(deck);
    state.deckIndex[deck.id] = 0;

    const download = deck.download
      ? `<a class="deck-download" href="${escapeHtml(
          deck.download
        )}" target="_blank" rel="noopener">Download deck</a>`
      : "";

    if (!slides.length) {
      return `
        ${download}
        <p class="section-desc">${escapeHtml(deck.description || "")}</p>
        <div class="slideshow">
          <div class="slide active">
            <div class="placeholder">
              Set <code>slide_count</code> + <code>folder</code> (Slide1.png…), or list <code>slides</code> in content.json.
            </div>
          </div>
        </div>`;
    }

    const slidesHtml = slides
      .map(
        (s, i) => `
      <div class="slide${i === 0 ? " active" : ""}" data-slide="${i}">
        <span class="slide-number">${i + 1} / ${slides.length}</span>
        <img src="${escapeHtml(s.file)}" alt="${escapeHtml(s.title)}" loading="${
          i === 0 ? "eager" : "lazy"
        }" data-slide-fallback="1">
        <div class="slide-caption">${escapeHtml(s.title)}</div>
      </div>`
      )
      .join("");

    const dots = slides
      .map(
        (_, i) =>
          `<button type="button" class="dot${
            i === 0 ? " active" : ""
          }" data-deck="${escapeHtml(deck.id)}" data-goto="${i}" aria-label="Slide ${
            i + 1
          }"></button>`
      )
      .join("");

    return `
      ${download}
      <p class="section-desc">${escapeHtml(deck.description || "")}</p>
      <div class="slideshow" data-deck-id="${escapeHtml(deck.id)}">
        ${slidesHtml}
        <button type="button" class="prev" data-deck="${escapeHtml(
          deck.id
        )}" data-delta="-1" aria-label="Previous">❮</button>
        <button type="button" class="next" data-deck="${escapeHtml(
          deck.id
        )}" data-delta="1" aria-label="Next">❯</button>
        <div class="dots">${dots}</div>
      </div>`;
  }

  function renderShorts(data) {
    const shorts = Array.isArray(data.media?.shorts) ? data.media.shorts : [];
    if (!shorts.length) {
      return `<p class="section-desc">No shorts yet. Sync NotebookLM vertical videos into <code>media/shorts/</code>.</p>`;
    }
    const cards = shorts
      .map(
        (s, i) => `
      <article class="short-card" data-short-index="${i}">
        <div class="short-frame">
          <video src="${escapeHtml(s.file)}" controls playsinline preload="metadata"></video>
        </div>
        <div class="short-body">
          <span class="short-badge">~30s</span>
          <h3>${escapeHtml(s.title || s.name || `Short ${i + 1}`)}</h3>
          <p>${escapeHtml(s.caption || "")}</p>
        </div>
      </article>`
      )
      .join("");
    return `
      <p class="section-desc">${escapeHtml(
        data.media?.shorts_intro ||
          "NotebookLM vertical shorts (~30s). One job each — educational motion graphics, not cinematic B-roll."
      )}</p>
      <div class="shorts-grid">${cards}</div>`;
  }

  function renderMedia(data) {
    const parts = [];
    if (data.media?.video) {
      const v = data.media.video;
      parts.push(`
        <div class="media-block">
          <h3>${escapeHtml(v.title || "Video")}</h3>
          <p class="section-desc" style="margin:0.4rem 0 0">${escapeHtml(v.caption || "")}</p>
          <video src="${escapeHtml(v.file)}" controls playsinline></video>
          ${
            v.download
              ? `<p style="margin-top:0.75rem"><a class="deck-download" href="${escapeHtml(
                  v.download
                )}" download>Download video</a></p>`
              : ""
          }
        </div>`);
    }
    if (data.media?.audio) {
      const a = data.media.audio;
      parts.push(`
        <div class="media-block">
          <h3>${escapeHtml(a.title || "Audio")}</h3>
          <p class="section-desc" style="margin:0.4rem 0 0">${escapeHtml(a.caption || "")}</p>
          <audio src="${escapeHtml(a.file)}" controls></audio>
        </div>`);
    }
    if (!parts.length) {
      return `<p class="section-desc">Optional: set media.video / media.audio in content.json.</p>`;
    }
    return parts.join("");
  }

  function renderSources(data) {
    const groups = {};
    (data.sources || []).forEach((s) => {
      const g = s.group || "Sources";
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    });
    const sections = Object.keys(groups)
      .map((g) => {
        const rows = groups[g]
          .map((s) => {
            let link;
            if (s.url && String(s.url).startsWith("#")) {
              const target = String(s.url).slice(1);
              link = `<a href="#" data-jump="${escapeHtml(target)}">${escapeHtml(
                s.title || target
              )}</a>`;
            } else if (s.url) {
              const external = /^https?:\/\//i.test(s.url);
              link = `<a href="${escapeHtml(s.url)}"${
                external ? ' target="_blank" rel="noopener"' : ""
              }>${escapeHtml(s.title || s.url)}</a>`;
            } else {
              link = escapeHtml(s.title || "");
            }
            const note = s.note
              ? `<div class="resource-note">${escapeHtml(s.note)}</div>`
              : "";
            const kind = s.kind
              ? `<span class="badge">${escapeHtml(s.kind)}</span>`
              : "";
            return `<div class="resource-card"><div class="resource-title">${kind} ${link}</div>${note}</div>`;
          })
          .join("");
        return `<h3 style="margin:1.25rem 0 0.75rem">${escapeHtml(g)}</h3><div class="resource-grid">${rows}</div>`;
      })
      .join("");
    const more = data.links?.sources_md
      ? `<p class="section-desc" style="margin-top:1.25rem">Full ledger: <a href="${escapeHtml(
          data.links.sources_md
        )}" target="_blank" rel="noopener">sources.md</a></p>`
      : `<p class="section-desc" style="margin-top:1.25rem">Full ledger: <a href="sources.md" target="_blank" rel="noopener">sources.md</a></p>`;
    return `
      <p class="section-desc">${escapeHtml(
        data.sources_intro ||
          "Primary docs and named references this hub is built from. Prefer these over marketing claims."
      )}</p>
      ${sections || "<p class=\"section-desc\">Add sources[] in content.json.</p>"}
      ${more}`;
  }

  function renderFooter(data) {
    const links = [];
    if (data.links?.github) {
      links.push(`<a href="${escapeHtml(data.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
    }
    if (data.links?.notebooklm) {
      links.push(
        `<a href="${escapeHtml(data.links.notebooklm)}" target="_blank" rel="noopener">NotebookLM</a>`
      );
    }
    if (data.links?.zotero) {
      links.push(
        `<a href="${escapeHtml(data.links.zotero)}" target="_blank" rel="noopener">Zotero</a>`
      );
    }
    links.push(`<a href="sources.md" target="_blank" rel="noopener">Sources</a>`);
    return `
      <p>${escapeHtml(data.disclaimer || "")}</p>
      <p style="margin-top:0.5rem">Researched as of <strong>${escapeHtml(
        data.researched_as_of || "—"
      )}</strong>
      ${links.length ? " · " + links.join(" · ") : ""}</p>`;
  }

  function mountPanels(data) {
    const root = $("#panels");
    const blocks = [];

    blocks.push(`
      <section class="panel active" id="overview">
        <h2 class="section-title">Overview</h2>
        ${renderOverview(data)}
      </section>`);

    blocks.push(`
      <section class="panel" id="visuals">
        <h2 class="section-title">Strategic Visual Assets</h2>
        ${renderVisuals(data)}
      </section>`);

    blocks.push(`
      <section class="panel" id="library">
        <h2 class="section-title">Research Library</h2>
        ${renderLibrary(data)}
      </section>`);

    (data.decks || []).forEach((deck) => {
      const hasSlides =
        (Array.isArray(deck.slides) && deck.slides.length > 0) ||
        (Number(deck.slide_count) || 0) > 0;
      if (!hasSlides) return;
      blocks.push(`
        <section class="panel" id="deck-${escapeHtml(deck.id)}">
          <h2 class="section-title">${escapeHtml(deck.title || deck.nav_label || deck.id)}</h2>
          ${renderDeck(deck)}
        </section>`);
    });

    if (Array.isArray(data.media?.shorts) && data.media.shorts.length) {
      blocks.push(`
        <section class="panel" id="shorts">
          <h2 class="section-title">Jev shorts (~30s)</h2>
          ${renderShorts(data)}
        </section>`);
    }

    if (data.media?.video || data.media?.audio) {
      blocks.push(`
        <section class="panel" id="media">
          <h2 class="section-title">Media</h2>
          ${renderMedia(data)}
        </section>`);
    }

    if (Array.isArray(data.sources) && data.sources.length) {
      blocks.push(`
        <section class="panel" id="sources">
          <h2 class="section-title">Sources &amp; references</h2>
          ${renderSources(data)}
        </section>`);
    }

    root.innerHTML = blocks.join("");
    $("#site-footer").innerHTML = renderFooter(data);
  }

  function showSection(id) {
    state.activeSection = id;
    $$(".panel").forEach((p) => p.classList.toggle("active", p.id === id));
    $$(".nav-item").forEach((n) =>
      n.classList.toggle("active", n.getAttribute("data-target") === id)
    );

    if (id === "library") {
      const active = $("#library-list .file-item.active.is-readable");
      const first = $("#library-list .file-item.is-readable");
      const target = active || first;
      if (target) {
        const frame = $("#library-frame");
        const url = target.getAttribute("data-view-url");
        if (frame && url && (!frame.getAttribute("src") || frame.getAttribute("src") === "#")) {
          frame.src = url;
        }
        const titleEl = $("#library-reader-title");
        const btn = target.querySelector(".library-open");
        if (titleEl && btn) titleEl.textContent = btn.textContent.trim();
        const open = $("#library-reader-open");
        if (open && url) {
          open.hidden = false;
          open.href = url;
        }
        target.classList.add("active");
      }
    }

    const title =
      $(`.nav-item[data-target="${CSS.escape(id)}"]`)?.textContent?.trim() || "Overview";
    $("#topbar-title").textContent = title;

    const crumb = $("#breadcrumb");
    if (id === "overview") {
      crumb.classList.remove("visible");
    } else {
      crumb.classList.add("visible");
      crumb.innerHTML = `<a data-jump="overview">Home</a><span>▸</span><span class="current">${escapeHtml(
        title
      )}</span>`;
    }

    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showDeckSlide(deckId, index) {
    const host = $(`.slideshow[data-deck-id="${CSS.escape(deckId)}"]`);
    if (!host) return;
    const slides = $$(".slide", host);
    if (!slides.length) return;
    const n = slides.length;
    const i = ((index % n) + n) % n;
    state.deckIndex[deckId] = i;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    $$(".dot", host).forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  function openLightbox(visual) {
    const lb = $("#lightbox");
    $("#lightbox-img").src = visual.file || "";
    $("#lightbox-img").alt = visual.title || "";
    $("#lightbox-title").textContent = visual.title || "";
    $("#lightbox-desc").textContent = visual.caption || "";
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    $("#lightbox").classList.remove("active");
    document.body.style.overflow = "";
  }

  function openSidebar() {
    $(".sidebar").classList.add("open");
    $("#overlay").classList.add("show");
  }

  function closeSidebar() {
    $(".sidebar").classList.remove("open");
    $("#overlay").classList.remove("show");
  }

  function bindEvents(data) {
    const home = $("#sidebar-home");
    if (home) {
      const goHome = () => showSection("overview");
      home.addEventListener("click", goHome);
      home.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goHome();
        }
      });
    }

    $("#nav-links").addEventListener("click", (e) => {
      const item = e.target.closest(".nav-item");
      if (!item) return;
      showSection(item.getAttribute("data-target"));
    });

    $("#nav-links").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest(".nav-item");
      if (!item) return;
      e.preventDefault();
      showSection(item.getAttribute("data-target"));
    });

    function openLibraryItem(itemEl) {
      if (!itemEl) return;
      const url = itemEl.getAttribute("data-view-url");
      if (!url) return;
      const frame = $("#library-frame");
      const empty = $("#library-reader-empty");
      const title = $("#library-reader-title");
      const open = $("#library-reader-open");
      if (frame) frame.src = url;
      if (empty) empty.hidden = true;
      if (title) {
        const btn = itemEl.querySelector(".library-open");
        title.textContent = btn ? btn.textContent.trim() : "Document";
      }
      if (open) {
        open.hidden = false;
        open.href = url;
      }
      $$("#library-list .file-item").forEach((el) =>
        el.classList.toggle("active", el === itemEl)
      );
    }

    // Auto-select first readable library item when opening library
    const firstReadable = $("#library-list .file-item.is-readable");
    if (firstReadable) openLibraryItem(firstReadable);

    document.addEventListener("click", (e) => {
      const libItem = e.target.closest("#library-list .file-item.is-readable");
      if (libItem && (e.target.closest(".library-open") || e.target === libItem || e.target.closest(".file-item > div"))) {
        if (!e.target.closest(".library-actions a")) {
          e.preventDefault();
          openLibraryItem(libItem);
          return;
        }
      }

      const jump = e.target.closest("[data-jump]");
      if (jump) {
        showSection(jump.getAttribute("data-jump"));
        return;
      }

      const asset = e.target.closest("[data-visual-index]");
      if (asset) {
        const idx = Number(asset.getAttribute("data-visual-index"));
        const visual = (data.visuals || [])[idx];
        if (visual) openLightbox(visual);
        return;
      }

      const deltaBtn = e.target.closest("[data-delta]");
      if (deltaBtn) {
        const deckId = deltaBtn.getAttribute("data-deck");
        const delta = Number(deltaBtn.getAttribute("data-delta"));
        showDeckSlide(deckId, (state.deckIndex[deckId] || 0) + delta);
        return;
      }

      const goto = e.target.closest("[data-goto]");
      if (goto) {
        showDeckSlide(goto.getAttribute("data-deck"), Number(goto.getAttribute("data-goto")));
      }
    });

    $("#close-lightbox").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        closeSidebar();
        return;
      }
      if (!$("#lightbox").classList.contains("active")) {
        const active = state.activeSection;
        if (active.startsWith("deck-")) {
          const deckId = active.replace(/^deck-/, "");
          if (e.key === "ArrowLeft") showDeckSlide(deckId, (state.deckIndex[deckId] || 0) - 1);
          if (e.key === "ArrowRight") showDeckSlide(deckId, (state.deckIndex[deckId] || 0) + 1);
        }
      }
    });

    $("#hamburger").addEventListener("click", openSidebar);
    $("#overlay").addEventListener("click", closeSidebar);

    // Image fallbacks (missing assets show a clear placeholder)
    document.addEventListener(
      "error",
      (e) => {
        const t = e.target;
        if (!(t instanceof HTMLImageElement)) return;
        if (t.dataset.fallback === "1") {
          const ph = document.createElement("div");
          ph.className = "thumb missing";
          ph.textContent = "Missing file";
          t.replaceWith(ph);
          return;
        }
        if (t.dataset.slideFallback === "1") {
          const ph = document.createElement("div");
          ph.className = "placeholder";
          ph.textContent = `Missing: ${t.getAttribute("src") || "slide"}`;
          t.replaceWith(ph);
        }
      },
      true
    );
  }

  function applyChrome(data) {
    document.documentElement.setAttribute("data-theme", data.theme === "light" ? "light" : "dark");
    document.title = `${data.hub_title || data.display_name || "Insight Hub"}`;
    $("#brand-short").textContent = data.brand_short || data.display_name || "INSIGHT HUB";
    $("#brand-sub").textContent =
      data.mode === "learn" ? "Personal learning hub" : "Research insight hub";
    $("#topbar-title").textContent = "Overview";
  }

  async function init() {
    try {
      const data = await loadContent();
      state.data = data;
      // Debug handle for local verification
      window.__LEARN_JEV_DATA__ = data;
      applyChrome(data);
      buildNav(data);
      mountPanels(data);
      bindEvents(data);
      showSection("overview");
    } catch (err) {
      console.error(err);
      $("#panels").innerHTML = `
        <section class="panel active">
          <h2 class="section-title">Setup required</h2>
          <div class="intro-card">
            <p>Could not load <code>content.json</code>. Serve this folder over HTTP (GitHub Pages, or <code>python -m http.server</code>) — <code>fetch</code> fails on some <code>file://</code> browsers.</p>
            <p style="margin-top:0.75rem;color:var(--muted)">${escapeHtml(err.message)}</p>
          </div>
        </section>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
