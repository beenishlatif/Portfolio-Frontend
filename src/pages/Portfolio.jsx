import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import { useTheme, THEMES } from "../context/ThemeContext.jsx";

/* ---------- small shared helpers (kept inline, no new files) ---------- */

const Reveal = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Eyebrow = ({ children }) => (
  <p className="mono text-xs tracking-[0.25em] text-accent uppercase mb-4">{children}</p>
);

const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
  <div className={align === "center" ? "text-center max-w-2xl mx-auto" : ""}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">{title}</h2>
    {description && <p className="text-textMuted text-base md:text-lg leading-relaxed">{description}</p>}
  </div>
);

const PrimaryBtn = ({ href, children }) => (
  <a
    href={href}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primaryAlt transition-colors duration-200"
  >
    {children}
  </a>
);

const SecondaryBtn = ({ href, children }) => (
  <a
    href={href}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-text font-medium hover:border-primary hover:text-primary transition-colors duration-200"
  >
    {children}
  </a>
);

const StatCard = ({ value, label }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-surface/60 backdrop-blur border border-border rounded-xl px-6 py-8 text-center">
    <p className="font-display text-3xl md:text-4xl font-semibold text-primary mb-1">{value}</p>
    <p className="text-textMuted text-sm mono">{label}</p>
  </motion.div>
);

/* Rotating role text in the hero */
const DEFAULT_ROLES = [
  "Full Stack Developer",
  "MERN Stack Engineer",
  "React & Node.js Specialist",
  "UI/UX-Minded Builder",
  "API Architect",
];

