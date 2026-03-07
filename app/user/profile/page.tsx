"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserFromCookie, getTokenFromCookie, clearAuth } from "@/lib/authCookies";
import { updateUserProfile } from "@/lib/userApi";
import LogoutButton from "../../components/LogoutButton";

type User = { id: string; email: string; username: string; role?: string; image?: string; };

const FAQ = [
  { q: "How do I save an activity to favourites?", a: "Open any activity and press the ♡ Save to Favourites button on the detail page." },
  { q: "How is my child's progress tracked?", a: "When you press 'Finish Activity' at the bottom of any activity page, it is recorded in your Progress section." },
  { q: "Can I undo a completed activity?", a: "Yes! Go to My Progress, find the activity, and press the Undo button next to it." },
  { q: "How do I update my profile picture?", a: "Open the Account section below, click 'Choose Photo', select your photo, and press Save Changes." },
  { q: "Who can see my profile and progress?", a: "Only you can see your profile, progress and favourites. Each account is private." },
  { q: "How do I log out?", a: "Press the Logout button at the bottom of this page or in the navigation bar." },
];

const API = "http://localhost:3001";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ff-d { font-family: 'Playfair Display', Georgia, serif; }
  .ff-b { font-family: 'DM Sans', sans-serif; }
  @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .anim-1{animation:fadeUp .45s .05s ease both}
  .anim-2{animation:fadeUp .45s .12s ease both}
  .anim-3{animation:fadeUp .45s .2s ease both}
  .anim-4{animation:fadeUp .45s .28s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1.5s ease-in-out infinite}
  .blob{animation:blobMorph 9s ease-in-out infinite}
  .spin-slow{animation:spinSlow 35s linear infinite}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after{width:100%}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.07)}
  .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
  .stat-card{transition:transform .2s ease,box-shadow .2s ease}
  .stat-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
