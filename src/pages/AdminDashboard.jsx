import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme, THEMES } from "../context/ThemeContext.jsx";
import { removeBackground } from "@imgly/background-removal";
import { Image as ImageIcon, Video as VideoIcon, X, PlayCircle, Wand2 } from "lucide-react";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
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

const emptyProject = {
  title: "",
  description: "",
  screenshots: [], // [{ url, caption }]
  video: { url: "", caption: "" },
  techStack: [],
  liveLink: "",
  githubLink: "",
  featured: false,
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

  // --- Upload state (keyed by project index) for gallery-based media pickers ---
  const [uploadingScreenshots, setUploadingScreenshots] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState({});

  // --- Upload state for the hero profile image gallery picker ---
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  // --- Background removal state for the hero profile image ---
  const [removingBgProfileImage, setRemovingBgProfileImage] = useState(false);

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
          projects: (data.projects || []).map((p) => ({
            ...emptyProject,
            ...p,
            screenshots: p.screenshots || [],
            video: p.video && typeof p.video === "object" ? p.video : { url: p.video || "", caption: "" },
          })),
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
        projects: (data.projects || []).map((p) => ({
          ...emptyProject,
          ...p,
          screenshots: p.screenshots || [],
          video: p.video && typeof p.video === "object" ? p.video : { url: p.video || "", caption: "" },
        })),
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

  // --- Multi-line string list helper (used for achievements) ---
  const linesToArray = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);

  // --- Gallery upload helpers for project media (screenshots / video) ---
  // NOTE: Videos are uploaded DIRECTLY to Cloudinary from the browser instead of
  // going through the backend. Vercel serverless functions enforce a hard
  // request-body limit of ~4.5MB - any request bigger than that gets rejected
  // with a 413 before it ever reaches Express/multer, and Vercel's error
  // response for that 413 doesn't include CORS headers either, which is why
  // the browser reports it as a CORS error even though the real problem is
  // the payload size. Screenshots (small images) still go through the
  // existing backend `/upload` route since they're comfortably under the
  // limit.
  //
  // Requires an UNSIGNED upload preset in your Cloudinary dashboard:
  // Settings -> Upload -> Add upload preset -> Signing Mode: Unsigned.
  const CLOUDINARY_CLOUD_NAME = "dusj3szjo";
