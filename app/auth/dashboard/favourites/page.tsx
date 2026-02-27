"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../../components/LogoutButton";

interface Favourite {
  _id: string;
  activityId: number;
  activityTitle: string;
  category: string;
  age: string;
  image: string;
  savedAt: string;
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

const API = "http://localhost:3001";

const CAT_META: Record<string, { badge: string; btn: string; bg: string; color: string; glow: string; icon: string }> = {
  Art:     { badge: "bg-[#fde8d8] text-[#b45309]", btn: "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]", bg: "#fff9f5", color: "#e8703a", glow: "rgba(248,113,113,.1)",  icon: "🎨" },
  Math:    { badge: "bg-[#d8ede8] text-[#0f766e]", btn: "bg-[#d8ede8] text-[#0f766e] hover:bg-[#c0e2da]", bg: "#f0fdf9", color: "#0f766e", glow: "rgba(52,211,153,.1)",   icon: "🔢" },
  Reading: { badge: "bg-[#fce4ec] text-[#be185d]", btn: "bg-[#fce4ec] text-[#be185d] hover:bg-[#f9ccda]", bg: "#fdf4ff", color: "#be185d", glow: "rgba(190,24,93,.08)",   icon: "📖" },
  Science: { badge: "bg-[#ede8fd] text-[#6d28d9]", btn: "bg-[#ede8fd] text-[#6d28d9] hover:bg-[#ddd5fa]", bg: "#f5f0ff", color: "#6d28d9", glow: "rgba(109,40,217,.08)", icon: "🔬" },
};

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ff-d { font-family: 'Playfair Display', Georgia, serif; }
  .ff-b { font-family: 'DM Sans', sans-serif; }
  @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  .anim-1{animation:fadeUp .45s .05s ease both}
  .anim-2{animation:fadeUp .45s .12s ease both}
  .anim-3{animation:fadeUp .45s .2s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1.5s ease-in-out infinite}
  .float-c{animation:floatUp 7s 3s ease-in-out infinite}
  .blob{animation:blobMorph 9s ease-in-out infinite}
  .spin-slow{animation:spinSlow 35s linear infinite}
  .heart-pulse{animation:heartbeat 2s ease-in-out infinite}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after{width:100%}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
  .card-hover{transition:transform .22s ease,box-shadow .22s ease}
  .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,.09)}
  .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
  .remove-btn{transition:all .18s ease}
  .remove-btn:hover{transform:scale(1.15);background:rgba(248,113,113,.15) !important}
