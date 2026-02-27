"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

type User = { _id?: string; id?: string; email?: string; username?: string; role?: string; image?: string; };

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function getUserFromCookie(): User | null {
  const raw = getCookie("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

const API = "http://localhost:3001";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]           = useState<User | null>(null);
  const [totalDone, setTotalDone] = useState<number | null>(null);
  const [favCount, setFavCount]   = useState<number | null>(null);
  const [weekCount, setWeekCount] = useState<number | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    const u     = getUserFromCookie();
    if (!token || !u) { router.push("/auth/login"); return; }
    setUser(u);
    const fetchStats = async () => {
      try {
        const [progRes, favRes] = await Promise.all([
          fetch(`${API}/api/progress`,            { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/progress/favourites`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const prog = await progRes.json();
        const favs = await favRes.json();
        setTotalDone(prog.activities?.length ?? 0);
        setFavCount(favs.length ?? 0);
        const thisWeek = (prog.activities ?? []).filter((a: any) =>
          Date.now() - new Date(a.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000
        ).length;
        setWeekCount(thisWeek);
      } catch {}
    };
    fetchStats();
  }, []);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.username?.split(" ")[0] || "there";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    .ff-d { font-family: 'Playfair Display', Georgia, serif; }
    .ff-b { font-family: 'DM Sans', sans-serif; }
    @keyframes floatUp   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
    @keyframes floatSide { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(8px) rotate(3deg)} }
    @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
    @keyframes pulse2    { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
    .anim-1{animation:fadeUp .5s .05s ease both}
    .anim-2{animation:fadeUp .5s .15s ease both}
    .anim-3{animation:fadeUp .5s .25s ease both}
    .anim-4{animation:fadeUp .5s .35s ease both}
    .anim-5{animation:fadeUp .5s .45s ease both}
    .float-a{animation:floatUp 6s ease-in-out infinite}
    .float-b{animation:floatUp 8s 1s ease-in-out infinite}
    .float-c{animation:floatSide 7s 2s ease-in-out infinite}
    .float-d{animation:floatUp 9s 3s ease-in-out infinite}
    .spin-slow{animation:spinSlow 30s linear infinite}
    .blob{animation:blobMorph 8s ease-in-out infinite}
    .lift{transition:transform .22s ease,box-shadow .22s ease}
    .lift:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.09)}
    .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
    .nav-link{position:relative}
    .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
    .card-hover{transition:transform .22s ease,box-shadow .22s ease}
    .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.08)}
    .age-pill{transition:all .18s ease}
    .age-pill:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 6px 18px rgba(0,0,0,.07)}
    .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
    .step-row{transition:background .18s ease}
    .step-row:hover{background:#fff5f0 !important}
  `;

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{styles}</style>

      {/* NAVBAR */}
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
                { label: "Home",       href: "/auth/dashboard",            active: true,  emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", active: false, emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    active: false, emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className={`nav-link ${l.active ? "active" : ""} ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all`}
                  style={{ color: l.active ? "#e8703a" : "#a8a29e", background: l.active ? "rgba(251,146,60,.08)" : "transparent" }}>
                  <span className="text-sm">{l.emoji}</span>{l.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link href="/admin/users" className="nav-link ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest" style={{ color: "#a8a29e" }}>
                  <span>⚙️</span>Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
            
              <Link href="/user/profile"
                className="w-9 h-9 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all hover:scale-105"
                style={{ borderColor: "#fcd9b6", boxShadow: "0 2px 12px rgba(251,146,60,.2)" }}>
                {user?.image
                  ? <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fda4af,#fb923c)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>}
              </Link>
              <LogoutButton className="ff-b hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white [background:linear-gradient(135deg,#f87171,#fb923c)]" />
            </div>
          </div>
          <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
            {[
              { label: "Home",       href: "/auth/dashboard",            active: true  },
              { label: "Activities", href: "/auth/dashboard/activities", active: false },
              { label: "Updates",    href: "/auth/dashboard/updates",    active: false },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className="flex-shrink-0 ff-b px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: l.active ? "#e8703a" : "#a8a29e", background: l.active ? "rgba(251,146,60,.08)" : "transparent" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-6 anim-1">
        <div className="relative rounded-3xl overflow-hidden" style={{
          background: "linear-gradient(135deg, #fff9f5 0%, #fef3ec 35%, #fde8f0 65%, #f5eeff 100%)",
          border: "1px solid rgba(253,186,116,.4)", minHeight: 340,
          boxShadow: "0 8px 60px rgba(251,146,60,.08), inset 0 1px 0 rgba(255,255,255,.8)"
        }}>
          {/* Blobs */}
          <div className="blob absolute pointer-events-none" style={{ top: -80, right: "5%", width: 320, height: 320, background: "radial-gradient(circle at 40% 40%, rgba(253,164,175,.4), rgba(251,146,60,.2))", filter: "blur(60px)", opacity: 0.7 }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -60, left: "8%", width: 260, height: 260, background: "radial-gradient(circle at 60% 60%, rgba(196,181,253,.5), rgba(129,140,248,.2))", filter: "blur(50px)", opacity: 0.5, animationDelay: "3s" }} />
          <div className="blob absolute pointer-events-none" style={{ top: "30%", left: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(110,231,183,.4), transparent)", filter: "blur(40px)", opacity: 0.5, animationDelay: "6s" }} />
          {/* Spinning ring */}
          <div className="spin-slow absolute pointer-events-none" style={{ top: -60, right: "20%", width: 280, height: 280, borderRadius: "50%", border: "2px dashed rgba(251,146,60,.15)" }} />
          <div className="spin-slow absolute pointer-events-none" style={{ top: -40, right: "18%", width: 330, height: 330, borderRadius: "50%", border: "1px solid rgba(248,113,113,.08)", animationDirection: "reverse", animationDuration: "45s" }} />
          {/* Floating emojis */}
          <div className="float-a absolute pointer-events-none text-4xl select-none" style={{ top: "12%", right: "38%", opacity: 0.18 }}>🎨</div>
          <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ top: "65%", right: "6%", opacity: 0.13 }}>⭐</div>
          <div className="float-c absolute pointer-events-none text-2xl select-none" style={{ bottom: "18%", left: "44%", opacity: 0.18 }}>✏️</div>
          <div className="float-d absolute pointer-events-none text-3xl select-none" style={{ top: "8%", left: "40%", opacity: 0.13 }}>🌈</div>
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(251,146,60,.12) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />
          {/* Diagonal stripes */}
          <div className="absolute pointer-events-none" style={{ top: 0, right: 0, width: "40%", height: "100%", background: "repeating-linear-gradient(-45deg, rgba(251,146,60,.03) 0px, rgba(251,146,60,.03) 1px, transparent 1px, transparent 12px)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14 space-y-6">
              <div className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full ff-b"
                style={{ background: "rgba(255,255,255,.75)", border: "1px solid rgba(251,146,60,.25)", backdropFilter: "blur(10px)", boxShadow: "0 2px 14px rgba(251,146,60,.1)" }}>
                <span className="text-base">👋</span>
                <span className="text-xs font-medium" style={{ color: "#78716c" }}>
                  {greeting}, <strong style={{ color: "#e8703a" }}>{firstName}</strong>!
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="ff-d font-bold leading-tight" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
                  Welcome to Our<br /><span className="shimmer-text">Learning Platform!</span>
                </h1>
                <p className="ff-b text-sm leading-relaxed" style={{ color: "#78716c", maxWidth: 340 }}>
                  Discover beautifully designed educational activities for curious young minds. Every activity is a new adventure.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/auth/dashboard/activities"
                  className="lift inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 ff-b text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 6px 24px rgba(248,113,113,.28)" }}>
                  🎨 Browse Activities
                </Link>
                <Link href="/auth/dashboard/progress"
                  className="lift inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 ff-b text-xs font-bold uppercase tracking-widest"
                  style={{ background: "rgba(255,255,255,.7)", color: "#78716c", border: "1px solid rgba(253,186,116,.4)", backdropFilter: "blur(8px)" }}>
                  📊 My Progress
                </Link>
              </div>
              {/* Mini stat pills */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { n: totalDone, label: "completed", color: "#f87171", bg: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.2)" },
                  { n: favCount,  label: "favourites", color: "#a78bfa", bg: "rgba(167,139,250,.1)", border: "rgba(167,139,250,.2)" },
                  { n: weekCount, label: "this week",  color: "#34d399", bg: "rgba(52,211,153,.1)",  border: "rgba(52,211,153,.2)"  },
                ].map((s) => (
                  <div key={s.label} className="ff-b flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                    <span className="font-bold text-sm">{s.n === null ? "—" : s.n}</span>
                    <span style={{ opacity: .8 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:flex items-end justify-center pt-6 pr-6">
              <div className="float-a relative z-10">
                <img src="/images/hero.png" alt="Learning" style={{ height: 310, objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(251,146,60,.22))" }} />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(251,146,60,.2), transparent)", filter: "blur(12px)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 anim-2">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: totalDone, label: "Completed",  icon: "🎯", from: "#fff9f5", to: "#ffe4d6", border: "rgba(253,186,116,.5)", num: "#e8703a", glow: "rgba(248,113,113,.12)" },
            { value: weekCount, label: "This Week",  icon: "📅", from: "#f0fdf4", to: "#dcfce7", border: "rgba(134,239,172,.5)", num: "#16a34a", glow: "rgba(52,211,153,.12)"  },
            { value: favCount,  label: "Favourites", icon: "⭐", from: "#fdf4ff", to: "#ede9fe", border: "rgba(196,181,253,.5)", num: "#7c3aed", glow: "rgba(167,139,250,.12)" },
          ].map((s) => (
            <div key={s.label} className="lift relative rounded-3xl p-5 sm:p-6 text-center overflow-hidden"
              style={{ background: `linear-gradient(135deg,${s.from},${s.to})`, border: `1px solid ${s.border}`, boxShadow: `0 4px 24px ${s.glow}` }}>
              <div className="absolute -bottom-2 -right-2 text-6xl select-none pointer-events-none" style={{ opacity: 0.1 }}>{s.icon}</div>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="ff-d font-bold" style={{ fontSize: 36, color: s.num, lineHeight: 1 }}>
                {s.value === null ? <span style={{ color: "#d1ccc8", fontSize: 24 }}>—</span> : s.value}
              </p>
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: "#a8a29e" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AGE FILTER */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 anim-2">
        <div className="rounded-3xl p-6" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 2px 20px rgba(0,0,0,.03)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔍</span>
            <p className="ff-b text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Browse by Age Group</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "Age 2–3", bg: "#fff9f5", text: "#e8703a", border: "#fdd9b4", emoji: "👶" },
              { label: "Age 3–4", bg: "#f0fdf9", text: "#0f766e", border: "#99f6e4", emoji: "🐣" },
              { label: "Age 4+",  bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff", emoji: "🌱" },
              { label: "Age 5–6", bg: "#fefce8", text: "#ca8a04", border: "#fef08a", emoji: "🌟" },
              { label: "Age 6–9", bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe", emoji: "🚀" },
              { label: "Other",   bg: "#fafaf9", text: "#78716c", border: "#e7e5e4", emoji: "✨" },
            ].map(({ label, bg, text, border, emoji }) => (
              <Link key={label} href={`/auth/dashboard/activities?age=${encodeURIComponent(label)}`}
                className="age-pill ff-b px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2"
                style={{ background: bg, color: text, border: `1.5px solid ${border}` }}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 anim-3">
        <div className="flex items-center gap-2 mb-3">
          <span>⚡</span>
          <p className="ff-b text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Quick Access</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: "🎨", label: "Activities",  sub: "Browse all activities",     href: "/auth/dashboard/activities", from: "#fff9f5", to: "#fde8d8", border: "#fdd9b4", accent: "#e8703a", glow: "rgba(248,113,113,.1)"  },
            { emoji: "📊", label: "My Progress", sub: "View your learning report", href: "/auth/dashboard/progress",   from: "#f0fdf9", to: "#d1fae5", border: "#99f6e4", accent: "#0f766e", glow: "rgba(52,211,153,.1)"   },
            { emoji: "⭐", label: "Favourites",  sub: "Your saved activities",     href: "/auth/dashboard/favourites", from: "#fdf4ff", to: "#f3e8ff", border: "#e9d5ff", accent: "#9333ea", glow: "rgba(167,139,250,.1)"  },
          ].map((c) => (
            <Link key={c.label} href={c.href}
              className="lift relative flex items-center gap-4 rounded-3xl p-5 overflow-hidden"
              style={{ background: `linear-gradient(135deg,${c.from},${c.to})`, border: `1px solid ${c.border}`, boxShadow: `0 4px 20px ${c.glow}` }}>
              <div className="absolute -right-2 -bottom-3 text-7xl select-none pointer-events-none float-b" style={{ opacity: 0.1 }}>{c.emoji}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(255,255,255,.7)", boxShadow: "0 2px 12px rgba(0,0,0,.06)", backdropFilter: "blur(4px)" }}>{c.emoji}</div>
              <div className="flex-1 relative z-10">
                <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>{c.label}</p>
                <p className="ff-b text-xs mt-0.5" style={{ color: "#a8a29e" }}>{c.sub}</p>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: `${c.accent}18`, color: c.accent }}>→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 anim-3">
        <div className="rounded-3xl overflow-hidden" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 40px rgba(0,0,0,.04)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-[340px] overflow-hidden">
              <img src="/images/craft-circle.png" alt="Craft" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(255,249,245,.2) 0%,transparent 50%,white 100%)" }} />
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(253,164,175,.35),transparent)", filter: "blur(20px)" }} />
              <div className="absolute bottom-5 left-5 float-a">
                <div className="ff-b px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,.92)", color: "#1c1917", border: "1px solid #f0ebe4", backdropFilter: "blur(10px)", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }}>
                  🎨 Get Creative!
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 space-y-5">
              <div className="flex items-center gap-2">
                <span>🗺️</span>
                <p className="ff-b text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>How It Works</p>
              </div>
              <h2 className="ff-d font-bold text-2xl" style={{ color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.02em" }}>Three Simple Steps</h2>
              <div className="space-y-3">
                {[
                  { n: "01", label: "Choose an Activity",    sub: "Browse by age, subject or interest",  dot: "linear-gradient(135deg,#f87171,#fb923c)", emoji: "🎯" },
                  { n: "02", label: "Gather Your Materials", sub: "Check what you need before starting", dot: "linear-gradient(135deg,#34d399,#059669)", emoji: "🛒" },
                  { n: "03", label: "Start Creating",        sub: "Follow step-by-step instructions",    dot: "linear-gradient(135deg,#a78bfa,#7c3aed)", emoji: "🚀" },
                ].map(({ n, label, sub, dot, emoji }) => (
                  <div key={n} className="step-row lift flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#faf8f5", border: "1px solid #f0ebe4" }}>
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                      style={{ background: dot, boxShadow: "0 4px 12px rgba(0,0,0,.12)" }}>{emoji}</div>
                    <div className="flex-1">
                      <p className="ff-d text-sm font-bold" style={{ color: "#1c1917" }}>{label}</p>
                      <p className="ff-b text-xs mt-0.5" style={{ color: "#a8a29e" }}>{sub}</p>
                    </div>
                    <span className="ff-b text-xs font-bold" style={{ color: "#d1ccc8" }}>{n}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/dashboard/activities"
                className="lift self-start inline-flex items-center gap-2 rounded-2xl px-6 py-3 ff-b text-xs font-bold uppercase tracking-widest text-white"
                style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 16px rgba(248,113,113,.25)" }}>
                🎨 Explore Activities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-12 anim-4">
        <div className="flex items-end justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Curated For You</p>
              <h2 className="ff-d font-bold text-2xl" style={{ color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.02em" }}>Recommended Activities</h2>
            </div>
          </div>
          <Link href="/auth/dashboard/activities" className="ff-b text-xs font-semibold uppercase tracking-widest hover:underline" style={{ color: "#e8703a" }}>Show All →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: 1, title: "Rainbow Art",          category: "Art",     age: "Age 3–6",  badge: "#fff9f5", badgeText: "#e8703a", glow: "rgba(248,113,113,.07)" },
            { i: 2, title: "Counting Caterpillar", category: "Math",    age: "Age 4–7",  badge: "#f0fdf9", badgeText: "#0f766e", glow: "rgba(52,211,153,.07)"  },
            { i: 3, title: "Story Time Fun",       category: "Reading", age: "Age 5–8",  badge: "#fdf4ff", badgeText: "#be185d", glow: "rgba(190,24,93,.07)"   },
            { i: 4, title: "Build a Robot",        category: "Science", age: "Age 6–10", badge: "#eff6ff", badgeText: "#2563eb", glow: "rgba(37,99,235,.07)"   },
          ].map(({ i, title, category, age, badge, badgeText, glow }) => (
            <div key={i} className="card-hover rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: `0 4px 24px ${glow}` }}>
              <div className="relative w-full overflow-hidden" style={{ paddingTop: "75%", background: "#faf8f5" }}>
                <img src={`/images/activity${i}.png`} alt={title} className="absolute inset-0 w-full h-full object-contain p-4" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent 70%,rgba(250,248,245,.4))" }} />
                <span className="absolute top-3 left-3 ff-b text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl"
                  style={{ background: badge, color: badgeText }}>{category}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="ff-d text-sm font-bold" style={{ color: "#1c1917" }}>{title}</p>
                <p className="ff-b text-[10px] font-semibold uppercase tracking-widest mt-0.5 mb-4" style={{ color: "#c0bab4" }}>{age}</p>
                <Link href={`/auth/dashboard/activities/${i}`}
                  className="lift mt-auto text-center py-2.5 rounded-2xl ff-b text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 3px 12px rgba(248,113,113,.2)" }}>
                  View Activity 🎯
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="anim-5" style={{ background: "#1c1917" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#34d399,#818cf8,#f87171)", backgroundSize: "200% 100%", animation: "shimmer 6s linear infinite" }} />
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff9f5,#fef3ec,#fde8f0)", paddingTop: 40, paddingBottom: 40 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(251,146,60,.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#c0bab4" }}>Kreative Kindle</p>
            <h3 className="ff-d font-bold text-2xl mb-6" style={{ color: "#1c1917", fontStyle: "italic" }}>Built for Curious Minds ✨</h3>
            <div className="flex justify-center flex-wrap gap-3">
              {[
                { label: "Dashboard",  href: "/auth/dashboard",            emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", emoji: "🎨" },
                { label: "Progress",   href: "/auth/dashboard/progress",   emoji: "📊" },
                { label: "Favourites", href: "/auth/dashboard/favourites", emoji: "⭐" },
                { label: "Updates",    href: "/auth/dashboard/updates",    emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className="age-pill ff-b text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-1.5"
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
              <div className="flex gap-2">
                {["📘","📷","💬"].map((icon,i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110" style={{ background: "#292524" }}>{icon}</a>
                ))}
              </div>
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