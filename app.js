console.log("app.js RUNNING ✅");

(function () {
  const $ = (s) => document.querySelector(s);

  // ===== Storage Keys =====
  const HERO_KEY = "ihave_article_hero";
  const GALLERY_KEY = "ihave_gallery_all";
  const NEWS_KEY = "ihave_news_items";
  const ADMIN_KEY = "ihave_is_admin";
  const FEATURED_KEY = "ihave_featured_id";
  const COMMENTS_KEY = "ihave_comments_map";
  const DEFAULT_TIME_KEY = "ihave_default_time";

  // ===== Menu active =====
  const page = (document.body.getAttribute("data-page") || "").trim();
  document.querySelectorAll(".nav a[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });

  // ===== Utils =====
  function escapeHTML(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function norm(s) {
    return String(s || "").trim().toLowerCase();
  }
  function safeParseJSON(str, fallback) {
    try {
      const v = JSON.parse(str);
      return v ?? fallback;
    } catch {
      return fallback;
    }
  }

  // ===== Admin helpers =====
  function isAdmin() {
    return localStorage.getItem(ADMIN_KEY) === "1";
  }
  function setAdmin(v) {
    localStorage.setItem(ADMIN_KEY, v ? "1" : "0");
  }

  // =========================================================
  // HERO MAP (article + category banner via gallery)
  // =========================================================
  function getHeroMap() {
    return safeParseJSON(localStorage.getItem(HERO_KEY) || "{}", {});
  }
  function setHeroMap(map) {
    localStorage.setItem(HERO_KEY, JSON.stringify(map || {}));
  }
  function applyHeroIfAny() {
    const map = getHeroMap();
    ["article1", "article2", "tech", "game", "sport"].forEach((t) => {
      const el = document.querySelector(`#hero-${t}`);
      if (el && map[t]) el.innerHTML = `<img src="${map[t]}" alt="hero-${escapeHTML(t)}">`;
    });
  }
  applyHeroIfAny();

  // =========================================================
  // GALLERY (optional page)
  // =========================================================
  const fileInput = $("#imgInput");
  const preview = $("#preview");
  const clearBtn = $("#clearGallery");
  const articlePick = $("#articlePick");

  function getGalleryAll() {
    return safeParseJSON(localStorage.getItem(GALLERY_KEY) || "[]", []);
  }
  function setGalleryAll(arr) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
  }
  function renderGallery() {
    if (!preview) return;
    preview.innerHTML = "";
    getGalleryAll().forEach((src) => {
      const box = document.createElement("div");
      box.className = "imgbox";
      box.innerHTML = `<img src="${src}" alt="uploaded">`;
      preview.appendChild(box);
    });
  }
  function readAsDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  if (fileInput) {
    renderGallery();
    fileInput.addEventListener("change", async () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) return;

      const target = (articlePick?.value || "article1").trim();
      const all = getGalleryAll();
      let lastDataUrl = null;

      for (const f of files) {
        if (f.size > 900 * 1024) {
          alert(`ไฟล์ "${f.name}" ใหญ่เกินไป (แนะนำ < 900KB)`);
          continue;
        }
        const dataUrl = await readAsDataURL(f);
        all.push(dataUrl);
        lastDataUrl = dataUrl;
      }

      setGalleryAll(all);

      if (lastDataUrl) {
        const map = getHeroMap();
        map[target] = lastDataUrl;
        setHeroMap(map);
        alert(`ตั้งรูปให้ ${target} แล้ว ✅`);
      }

      renderGallery();
      applyHeroIfAny();
      fileInput.value = "";
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(GALLERY_KEY);
      localStorage.removeItem(HERO_KEY);
      if (preview) preview.innerHTML = "";
      alert("ล้างรูปทั้งหมดแล้ว ✅");
      applyHeroIfAny();
    });
  }

  // =========================================================
  // DEFAULT NEWS (โชว์ได้ แต่ไม่เขียนลง localStorage)
  // =========================================================
  const DEFAULT_NEWS = [
    // TECH
    {
      id: 900101,
      title: "GPU ราคาลงจริง? รุ่นกลางเริ่มหลุด MSRP",
      excerpt: "สรุปเหตุผลที่ราคาการ์ดจอเริ่มยอมลง + รุ่นไหนน่าโดนตอนนี้",
      category: "tech",
      link: "article1.html",
      tag: "HOT",
      img: "https://images.nvidia.com/geforce-com/international/images/geforce-rtx-50-series/geforce-rtx-50-series-ogimage.jpg",
      heroId: "",
      time: ""
    },
    {
      id: 900102,
      title: "SSD NVMe รุ่นคุ้ม 2026: อ่าน/เขียนแรง แต่ไม่ร้อน",
      excerpt: "เทียบ Gen4/Gen5 + เลือกให้เหมาะกับเกม/งานตัดต่อ",
      category: "tech",
      link: "article2.html",
      tag: "NEW",
      img: "https://www.kingston.com/dynamic-assets/consumer/hero/ssd/hero-ssd-nv2.jpg",
      heroId: "",
      time: ""
    },

    // GAME
    {
      id: 900201,
      title: "แพตช์ใหม่ยิงปืน: รีคอยล์โดนเนิร์ฟ/บัฟแบบยกชุด",
      excerpt: "เปลี่ยน meta ยังไง + ปืน/สกิลที่ควรหยิบเล่นตอนนี้",
      category: "game",
      link: "article1.html",
      tag: "HOT",
      img: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/7ce603b55808320bd1a367fc224eba50845bab0c-1920x1080.jpg?auto=format&fit=fill&q=80&w=1184",
      heroId: "",
      time: ""
    },
    {
      id: 900202,
      title: "เกมเอาตัวรอดมาแรง: เล่นกับเพื่อนแล้วโคตรมัน",
      excerpt: "รวม 5 เกม Survival ที่คนสตรีมเล่นเยอะ + ข้อดีข้อเสีย",
      category: "game",
      link: "article2.html",
      tag: "NEW",
      img: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg",
      heroId: "",
      time: ""
    },

    // SPORT
    {
      id: 900301,
      title: "เกมเดือดเมื่อคืน: พลิกท้ายเกมแบบโคตรช็อก",
      excerpt: "สรุปไฮไลต์ + จุดเปลี่ยนสำคัญ + ใครเล่นโหดสุด",
      category: "sport",
      link: "article1.html",
      tag: "HOT",
      img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60",
      heroId: "",
      time: ""
    },
    {
      id: 900302,
      title: "โปรแกรมนัดถัดไป: งานยาก/งานง่ายของแต่ละทีม",
      excerpt: "วิเคราะห์คู่แข่ง + ความฟิต + ใครเสี่ยงโดนดรอป",
      category: "sport",
      link: "article2.html",
      tag: "NEW",
      img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=60",
      heroId: "",
      time: ""
    },

    // ARTICLES
    {
      id: 900401,
      title: "RTX 50 Series ก้าวกระโดด GPU ยุคใหม่",
      excerpt: "วิเคราะห์สถาปัตยกรรม ราคา และผลกระทบตลาด",
      category: "article",
      link: "article1.html",
      tag: "ART 1",
      img: "https://www.iphone-droid.net/wp-content/uploads/2024/04/nvidia-rtx-50-series-could-launch-in-q4-2024-0.jpg",
      heroId: "",
      time: ""
    },
    {
      id: 900402,
      title: "AI-PC & เทรนด์คอมปี 2026 ที่คนประกอบต้องรู้",
      excerpt: "สรุปเทรนด์ของแรง: NPU/AI Engine, เลือกคอมให้คุ้ม ไม่หลงสเปก",
      category: "article",
      link: "article2.html",
      tag: "ART 2",
      img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=60",
      heroId: "",
      time: ""
    }
  ];

  // ✅ เวลาของ DEFAULT ให้คงที่ (ไม่เปลี่ยนทุกรีเฟรช)
  function getDefaultTime() {
    let t = localStorage.getItem(DEFAULT_TIME_KEY);
    if (!t) {
      t = new Date().toLocaleString("th-TH");
      localStorage.setItem(DEFAULT_TIME_KEY, t);
    }
    return t;
  }
  function withDefaultTime(list) {
    const t = getDefaultTime();
    return list.map((x) => ({
      ...x,
      time: (x.time && String(x.time).trim()) ? x.time : t
    }));
  }

  // =========================================================
  // NEWS (อ่านจาก localStorage เท่านั้น / ว่างค่อยโชว์ DEFAULT)
  // =========================================================
  function getNews() {
    const rawStr = localStorage.getItem(NEWS_KEY);

    // ✅ ยังไม่เคยมีข่าวของผู้ใช้เลย → โชว์ default (แต่ "ไม่เขียนลง localStorage")
    if (!rawStr) return withDefaultTime(DEFAULT_NEWS).slice();

    const raw = safeParseJSON(rawStr, []);
    return (Array.isArray(raw) && raw.length) ? raw : withDefaultTime(DEFAULT_NEWS).slice();
  }
  function setNews(list) {
    localStorage.setItem(NEWS_KEY, JSON.stringify(Array.isArray(list) ? list : []));
  }

  // =========================================================
  // ensureIds (ทำเฉพาะตอน localStorage มีข่าวจริงๆ เท่านั้น)
  // =========================================================
  (function ensureIds() {
    const rawStr = localStorage.getItem(NEWS_KEY);
    if (!rawStr) return;

    const list = safeParseJSON(rawStr, []);
    if (!Array.isArray(list) || list.length === 0) return;

    let changed = false;
    const fixed = list.map((x) => {
      if (!x?.id) {
        changed = true;
        return { ...x, id: Date.now() + Math.floor(Math.random() * 100000) };
      }
      return x;
    });

    if (changed) setNews(fixed);
  })();

  // =========================================================
  // Featured / delete
  // =========================================================
  window.deleteNews = function (id) {
    if (!confirm("ลบข่าวนี้จริงไหม?")) return;
    const list = safeParseJSON(localStorage.getItem(NEWS_KEY) || "[]", []).filter(
      (item) => Number(item.id) !== Number(id)
    );
    setNews(list);

    const fid = Number(localStorage.getItem(FEATURED_KEY) || 0);
    if (fid && fid === Number(id)) localStorage.removeItem(FEATURED_KEY);

    location.reload();
  };

  window.setFeatured = function (id) {
    localStorage.setItem(FEATURED_KEY, String(Number(id)));
    alert("ตั้งเป็นข่าวเด่นแล้ว ⭐");
    location.reload();
  };

  // ===== DOM lists =====
  const listHome = $("#newsListHome");
  const listTech = $("#newsListTech");
  const listGame = $("#newsListGame");
  const listSport = $("#newsListSport");
  const listArticle = $("#newsListArticle");

  // ===== Overlay tag =====
  function overlayTagHTML(tagText) {
    const t = String(tagText || "").trim();
    const tn = norm(t);
    let cls = "";
    if (tn === "hot") cls = "hot";
    else if (tn === "new") cls = "new";
    else cls = "new"; // ART หรืออื่นๆ ใช้โทน new ไปก่อน
    const label = t ? t.toUpperCase() : "NEW";
    return `<span class="overlay-tag ${cls}">${escapeHTML(label)}</span>`;
  }

  // ✅ ใส่ nid ให้ลิงก์ (ไว้แยกคอมเมนต์แต่ละข่าว)
  function linkWithNid(link, nid) {
    const href = String(link || "#");
    if (href === "#" || !nid) return href;
    if (href.includes("nid=")) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}nid=${encodeURIComponent(String(nid))}`;
  }

  // ===== Card =====
  function makeCard(item) {
    const a = document.createElement("a");
    a.className = "news";
    a.href = linkWithNid(item.link || "#", item.id);

    const map = getHeroMap();

    // ✅ รูป: img (ลิงก์ตรง) → heroId (จาก gallery) → ไม่มีรูป
    const img = item.img || ((item.heroId && map[item.heroId]) ? map[item.heroId] : null);

    const tagBadge = overlayTagHTML(item.tag);

    const thumbHTML = img
      ? `<div class="thumb">${tagBadge}<img src="${escapeHTML(img)}" alt="thumb"></div>`
      : `<div class="thumb">${tagBadge}</div>`;

    const adminBtns = isAdmin()
      ? `
        <button type="button" class="tag" style="margin-left:8px"
          onclick="(function(e){e.preventDefault();e.stopPropagation(); window.setFeatured(${Number(item.id)});})(arguments[0]||window.event);">
          ⭐ เด่น
        </button>
        <button type="button" class="deleteBtn" title="ลบข่าวนี้"
          onclick="(function(e){ e.preventDefault(); e.stopPropagation(); window.deleteNews(${Number(item.id)}); })(arguments[0] || window.event);">
          ❌
        </button>`
      : ``;

    a.innerHTML = `
      ${thumbHTML}
      <div style="flex:1;">
        <h3>${escapeHTML(item.title)}</h3>
        <div class="meta">${escapeHTML(item.category)} • ${escapeHTML(item.time)}</div>
        <p class="excerpt">${escapeHTML(item.excerpt)}</p>
      </div>
      ${adminBtns}
    `;
    return a;
  }

  function fillList(el, items, emptyText = "ยังไม่มีข่าว") {
    if (!el) return;
    el.innerHTML = "";
    const arr = items.slice().reverse();
    if (!arr.length) {
      el.innerHTML = `<div class="tag">${escapeHTML(emptyText)}</div>`;
      return;
    }
    arr.forEach((item) => el.appendChild(makeCard(item)));
  }

  // ===== Render lists (category pages) =====
  function renderNews() {
    const all = getNews();
    fillList(listHome, all, "ยังไม่มีข่าว");
    fillList(listTech, all.filter((x) => norm(x.category) === "tech"), "ยังไม่มีข่าวหมวด Tech");
    fillList(listGame, all.filter((x) => norm(x.category) === "game"), "ยังไม่มีข่าวหมวด Game");
    fillList(listSport, all.filter((x) => norm(x.category) === "sport"), "ยังไม่มีข่าวหมวด Sport");
    fillList(listArticle, all.filter((x) => norm(x.category) === "article"), "ยังไม่มีบทความ");
  }

  // ===== Featured (index) =====
  function pickFeatured(all) {
    const fid = Number(localStorage.getItem(FEATURED_KEY) || 0);
    if (fid) {
      const found = all.find((x) => Number(x.id) === fid);
      if (found) return found;
    }
    return all.length ? all[all.length - 1] : null; // fallback ข่าวล่าสุด
  }

  function renderFeatured() {
    const el = $("#featuredNews");
    if (!el) return;

    const all = getNews();
    const item = pickFeatured(all);

    if (!item) {
      el.className = "featured-hero is-fallback";
      el.innerHTML = `
        <div class="fh-img"></div>
        <div class="fh-grad"></div>
        <div class="fh-body">
          <div class="fh-left">
            <div class="fh-top">
              <span class="fh-tag"><span class="dot"></span> FEATURED</span>
              <span class="fh-chip">ยังไม่มีข่าว</span>
            </div>
            <div class="fh-title">ยังไม่มีข่าวเด่น</div>
            <div class="fh-ex">เพิ่มข่าวในระบบก่อน แล้วมันจะขึ้นอัตโนมัติ</div>
          </div>
        </div>
      `;
      return;
    }

    const map = getHeroMap();
    const img = item.img || ((item.heroId && map[item.heroId]) ? map[item.heroId] : null);

    const tag = (item.tag || "HOT").toUpperCase();
    const title = escapeHTML(item.title || "");
    const ex = escapeHTML(item.excerpt || "");
    const meta = `${escapeHTML(item.category || "")} • ${escapeHTML(item.time || "")}`;
    const href = escapeHTML(linkWithNid(item.link || "#", item.id));

    el.className = "featured-hero" + (img ? "" : " is-fallback");
    el.innerHTML = `
      <div class="fh-img">
        ${img ? `<img src="${escapeHTML(img)}" alt="featured">` : ``}
      </div>
      <div class="fh-grad"></div>

      <div class="fh-body">
        <div class="fh-left">
          <div class="fh-top">
            <span class="fh-tag"><span class="dot"></span> ${escapeHTML(tag)}</span>
            <span class="fh-chip">ข่าวเด่น</span>
            ${isAdmin() ? `<span class="fh-chip">⭐ เลือกเด่นได้</span>` : `<span class="fh-chip">อัตโนมัติ</span>`}
          </div>

          <div class="fh-title">${title}</div>
          <div class="fh-meta">${meta}</div>
          <div class="fh-ex">${ex}</div>

          <div class="fh-actions">
            <a class="fh-btn" href="${href}">อ่านต่อ</a>
            <a class="fh-chip" href="all.html" style="text-decoration:none;">ดูข่าวทั้งหมด</a>
          </div>
        </div>
      </div>
    `;
  }

  // ===== Latest (index) =====
  function renderLatest() {
    const list = $("#latestList");
    if (!list) return;

    const items = getNews().slice().reverse().slice(0, 5);
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = `<div class="tag">ยังไม่มีข่าว</div>`;
      return;
    }
    items.forEach((item) => list.appendChild(makeCard(item)));
  }

  // ===== Shortcuts (index right) =====
  function renderShortcuts() {
    const box = $("#shortcutList");
    if (!box) return;

    const all = getNews().slice().reverse();
    const pickOne = (cat) => all.find((x) => norm(x.category) === cat) || null;

    const tech = pickOne("tech");
    const game = pickOne("game");
    const sport = pickOne("sport");

    box.innerHTML = "";
    if (!tech && !game && !sport) {
      box.innerHTML = `<div class="tag">ยังไม่มีข่าว</div>`;
      return;
    }

    if (tech) box.appendChild(makeCard(tech));
    if (game) box.appendChild(makeCard(game));
    if (sport) box.appendChild(makeCard(sport));
  }

  // ===== All News page (filter + pagination lite) =====
  function renderAllPage() {
    const list = $("#allList");
    if (!list) return;

    const badge = $("#allCount");
    const btns = document.querySelectorAll("[data-allfilter]");

    const all = getNews().slice().reverse();
    const cat = norm(localStorage.getItem("ihave_all_filter") || "all");
    const pageNum = Number(localStorage.getItem("ihave_all_page") || 1);
    const perPage = 10;

    btns.forEach((b) =>
      b.classList.toggle("active", norm(b.getAttribute("data-allfilter") || "") === cat)
    );

    const shown = (cat === "all") ? all : all.filter((x) => norm(x.category) === cat);
    if (badge) badge.textContent = `${shown.length} ข่าว`;

    const totalPages = Math.max(1, Math.ceil(shown.length / perPage));
    const safePage = Math.min(Math.max(1, pageNum), totalPages);
    localStorage.setItem("ihave_all_page", String(safePage));

    const start = (safePage - 1) * perPage;
    const slice = shown.slice(start, start + perPage);

    list.innerHTML = "";
    if (!slice.length) {
      list.innerHTML = `<div class="tag">ยังไม่มีข่าวในหมวดนี้</div>`;
    } else {
      slice.forEach((item) => list.appendChild(makeCard(item)));
    }

    const pager = $("#allPager");
    if (pager) {
      pager.innerHTML = `
        <button class="tag" type="button" onclick="window.allPrev()">◀</button>
        <span class="tag">หน้า ${safePage} / ${totalPages}</span>
        <button class="tag" type="button" onclick="window.allNext()">▶</button>
      `;
    }

    window.setAllFilter = function (c) {
      localStorage.setItem("ihave_all_filter", c);
      localStorage.setItem("ihave_all_page", "1");
      renderAllPage();
    };
    window.allPrev = function () {
      localStorage.setItem("ihave_all_page", String(Math.max(1, safePage - 1)));
      renderAllPage();
    };
    window.allNext = function () {
      localStorage.setItem("ihave_all_page", String(Math.min(totalPages, safePage + 1)));
      renderAllPage();
    };
  }

  // =========================================================
  // COMMENTS (แยกตาม nid หรือหน้า)
  // =========================================================
  function getCommentsMap() {
    return safeParseJSON(localStorage.getItem(COMMENTS_KEY) || "{}", {});
  }
  function setCommentsMap(map) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(map || {}));
  }
  function getNidFromURL() {
    const sp = new URLSearchParams(location.search);
    const nid = sp.get("nid");
    return nid ? String(nid) : "";
  }

  function ensureCommentsMount() {
    const article = document.querySelector(".article");
    if (!article) return null;

    if (document.getElementById("ihaveComments")) return document.getElementById("ihaveComments");

    const wrap = document.createElement("div");
    wrap.id = "ihaveComments";
    wrap.style.marginTop = "18px";
    wrap.innerHTML = `
      <hr>
      <div class="section-title" style="margin:0 0 10px 0;">คอมเมนต์</div>

      <div class="card" style="padding:12px;">
        <div id="cList"></div>

        <div style="margin-top:12px; display:grid; gap:8px;">
          <input id="cName" class="input" placeholder="ชื่อ (ไม่ใส่ก็ได้)" style="width:100%; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02); color:inherit;">
          <textarea id="cText" rows="3" class="input" placeholder="พิมพ์คอมเมนต์..." style="width:100%; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02); color:inherit; resize:vertical;"></textarea>
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button id="cSend" class="btn" type="button" style="border:none;">ส่งคอมเมนต์</button>
            <span class="meta" style="opacity:.8;">* คอมเมนต์เก็บในเครื่อง (LocalStorage)</span>
          </div>
        </div>
      </div>
    `;
    article.appendChild(wrap);
    return wrap;
  }

  function renderComments(key) {
    const listEl = document.getElementById("cList");
    if (!listEl) return;

    const map = getCommentsMap();
    const arr = Array.isArray(map[key]) ? map[key] : [];

    if (!arr.length) {
      listEl.innerHTML = `<div class="tag">ยังไม่มีคอมเมนต์</div>`;
      return;
    }

    listEl.innerHTML = "";
    arr.slice().reverse().forEach((c, idxFromEnd) => {
      const idx = arr.length - 1 - idxFromEnd;

      const row = document.createElement("div");
      row.style.padding = "10px";
      row.style.borderRadius = "12px";
      row.style.border = "1px solid rgba(255,255,255,.08)";
      row.style.background = "rgba(255,255,255,.02)";
      row.style.marginBottom = "8px";

      const name = escapeHTML(c.name || "ผู้ชม");
      const time = escapeHTML(c.time || "");
      const text = escapeHTML(c.text || "");

      const delBtn = isAdmin()
        ? `<button class="tag" type="button" style="margin-left:auto;" onclick="window.deleteComment('${escapeHTML(key)}', ${idx})">ลบ</button>`
        : "";

      row.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center;">
          <div style="font-weight:900;">${name}</div>
          <div class="meta">${time}</div>
          ${delBtn}
        </div>
        <div style="margin-top:6px; line-height:1.55;">${text}</div>
      `;
      listEl.appendChild(row);
    });
  }

  window.deleteComment = function (key, idx) {
    if (!isAdmin()) return;
    if (!confirm("ลบคอมเมนต์นี้จริงไหม?")) return;

    const map = getCommentsMap();
    const arr = Array.isArray(map[key]) ? map[key] : [];
    arr.splice(idx, 1);
    map[key] = arr;
    setCommentsMap(map);
    renderComments(key);
  };

  function bindCommentUI() {
    const nid = getNidFromURL();
    const key = nid || (page ? `page:${page}` : "");
    if (!key) return;

    const mount = ensureCommentsMount();
    if (!mount) return;

    const btn = document.getElementById("cSend");
    const nameEl = document.getElementById("cName");
    const textEl = document.getElementById("cText");

    renderComments(key);

    if (btn) {
      btn.onclick = () => {
        const name = (nameEl?.value || "").trim().slice(0, 40);
        const text = (textEl?.value || "").trim().slice(0, 500);
        if (!text) return alert("พิมพ์คอมเมนต์ก่อนดิ้");

        const map = getCommentsMap();
        const arr = Array.isArray(map[key]) ? map[key] : [];

        arr.push({
          name: name || "ผู้ชม",
          text,
          time: new Date().toLocaleString("th-TH"),
        });

        map[key] = arr;
        setCommentsMap(map);

        if (textEl) textEl.value = "";
        renderComments(key);
      };
    }
  }

  // =========================================================
  // ADMIN PAGE
  // =========================================================
  const adminPass = $("#adminPass");
  const adminLoginBtn = $("#adminLoginBtn");
  const adminLogoutBtn = $("#adminLogoutBtn");
  const adminStatus = $("#adminStatus");
  const adminPanel = $("#adminPanel");

  const addForm = $("#addNewsForm");
  const adminList = $("#adminNewsList");

  const ADMIN_PASSWORD = "1234"; // 👈 เปลี่ยนได้

  function updateAdminUI() {
    const ok = isAdmin();
    if (adminStatus) adminStatus.textContent = ok ? "✅ แอดมิน" : "🔒 ผู้ชม";
    if (adminLoginBtn) adminLoginBtn.style.display = ok ? "none" : "inline-flex";
    if (adminLogoutBtn) adminLogoutBtn.style.display = ok ? "inline-flex" : "none";
    if (adminPanel) adminPanel.style.display = ok ? "block" : "none";
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      const pass = (adminPass?.value || "").trim();
      if (pass === ADMIN_PASSWORD) {
        setAdmin(true);
        if (adminPass) adminPass.value = "";
        updateAdminUI();
        alert("เข้าโหมดแอดมินแล้ว ✅");
        location.reload();
      } else {
        alert("รหัสแอดมินผิด ❌");
      }
    });
  }
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      setAdmin(false);
      updateAdminUI();
      alert("ออกจากแอดมินแล้ว");
      location.reload();
    });
  }

  function renderAdminList() {
    if (!adminList) return;
    if (!isAdmin()) return;

    const raw = safeParseJSON(localStorage.getItem(NEWS_KEY) || "[]", []);
    const all = Array.isArray(raw) ? raw.slice().reverse() : [];
    adminList.innerHTML = "";

    if (!all.length) {
      adminList.innerHTML = `<div class="tag">ยังไม่มีข่าวใน localStorage</div>
      <div class="meta" style="margin-top:8px;">* ค่า default ที่โชว์หน้าเว็บ “ไม่ถือว่าเป็นข่าวในระบบ” จนกว่าจะเพิ่มผ่าน Admin</div>`;
      return;
    }

    all.forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-row";
      row.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight:900;">${escapeHTML(item.title)}</div>
          <div class="meta">${escapeHTML(item.category)} • ${escapeHTML(item.time)}</div>
        </div>
        <button class="tag" type="button" onclick="window.setFeatured(${Number(item.id)})">⭐ เด่น</button>
        <button class="tag" type="button" onclick="window.deleteNews(${Number(item.id)})">ลบ</button>
      `;
      adminList.appendChild(row);
    });
  }

  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isAdmin()) return alert("ต้องเป็นแอดมินก่อน");

      const title = ($("#nTitle")?.value || "").trim();
      const excerpt = ($("#nExcerpt")?.value || "").trim();
      const category = ($("#nCategory")?.value || "tech").trim().toLowerCase();
      const link = ($("#nLink")?.value || "#").trim();
      const tag = ($("#nTag")?.value || "NEW").trim();
      const heroId = ($("#nHeroId")?.value || "").trim();
      const img = ($("#nImg")?.value || "").trim(); // ถ้าในฟอร์มมี input id="nImg"
      const time = new Date().toLocaleString("th-TH");

      if (!title) return alert("ต้องใส่หัวข้อข่าวก่อน");

      const raw = safeParseJSON(localStorage.getItem(NEWS_KEY) || "[]", []);
      const list = Array.isArray(raw) ? raw : [];
      list.push({ id: Date.now(), title, excerpt, category, link, tag, heroId, img, time });
      setNews(list);

      addForm.reset();
      alert("เพิ่มข่าวแล้ว ✅");
      location.reload();
    });
  }

  // ===== Run =====
  updateAdminUI();
  renderNews();
  renderFeatured();
  renderLatest();
  renderShortcuts();
  renderAllPage();
  renderAdminList();
  bindCommentUI();
})();
