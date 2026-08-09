import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme, THEMES } from "../context/ThemeContext.jsx";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "techstack", label: "Tech Stack" },
  { id: "contact", label: "Contact" },
];

// Pakistan's major universities - used as a datalist so the admin can pick
// a common one or still type a custom name freely.
export const PAKISTAN_UNIVERSITIES = [
  "Quaid-i-Azam University, Islamabad",
  "University of the Punjab, Lahore",
  "Lahore University of Management Sciences (LUMS)",
  "National University of Sciences and Technology (NUST)",
  "FAST - National University of Computer and Emerging Sciences",
  "Ghulam Ishaq Khan Institute (GIKI)",
  "University of Karachi",
  "COMSATS University Islamabad",
  "University of Engineering and Technology (UET), Lahore",
  "University of Engineering and Technology (UET), Peshawar",
  "University of Engineering and Technology (UET), Taxila",
  "NED University of Engineering and Technology, Karachi",
  "Aga Khan University",
  "Institute of Business Administration (IBA), Karachi",
  "Pakistan Institute of Engineering and Applied Sciences (PIEAS)",
  "Bahria University",
  "Air University, Islamabad",
  "University of Sindh, Jamshoro",
  "Preston University",
  "Iqra University",
  "Habib University",
  "SZABIST",
  "Riphah International University",
  "University of Management and Technology (UMT), Lahore",
  "University of Central Punjab (UCP)",
  "Superior University, Lahore",
  "University of Agriculture, Faisalabad",
  "Government College University, Lahore",
  "Government College University, Faisalabad",
  "University of Sargodha",
  "The Islamia University of Bahawalpur",
  "Bahauddin Zakariya University, Multan",
  "University of Peshawar",
  "Khyber Medical University",
  "King Edward Medical University",
  "Dow University of Health Sciences",
  "Allama Iqbal Open University",
  "Virtual University of Pakistan",
];