`;

export default function UserProfilePage() {
  const router = useRouter();
  const [user,        setUser]        = useState<User | null>(null);
  const [email,       setEmail]       = useState("");
  const [username,    setUsername]    = useState("");
  const [image,       setImage]       = useState<File | null>(null);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [toast,       setToast]       = useState<string | null>(null);
  const [completed,   setCompleted]   = useState<number | null>(null);
  const [favourites,  setFavourites]  = useState<number | null>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const [faqOpen,     setFaqOpen]     = useState(false);
  const [aboutOpen,   setAboutOpen]   = useState(false);
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const token      = getTokenFromCookie();
    const storedUser = getUserFromCookie();
    if (!token || !storedUser) { router.push("/auth/login"); return; }
    setUser(storedUser);
    setEmail(storedUser.email || "");
    setUsername(storedUser.username || "");

    // ── fetch real stats ──
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/progress`,            { headers }).then(r => r.json()),
      fetch(`${API}/api/progress/favourites`, { headers }).then(r => r.json()),
    ]).then(([prog, favs]) => {
      setCompleted((prog.activities ?? prog ?? []).length);
      setFavourites(Array.isArray(favs) ? favs.length : 0);
    }).catch(() => {});
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      if (image) formData.append("image", image);
      const res = await updateUserProfile((user as any)._id || user.id, formData);
      showToast("Profile updated! ✅");
      if (res?.user) {
        setUser(res.user);
        setEmail(res.user.email || "");
        setUsername(res.user.username || "");
        document.cookie = `user=${encodeURIComponent(JSON.stringify(res.user))}; path=/`;
        if (res.user.image) setPreviewUrl(res.user.image);
      }
      setAccountOpen(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const profileImageUrl = previewUrl || (user?.image ? user.image : null);
  const firstName       = user?.username?.split(" ")[0] || "Profile";

  const stats = [
    { label: "Completed",  value: completed,  icon: "🎯", href: "/auth/dashboard/progress",   from: "#fff9f5", to: "#fde8d8", num: "#e8703a", border: "rgba(251,146,60,.3)"   },
    { label: "Favourites", value: favourites, icon: "⭐", href: "/auth/dashboard/favourites", from: "#fdf4ff", to: "#ede9fe", num: "#7c3aed", border: "rgba(196,181,253,.3)"  },
    { label: "Activities", value: 9,          icon: "🎨", href: "/auth/dashboard/activities", from: "#f0fdf9", to: "#dcfce7", num: "#16a34a", border: "rgba(134,239,172,.3)"  },
  ];

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf8f5" }}>
      <p className="text-sm animate-pulse" style={{ color: "#c0bab4" }}>Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{pageStyles}</style>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 ff-b text-xs font-bold px-6 py-3 rounded-2xl shadow-xl"
          style={{ background: "#1c1917", color: "white" }}>
          {toast}
        </div>
      )}

      {/* ═══ NAVBAR ═══ */}
      <nav className="nav-glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/auth/dashboard" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", filter: "blur(8px)", transform: "scale(1.1)" }} />
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2" style={{ borderColor: "rgba(251,146,60,.25)", background: "white" }}>
                  <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain p-1" />
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="ff-d font-bold text-sm leading-none" style={{ color: "#1c1917" }}>Kreative Kindle</p>
                <p className="ff-b text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#c0bab4" }}>Learning Platform</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Home",       href: "/auth/dashboard",            emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    emoji: "📢" },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="nav-link ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#a8a29e" }}>
                  <span className="text-sm">{l.emoji}</span>{l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2"> 
              <Link href="/user/profile"
                className="w-9 h-9 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: "#fcd9b6", boxShadow: "0 2px 12px rgba(251,146,60,.2)" }}>
                {profileImageUrl
                  ? <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fda4af,#fb923c)" }}>
                      <span className="ff-b font-bold text-white text-xs">{user.username?.charAt(0).toUpperCase()}</span>
                    </div>}
              </Link>
              <LogoutButton className="ff-b hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white [background:linear-gradient(135deg,#f87171,#fb923c)]" />
            </div>
          </div>
          <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
            {["Home","Activities","Updates"].map((l, i) => (
              <Link key={l} href={["/auth/dashboard","/auth/dashboard/activities","/auth/dashboard/updates"][i]}
                className="flex-shrink-0 ff-b px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#a8a29e" }}>{l}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="anim-1">
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg,#fff9f5 0%,#fef3ec 35%,#fde8f0 65%,#f5eeff 100%)",
          borderBottom: "1px solid rgba(253,186,116,.3)",
        }}>
          <div className="blob absolute pointer-events-none" style={{ top: -60, right: "6%", width: 280, height: 280, background: "radial-gradient(circle,rgba(253,164,175,.4),rgba(251,146,60,.1))", filter: "blur(60px)" }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -50, left: "4%", width: 220, height: 220, background: "radial-gradient(circle,rgba(196,181,253,.35),transparent)", filter: "blur(45px)", animationDelay: "4s" }} />
          <div className="spin-slow absolute pointer-events-none" style={{ top: -60, right: "28%", width: 260, height: 260, borderRadius: "50%", border: "2px dashed rgba(251,146,60,.1)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.1) 1px,transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />
          <div className="float-a absolute pointer-events-none text-3xl select-none" style={{ top: "15%", right: "10%", opacity: 0.1 }}>✨</div>
          <div className="float-b absolute pointer-events-none text-4xl select-none" style={{ bottom: "10%", left: "8%", opacity: 0.08 }}>👤</div>

          <div className="relative z-10 max-w-2xl mx-auto px-5 py-10 text-center">
            {/* avatar with gradient ring */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg,#f87171,#fb923c,#fbbf24)", padding: 3 }}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {profileImageUrl
                    ? <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fde8d8,#fce4ec)" }}>
                        <span className="ff-d font-bold text-3xl" style={{ color: "#e8703a" }}>{user.username?.charAt(0).toUpperCase()}</span>
                      </div>}
                </div>
              </div>
              <button onClick={() => setAccountOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", border: "2px solid white" }}>
                ✏️
              </button>
            </div>

            <h1 className="ff-d font-bold text-3xl mb-1" style={{ color: "#1c1917", fontStyle: "italic" }}>
              <span className="shimmer-text">{firstName}</span>
            </h1>
            <p className="ff-b text-xs font-bold uppercase tracking-widest capitalize mb-0.5" style={{ color: "#c0bab4" }}>{user.role || "Parent"}</p>
            <p className="ff-b text-xs" style={{ color: "#d1ccc8" }}>Joined {new Date().getFullYear()}</p>

            {/* ── REAL STATS ── */}
            <div className="grid grid-cols-3 gap-3 mt-7 max-w-sm mx-auto">
              {stats.map(s => (
                <Link key={s.label} href={s.href}
                  className="stat-card relative rounded-2xl p-4 text-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${s.from},${s.to})`, border: `1px solid ${s.border}` }}>
                  <div className="absolute -bottom-1 -right-1 text-3xl select-none pointer-events-none" style={{ opacity: 0.1 }}>{s.icon}</div>
                  <p className="text-xl mb-1">{s.icon}</p>
                  <p className="ff-d font-bold text-2xl" style={{ color: s.num, lineHeight: 1 }}>
                    {s.value === null ? <span className="text-lg" style={{ color: "#d1ccc8" }}>…</span> : s.value}
                  </p>
                  <p className="ff-b text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: "#a8a29e" }}>{s.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTIONS ═══ */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">

        {/* ACCOUNT */}
        <div className="anim-2 rounded-3xl overflow-hidden" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <button onClick={() => setAccountOpen(!accountOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#fff9f5,#fde8d8)", border: "1px solid rgba(251,146,60,.2)" }}>👤</div>
              <div className="text-left">
                <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>Account</p>
                <p className="ff-b text-xs" style={{ color: "#c0bab4" }}>Edit personal details</p>
              </div>
            </div>
            <span className="text-lg transition-transform duration-200" style={{ color: "#d1ccc8", display: "inline-block", transform: accountOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
          </button>
          {accountOpen && (
            <div className="p-5" style={{ borderTop: "1px solid #f0ebe4" }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#faf8f5", border: "1px solid #f0ebe4" }}>
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: "#fcd9b6" }}>
                    {profileImageUrl
                      ? <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fde8d8,#fce4ec)" }}>
                          <span className="ff-d font-bold text-xl" style={{ color: "#e8703a" }}>{user.username?.charAt(0).toUpperCase()}</span>
                        </div>}
                  </div>
                  <div>
                    <p className="ff-b text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c0bab4" }}>Profile Picture</p>
                    <label className="lift cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl ff-b text-xs font-bold uppercase tracking-widest"
                      style={{ background: "white", border: "1px solid #f0ebe4", color: "#78716c" }}>
                      📷 Choose Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Email</label>
                  <input className="mt-1.5 w-full rounded-2xl px-4 py-3 ff-b text-sm focus:outline-none transition-all"
                    style={{ background: "#faf8f5", border: "1.5px solid #f0ebe4", color: "#374151" }}
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#fca5a5"}
                    onBlur={e  => e.target.style.borderColor = "#f0ebe4"} />
                </div>
                <div>
                  <label className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Username</label>
                  <input className="mt-1.5 w-full rounded-2xl px-4 py-3 ff-b text-sm focus:outline-none transition-all"
                    style={{ background: "#faf8f5", border: "1.5px solid #f0ebe4", color: "#374151" }}
                    value={username} onChange={e => setUsername(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#fca5a5"}
                    onBlur={e  => e.target.style.borderColor = "#f0ebe4"} />
                </div>
                <div>
                  <label className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Role</label>
                  <div className="mt-1.5 w-full rounded-2xl px-4 py-3 ff-b text-sm capitalize"
                    style={{ background: "#f5f5f4", border: "1px solid #f0ebe4", color: "#a8a29e" }}>
                    {user.role || "Parent"}
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={loading}
                    className="lift flex-1 py-3 ff-b text-xs font-bold rounded-2xl uppercase tracking-widest text-white disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 14px rgba(248,113,113,.25)" }}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => setAccountOpen(false)}
                    className="px-5 py-3 rounded-2xl ff-b text-xs font-semibold uppercase tracking-widest"
                    style={{ background: "#faf8f5", border: "1px solid #f0ebe4", color: "#a8a29e" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="anim-3 rounded-3xl overflow-hidden" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <button onClick={() => setFaqOpen(!faqOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#f0fdf9,#d8ede8)", border: "1px solid rgba(52,211,153,.2)" }}>❓</div>
              <div className="text-left">
                <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>Help & Support</p>
                <p className="ff-b text-xs" style={{ color: "#c0bab4" }}>FAQs and contact</p>
              </div>
            </div>
            <span className="text-lg transition-transform duration-200" style={{ color: "#d1ccc8", display: "inline-block", transform: faqOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
          </button>
          {faqOpen && (
            <div className="p-5 space-y-2" style={{ borderTop: "1px solid #f0ebe4" }}>
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ebe4" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[#faf8f5] transition-colors">
                    <p className="ff-b text-xs font-semibold pr-4" style={{ color: "#374151" }}>{item.q}</p>
                    <span className="text-lg flex-shrink-0 transition-transform duration-200" style={{ color: "#d1ccc8", display: "inline-block", transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="ff-b text-xs leading-relaxed" style={{ color: "#78716c" }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg,#fff9f5,#fde8d8)", border: "1px solid rgba(251,146,60,.2)" }}>
                <p className="ff-b text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#e8703a" }}>Still need help?</p>
                <p className="ff-b text-xs" style={{ color: "#b45309" }}>📧 Xyz@Gmail.Com</p>
                <p className="ff-b text-xs mt-1" style={{ color: "#b45309" }}>📞 +977-9813760646</p>
              </div>
            </div>
          )}
        </div>

        {/* ABOUT */}
        <div className="anim-4 rounded-3xl overflow-hidden" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <button onClick={() => setAboutOpen(!aboutOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#f5f0ff,#ede8fd)", border: "1px solid rgba(167,139,250,.2)" }}>ℹ️</div>
              <div className="text-left">
                <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>About</p>
                <p className="ff-b text-xs" style={{ color: "#c0bab4" }}>About Kreative Kindle</p>
              </div>
            </div>
            <span className="text-lg transition-transform duration-200" style={{ color: "#d1ccc8", display: "inline-block", transform: aboutOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
          </button>
          {aboutOpen && (
            <div className="p-5 space-y-3" style={{ borderTop: "1px solid #f0ebe4" }}>
              <p className="ff-b text-sm leading-relaxed" style={{ color: "#57534e" }}>
                <span className="ff-d font-bold" style={{ color: "#1c1917" }}>Kreative Kindle</span> is a learning platform designed to help parents guide young children through fun, educational activities.
              </p>
              <p className="ff-b text-sm leading-relaxed" style={{ color: "#78716c" }}>
                Our activities cover Art, Math, Reading and Science for children aged 2–10, designed by early childhood educators.
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {["Version 1.0","© 2025 Kreative Kindle"].map(t => (
                  <span key={t} className="ff-b text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl"
                    style={{ background: "#faf8f5", border: "1px solid #f0ebe4", color: "#a8a29e" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* QUICK LINKS */}
        <div className="rounded-3xl p-5" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <p className="ff-b text-[9px] font-bold uppercase tracking-widest mb-4" style={{ color: "#c0bab4" }}>Quick Access</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Activities", emoji: "🎨", href: "/auth/dashboard/activities", from: "#fff9f5", to: "#fde8d8", color: "#e8703a" },
              { label: "Progress",   emoji: "📊", href: "/auth/dashboard/progress",   from: "#f0fdf9", to: "#dcfce7", color: "#16a34a" },
              { label: "Favourites", emoji: "⭐", href: "/auth/dashboard/favourites", from: "#fdf4ff", to: "#ede9fe", color: "#7c3aed" },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className="lift rounded-2xl p-4 text-center"
                style={{ background: `linear-gradient(135deg,${l.from},${l.to})`, border: `1px solid ${l.color}20` }}>
                <p className="text-2xl mb-1">{l.emoji}</p>
                <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: l.color }}>{l.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <button onClick={() => { clearAuth(); router.push("/auth/login"); }}
          className="w-full py-4 rounded-3xl ff-b text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.01]"
          style={{ background: "white", border: "1.5px solid rgba(248,113,113,.3)", color: "#f87171", boxShadow: "0 4px 16px rgba(248,113,113,.08)" }}>
          Log Out
        </button>

        <p className="ff-b text-center text-xs pb-4" style={{ color: "#d1ccc8" }}>Kreative Kindle v1.0 · © 2025</p>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-4" style={{ background: "#1c1917" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#34d399,#818cf8,#f87171)", backgroundSize: "200% 100%", animation: "shimmer 6s linear infinite" }} />
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff9f5,#fef3ec,#fde8f0)", paddingTop: 40, paddingBottom: 40 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.15) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h3 className="ff-d font-bold text-2xl mb-6" style={{ color: "#1c1917", fontStyle: "italic" }}>Built for Curious Minds ✨</h3>
            <div className="flex justify-center flex-wrap gap-3">
              {[
                { label: "Dashboard",  href: "/auth/dashboard",            emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", emoji: "🎨" },
                { label: "Progress",   href: "/auth/dashboard/progress",   emoji: "📊" },
                { label: "Favourites", href: "/auth/dashboard/favourites", emoji: "⭐" },
                { label: "Updates",    href: "/auth/dashboard/updates",    emoji: "📢" },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="ff-b text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,.7)", color: "#78716c", border: "1px solid rgba(253,186,116,.3)", backdropFilter: "blur(8px)" }}>
                  <span>{l.emoji}</span>{l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl overflow-hidden"><img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" /></div>
                <span className="ff-d text-sm font-bold text-white">Kreative Kindle</span>
              </div>
              <p className="ff-b text-xs leading-relaxed" style={{ color: "#78716c", maxWidth: 200 }}>Fun, meaningful activities crafted for curious early learners.</p>
            </div>
            <div className="space-y-2">
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#57534e" }}>Contact</p>
              <p className="ff-b text-xs" style={{ color: "#78716c" }}>📞 +977-9813760646</p>
              <p className="ff-b text-xs" style={{ color: "#78716c" }}>✉️ Xyz@Gmail.Com</p>
            </div>
            <div>
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#57534e" }}>Version</p>
              <div className="p-3 rounded-2xl" style={{ background: "#292524", border: "1px solid #333" }}>
                <p className="ff-b text-xs" style={{ color: "#78716c" }}>Kreative Kindle v1.0 · 2025</p>
                <p className="ff-b text-[10px] mt-1" style={{ color: "#57534e" }}>Built with ❤️ for early learners</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px" style={{ background: "#292524" }} />
            <div className="w-7 h-7 rounded-full flex items-center justify-center ff-d text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>K</div>
            <div className="flex-1 h-px" style={{ background: "#292524" }} />
          </div>
          <p className="ff-b text-xs text-center" style={{ color: "#44403c" }}>© 2025 Kreative Kindle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}