const AnimatedRoles = ({ roles = DEFAULT_ROLES, interval = 2200 }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!roles || roles.length <= 1) return;
    const timer = setInterval(() => setIndex((p) => (p + 1) % roles.length), interval);
    return () => clearInterval(timer);
  }, [roles, interval]);
  if (!roles?.length) return null;
  return (
    <span className="relative inline-block" style={{ minWidth: "1ch" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-block text-primary"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const estimateYears = (experience = []) => {
  const years = experience
    .map((e) => (e.duration || "").match(/\b(19|20)\d{2}\b/g))
    .flat()
    .filter(Boolean)
    .map(Number);
  if (years.length === 0) return null;
  const diff = new Date().getFullYear() - Math.min(...years);
  return diff > 0 ? diff : null;
};

const groupByCategory = (skills = []) => {
  const groups = {};
  skills.forEach((s) => {
    const key = s.category || "General";
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  return groups;
};

const SERVICES = [
  { title: "Full Stack Web Apps", desc: "React/Next.js frontends paired with Node, Express and MongoDB or SQL backends, built to scale." },
  { title: "REST & API Design", desc: "Clean, documented, authenticated APIs that are easy for other developers to integrate with." },
  { title: "UI/UX Implementation", desc: "Pixel-accurate, accessible interfaces with smooth motion and a real design system, not a template." },
  { title: "Performance & DX", desc: "Fast builds, lazy loading, sane state management, and codebases the next developer can actually read." },
];

const PROCESS = [
  { step: "01", title: "Discover", desc: "Understand the goal, users and constraints before writing a single line of code." },
  { step: "02", title: "Design", desc: "Wireframe the flow and data model, then design the UI with the end state in mind." },
  { step: "03", title: "Build", desc: "Ship in small, testable increments — frontend and backend developed in parallel." },
  { step: "04", title: "Refine", desc: "QA, performance passes, and polish based on real feedback before launch." },
  { step: "05", title: "Support", desc: "Deploy, monitor, and iterate — I don't disappear after the handoff." },
];

const WHY = [
  "I ship both the frontend and backend myself, so nothing gets lost in translation.",
  "I write code that's meant to be maintained, not just demoed once.",
  "Clear, proactive communication — you'll always know where a project stands.",
  "I care about the small details: loading states, empty states, error handling.",
];

/* ---------- main component (same props/route usage as before) ---------- */

const Portfolio = ({ slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

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

  const testimonials = data?.portfolio?.testimonials || [];
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setTestimonialIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

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
  const techChips = Array.from(new Set((portfolio.skills || []).slice(0, 8).map((s) => s.name).filter(Boolean)));
  const skillGroups = groupByCategory(portfolio.skills);
  const skillCategories = Object.keys(skillGroups);
  const years = estimateYears(portfolio.experience);
  const projects = [...(portfolio.projects || [])].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6);
  const githubUrl = portfolio.contact?.socialLinks?.github;

  const stats = [
    { value: `${portfolio.projects?.length || 0}+`, label: "Projects Built" },
    { value: `${portfolio.skills?.length || 0}+`, label: "Technologies" },
    { value: `${portfolio.experience?.length || 0}`, label: "Roles Held" },
    ...(years ? [{ value: `${years}+`, label: "Years Experience" }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-bg/80 border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-6xl mx-auto">
          <span className="font-display font-semibold">
            {owner.name}
            <span className="text-primary">.</span>
          </span>

          <div className="flex items-center gap-4">
            <a href="#projects" className="hidden sm:inline text-sm text-textMuted hover:text-text transition-colors">Projects</a>
            <a href="#contact" className="hidden sm:inline text-sm text-textMuted hover:text-text transition-colors">Contact</a>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-surface border border-border text-text text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, var(--tw-color-primary, #7c5cff) 0%, transparent 70%)", opacity: 0.12 }}
        />
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="mono text-xs text-textMuted">Available for new projects</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mono text-accent text-sm tracking-[0.3em] uppercase mb-5">
              {portfolio.hero.tagline || "Hi, I'm"}
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] mb-6">
              {portfolio.hero.title || owner.name}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="font-display text-xl md:text-3xl font-medium text-textMuted mb-6 h-10">
              <AnimatedRoles />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="text-textMuted text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
              {portfolio.hero.subtitle || "I design and build fast, reliable, full stack web applications end to end — from database schema to pixel-perfect UI."}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <PrimaryBtn href="#projects">View My Work</PrimaryBtn>
              {portfolio.hero.resumeLink && <SecondaryBtn href={portfolio.hero.resumeLink}>Download Resume</SecondaryBtn>}
              <SecondaryBtn href="#contact">Let's Talk →</SecondaryBtn>
            </motion.div>

            {techChips.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-2">
                {techChips.map((chip) => (
                  <span key={chip} className="mono text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-textMuted">{chip}</span>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="py-16 border-y border-border bg-surface/30">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== About (bio) ===== */}
      {portfolio.about?.bio && (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 01 · About" title="A bit about me" />
              <p className="text-textMuted leading-relaxed whitespace-pre-line mt-6">{portfolio.about.bio}</p>
              {portfolio.about.highlights?.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {portfolio.about.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-text"><span className="text-primary">→</span> {h}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Tech Stack ===== */}
      {skillCategories.length > 0 && (
        <section className="py-24 bg-surface/30 border-y border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 02 · Tech Stack" title="Technologies I work with" description="A snapshot of the languages, frameworks and tools I reach for most." />
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {skillCategories.map((cat, i) => (
                <Reveal key={cat} delay={i * 0.05}>
                  <div className="bg-surface border border-border rounded-xl p-6 h-full">
                    <h3 className="font-display font-semibold mb-4">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroups[cat].map((skill) => (
                        <span key={skill.name} title={`${skill.level}%`} className="mono text-xs px-3 py-1.5 rounded-full bg-surfaceAlt text-accent border border-border">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Projects ===== */}
      {projects.length > 0 && (
        <section id="projects" className="py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 03 · Selected Work" title="Featured Projects" description="A few things I've built recently — end to end, from schema design to shipped UI." />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {projects.map((p, i) => (
                <Reveal key={p._id || p.title || i} delay={i * 0.05} className="h-full">
                  <div className="group bg-surface border border-border rounded-xl overflow-hidden h-full flex flex-col hover:border-primary/60 transition-colors duration-300">
                    <div className="aspect-video bg-surfaceAlt overflow-hidden relative">
                      {p.image ? (
                        <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-textMuted mono text-xs">No preview image</div>
                      )}
                      {p.featured && (
                        <span className="absolute top-3 left-3 mono text-[10px] uppercase tracking-wider bg-primary text-white px-2 py-1 rounded-full">Featured</span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display font-semibold mb-1.5">{p.title}</h3>
                      <p className="text-textMuted text-sm mb-4 line-clamp-3 flex-1">{p.description}</p>
                      {p.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.techStack.slice(0, 4).map((t, idx) => (
                            <span key={idx} className="mono text-[11px] px-2 py-0.5 rounded bg-surfaceAlt text-accent">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm mt-auto">
                        {p.liveLink && <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">Live Demo →</a>}
                        {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">GitHub →</a>}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Experience ===== */}
      {portfolio.experience?.length > 0 && (
        <section className="py-24 bg-surface/30 border-y border-border">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 04 · Experience" title="Where I've worked" />
            </Reveal>
            <div className="space-y-6 mt-10">
              {portfolio.experience.map((e, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">{e.role} · {e.company}</h3>
                    <p className="mono text-xs text-textMuted mb-2">{e.duration}</p>
                    <p className="text-textMuted text-sm">{e.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Education ===== */}
      {portfolio.education?.length > 0 && (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 05 · Education" title="Academic background" />
            </Reveal>
            <div className="space-y-6 mt-10">
              {portfolio.education.map((e, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">{e.degree} · {e.institute}</h3>
                    <p className="mono text-xs text-textMuted mb-2">{e.duration}</p>
                    <p className="text-textMuted text-sm">{e.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Services ===== */}
      <section className="py-24 bg-surface/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="· 06 · Services" title="What I can build for you" description="End-to-end full stack development, from the database to the last pixel." />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 mt-12">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-primary/60 transition-colors">
                  <span className="mono text-xs text-accent">0{i + 1}</span>
                  <h3 className="font-display font-semibold text-lg mt-2 mb-2">{s.title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Process ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <SectionHeading eyebrow="· 07 · Process" title="How a project comes together" description="A straightforward process that keeps you informed at every stage." />
          </Reveal>
          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.08}>
                <div className="relative pl-5 md:pl-0 border-l-2 md:border-l-0 md:border-t-2 border-primary/40 md:pt-5 h-full">
                  <span className="mono text-2xl font-semibold text-primary/70">{p.step}</span>
                  <h3 className="font-display font-semibold mt-2 mb-1.5">{p.title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why work with me ===== */}
      <section className="py-24 bg-surface/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <SectionHeading eyebrow="· 08 · Why Me" title={`Why work with ${owner.name?.split(" ")[0] || "me"}`} />
              <ul className="mt-6 space-y-4">
                {WHY.map((point, i) => (
                  <li key={i} className="flex gap-3 text-text">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-textMuted">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-surface border border-border rounded-2xl p-8">
                <p className="font-display text-xl leading-relaxed">
                  "Good software is boring in the best way — it just works, it's easy to change, and it doesn't surprise anyone at 2am."
                </p>
                <p className="mono text-xs text-textMuted mt-4">— {owner.name}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== GitHub activity (only if a github link exists) ===== */}
      {githubUrl && (
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 09 · Activity" title="Still writing code every day" description="Check out day-to-day commits, contributions and open source work on GitHub." />
              <div className="mt-8">
                <PrimaryBtn href={githubUrl}>View GitHub Profile →</PrimaryBtn>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Testimonials (only renders if the schema has them; none faked) ===== */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-surface/30 border-y border-border">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <Reveal>
              <SectionHeading eyebrow="· 10 · Testimonials" title="What people say" align="center" />
            </Reveal>
            <div className="max-w-2xl mx-auto mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface border border-border rounded-2xl p-8 text-center"
                >
                  <p className="font-display text-lg md:text-xl leading-relaxed mb-6">"{testimonials[testimonialIndex].quote}"</p>
                  <p className="font-semibold">{testimonials[testimonialIndex].name}</p>
                  {testimonials[testimonialIndex].role && <p className="mono text-xs text-textMuted mt-1">{testimonials[testimonialIndex].role}</p>}
                </motion.div>
              </AnimatePresence>
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === testimonialIndex ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== Contact + final CTA ===== */}
      <section id="contact" className="py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-5xl font-semibold mb-5">Have a project in mind?</h2>
              <p className="text-textMuted text-lg">
                I'm currently available for freelance work and full-time opportunities. Let's build something worth shipping.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2 text-textMuted">
                {portfolio.contact.email && <p>Email: <a href={`mailto:${portfolio.contact.email}`} className="text-primary hover:underline">{portfolio.contact.email}</a></p>}
                {portfolio.contact.phone && <p>Phone: {portfolio.contact.phone}</p>}
                {portfolio.contact.location && <p>Location: {portfolio.contact.location}</p>}
              </div>
              <div className="flex flex-wrap gap-4 sm:justify-end items-start">
                {Object.entries(portfolio.contact.socialLinks || {}).map(([key, val]) =>
                  val && (
                    <a key={key} href={val} target="_blank" rel="noreferrer" className="mono text-sm text-primary hover:underline capitalize">
                      {key}
                    </a>
                  )
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-textMuted">
          <p>© {new Date().getFullYear()} {owner.name}. All rights reserved.</p>
          <p className="mono text-xs">Built with React, Node.js &amp; MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;