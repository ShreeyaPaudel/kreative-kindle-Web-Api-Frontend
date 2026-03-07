"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../../components/LogoutButton";

interface CompletedActivity {
  _id: string;
  activityId: number;
  activityTitle: string;
  category: string;
  completedAt: string;
}

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

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
function isThisWeek(d: string) { return Date.now() - new Date(d).getTime() < 7 * 24 * 60 * 60 * 1000; }

const API = "http://localhost:3001";
const TOTAL_ACTIVITIES = 9; // total in the app

const CAT_META: Record<string, { icon: string; color: string; track: string; from: string; to: string; bg: string; badge: string }> = {
  Art:     { icon: "🎨", color: "#e8703a", track: "#fde8d8", from: "#f87171", to: "#fb923c", bg: "#fff9f5", badge: "bg-[#fde8d8] text-[#b45309]" },
  Math:    { icon: "🔢", color: "#0f766e", track: "#d8ede8", from: "#34d399", to: "#0f766e", bg: "#f0fdf9", badge: "bg-[#d8ede8] text-[#0f766e]"  },
  Reading: { icon: "📖", color: "#be185d", track: "#fce4ec", from: "#f472b6", to: "#be185d", bg: "#fdf4ff", badge: "bg-[#fce4ec] text-[#be185d]"  },
  Science: { icon: "🔬", color: "#6d28d9", track: "#ede8fd", from: "#a78bfa", to: "#6d28d9", bg: "#f5f0ff", badge: "bg-[#ede8fd] text-[#6d28d9]"  },
};

// Activities per category in the app
const CAT_TOTALS: Record<string, number> = { Art: 3, Math: 2, Reading: 2, Science: 2 };

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ff-d { font-family: 'Playfair Display', Georgia, serif; }
  .ff-b { font-family: 'DM Sans', sans-serif; }
  @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-dash { to { stroke-dashoffset: 0; } }
  .anim-1{animation:fadeUp .45s .05s ease both}
  .anim-2{animation:fadeUp .45s .12s ease both}
  .anim-3{animation:fadeUp .45s .2s ease both}
  .anim-4{animation:fadeUp .45s .28s ease both}
  .anim-5{animation:fadeUp .45s .36s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1.5s ease-in-out infinite}
  .blob{animation:blobMorph 9s ease-in-out infinite}
  .spin-slow{animation:spinSlow 35s linear infinite}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after,.nav-link.active::after{width:100%}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
  .card-in{transition:transform .2s ease,box-shadow .2s ease,background .18s ease}
  .card-in:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06);background:#fff5f0 !important}
  .ring-anim { transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }
  .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
