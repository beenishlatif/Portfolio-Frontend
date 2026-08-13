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
  CheckCircle2,
  Download,
  Check,
  Palette,
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
// first-seen category order - used by the premium skills grid.
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
  const hasSocial = Object.values(social).some(Boolean);

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
              <a href={`mailto:${portfolio.contact.email}`} className="block text-sm text-textMuted hover:text-primary transition mb-3 break-all">
                {portfolio.contact.email}
              </a>
            )}
            {hasSocial && (
              <div className="flex items-center gap-2">
                {Object.entries(social).map(
                  ([key, val]) =>
                    val && (
                      <a
                        key={key}
                        href={val}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-textMuted hover:text-primary hover:border-primary transition"
                      >
                        {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                      </a>
                    )
                )}
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

// A skill's proficiency decides how much room it gets — this is the
// signature idea of the redesigned Skills page: the layout itself is the
// data visualization, not a decoration bolted onto uniform cards.
const skillTier = (level = 0) => {
  if (level >= 90) return "hero";
  if (level >= 70) return "tall";
  return "compact";
};

const TIER_SPAN = {
  hero: "col-span-2 row-span-2",
  tall: "row-span-2",
  compact: "",
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

// Radial ring instead of a linear bar — reads as a dial/gauge, doubles as
// the card's focal graphic rather than a decoration bolted on the side.
const CircularProgress = ({ level, size = 72, stroke = 6, delay = 0 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} className="text-surfaceAlt" stroke="currentColor" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#skillRingGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference - (level / 100) * circumference }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: "easeOut" }}
      />
    </svg>
  );
};

const BentoSkillTile = ({ skill, delay = 0 }) => {
  const level = skill.level ?? 0;
  const tier = skillTier(level);
  const meta = skillLevelMeta(level);
  const category = skill.category || "General";

  if (tier === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleCardSpotlight}
        className={`group relative ${TIER_SPAN[tier]} rounded-2xl p-6 flex items-center gap-5 overflow-hidden bg-gradient-to-br from-primary/15 via-surface to-accent/10 border border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all`}
      >
        <Spotlight size={260} opacity={0.1} />
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary/25 blur-[70px] group-hover:bg-primary/35 transition-colors duration-300" />
        <div className="relative shrink-0 flex items-center justify-center">
          <CircularProgress level={level} size={88} stroke={7} delay={delay} />
          <span className="absolute font-display text-sm font-bold text-text">{level}%</span>
        </div>
        <div className="relative min-w-0">
          <span className="mono text-[10px] uppercase tracking-widest text-primary">{category}</span>
          <h4 className="font-display text-xl md:text-2xl font-bold mt-1 mb-2 truncate">{skill.name}</h4>
          <span className={`mono text-[10px] px-2 py-0.5 rounded-full ${meta.className}`}>{meta.label}</span>
        </div>
      </motion.div>
    );
  }

  if (tier === "tall") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleCardSpotlight}
        className={`group relative ${TIER_SPAN[tier]} rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 overflow-hidden bg-surface border border-border hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.35)] transition-all`}
      >
        <Spotlight size={180} />
        <span className="relative mono text-[10px] uppercase tracking-widest text-textMuted">{category}</span>
        <div className="relative flex items-center justify-center">
          <CircularProgress level={level} size={58} stroke={5} delay={delay} />
          <span className="absolute mono text-[10px] font-semibold text-text">{level}%</span>
        </div>
        <div className="relative">
          <h4 className="font-semibold text-sm mb-1.5 truncate max-w-[9rem]">{skill.name}</h4>
          <span className={`mono text-[10px] px-2 py-0.5 rounded-full inline-block ${meta.className}`}>{meta.label}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleCardSpotlight}
      className="group relative rounded-2xl p-4 flex items-center gap-3 overflow-hidden bg-surface border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-all"
    >
      <Spotlight size={140} />
      <div className="relative shrink-0 flex items-center justify-center">
        <CircularProgress level={level} size={38} stroke={4} delay={delay} />
      </div>
      <div className="relative min-w-0 flex-1">
        <h4 className="font-semibold text-xs truncate">{skill.name}</h4>
        <span className={`mono text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-1 ${meta.className}`}>{meta.label}</span>
      </div>
    </motion.div>
  );
};

const isVideoFile = (url = "") => /^data:video\//i.test(url) || /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
const toEmbedUrl = (url = "") => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
};

