// =========================================================
// DEFAULT NEWS (ไม่งอกมั่ว / ไม่เขียนทับ localStorage)
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

// =========================================================
// NEWS (อ่านจาก localStorage เท่านั้น / ถ้าว่างค่อยโชว์ DEFAULT)
// =========================================================
function safeParseJSON(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

// ✅ เวลาของ DEFAULT ให้คงที่ (ไม่เปลี่ยนทุกรีเฟรช)
const DEFAULT_TIME_KEY = "ihave_default_time";
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
  return list.map(x => ({ ...x, time: (x.time && String(x.time).trim()) ? x.time : t }));
}

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
  const fixed = list.map(x => {
    if (!x?.id) {
      changed = true;
      return { ...x, id: Date.now() + Math.floor(Math.random() * 100000) };
    }
    return x;
  });

  if (changed) setNews(fixed);
})();
