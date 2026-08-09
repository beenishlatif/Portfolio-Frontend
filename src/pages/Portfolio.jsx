import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  // --- Typewriter effect state (hero section) ---
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-bg/80 border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <span className="font-display font-semibold">
            {owner.name}
            <span className="text-primary">.</span>
          </span>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-surface border border-border text-text text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Section tabs - only one section is shown at a time */}
        <nav className="flex gap-1 overflow-x-auto px-6 md:px-10 pb-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
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

      {/* Active section */}
      <main className="flex-1 px-6 md:px-10 py-12 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {active === "hero" && (
              <div className="py-6 md:py-14">
                <div className="grid md:grid-cols-2 gap-14 items-center">
                  {/* ===== Left column: text content ===== */}
                  <div className="text-center md:text-left">
                    {portfolio.hero.availableForWork && (
                      <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-surface border border-border text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        Available for work
                      </div>
                    )}

                    <p className="mono text-accent text-sm tracking-widest mb-3">
                      {portfolio.hero.tagline || "WELCOME TO MY PORTFOLIO"}
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-3">
                      {portfolio.hero.title || owner.name}
                    </h1>

                    {/* Typewriter rotating roles */}
                    <p className="mono text-lg md:text-2xl text-primary mb-5 h-8">
                      {displayText}
                      <span className="animate-pulse">|</span>
                    </p>

                    <p className="text-textMuted text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
                      {portfolio.hero.subtitle}
                    </p>

                    {/* Quick info pills: location + experience */}
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

                    {/* Quick highlights teaser (pulled from About) */}
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

                    {/* Top skill chips */}
                    {topSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-6">
                        {topSkills.map((s, i) => (
                          <span key={i} className="mono text-xs px-2.5 py-1 rounded-full bg-surfaceAlt text-accent border border-border">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8">
                      {portfolio.hero.resumeLink && (
                        <a
                          href={portfolio.hero.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primaryAlt transition"
                        >
                          View Resume
                        </a>
                      )}
                      <button
                        onClick={() => setActive("projects")}
                        className="px-6 py-3 rounded-lg border border-border text-text hover:border-primary transition"
                      >
                        View Work
                      </button>
                      <button
                        onClick={() => setActive("contact")}
                        className="px-6 py-3 rounded-lg text-primary hover:underline transition"
                      >
                        Let's Talk →
                      </button>
                    </div>

                    {/* Social icons */}
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

                  {/* ===== Right column: visual / image with floating cards ===== */}
                  <div className="relative flex justify-center md:justify-end py-10 md:py-0">
                    {/* decorative glow blobs */}
                    <div className="absolute -top-8 -left-8 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-8 -right-4 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2rem] p-1.5 bg-gradient-to-tr from-primary via-accent to-primaryAlt"
                    >
                      <div className="w-full h-full rounded-[1.6rem] bg-surface overflow-hidden flex items-center justify-center">
                        {portfolio.hero.profileImage ? (
                          <img
                            src={portfolio.hero.profileImage}
                            alt={owner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-display text-6xl font-semibold text-primary">
                            {initials}
                          </span>
                        )}
                      </div>

                      {/* Floating stat card - top left */}
                      {portfolio.hero.yearsOfExperience > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="absolute -left-8 top-6 bg-bg border border-border rounded-xl px-4 py-3 shadow-lg"
                        >
                          <p className="font-display text-xl font-semibold text-primary">
                            {portfolio.hero.yearsOfExperience}+
                          </p>
                          <p className="text-[10px] text-textMuted mono uppercase tracking-wide">Years Exp</p>
                        </motion.div>
                      )}

                      {/* Floating stat card - bottom right */}
                      {portfolio.hero.stats?.[0] && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="absolute -right-8 bottom-8 bg-bg border border-border rounded-xl px-4 py-3 shadow-lg"
                        >
                          <p className="font-display text-xl font-semibold text-primary">
                            {portfolio.hero.stats[0].value}
                          </p>
                          <p className="text-[10px] text-textMuted mono uppercase tracking-wide">
                            {portfolio.hero.stats[0].label}
                          </p>
                        </motion.div>
                      )}

                      {/* Floating stat card - top right, second stat */}
                      {portfolio.hero.stats?.[1] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="absolute -right-4 -top-6 bg-bg border border-border rounded-xl px-4 py-3 shadow-lg"
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

                {/* Full stats bar */}
                {portfolio.hero.stats?.length > 0 && (
                  <div className="mt-16 pt-10 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    {portfolio.hero.stats.map((s, i) => (
                      <div key={i}>
                        <p className="font-display text-3xl font-semibold text-primary">{s.value}</p>
                        <p className="text-textMuted text-xs mono mt-1 uppercase tracking-wide">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scroll indicator */}
                <div className="flex justify-center mt-14">
                  <motion.button
                    onClick={() => setActive("about")}
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
              </div>
            )}

            {active === "about" && (
              <div>
                <h2 className="font-display text-3xl font-semibold mb-6">About</h2>
                <p className="text-textMuted leading-relaxed whitespace-pre-line">
                  {portfolio.about.bio || "No bio added yet."}
                </p>
                {portfolio.about.highlights?.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {portfolio.about.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-text">
                        <span className="text-primary">→</span> {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {active === "skills" && (
              <div>
                <h2 className="font-display text-3xl font-semibold mb-6">Skills</h2>
                {portfolio.skills.length === 0 && (
                  <p className="text-textMuted">No skills added yet.</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  {portfolio.skills.map((s, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{s.name}</span>
                        <span className="text-textMuted mono">{s.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surfaceAlt overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "projects" && (
              <div>
                <h2 className="font-display text-3xl font-semibold mb-6">Projects</h2>
                {portfolio.projects.length === 0 && (
                  <p className="text-textMuted">No projects added yet.</p>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  {portfolio.projects.map((p, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display font-semibold mb-1">{p.title}</h3>
                      <p className="text-textMuted text-sm mb-3">{p.description}</p>
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
                  ))}
                </div>
              </div>
            )}

            {active === "experience" && (
              <div>
                <h2 className="font-display text-3xl font-semibold mb-6">Experience</h2>
                {portfolio.experience.length === 0 && (
                  <p className="text-textMuted">No experience added yet.</p>
                )}
                <div className="space-y-6">
                  {portfolio.experience.map((e, i) => (
                    <div key={i} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold">{e.role} · {e.company}</h3>
                      <p className="mono text-xs text-textMuted mb-2">{e.duration}</p>
                      <p className="text-textMuted text-sm">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "education" && (
              <div>
                <h2 className="font-display text-3xl font-semibold mb-6">Education</h2>
                {portfolio.education.length === 0 && (
                  <p className="text-textMuted">No education added yet.</p>
                )}
                <div className="space-y-6">
                  {portfolio.education.map((e, i) => (
                    <div key={i} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold">{e.degree} · {e.institute}</h3>
                      <p className="mono text-xs text-textMuted mb-2">{e.duration}</p>
                      <p className="text-textMuted text-sm">{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "contact" && (
              <div>
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Portfolio;