// Combines a project's screenshots + demo video into one navigable media
// array for the lightbox. Each item carries its own caption/description.
// The first screenshot (if any) also doubles as the card's cover image.
const getProjectMedia = (p) => {
  const items = [];
  (p.screenshots || []).forEach((s) => {
    if (s?.url) items.push({ type: "image", src: s.url, caption: s.caption || "" });
  });
  if (p.video?.url) items.push({ type: "video", src: p.video.url, caption: p.video.caption || "" });
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
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState([]);
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

  // Keyboard: Esc closes the gallery modal. Since every screenshot is shown
  // at once (no more one-by-one carousel), left/right navigation isn't needed.
  useEffect(() => {
    if (!lightboxProject) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setLightboxProject(null);
        setLightboxMedia([]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxProject]);

  // Close the theme dropdown on outside click.
  useEffect(() => {
    if (!themeMenuOpen) return;
    const handleClick = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [themeMenuOpen]);

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
      href: `mailto:${portfolio.contact.email}`,
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
  const socialEntries = Object.entries(portfolio.contact.socialLinks || {}).filter(([, val]) => Boolean(val));

  const openLightbox = (project) => {
    const media = getProjectMedia(project);
    setLightboxProject(project);
    setLightboxMedia(media);
  };

  const closeLightbox = () => {
    setLightboxProject(null);
    setLightboxMedia([]);
  };

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

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

            {/* Desktop nav - underline-indicator style instead of a filled pill */}
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
              {portfolio.hero.githubLink && (
                <a
                  href={portfolio.hero.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-textMuted hover:text-primary hover:border-primary transition"
                  aria-label="GitHub"
                >
                  {SOCIAL_ICONS.github}
                </a>
              )}
              {portfolio.hero.resumeLink && (
                <a
                  href={portfolio.hero.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-primary transition mono"
                >
                  Resume ↗
                </a>
              )}

              {/* Theme switcher — premium circular trigger with a soft glowing ring that
                  matches the active theme's gradient, opening into a polished glass
                  colour-picker panel with a gradient header. */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setThemeMenuOpen((v) => !v)}
                  aria-label="Change theme"
                  aria-expanded={themeMenuOpen}
                  className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 ${
                    themeMenuOpen ? "scale-95" : "hover:scale-105"
                  }`}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-90 group-hover:opacity-100 transition-opacity animate-[spin_6s_linear_infinite]"
                    style={{
                      background: `conic-gradient(from 180deg, var(--color-primary), var(--color-accent), var(--color-primary))`,
                    }}
                  />
                  <span
                    className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                      themeMenuOpen ? "opacity-70" : "opacity-0 group-hover:opacity-60"
                    }`}
                    style={{
                      background: `conic-gradient(from 180deg, var(--color-primary), var(--color-accent), var(--color-primary))`,
                    }}
                  />
                  <span className="absolute inset-[3px] rounded-full bg-bg/95 backdrop-blur flex items-center justify-center">
                    <Palette className="w-4 h-4 text-text group-hover:text-primary transition-colors" strokeWidth={2} />
                  </span>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg shadow-sm"
                    style={{ background: activeThemeMeta?.swatch || "var(--color-primary)" }}
                  />
                </button>

                <AnimatePresence>
                  {themeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.94 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-3 w-72 rounded-3xl border border-border bg-surface/95 backdrop-blur-xl shadow-[0_28px_60px_-18px_rgba(0,0,0,0.6)] overflow-hidden z-40"
                    >
                      {/* Gradient header */}
                      <div
                        className="relative px-5 py-4 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "14px 14px",
                          }}
                        />
                        <div className="relative flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Palette className="w-4 h-4 text-white" />
                          </span>
                          <div>
                            <p className="text-white text-sm font-semibold font-display leading-tight">Appearance</p>
                            <p className="text-white/70 text-[11px] mono">{activeThemeMeta?.label} active</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-3">
                          {THEMES.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setTheme(t.id);
                                setThemeMenuOpen(false);
                              }}
                              title={t.label}
                              className="group/swatch flex flex-col items-center gap-1.5"
                            >
                              <span
                                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                                  theme === t.id
                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-105 shadow-[0_6px_18px_-6px_var(--color-primary)]"
                                    : "ring-1 ring-border group-hover/swatch:ring-2 group-hover/swatch:ring-primary/40 group-hover/swatch:scale-105"
                                }`}
                                style={{ background: t.swatch || "var(--color-primary)" }}
                              >
                                {theme === t.id && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="w-5 h-5 rounded-full bg-white/95 flex items-center justify-center"
                                  >
                                    <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                                  </motion.span>
                                )}
                              </span>
                              <span
                                className={`text-[10px] truncate max-w-[3.5rem] text-center transition-colors ${
                                  theme === t.id ? "text-primary font-medium" : "text-textMuted group-hover/swatch:text-text"
                                }`}
                              >
                                {t.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <section className="relative scroll-mt-24 px-6 md:px-10 py-16 md:py-24 max-w-3xl mx-auto w-full text-center">
                <AuroraBackground />

                {portfolio.hero.availableForWork && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-border text-xs shadow-sm"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Available for Freelance
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mono text-accent text-sm tracking-[0.25em] mb-4 uppercase"
                >
                  {portfolio.hero.tagline || "Welcome to my portfolio"}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-text via-text to-primary"
                >
                  {portfolio.hero.title || owner.name}
                </motion.h1>

                <p className="mono text-lg md:text-2xl text-primary mb-6 h-8 font-medium">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-textMuted text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                >
                  {portfolio.hero.subtitle}
                </motion.p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
                  {portfolio.hero.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface/80 backdrop-blur border border-border rounded-full px-3.5 py-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {portfolio.hero.location}
                    </span>
                  )}
                  {portfolio.hero.yearsOfExperience > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface/80 backdrop-blur border border-border rounded-full px-3.5 py-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      {portfolio.hero.yearsOfExperience}+ Years Experience
                    </span>
                  )}
                </div>

                {highlightTeaser.length > 0 && (
                  <ul className="mt-8 space-y-2 inline-block text-left">
                    {highlightTeaser.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-text"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 text-primary shrink-0">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {topSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-8">
                    {topSkills.map((s, i) => (
                      <span
                        key={i}
                        className="mono text-xs px-3 py-1.5 rounded-full bg-surfaceAlt text-accent border border-border hover:border-primary/50 transition"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => goToSection("projects")}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_14px_36px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                  >
                    View Projects
                  </button>
                  <button
                    onClick={() => goToSection("contact")}
                    className="px-7 py-3 rounded-xl border border-border text-text hover:border-primary hover:text-primary transition font-medium"
                  >
                    Hire Me
                  </button>
                  {portfolio.hero.resumeLink && (
                    <a
                      href={portfolio.hero.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-7 py-3 rounded-xl text-primary hover:underline transition font-medium"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
                      </svg>
                      Download Resume
                    </a>
                  )}
                </div>

                {Object.values(portfolio.contact.socialLinks || {}).some(Boolean) && (
                  <div className="flex items-center justify-center gap-3 mt-9">
                    {Object.entries(portfolio.contact.socialLinks || {}).map(
                      ([key, val]) =>
                        val && (
                          <a
                            key={key}
                            href={val}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-textMuted hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all"
                          >
                            {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                          </a>
                        )
                    )}
                  </div>
                )}

                {portfolio.hero.stats?.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
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

                {marqueeItems.length > 0 && (
                  <div className="mt-14">
                    <TechMarquee items={marqueeItems} />
                  </div>
                )}

                {/* Services - folded into hero, no separate nav page */}
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

                {/* Why Choose Me - folded into hero, no separate nav page */}
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
                      <Reveal delay={0.05} className="relative bg-surface border border-border rounded-2xl p-7 md:p-8 overflow-hidden">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="absolute -top-2 -left-1 w-16 h-16 text-primary/10">
                          <path d="M9.17 6C6.87 8.06 5 11.06 5 14.83c0 3.13 1.87 5.17 4.35 5.17 2.13 0 3.65-1.65 3.65-3.7 0-2.09-1.48-3.5-3.13-3.5-.28 0-.52.02-.63.05.2-2.5 2.02-4.7 4.2-6.24L9.17 6Zm9.13 0c-2.3 2.06-4.17 5.06-4.17 8.83 0 3.13 1.87 5.17 4.35 5.17 2.13 0 3.65-1.65 3.65-3.7 0-2.09-1.48-3.5-3.13-3.5-.28 0-.52.02-.63.05.2-2.5 2.02-4.7 4.2-6.24L18.3 6Z" />
                        </svg>
                        <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4">My Approach</h3>
                        <p className="text-textMuted leading-relaxed whitespace-pre-line relative">{portfolio.about.approach}</p>
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
                              <a href={`mailto:${portfolio.contact.email}`} className="text-sm text-primary font-medium hover:underline break-all">
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

                <Reveal className="max-w-2xl">
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" /> What I Work With
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Skills</h2>
                  <p className="text-textMuted text-sm md:text-base">
                    Tools and technologies I use to design, build and ship real products.
                  </p>
                </Reveal>

                {portfolio.skills.length === 0 && <p className="text-textMuted mt-10">No skills added yet.</p>}

                {portfolio.skills.length > 0 && (
                  <>
                    {/* Shared gradient used by every circular progress ring below */}
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <linearGradient id="skillRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="var(--color-accent)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Bento wall — tile size is driven by each skill's own level, so
                        the strongest skills are literally the biggest things on screen */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={skillFilter}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[128px] gap-4 mt-10 [grid-auto-flow:dense]"
                      >
                        {visibleSkills.map((s, i) => (
                          <BentoSkillTile key={s.name + i} skill={s} delay={Math.min(i * 0.05, 0.4)} />
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </>
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
                    A look at what I've built — click any project to explore screenshots and demo videos.
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
                    long side-by-side "spotlight" layout. Featured just gets a badge. */}
                {filteredProjects.length > 0 && (
                  <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.map((p, i) => {
                        const media = getProjectMedia(p);
                        const cover = media[0];
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
                              onClick={() => (media.length > 0 ? openLightbox(p) : null)}
                              disabled={media.length === 0}
                              className="relative block w-full aspect-video overflow-hidden bg-surfaceAlt"
                            >
                              {cover ? (
                                cover.type === "video" ? (
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

                              {media.length > 0 && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                  <span className="text-white text-xs mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                                    <Eye className="w-4 h-4" /> View Gallery
                                  </span>
                                </div>
                              )}
                            </button>

                            <div className="p-5">
                              <h3 className="font-display font-semibold mb-1.5 group-hover:text-primary transition-colors">{p.title}</h3>
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

                              {(p.liveLink || p.githubLink) && (
                                <div className="flex items-center gap-4 pt-3 border-t border-border">
                                  {p.liveLink && (
                                    <a
                                      href={p.liveLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                  )}
                                  {p.githubLink && (
                                    <a
                                      href={p.githubLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-primary transition"
                                    >
                                      <GithubMark className="w-3.5 h-3.5" /> Code
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </TiltCard>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Gallery modal: every screenshot the admin added is shown at once in
                    a grid, each with its own caption/description underneath — no more
                    clicking through images one at a time. Demo video (if any) sits on
                    top, full width. */}
                <AnimatePresence>
                  {lightboxProject && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-50 bg-black/85 flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
                      onClick={closeLightbox}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-5xl w-full my-auto bg-bg border border-border rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-b border-border sticky top-0 bg-bg/95 backdrop-blur z-10">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-semibold truncate">{lightboxProject.title}</h3>
                            <p className="mono text-[11px] text-textMuted mt-0.5">
                              {lightboxMedia.length} {lightboxMedia.length === 1 ? "item" : "items"} in gallery
                            </p>
                          </div>
                          <button
                            onClick={closeLightbox}
                            className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-textMuted hover:text-primary hover:border-primary transition"
                            aria-label="Close gallery"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-5 md:p-7 max-h-[75vh] overflow-y-auto">
                          {lightboxProject.description && (
                            <p className="text-textMuted text-sm leading-relaxed mb-6 max-w-2xl">{lightboxProject.description}</p>
                          )}

                          {lightboxMedia.length === 0 ? (
                            <p className="text-textMuted text-sm">No screenshots or demo video added for this project yet.</p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-5">
                              {lightboxMedia.map((m, mi) => (
                                <motion.div
                                  key={mi}
                                  initial={{ opacity: 0, y: 16 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, delay: Math.min(mi * 0.06, 0.36), ease: [0.22, 1, 0.36, 1] }}
                                  className={`rounded-xl overflow-hidden border border-border bg-surface ${
                                    m.type === "video" ? "sm:col-span-2" : ""
                                  }`}
                                >
                                  {m.type === "video" ? (
                                    isVideoFile(m.src) ? (
                                      <video src={m.src} controls className="w-full max-h-[60vh] bg-black" />
                                    ) : (
                                      <iframe
                                        src={toEmbedUrl(m.src)}
                                        title={`${lightboxProject.title} demo`}
                                        allow="autoplay; fullscreen"
                                        className="w-full aspect-video"
                                      />
                                    )
                                  ) : (
                                    <img
                                      src={m.src}
                                      alt={m.caption || lightboxProject.title}
                                      className="w-full max-h-[60vh] object-contain bg-black"
                                    />
                                  )}
                                  {m.caption && (
                                    <p className="text-textMuted text-sm leading-relaxed px-4 py-3 border-t border-border">
                                      {m.caption}
                                    </p>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                          <a href={c.href} className="relative block text-sm text-primary font-medium hover:underline break-all">
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
                        href={`mailto:${portfolio.contact.email}`}
                        className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_14px_36px_-8px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
                      >
                        <Mail className="w-4 h-4" /> Say Hello
                      </a>
                    )}
                    {portfolio.hero.resumeLink && (
                      <a
                        href={portfolio.hero.resumeLink}
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
                          href={val}
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