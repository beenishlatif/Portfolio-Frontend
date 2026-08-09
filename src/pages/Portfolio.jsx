import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import { useTheme, THEMES } from "../context/ThemeContext.jsx";

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

const CodeVisual = ({ owner, portfolio }) => {
  const roles = portfolio.hero.roles?.length ? portfolio.hero.roles : [portfolio.hero.title || "Developer"];
  const stackSource = portfolio.techStack?.length ? portfolio.techStack : (portfolio.skills || []).map((s) => s.name);
  const stack = stackSource.slice(0, 4);

  const lines = [
    [{ c: "kw", v: "const " }, { c: "var", v: "developer" }, { c: "p", v: " = {" }],
    [{ c: "key", v: "  name" }, { c: "p", v: ": " }, { c: "str", v: `"${owner.name}"` }, { c: "p", v: "," }],
    [{ c: "key", v: "  roles" }, { c: "p", v: ": [" }, { c: "str", v: roles.map((r) => `"${r}"`).join(", ") }, { c: "p", v: "]," }],
    [{ c: "key", v: "  stack" }, { c: "p", v: ": [" }, { c: "str", v: stack.map((t) => `"${t}"`).join(", ") }, { c: "p", v: "]," }],
    [{ c: "key", v: "  available" }, { c: "p", v: ": " }, { c: "bool", v: String(!!portfolio.hero.availableForWork) }],
    [{ c: "p", v: "};" }],
  ];

  const colorMap = {
    kw: "text-pink-400",
    var: "text-sky-300",
    p: "text-white/50",
    key: "text-primary",
    str: "text-emerald-400",
    bool: "text-amber-300",
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-[#0c0e13] shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 mono text-[11px] text-white/40">developer.ts</span>
      </div>
      <div className="p-5 font-mono text-[12.5px] leading-relaxed">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.18, duration: 0.35 }}
            className="whitespace-pre"
          >
            {line.map((tok, j) => (
              <span key={j} className={colorMap[tok.c]}>{tok.v}</span>
            ))}
          </motion.div>
        ))}
        <motion.span
          className="inline-block w-2 h-4 bg-primary ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
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

const Reveal = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
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

