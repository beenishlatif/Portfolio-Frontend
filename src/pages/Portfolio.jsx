import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion, animate, useMotionValue } from "framer-motion";
import api from "../api/axios.js";
import { useTheme, THEMES } from "../context/ThemeContext.jsx";
import {
  ExternalLink,
  Sparkles,
  Images,
  Eye,
  PlayCircle,
  Image as ImageIcon,
  X,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Download,
} from "lucide-react";

// lucide-react dropped brand/logo icons (Github, Twitter, etc.) in newer
// versions, so the GitHub mark is a small inline SVG instead.
const GithubMark = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.71 21.38 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5Z" />
  </svg>
);

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const SOCIAL_ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.71 21.38 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-6.8L4 22H1l8.1-9.3L1 2h7.4l5 6.2L18.9 2Zm-1.3 18h1.9L7.6 4H5.5l12.1 16Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.55 1.8c.46-.16 1.26-.35 2.43-.4C9.25 1.34 9.63 1.33 12 1.33Zm0 1.62c-3.15 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.73-.34.34-.55.67-.73 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.39.79.73 1.13.34.34.67.55 1.13.73.35.14.87.3 1.83.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.73.34-.34.55-.67.73-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a3.28 3.28 0 0 0-.73-1.13 3.28 3.28 0 0 0-1.13-.73c-.35-.14-.87-.3-1.83-.34-1.24-.06-1.59-.07-4.74-.07Zm0 4.14a4.08 4.08 0 1 1 0 8.16 4.08 4.08 0 0 1 0-8.16Zm0 1.62a2.46 2.46 0 1 0 0 4.92 2.46 2.46 0 0 0 0-4.92Zm5.19-1.8a.95.95 0 1 1-1.9 0 .95.95 0 0 1 1.9 0Z" />
    </svg>
  ),
};

// ---------------------------------------------------------------------
// FIX: Admins often paste external links (GitHub, Resume, Live Demo,
// social links) WITHOUT a protocol — e.g. "github.com/username" instead
// of "https://github.com/username". A plain <a href="github.com/...">
// is NOT treated by the browser as an absolute external URL — it's
// treated as a path *relative to the current page*. Since this is a
// React Router SPA, that "relative path" click gets intercepted by the
// app's own client-side routing instead of leaving the site, and ends
// up matching the /:slug catch-all route — which is exactly why
// clicking "GitHub" appeared to stay on the site and show
// "Portfolio Not Found" (it was trying to load a portfolio whose slug
// was literally "github.com/username") instead of opening GitHub.
//
// HARDENED FURTHER: this also protects against a *wrong* value being
// saved in one of these "profile/website" fields — e.g. someone's email
// address, or a "mailto:..."/"tel:..." string accidentally saved in the
// GitHub field. Previously, if the saved value already had ANY scheme
// (including mailto:/tel:), it was trusted and used as-is — so a
// mistakenly-saved "mailto:someone@gmail.com" (or even a bare
// "someone@gmail.com") in the GitHub field would silently open the mail
// app / Gmail instead of a GitHub profile. Now:
//   1. Any scheme that isn't http/https (mailto:, tel:, javascript:,
//      etc.) is stripped back down to the raw text first — it's never
//      trusted as-is for a website/profile link.
//   2. https:// is then applied to whatever text remains.
//   3. The result is checked against a basic "does this look like a
//      real domain" pattern (and specifically rejects anything with an
//      "@" in the host, which is what an email address turns into).
//      If it still doesn't look like a usable website address, "" is
//      returned instead of a broken/unsafe link.
//
// Every call site below only renders the <a> tag when this returns a
// non-empty string — so a wrong/garbage value simply doesn't render as
// a clickable link at all, instead of ever risking a click landing on
// this app's own internal /:slug route, another user's profile, the
// mail app, or the phone dialer.
const ensureAbsoluteUrl = (url = "") => {
  let trimmed = (url || "").trim();
  if (!trimmed) return "";

  // Treat a protocol-relative "//" prefix the same as a bare domain.
  if (trimmed.startsWith("//")) {
    trimmed = trimmed.slice(2).trim();
  }

  // Only http/https schemes are trusted as-is. Any other scheme
  // (mailto:, tel:, javascript:, ftp:, etc.) is stripped off — it's not
  // appropriate for a GitHub / LinkedIn / Resume / Live Demo field — and
  // whatever text follows it is re-checked as a bare domain instead.
  const schemeMatch = trimmed.match(/^([a-z][a-z0-9+.-]*):(\/\/)?(.*)$/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme === "http" || scheme === "https") {
      return trimmed;
    }
    trimmed = (schemeMatch[3] || "").trim();
    if (!trimmed) return "";
  }

  const candidate = `https://${trimmed}`;

  // Must resemble a real "domain.tld[/path]" address (e.g.
  // github.com/username). Rejects anything with a space or an "@" in
  // the host portion, which is exactly what a plain email address
  // (e.g. "someone@gmail.com") would otherwise turn into.
  const looksLikeRealDomain = /^https:\/\/[^\s/@]+\.[^\s/@]+(\/.*)?$/i.test(candidate);
  return looksLikeRealDomain ? candidate : "";
};
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// FIX (blob: video URLs breaking on every reload / other browsers):
// A "blob:" URL (e.g. "blob:https://your-site.vercel.app/uuid...") is a
// temporary, browser-generated reference to a file that only exists in
// memory in the EXACT tab/session that created it (see AdminDashboard.jsx
// for the full upload flow). It can never resolve anywhere else — not in
// a different tab, not after a refresh, not in a different browser, not
// for a different visitor. If one is ever found stored as a project's
// video.url (e.g. saved to the database before this app had its blob:
// safety-net in the admin dashboard), the ONLY correct behavior is to
// treat it as if no video was ever added — never attempt to embed it in
// a <video> tag or an <iframe>, since it will always fail with something
// like "can't connect to the server". Every place below that reads
// video.url is guarded with this check.
const isBlobUrl = (url = "") => /^blob:/i.test((url || "").trim());
// ---------------------------------------------------------------------

