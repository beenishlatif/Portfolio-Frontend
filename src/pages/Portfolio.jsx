import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  ChevronDown,
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

// ---------------------------------------------------------------------------
// Shared primitives for the new visual language: hairline borders, sharp
// corners, mono index numbers, and corner-bracket hover states instead of
// glassy blur/glow. These replace the previous Spotlight/TiltCard/Aurora set.
// ---------------------------------------------------------------------------

const Reveal = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Four corner brackets that resolve into view on hover/focus — the page's
// recurring "targeting" motif, used on every interactive block instead of
// a glow or blurred spotlight.
const CornerBrackets = ({ size = 10 }) => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-0">
    <span
      className="absolute left-0 top-0 border-l border-t border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ width: size, height: size }}
    />
    <span
      className="absolute right-0 top-0 border-r border-t border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ width: size, height: size }}
    />
    <span
      className="absolute left-0 bottom-0 border-l border-b border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ width: size, height: size }}
    />
    <span
      className="absolute right-0 bottom-0 border-r border-b border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ width: size, height: size }}
    />
  </span>
);

// Fixed, near-static backdrop: a faint blueprint grid plus frame ticks at the
// viewport corners. Deliberately still — the page's motion budget is spent
// on the index rail and reveals, not on ambient blobs.
const GridField = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
      }}
    />
    <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-border" />
    <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-border" />
    <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-border" />
    <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-border" />
  </div>
);

