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

  async function loadContent() {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load content.json");
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
      (d) => (d.slides && d.slides.length) || (d.slide_count && d.slide_count > 0)
    ).length;
    const deckConfigured = (data.decks || []).length;
    return {
      decks: decks || deckConfigured,
      visuals: (data.visuals || []).length,
      reports: (data.library || []).length,
      media:
        (data.media?.video ? 1 : 0) +
        (data.media?.audio ? 1 : 0) +
        (data.overview?.hero_media ? 1 : 0),
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
      items.push({ id: `deck-${d.id}`, label: d.nav_label || d.title || d.id });
    });

    if (data.media?.video || data.media?.audio) {
      items.push({ id: "media", label: "Media" });
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
      <article class="card topic-card">
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
        <div class="stat-card"><div class="n">${stats.decks}</div><div class="l">Presentations</div></div>
        <div class="stat-card"><div class="n">${stats.visuals}</div><div class="l">Visuals</div></div>
        <div class="stat-card"><div class="n">${stats.reports}</div><div class="l">Library items</div></div>
        <div class="stat-card"><div class="n">${stats.media}</div><div class="l">Media files</div></div>
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

  function renderLibrary(data) {
    const items = data.library || [];
    if (!items.length) {
      return `<p class="section-desc">Add PDFs/PPTX paths under <code>content.json → library</code>.</p>`;
    }
    return `
      <p class="section-desc">Deep report first; slick pack for executives.</p>
      <ul class="file-list">
        ${items
          .map(
            (f) => `
          <li class="file-item">
            <div>
              <a href="${escapeHtml(f.file)}" target="_blank" rel="noopener">${escapeHtml(
                f.title
              )}</a>
              ${f.note ? `<div class="meta">${escapeHtml(f.note)}</div>` : ""}
            </div>
            <span class="badge">${escapeHtml(f.type || "FILE")}</span>
          </li>`
          )
          .join("")}
      </ul>`;
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

  function renderMedia(data) {
    const parts = [];
    if (data.media?.video) {
      const v = data.media.video;
      parts.push(`
        <div class="media-block">
          <h3>${escapeHtml(v.title || "Video")}</h3>
          <p class="section-desc" style="margin:0.4rem 0 0">${escapeHtml(v.caption || "")}</p>
          <video src="${escapeHtml(v.file)}" controls playsinline></video>
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
      blocks.push(`
        <section class="panel" id="deck-${escapeHtml(deck.id)}">
          <h2 class="section-title">${escapeHtml(deck.title || deck.nav_label || deck.id)}</h2>
          ${renderDeck(deck)}
        </section>`);
    });

    if (data.media?.video || data.media?.audio) {
      blocks.push(`
        <section class="panel" id="media">
          <h2 class="section-title">Media</h2>
          ${renderMedia(data)}
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

    document.addEventListener("click", (e) => {
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

  document.addEventListener("DOMContentLoaded", init);
})();