const TechMarquee = ({ items }) => {
  if (!items || items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6 border-y border-border">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
      <div className="flex gap-10 w-max animate-marquee">
        {loop.map((t, i) => (
          <span key={i} className="mono text-sm text-textMuted whitespace-nowrap flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            {t}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeScroll 22s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Counts up to a target number once it scrolls into view — used for the
// small stat cards so numbers feel earned rather than static.
const CountUp = ({ value, duration = 1.1 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / (duration * 1000), 1);
            setDisplay(Math.round(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
};

const Reveal = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Groups a flat skills array into { category: [skills] } while preserving
// first-seen category order - used by the skills filter pills + grid.
const groupSkillsByCategory = (skills) => {
  const groups = {};
  skills.forEach((s) => {
    const cat = s.category || "General";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });
  return groups;
};

// Rendered at the bottom of every "page" — each section gets its own
// footer since only one section is mounted at a time.
const PageFooter = ({ owner, portfolio, onNavigate }) => {
  const social = portfolio.contact?.socialLinks || {};
  const hasSocial = Object.values(social).some((val) => val && ensureAbsoluteUrl(val));

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            <button onClick={() => onNavigate("hero")} className="group flex items-center gap-2 font-display font-semibold text-lg mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white text-sm shadow-[0_4px_18px_-4px_var(--color-primary)] group-hover:scale-105 transition-transform">
                {owner.name?.[0]?.toUpperCase() || "•"}
              </span>
              {owner.name}
              <span className="text-primary">.</span>
            </button>
            <p className="text-textMuted text-sm leading-relaxed max-w-xs">
              {portfolio.hero.tagline || portfolio.hero.subtitle || "Thanks for stopping by."}
            </p>
          </div>

          <div>
            <p className="mono text-[10px] text-primary uppercase tracking-widest mb-4">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate(s.id)}
                  className="text-left text-sm text-textMuted hover:text-primary transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mono text-[10px] text-primary uppercase tracking-widest mb-4">Get In Touch</p>
            {portfolio.contact.email && (
              <a
                href={getGmailComposeUrl(portfolio.contact.email)}
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-textMuted hover:text-primary transition mb-3 break-all"
              >
                {portfolio.contact.email}
              </a>
            )}
            {hasSocial && (
              <div className="flex items-center gap-2">
                {Object.entries(social).map(([key, val]) => {
                  const href = val && ensureAbsoluteUrl(val);
                  return (
                    href && (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-textMuted hover:text-primary hover:border-primary transition"
                      >
                        {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                      </a>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-border">
          <p className="mono text-xs text-textMuted">
            © {new Date().getFullYear()} {owner.name}. All rights reserved.
          </p>
          <button
            onClick={() => onNavigate("hero")}
            className="inline-flex items-center gap-1.5 text-xs mono text-textMuted hover:text-primary transition"
          >
            Back to top
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

const skillLevelMeta = (level = 0) => {
  if (level >= 90) return { label: "Expert", className: "bg-primary/15 text-primary" };
  if (level >= 75) return { label: "Advanced", className: "bg-accent/15 text-accent" };
  if (level >= 50) return { label: "Intermediate", className: "bg-surfaceAlt text-textMuted" };
  return { label: "Familiar", className: "bg-surfaceAlt text-textMuted" };
};

// Tracks pointer position on a card and exposes it as CSS vars, driving a
// radial-gradient glow that follows the cursor — cheap, no re-renders.
const handleCardSpotlight = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
};

const Spotlight = ({ size = 200, opacity = 0.09 }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={{
      background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,${opacity}), transparent 70%)`,
    }}
  />
);

// --- Skills section: real brand icons ---------------------------------
// Maps common skill-name spellings/variants to the slug used by the
// skillicons.dev icon service, so admins can type "Node.js", "NodeJS",
// "MongoDB", "Mongo", etc. and still get the correct logo automatically.
const SKILL_ICON_ALIASES = {
  html: "html", html5: "html",
  css: "css", css3: "css",
  sass: "sass", scss: "sass",
  less: "less",
  javascript: "js", js: "js",
  typescript: "ts", ts: "ts",
  react: "react", reactjs: "react",
  redux: "redux",
  vue: "vue", vuejs: "vue",
  angular: "angular",
  svelte: "svelte",
  nextjs: "nextjs", next: "nextjs",
  nuxt: "nuxtjs", nuxtjs: "nuxtjs",
  gatsby: "gatsby",
  nodejs: "nodejs", node: "nodejs",
  express: "express", expressjs: "express",
  nestjs: "nestjs", nest: "nestjs",
  deno: "deno",
  python: "python",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  java: "java",
  spring: "spring",
  kotlin: "kotlin",
  php: "php",
  laravel: "laravel",
  csharp: "cs",
  cpp: "cpp",
  c: "c",
  go: "go", golang: "go",
  rust: "rust",
  ruby: "ruby",
  rails: "rails",
  swift: "swift",
  dart: "dart",
  flutter: "flutter",
  mongodb: "mongodb", mongo: "mongodb", mongoose: "mongodb",
  mysql: "mysql",
  postgresql: "postgres", postgres: "postgres",
  sqlite: "sqlite",
  redis: "redis",
  firebase: "firebase",
  supabase: "supabase",
  graphql: "graphql",
  apollo: "apollo",
  docker: "docker",
  kubernetes: "kubernetes", k8s: "kubernetes",
  aws: "aws",
  gcp: "gcp",
  azure: "azure",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  xd: "xd",
  illustrator: "ai",
  photoshop: "ps",
  vscode: "vscode",
  vim: "vim",
  linux: "linux",
  bash: "bash",
  npm: "npm",
  yarn: "yarn",
  webpack: "webpack",
  vite: "vite",
  jest: "jest",
  cypress: "cypress",
  postman: "postman",
  nginx: "nginx",
  apache: "apache",
  wordpress: "wordpress",
  tailwind: "tailwind", tailwindcss: "tailwind",
  bootstrap: "bootstrap",
  materialui: "materialui", mui: "materialui",
  threejs: "threejs",
  electron: "electron",
  unity: "unity",
  androidstudio: "androidstudio",
  solidity: "solidity",
  matlab: "matlab",
  jenkins: "jenkins",
  terraform: "terraform",
  socketio: "nodejs",
  heroku: "heroku",
  vercel: "vercel",
  netlify: "netlify",
  cloudflare: "cloudflare",
  jwt: "js",
  webrtc: "js",
  r: "r",
};

const normalizeSkillKey = (name = "") => name.toLowerCase().trim();

const getSkillIconSlug = (name) => {
  const raw = normalizeSkillKey(name);
  if (SKILL_ICON_ALIASES[raw]) return SKILL_ICON_ALIASES[raw];
  const stripped = raw.replace(/[.\-_/]/g, "").replace(/\s+/g, "");
  if (SKILL_ICON_ALIASES[stripped]) return SKILL_ICON_ALIASES[stripped];
  const found = Object.keys(SKILL_ICON_ALIASES)
    .sort((a, b) => b.length - a.length)
    .find((key) => stripped.includes(key));
  return found ? SKILL_ICON_ALIASES[found] : null;
};

// Renders a real brand icon (via skillicons.dev) for known skills, and
// falls back to a clean letter-monogram badge for anything unrecognized
// (custom tools, soft skills, etc.) so the grid never shows a broken image.
const SkillIcon = ({ name, className = "w-8 h-8" }) => {
  const slug = getSkillIconSlug(name);
  const [failed, setFailed] = useState(false);

  if (!slug || failed) {
    return (
      <span
        className={`${className} rounded-lg bg-gradient-to-br from-primary/25 to-accent/25 text-primary flex items-center justify-center font-display font-bold`}
      >
        {name?.[0]?.toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <img
      src={`https://skillicons.dev/icons?i=${slug}`}
      alt={name}
      className={`${className} object-contain`}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
};

// One skill = one horizontal row card: icon, name, level badge and an
// animated progress bar. Rows stack in a responsive multi-column list so
// the section reads as a clean, scannable skill sheet instead of a grid
// of icon tiles.
const SkillCard = ({ skill, delay = 0 }) => {
  const meta = skillLevelMeta(skill.level ?? 0);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleCardSpotlight}
      className="group relative flex items-center gap-4 bg-surface border border-border rounded-xl px-5 py-4 overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.4)] transition-all"
    >
      <Spotlight size={160} />
      <span className="relative w-12 h-12 rounded-xl bg-surfaceAlt border border-border flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300">
        <SkillIcon name={skill.name} className="w-6 h-6" />
      </span>
      <div className="relative flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="mono text-sm font-medium text-text truncate">{skill.name}</span>
          {typeof skill.level === "number" && skill.level > 0 && (
            <span className={`mono text-[9px] px-2 py-0.5 rounded-full shrink-0 ${meta.className}`}>{meta.label}</span>
          )}
        </div>
        {typeof skill.level === "number" && skill.level > 0 && (
          <div className="h-1.5 rounded-full bg-surfaceAlt overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: delay + 0.15, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Icon-tile card used by the "What I Do" skills grid — dark square card,
// brand icon centered on top, label centered underneath. No level bar/badge:
// this variant is purely icon + name, matching a clean logo-grid layout.
const SkillIconCard = ({ skill, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    onMouseMove={handleCardSpotlight}
    className="group relative flex flex-col items-center justify-center gap-3.5 bg-surface border border-border rounded-2xl py-7 px-4 overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all"
  >
    <Spotlight size={160} />
    <span className="relative flex items-center justify-center w-11 h-11 group-hover:scale-110 transition-transform duration-300">
      <SkillIcon name={skill.name} className="w-11 h-11" />
    </span>
    <span className="relative mono text-[11px] md:text-xs text-textMuted uppercase tracking-wide text-center leading-tight">
      {skill.name}
    </span>
  </motion.div>
);
// ------------------------------------------------------------------------

const isVideoFile = (url = "") => /^data:video\//i.test(url) || /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
const toEmbedUrl = (url = "") => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
};

// Returns a real thumbnail image URL for a YouTube video link (used as the
// project-card cover when the video is the first/only piece of media), or
// null if the given url isn't a recognizable YouTube link — in which case
// the caller falls back to showing the actual <video> file as its own cover.
const getYoutubeThumbnail = (url = "") => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
};

// FIX: mailto: links depend on the visitor's device having a default mail
// app configured — on machines without one (very common, especially on
// shared/dev machines or when the browser has no handler registered),
// clicking a mailto: link silently does nothing useful (e.g. just opens a
// blank new tab) instead of letting the visitor actually send a message.
// Every "email me" link in this file now opens Gmail's web compose screen
// directly instead — this works in any browser, on any device, regardless
// of what (if anything) is configured as the system's default mail client,
// and always opens in a new tab so the portfolio itself stays open.
const getGmailComposeUrl = (email = "", subject = "") => {
  if (!email) return "";
  const params = new URLSearchParams({ view: "cm", fs: "1", to: email });
  if (subject) params.set("su", subject);
  return `https://mail.google.com/mail/?${params.toString()}`;
};

// Combines a project's screenshots + demo video into one navigable media
// array — still used for the project card's cover image + media count
// badge in the grid (NOT for the detail page anymore, which shows
// screenshots and video as two separate, clearly labeled sections).
//
// FIX: a saved video.url that is a "blob:" URL (see isBlobUrl above) is
// permanently broken data — it can never be played, embedded, or even
// used as a valid cover source. It is deliberately excluded here so it
// never counts toward the media list, never becomes the cover, and never
// shows the "1 more" media-count badge for a video nobody can watch.
const getProjectMedia = (p) => {
  const items = [];
  (p.screenshots || []).forEach((s) => {
    if (s?.url) items.push({ type: "image", src: s.url, caption: s.caption || "" });
  });
  if (p.video?.url && !isBlobUrl(p.video.url)) {
    items.push({ type: "video", src: p.video.url, caption: p.video.caption || "" });
  }
  return items;
};

// Decorative blurred gradient blobs used behind the hero — purely visual.
const AuroraBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
    <motion.div
      animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/25 blur-[110px]"
    />
    <motion.div
      animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/3 -right-40 w-[26rem] h-[26rem] rounded-full bg-accent/25 blur-[110px]"
    />
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
      }}
    />
  </div>
);

// Subtle 3D tilt-on-hover wrapper for project cards - pointer position
// drives rotateX/rotateY via motion values for a tasteful, GPU-cheap effect.
const TiltCard = ({ children, className, delay = 0 }) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    animate(rotateY, px * 7, { duration: 0.3, ease: "easeOut" });
    animate(rotateX, -py * 7, { duration: 0.3, ease: "easeOut" });
  };

  const handleMouseLeave = () => {
    animate(rotateX, 0, { duration: 0.4, ease: "easeOut" });
    animate(rotateY, 0, { duration: 0.4, ease: "easeOut" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Cover-video: plays muted/looped as the project card's cover image (in
// place of a static screenshot) whenever a video happens to be the first
// piece of media the admin uploaded for that project. Pauses itself when
// scrolled out of view so idle cards on a long project grid don't keep
// decoding video in the background.
const CoverVideo = ({ src, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  );
};

// slugProp lets this page be used both at /:slug (any admin's portfolio, param-driven)
// and at "/" for the site's main/primary portfolio (see Home.jsx).
const Portfolio = ({ slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // "Pages" are switched by click instead of scrolled-to — each nav item
  // is treated as its own page rather than an anchor on one long scroll.
  // "project-detail" is a special extra page (not in SECTIONS / the navbar)
  // that renders whichever project is stored in `selectedProject` below.
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Currently open project on the full-page project detail view
  // (replaces the old lightboxProject/lightboxMedia modal state).
  const [selectedProject, setSelectedProject] = useState(null);
  const [skillFilter, setSkillFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  // --- Typewriter effect state (hero section) ---
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const mainRef = useRef(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/portfolio/${slug}`);
        setData(data);
        if (data.portfolio.defaultTheme) setTheme(data.portfolio.defaultTheme);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this portfolio.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Typewriter loop - cycles through hero.roles (falls back to hero.title)
  useEffect(() => {
    if (!data) return;
    const roles =
      data.portfolio.hero.roles?.length > 0
        ? data.portfolio.hero.roles
        : [data.portfolio.hero.title || ""];
    if (!roles[0]) return;

    const current = roles[roleIndex % roles.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < current.length) {
            setDisplayText(current.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1400);
          }
        } else if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => prev + 1);
        }
      },
      isDeleting ? 35 : 75
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, data]);

  // Subtle navbar elevation once the current "page" has been scrolled.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 8);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeSection]);

  // Keyboard: Esc goes back to the Projects grid whenever the full-page
  // project detail view is open (mirrors the old modal's Esc-to-close).
  useEffect(() => {
    if (activeSection !== "project-detail") return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        goToSection("projects");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Every time the "page" changes, land at the top of it and close the
  // mobile menu — mirrors a real page navigation instead of a scroll jump.
  const goToSection = (id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    requestAnimationFrame(() => {
      mainRef.current?.scrollTo({ top: 0, behavior: "instant" in document.documentElement.style ? "instant" : "auto" });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <p className="mono text-textMuted">Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-6 text-center">
        <p className="text-2xl font-display font-semibold mb-2">Portfolio Not Found</p>
        <p className="text-textMuted mb-6">{error}</p>
        <Link to="/" className="text-primary hover:underline">
          Back to homepage
        </Link>
      </div>
    );
  }

  const { owner, portfolio } = data;

  const topSkills = portfolio.skills?.slice(0, 6) || [];
  const highlightTeaser = portfolio.about?.highlights?.slice(0, 3) || [];
  const marqueeItems = portfolio.techStack?.length ? portfolio.techStack : topSkills.map((s) => s.name);
  const services = portfolio.hero?.services || [];
  const whyChooseMe = portfolio.hero?.whyChooseMe || [];
  const skillGroups = groupSkillsByCategory(portfolio.skills || []);
  const visibleSkills = skillFilter === "All" ? portfolio.skills || [] : skillGroups[skillFilter] || [];

  const allProjectTechs = Array.from(new Set((portfolio.projects || []).flatMap((p) => p.techStack || [])));
  const filteredProjects =
    projectFilter === "All"
      ? portfolio.projects || []
      : (portfolio.projects || []).filter((p) => p.techStack?.includes(projectFilter));

  // --- Derived data for the Experience / Education / Contact pages ---
  const experienceList = portfolio.experience || [];
  const educationList = portfolio.education || [];
  const uniqueCompanies = Array.from(new Set(experienceList.map((e) => e.company).filter(Boolean)));
  const totalAchievements = experienceList.reduce((sum, e) => sum + (e.achievements?.length || 0), 0);
  const uniqueInstitutions = Array.from(new Set(educationList.map((e) => e.university).filter(Boolean)));
  const contactCards = [
    portfolio.contact.email && {
      key: "email",
      label: "Email",
      value: portfolio.contact.email,
      href: getGmailComposeUrl(portfolio.contact.email),
      external: true,
      icon: <Mail className="w-4 h-4" />,
    },
    portfolio.contact.phone && {
      key: "phone",
      label: "Phone",
      value: portfolio.contact.phone,
      href: `tel:${portfolio.contact.phone}`,
      icon: <Phone className="w-4 h-4" />,
    },
    portfolio.contact.location && {
      key: "location",
      label: "Location",
      value: portfolio.contact.location,
      icon: <MapPin className="w-4 h-4" />,
    },
  ].filter(Boolean);
  const socialEntries = Object.entries(portfolio.contact.socialLinks || {}).filter(
    ([, val]) => val && ensureAbsoluteUrl(val)
  );

  // Opens the full-page project detail view (replaces the old modal lightbox).
  const openProjectPage = (project) => {
    setSelectedProject(project);
    goToSection("project-detail");
  };

  return (
    <div className="h-screen bg-bg text-text flex flex-col overflow-hidden">
      {/* ===== Premium Navbar ===== */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-xl shadow-[0_8px_30px_-15px_rgba(0,0,0,0.5)]"
            : "bg-bg/50 backdrop-blur-md"
        }`}
      >
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex items-center justify-between px-6 md:px-10 py-4 gap-4">
            <button
              onClick={() => goToSection("hero")}
              className="group flex items-center gap-2.5 font-display font-semibold text-lg shrink-0"
            >
              <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white text-sm shadow-[0_4px_18px_-4px_var(--color-primary)] group-hover:rotate-6 group-hover:scale-105 transition-transform">
                {owner.name?.[0]?.toUpperCase() || "•"}
              </span>
              <span>
                {owner.name}
                <span className="text-primary">.</span>
              </span>
            </button>

            {/* Desktop nav - underline-indicator style instead of a filled pill.
                Note: activeSection can be "project-detail" (not in SECTIONS),
                in which case none of these tabs show an underline, which is
                correct since the detail page isn't one of the main pages. */}
            <nav className="hidden lg:flex items-center gap-1">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goToSection(s.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    activeSection === s.id ? "text-text" : "text-textMuted hover:text-text"
                  }`}
                >
                  {s.label}
                  {activeSection === s.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-primary to-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2.5 shrink-0">
              {portfolio.hero.githubLink && ensureAbsoluteUrl(portfolio.hero.githubLink) && (
                <a
                  href={ensureAbsoluteUrl(portfolio.hero.githubLink)}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-textMuted hover:text-primary hover:border-primary transition"
                  aria-label="GitHub"
                >
                  {SOCIAL_ICONS.github}
                </a>
              )}
              {portfolio.hero.resumeLink && ensureAbsoluteUrl(portfolio.hero.resumeLink) && (
                <a
                  href={ensureAbsoluteUrl(portfolio.hero.resumeLink)}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-primary transition mono"
                >
                  Resume ↗
                </a>
              )}

              {/* Theme switcher — quick-pick circle buttons shown directly in the
                  navbar (same pattern as the admin dashboard sidebar), no dropdown. */}
              <div className="hidden sm:flex items-center gap-1.5 pl-1">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    title={t.label}
                    aria-label={`Switch to ${t.label} theme`}
                    onClick={() => setTheme(t.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      theme === t.id ? "border-primary scale-110" : "border-border hover:scale-105"
                    }`}
                    style={{ background: t.swatch || "var(--color-primary)" }}
                  />
                ))}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border text-text"
                aria-label="Toggle navigation"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile page list */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden px-6 pb-4"
            >
              <div className="flex flex-col gap-1 bg-surface border border-border rounded-2xl p-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => goToSection(s.id)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm transition ${
                      activeSection === s.id
                        ? "bg-gradient-to-r from-primary to-accent text-white"
                        : "text-textMuted hover:text-text hover:bg-surfaceAlt"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                {/* Theme quick-picks also shown in the mobile menu */}
                <div className="flex items-center gap-2 px-4 py-2.5">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      title={t.label}
                      aria-label={`Switch to ${t.label} theme`}
                      onClick={() => setTheme(t.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        theme === t.id ? "border-primary scale-110" : "border-border"
                      }`}
                      style={{ background: t.swatch || "var(--color-primary)" }}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ===== Only the active "page" is mounted — a real page-switch feel ===== */}
      <main ref={mainRef} className="flex-1 w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeSection === "hero" && (
              <section className="relative scroll-mt-24">
                {/* Two-column intro: text on the left, full-bleed profile image on
                    the right — no card/circle/rounded wrapper around the image, it
                    simply fills the column edge-to-edge like a real photo backdrop.
                    Stacks with the image on top on small screens.

                    FIX: the grid track sizes are wrapped in minmax(0, …) instead of
                    plain fr units, and both columns get min-w-0. Without this, the
                    browser sizes each fr track using the content's natural
                    (min-content) width — so every time the typewriter effect below
                    typed/deleted a shorter or longer role string, the left column's
                    intrinsic width shifted and the right column (and therefore the
                    image) visibly moved/resized along with it. minmax(0, …) forces
                    the tracks to only ever follow the 1.08fr / 0.92fr ratio, so the
                    image column stays completely still regardless of what the text
                    is doing.

                    NOTE: the right column still uses a fixed viewport-based height
                    (lg:h-[86vh]) instead of lg:h-auto so it never shrinks or grows
                    vertically either. lg:self-start keeps it pinned to the top of
                    the grid row instead of being stretched/centered by the grid. */}
                <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:min-h-[86vh]">
                  <div className="order-2 lg:order-1 min-w-0 flex flex-col justify-center px-6 md:px-10 lg:pl-16 lg:pr-10 py-14 md:py-20">
                    {/* Redesigned heading — "Hi, I'm" as a small eyebrow line above a
                        large gradient name, instead of one long nowrap "I Am {name}"
                        string that looked cramped/odd, especially on smaller screens
                        or with longer names. This also removes the forced nowrap on
                        the name itself, so long names simply stay on their own line
                        at a comfortable size instead of being squeezed. */}
                    <motion.h1
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.6 }}
                      className="font-display font-bold leading-[1.08] mb-4 tracking-tight"
                    >
                      <span className="block text-textMuted font-medium mb-1.5" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}>
                        Hi, I'm
                      </span>
                      <span
                        className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                        style={{ fontSize: "clamp(2rem, 5.2vw, 3.75rem)" }}
                      >
                        {owner.name}
                      </span>
                    </motion.h1>

                    {/* The rotating-role line is wrapped in its own fixed-width box
                        (max-w-md, matching the subtitle below). Font size is smaller
                        and scales down further on narrow screens (clamp), and the
                        line stays single-line (whitespace-nowrap) with ellipsis as a
                        safety net — so it fits on one line instead of wrapping messily.
                        Its width is capped by max-w-md rather than by growing with the
                        text, so it can never influence the grid's column sizing — the
                        rest of the page (including the image column) stays perfectly
                        put regardless of what this text is doing. */}
                    {(portfolio.hero.roles?.length > 0 || portfolio.hero.title) && (
                      <div className="w-full max-w-md overflow-hidden mb-5">
                        <p
                          className="mono text-primary h-7 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
                          style={{ fontSize: "clamp(0.75rem, 1.6vw, 1.05rem)" }}
                        >
                          {displayText}
                          <span className="animate-pulse">|</span>
                        </p>
                      </div>
                    )}

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-textMuted text-base md:text-lg max-w-md leading-relaxed"
                    >
                      {portfolio.hero.subtitle}
                    </motion.p>

                    {/* Location / experience quick-glance badges — moved to sit
                        right above the CTA buttons (the "Available for Freelance"
                        badge has been dropped) so the two live pieces of context
                        lead straight into the call to action instead of floating
                        elsewhere on the page. */}
                    {(portfolio.hero.location || portfolio.hero.yearsOfExperience > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.38 }}
                        className="flex flex-wrap items-center gap-2.5 mt-6"
                      >
                        {portfolio.hero.location && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface/80 border border-border rounded-full px-3.5 py-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {portfolio.hero.location}
                          </span>
                        )}
                        {portfolio.hero.yearsOfExperience > 0 && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface/80 border border-border rounded-full px-3.5 py-1.5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 3" />
                            </svg>
                            {portfolio.hero.yearsOfExperience}+ Years Experience
                          </span>
                        )}
                      </motion.div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-5">
                      <button
                        onClick={() => goToSection("projects")}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_14px_36px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                      >
                        See Projects
                      </button>
                      <button
                        onClick={() => goToSection("contact")}
                        className="px-7 py-3 rounded-xl border border-border text-text hover:border-primary hover:text-primary transition font-medium"
                      >
                        Hire Me
                      </button>
                    </div>
                  </div>

                  {/* Right — full-bleed image, no card / circle / shadow wrapper.
                      min-w-0 (paired with minmax(0, …) on the grid track above)
                      pins this column to its intended share of the row no matter
                      what the left column's text is doing. */}
                  <div className="order-1 lg:order-2 relative w-full min-w-0 h-64 sm:h-80 lg:h-[86vh] flex flex-col bg-bg lg:self-start">
                    <div className="shrink-0 h-6 md:h-10 lg:h-14" />
                    <div className="relative flex-1 overflow-hidden">
                      {portfolio.hero.profileImage ? (
                        <img
                          src={portfolio.hero.profileImage}
                          alt={owner.name}
                          className="absolute inset-0 w-full h-full object-contain object-bottom"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                          <span className="font-display text-8xl font-bold text-primary/40">
                            {owner.name?.[0]?.toUpperCase() || "•"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Everything below the fold stays inside the standard container
                    so it lines up with the rest of the site. */}
                <div className="max-w-6xl mx-auto px-6 md:px-10">
                  {services.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-border text-left">
                      <p className="mono text-xs text-primary uppercase tracking-widest mb-2 text-center">What I Do</p>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center">Services</h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {services.map((s, i) => (
                          <Reveal
                            key={i}
                            delay={i * 0.05}
                            className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary flex items-center justify-center font-display font-semibold mb-4">
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3 className="font-display font-semibold mb-2">{s.title}</h3>
                            <p className="text-textMuted text-sm leading-relaxed">{s.description}</p>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  )}

                  {whyChooseMe.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-border text-left">
                      <p className="mono text-xs text-primary uppercase tracking-widest mb-2 text-center">The Difference</p>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center">Why Choose Me</h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        {whyChooseMe.map((w, i) => (
                          <Reveal key={i} delay={i * 0.05} className="flex gap-4">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 mt-0.5 text-primary shrink-0">
                              <path d="m5 13 4 4L19 7" />
                            </svg>
                            <div>
                              <h3 className="font-semibold mb-1">{w.title}</h3>
                              <p className="text-textMuted text-sm leading-relaxed">{w.description}</p>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  )}

                  {portfolio.hero.stats?.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                      {portfolio.hero.stats.map((s, i) => (
                        <Reveal key={i} delay={i * 0.05}>
                          <p className="font-display text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
                            {s.value}
                          </p>
                          <p className="text-textMuted text-xs mono mt-1 uppercase tracking-wide">{s.label}</p>
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-16 md:h-20" />
              </section>
            )}

            {activeSection === "about" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full">
                <div className="pointer-events-none absolute -top-10 right-0 w-72 h-72 rounded-full bg-primary/10 blur-[100px] -z-10" />

                <Reveal className="max-w-2xl">
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" /> Get To Know Me
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">About</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    A closer look at who I am, how I think, and what I bring to the table.
                  </p>
                </Reveal>

                <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mt-12 items-start">
                  {/* Main narrative column */}
                  <div className="lg:col-span-3 space-y-6">
                    <Reveal className="bg-surface border border-border rounded-2xl p-7 md:p-8">
                      <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4">My Story</h3>
                      <p className="text-text leading-relaxed whitespace-pre-line text-base md:text-lg">
                        {portfolio.about.bio || "No bio added yet."}
                      </p>
                    </Reveal>

                    {portfolio.about.approach && (
                      <Reveal delay={0.05} className="bg-surface border border-border rounded-2xl p-7 md:p-8">
                        <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4">My Approach</h3>
                        <p className="text-textMuted leading-relaxed whitespace-pre-line">{portfolio.about.approach}</p>
                      </Reveal>
                    )}

                    {portfolio.about.highlights?.length > 0 && (
                      <Reveal delay={0.1}>
                        <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4 mt-2">Highlights</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {portfolio.about.highlights.map((h, i) => (
                            <div
                              key={i}
                              className="flex gap-3 items-start bg-surface border border-border rounded-xl px-4 py-3.5 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
                            >
                              <span className="mono text-[10px] text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm text-text leading-relaxed">{h}</span>
                            </div>
                          ))}
                        </div>
                      </Reveal>
                    )}
                  </div>

                  {/* At-a-glance side panel */}
                  <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
                    <Reveal delay={0.05} className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
                      <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-5">At a Glance</h3>
                      <div className="space-y-4">
                        {portfolio.hero.location && (
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg bg-surface/80 border border-border flex items-center justify-center text-primary shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
                                <circle cx="12" cy="10" r="2.5" />
                              </svg>
                            </span>
                            <div>
                              <p className="text-[10px] mono text-textMuted uppercase tracking-widest">Location</p>
                              <p className="text-sm text-text font-medium">{portfolio.hero.location}</p>
                            </div>
                          </div>
                        )}
                        {portfolio.hero.yearsOfExperience > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg bg-surface/80 border border-border flex items-center justify-center text-primary shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 3" />
                              </svg>
                            </span>
                            <div>
                              <p className="text-[10px] mono text-textMuted uppercase tracking-widest">Experience</p>
                              <p className="text-sm text-text font-medium">{portfolio.hero.yearsOfExperience}+ Years</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-lg bg-surface/80 border border-border flex items-center justify-center text-primary shrink-0">
                            <span className="relative flex h-2.5 w-2.5">
                              {portfolio.hero.availableForWork && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              )}
                              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${portfolio.hero.availableForWork ? "bg-green-500" : "bg-textMuted"}`} />
                            </span>
                          </span>
                          <div>
                            <p className="text-[10px] mono text-textMuted uppercase tracking-widest">Availability</p>
                            <p className="text-sm text-text font-medium">
                              {portfolio.hero.availableForWork ? "Open for Freelance" : "Not Currently Available"}
                            </p>
                          </div>
                        </div>
                        {portfolio.contact.email && (
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg bg-surface/80 border border-border flex items-center justify-center text-primary shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M4 6h16v12H4V6Zm0 0 8 7 8-7" />
                              </svg>
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] mono text-textMuted uppercase tracking-widest">Email</p>
                              <a
                                href={getGmailComposeUrl(portfolio.contact.email)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-primary font-medium hover:underline break-all"
                              >
                                {portfolio.contact.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => goToSection("contact")}
                        className="w-full mt-6 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_8px_20px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                      >
                        Let's Work Together
                      </button>
                    </Reveal>

                    {topSkills.length > 0 && (
                      <Reveal delay={0.1} className="bg-surface border border-border rounded-2xl p-6">
                        <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {topSkills.map((s, i) => (
                            <span key={i} className="mono text-xs px-3 py-1.5 rounded-full bg-surfaceAlt text-accent border border-border">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </Reveal>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "skills" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full overflow-hidden">
                <AuroraBackground />

                {/* "What I Do" header block — big centered heading with one short
                    supporting line about skills underneath, then straight into the
                    icon grid. */}
                <Reveal className="max-w-2xl mx-auto text-center">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What I Do</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    Tools and technologies I use to design, build and ship real products.
                  </p>
                </Reveal>

                {portfolio.skills.length === 0 && (
                  <p className="text-textMuted mt-10 text-center">No skills added yet.</p>
                )}

                {portfolio.skills.length > 0 && (
                  <div className="relative flex items-stretch gap-6 mt-14">
                    {/* Vertical "Skills" side label with a small dot-motif accent,
                        sitting to the left of the icon grid like a section tab. */}
                    <div className="hidden md:flex flex-col items-center justify-between shrink-0 py-2">
                      <div className="flex flex-col gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/60" />
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        <span className="w-1 h-1 rounded-full bg-primary/20" />
                      </div>
                      <span
                        className="mono text-xs font-semibold text-textMuted tracking-[0.3em] uppercase"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        Skills
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/20" />
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        <span className="w-1 h-1 rounded-full bg-primary/60" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Category filter pills — only shown when skills span more than one category */}
                      {Object.keys(skillGroups).length > 1 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                          {["All", ...Object.keys(skillGroups)].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSkillFilter(cat)}
                              className={`relative mono text-xs px-3.5 py-1.5 rounded-full border transition ${
                                skillFilter === cat
                                  ? "text-white border-transparent"
                                  : "border-border text-textMuted hover:border-primary/50 hover:text-text"
                              }`}
                            >
                              {skillFilter === cat && (
                                <motion.span
                                  layoutId="skill-filter-pill"
                                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full -z-10 shadow-[0_6px_16px_-6px_var(--color-primary)]"
                                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                />
                              )}
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Icon grid — dark rounded tile per skill, brand icon on top,
                          name centered underneath. 5 columns on desktop like a tidy
                          logo wall, tightening down to 2 on small screens. */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={skillFilter}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5"
                        >
                          {visibleSkills.map((s, i) => (
                            <SkillIconCard key={s.name + i} skill={s} delay={Math.min(i * 0.04, 0.4)} />
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === "projects" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full overflow-hidden">
                <AuroraBackground />

                <Reveal>
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" /> Selected Work
                  </p>
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                    <h2 className="font-display text-3xl md:text-4xl font-bold">Projects</h2>
                    {portfolio.projects.length > 0 && (
                      <span className="mono text-[11px] text-textMuted border border-border rounded-full px-3 py-1 mb-1">
                        {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
                        {projectFilter !== "All" && <span className="text-primary"> · {projectFilter}</span>}
                      </span>
                    )}
                  </div>
                  <p className="text-textMuted text-sm md:text-base max-w-xl">
                    A look at what I've built — click any project to open its full details, screenshots and demo video.
                  </p>
                </Reveal>

                {portfolio.projects.length === 0 && <p className="text-textMuted mt-10">No projects added yet.</p>}

                {allProjectTechs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {["All", ...allProjectTechs].map((t) => (
                      <button
                        key={t}
                        onClick={() => setProjectFilter(t)}
                        className={`relative mono text-xs px-3.5 py-1.5 rounded-full border transition ${
                          projectFilter === t
                            ? "text-white border-transparent"
                            : "border-border text-textMuted hover:border-primary/50 hover:text-text"
                        }`}
                      >
                        {projectFilter === t && (
                          <motion.span
                            layoutId="project-filter-pill"
                            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full -z-10 shadow-[0_6px_16px_-6px_var(--color-primary)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Unified project grid — clean, consistent card size, no more
                    long side-by-side "spotlight" layout. Featured just gets a badge.
                    Clicking a card now navigates to a dedicated full-page project
                    view (openProjectPage) instead of opening a modal. */}
                {filteredProjects.length > 0 && (
                  <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.map((p, i) => {
                        const media = getProjectMedia(p);
                        // The cover is whatever media item was added FIRST — could be
                        // a screenshot or the demo video. If it's a real video file,
                        // it plays inline (muted/looped) as the cover itself instead
                        // of a static placeholder. If it's a YouTube/embed link, its
                        // real thumbnail is used as the cover image instead.
                        const cover = media[0];
                        const coverIsPlayableVideo = cover?.type === "video" && isVideoFile(cover.src);
                        const coverYoutubeThumb = cover?.type === "video" && !coverIsPlayableVideo ? getYoutubeThumbnail(cover.src) : null;

                        return (
                          <TiltCard
                            key={`${p.title}-${i}`}
                            delay={Math.min(i * 0.06, 0.4)}
                            className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow]"
                          >
                            {p.featured && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15 }}
                                className="absolute top-3 left-3 z-10 mono text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center gap-1 shadow-lg"
                              >
                                <Sparkles className="w-3 h-3" /> Featured
                              </motion.span>
                            )}

                            {/* Diagonal shine sweep on hover — purely decorative polish */}
                            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                              <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-[420%] transition-all duration-[1100ms] ease-out" />
                            </div>

                            <button
                              onClick={() => openProjectPage(p)}
                              className="relative block w-full aspect-video overflow-hidden bg-surfaceAlt"
                            >
                              {cover ? (
                                coverIsPlayableVideo ? (
                                  <>
                                    {/* Blurred backdrop copy of the video fills the frame,
                                        same treatment as the image cover, so the real
                                        video can sit fully inside without being cropped. */}
                                    <CoverVideo
                                      src={cover.src}
                                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40 saturate-150"
                                    />
                                    <CoverVideo
                                      src={cover.src}
                                      className="relative w-full h-full object-contain group-hover:scale-[1.04] transition duration-500 ease-out"
                                    />
                                    <span className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/55 text-white backdrop-blur">
                                      <PlayCircle className="w-4 h-4" />
                                    </span>
                                  </>
                                ) : coverYoutubeThumb ? (
                                  <>
                                    <img
                                      src={coverYoutubeThumb}
                                      alt=""
                                      aria-hidden="true"
                                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40 saturate-150"
                                    />
                                    <img
                                      src={coverYoutubeThumb}
                                      alt={p.title}
                                      className="relative w-full h-full object-contain group-hover:scale-[1.04] transition duration-500 ease-out"
                                    />
                                    <span className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/55 text-white backdrop-blur">
                                      <PlayCircle className="w-4 h-4" />
                                    </span>
                                  </>
                                ) : cover.type === "video" ? (
                                  <div className="w-full h-full flex items-center justify-center text-primary bg-gradient-to-br from-primary/10 to-accent/10">
                                    <PlayCircle className="w-10 h-10" />
                                  </div>
                                ) : (
                                  <>
                                    {/* Blurred backdrop fills the frame so the real image can sit
                                        fully inside without ever being cropped/cut off. */}
                                    <img
                                      src={cover.src}
                                      alt=""
                                      aria-hidden="true"
                                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40 saturate-150"
                                    />
                                    <img
                                      src={cover.src}
                                      alt={p.title}
                                      className="relative w-full h-full object-contain group-hover:scale-[1.04] transition duration-500 ease-out"
                                    />
                                  </>
                                )
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-textMuted">
                                  <ImageIcon className="w-8 h-8" />
                                </div>
                              )}

                              {media.length > 1 && (
                                <span className="absolute bottom-2 right-2 mono text-[10px] bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur flex items-center gap-1">
                                  <Images className="w-3 h-3" />
                                  {media.length}
                                </span>
                              )}

                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                                  <Eye className="w-4 h-4" /> View Project
                                </span>
                              </div>
                            </button>

                            <div className="p-5">
                              <button
                                onClick={() => openProjectPage(p)}
                                className="text-left w-full"
                              >
                                <h3 className="font-display font-semibold mb-1.5 group-hover:text-primary transition-colors">{p.title}</h3>
                              </button>
                              <p className="text-textMuted text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>

                              {p.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {p.techStack.slice(0, 4).map((t, idx) => (
                                    <span
                                      key={idx}
                                      className="mono text-[11px] px-2 py-0.5 rounded bg-surfaceAlt text-accent group-hover:bg-accent/10 transition-colors"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                  {p.techStack.length > 4 && (
                                    <span className="mono text-[11px] px-2 py-0.5 rounded bg-surfaceAlt text-textMuted">
                                      +{p.techStack.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-4 pt-3 border-t border-border">
                                <button
                                  onClick={() => openProjectPage(p)}
                                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View Details
                                </button>
                                {p.liveLink && ensureAbsoluteUrl(p.liveLink) && (
                                  <a
                                    href={ensureAbsoluteUrl(p.liveLink)}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                  </a>
                                )}
                                {p.githubLink && ensureAbsoluteUrl(p.githubLink) && (
                                  <a
                                    href={ensureAbsoluteUrl(p.githubLink)}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-primary transition"
                                  >
                                    <GithubMark className="w-3.5 h-3.5" /> Code
                                  </a>
                                )}
                              </div>
                            </div>
                          </TiltCard>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </section>
            )}

            {/* ===== Project Detail — dedicated full page (replaces the old modal) =====
                Reached via openProjectPage(p), which sets selectedProject and
                navigates activeSection to "project-detail". Screenshots and the
                demo video are shown as two separate, clearly labeled sections
                instead of being merged into one mixed gallery grid, and the
                description gets its own well-formatted card up top.

                FIX: the "Demo Video" section (and the media-count logic above)
                now explicitly excludes "blob:" URLs via isBlobUrl(). A blob:
                URL can never resolve outside the exact tab/session that created
                it, so rendering it in a <video>/<iframe> always produced the
                "can't connect to the server" error seen in both Chrome and
                Firefox. Treating it as "no video" instead means the page simply
                shows the Screenshots section (or the "nothing added yet"
                message) until the admin re-uploads the video properly. */}
            {activeSection === "project-detail" && selectedProject && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-16 md:py-20 max-w-5xl mx-auto w-full overflow-hidden">
                <AuroraBackground />

                <Reveal>
                  <button
                    onClick={() => goToSection("projects")}
                    className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-primary transition mb-8"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                  </button>
                </Reveal>

                <Reveal delay={0.05}>
                  <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
                    <div>
                      {selectedProject.featured && (
                        <span className="inline-flex items-center gap-1.5 mono text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white mb-3">
                          <Sparkles className="w-3 h-3" /> Featured Project
                        </span>
                      )}
                      <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{selectedProject.title}</h1>
                    </div>

                    {(ensureAbsoluteUrl(selectedProject.liveLink || "") || ensureAbsoluteUrl(selectedProject.githubLink || "")) && (
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {selectedProject.liveLink && ensureAbsoluteUrl(selectedProject.liveLink) && (
                          <a
                            href={ensureAbsoluteUrl(selectedProject.liveLink)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_10px_24px_-10px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" /> Live Demo
                          </a>
                        )}
                        {selectedProject.githubLink && ensureAbsoluteUrl(selectedProject.githubLink) && (
                          <a
                            href={ensureAbsoluteUrl(selectedProject.githubLink)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border text-text hover:border-primary hover:text-primary transition text-sm font-medium"
                          >
                            <GithubMark className="w-4 h-4" /> View Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedProject.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                      {selectedProject.techStack.map((t, idx) => (
                        <span
                          key={idx}
                          className="mono text-xs px-3 py-1.5 rounded-full bg-surfaceAlt text-accent border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Reveal>

                {/* Description — its own clearly-labeled card, well-spaced and
                    readable, instead of a squeezed one-liner above the gallery. */}
                {selectedProject.description && (
                  <Reveal delay={0.1} className="bg-surface border border-border rounded-2xl p-6 md:p-8 mb-10">
                    <h2 className="mono text-xs uppercase tracking-widest text-primary mb-4">About This Project</h2>
                    <p className="text-text leading-relaxed whitespace-pre-line text-base md:text-lg">
                      {selectedProject.description}
                    </p>
                  </Reveal>
                )}

                {/* Demo Video — its own dedicated section, separate from screenshots.
                    Only rendered when video.url exists AND is not a stale blob: URL. */}
                {selectedProject.video?.url && !isBlobUrl(selectedProject.video.url) && (
                  <Reveal delay={0.15} className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <PlayCircle className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl md:text-2xl font-semibold">Demo Video</h2>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border bg-black">
                      {isVideoFile(selectedProject.video.url) ? (
                        <video src={selectedProject.video.url} controls className="w-full max-h-[65vh] bg-black" />
                      ) : (
                        <iframe
                          src={toEmbedUrl(selectedProject.video.url)}
                          title={`${selectedProject.title} demo`}
                          allow="autoplay; fullscreen"
                          className="w-full aspect-video"
                        />
                      )}
                    </div>
                    {selectedProject.video.caption && (
                      <p className="text-textMuted text-sm leading-relaxed mt-3">{selectedProject.video.caption}</p>
                    )}
                  </Reveal>
                )}

                {/* Screenshots — its own dedicated section, separate from the video */}
                {selectedProject.screenshots?.length > 0 && (
                  <Reveal delay={0.2} className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl md:text-2xl font-semibold">Screenshots</h2>
                      <span className="mono text-[11px] text-textMuted border border-border rounded-full px-2.5 py-0.5 ml-1">
                        {selectedProject.screenshots.length}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {selectedProject.screenshots.map((shot, si) => (
                        <div key={si} className="rounded-xl overflow-hidden border border-border bg-surface">
                          <img
                            src={shot.url}
                            alt={shot.caption || `${selectedProject.title} screenshot ${si + 1}`}
                            className="w-full max-h-[50vh] object-contain bg-black"
                          />
                          {shot.caption && (
                            <p className="text-textMuted text-sm leading-relaxed px-4 py-3 border-t border-border">
                              {shot.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Reveal>
                )}

                {!(selectedProject.video?.url && !isBlobUrl(selectedProject.video.url)) &&
                  !(selectedProject.screenshots?.length > 0) && (
                    <p className="text-textMuted text-sm">No screenshots or demo video added for this project yet.</p>
                  )}
              </section>
            )}

            {activeSection === "experience" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full overflow-hidden">
                <div className="pointer-events-none absolute -top-16 left-0 w-80 h-80 rounded-full bg-primary/10 blur-[110px] -z-10" />

                <Reveal className="max-w-2xl">
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" /> Career Path
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Experience</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    A timeline of the roles, teams and projects that have shaped how I build software.
                  </p>
                </Reveal>

                {experienceList.length === 0 && <p className="text-textMuted mt-10">No experience added yet.</p>}

                {experienceList.length > 0 && (
                  <>
                    <div className="relative pl-9 md:pl-10 mt-12">
                      <div className="absolute left-[9px] md:left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-border to-transparent" />
                      <div className="space-y-8">
                        {experienceList.map((e, i) => (
                          <Reveal key={i} delay={Math.min(i * 0.07, 0.35)} className="relative">
                            <span
                              className={`absolute -left-9 md:-left-10 top-6 w-[18px] h-[18px] rounded-full border-4 border-bg flex items-center justify-center ${
                                e.current
                                  ? "bg-primary shadow-[0_0_0_5px_rgba(var(--color-primary-rgb,99,102,241),0.15)]"
                                  : "bg-textMuted"
                              }`}
                            />

                            <div className="bg-surface border border-border rounded-2xl p-6 md:p-7 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(0,0,0,0.4)] transition-all">
                              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div className="flex items-start gap-3">
                                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary flex items-center justify-center shrink-0">
                                    <Briefcase className="w-4.5 h-4.5" />
                                  </span>
                                  <div>
                                    <h3 className="font-display font-semibold text-base md:text-lg leading-snug">{e.role}</h3>
                                    <p className="flex items-center gap-1.5 text-sm text-primary font-medium mt-0.5">
                                      <Building2 className="w-3.5 h-3.5" />
                                      {e.company}
                                    </p>
                                  </div>
                                </div>
                                {e.current && (
                                  <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary uppercase tracking-wide shrink-0">
                                    Current
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-3 mb-4">
                                {e.duration && (
                                  <span className="inline-flex items-center gap-1.5 mono text-[11px] text-textMuted bg-surfaceAlt rounded-full px-3 py-1">
                                    <Calendar className="w-3 h-3" />
                                    {e.duration}
                                  </span>
                                )}
                                {e.location && (
                                  <span className="inline-flex items-center gap-1.5 mono text-[11px] text-textMuted bg-surfaceAlt rounded-full px-3 py-1">
                                    <MapPin className="w-3 h-3" />
                                    {e.location}
                                  </span>
                                )}
                              </div>

                              {e.description && (
                                <p className="text-textMuted text-sm leading-relaxed">{e.description}</p>
                              )}

                              {e.achievements?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <p className="mono text-[10px] text-primary uppercase tracking-widest mb-2.5">Highlights</p>
                                  <ul className="space-y-2">
                                    {e.achievements.map((a, ai) => (
                                      <li key={ai} className="flex gap-2.5 text-sm text-text">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                        <span className="leading-relaxed">{a}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeSection === "education" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full overflow-hidden">
                <div className="pointer-events-none absolute -top-16 right-0 w-80 h-80 rounded-full bg-accent/10 blur-[110px] -z-10" />

                {/* Floating decorative cap + drifting particles — kept clearly visible
                    (not just a faint flash on load) so it reads as a persistent motif
                    throughout the page, not a one-off entrance effect. */}
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, -14, 0], rotate: [-6, 6, -6] }}
                  transition={{
                    opacity: { duration: 0.6 },
                    y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="pointer-events-none absolute top-10 right-6 md:right-16 text-primary/25 z-10"
                >
                  <GraduationCap className="w-40 h-40 md:w-56 md:h-56" strokeWidth={1} />
                </motion.div>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    animate={{
                      y: [0, -22 - i * 4, 0],
                      opacity: [0.3, 0.75, 0.3],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                    className="pointer-events-none absolute -z-10 w-1.5 h-1.5 rounded-full bg-primary/60"
                    style={{ top: `${18 + i * 11}%`, left: `${8 + i * 15}%` }}
                  />
                ))}

                <Reveal className="max-w-2xl">
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" /> Academic Background
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Education</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    The formal foundation behind the skills I bring to every project.
                  </p>
                </Reveal>

                {educationList.length === 0 && <p className="text-textMuted mt-10">No education added yet.</p>}

                {educationList.length > 0 && (
                  <>
                    <div
                      className={`grid gap-5 mt-14 ${
                        educationList.length === 1 ? "max-w-xl mx-auto" : "sm:grid-cols-2"
                      }`}
                    >
                      {educationList.map((e, i) => (
                        <TiltCard
                          key={i}
                          delay={Math.min(i * 0.08, 0.35)}
                          className="group relative bg-surface border border-border rounded-2xl p-7 md:p-8 overflow-hidden hover:border-primary/50 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow]"
                        >
                          <motion.div
                            aria-hidden="true"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl"
                          />

                          <div className="relative flex items-start justify-between gap-3 mb-4">
                            <motion.span
                              initial={{ scale: 0, rotate: -25 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 260, damping: 16, delay: Math.min(i * 0.08, 0.35) + 0.1 }}
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform"
                            >
                              <GraduationCap className="w-6 h-6" />
                            </motion.span>
                            {e.gpa && (
                              <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary shrink-0">
                                GPA {e.gpa}
                              </span>
                            )}
                          </div>

                          <h3 className="relative font-display font-semibold text-lg md:text-xl leading-snug mb-1.5">{e.university}</h3>
                          <p className="relative text-sm text-primary font-medium mb-3">
                            {e.degree}
                            {e.fieldOfStudy && ` in ${e.fieldOfStudy}`}
                          </p>

                          {e.duration && (
                            <span className="relative inline-flex items-center gap-1.5 mono text-[11px] text-textMuted bg-surfaceAlt rounded-full px-3 py-1 mb-4">
                              <Calendar className="w-3 h-3" />
                              {e.duration}
                            </span>
                          )}

                          {e.description && (
                            <p className="relative text-textMuted text-sm leading-relaxed pt-4 border-t border-border">{e.description}</p>
                          )}

                          <div className="relative h-1 rounded-full bg-surfaceAlt overflow-hidden mt-5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, delay: Math.min(i * 0.08, 0.35) + 0.2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                          </div>
                        </TiltCard>
                      ))}
                    </div>

                    {/* Closing CTA */}
                    <Reveal delay={0.1} className="mt-14 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-5">
                      <div className="text-center md:text-left">
                        <h3 className="font-display text-lg md:text-xl font-semibold mb-1.5">Curious how this translates into practice?</h3>
                        <p className="text-textMuted text-sm">
                          See how this background shows up in the skills I use and the projects I've shipped.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <button
                          onClick={() => goToSection("skills")}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_8px_20px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                        >
                          View Skills
                        </button>
                        <button
                          onClick={() => goToSection("experience")}
                          className="px-5 py-2.5 rounded-xl border border-border text-text hover:border-primary hover:text-primary transition text-sm font-medium"
                        >
                          View Experience
                        </button>
                      </div>
                    </Reveal>
                  </>
                )}
              </section>
            )}

            {activeSection === "contact" && (
              <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full overflow-hidden">
                <AuroraBackground />

                <Reveal className="max-w-2xl mx-auto text-center">
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <span className="w-6 h-px bg-primary" /> Get In Touch <span className="w-6 h-px bg-primary" />
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Let's Talk</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    Have a project in mind, a role to discuss, or just want to say hello? Here's how to reach me.
                  </p>

                  {typeof portfolio.hero.availableForWork === "boolean" && (
                    <span className="inline-flex items-center gap-2 mt-5 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs">
                      <span className="relative flex h-2 w-2">
                        {portfolio.hero.availableForWork && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${portfolio.hero.availableForWork ? "bg-green-500" : "bg-textMuted"}`} />
                      </span>
                      {portfolio.hero.availableForWork ? "Available for new work" : "Not currently available"}
                    </span>
                  )}
                </Reveal>

                {/* Primary contact detail cards — one clean row, icon + label + value,
                    consistent with the Email/Phone/Location cards elsewhere in the app. */}
                {contactCards.length > 0 && (
                  <div className={`grid gap-4 mt-12 max-w-4xl mx-auto ${
                    contactCards.length === 1 ? "max-w-sm" : contactCards.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
                  }`}>
                    {contactCards.map((c, i) => (
                      <Reveal
                        key={c.key}
                        delay={i * 0.06}
                        className="group relative bg-surface border border-border rounded-2xl p-6 text-center hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary items-center justify-center mb-4">
                          {c.icon}
                        </span>
                        <p className="relative text-[10px] mono text-textMuted uppercase tracking-widest mb-1.5">{c.label}</p>
                        {c.href ? (
                          <a
                            href={c.href}
                            {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="relative block text-sm text-primary font-medium hover:underline break-all"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <p className="relative text-sm text-text font-medium break-all">{c.value}</p>
                        )}
                      </Reveal>
                    ))}
                  </div>
                )}

                {/* Main CTA band + social row, centered as the page's focal point
                    instead of splitting the page into two competing side columns. */}
                <Reveal delay={0.1} className="relative max-w-3xl mx-auto mt-8 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "radial-gradient(circle, var(--color-text) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }} />

                  <h3 className="relative font-display text-xl md:text-2xl font-semibold mb-2.5">Let's build something great</h3>
                  <p className="relative text-textMuted text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-7">
                    {portfolio.hero.tagline || "Reach out and I'll get back to you as soon as I can."}
                  </p>

                  <div className="relative flex flex-wrap items-center justify-center gap-3">
                    {portfolio.contact.email && (
                      <a
                        href={getGmailComposeUrl(portfolio.contact.email)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_14px_36px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                      >
                        <Mail className="w-4 h-4" /> Say Hello
                      </a>
                    )}
                    {portfolio.hero.resumeLink && ensureAbsoluteUrl(portfolio.hero.resumeLink) && (
                      <a
                        href={ensureAbsoluteUrl(portfolio.hero.resumeLink)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl border border-border bg-surface/60 backdrop-blur text-text hover:border-primary hover:text-primary transition text-sm font-medium"
                      >
                        <Download className="w-4 h-4" /> Resume
                      </a>
                    )}
                  </div>

                  {socialEntries.length > 0 && (
                    <div className="relative flex items-center justify-center gap-3 mt-8 pt-7 border-t border-border/60">
                      {socialEntries.map(([key, val]) => (
                        <a
                          key={key}
                          href={ensureAbsoluteUrl(val)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-textMuted hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
                          aria-label={key}
                        >
                          {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                        </a>
                      ))}
                    </div>
                  )}
                </Reveal>

                {/* Why reach out — three quiet reasons instead of a boxed list,
                    closing the page on next-step actions. */}
                <div className="max-w-3xl mx-auto mt-10 grid sm:grid-cols-3 gap-4">
                  {[
                    "New projects and freelance collaborations",
                    "Full-time or contract opportunities",
                    "Technical questions about my work",
                  ].map((item, i) => (
                    <Reveal key={i} delay={i * 0.06} className="flex items-start gap-2.5 text-sm text-text bg-surface border border-border rounded-xl p-4">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </Reveal>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => goToSection("projects")}
                    className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    See my work <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-border">·</span>
                  <button
                    onClick={() => goToSection("hero")}
                    className="text-sm text-textMuted hover:text-primary transition font-medium"
                  >
                    Back to home
                  </button>
                </div>
              </section>
            )}

            <PageFooter owner={owner} portfolio={portfolio} onNavigate={goToSection} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Portfolio;