const CLOUDINARY_UPLOAD_PRESET = "portfolio_videos"; // jo naam aapne step 5 mein diya
  const uploadFile = async (file) => {
    const isVideo = file.type.startsWith("video/");

    // Videos: go straight to Cloudinary, bypassing the backend/Vercel body-size limit
    if (isVideo) {
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: cloudForm }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const detail = errData?.error?.message || `Upload failed (status ${res.status})`;
        // Log the full Cloudinary error response to the console so the real
        // cause (wrong preset, file too large, wrong resource type, etc.) is
        // visible instead of being swallowed into a generic message.
        console.error("Cloudinary video upload failed:", detail, errData);
        throw new Error(detail);
      }

      const cloudData = await res.json();

      // Phone-recorded videos are often .mov (H.265/HEVC) which most browsers
      // can't play natively in a <video> tag - "No video with supported
      // format and MIME type found" is exactly that error. secure_url alone
      // keeps the ORIGINAL file extension (e.g. .mov), and just adding
      // transformation flags to that URL isn't enough - the browser still
      // sees ".mov" and gives up before even asking Cloudinary to transcode.
      // So we rebuild the delivery URL from public_id with an explicit
      // ".mp4" extension, which forces Cloudinary to actually deliver
      // browser-playable H.264 MP4 bytes regardless of the source format.
      //
      // FIX (Chrome works, Firefox says "No video with supported format and
      // MIME type found"): the previous transformation only forced the video
      // codec to H.264 (`vc_h264`) but left the audio codec whatever the
      // source happened to produce. Chrome's decoder is very permissive and
      // will happily play almost any audio codec alongside H.264 (AAC, MP3,
      // even some it technically shouldn't). Firefox's decoder is stricter -
      // it rejects non-AAC audio (Cloudinary can keep the source's original
      // AC3/Opus/PCM audio track when only the video codec is specified).
      // That mismatch is exactly why the same URL plays in Chrome but shows
      // "No video with supported format and MIME type found" in Firefox.
      //
      // NOTE: two earlier attempts at this transformation both caused
      // Cloudinary to reject the request outright (400 Bad Request),
      // which is why the video stopped playing in EVERY browser, not
      // just Firefox:
      //   1. `vc_h264:baseline:3.1` hard-locked the profile/level - Baseline
      //      Level 3.1 caps out around 720p, so higher-resolution/bitrate
      //      source videos (very common for phone recordings) couldn't be
      //      satisfied by that transformation at all.
      //   2. `fl_faststart` is NOT a real Cloudinary flag (confirmed via the
      //      `X-Cld-Error: Invalid flag in transformation: faststart`
      //      response header) - Cloudinary already serves MP4s web-optimized
      //      (moov atom up front) by default, so this flag was both wrong
      //      and unnecessary.
      // Only the two codecs are pinned now - this is what actually fixes
      // Firefox (which strictly rejects non-AAC audio tracks) without
      // over-constraining the video and breaking Chrome:
      //   - vc_h264  -> force H.264 video (universal browser support, no
      //                 forced profile/level so Cloudinary can pick one that
      //                 actually fits the source resolution/bitrate)
      //   - ac_aac   -> force AAC audio (universally supported; this is the
      //                 actual fix for the Firefox-only playback failure)
      const playableUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,vc_h264,ac_aac/${cloudData.public_id}.mp4`;
      return playableUrl;
    }

    // Images: keep going through the existing backend upload route
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  };

  const handleScreenshotsSelect = async (index, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploadingScreenshots((prev) => ({ ...prev, [index]: true }));
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f)));
      setForm((prev) => {
        const list = [...prev.projects];
        const newShots = urls.map((url) => ({ url, caption: "" }));
        list[index] = { ...list[index], screenshots: [...(list[index].screenshots || []), ...newShots] };
        return { ...prev, projects: list };
      });
    } catch (err) {
      setMessage("Screenshot upload failed.");
    } finally {
      setUploadingScreenshots((prev) => ({ ...prev, [index]: false }));
    }
  };

  const updateScreenshotCaption = (index, screenshotIndex, caption) => {
    setForm((prev) => {
      const list = [...prev.projects];
      const shots = [...(list[index].screenshots || [])];
      shots[screenshotIndex] = { ...shots[screenshotIndex], caption };
      list[index] = { ...list[index], screenshots: shots };
      return { ...prev, projects: list };
    });
  };

  const removeScreenshot = (index, screenshotIndex) => {
    setForm((prev) => {
      const list = [...prev.projects];
      const shots = [...(list[index].screenshots || [])];
      shots.splice(screenshotIndex, 1);
      list[index] = { ...list[index], screenshots: shots };
      return { ...prev, projects: list };
    });
  };

  const handleVideoSelect = async (index, file) => {
    if (!file) return;

    // Soft client-side size warning. Cloudinary's free-plan unsigned upload
    // limit is commonly around 100MB per file - uploading something larger
    // will fail at the Cloudinary API step with a clear (but easy-to-miss)
    // error. Warning here up front saves a silent multi-minute failed upload.
    const MAX_RECOMMENDED_MB = 100;
    if (file.size > MAX_RECOMMENDED_MB * 1024 * 1024) {
      setMessage(
        `Video ${(file.size / (1024 * 1024)).toFixed(1)}MB ki he - ${MAX_RECOMMENDED_MB}MB se badi videos free Cloudinary plan par upload fail ho sakti hain. Chhoti video try karein.`
      );
    }

    // Show an INSTANT local preview (from the file itself, before any network
    // request) so the gallery never looks like "nothing happened" while the
    // upload is in progress - this was the main cause of "video select karne
    // ke baad kuch show nahi hota".
    const localPreviewUrl = URL.createObjectURL(file);
    setForm((prev) => {
      const list = [...prev.projects];
      list[index] = {
        ...list[index],
        video: { url: localPreviewUrl, caption: list[index].video?.caption || "" },
      };
      return { ...prev, projects: list };
    });

    setUploadingVideo((prev) => ({ ...prev, [index]: true }));
    setMessage("");
    try {
      const url = await uploadFile(file);
      setForm((prev) => {
        const list = [...prev.projects];
        list[index] = { ...list[index], video: { url, caption: list[index].video?.caption || "" } };
        return { ...prev, projects: list };
      });
    } catch (err) {
      // Surface the REAL reason instead of a generic message, and revert the
      // local preview so the picker is available again for a retry.
      console.error("Video upload failed:", err);
      setMessage(`Video upload nahi ho saki: ${err.message || "Unknown error"}`);
      setForm((prev) => {
        const list = [...prev.projects];
        list[index] = { ...list[index], video: { url: "", caption: list[index].video?.caption || "" } };
        return { ...prev, projects: list };
      });
    } finally {
      URL.revokeObjectURL(localPreviewUrl);
      setUploadingVideo((prev) => ({ ...prev, [index]: false }));
    }
  };

  const updateVideoCaption = (index, caption) => {
    setForm((prev) => {
      const list = [...prev.projects];
      list[index] = { ...list[index], video: { ...list[index].video, caption } };
      return { ...prev, projects: list };
    });
  };

  const removeVideo = (index) => {
    setForm((prev) => {
      const list = [...prev.projects];
      list[index] = { ...list[index], video: { url: "", caption: "" } };
      return { ...prev, projects: list };
    });
  };

  // --- Gallery upload helper for the hero profile image (single image, no caption) ---
  const handleProfileImageSelect = async (file) => {
    if (!file) return;
    setUploadingProfileImage(true);
    try {
      const url = await uploadFile(file);
      updateField("hero", "profileImage", url);
    } catch (err) {
      setMessage("Profile image upload failed.");
    } finally {
      setUploadingProfileImage(false);
    }
  };

  const removeProfileImage = () => {
    updateField("hero", "profileImage", "");
  };

  // --- AVIF-safe conversion helper for background removal ---
  // @imgly/background-removal has its own internal image decoder which does
  // NOT support the AVIF format (throws "Invalid format: image/avif").
  // Modern browsers, however, CAN decode AVIF natively via createImageBitmap/
  // <canvas>. So instead of handing the raw image URL straight to
  // removeBackground(), we first fetch the image, let the browser decode it
  // (whatever format it is - AVIF, WebP, JPEG, PNG...), draw it onto a canvas,
  // and re-export it as a plain PNG Blob. That PNG Blob is then what actually
  // gets passed to removeBackground(), so the library never sees the
  // original (possibly unsupported) format at all.
  const convertImageUrlToPngBlob = async (imageUrl) => {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) throw new Error("Could not fetch the image for processing.");
    const sourceBlob = await res.blob();

    const bitmap = await createImageBitmap(sourceBlob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed."))), "image/png");
    });
    return pngBlob;
  };

  // --- Client-side background removal for the hero profile image ---
  // Runs entirely in the browser (WASM/ONNX model via @imgly/background-removal),
  // so there's no server cost and no API key. Takes whatever image is currently
  // set as the profile image, strips its background, uploads the resulting
  // transparent PNG through the existing uploadFile()/Cloudinary flow, and
  // replaces profileImage with the new URL.
  const handleRemoveProfileImageBackground = async () => {
    if (!form.hero.profileImage || removingBgProfileImage) return;
    setRemovingBgProfileImage(true);
    setMessage("");
    try {
      // Normalize to a browser-decoded PNG Blob first (fixes AVIF and any
      // other format @imgly/background-removal can't parse on its own -
      // see convertImageUrlToPngBlob for details), THEN run removeBackground
      // on that Blob instead of on the raw URL.
      const normalizedPngBlob = await convertImageUrlToPngBlob(form.hero.profileImage);

      // device: "cpu" forces the single-threaded WASM backend instead of the
      // multi-threaded/WebGPU one, which needs special Cross-Origin-Opener-Policy /
      // Cross-Origin-Embedder-Policy response headers that Vercel doesn't set by
      // default. Single-threaded is a bit slower but works everywhere with no
      // extra server config.
      const blob = await removeBackground(normalizedPngBlob, {
        device: "cpu",
      });
      const processedFile = new File([blob], "profile-nobg.png", { type: "image/png" });
      const url = await uploadFile(processedFile);
      updateField("hero", "profileImage", url);
      setMessage("Background removed successfully.");
    } catch (err) {
      console.error("Background removal failed:", err);
      setMessage("Background remove nahi ho saka. Dobara try karein.");
    } finally {
      setRemovingBgProfileImage(false);
    }
  };

  const inputClass =
    "w-full bg-surfaceAlt border border-border rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition";
  const labelClass = "text-xs text-textMuted mono block mb-1.5 mt-4 tracking-wide";
  const cardClass = "bg-surface/70 backdrop-blur border border-border rounded-2xl p-6 shadow-sm mb-6";
  const cardTitleClass = "font-display text-xs font-semibold tracking-widest text-primary uppercase mb-1";
  const cardHintClass = "text-xs text-textMuted mb-5";
  const galleryBtnClass =
    "text-xs px-3 py-1.5 rounded-md border border-border cursor-pointer hover:bg-surfaceAlt transition inline-flex items-center gap-1.5";

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

                  {/* Profile image - gallery picker (same pattern as project screenshots/video),
                      plus a "Remove Background" action that processes the currently uploaded
                      image entirely client-side and re-uploads the transparent result. */}
                  <label className={labelClass}>Profile Image</label>
                  {form.hero.profileImage ? (
                    <div className="flex items-start gap-3 bg-bg/60 border border-border rounded-xl p-3">
                      <div
                        className="w-20 h-20 rounded-lg border border-border shrink-0 overflow-hidden flex items-center justify-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                          backgroundSize: "10px 10px",
                          backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        }}
                      >
                        <img
                          src={form.hero.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <label className={galleryBtnClass}>
                            <ImageIcon className="w-3.5 h-3.5" />
                            {uploadingProfileImage ? "Uploading..." : "Replace from Gallery"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingProfileImage || removingBgProfileImage}
                              onChange={(e) => handleProfileImageSelect(e.target.files?.[0])}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={handleRemoveProfileImageBackground}
                            disabled={removingBgProfileImage || uploadingProfileImage}
                            className={`${galleryBtnClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            {removingBgProfileImage ? "Removing Background..." : "Remove Background"}
                          </button>
                        </div>
                        <button onClick={removeProfileImage} className="text-xs text-red-400 mt-2 ml-1 hover:underline flex items-center gap-1">
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={galleryBtnClass}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      {uploadingProfileImage ? "Uploading..." : "Choose Image from Gallery"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingProfileImage}
                        onChange={(e) => handleProfileImageSelect(e.target.files?.[0])}
                      />
                    </label>
                  )}

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

                    {/* Screenshots - gallery picker (multiple), each with its own caption.
                        The first screenshot added automatically becomes the project's cover
                        image on the public portfolio - no separate cover upload needed. */}
                    <label className={labelClass}>Screenshots</label>
                    <p className="text-[11px] text-textMuted -mt-1 mb-2">
                      The first screenshot here is used as the project's cover on your portfolio.
                    </p>
                    <div className="space-y-3 mb-3">
                      {(p.screenshots || []).map((shot, si) => (
                        <div key={si} className="flex items-start gap-3 bg-bg/60 border border-border rounded-xl p-3">
                          <div className="relative shrink-0">
                            <img src={shot.url} alt={`Screenshot ${si + 1}`} className="w-20 h-20 rounded-lg object-cover border border-border" />
                            {si === 0 && (
                              <span className="absolute -top-1.5 -left-1.5 mono text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-white">
                                Cover
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              placeholder="Short description for this screenshot (optional)"
                              className={inputClass}
                              value={shot.caption || ""}
                              onChange={(e) => updateScreenshotCaption(i, si, e.target.value)}
                            />
                            <button onClick={() => removeScreenshot(i, si)} className="text-xs text-red-400 mt-2 hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <label className={galleryBtnClass}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      {uploadingScreenshots[i] ? "Uploading..." : "Add Screenshots from Gallery"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={!!uploadingScreenshots[i]}
                        onChange={(e) => handleScreenshotsSelect(i, e.target.files)}
                      />
                    </label>

                    {/* Demo Video - gallery picker + caption */}
                    <label className={labelClass}>Demo Video</label>
                    {p.video?.url ? (
                      <div className="flex items-start gap-3 bg-bg/60 border border-border rounded-xl p-3">
                        <div className="relative shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-border bg-surfaceAlt flex items-center justify-center">
                          <video src={p.video.url} className="w-full h-full object-cover" muted />
                          <PlayCircle className="w-6 h-6 text-white absolute" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            placeholder="Short description for this video (optional)"
                            className={inputClass}
                            value={p.video.caption || ""}
                            onChange={(e) => updateVideoCaption(i, e.target.value)}
                          />
                          <button onClick={() => removeVideo(i)} className="text-xs text-red-400 mt-2 hover:underline flex items-center gap-1">
                            <X className="w-3 h-3" /> Remove video
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={galleryBtnClass}>
                        <VideoIcon className="w-3.5 h-3.5" />
                        {uploadingVideo[i] ? "Uploading..." : "Choose Video from Gallery"}
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={!!uploadingVideo[i]}
                          onChange={(e) => handleVideoSelect(i, e.target.files?.[0])}
                        />
                      </label>
                    )}

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
                      Mark as Featured (shown with a badge)
                    </label>
                    <button onClick={() => removeListItem("projects", i)} className="text-xs text-red-400 mt-3 hover:underline">Remove Project</button>
                  </div>
                ))}
                <button onClick={() => addListItem("projects", { ...emptyProject })} className="text-sm text-primary hover:underline">+ Add Project</button>
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