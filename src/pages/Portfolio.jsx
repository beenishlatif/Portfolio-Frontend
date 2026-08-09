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
      <main className="flex-1 px-6 md:px-10 py-12 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {active === "hero" && (
              <div className="text-center py-12">
                <p className="mono text-accent text-sm tracking-widest mb-4">
                  {portfolio.hero.tagline || "WELCOME"}
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-semibold mb-4">
                  {portfolio.hero.title || owner.name}
                </h1>
                <p className="text-textMuted text-lg max-w-xl mx-auto">
                  {portfolio.hero.subtitle}
                </p>
                {portfolio.hero.resumeLink && (
                  <a
                    href={portfolio.hero.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-8 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primaryAlt transition"
                  >
                    View Resume
                  </a>
                )}
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