const isVideoFile = (url = "") => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
const toEmbedUrl = (url = "") => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
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
  const [active, setActive] = useState("hero");
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // --- Typewriter effect state (hero section) ---
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const observerRef = useRef(null);

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

  // Scroll-spy: highlight the nav item for whichever section is in view,
  // and let nav clicks smooth-scroll to that section.
  useEffect(() => {
    if (!data) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current && observerRef.current.disconnect();
  }, [data]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const initials = owner.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const topSkills = portfolio.skills?.slice(0, 6) || [];
  const highlightTeaser = portfolio.about?.highlights?.slice(0, 3) || [];
  const marqueeItems = portfolio.techStack?.length ? portfolio.techStack : topSkills.map((s) => s.name);
  const services = portfolio.hero?.services || [];
  const whyChooseMe = portfolio.hero?.whyChooseMe || [];
  const skillGroups = groupSkillsByCategory(portfolio.skills || []);

  const openLightbox = (project, index = 0) => {
    setLightboxProject(project);
    setLightboxIndex(index);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* ===== Premium Navbar ===== */}
      <header className="sticky top-0 z-20 backdrop-blur bg-bg/80 border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-10 py-4 gap-4">
          <button onClick={() => scrollToSection("hero")} className="font-display font-semibold text-lg shrink-0">
            {owner.name}
            <span className="text-primary">.</span>
          </button>

          {/* Desktop pill nav - scrolls to section, highlights on scroll */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface/60 border border-border rounded-full p-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`relative px-4 py-1.5 text-sm rounded-full transition ${
                  active === s.id ? "text-white" : "text-textMuted hover:text-text"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
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
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-primary transition"
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

            {/* Premium theme switcher - swatch dots instead of a plain <select> */}
            <div className="flex items-center gap-1 bg-surface border border-border rounded-full px-1.5 py-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  title={t.label}
                  onClick={() => setTheme(t.id)}
                  aria-label={`Switch to ${t.label} theme`}
                  className={`w-4 h-4 rounded-full border transition ${
                    theme === t.id ? "border-primary scale-125" : "border-transparent hover:scale-110"
                  }`}
                  style={{ background: t.swatch || "var(--color-primary)" }}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToSection("contact")}
              className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primaryAlt transition"
            >
              Hire Me
            </button>
          </div>
        </div>

        {/* Mobile section tabs - same scroll behaviour */}
        <nav className="flex lg:hidden gap-1 overflow-x-auto px-6 pb-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                active === s.id
                  ? "bg-primary text-white"
                  : "text-textMuted hover:text-text border border-border"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ===== All sections render together, one after another ===== */}
      <main className="flex-1 w-full">
        {/* ---------- HERO ---------- */}
        <section id="hero" className="scroll-mt-24 px-6 md:px-10 py-6 md:py-14 max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Left column: text content */}
            <div className="text-center md:text-left">
              {portfolio.hero.availableForWork && (
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-surface border border-border text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Available for Freelance
                </div>
              )}

              <p className="mono text-accent text-sm tracking-widest mb-3">
                {portfolio.hero.tagline || "WELCOME TO MY PORTFOLIO"}
              </p>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-3">
                {portfolio.hero.title || owner.name}
              </h1>

              <p className="mono text-lg md:text-2xl text-primary mb-5 h-8">
                {displayText}
                <span className="animate-pulse">|</span>
              </p>

              <p className="text-textMuted text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
                {portfolio.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
                {portfolio.hero.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface border border-border rounded-full px-3 py-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {portfolio.hero.location}
                  </span>
                )}
                {portfolio.hero.yearsOfExperience > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface border border-border rounded-full px-3 py-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    {portfolio.hero.yearsOfExperience}+ Years Experience
                  </span>
                )}
                {portfolio.contact?.email && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-textMuted bg-surface border border-border rounded-full px-3 py-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    {portfolio.contact.email}
                  </span>
                )}
              </div>

              {highlightTeaser.length > 0 && (
                <ul className="mt-6 space-y-1.5 inline-block text-left">
                  {highlightTeaser.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 text-primary shrink-0">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {topSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-6">
                  {topSkills.map((s, i) => (
                    <span key={i} className="mono text-xs px-2.5 py-1 rounded-full bg-surfaceAlt text-accent border border-border">
                      {s.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primaryAlt transition font-medium"
                >
                  View Projects
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-6 py-3 rounded-lg border border-border text-text hover:border-primary transition font-medium"
                >
                  Hire Me
                </button>
                {portfolio.hero.githubLink && (
                  <a
                    href={portfolio.hero.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg text-primary hover:underline transition font-medium"
                  >
                    {SOCIAL_ICONS.github}
                    GitHub
                  </a>
                )}
                {portfolio.hero.resumeLink && (
                  <a
                    href={portfolio.hero.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg text-primary hover:underline transition font-medium"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
                    </svg>
                    Download Resume
                  </a>
                )}
              </div>

              {Object.values(portfolio.contact.socialLinks || {}).some(Boolean) && (
                <div className="flex items-center justify-center md:justify-start gap-3 mt-7">
                  {Object.entries(portfolio.contact.socialLinks || {}).map(
                    ([key, val]) =>
                      val && (
                        <a
                          key={key}
                          href={val}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-textMuted hover:text-primary hover:border-primary transition"
                        >
                          {SOCIAL_ICONS[key] || key[0].toUpperCase()}
                        </a>
                      )
                  )}
                </div>
              )}
            </div>

            {/* Right column: interactive developer visual */}
            <div className="relative flex justify-center md:justify-end py-10 md:py-0">
              <div className="absolute -top-8 -left-8 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -right-4 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <CodeVisual owner={owner} portfolio={portfolio} />

                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-5 -left-5 flex items-center gap-2 bg-bg border border-border rounded-full pl-1.5 pr-3 py-1.5 shadow-lg"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-surfaceAlt flex items-center justify-center shrink-0">
                    {portfolio.hero.profileImage ? (
                      <img src={portfolio.hero.profileImage} alt={owner.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-[10px] font-semibold text-primary">{initials}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{owner.name}</span>
                </motion.div>

                {portfolio.hero.stats?.[0] && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -right-8 top-10 bg-bg border border-border rounded-xl px-4 py-3 shadow-lg"
                  >
                    <p className="font-display text-xl font-semibold text-primary">
                      {portfolio.hero.stats[0].value}
                    </p>
                    <p className="text-[10px] text-textMuted mono uppercase tracking-wide">
                      {portfolio.hero.stats[0].label}
                    </p>
                  </motion.div>
                )}

                {portfolio.hero.stats?.[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute -right-6 -bottom-6 bg-bg border border-border rounded-xl px-4 py-3 shadow-lg"
                  >
                    <p className="font-display text-xl font-semibold text-primary">
                      {portfolio.hero.stats[1].value}
                    </p>
                    <p className="text-[10px] text-textMuted mono uppercase tracking-wide">
                      {portfolio.hero.stats[1].label}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {marqueeItems.length > 0 && (
            <div className="mt-16">
              <TechMarquee items={marqueeItems} />
            </div>
          )}

          {portfolio.hero.stats?.length > 0 && (
            <div className="mt-10 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {portfolio.hero.stats.map((s, i) => (
                <div key={i}>
                  <p className="font-display text-3xl font-semibold text-primary">{s.value}</p>
                  <p className="text-textMuted text-xs mono mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Services - folded into hero, no separate nav section */}
          {services.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <p className="mono text-xs text-primary uppercase tracking-widest mb-2">What I Do</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">Services</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((s, i) => (
                  <Reveal key={i} className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-display font-semibold mb-4">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display font-semibold mb-2">{s.title}</h3>
                    <p className="text-textMuted text-sm leading-relaxed">{s.description}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Me - folded into hero, no separate nav section */}
          {whyChooseMe.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <p className="mono text-xs text-primary uppercase tracking-widest mb-2">The Difference</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-8">Why Choose Me</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {whyChooseMe.map((w, i) => (
                  <Reveal key={i} className="flex gap-4">
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

          <div className="flex justify-center mt-14">
            <motion.button
              onClick={() => scrollToSection("about")}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="text-textMuted hover:text-primary transition flex flex-col items-center gap-1"
              aria-label="Scroll to about section"
            >
              <span className="text-[10px] mono uppercase tracking-widest">Scroll</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.button>
          </div>
        </section>

        {/* ---------- ABOUT (premium, longer) ---------- */}
        <section id="about" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Get To Know Me</p>
            <h2 className="font-display text-3xl font-semibold mb-10">About</h2>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <Reveal>
                <p className="text-textMuted leading-relaxed whitespace-pre-line text-base md:text-lg">
                  {portfolio.about.bio || "No bio added yet."}
                </p>
              </Reveal>

              {portfolio.about.approach && (
                <Reveal className="mt-10">
                  <h3 className="font-display text-lg font-semibold mb-3">My Approach</h3>
                  <p className="text-textMuted leading-relaxed whitespace-pre-line">{portfolio.about.approach}</p>
                </Reveal>
              )}

              {portfolio.about.highlights?.length > 0 && (
                <Reveal className="mt-10">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {portfolio.about.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 items-start bg-surface border border-border rounded-xl px-4 py-3">
                        <span className="text-primary mt-0.5">→</span>
                        <span className="text-sm text-text">{h}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="md:col-span-2">
              <Reveal className="sticky top-28">
                {portfolio.about.image ? (
                  <img src={portfolio.about.image} alt={owner.name} className="w-full rounded-2xl border border-border object-cover aspect-[4/5]" />
                ) : (
                  <div className="w-full aspect-[4/5] rounded-2xl border border-border bg-surface flex items-center justify-center">
                    <span className="font-display text-5xl font-semibold text-primary">{initials}</span>
                  </div>
                )}
                {portfolio.hero.stats?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {portfolio.hero.stats.slice(0, 4).map((s, i) => (
                      <div key={i} className="bg-surface border border-border rounded-xl p-3 text-center">
                        <p className="font-display text-lg font-semibold text-primary">{s.value}</p>
                        <p className="text-[10px] text-textMuted mono uppercase tracking-wide">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- SKILLS (premium grouped UI) ---------- */}
        <section id="skills" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <p className="mono text-xs text-primary uppercase tracking-widest mb-2">What I Work With</p>
            <h2 className="font-display text-3xl font-semibold mb-10">Skills</h2>
          </Reveal>
          {portfolio.skills.length === 0 && (
            <p className="text-textMuted">No skills added yet.</p>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skillGroups).map(([category, items], gi) => (
              <Reveal key={category} className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="mono text-xs text-primary uppercase tracking-widest mb-5">{category}</h3>
                <div className="space-y-5">
                  {items.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-textMuted mono text-xs">{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surfaceAlt overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- PROJECTS (with screenshots + video) ---------- */}
        <section id="projects" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Selected Work</p>
            <h2 className="font-display text-3xl font-semibold mb-10">Projects</h2>
          </Reveal>
          {portfolio.projects.length === 0 && (
            <p className="text-textMuted">No projects added yet.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-6">
            {portfolio.projects.map((p, i) => (
              <Reveal key={i} className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition group">
                {p.image && (
                  <button onClick={() => openLightbox(p, 0)} className="block w-full">
                    <img src={p.image} alt={p.title} className="w-full h-44 object-cover group-hover:scale-[1.03] transition duration-300" />
                  </button>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold">{p.title}</h3>
                    {p.featured && (
                      <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-textMuted text-sm mb-3">{p.description}</p>

                  {(p.screenshots?.length > 0 || p.video) && (
                    <div className="flex gap-2 mb-3">
                      {p.screenshots?.slice(0, 3).map((src, si) => (
                        <button
                          key={si}
                          onClick={() => openLightbox(p, si)}
                          className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0"
                        >
                          <img src={src} alt={`${p.title} screenshot ${si + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {p.video && (
                        <button
                          onClick={() => openLightbox(p, -1)}
                          className="w-14 h-14 rounded-lg border border-border shrink-0 flex items-center justify-center bg-surfaceAlt text-primary"
                          aria-label="Play demo video"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M8 5v14l11-7Z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.techStack?.map((t, idx) => (
                      <span
                        key={idx}
                        className="mono text-xs px-2 py-0.5 rounded bg-surfaceAlt text-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    {p.liveLink && (
                      <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Live
                      </a>
                    )}
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Lightbox: screenshots gallery + demo video */}
          {lightboxProject && (
            <div
              className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6"
              onClick={() => setLightboxProject(null)}
            >
              <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-white font-semibold">{lightboxProject.title}</h3>
                  <button onClick={() => setLightboxProject(null)} className="text-white/70 hover:text-white text-sm">
                    Close ✕
                  </button>
                </div>

                {lightboxIndex === -1 && lightboxProject.video ? (
                  isVideoFile(lightboxProject.video) ? (
                    <video src={lightboxProject.video} controls autoPlay className="w-full rounded-xl max-h-[75vh]" />
                  ) : (
                    <iframe
                      src={toEmbedUrl(lightboxProject.video)}
                      title="Project demo"
                      allow="autoplay; fullscreen"
                      className="w-full aspect-video rounded-xl"
                    />
                  )
                ) : (
                  <img
                    src={lightboxProject.screenshots?.[lightboxIndex] || lightboxProject.image}
                    alt={lightboxProject.title}
                    className="w-full rounded-xl max-h-[75vh] object-contain bg-black"
                  />
                )}

                {(lightboxProject.screenshots?.length > 0 || lightboxProject.video) && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {lightboxProject.screenshots?.map((src, si) => (
                      <button key={si} onClick={() => setLightboxIndex(si)} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/20">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {lightboxProject.video && (
                      <button onClick={() => setLightboxIndex(-1)} className="w-16 h-16 shrink-0 rounded-lg border border-white/20 flex items-center justify-center bg-white/10 text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M8 5v14l11-7Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ---------- EXPERIENCE (premium timeline) ---------- */}
        <section id="experience" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Career Path</p>
            <h2 className="font-display text-3xl font-semibold mb-10">Experience</h2>
          </Reveal>
          {portfolio.experience.length === 0 && (
            <p className="text-textMuted">No experience added yet.</p>
          )}
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-10">
              {portfolio.experience.map((e, i) => (
                <Reveal key={i} className="relative">
                  <span className={`absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-bg ${e.current ? "bg-primary" : "bg-textMuted"}`} />
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold">{e.role} · {e.company}</h3>
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

        {/* ---------- EDUCATION (premium, university-aware) ---------- */}
        <section id="education" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <p className="mono text-xs text-primary uppercase tracking-widest mb-2">Academic Background</p>
            <h2 className="font-display text-3xl font-semibold mb-10">Education</h2>
          </Reveal>
          {portfolio.education.length === 0 && (
            <p className="text-textMuted">No education added yet.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-5">
            {portfolio.education.map((e, i) => (
              <Reveal key={i} className="bg-surface border border-border rounded-2xl p-6">
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

        {/* ---------- CONTACT ---------- */}
        <section id="contact" className="scroll-mt-24 px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto w-full border-t border-border">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold mb-6">Contact</h2>
            <div className="space-y-2 text-textMuted">
              {portfolio.contact.email && <p>Email: {portfolio.contact.email}</p>}
              {portfolio.contact.phone && <p>Phone: {portfolio.contact.phone}</p>}
              {portfolio.contact.location && <p>Location: {portfolio.contact.location}</p>}
            </div>
            <div className="flex gap-4 mt-5">
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
      </main>
    </div>
  );
};

export default Portfolio;