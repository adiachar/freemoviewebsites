// ⚡ The Fastest App - Interactive Client Engine
import { PLATFORMS, FILTERS } from "./database.js";

// State Management
let currentFilter = "All";
let searchQuery = "";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchSubmitBtn = document.getElementById("search-submit");
const categoriesWrapper = document.getElementById("discover-filters-row");
const heroFiltersWrapper = document.getElementById("hero-filters-row");
const discoverGrid = document.getElementById("discover-grid");
const noMatchesContainer = document.getElementById("no-matches");
const matchesCounterText = document.getElementById("discover-matches-counter");
const platformModal = document.getElementById("platform-modal");

// Pre-rendered custom SVG Icon Objects
const ICONS = {
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide-arrow-up-right transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
};

// 📈 Scroll Reveal Observer Setup
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
);

function initRevealObserver() {
  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });
}

// 🌀 dynamic floating particles generator
function renderParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;
  let html = "";
  for (let i = 0; i < 28; i++) {
    const left = (i * 37) % 100;
    const top = (i * 53) % 100;
    const size = 2 + ((i * 7) % 5);
    const delay = (i % 10) * 0.6;
    const dur = 8 + (i % 6) * 2;
    html += `
      <span class="absolute rounded-full bg-slate-50/60"
            style="left: ${left}%; top: ${top}%; width: ${size}px; height: ${size}px; opacity: 0.25; filter: blur(0.5px); animation: float ${dur}s ease-in-out ${delay}s infinite; box-shadow: 0 0 12px currentColor;">
      </span>
    `;
  }
  container.innerHTML = html;
}

// 🧮 dynamic stats counter cubic ease-out
function initStatsCounters() {
  const elements = document.querySelectorAll(".stat-counter");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.started) {
        e.target.dataset.started = "true";
        const toVal = parseInt(e.target.dataset.target, 10);
        const suffix = e.target.dataset.suffix || "";
        const duration = 1600;
        const start = performance.now();
        const tick = (t) => {
          const progress = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          e.target.textContent = Math.round(toVal * eased).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.3 });
  elements.forEach((el) => obs.observe(el));
}