`;

export default function FavouritesPage() {
  const router = useRouter();
  const [user,       setUser]       = useState<User | null>(null);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState<string | null>(null);
  const [removing,   setRemoving]   = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const token = getCookie("token");
    const u     = getUserFromCookie();
    if (!token) { router.push("/auth/login"); return; }
    setUser(u);
    const fetchFavourites = async () => {
      try {
        const res  = await fetch(`${API}/api/progress/favourites`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setFavourites(data);
      } catch {}
      setLoading(false);
    };
    fetchFavourites();
  }, []);

  const removeFavourite = async (activityId: number) => {
    const token = getCookie("token");
    if (!token) return;
    setRemoving(activityId);
    try {
      await fetch(`${API}/api/progress/favourites/${activityId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setFavourites(prev => prev.filter(f => f.activityId !== activityId));
      showToast("Removed from favourites");
    } catch { showToast("Something went wrong"); }
    setRemoving(null);
  };

  const firstName = user?.username?.split(" ")[0] || "Your";

  // count by category
  const catCounts = favourites.reduce<Record<string, number>>((acc, f) => {
    acc[f.category] = (acc[f.category] ?? 0) + 1; return acc;
  }, {});

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
                { label: "Home",       href: "/auth/dashboard",            emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className="nav-link ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
                  style={{ color: "#a8a29e" }}>
                  <span className="text-sm">{l.emoji}</span>{l.label}
                </Link>
              ))}
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
          <div className="blob absolute pointer-events-none" style={{ top: -50, right: "10%", width: 220, height: 220, background: "radial-gradient(circle,rgba(253,164,175,.45),rgba(251,146,60,.15))", filter: "blur(50px)" }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -40, left: "8%", width: 200, height: 200, background: "radial-gradient(circle,rgba(196,181,253,.4),transparent)", filter: "blur(40px)", animationDelay: "4s" }} />
          <div className="blob absolute pointer-events-none" style={{ top: "20%", left: "40%", width: 160, height: 160, background: "radial-gradient(circle,rgba(110,231,183,.3),transparent)", filter: "blur(35px)", animationDelay: "7s" }} />
          {/* spinning ring */}
          <div className="spin-slow absolute pointer-events-none" style={{ top: -40, right: "22%", width: 200, height: 200, borderRadius: "50%", border: "2px dashed rgba(248,113,113,.12)" }} />
          {/* dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.12) 1px,transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />
          {/* floating emojis */}
          <div className="float-a heart-pulse absolute pointer-events-none text-4xl select-none" style={{ top: "12%", right: "35%", opacity: 0.15 }}>⭐</div>
          <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ bottom: "12%", right: "8%", opacity: 0.12 }}>🎨</div>
          <div className="float-c absolute pointer-events-none text-2xl select-none" style={{ top: "20%", left: "12%", opacity: 0.1 }}>✨</div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ff-b"
              style={{ background: "rgba(255,255,255,.75)", border: "1px solid rgba(248,113,113,.25)", backdropFilter: "blur(10px)" }}>
              <span>⭐</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#78716c" }}>Saved</span>
            </div>
            <h1 className="ff-d font-bold leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
              <span className="shimmer-text">{firstName}'s</span> Favourites
            </h1>
            <p className="ff-b text-sm mt-2" style={{ color: "#78716c" }}>
              {loading ? "Loading your saved activities..." : favourites.length === 0
                ? "Save activities you love for quick access!"
                : `${favourites.length} ${favourites.length === 1 ? "activity" : "activities"} saved — great taste! ⭐`}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {loading ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 animate-pulse">⭐</div>
            <p className="ff-b text-xs font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Loading your favourites...</p>
          </div>

        ) : favourites.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="anim-2 text-center py-16 max-w-sm mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="blob w-full h-full" style={{ background: "linear-gradient(135deg,#fde8d8,#fce4ec)", opacity: 0.6 }} />
              <div className="absolute inset-0 flex items-center justify-center text-5xl heart-pulse">⭐</div>
            </div>
            <p className="ff-d font-bold text-2xl mb-2" style={{ color: "#1c1917", fontStyle: "italic" }}>No favourites yet</p>
            <p className="ff-b text-sm mb-8" style={{ color: "#a8a29e" }}>
              Tap the ♡ button on any activity page to save it here for quick access.
            </p>
            <Link href="/auth/dashboard/activities"
              className="lift inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 ff-b text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 6px 24px rgba(248,113,113,.28)" }}>
              🎨 Browse Activities →
            </Link>
          </div>

        ) : (
          <>
            {/* ── CATEGORY SUMMARY PILLS ── */}
            {Object.keys(catCounts).length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8 anim-2">
                <div className="ff-b flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold"
                  style={{ background: "white", border: "1px solid #f0ebe4", color: "#a8a29e" }}>
                  ✨ All <span style={{ color: "#1c1917" }}>{favourites.length}</span>
                </div>
                {Object.entries(catCounts).map(([cat, count]) => {
                  const m = CAT_META[cat];
                  return (
                    <div key={cat} className="ff-b flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold"
                      style={{ background: m?.bg ?? "#faf8f5", border: `1px solid ${m?.color ?? "#e5e5e5"}25`, color: m?.color ?? "#78716c" }}>
                      <span>{m?.icon}</span>{cat} <span style={{ opacity: 0.7 }}>× {count}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── GRID ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 anim-3">
              {favourites.map((fav) => {
                const m = CAT_META[fav.category] ?? CAT_META.Art;
                return (
                  <div key={fav._id} className="card-hover rounded-3xl overflow-hidden flex flex-col"
                    style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: `0 4px 24px ${m.glow}` }}>

                    {/* Image */}
                    <div className="relative w-full overflow-hidden" style={{ paddingTop: "78%", background: m.bg }}>
                      <img src={fav.image} alt={fav.activityTitle}
                        className="absolute inset-0 w-full h-full object-contain p-4" />
                      {/* gradient fade bottom */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom,transparent 55%,rgba(250,248,245,.45))" }} />
                      {/* category badge */}
                      <span className={`absolute top-3 left-3 ff-b text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl ${m.badge}`}>
                        {fav.category}
                      </span>
                      {/* age badge */}
                      <span className="absolute top-3 right-10 ff-b text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-xl"
                        style={{ background: "rgba(255,255,255,.85)", color: "#a8a29e", backdropFilter: "blur(4px)" }}>
                        {fav.age}
                      </span>
                      {/* remove button */}
                      <button onClick={() => removeFavourite(fav.activityId)} title="Remove from favourites"
                        disabled={removing === fav.activityId}
                        className="remove-btn absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center text-sm"
                        style={{ background: "rgba(255,255,255,.85)", color: "#f87171", backdropFilter: "blur(4px)", border: "1px solid rgba(248,113,113,.2)" }}>
                        {removing === fav.activityId ? "⏳" : "♥"}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="ff-d text-sm font-bold mb-0.5" style={{ color: "#1c1917" }}>{fav.activityTitle}</p>
                      <p className="ff-b text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: "#c0bab4" }}>{fav.age}</p>
                      <Link href={`/auth/dashboard/activities/${fav.activityId}`}
                        className={`lift mt-auto text-center py-2.5 ff-b text-[10px] font-bold rounded-2xl uppercase tracking-widest ${m.btn}`}>
                        View Activity 🎯
                      </Link>
                    </div>
                  </div>
                );
              })}
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