`;

// SVG Donut Ring component
function DonutRing({ pct, meta, done, total }: { pct: number; meta: typeof CAT_META[string]; done: number; total: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="lift flex flex-col items-center gap-3 p-6 rounded-3xl relative overflow-hidden"
      style={{ background: meta.bg, border: `1.5px solid ${meta.color}20`, boxShadow: `0 4px 24px ${meta.color}12` }}>
      {/* watermark */}
      <div className="absolute -bottom-2 -right-2 text-6xl select-none pointer-events-none" style={{ opacity: 0.07 }}>{meta.icon}</div>

      {/* SVG ring */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* track */}
          <circle cx="60" cy="60" r={r} fill="none" stroke={meta.track} strokeWidth="12" />
          {/* progress */}
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={`url(#grad-${meta.color.replace("#","")})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={done === 0 ? circ : offset}
            className="ring-anim"
          />
          <defs>
            <linearGradient id={`grad-${meta.color.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={meta.from} />
              <stop offset="100%" stopColor={meta.to} />
            </linearGradient>
          </defs>
        </svg>
        {/* centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="ff-d font-bold" style={{ fontSize: 26, color: meta.color, lineHeight: 1 }}>{done}</span>
          <span className="ff-b text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: `${meta.color}99` }}>/ {total}</span>
        </div>
      </div>

      <div className="text-center relative z-10">
        <p className="text-2xl mb-1">{meta.icon}</p>
        <p className="ff-d font-bold text-sm" style={{ color: "#1c1917", fontStyle: "italic" }}>
          {Object.keys(CAT_META).find(k => CAT_META[k] === meta)}
        </p>
        <p className="ff-b text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: meta.color }}>
          {pct}% done
        </p>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const router = useRouter();
  const [user,       setUser]       = useState<User | null>(null);
  const [activities, setActivities] = useState<CompletedActivity[]>([]);
  const [favCount,   setFavCount]   = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const token = getCookie("token");
    const u     = getUserFromCookie();
    if (!token) { router.push("/auth/login"); return; }
    setUser(u);
    const fetchData = async () => {
      try {
        const [progRes, favRes] = await Promise.all([
          fetch(`${API}/api/progress`,            { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/progress/favourites`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const prog = await progRes.json();
        const favs = await favRes.json();
        setActivities(prog.activities ?? []);
        setFavCount(favs.length ?? 0);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const undoComplete = async (activityId: number) => {
    const token = getCookie("token");
    if (!token) return;
    try {
      await fetch(`${API}/api/progress/complete/${activityId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setActivities(prev => prev.filter(a => a.activityId !== activityId));
      showToast("Completion removed");
    } catch { showToast("Something went wrong"); }
  };

  const thisWeekCount = activities.filter(a => isThisWeek(a.completedAt)).length;
  const catCounts     = activities.reduce<Record<string, number>>((acc, a) => { acc[a.category] = (acc[a.category] ?? 0) + 1; return acc; }, {});
  const firstName     = user?.username?.split(" ")[0] || "Your";

  const stats = [
    { value: activities.length, label: "Completed",  icon: "🎯", from: "#fff9f5", to: "#fde8d8", border: "rgba(253,186,116,.5)", num: "#e8703a", glow: "rgba(248,113,113,.1)"  },
    { value: thisWeekCount,     label: "This Week",  icon: "📅", from: "#f0fdf4", to: "#dcfce7", border: "rgba(134,239,172,.5)", num: "#16a34a", glow: "rgba(52,211,153,.1)"   },
    { value: favCount,          label: "Favourites", icon: "⭐", from: "#fdf4ff", to: "#ede9fe", border: "rgba(196,181,253,.5)", num: "#7c3aed", glow: "rgba(167,139,250,.1)"  },
    { value: Object.keys(catCounts).length, label: "Categories", icon: "🗂️", from: "#eff6ff", to: "#dbeafe", border: "rgba(147,197,253,.5)", num: "#2563eb", glow: "rgba(37,99,235,.08)" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{pageStyles}</style>

      {/* TOAST */}
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
                { label: "Home",       href: "/auth/dashboard",            active: false, emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", active: false, emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    active: false, emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className={`nav-link ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all`}
                  style={{ color: "#a8a29e" }}>
                  <span className="text-sm">{l.emoji}</span>{l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all hover:scale-105"
                style={{ background: "rgba(251,146,60,.08)", border: "1px solid rgba(251,146,60,.15)" }}>
                <span className="text-sm">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f87171", border: "1.5px solid white" }} />
              </button>
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
            {["Home","Activities","Updates"].map((l, i) => (
              <Link key={l} href={["/auth/dashboard","/auth/dashboard/activities","/auth/dashboard/updates"][i]}
                className="flex-shrink-0 ff-b px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#a8a29e" }}>{l}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ HERO BANNER ═══ */}
      <section className="anim-1">
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg,#fff9f5 0%,#fef3ec 35%,#fde8f0 65%,#f5eeff 100%)",
          borderBottom: "1px solid rgba(253,186,116,.3)", minHeight: 220,
        }}>
          {/* blobs */}
          <div className="blob absolute pointer-events-none" style={{ top: -50, right: "8%", width: 240, height: 240, background: "radial-gradient(circle,rgba(253,164,175,.4),rgba(251,146,60,.15))", filter: "blur(50px)" }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -40, left: "5%", width: 200, height: 200, background: "radial-gradient(circle,rgba(196,181,253,.4),transparent)", filter: "blur(40px)", animationDelay: "4s" }} />
          {/* spinning ring */}
          <div className="spin-slow absolute pointer-events-none" style={{ top: -50, right: "25%", width: 220, height: 220, borderRadius: "50%", border: "2px dashed rgba(251,146,60,.12)" }} />
          {/* dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.12) 1px,transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />
          {/* floating emojis */}
          <div className="float-a absolute pointer-events-none text-4xl select-none" style={{ top: "15%", right: "38%", opacity: 0.13 }}>📊</div>
          <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ bottom: "10%", right: "10%", opacity: 0.11 }}>🎯</div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ff-b"
              style={{ background: "rgba(255,255,255,.75)", border: "1px solid rgba(251,146,60,.25)", backdropFilter: "blur(10px)" }}>
              <span>📊</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#78716c" }}>Track</span>
            </div>
            <h1 className="ff-d font-bold leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
              <span className="shimmer-text">{firstName}'s</span> Progress
            </h1>
            <p className="ff-b text-sm mt-2" style={{ color: "#78716c" }}>
              {loading ? "Loading your stats..." : activities.length === 0
                ? "Start completing activities to track your journey!"
                : `${activities.length} ${activities.length === 1 ? "activity" : "activities"} completed so far — keep it up! 🌟`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {loading ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 animate-pulse">📊</div>
            <p className="ff-b text-xs font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Loading your progress...</p>
          </div>
        ) : (
          <>
            {/* ═══ STAT CARDS ═══ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 anim-2">
              {stats.map((s) => (
                <div key={s.label} className="lift relative rounded-3xl p-5 text-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${s.from},${s.to})`, border: `1px solid ${s.border}`, boxShadow: `0 4px 24px ${s.glow}` }}>
                  <div className="absolute -bottom-2 -right-2 text-5xl select-none pointer-events-none" style={{ opacity: 0.1 }}>{s.icon}</div>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="ff-d font-bold" style={{ fontSize: 34, color: s.num, lineHeight: 1 }}>{s.value}</p>
                  <p className="ff-b text-[9px] font-bold uppercase tracking-widest mt-1.5" style={{ color: "#a8a29e" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* ═══ DONUT RINGS ═══ */}
            <div className="rounded-3xl p-6 sm:p-8 mb-6 anim-3"
              style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 32px rgba(0,0,0,.04)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 12px rgba(248,113,113,.25)" }}>🍩</div>
                <div>
                  <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Visual breakdown</p>
                  <p className="ff-d font-bold text-lg" style={{ color: "#1c1917", fontStyle: "italic" }}>Progress by Category</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(CAT_META).map(([cat, meta]) => {
                  const done  = catCounts[cat] ?? 0;
                  const total = CAT_TOTALS[cat] ?? 1;
                  const pct   = Math.round((done / total) * 100);
                  return <DonutRing key={cat} pct={pct} meta={meta} done={done} total={total} />;
                })}
              </div>
              {/* overall progress bar */}
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid #f0ebe4" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="ff-b text-xs font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Overall completion</p>
                  <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>{activities.length} / {TOTAL_ACTIVITIES} activities</p>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#f0ebe4" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.round((activities.length / TOTAL_ACTIVITIES) * 100)}%`,
                      background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24)",
                      boxShadow: "0 2px 8px rgba(251,146,60,.3)",
                    }} />
                </div>
                <p className="ff-b text-[10px] mt-1.5 text-right font-semibold" style={{ color: "#c0bab4" }}>
                  {Math.round((activities.length / TOTAL_ACTIVITIES) * 100)}% of all activities completed
                </p>
              </div>
            </div>

            {/* ═══ COMPLETED LIST ═══ */}
            <div className="rounded-3xl p-6 sm:p-7 anim-4"
              style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 32px rgba(0,0,0,.04)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: "#f0fdf9", border: "1px solid #99f6e4" }}>✅</div>
                <div>
                  <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>History</p>
                  <p className="ff-d font-bold text-lg" style={{ color: "#1c1917", fontStyle: "italic" }}>Completed Activities</p>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-14">
                  <div className="text-5xl mb-4">🎯</div>
                  <p className="ff-d font-bold text-lg" style={{ color: "#1c1917", fontStyle: "italic" }}>Nothing completed yet</p>
                  <p className="ff-b text-xs mt-1 mb-6" style={{ color: "#a8a29e" }}>Complete your first activity to start tracking!</p>
                  <Link href="/auth/dashboard/activities"
                    className="lift inline-flex items-center gap-2 rounded-2xl px-6 py-3 ff-b text-xs font-bold uppercase tracking-widest text-white"
                    style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 16px rgba(248,113,113,.25)" }}>
                    🎨 Browse Activities →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((a) => {
                    const meta = CAT_META[a.category];
                    return (
                      <div key={a._id} className="card-in flex items-center gap-4 p-4 rounded-2xl"
                        style={{ background: "#faf8f5", border: "1px solid #f0ebe4" }}>
                        {/* icon */}
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: meta?.bg ?? "#faf8f5", border: `1px solid ${meta?.color ?? "#e5e5e5"}20` }}>
                          {meta?.icon ?? "📌"}
                        </div>
                        {/* info */}
                        <div className="flex-1 min-w-0">
                          <p className="ff-d text-sm font-bold truncate" style={{ color: "#1c1917" }}>{a.activityTitle}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`ff-b text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg ${meta?.badge ?? "bg-gray-100 text-gray-500"}`}>
                              {a.category}
                            </span>
                            <span className="ff-b text-[10px]" style={{ color: "#c0bab4" }}>{timeAgo(a.completedAt)}</span>
                          </div>
                        </div>
                        {/* actions */}
                        <Link href={`/auth/dashboard/activities/${a.activityId}`}
                          className="ff-b flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                          style={{ background: meta?.bg ?? "#faf8f5", color: meta?.color ?? "#78716c" }}>
                          View →
                        </Link>
                        <button onClick={() => undoComplete(a.activityId)} title="Undo"
                          className="ff-b flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                          style={{ background: "rgba(248,113,113,.08)", color: "#f87171" }}>
                          Undo
                        </button>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                          style={{ background: "#dcfce7", color: "#16a34a" }}>✓</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-10" style={{ background: "#1c1917" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#34d399,#818cf8,#f87171)", backgroundSize: "200% 100%", animation: "shimmer 6s linear infinite" }} />
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff9f5,#fef3ec,#fde8f0)", paddingTop: 40, paddingBottom: 40 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.15) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
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
              <div className="flex gap-2">
                {["📘","📷","💬"].map((icon, i) => (
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