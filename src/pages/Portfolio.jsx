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
  ChevronLeft,
  ChevronRight,
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
        className={`group relative ${TIER_SPAN[tier]} rounded-2xl p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all`}
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary/25 blur-[70px] group-hover:bg-primary/35 transition-colors duration-300" />
        <div className="relative flex items-center justify-between">
          <span className="mono text-[10px] uppercase tracking-widest text-primary">{category}</span>
          <span className={`mono text-[10px] px-2 py-0.5 rounded-full ${meta.className}`}>{meta.label}</span>
        </div>
        <div className="relative">
          <h4 className="font-display text-2xl md:text-3xl font-bold mb-3">{skill.name}</h4>
          <div className="h-1.5 rounded-full bg-surfaceAlt/70 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
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
        className={`group relative ${TIER_SPAN[tier]} rounded-2xl p-5 flex flex-col justify-between bg-surface border border-border hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.35)] transition-all`}
      >
        <span className="mono text-[10px] uppercase tracking-widest text-textMuted">{category}</span>
        <div>
          <h4 className="font-semibold text-sm mb-2 truncate">{skill.name}</h4>
          <div className="h-1.5 rounded-full bg-surfaceAlt overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <span className={`mono text-[10px] px-2 py-0.5 rounded-full inline-block mt-2.5 ${meta.className}`}>{meta.label}</span>
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
      className="group relative rounded-2xl p-4 flex flex-col justify-center bg-surface border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-xs truncate">{skill.name}</h4>
        <span className={`mono text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${meta.className}`}>{meta.label}</span>
      </div>
      <div className="h-1 rounded-full bg-surfaceAlt overflow-hidden mt-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        />
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

  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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

  // Keyboard navigation for the project lightbox (Esc to close, arrows to
  // move between images/video within the currently open project).
  useEffect(() => {
    if (!lightboxProject) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setLightboxProject(null);
        setLightboxMedia([]);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (lightboxMedia.length ? (i + 1) % lightboxMedia.length : 0));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (lightboxMedia.length ? (i - 1 + lightboxMedia.length) % lightboxMedia.length : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxProject, lightboxMedia]);

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

  const openLightbox = (project, startIndex = 0) => {
    const media = getProjectMedia(project);
    setLightboxProject(project);
    setLightboxMedia(media);
    setLightboxIndex(Math.max(0, Math.min(startIndex, media.length - 1)));
  };

  const closeLightbox = () => {
    setLightboxProject(null);
    setLightboxMedia([]);
  };

  const nextMedia = () => setLightboxIndex((i) => (i + 1) % (lightboxMedia.length || 1));
  const prevMedia = () => setLightboxIndex((i) => (i - 1 + (lightboxMedia.length || 1)) % (lightboxMedia.length || 1));

  return (
    <div className="h-screen bg-bg text-text flex flex-col overflow-hidden">
      {/* ===== Premium Navbar ===== */}
      <header
        className={`sticky top-0 z-30 border-b transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-xl border-border shadow-[0_8px_30px_-15px_rgba(0,0,0,0.4)]"
            : "bg-bg/60 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4 gap-4">
          <button
            onClick={() => goToSection("hero")}
            className="group flex items-center gap-2 font-display font-semibold text-lg shrink-0"
          >
            <span className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white text-sm shadow-[0_4px_18px_-4px_var(--color-primary)] group-hover:scale-105 transition-transform">
              {owner.name?.[0]?.toUpperCase() || "•"}
            </span>
            <span>
              {owner.name}
              <span className="text-primary">.</span>
            </span>
          </button>

          {/* Desktop pill nav - each item is its own "page", switched on click */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface/70 border border-border rounded-full p-1 shadow-inner">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className={`relative px-4 py-1.5 text-sm rounded-full transition-colors ${
                  activeSection === s.id ? "text-white" : "text-textMuted hover:text-text"
                }`}
              >
                {activeSection === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full -z-10 shadow-[0_4px_16px_-4px_var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
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

            {/* Premium theme switcher - swatch dots */}
            <div className="hidden sm:flex items-center gap-1 bg-surface border border-border rounded-full px-1.5 py-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  title={t.label}
                  onClick={() => setTheme(t.id)}
                  aria-label={`Switch to ${t.label} theme`}
                  className={`w-4 h-4 rounded-full border transition ${
                    theme === t.id ? "border-primary scale-125 ring-2 ring-primary/30" : "border-transparent hover:scale-110"
                  }`}
                  style={{ background: t.swatch || "var(--color-primary)" }}
                />
              ))}
            </div>

            <button
              onClick={() => goToSection("contact")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-[0_6px_20px_-6px_var(--color-primary)] hover:shadow-[0_8px_24px_-4px_var(--color-primary)] hover:-translate-y-0.5 transition-all"
            >
              Hire Me
            </button>

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
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Projects</h2>
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
                        className={`mono text-xs px-3.5 py-1.5 rounded-full border transition ${
                          projectFilter === t
                            ? "bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-[0_6px_16px_-6px_var(--color-primary)]"
                            : "border-border text-textMuted hover:border-primary/50 hover:text-text"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Unified project grid — clean, consistent card size, no more
                    long side-by-side "spotlight" layout. Featured just gets a badge. */}
                {filteredProjects.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {filteredProjects.map((p, i) => {
                      const media = getProjectMedia(p);
                      const cover = media[0];
                      return (
                        <TiltCard
                          key={`${p.title}-${i}`}
                          delay={Math.min(i * 0.05, 0.4)}
                          className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow]"
                        >
                          {p.featured && (
                            <span className="absolute top-3 left-3 z-10 mono text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center gap-1 shadow-lg">
                              <Sparkles className="w-3 h-3" /> Featured
                            </span>
                          )}

                          <button
                            onClick={() => (media.length > 0 ? openLightbox(p, 0) : null)}
                            disabled={media.length === 0}
                            className="relative block w-full aspect-video overflow-hidden bg-surfaceAlt"
                          >
                            {cover ? (
                              cover.type === "video" ? (
                                <div className="w-full h-full flex items-center justify-center text-primary bg-gradient-to-br from-primary/10 to-accent/10">
                                  <PlayCircle className="w-10 h-10" />
                                </div>
                              ) : (
                                <img
                                  src={cover.src}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-500"
                                />
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
                                <span className="text-white text-xs mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-4 h-4" /> View Gallery
                                </span>
                              </div>
                            )}
                          </button>

                          <div className="p-5">
                            <h3 className="font-display font-semibold mb-1.5">{p.title}</h3>
                            <p className="text-textMuted text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>

                            {p.techStack?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {p.techStack.slice(0, 4).map((t, idx) => (
                                  <span key={idx} className="mono text-[11px] px-2 py-0.5 rounded bg-surfaceAlt text-accent">
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
                  </div>
                )}

                {/* Lightbox: shows every screenshot that was added + the demo video,
                    each with its own caption/description. */}
                <AnimatePresence>
                  {lightboxProject && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 md:p-6"
                      onClick={closeLightbox}
                    >
                      <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-display text-white font-semibold">{lightboxProject.title}</h3>
                            {lightboxMedia.length > 0 && (
                              <p className="mono text-[11px] text-white/50 mt-0.5">
                                {lightboxIndex + 1} / {lightboxMedia.length}
                              </p>
                            )}
                          </div>
                          <button onClick={closeLightbox} className="text-white/70 hover:text-white flex items-center gap-1.5 text-sm">
                            <X className="w-4 h-4" /> Close
                          </button>
                        </div>

                        <div className="relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={lightboxIndex}
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -24 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {lightboxMedia[lightboxIndex]?.type === "video" ? (
                                isVideoFile(lightboxMedia[lightboxIndex].src) ? (
                                  <video src={lightboxMedia[lightboxIndex].src} controls autoPlay className="w-full rounded-xl max-h-[65vh]" />
                                ) : (
                                  <iframe
                                    src={toEmbedUrl(lightboxMedia[lightboxIndex].src)}
                                    title="Project demo"
                                    allow="autoplay; fullscreen"
                                    className="w-full aspect-video rounded-xl"
                                  />
                                )
                              ) : (
                                <img
                                  src={lightboxMedia[lightboxIndex]?.src}
                                  alt={lightboxProject.title}
                                  className="w-full rounded-xl max-h-[65vh] object-contain bg-black"
                                />
                              )}
                            </motion.div>
                          </AnimatePresence>

                          {lightboxMedia.length > 1 && (
                            <>
                              <button
                                onClick={prevMedia}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
                                aria-label="Previous"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={nextMedia}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition"
                                aria-label="Next"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                        {lightboxMedia[lightboxIndex]?.caption && (
                          <p className="text-white/70 text-sm mt-3 text-center leading-relaxed">
                            {lightboxMedia[lightboxIndex].caption}
                          </p>
                        )}

                        {lightboxMedia.length > 1 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto">
                            {lightboxMedia.map((m, mi) => (
                              <button
                                key={mi}
                                onClick={() => setLightboxIndex(mi)}
                                className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border transition ${
                                  mi === lightboxIndex ? "border-primary ring-2 ring-primary/40" : "border-white/20"
                                }`}
                              >
                                {m.type === "video" ? (
                                  <span className="w-full h-full flex items-center justify-center bg-white/10 text-white">
                                    <PlayCircle className="w-5 h-5" />
                                  </span>
                                ) : (
                                  <img src={m.src} alt="" className="w-full h-full object-cover" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {activeSection === "experience" && (
              <section className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full">
                <Reveal>
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Career Path</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">Experience</h2>
                </Reveal>
                {portfolio.experience.length === 0 && <p className="text-textMuted">No experience added yet.</p>}
                <div className="relative pl-8">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-border to-transparent" />
                  <div className="space-y-10">
                    {portfolio.experience.map((e, i) => (
                      <Reveal key={i} delay={i * 0.05} className="relative">
                        <span
                          className={`absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-bg ${
                            e.current ? "bg-primary shadow-[0_0_0_4px_rgba(var(--color-primary-rgb,99,102,241),0.15)]" : "bg-textMuted"
                          }`}
                        />
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {e.role} · {e.company}
                          </h3>
                          {e.current && (
                            <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary uppercase tracking-wide">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mono text-xs text-textMuted mb-2">
                          {e.duration}
                          {e.location && ` · ${e.location}`}
                        </p>
                        <p className="text-textMuted text-sm leading-relaxed">{e.description}</p>
                        {e.achievements?.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {e.achievements.map((a, ai) => (
                              <li key={ai} className="flex gap-2 text-sm text-text">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 text-primary shrink-0">
                                  <path d="m5 13 4 4L19 7" />
                                </svg>
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "education" && (
              <section className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full">
                <Reveal>
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Academic Background</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">Education</h2>
                </Reveal>
                {portfolio.education.length === 0 && <p className="text-textMuted">No education added yet.</p>}
                <div className="grid sm:grid-cols-2 gap-5">
                  {portfolio.education.map((e, i) => (
                    <Reveal
                      key={i}
                      delay={i * 0.05}
                      className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold">{e.university}</h3>
                        {e.gpa && (
                          <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary shrink-0">
                            GPA {e.gpa}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary mb-1">
                        {e.degree}
                        {e.fieldOfStudy && ` in ${e.fieldOfStudy}`}
                      </p>
                      <p className="mono text-xs text-textMuted mb-3">{e.duration}</p>
                      {e.description && <p className="text-textMuted text-sm leading-relaxed">{e.description}</p>}
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "contact" && (
              <section className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-3xl mx-auto w-full">
                <Reveal>
                  <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Get In Touch</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">Contact</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {portfolio.contact.email && (
                      <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition">
                        <p className="text-[10px] mono text-textMuted uppercase tracking-widest mb-1">Email</p>
                        <a href={`mailto:${portfolio.contact.email}`} className="text-sm text-primary hover:underline break-all">
                          {portfolio.contact.email}
                        </a>
                      </div>
                    )}
                    {portfolio.contact.phone && (
                      <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition">
                        <p className="text-[10px] mono text-textMuted uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-sm text-text">{portfolio.contact.phone}</p>
                      </div>
                    )}
                    {portfolio.contact.location && (
                      <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition">
                        <p className="text-[10px] mono text-textMuted uppercase tracking-widest mb-1">Location</p>
                        <p className="text-sm text-text">{portfolio.contact.location}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    {Object.entries(portfolio.contact.socialLinks || {}).map(
                      ([key, val]) =>
                        val && (
                          <a
                            key={key}
                            href={val}
                            target="_blank"
                            rel="noreferrer"
                            className="mono text-sm text-primary hover:underline capitalize"
                          >
                            {key}
                          </a>
                        )
                    )}
                  </div>
                </Reveal>
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