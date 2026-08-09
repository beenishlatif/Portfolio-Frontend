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
  { id: "contact", label: "Contact" },
  { id: "theme", label: "Theme" },
];

const emptyPortfolio = {
  hero: {
    title: "",
    subtitle: "",
    tagline: "",
    resumeLink: "",
    profileImage: "",
    roles: [],
    location: "",
    yearsOfExperience: 0,
    availableForWork: true,
    stats: [],
  },
  about: { bio: "", image: "", highlights: [] },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  contact: { email: "", phone: "", location: "", socialLinks: { github: "", linkedin: "", twitter: "", instagram: "" } },
  defaultTheme: "purple",
};

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const { setTheme } = useTheme();
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
      setForm(data);
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
    setForm((prev) => ({ ...prev, [listName]: [...prev[listName], template] }));
  };

  const updateListItem = (listName, index, field, value) => {
    setForm((prev) => {
      const list = [...prev[listName]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listName]: list };
    });
  };

  const removeListItem = (listName, index) => {
    setForm((prev) => {
      const list = [...prev[listName]];
      list.splice(index, 1);
      return { ...prev, [listName]: list };
    });
  };

  // --- Helpers for nested hero.stats (same add/update/remove pattern as top-level lists) ---
  const addHeroStat = () => {
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: [...(prev.hero.stats || []), { label: "", value: "" }] },
    }));
  };

  const updateHeroStat = (index, field, value) => {
    setForm((prev) => {
      const stats = [...(prev.hero.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, hero: { ...prev.hero, stats } };
    });
  };

  const removeHeroStat = (index) => {
    setForm((prev) => {
      const stats = [...(prev.hero.stats || [])];
      stats.splice(index, 1);
      return { ...prev, hero: { ...prev.hero, stats } };
    });
  };

  const inputClass =
    "w-full bg-surfaceAlt border border-border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-sm";
  const labelClass = "text-xs text-textMuted mono block mb-1 mt-4";

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
      <aside className="w-56 border-r border-border p-6 hidden md:flex md:flex-col justify-between">
        <div>
          <p className="font-display font-semibold mb-1">{admin?.name}</p>
          <a
            href={`/${admin?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent mono hover:underline"
          >
            /{admin?.slug} ↗
          </a>

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
            className="px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primaryAlt transition disabled:opacity-60"
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
                <label className={labelClass}>Title / Name</label>
                <input className={inputClass} value={form.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} />

                <label className={labelClass}>Subtitle</label>
                <input className={inputClass} value={form.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />

                <label className={labelClass}>Tagline</label>
                <input className={inputClass} value={form.hero.tagline} onChange={(e) => updateField("hero", "tagline", e.target.value)} />

                <label className={labelClass}>Profile Image URL</label>
                <input className={inputClass} value={form.hero.profileImage} onChange={(e) => updateField("hero", "profileImage", e.target.value)} />

                <label className={labelClass}>Resume Link</label>
                <input className={inputClass} value={form.hero.resumeLink} onChange={(e) => updateField("hero", "resumeLink", e.target.value)} />

                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Lahore, Pakistan"
                  value={form.hero.location}
                  onChange={(e) => updateField("hero", "location", e.target.value)}
                />

                <label className={labelClass}>Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.hero.yearsOfExperience}
                  onChange={(e) => updateField("hero", "yearsOfExperience", Number(e.target.value))}
                />

                <label className={labelClass}>Rotating Roles (comma separated, typewriter effect)</label>
                <input
                  className={inputClass}
                  placeholder="Full Stack Developer, UI/UX Designer, Freelancer"
                  value={form.hero.roles?.join(", ") || ""}
                  onChange={(e) =>
                    updateField(
                      "hero",
                      "roles",
                      e.target.value.split(",").map((r) => r.trim()).filter(Boolean)
                    )
                  }
                />

                <label className="flex items-center gap-2 mt-4 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hero.availableForWork}
                    onChange={(e) => updateField("hero", "availableForWork", e.target.checked)}
                  />
                  Show "Available for work" badge
                </label>

                <p className="mono text-xs text-textMuted mt-6 mb-2">Stats (shown below hero, e.g. Projects, Clients)</p>
                {(form.hero.stats || []).map((s, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-3 mb-2 grid grid-cols-2 gap-3">
                    <input
                      placeholder="Value (e.g. 50+)"
                      className={inputClass}
                      value={s.value}
                      onChange={(e) => updateHeroStat(i, "value", e.target.value)}
                    />
                    <div>
                      <input
                        placeholder="Label (e.g. Projects Done)"
                        className={inputClass}
                        value={s.label}
                        onChange={(e) => updateHeroStat(i, "label", e.target.value)}
                      />
                      <button onClick={() => removeHeroStat(i)} className="text-xs text-red-400 mt-2 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addHeroStat} className="text-sm text-primary hover:underline">
                  + Add Stat
                </button>
              </div>
            )}

            {tab === "about" && (
              <div>
                <label className={labelClass}>Bio</label>
                <textarea rows={6} className={inputClass} value={form.about.bio} onChange={(e) => updateField("about", "bio", e.target.value)} />
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
                    <button onClick={() => removeListItem("projects", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("projects", { title: "", description: "", techStack: [], liveLink: "", githubLink: "", featured: false })} className="text-sm text-primary hover:underline">+ Add Project</button>
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
                    <label className={labelClass}>Duration</label>
                    <input className={inputClass} value={e.duration} onChange={(ev) => updateListItem("experience", i, "duration", ev.target.value)} />
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} className={inputClass} value={e.description} onChange={(ev) => updateListItem("experience", i, "description", ev.target.value)} />
                    <button onClick={() => removeListItem("experience", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("experience", { company: "", role: "", duration: "", description: "" })} className="text-sm text-primary hover:underline">+ Add Experience</button>
              </div>
            )}

            {tab === "education" && (
              <div>
                {form.education.map((e, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Institute" className={inputClass} value={e.institute} onChange={(ev) => updateListItem("education", i, "institute", ev.target.value)} />
                      <input placeholder="Degree" className={inputClass} value={e.degree} onChange={(ev) => updateListItem("education", i, "degree", ev.target.value)} />
                    </div>
                    <label className={labelClass}>Duration</label>
                    <input className={inputClass} value={e.duration} onChange={(ev) => updateListItem("education", i, "duration", ev.target.value)} />
                    <button onClick={() => removeListItem("education", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove</button>
                  </div>
                ))}
                <button onClick={() => addListItem("education", { institute: "", degree: "", duration: "", description: "" })} className="text-sm text-primary hover:underline">+ Add Education</button>
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

            {tab === "theme" && (
              <div>
                <p className="text-textMuted text-sm mb-4">
                  Choose the default theme visitors will see on your portfolio.
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, defaultTheme: t.id }));
                        setTheme(t.id);
                      }}
                      className={`py-3 rounded-md text-sm border transition ${
                        form.defaultTheme === t.id ? "border-primary bg-surfaceAlt" : "border-border"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;