const emptyPortfolio = {
  hero: {
    title: "",
    subtitle: "",
    tagline: "",
    resumeLink: "",
    githubLink: "",
    profileImage: "",
    roles: [],
    location: "",
    yearsOfExperience: 0,
    availableForWork: true,
    stats: [],
    services: [],
    whyChooseMe: [],
  },
  about: { bio: "", image: "", highlights: [], approach: "" },
  techStack: [],
  skills: [],
  projects: [],
  experience: [],
  education: [],
  contact: { email: "", phone: "", location: "", socialLinks: { github: "", linkedin: "", twitter: "", instagram: "" } },
  defaultTheme: "purple",
};

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState("hero");
  const [form, setForm] = useState(emptyPortfolio);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/portfolio/me");
        setForm({
          ...emptyPortfolio,
          ...data,
          hero: { ...emptyPortfolio.hero, ...data.hero },
          about: { ...emptyPortfolio.about, ...data.about },
          contact: {
            ...emptyPortfolio.contact,
            ...data.contact,
            socialLinks: { ...emptyPortfolio.contact.socialLinks, ...data.contact?.socialLinks },
          },
          skills: data.skills || [],
          projects: data.projects || [],
          experience: data.experience || [],
          education: data.education || [],
          techStack: data.techStack || [],
        });
      } catch (err) {
        setMessage("Could not load your portfolio data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put("/portfolio/me", form);
      setForm({
        ...emptyPortfolio,
        ...data,
        hero: { ...emptyPortfolio.hero, ...data.hero },
        about: { ...emptyPortfolio.about, ...data.about },
        contact: {
          ...emptyPortfolio.contact,
          ...data.contact,
          socialLinks: { ...emptyPortfolio.contact.socialLinks, ...data.contact?.socialLinks },
        },
        skills: data.skills || [],
        projects: data.projects || [],
        experience: data.experience || [],
        education: data.education || [],
        techStack: data.techStack || [],
      });
      setMessage("Saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateSocial = (key, value) => {
    setForm((prev) => ({
      ...prev,
      contact: { ...prev.contact, socialLinks: { ...prev.contact.socialLinks, [key]: value } },
    }));
  };

  const addListItem = (listName, template) => {
    setForm((prev) => ({ ...prev, [listName]: [...(prev[listName] || []), template] }));
  };

  const updateListItem = (listName, index, field, value) => {
    setForm((prev) => {
      const list = [...(prev[listName] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listName]: list };
    });
  };

  const removeListItem = (listName, index) => {
    setForm((prev) => {
      const list = [...(prev[listName] || [])];
      list.splice(index, 1);
      return { ...prev, [listName]: list };
    });
  };

  // --- Helpers for nested hero.stats / hero.services / hero.whyChooseMe ---
  const addHeroListItem = (field, template) => {
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: [...(prev.hero[field] || []), template] },
    }));
  };
  const updateHeroListItem = (field, index, key, value) => {
    setForm((prev) => {
      const list = [...(prev.hero[field] || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, hero: { ...prev.hero, [field]: list } };
    });
  };
  const removeHeroListItem = (field, index) => {
    setForm((prev) => {
      const list = [...(prev.hero[field] || [])];
      list.splice(index, 1);
      return { ...prev, hero: { ...prev.hero, [field]: list } };
    });
  };

  // --- Multi-line string list helper (used for achievements, screenshots) ---
  const linesToArray = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);

  const inputClass =
    "w-full bg-surfaceAlt border border-border rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition";
  const labelClass = "text-xs text-textMuted mono block mb-1.5 mt-4 tracking-wide";
  const cardClass = "bg-surface/70 backdrop-blur border border-border rounded-2xl p-6 shadow-sm mb-6";
  const cardTitleClass = "font-display text-xs font-semibold tracking-widest text-primary uppercase mb-1";
  const cardHintClass = "text-xs text-textMuted mb-5";

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <p className="mono text-textMuted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border p-6 hidden md:flex md:flex-col justify-between shrink-0">
        <div className="overflow-y-auto">
          <p className="font-display font-semibold mb-1">{admin?.name}</p>
          <a
            href={`/${admin?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent mono hover:underline"
          >
            /{admin?.slug} ↗
          </a>

          {/* Premium theme switcher - replaces the old standalone "Theme" tab */}
          <div className="mt-6">
            <p className="text-[10px] mono text-textMuted uppercase tracking-widest mb-2">Theme</p>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  title={t.label}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, defaultTheme: t.id }));
                    setTheme(t.id);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    (form.defaultTheme || theme) === t.id ? "border-primary scale-110" : "border-border"
                  }`}
                  style={{ background: t.swatch || "var(--color-primary)" }}
                />
              ))}
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                  tab === t.id ? "bg-primary text-white" : "text-textMuted hover:bg-surface"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="text-sm text-textMuted hover:text-red-400 transition">
          Log out
        </button>
      </aside>

      {/* Main editor */}
      <main className="flex-1 p-6 md:p-10 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold capitalize">{tab} Section</h1>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primaryAlt transition disabled:opacity-60 shadow-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && <p className="text-sm text-accent mb-4">{message}</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "hero" && (
              <div>
                <div className={cardClass}>
                  <p className={cardTitleClass}>Identity</p>
                  <p className={cardHintClass}>How you're introduced at the top of your site.</p>
                  <label className={labelClass}>Title / Name</label>
                  <input className={inputClass} value={form.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} />
                  <label className={labelClass}>Subtitle</label>
                  <input className={inputClass} value={form.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />
                  <label className={labelClass}>Tagline</label>
                  <input className={inputClass} value={form.hero.tagline} onChange={(e) => updateField("hero", "tagline", e.target.value)} />
                  <label className={labelClass}>Profile Image URL</label>
                  <input className={inputClass} value={form.hero.profileImage} onChange={(e) => updateField("hero", "profileImage", e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Resume Link</label>
                      <input className={inputClass} value={form.hero.resumeLink} onChange={(e) => updateField("hero", "resumeLink", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>GitHub Link</label>
                      <input className={inputClass} placeholder="https://github.com/username" value={form.hero.githubLink} onChange={(e) => updateField("hero", "githubLink", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <p className={cardTitleClass}>Availability & Location</p>
                  <p className={cardHintClass}>Shown as quick-info pills right under your name.</p>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} placeholder="e.g. Lahore, Pakistan" value={form.hero.location} onChange={(e) => updateField("hero", "location", e.target.value)} />
                  <label className={labelClass}>Years of Experience</label>
                  <input type="number" min={0} className={inputClass} value={form.hero.yearsOfExperience} onChange={(e) => updateField("hero", "yearsOfExperience", Number(e.target.value))} />
                  <label className="flex items-center gap-2 mt-5 text-sm">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={form.hero.availableForWork} onChange={(e) => updateField("hero", "availableForWork", e.target.checked)} />
                    Show "Available for Freelance" badge
                  </label>
                </div>

                <div className={cardClass}>
                  <p className={cardTitleClass}>Rotating Roles</p>
                  <p className={cardHintClass}>Typewriter effect cycles through these, one at a time.</p>
                  <input
                    className={inputClass}
                    placeholder="Full Stack Developer, React Developer, MERN Developer"
                    value={form.hero.roles?.join(", ") || ""}
                    onChange={(e) => updateField("hero", "roles", e.target.value.split(",").map((r) => r.trim()).filter(Boolean))}
                  />
                </div>

                <div className={cardClass}>
                  <p className={cardTitleClass}>Stats</p>
                  <p className={cardHintClass}>Numbers shown beside your photo and in the stats bar (e.g. Projects Done, Happy Clients).</p>
                  {(form.hero.stats || []).map((s, i) => (
                    <div key={i} className="bg-bg/60 border border-border rounded-xl p-3.5 mb-3 grid grid-cols-2 gap-3">
                      <input placeholder="Value (e.g. 50+)" className={inputClass} value={s.value} onChange={(e) => updateHeroListItem("stats", i, "value", e.target.value)} />
                      <div>
                        <input placeholder="Label (e.g. Projects Done)" className={inputClass} value={s.label} onChange={(e) => updateHeroListItem("stats", i, "label", e.target.value)} />
                        <button onClick={() => removeHeroListItem("stats", i)} className="text-xs text-red-400 mt-2 hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addHeroListItem("stats", { label: "", value: "" })} className="text-sm text-primary hover:underline font-medium">+ Add Stat</button>
                </div>

                <div className={cardClass}>
                  <p className={cardTitleClass}>Services</p>
                  <p className={cardHintClass}>What you offer clients — shown right on the hero, no separate section needed.</p>
                  {(form.hero.services || []).map((s, i) => (
                    <div key={i} className="bg-bg/60 border border-border rounded-xl p-3.5 mb-3">
                      <input placeholder="Title (e.g. Web Development)" className={inputClass} value={s.title} onChange={(e) => updateHeroListItem("services", i, "title", e.target.value)} />
                      <label className={labelClass}>Description</label>
                      <textarea rows={2} className={inputClass} value={s.description} onChange={(e) => updateHeroListItem("services", i, "description", e.target.value)} />
                      <button onClick={() => removeHeroListItem("services", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addHeroListItem("services", { title: "", description: "" })} className="text-sm text-primary hover:underline font-medium">+ Add Service</button>
                </div>

                <div className={cardClass}>
                  <p className={cardTitleClass}>Why Choose Me</p>
                  <p className={cardHintClass}>Your key selling points — also shown on the hero.</p>
                  {(form.hero.whyChooseMe || []).map((w, i) => (
                    <div key={i} className="bg-bg/60 border border-border rounded-xl p-3.5 mb-3">
                      <input placeholder="Title (e.g. Clean Code)" className={inputClass} value={w.title} onChange={(e) => updateHeroListItem("whyChooseMe", i, "title", e.target.value)} />
                      <label className={labelClass}>Description</label>
                      <textarea rows={2} className={inputClass} value={w.description} onChange={(e) => updateHeroListItem("whyChooseMe", i, "description", e.target.value)} />
                      <button onClick={() => removeHeroListItem("whyChooseMe", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addHeroListItem("whyChooseMe", { title: "", description: "" })} className="text-sm text-primary hover:underline font-medium">+ Add Point</button>
                </div>
              </div>
            )}

            {tab === "about" && (
              <div>
                <div className={cardClass}>
                  <p className={cardTitleClass}>Bio</p>
                  <p className={cardHintClass}>Your main story — feel free to write a few paragraphs.</p>
                  <textarea rows={8} className={inputClass} value={form.about.bio} onChange={(e) => updateField("about", "bio", e.target.value)} />
                </div>
                <div className={cardClass}>
                  <p className={cardTitleClass}>My Approach</p>
                  <p className={cardHintClass}>How you work — process, values, what clients can expect.</p>
                  <textarea rows={6} className={inputClass} value={form.about.approach} onChange={(e) => updateField("about", "approach", e.target.value)} />
                </div>
                <div className={cardClass}>
                  <p className={cardTitleClass}>Highlights</p>
                  <p className={cardHintClass}>One per line — short bullet points shown next to your bio.</p>
                  <textarea
                    rows={5}
                    className={inputClass}
                    placeholder={"5+ years building production apps\nShipped 20+ client projects\nOpen source contributor"}
                    value={(form.about.highlights || []).join("\n")}
                    onChange={(e) => updateField("about", "highlights", linesToArray(e.target.value))}
                  />
                </div>
                <div className={cardClass}>
                  <p className={cardTitleClass}>About Image</p>
                  <input className={inputClass} value={form.about.image} onChange={(e) => updateField("about", "image", e.target.value)} />
                </div>
              </div>
            )}

            {tab === "skills" && (
              <div>
                {form.skills.map((s, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Skill name" className={inputClass} value={s.name} onChange={(e) => updateListItem("skills", i, "name", e.target.value)} />
                      <input placeholder="Category" className={inputClass} value={s.category} onChange={(e) => updateListItem("skills", i, "category", e.target.value)} />
                    </div>
                    <label className={labelClass}>Level: {s.level}%</label>
                    <input type="range" min={0} max={100} value={s.level} onChange={(e) => updateListItem("skills", i, "level", Number(e.target.value))} className="w-full" />
                    <button onClick={() => removeListItem("skills", i)} className="text-xs text-red-400 mt-2 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("skills", { name: "", category: "General", level: 70 })} className="text-sm text-primary hover:underline">+ Add Skill</button>
              </div>
            )}

            {tab === "projects" && (
              <div>
                {form.projects.map((p, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <input placeholder="Title" className={inputClass} value={p.title} onChange={(e) => updateListItem("projects", i, "title", e.target.value)} />
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} className={inputClass} value={p.description} onChange={(e) => updateListItem("projects", i, "description", e.target.value)} />
                    <label className={labelClass}>Cover Image URL</label>
                    <input className={inputClass} value={p.image || ""} onChange={(e) => updateListItem("projects", i, "image", e.target.value)} />
                    <label className={labelClass}>Screenshots (one URL per line)</label>
                    <textarea
                      rows={3}
                      className={inputClass}
                      placeholder={"https://.../screenshot1.png\nhttps://.../screenshot2.png"}
                      value={(p.screenshots || []).join("\n")}
                      onChange={(e) => updateListItem("projects", i, "screenshots", linesToArray(e.target.value))}
                    />
                    <label className={labelClass}>Demo Video URL (YouTube/Loom/mp4)</label>
                    <input className={inputClass} placeholder="https://..." value={p.video || ""} onChange={(e) => updateListItem("projects", i, "video", e.target.value)} />
                    <label className={labelClass}>Tech Stack (comma separated)</label>
                    <input
                      className={inputClass}
                      value={p.techStack?.join(", ") || ""}
                      onChange={(e) => updateListItem("projects", i, "techStack", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                    />
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input placeholder="Live link" className={inputClass} value={p.liveLink} onChange={(e) => updateListItem("projects", i, "liveLink", e.target.value)} />
                      <input placeholder="GitHub link" className={inputClass} value={p.githubLink} onChange={(e) => updateListItem("projects", i, "githubLink", e.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 mt-4 text-sm">
                      <input type="checkbox" className="accent-primary w-4 h-4" checked={!!p.featured} onChange={(e) => updateListItem("projects", i, "featured", e.target.checked)} />
                      Mark as Featured (shown on homepage)
                    </label>
                    <button onClick={() => removeListItem("projects", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("projects", { title: "", description: "", image: "", screenshots: [], video: "", techStack: [], liveLink: "", githubLink: "", featured: false })} className="text-sm text-primary hover:underline">+ Add Project</button>
              </div>
            )}

            {tab === "experience" && (
              <div>
                {form.experience.map((e, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Company" className={inputClass} value={e.company} onChange={(ev) => updateListItem("experience", i, "company", ev.target.value)} />
                      <input placeholder="Role" className={inputClass} value={e.role} onChange={(ev) => updateListItem("experience", i, "role", ev.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input placeholder="Location (e.g. Remote / Lahore)" className={inputClass} value={e.location || ""} onChange={(ev) => updateListItem("experience", i, "location", ev.target.value)} />
                      <input placeholder="Duration (e.g. Jan 2023 - Present)" className={inputClass} value={e.duration} onChange={(ev) => updateListItem("experience", i, "duration", ev.target.value)} />
                    </div>
                    <label className="flex items-center gap-2 mt-4 text-sm">
                      <input type="checkbox" className="accent-primary w-4 h-4" checked={!!e.current} onChange={(ev) => updateListItem("experience", i, "current", ev.target.checked)} />
                      Currently working here
                    </label>
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} className={inputClass} value={e.description} onChange={(ev) => updateListItem("experience", i, "description", ev.target.value)} />
                    <label className={labelClass}>Key Achievements (one per line)</label>
                    <textarea
                      rows={3}
                      className={inputClass}
                      placeholder={"Led migration to microservices, cutting load times by 40%\nMentored 3 junior developers"}
                      value={(e.achievements || []).join("\n")}
                      onChange={(ev) => updateListItem("experience", i, "achievements", linesToArray(ev.target.value))}
                    />
                    <button onClick={() => removeListItem("experience", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("experience", { company: "", role: "", location: "", duration: "", current: false, description: "", achievements: [] })} className="text-sm text-primary hover:underline">+ Add Experience</button>
              </div>
            )}

            {tab === "education" && (
              <div>
                <datalist id="pk-universities">
                  {PAKISTAN_UNIVERSITIES.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
                {form.education.map((e, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <label className={labelClass}>University</label>
                    <input
                      list="pk-universities"
                      placeholder="Start typing to pick a Pakistani university, or type your own"
                      className={inputClass}
                      value={e.university || ""}
                      onChange={(ev) => updateListItem("education", i, "university", ev.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input placeholder="Degree (e.g. BS Computer Science)" className={inputClass} value={e.degree} onChange={(ev) => updateListItem("education", i, "degree", ev.target.value)} />
                      <input placeholder="Field of Study" className={inputClass} value={e.fieldOfStudy || ""} onChange={(ev) => updateListItem("education", i, "fieldOfStudy", ev.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input placeholder="Duration (e.g. 2019 - 2023)" className={inputClass} value={e.duration} onChange={(ev) => updateListItem("education", i, "duration", ev.target.value)} />
                      <input placeholder="GPA (optional)" className={inputClass} value={e.gpa || ""} onChange={(ev) => updateListItem("education", i, "gpa", ev.target.value)} />
                    </div>
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} className={inputClass} value={e.description} onChange={(ev) => updateListItem("education", i, "description", ev.target.value)} />
                    <button onClick={() => removeListItem("education", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("education", { university: "", degree: "", fieldOfStudy: "", duration: "", gpa: "", description: "" })} className="text-sm text-primary hover:underline">+ Add Education</button>
              </div>
            )}

            {tab === "techstack" && (
              <div className={cardClass}>
                <p className={cardTitleClass}>Tech Stack Marquee</p>
                <p className={cardHintClass}>Scrolling strip of technologies shown right under the hero.</p>
                <input
                  className={inputClass}
                  placeholder="React, Node.js, MongoDB, Express, Tailwind CSS"
                  value={form.techStack?.join(", ") || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                />
              </div>
            )}

            {tab === "contact" && (
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} value={form.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)} />
                <label className={labelClass}>Phone</label>
                <input className={inputClass} value={form.contact.phone} onChange={(e) => updateField("contact", "phone", e.target.value)} />
                <label className={labelClass}>Location</label>
                <input className={inputClass} value={form.contact.location} onChange={(e) => updateField("contact", "location", e.target.value)} />
                <p className="mono text-xs text-textMuted mt-6 mb-2">Social Links</p>
                {["github", "linkedin", "twitter", "instagram"].map((key) => (
                  <div key={key}>
                    <label className={labelClass}>{key}</label>
                    <input className={inputClass} value={form.contact.socialLinks?.[key] || ""} onChange={(e) => updateSocial(key, e.target.value)} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;