// Small live availability readout — mono status line, used in the hero and
// the contact section so it reads like a build/CI status rather than a badge.
const StatusLine = ({ available, availableLabel = "AVAILABLE", unavailableLabel = "UNAVAILABLE" }) => (
  <span className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-textMuted">
    <span className="relative flex h-1.5 w-1.5">
      {available && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${available ? "bg-green-500" : "bg-textMuted"}`} />
    </span>
    STATUS:&nbsp;<span className={available ? "text-primary" : "text-textMuted"}>{available ? availableLabel : unavailableLabel}</span>
  </span>
);

// label : value row — the recurring "spec sheet" unit used across About,
// Education and Contact instead of icon cards.
const SpecRow = ({ icon, label, value, href }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border/70 last:border-b-0">
    {icon && <span className="text-primary shrink-0">{icon}</span>}
    <span className="mono text-[10px] text-textMuted uppercase tracking-widest w-24 shrink-0">{label}</span>
    {href ? (
      <a href={href} className="text-sm text-text hover:text-primary transition truncate">
        {value}
      </a>
    ) : (
      <span className="text-sm text-text truncate">{value}</span>
    )}
  </div>
);

const TechMarquee = ({ items }) => {
  if (!items || items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-5 border-y border-border">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
      <div className="flex gap-10 w-max animate-marquee">
        {loop.map((t, i) => (
          <span key={i} className="mono text-xs text-textMuted whitespace-nowrap flex items-center gap-2 uppercase tracking-wider">
            <span className="w-1 h-1 bg-primary/60" />
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
          animation: marqueeScroll 24s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Counts up to a target number once it scrolls into view.
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

// Groups a flat skills array into { category: [skills] } while preserving
// first-seen category order.
const groupSkillsByCategory = (skills) => {
  const groups = {};
  skills.forEach((s) => {
    const cat = s.category || "General";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });
  return groups;
};

const skillLevelMeta = (level = 0) => {
  if (level >= 90) return { label: "Expert", tone: "text-primary" };
  if (level >= 75) return { label: "Advanced", tone: "text-accent" };
  if (level >= 50) return { label: "Intermediate", tone: "text-textMuted" };
  return { label: "Familiar", tone: "text-textMuted" };
};

// Premium bento-style skill card with an animated SVG progress ring —
// replaces the old flat meter-bar rows with something more tactile and
// worth lingering on.
const SkillRing = ({ skill, index, delay }) => {
  const level = skill.level ?? 0;
  const meta = skillLevelMeta(level);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(level, 0), 100) / 100) * circumference;
  const gradId = `skillGrad-${skill.name?.replace(/\s+/g, "") || "s"}-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center gap-3 px-4 py-6 border border-border bg-gradient-to-b from-surface/60 to-surface/20 hover:border-primary/50 hover:shadow-[0_18px_40px_-20px_var(--color-primary)] transition-all duration-300 hover:-translate-y-1"
    >
      <CornerBrackets size={9} />
      <span className="absolute top-3 left-3 mono text-[9px] text-textMuted/70">{String(index + 1).padStart(2, "0")}</span>

      <div className="relative w-[76px] h-[76px]">
        <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
          <circle cx="38" cy="38" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="5" />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.15, delay: delay + 0.15, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm font-bold text-text">{level}%</span>
        </div>
      </div>

      <div className="text-center min-w-0 w-full">
        <p className="text-sm font-semibold text-text truncate">{skill.name}</p>
        <p className={`mono text-[9px] uppercase tracking-widest mt-1 ${meta.tone}`}>{meta.label}</p>
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
// array for the lightbox. The first screenshot (if any) doubles as cover.
const getProjectMedia = (p) => {
  const items = [];
  (p.screenshots || []).forEach((s) => {
    if (s?.url) items.push({ type: "image", src: s.url, caption: s.caption || "" });
  });
  if (p.video?.url) items.push({ type: "video", src: p.video.url, caption: p.video.caption || "" });
  return items;
};

// Fixed left index rail — the page's signature element. Doubles as the
// primary section navigation (replacing the old pill/underline navbar) and
// as a live scroll-position readout, like annotation marks on a blueprint
// or the gutter of a code editor.
const IndexRail = ({ active, onNavigate, progress }) => (
  <nav
    aria-label="Section navigation"
    className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-16 border-r border-border z-30 bg-bg/85 backdrop-blur-sm"
  >
    <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
      {SECTIONS.map((s, i) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            className="group relative w-full flex flex-col items-center py-3.5"
            aria-current={isActive ? "true" : undefined}
            aria-label={s.label}
          >
            <span className={`mono text-[10px] tracking-widest transition-colors ${isActive ? "text-primary" : "text-textMuted group-hover:text-text"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`mt-1.5 h-5 w-px transition-colors ${isActive ? "bg-primary" : "bg-border group-hover:bg-textMuted"}`} />
            <span
              className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-surface border border-border opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-40"
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
    <div className="pb-7 flex flex-col items-center gap-2">
      <span className="mono text-[9px] text-textMuted">{progress}%</span>
      <div className="w-px h-10 bg-border relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full bg-primary transition-[height] duration-150" style={{ height: `${progress}%` }} />
      </div>
    </div>
  </nav>
);

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
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Subtle navbar elevation + rail progress readout, once the current
  // "page" has been scrolled.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      setScrolled(el.scrollTop > 8);
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeSection]);

  // Keyboard: Esc closes the gallery modal.
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
        <p className="mono text-textMuted text-sm tracking-widest">LOADING PORTFOLIO…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-6 text-center">
        <p className="mono text-[11px] text-primary uppercase tracking-widest mb-3">404 / Not Found</p>
        <p className="text-2xl font-display font-semibold mb-2">Portfolio Not Found</p>
        <p className="text-textMuted mb-6">{error}</p>
        <Link to="/" className="mono text-sm text-primary hover:underline">
          ← Back to homepage
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
    <div className="h-screen bg-bg text-text flex flex-col overflow-hidden relative">
      <GridField />
      <IndexRail active={activeSection} onNavigate={goToSection} progress={scrollProgress} />

      <div className="flex-1 flex flex-col overflow-hidden lg:pl-16">
        {/* ===== Slim top bar ===== */}
        <header
          className={`sticky top-0 z-20 transition-all duration-300 border-b ${
            scrolled ? "bg-bg/90 backdrop-blur-xl border-border" : "bg-bg/60 backdrop-blur-md border-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-6 md:px-10 py-4 gap-4">
            <button onClick={() => goToSection("hero")} className="group flex items-center gap-3 font-display font-semibold shrink-0">
              <span className="flex items-center justify-center w-9 h-9 border border-primary/60 text-primary text-sm group-hover:border-primary transition-colors">
                {owner.name?.[0]?.toUpperCase() || "•"}
              </span>
              <span className="hidden sm:flex flex-col leading-tight text-left">
                <span className="text-sm">{owner.name}</span>
                <span className="mono text-[9px] text-textMuted uppercase tracking-widest">
                  §{String(SECTIONS.findIndex((s) => s.id === activeSection) + 1).padStart(2, "0")} / {SECTIONS.find((s) => s.id === activeSection)?.label}
                </span>
              </span>
            </button>

            <div className="flex items-center gap-2.5 shrink-0">
              {portfolio.hero.githubLink && (
                <a
                  href={portfolio.hero.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 border border-border text-textMuted hover:text-primary hover:border-primary transition"
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
                  className="hidden sm:inline-flex items-center gap-1.5 mono text-xs text-textMuted hover:text-primary transition uppercase tracking-widest"
                >
                  Resume <ArrowUpRight className="w-3 h-3" />
                </a>
              )}

              {/* Theme switcher — premium pill trigger with a live conic-gradient
                  swatch of the active palette, opening a rich picker panel */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setThemeMenuOpen((v) => !v)}
                  aria-label="Change theme"
                  aria-expanded={themeMenuOpen}
                  className={`group relative flex items-center gap-2 h-9 pl-2 pr-2.5 sm:pr-3 rounded-full border transition-all duration-300 ${
                    themeMenuOpen
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border text-textMuted hover:text-text hover:border-primary/50 hover:bg-surface"
                  }`}
                >
                  <span className="relative flex items-center justify-center w-5 h-5 rounded-full shrink-0 overflow-hidden ring-1 ring-border/80 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(from 180deg, var(--color-primary), var(--color-accent), var(--color-primary))`,
                      }}
                    />
                    {themeMenuOpen && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/40" />
                    )}
                  </span>
                  <span className="hidden sm:inline mono text-[10px] uppercase tracking-widest">{activeThemeMeta?.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${themeMenuOpen ? "rotate-180 text-primary" : "text-textMuted"}`} />
                </button>

                <AnimatePresence>
                  {themeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-72 border border-border rounded-xl bg-surface/95 backdrop-blur-xl shadow-[0_25px_60px_-18px_rgba(0,0,0,0.55)] overflow-hidden z-40"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
                        <div>
                          <span className="mono text-[10px] uppercase tracking-widest text-primary block">Appearance</span>
                          <span className="text-[11px] text-textMuted">{THEMES.length} palettes available</span>
                        </div>
                        <span
                          className="w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-surface ring-primary shrink-0"
                          style={{ background: activeThemeMeta?.swatch || "var(--color-primary)" }}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-3.5 p-4">
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTheme(t.id);
                              setThemeMenuOpen(false);
                            }}
                            title={t.label}
                            className="group/theme flex flex-col items-center gap-1.5"
                          >
                            <span
                              className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 group-hover/theme:scale-110 group-hover/theme:shadow-[0_6px_18px_-4px_rgba(0,0,0,0.35)] ${
                                theme === t.id ? "ring-2 ring-offset-2 ring-offset-surface ring-primary" : "ring-1 ring-border"
                              }`}
                              style={{ background: t.swatch || "var(--color-primary)" }}
                            >
                              {theme === t.id && <Check className="w-3.5 h-3.5 text-white drop-shadow" strokeWidth={3} />}
                            </span>
                            <span className="mono text-[8px] text-textMuted truncate max-w-[3.6rem] group-hover/theme:text-text transition-colors">
                              {t.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="lg:hidden w-9 h-9 flex items-center justify-center border border-border text-text"
                aria-label="Toggle navigation"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile page list — numbered index rows, mirrors the desktop rail */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="lg:hidden overflow-hidden border-t border-border"
              >
                <div className="flex flex-col">
                  {SECTIONS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goToSection(s.id)}
                      className={`flex items-center gap-3 text-left px-6 py-3 border-b border-border/60 text-sm transition ${
                        activeSection === s.id ? "text-primary bg-primary/5" : "text-textMuted hover:text-text"
                      }`}
                    >
                      <span className="mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* ===== Only the active "page" is mounted ===== */}
        <main ref={mainRef} className="flex-1 w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === "hero" && (
                <section className="relative scroll-mt-24 px-6 md:px-10 py-16 md:py-24 max-w-5xl mx-auto w-full">
                  <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
                    <div className="lg:col-span-3">
                      {portfolio.hero.availableForWork !== undefined && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
                          <StatusLine available={portfolio.hero.availableForWork} availableLabel="AVAILABLE FOR FREELANCE" unavailableLabel="NOT AVAILABLE" />
                        </motion.div>
                      )}

                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mono text-accent text-xs tracking-[0.3em] mb-4 uppercase"
                      >
                        {portfolio.hero.tagline || "Welcome to my portfolio"}
                      </motion.p>

                      <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="font-display text-4xl md:text-6xl font-bold leading-[1.02] mb-5 tracking-tight"
                      >
                        {portfolio.hero.title || owner.name}
                      </motion.h1>

                      <p className="mono text-base md:text-xl text-primary mb-6 h-7 font-medium">
                        {displayText}
                        <span className="animate-pulse">_</span>
                      </p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-textMuted text-base leading-relaxed max-w-lg"
                      >
                        {portfolio.hero.subtitle}
                      </motion.p>

                      {highlightTeaser.length > 0 && (
                        <ul className="mt-7 space-y-2">
                          {highlightTeaser.map((h, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + i * 0.08 }}
                              className="flex items-start gap-2.5 text-sm text-text"
                            >
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                              {h}
                            </motion.li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-9">
                        <button
                          onClick={() => goToSection("projects")}
                          className="px-6 py-3 border border-primary bg-primary text-white text-sm font-medium shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_14px_36px_-8px_var(--color-primary)] hover:bg-transparent hover:text-primary transition-all"
                        >
                          View Projects
                        </button>
                        <button
                          onClick={() => goToSection("contact")}
                          className="group relative px-6 py-3 border border-border text-text hover:border-primary hover:text-primary transition text-sm font-medium"
                        >
                          <CornerBrackets size={8} />
                          Hire Me
                        </button>
                        {portfolio.hero.resumeLink && (
                          <a
                            href={portfolio.hero.resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2 py-3 text-primary hover:underline transition text-sm font-medium"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Resume
                          </a>
                        )}
                      </div>

                      {Object.values(portfolio.contact.socialLinks || {}).some(Boolean) && (
                        <div className="flex items-center gap-2.5 mt-8">
                          {Object.entries(portfolio.contact.socialLinks || {}).map(
                            ([key, val]) =>
                              val && (
                                <a
                                  key={key}
                                  href={val}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-9 h-9 flex items-center justify-center border border-border text-textMuted hover:text-primary hover:border-primary transition"
                                >
                                  {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                                </a>
                              )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right rail: spec-sheet summary instead of pill badges */}
                    <div className="lg:col-span-2 border border-border relative overflow-hidden shadow-[0_20px_50px_-25px_rgba(0,0,0,0.4)]">
                      <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />
                      <div className="px-5 py-3 border-b border-border mono text-[10px] uppercase tracking-widest text-primary">
                        Profile
                      </div>
                      <div className="px-5">
                        {portfolio.hero.location && <SpecRow icon={<MapPin className="w-3.5 h-3.5" />} label="Based" value={portfolio.hero.location} />}
                        {portfolio.hero.yearsOfExperience > 0 && (
                          <SpecRow icon={<Calendar className="w-3.5 h-3.5" />} label="Exp." value={`${portfolio.hero.yearsOfExperience}+ Years`} />
                        )}
                        {portfolio.contact.email && (
                          <SpecRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={portfolio.contact.email} href={`mailto:${portfolio.contact.email}`} />
                        )}
                      </div>

                      {topSkills.length > 0 && (
                        <div className="px-5 py-4 border-t border-border">
                          <p className="mono text-[10px] uppercase tracking-widest text-textMuted mb-3">Core Stack</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                            {topSkills.map((s, i) => (
                              <span key={i} className="mono text-[11px] text-accent">
                                {s.name}
                                {i < topSkills.length - 1 && <span className="text-border ml-3">/</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {portfolio.hero.stats?.length > 0 && (
                        <div className="grid grid-cols-2 border-t border-border">
                          {portfolio.hero.stats.map((s, i) => (
                            <div key={i} className={`px-5 py-4 ${i % 2 === 0 ? "border-r" : ""} ${i >= 2 ? "border-t" : ""} border-border`}>
                              <p className="font-display text-2xl font-bold text-primary">
                                <CountUp value={parseInt(String(s.value).replace(/\D/g, "")) || 0} />
                                {String(s.value).replace(/[0-9]/g, "")}
                              </p>
                              <p className="text-textMuted text-[10px] mono mt-1 uppercase tracking-wide">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {marqueeItems.length > 0 && <div className="mt-16">{<TechMarquee items={marqueeItems} />}</div>}

                  {/* Services */}
                  {services.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-border">
                      <p className="mono text-xs text-primary uppercase tracking-widest mb-2">What I Do</p>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Services</h2>
                      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-border border-t border-l border-border">
                        {services.map((s, i) => (
                          <Reveal
                            key={i}
                            delay={i * 0.05}
                            className={`group relative p-6 border-b border-r border-border hover:bg-surface/60 transition-colors ${
                              i % 2 === 0 ? "" : ""
                            }`}
                          >
                            <CornerBrackets />
                            <div className="mono text-3xl font-display font-semibold text-primary/25 mb-4">{String(i + 1).padStart(2, "0")}</div>
                            <h3 className="font-display font-semibold mb-2">{s.title}</h3>
                            <p className="text-textMuted text-sm leading-relaxed">{s.description}</p>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Why Choose Me */}
                  {whyChooseMe.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-border">
                      <p className="mono text-xs text-primary uppercase tracking-widest mb-2">The Difference</p>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Why Choose Me</h2>
                      <div className="space-y-0">
                        {whyChooseMe.map((w, i) => (
                          <Reveal key={i} delay={i * 0.05} className="flex gap-5 py-5 border-b border-border/70">
                            <span className="mono text-xs text-textMuted w-6 shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
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
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-5xl mx-auto w-full">
                  <Reveal className="max-w-2xl">
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§02 / Get To Know Me</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">About</h2>
                    <p className="text-textMuted text-sm md:text-base">A closer look at who I am, how I think, and what I bring to the table.</p>
                  </Reveal>

                  <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mt-12 items-start">
                    <div className="lg:col-span-3 space-y-6">
                      <Reveal className="relative border border-border overflow-hidden shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] transition-shadow duration-300">
                        <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                          <span className="w-2 h-2 rounded-full bg-border" />
                          <span className="w-2 h-2 rounded-full bg-border" />
                          <span className="w-2 h-2 rounded-full bg-border" />
                          <span className="mono text-[10px] text-textMuted ml-2">about.md</span>
                        </div>
                        <p className="text-text leading-relaxed whitespace-pre-line text-base p-6">{portfolio.about.bio || "No bio added yet."}</p>
                      </Reveal>

                      {portfolio.about.approach && (
                        <Reveal delay={0.05} className="border border-border hover:border-primary/40 transition-colors duration-300">
                          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                            <span className="mono text-[10px] text-primary uppercase tracking-widest">Approach</span>
                          </div>
                          <p className="text-textMuted leading-relaxed whitespace-pre-line p-6">{portfolio.about.approach}</p>
                        </Reveal>
                      )}

                      {portfolio.about.highlights?.length > 0 && (
                        <Reveal delay={0.1}>
                          <p className="mono text-[10px] text-primary uppercase tracking-widest mb-3 mt-2">Highlights</p>
                          <div className="border-t border-l border-border grid sm:grid-cols-2">
                            {portfolio.about.highlights.map((h, i) => (
                              <div key={i} className="group flex gap-3 items-start px-4 py-3.5 border-b border-r border-border hover:bg-primary/5 transition-colors">
                                <span className="mono text-[10px] text-primary shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                                <span className="text-sm text-text leading-relaxed">{h}</span>
                              </div>
                            ))}
                          </div>
                        </Reveal>
                      )}
                    </div>

                    <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
                      <Reveal delay={0.05} className="border border-border shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)]">
                        <div className="px-5 py-3 border-b border-border mono text-[10px] uppercase tracking-widest text-primary">At a Glance</div>
                        <div className="px-5">
                          {portfolio.hero.location && <SpecRow icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={portfolio.hero.location} />}
                          {portfolio.hero.yearsOfExperience > 0 && (
                            <SpecRow icon={<Calendar className="w-3.5 h-3.5" />} label="Exp." value={`${portfolio.hero.yearsOfExperience}+ Years`} />
                          )}
                          <div className="py-3 border-b border-border/70 last:border-b-0">
                            <StatusLine available={portfolio.hero.availableForWork} availableLabel="OPEN FOR WORK" unavailableLabel="NOT AVAILABLE" />
                          </div>
                          {portfolio.contact.email && (
                            <SpecRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={portfolio.contact.email} href={`mailto:${portfolio.contact.email}`} />
                          )}
                        </div>
                        <button
                          onClick={() => goToSection("contact")}
                          className="w-full px-5 py-3 border-t border-border text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          Let's Work Together →
                        </button>
                      </Reveal>

                      {topSkills.length > 0 && (
                        <Reveal delay={0.1} className="border border-border px-5 py-5">
                          <p className="mono text-[10px] text-primary uppercase tracking-widest mb-3">Core Skills</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                            {topSkills.map((s, i) => (
                              <span key={i} className="mono text-[11px] text-accent">
                                {s.name}
                                {i < topSkills.length - 1 && <span className="text-border ml-3">/</span>}
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
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-5xl mx-auto w-full">
                  <Reveal className="max-w-2xl">
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§03 / Readout</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Skills</h2>
                    <p className="text-textMuted text-sm md:text-base">Tools and technologies I use to design, build and ship real products.</p>
                  </Reveal>

                  {portfolio.skills.length === 0 && <p className="text-textMuted mt-10">No skills added yet.</p>}

                  {portfolio.skills.length > 0 && (
                    <>
                      <div className="flex flex-wrap gap-2 mt-8">
                        {["All", ...Object.keys(skillGroups)].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSkillFilter(cat)}
                            className={`mono text-[11px] px-3 py-1.5 rounded-full border uppercase tracking-widest transition-all ${
                              skillFilter === cat
                                ? "border-primary text-white bg-primary shadow-[0_8px_20px_-8px_var(--color-primary)]"
                                : "border-border text-textMuted hover:text-text hover:border-textMuted"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={skillFilter}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        >
                          {visibleSkills.map((s, i) => (
                            <SkillRing key={s.name + i} skill={s} index={i} delay={Math.min(i * 0.05, 0.45)} />
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                </section>
              )}

              {activeSection === "projects" && (
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-5xl mx-auto w-full">
                  <Reveal>
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§04 / Selected Work</p>
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                      <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Projects</h2>
                      {portfolio.projects.length > 0 && (
                        <span className="mono text-[11px] text-textMuted border border-border px-3 py-1 mb-1">
                          {String(filteredProjects.length).padStart(2, "0")} {filteredProjects.length === 1 ? "PROJECT" : "PROJECTS"}
                          {projectFilter !== "All" && <span className="text-primary"> · {projectFilter}</span>}
                        </span>
                      )}
                    </div>
                    <p className="text-textMuted text-sm md:text-base max-w-xl">
                      A look at what I've built — select a project to explore screenshots and demo videos.
                    </p>
                  </Reveal>

                  {portfolio.projects.length === 0 && <p className="text-textMuted mt-10">No projects added yet.</p>}

                  {allProjectTechs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                      {["All", ...allProjectTechs].map((t) => (
                        <button
                          key={t}
                          onClick={() => setProjectFilter(t)}
                          className={`mono text-[11px] px-3.5 py-1.5 rounded-full border transition-all ${
                            projectFilter === t
                              ? "border-primary text-white bg-primary shadow-[0_8px_20px_-8px_var(--color-primary)]"
                              : "border-border text-textMuted hover:border-textMuted hover:text-text"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Indexed row layout — image thumbnail beside title/tags/links */}
                  <motion.div layout className="mt-10 border-t border-border">
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.map((p, i) => {
                        const media = getProjectMedia(p);
                        const cover = media[0];
                        return (
                          <motion.div
                            key={`${p.title}-${i}`}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex flex-col sm:flex-row gap-5 sm:gap-8 py-7 border-b border-border hover:bg-surface/50 hover:shadow-[0_20px_45px_-30px_rgba(0,0,0,0.5)] transition-all px-1 sm:px-2"
                          >
                            <span className="mono text-xs text-textMuted sm:w-10 shrink-0 pt-1">{String(i + 1).padStart(2, "0")}</span>

                            <button
                              onClick={() => (media.length > 0 ? openLightbox(p) : null)}
                              disabled={media.length === 0}
                              className="group/thumb relative block w-full sm:w-56 aspect-video overflow-hidden bg-surfaceAlt border border-border shrink-0"
                            >
                              <CornerBrackets />
                              {cover ? (
                                cover.type === "video" ? (
                                  <div className="w-full h-full flex items-center justify-center text-primary bg-surfaceAlt">
                                    <PlayCircle className="w-8 h-8" />
                                  </div>
                                ) : (
                                  <img
                                    src={cover.src}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition duration-500 ease-out"
                                  />
                                )
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-textMuted">
                                  <ImageIcon className="w-7 h-7" />
                                </div>
                              )}
                              {media.length > 1 && (
                                <span className="absolute bottom-2 right-2 mono text-[10px] bg-black/70 text-white px-2 py-1 flex items-center gap-1">
                                  <Images className="w-3 h-3" />
                                  {media.length}
                                </span>
                              )}
                              {media.length > 0 && (
                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                                  <span className="text-white text-xs mono flex items-center gap-1.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                    <Eye className="w-3.5 h-3.5" /> View Gallery
                                  </span>
                                </div>
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                                {p.featured && (
                                  <span className="inline-flex items-center gap-1 mono text-[9px] px-2 py-0.5 rounded-full border border-primary/50 text-primary uppercase tracking-widest bg-primary/5">
                                    <Sparkles className="w-2.5 h-2.5" /> Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-textMuted text-sm leading-relaxed mb-3 line-clamp-2 max-w-xl">{p.description}</p>

                              {p.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                                  {p.techStack.map((t, idx) => (
                                    <span key={idx} className="mono text-[11px] text-accent">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {(p.liveLink || p.githubLink) && (
                                <div className="flex items-center gap-4">
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
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* Gallery modal */}
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
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="max-w-5xl w-full my-auto bg-bg border border-border overflow-hidden shadow-2xl"
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
                              className="shrink-0 w-9 h-9 border border-border flex items-center justify-center text-textMuted hover:text-primary hover:border-primary transition"
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
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.32, delay: Math.min(mi * 0.06, 0.36), ease: [0.22, 1, 0.36, 1] }}
                                    className={`overflow-hidden border border-border bg-surface ${m.type === "video" ? "sm:col-span-2" : ""}`}
                                  >
                                    {m.type === "video" ? (
                                      isVideoFile(m.src) ? (
                                        <video src={m.src} controls className="w-full max-h-[60vh] bg-black" />
                                      ) : (
                                        <iframe src={toEmbedUrl(m.src)} title={`${lightboxProject.title} demo`} allow="autoplay; fullscreen" className="w-full aspect-video" />
                                      )
                                    ) : (
                                      <img src={m.src} alt={m.caption || lightboxProject.title} className="w-full max-h-[60vh] object-contain bg-black" />
                                    )}
                                    {m.caption && <p className="text-textMuted text-sm leading-relaxed px-4 py-3 border-t border-border">{m.caption}</p>}
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
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-5xl mx-auto w-full">
                  <Reveal className="max-w-2xl">
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§05 / Career Path</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Experience</h2>
                    <p className="text-textMuted text-sm md:text-base">A log of the roles, teams and projects that have shaped how I build software.</p>
                  </Reveal>

                  {experienceList.length === 0 && <p className="text-textMuted mt-10">No experience added yet.</p>}

                  {/* Git-log style timeline */}
                  {experienceList.length > 0 && (
                    <div className="mt-12 border-l border-border ml-1.5" style={{ borderImage: "linear-gradient(var(--color-primary), var(--color-border)) 1" }}>
                      {experienceList.map((e, i) => (
                        <Reveal key={i} delay={Math.min(i * 0.07, 0.35)} className="relative pl-8 pb-9 last:pb-0">
                          <span
                            className={`absolute -left-[7px] top-1.5 w-3 h-3 border-2 border-bg ${e.current ? "bg-primary shadow-[0_0_0_4px_var(--color-primary)_/_20]" : "bg-textMuted"}`}
                          />
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                            <span className="mono text-[10px] text-textMuted">{e.duration}</span>
                            {e.current && <span className="mono text-[9px] px-1.5 py-0.5 rounded-full border border-primary/50 text-primary uppercase tracking-widest bg-primary/5">Current</span>}
                          </div>
                          <h3 className="font-display font-semibold text-base md:text-lg leading-snug">{e.role}</h3>
                          <p className="flex items-center gap-1.5 text-sm text-primary font-medium mt-0.5 mb-3">
                            <Building2 className="w-3.5 h-3.5" />
                            {e.company}
                            {e.location && <span className="text-textMuted font-normal">— {e.location}</span>}
                          </p>

                          {e.description && <p className="text-textMuted text-sm leading-relaxed max-w-2xl mb-3">{e.description}</p>}

                          {e.achievements?.length > 0 && (
                            <ul className="space-y-1.5 mt-2 max-w-2xl">
                              {e.achievements.map((a, ai) => (
                                <li key={ai} className="flex gap-2.5 text-sm text-text">
                                  <span className="mono text-primary/60 shrink-0">└─</span>
                                  <span className="leading-relaxed">{a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Reveal>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {activeSection === "education" && (
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-5xl mx-auto w-full">
                  <Reveal className="max-w-2xl">
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§06 / Academic Background</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Education</h2>
                    <p className="text-textMuted text-sm md:text-base">The formal foundation behind the skills I bring to every project.</p>
                  </Reveal>

                  {educationList.length === 0 && <p className="text-textMuted mt-10">No education added yet.</p>}

                  {educationList.length > 0 && (
                    <>
                      <div className={`grid gap-5 mt-12 ${educationList.length === 1 ? "max-w-xl" : "sm:grid-cols-2"}`}>
                        {educationList.map((e, i) => (
                          <Reveal
                            key={i}
                            delay={Math.min(i * 0.08, 0.35)}
                            className="group relative border border-border p-6 md:p-7 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(0,0,0,0.4)] transition-all duration-300"
                          >
                            <CornerBrackets />
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <span className="mono text-[10px] text-primary border border-primary/40 rounded-full px-2 py-1">EDU–{String(i + 1).padStart(2, "0")}</span>
                              {e.gpa && <span className="mono text-[10px] text-textMuted">GPA {e.gpa}</span>}
                            </div>
                            <GraduationCap className="w-6 h-6 text-primary mb-3" />
                            <h3 className="font-display font-semibold text-lg leading-snug mb-1.5">{e.university}</h3>
                            <p className="text-sm text-primary font-medium mb-3">
                              {e.degree}
                              {e.fieldOfStudy && ` in ${e.fieldOfStudy}`}
                            </p>
                            {e.duration && (
                              <span className="inline-flex items-center gap-1.5 mono text-[11px] text-textMuted mb-4">
                                <Calendar className="w-3 h-3" />
                                {e.duration}
                              </span>
                            )}
                            {e.description && <p className="text-textMuted text-sm leading-relaxed pt-4 border-t border-border">{e.description}</p>}
                          </Reveal>
                        ))}
                      </div>

                      <Reveal delay={0.1} className="relative mt-12 border border-border p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden">
                        <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                        <div className="text-center md:text-left">
                          <h3 className="font-display text-lg md:text-xl font-semibold mb-1.5">Curious how this translates into practice?</h3>
                          <p className="text-textMuted text-sm">See how this background shows up in the skills I use and the projects I've shipped.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                          <button onClick={() => goToSection("skills")} className="px-5 py-2.5 border border-primary bg-primary text-white text-sm font-medium shadow-[0_10px_25px_-10px_var(--color-primary)] hover:bg-transparent hover:text-primary transition-all">
                            View Skills
                          </button>
                          <button onClick={() => goToSection("experience")} className="px-5 py-2.5 border border-border text-text hover:border-primary hover:text-primary transition text-sm font-medium">
                            View Experience
                          </button>
                        </div>
                      </Reveal>
                    </>
                  )}
                </section>
              )}

              {activeSection === "contact" && (
                <section className="relative scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-4xl mx-auto w-full">
                  <Reveal className="text-center">
                    <p className="mono text-xs text-primary uppercase tracking-widest mb-2">§07 / Get In Touch</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">Let's Talk</h2>
                    <p className="text-textMuted text-sm md:text-base max-w-lg mx-auto">
                      Have a project in mind, a role to discuss, or just want to say hello? Here's how to reach me.
                    </p>
                    {typeof portfolio.hero.availableForWork === "boolean" && (
                      <div className="mt-5 inline-block">
                        <StatusLine available={portfolio.hero.availableForWork} availableLabel="AVAILABLE FOR NEW WORK" unavailableLabel="NOT CURRENTLY AVAILABLE" />
                      </div>
                    )}
                  </Reveal>

                  {contactCards.length > 0 && (
                    <div className="mt-12 border border-border divide-y divide-border shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]">
                      {contactCards.map((c) => (
                        <div key={c.key} className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors">
                          <span className="text-primary shrink-0">{c.icon}</span>
                          <span className="mono text-[10px] text-textMuted uppercase tracking-widest w-20 shrink-0">{c.label}</span>
                          {c.href ? (
                            <a href={c.href} className="text-sm text-text hover:text-primary transition truncate">
                              {c.value}
                            </a>
                          ) : (
                            <span className="text-sm text-text truncate">{c.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Reveal delay={0.1} className="relative mt-8 border border-border p-8 md:p-12 text-center overflow-hidden">
                    <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />
                    <h3 className="font-display text-xl md:text-2xl font-semibold mb-2.5">Let's build something great</h3>
                    <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-7">
                      {portfolio.hero.tagline || "Reach out and I'll get back to you as soon as I can."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {portfolio.contact.email && (
                        <a
                          href={`mailto:${portfolio.contact.email}`}
                          className="inline-flex items-center gap-1.5 px-6 py-3 border border-primary bg-primary text-white text-sm font-medium shadow-[0_12px_30px_-10px_var(--color-primary)] hover:shadow-[0_16px_36px_-8px_var(--color-primary)] hover:bg-transparent hover:text-primary transition-all"
                        >
                          <Mail className="w-4 h-4" /> Say Hello
                        </a>
                      )}
                      {portfolio.hero.resumeLink && (
                        <a
                          href={portfolio.hero.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-6 py-3 border border-border text-text hover:border-primary hover:text-primary transition text-sm font-medium"
                        >
                          <Download className="w-4 h-4" /> Resume
                        </a>
                      )}
                    </div>

                    {socialEntries.length > 0 && (
                      <div className="flex items-center justify-center gap-3 mt-8 pt-7 border-t border-border">
                        {socialEntries.map(([key, val]) => (
                          <a
                            key={key}
                            href={val}
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 flex items-center justify-center border border-border text-textMuted hover:text-primary hover:border-primary transition"
                            aria-label={key}
                          >
                            {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                          </a>
                        ))}
                      </div>
                    )}
                  </Reveal>

                  <div className="mt-10 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border">
                    {["New projects & freelance collaborations", "Full-time or contract opportunities", "Technical questions about my work"].map((item, i) => (
                      <Reveal key={i} delay={i * 0.06} className="flex items-start gap-2.5 text-sm text-text p-5">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </Reveal>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button onClick={() => goToSection("projects")} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                      See my work <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-border">·</span>
                    <button onClick={() => goToSection("hero")} className="text-sm text-textMuted hover:text-primary transition font-medium">
                      Back to home
                    </button>
                  </div>
                </section>
              )}

              {/* ===== Footer ===== */}
              <footer className="border-t border-border mt-8">
                <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
                  <div className="grid sm:grid-cols-3 gap-10">
                    <div>
                      <button onClick={() => goToSection("hero")} className="group flex items-center gap-2.5 font-display font-semibold text-lg mb-3">
                        <span className="flex items-center justify-center w-8 h-8 border border-primary/60 text-primary text-sm">
                          {owner.name?.[0]?.toUpperCase() || "•"}
                        </span>
                        {owner.name}
                      </button>
                      <p className="text-textMuted text-sm leading-relaxed max-w-xs">
                        {portfolio.hero.tagline || portfolio.hero.subtitle || "Thanks for stopping by."}
                      </p>
                    </div>

                    <div>
                      <p className="mono text-[10px] text-primary uppercase tracking-widest mb-4">Index</p>
                      <div className="grid grid-cols-2 gap-2">
                        {SECTIONS.map((s, i) => (
                          <button key={s.id} onClick={() => goToSection(s.id)} className="text-left text-sm text-textMuted hover:text-primary transition">
                            <span className="mono text-[10px] mr-1.5">{String(i + 1).padStart(2, "0")}</span>
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
                      {socialEntries.length > 0 && (
                        <div className="flex items-center gap-2">
                          {socialEntries.map(([key, val]) => (
                            <a key={key} href={val} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center border border-border text-textMuted hover:text-primary hover:border-primary transition">
                              {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-border">
                    <p className="mono text-xs text-textMuted">
                      © {new Date().getFullYear()} {owner.name}. All rights reserved.
                    </p>
                    <button onClick={() => goToSection("hero")} className="inline-flex items-center gap-1.5 text-xs mono text-textMuted hover:text-primary transition">
                      Back to top ↑
                    </button>
                  </div>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;