// 🎨 initials hashing colors palette
function initials(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/(?=[A-Z])|\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function getLogoInitials(name) {
  return initials(name) || name.slice(0, 2).toUpperCase();
}

const PALETTES = [
  ["oklch(0.65 0.25 310)", "oklch(0.70 0.22 220)"],
  ["oklch(0.72 0.22 180)", "oklch(0.65 0.25 310)"],
  ["oklch(0.78 0.18 60)", "oklch(0.62 0.22 25)"],
  ["oklch(0.70 0.22 145)", "oklch(0.72 0.22 200)"],
  ["oklch(0.74 0.20 340)", "oklch(0.68 0.22 260)"],
  ["oklch(0.80 0.16 90)", "oklch(0.70 0.20 30)"],
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function renderLogoHTML(name, size = 56) {
  const txt = getLogoInitials(name);
  const [c1, c2] = PALETTES[hash(name) % PALETTES.length];
  return `
    <div class="relative grid place-items-center rounded-2xl border-gradient overflow-hidden shrink-0"
         style="width: ${size}px; height: ${size}px; background: linear-gradient(135deg, ${c1}, ${c2}); box-shadow: 0 10px 30px -10px ${c1};"
         aria-hidden="true">
      <div class="absolute inset-0 opacity-30" style="background: radial-gradient(circle at 30% 20%, white, transparent 50%);"></div>
      <span class="relative font-display font-bold text-white tracking-tight"
            style="font-size: ${size * 0.38}px;">
        ${txt}
      </span>
    </div>
  `;
}

// 📦 Meter percentage generator
function createMeterHTML(label, value, accent) {
  const color = accent || "var(--aurora-1)";
  return `
    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">${label}</span>
        <span class="font-mono font-semibold text-foreground">${value}</span>
      </div>
      <div class="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
             style="width: ${value}%; background: linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 60%, white)); box-shadow: 0 0 12px ${color};">
        </div>
      </div>
    </div>
  `;
}

// 🎨 Card generator
function createCardHTML(p, rank) {
  const rankStyle = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : null;
  let rankHTML = "";
  if (rank) {
    let styleAttr = "";
    let classNames = "text-foreground bg-secondary";
    if (rankStyle === "gold") {
      styleAttr = 'style="background: var(--gradient-gold); box-shadow: 0 0 24px color-mix(in oklab, var(--gold) 60%, transparent);"';
      classNames = "text-slate-950";
    } else if (rankStyle === "silver") {
      styleAttr = 'style="background: var(--gradient-silver); box-shadow: 0 0 18px color-mix(in oklab, var(--silver) 50%, transparent);"';
      classNames = "text-slate-950";
    } else if (rankStyle === "bronze") {
      styleAttr = 'style="background: var(--gradient-bronze); box-shadow: 0 0 18px color-mix(in oklab, var(--bronze) 50%, transparent);"';
      classNames = "text-slate-950";
    }
    rankHTML = `
      <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold ${classNames}" ${styleAttr}>
        #${rank}
      </span>
    `;
  }

  const badgesHTML = p.badges.slice(0, 4).map(b => {
    let icon = "";
    if (b === "4K") icon = ICONS.shieldCheck;
    if (b === "Fast Servers") icon = ICONS.zap;
    return `
      <span class="inline-flex items-center gap-1 rounded-full border border-border bg-foreground/5 px-2.5 py-0.5 text-[11px] text-foreground/80">
        ${icon} ${b}
      </span>
    `;
  }).join("");

  return `
    <article class="group relative rounded-3xl glass border-gradient p-6 transition-all duration-500 hover:-translate-y-1.5"
             style="box-shadow: var(--shadow-card);">
      <div class="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
           style="background: var(--gradient-primary); filter: blur(40px); opacity: 0; z-index: -1;">
      </div>
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-4">
          ${renderLogoHTML(p.name, 56)}
          <div>
            <h3 class="font-display text-xl font-semibold leading-tight">${p.name}</h3>
            <p class="text-xs text-muted-foreground mt-0.5">${p.tagline}</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          ${rankHTML}
          ${p.premium ? `
            <span class="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider gold-text">
              ${ICONS.star} Premium
            </span>
          ` : ""}
        </div>
      </div>

      <p class="mt-4 text-sm text-muted-foreground line-clamp-2">${p.description}</p>

      <div class="mt-5 grid grid-cols-3 gap-3">
        ${createMeterHTML("Quality", p.quality, "var(--aurora-1)")}
        ${createMeterHTML("Ad-free", p.ads, "var(--aurora-2)")}
        ${createMeterHTML("Speed", p.performance, "var(--aurora-3)")}
      </div>

      <div class="mt-5 flex flex-wrap gap-1.5">
        ${badgesHTML}
      </div>

      <div class="mt-6 flex gap-2">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer"
           class="group/btn relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
           style="background: var(--gradient-primary); box-shadow: var(--shadow-glow);">
          Visit ${ICONS.arrowUpRight}
        </a>
         <button onclick="window.launchPreview('${p.id}')" onmouseenter="window.prefetchImage('${p.id}')"
                 class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-foreground/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/10">
           ${ICONS.eye} Preview
         </button>
      </div>
    </article>
  `;
}

// 🧮 helper to evaluate platform filter match
function matchFilter(p, filter) {
  if (filter === "All") return true;
  if (filter === "Movies") return p.category === "movies" || p.category === "mixed";
  if (filter === "TV Shows") return p.category === "tv" || p.category === "mixed";
  if (filter === "Anime") return p.category === "anime" || p.badges.includes("Anime");
  if (filter === "Trending") return !!p.trending || p.badges.includes("Trending");
  return p.badges.includes(filter);
}

// 🗳️ Core Hydrations
function renderHeroFilters() {
  const wrapper = document.getElementById("hero-filters-row");
  if (!wrapper) return;
  wrapper.innerHTML = FILTERS.map(f => {
    const isActive = currentFilter === f;
    return `
      <button onclick="window.selectCategory('${f}')"
              class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive ? "text-primary-foreground" : "glass text-foreground/80 hover:text-foreground"
              }"
              style="${isActive ? "background: var(--gradient-primary); box-shadow: var(--shadow-glow);" : ""}">
        ${f}
      </button>
    `;
  }).join("");
}

function renderDiscoverFilters() {
  if (!categoriesWrapper) return;
  categoriesWrapper.innerHTML = FILTERS.map(f => {
    const isActive = currentFilter === f;
    return `
      <button onclick="window.selectCategory('${f}')"
              class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive ? "text-primary-foreground" : "glass text-foreground/80 hover:text-foreground"
              }"
              style="${isActive ? "background: var(--gradient-primary); box-shadow: var(--shadow-glow);" : ""}">
        ${f}
      </button>
    `;
  }).join("");
}

function renderDiscoverGrid() {
  const query = searchQuery.toLowerCase().trim();
  const filtered = PLATFORMS.filter(p => matchFilter(p, currentFilter)).filter(p => {
    return query === "" ? true : (
      p.name.toLowerCase().includes(query) ||
      p.tagline.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      p.badges.join(" ").toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  matchesCounterText.textContent = `${filtered.length} platform${filtered.length !== 1 ? "s" : ""} match your criteria.`;

  if (filtered.length === 0) {
    noMatchesContainer.classList.remove("hidden");
    discoverGrid.classList.add("hidden");
  } else {
    noMatchesContainer.classList.add("hidden");
    discoverGrid.classList.remove("hidden");
    discoverGrid.innerHTML = filtered.map(p => createCardHTML(p)).join("");
  }
}

function renderFeaturedSection() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  const premium = PLATFORMS.filter(p => p.premium);
  grid.innerHTML = premium.map((p, i) => createCardHTML(p, i + 1)).join("");
}

function renderFAQ() {
  const wrapper = document.getElementById("faq-accordions-wrapper");
  if (!wrapper) return;
  const items = [
    { q: "What is FreeMovieWebsites?", a: "A handcrafted directory of the best free movie websites on the internet — handpicked, ranked, reviewed, and continuously updated." },
    { q: "How are platforms ranked?", a: "Each platform is scored across three dimensions: video quality, ad cleanliness, and playback performance, then weighted to produce a final ranking." },
    { q: "Do you host any content?", a: "No. FreeMovieWebsites is a directory — every link opens the platform's official website in a new tab. We never host or stream any content ourselves." },
    { q: "How often are listings refreshed?", a: "We re-verify the top 50 platforms weekly and the long tail monthly. New entries are reviewed before being added." },
    { q: "Is it free?", a: "FreeMovieWebsites is completely free to use. There is no signup, no paywall, and no tracking beyond essential analytics." },
    { q: "Are free movie streaming websites safe to use in 2026?", a: "Safety varies by platform. Some sites like Plex operate legally with proper licensing and minimal security risks. However, many free streaming sites contain aggressive ads, pop-ups, and potential security concerns. Using a robust ad blocker, antivirus software, and avoiding sites that request personal information can help protect your device and privacy." },
    { q: "Do I need to create an account to watch movies on these free streaming sites?", a: "Most platforms don't require registration or account creation. Sites like LunaStream, NetPrime, HDToday, and MyFlixer offer instant access without asking for personal details or login credentials. This no-registration approach makes it easier to start streaming immediately." },
    { q: "Can I watch free movies on my mobile device or smart TV?", a: "Yes, nearly all these platforms support mobile viewing through responsive web browsers on iOS and Android devices. Some services like CoreFlix offer dedicated mobile apps, while others like RidoMovies and Soap2Day provide Chromecast support for streaming to smart TVs." },
    { q: "Why do free streaming sites have so many ads and pop-ups?", a: "Advertisements are how free streaming platforms generate revenue to cover operating costs and content hosting. While some sites like NetPrime are ad-free, most free services display ads, pop-ups, or redirects. Using browser extensions like uBlock Origin or Brave browser can significantly reduce interruptions." },
    { q: "What streaming quality can I expect from free movie websites?", a: "Quality varies by platform and specific titles. Many sites offer multiple resolutions from 480p to 1080p HD, with some like MyFlixer and HDToday providing 4K content on select titles. Actual quality depends on your internet speed and the platform's server performance." }
  ];

  wrapper.innerHTML = items.map((it, i) => `
    <div class="rounded-2xl glass border-gradient overflow-hidden transition-all mt-3 max-w-3xl mx-auto">
      <button onclick="window.toggleFAQ(${i})"
              class="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded="${i === 0 ? 'true' : 'false'}"
              id="faq-btn-${i}">
        <span class="font-display text-base sm:text-lg font-semibold">${it.q}</span>
        <svg id="faq-icon-${i}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${i === 0 ? 'rotate-45 text-foreground' : ''}"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <div id="faq-content-${i}" class="grid transition-all duration-500 ease-out" style="grid-template-rows: ${i === 0 ? '1fr' : '0fr'};">
        <div class="overflow-hidden">
          <p class="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">${it.a}</p>
        </div>
      </div>
    </div>
  `).join("");
}

window.toggleFAQ = function(index) {
  const content = document.getElementById(`faq-content-${index}`);
  const btn = document.getElementById(`faq-btn-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  const isExpanded = btn.getAttribute("aria-expanded") === "true";
  
  const allFAQs = document.querySelectorAll("[id^='faq-content-']");
  allFAQs.forEach((el, i) => {
    if (i !== index) {
      el.style.gridTemplateRows = "0fr";
      const ob = document.getElementById(`faq-btn-${i}`);
      const oi = document.getElementById(`faq-icon-${i}`);
      if (ob) ob.setAttribute("aria-expanded", "false");
      if (oi) oi.classList.remove("rotate-45", "text-foreground");
    }
  });

  if (isExpanded) {
    content.style.gridTemplateRows = "0fr";
    btn.setAttribute("aria-expanded", "false");
    icon.classList.remove("rotate-45", "text-foreground");
  } else {
    content.style.gridTemplateRows = "1fr";
    btn.setAttribute("aria-expanded", "true");
    icon.classList.add("rotate-45", "text-foreground");
  }
};

// 📊 Render SEO Comparison Table (detailed platforms)
function renderComparisonTable() {
  const tbody = document.getElementById("comparison-table-body");
  if (!tbody) return;
  const detailed = PLATFORMS;
  tbody.innerHTML = detailed.map(p => {
    let adBadge = "";
    if (p.ads >= 90) adBadge = `<span class="inline-flex items-center gap-1 text-emerald-400 font-medium">${ICONS.shieldCheck} \u{1F60A} Excellent</span>`;
    else if (p.ads >= 80) adBadge = `<span class="inline-flex items-center gap-1 text-amber-400 font-medium">${ICONS.zap} \u{1F610} Moderate</span>`;
    else adBadge = `<span class="inline-flex items-center gap-1 text-rose-400 font-medium">${ICONS.alert} \u26A0\uFE0F Heavy Ads</span>`;
    return `
      <tr class="hover:bg-foreground/5 transition-colors">
        <td class="p-4 sm:p-5"><div class="flex items-center gap-3">${renderLogoHTML(p.name, 32)}<span class="font-display font-semibold text-white">${p.name}</span></div></td>
        <td class="p-4 sm:p-5 text-foreground/80">${p.regRequired || "No"}</td>
        <td class="p-4 sm:p-5">${adBadge}</td>
        <td class="p-4 sm:p-5 text-right"><div class="inline-flex gap-2">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/5 border border-border px-3 text-xs font-semibold hover:bg-foreground/10 transition-colors">Visit ${ICONS.arrowUpRight}</a>
          <button onclick="window.launchPreview('${p.id}')" onmouseenter="window.prefetchImage('${p.id}')" class="inline-flex h-8 items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors">${ICONS.eye} Review</button>
        </div></td>
      </tr>`;
  }).join("");
}


// ⚡ High-performance image prefetcher on hover
const prefetchedImages = new Set();
window.prefetchImage = function(platformId) {
  const screenshots = {
    netprime: "/movie_website_images/Netprime.webp",
    lunastream: "/movie_website_images/LunaStream.webp",
    coreflix: "/movie_website_images/coreflix.webp",
    nightflix: "/movie_website_images/nightflix.webp"
  };
  const url = screenshots[platformId];
  if (url && !prefetchedImages.has(url)) {
    prefetchedImages.add(url);
    const img = new Image();
    img.src = url;
  }
};

// 🕹️ Preview modal injector matching React exactly
window.launchPreview = function(platformId) {
  const p = PLATFORMS.find(item => item.id === platformId);
  if (!p) return;

  const similar = PLATFORMS.filter(item => item.id !== p.id && item.category === p.category).slice(0, 4);

  const pros = [
    "Polished interface",
    p.badges.includes("4K") ? "Crisp 4K playback" : "Reliable HD streams",
    p.badges.includes("Low Ads") ? "Minimal ad interruption" : "Multiple working mirrors",
    p.badges.includes("Fast Servers") ? "Lightning-fast servers" : "Frequent content updates",
  ];
  const cons = [
    p.ads < 85 ? "Occasional pop-ups" : "Limited offline support",
    "No official mobile app",
    "Some titles geo-limited",
  ];

  platformModal.innerHTML = `
    <div class="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8 animate-fade-in" role="dialog" aria-modal="true">
      <button aria-label="Close" onclick="window.closePreview()" class="absolute inset-0 bg-background/60 backdrop-blur-sm"></button>
      
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-950/95 border border-white/10 p-6 sm:p-10 animate-scale-in"
           style="box-shadow: 0 30px 100px -20px oklch(0 0 0 / 0.8);">
           
        <button onclick="window.closePreview()"
                class="absolute right-4 top-4 sm:right-6 sm:top-6 grid h-8 w-8 place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer z-20"
                aria-label="Close">
          ${ICONS.close}
        </button>
           
        <!-- Sleek Minimalist Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative pr-10 sm:pr-14">
          <div class="flex items-center gap-4">
            ${renderLogoHTML(p.name, 56)}
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-white leading-none">${p.name}</h2>
                ${p.premium ? `
                  <span class="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-semibold gold-text">
                    ${ICONS.star} Premium
                  </span>
                ` : ""}
              </div>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">${p.tagline}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a href="${p.url}" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 w-full sm:w-auto justify-center">
              Visit Website ${ICONS.arrowUpRight}
            </a>
          </div>
        </div>

        <div class="pt-6 space-y-8">
          <p class="text-base text-foreground/90 leading-relaxed text-pretty">${p.description}</p>

          <!-- Sleek Metrics Grid -->
          <div class="grid grid-cols-3 gap-4">
            ${createMeterHTML("Quality", p.quality, "var(--aurora-1)")}
            ${createMeterHTML("Ad-free", p.ads, "var(--aurora-2)")}
            ${createMeterHTML("Speed", p.performance, "var(--aurora-3)")}
          </div>

          <!-- Pristine uncropped Screenshot Preview -->
          ${(() => {
            const screenshots = {
              netprime: "/movie_website_images/Netprime.webp",
              lunastream: "/movie_website_images/LunaStream.webp",
              coreflix: "/movie_website_images/coreflix.webp",
              nightflix: "/movie_website_images/nightflix.webp"
            };
            const screenshotUrl = screenshots[p.id];
            return screenshotUrl ? `
              <div class="overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40">
                <img src="${screenshotUrl}" alt="${p.name} Preview" class="w-full h-auto block rounded-2xl" loading="lazy">
              </div>
            ` : "";
          })()}

          <!-- Advantages & Considerations Grid -->
          <div class="grid sm:grid-cols-2 gap-6">
            <div class="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <h4 class="font-display text-sm font-semibold uppercase tracking-wider text-white">Advantages</h4>
              <ul class="mt-3 space-y-2">
                ${pros.map(pro => `
                  <li class="flex items-start gap-2 text-sm text-muted-foreground">
                    <span class="mt-0.5 h-4 w-4 text-purple-400 shrink-0">${ICONS.check}</span> ${pro}
                  </li>
                `).join("")}
              </ul>
            </div>
            <div class="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <h4 class="font-display text-sm font-semibold uppercase tracking-wider text-white">Considerations</h4>
              <ul class="mt-3 space-y-2">
                ${cons.map(con => `
                  <li class="flex items-start gap-2 text-sm text-muted-foreground">
                    <span class="mt-0.5 h-4 w-4 text-rose-500 shrink-0">${ICONS.alert}</span> ${con}
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>

          <!-- Similar Platforms -->
          ${similar.length > 0 ? `
            <div class="pt-4">
              <h4 class="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Similar Platforms</h4>
              <div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${similar.map(s => `
                  <a href="${s.url}" target="_blank" rel="noopener noreferrer"
                     class="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/5">
                    ${renderLogoHTML(s.name, 36)}
                    <div class="min-w-0">
                      <p class="truncate text-xs font-semibold text-white">${s.name}</p>
                      <p class="truncate text-[10px] text-muted-foreground">${s.tagline}</p>
                    </div>
                  </a>
                `).join("")}
              </div>
            </div>
          ` : ""}

        </div>
      </div>
    </div>
  `;
  platformModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
};

window.closePreview = function() {
  platformModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
};

window.selectCategory = function(category) {
  currentFilter = category;
  renderHeroFilters();
  renderDiscoverFilters();
  renderDiscoverGrid();
  
  // Smooth scroll discovery section if not visible
  document.getElementById("discover").scrollIntoView({ behavior: "smooth" });
};

// Search submission handler
function submitSearch() {
  searchQuery = searchInput.value;
  renderDiscoverGrid();
  const discoverSection = document.getElementById("discover");
  if (discoverSection) {
    discoverSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Bind search submission
if (searchSubmitBtn) {
  searchSubmitBtn.addEventListener("click", submitSearch);
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitSearch();
  }
});

// ESC modal close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.closePreview();
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Stage 1: Render above-the-fold elements instantly (Hero and Featured sections)
  renderHeroFilters();
  renderFeaturedSection();
  
  // Stage 2: Render mid-fold interactive components in the next paint frame
  requestAnimationFrame(() => {
    renderDiscoverFilters();
    renderDiscoverGrid();
    
    // Stage 3: Defer offscreen/heavy components to run when the main thread is free
    setTimeout(() => {
      renderComparisonTable();
      renderFAQ();
      renderParticles();
      initStatsCounters();
      initRevealObserver();
    }, 24);
  });
});
