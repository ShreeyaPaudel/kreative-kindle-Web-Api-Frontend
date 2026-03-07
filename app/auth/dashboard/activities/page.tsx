"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../../../components/LogoutButton";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function getUserFromCookie() {
  const raw = getCookie("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

const ACTIVITIES = [
  { id: 1, title: "Rainbow Art",          category: "Art",     age: "Age 3–6",  image: "/images/rainbowart.png",           desc: "Create a colourful rainbow using paint and sponges."      },
  { id: 2, title: "Counting Caterpillar", category: "Math",    age: "Age 4–7",  image: "/images/countingcatterpillar.png", desc: "Build a caterpillar and practice counting with beads."    },
  { id: 3, title: "Story Time Fun",       category: "Reading", age: "Age 5–8",  image: "/images/storytime.png",            desc: "Read along and answer fun questions about the story."     },
  { id: 4, title: "Build a Robot",        category: "Science", age: "Age 6–10", image: "/images/buildarobot.png",          desc: "Use recycled materials to build your very own robot."     },
  { id: 5, title: "Nature Collage",       category: "Art",     age: "Age 3–6",  image: "/images/naturecollage.png",        desc: "Collect leaves and flowers to make a beautiful collage."  },
  { id: 6, title: "DIY Volcano",          category: "Science", age: "Age 5–9",  image: "/images/diyvolcano.png",           desc: "Make a baking soda volcano and watch it erupt!"           },
  { id: 7, title: "Shape Painting",       category: "Art",     age: "Age 2–5",  image: "/images/shapepainting.png",        desc: "Explore shapes by stamping objects dipped in paint."      },
  { id: 8, title: "Number Puzzles",       category: "Math",    age: "Age 4–7",  image: "/images/numberpuzzle.png",         desc: "Match quantities to numerals with colourful cards."       },
  { id: 9, title: "Alphabet Hunt",        category: "Reading", age: "Age 3–6",  image: "/images/alphabethunt.png",         desc: "Search for objects that start with each letter."          },
];

const CATEGORIES = ["All", "Art", "Math", "Reading", "Science"];
const AGE_GROUPS = ["All Ages", "Age 2–5", "Age 3–6", "Age 4–7", "Age 5–9", "Age 6–10"];

const CAT_STYLES: Record<string, { badge: string; btn: string; pill: string; active: string; glow: string }> = {
  Art:     { badge: "bg-[#fde8d8] text-[#b45309]", btn: "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]", pill: "hover:bg-[#fdf0e4] hover:text-[#b45309] hover:border-[#f9d5b5]", active: "bg-[#f9d5b5] text-[#b45309] border-[#f9d5b5]", glow: "rgba(249,213,181,.35)" },
  Math:    { badge: "bg-[#d8ede8] text-[#0f766e]", btn: "bg-[#d8ede8] text-[#0f766e] hover:bg-[#c0e2da]", pill: "hover:bg-[#e6f5f2] hover:text-[#0f766e] hover:border-[#b2d9cf]", active: "bg-[#b2d9cf] text-[#0f766e] border-[#b2d9cf]", glow: "rgba(178,217,207,.35)" },
  Reading: { badge: "bg-[#fce4ec] text-[#be185d]", btn: "bg-[#fce4ec] text-[#be185d] hover:bg-[#f9ccda]", pill: "hover:bg-[#fdf0f5] hover:text-[#be185d] hover:border-[#f9ccda]", active: "bg-[#f9ccda] text-[#be185d] border-[#f9ccda]", glow: "rgba(249,204,218,.35)" },
  Science: { badge: "bg-[#ede8fd] text-[#6d28d9]", btn: "bg-[#ede8fd] text-[#6d28d9] hover:bg-[#ddd5fa]", pill: "hover:bg-[#f3f0fd] hover:text-[#6d28d9] hover:border-[#ddd5fa]", active: "bg-[#ddd5fa] text-[#6d28d9] border-[#ddd5fa]", glow: "rgba(221,213,250,.35)" },
};

const AGE_COLORS = [
  { age: "All Ages", bg: "#faf8f5", text: "#a8a29e", border: "#e7e5e4", activeBg: "#1c1917", activeText: "#fff" },
  { age: "Age 2–5",  bg: "#fff9f5", text: "#e8703a", border: "#fdd9b4", activeBg: "#fb923c", activeText: "#fff" },
  { age: "Age 3–6",  bg: "#f0fdf9", text: "#0f766e", border: "#99f6e4", activeBg: "#0f766e", activeText: "#fff" },
  { age: "Age 4–7",  bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff", activeBg: "#9333ea", activeText: "#fff" },
  { age: "Age 5–9",  bg: "#fefce8", text: "#ca8a04", border: "#fef08a", activeBg: "#ca8a04", activeText: "#fff" },
  { age: "Age 6–10", bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe", activeBg: "#2563eb", activeText: "#fff" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ff-d { font-family: 'Playfair Display', Georgia, serif; }
  .ff-b { font-family: 'DM Sans', sans-serif; }
  @keyframes floatUp   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes floatSide { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(8px) rotate(3deg)} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  .anim-1{animation:fadeUp .45s .05s ease both}
  .anim-2{animation:fadeUp .45s .15s ease both}
  .anim-3{animation:fadeUp .45s .25s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1s ease-in-out infinite}
  .float-c{animation:floatSide 7s 2s ease-in-out infinite}
  .float-d{animation:floatUp 9s 3s ease-in-out infinite}
  .spin-slow{animation:spinSlow 30s linear infinite}
  .blob{animation:blobMorph 8s ease-in-out infinite}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after,.nav-link.active::after{width:100%}
  .card-hover{transition:transform .22s ease,box-shadow .22s ease}
  .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.08)}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.07)}
  .pill-btn{transition:all .18s ease}
  .pill-btn:hover{transform:translateY(-1px) scale(1.02)}
  .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
`;

export default function ActivitiesPage() {
  const user = typeof window !== "undefined" ? getUserFromCookie() : null;
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAge, setActiveAge] = useState("All Ages");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITIES.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchAge = activeAge === "All Ages" || a.age === activeAge;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.age.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchAge && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{styles}</style>

      {/* ═══ NAVBAR (dashboard style) ═══ */}
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
                { label: "Activities", href: "/auth/dashboard/activities", active: true,  emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    active: false, emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className={`nav-link ${l.active ? "active" : ""} ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all`}
                  style={{ color: l.active ? "#e8703a" : "#a8a29e", background: l.active ? "rgba(251,146,60,.08)" : "transparent" }}>
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
              <LogoutButton className="ff-b hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white [background:linear-gradient(135deg,#f87171,#fb923c)] [box-shadow:0_3px_12px_rgba(248,113,113,.25)]" />
            </div>
          </div>
          {/* Mobile nav */}
          <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
            {[
              { label: "Home",       href: "/auth/dashboard",            active: false },
              { label: "Activities", href: "/auth/dashboard/activities", active: true  },
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

      {/* ═══ HERO BANNER — rich, playful ═══ */}
      <section className="anim-1">
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg, #fff9f5 0%, #fef3ec 35%, #fde8f0 65%, #f5eeff 100%)",
          borderBottom: "1px solid rgba(253,186,116,.3)",
          minHeight: 280,
        }}>
          {/* Blobs */}
          <div className="blob absolute pointer-events-none" style={{ top: -60, right: "5%", width: 280, height: 280, background: "radial-gradient(circle at 40% 40%, rgba(253,164,175,.45), rgba(251,146,60,.2))", filter: "blur(55px)" }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -50, left: "5%", width: 220, height: 220, background: "radial-gradient(circle, rgba(196,181,253,.5), rgba(129,140,248,.2))", filter: "blur(45px)", animationDelay: "4s" }} />
          <div className="blob absolute pointer-events-none" style={{ top: "20%", left: "-30px", width: 180, height: 180, background: "radial-gradient(circle, rgba(110,231,183,.4), transparent)", filter: "blur(40px)", animationDelay: "7s" }} />

          {/* Spinning rings */}
          <div className="spin-slow absolute pointer-events-none" style={{ top: -40, right: "22%", width: 240, height: 240, borderRadius: "50%", border: "2px dashed rgba(251,146,60,.15)" }} />
          <div className="spin-slow absolute pointer-events-none" style={{ top: -20, right: "20%", width: 290, height: 290, borderRadius: "50%", border: "1px solid rgba(248,113,113,.07)", animationDirection: "reverse", animationDuration: "45s" }} />

          {/* Floating emojis */}
          <div className="float-a absolute pointer-events-none text-4xl select-none" style={{ top: "10%", right: "35%", opacity: 0.15 }}>🎨</div>
          <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ top: "60%", right: "8%", opacity: 0.12 }}>📚</div>
          <div className="float-c absolute pointer-events-none text-2xl select-none" style={{ bottom: "15%", left: "42%", opacity: 0.15 }}>🔬</div>
          <div className="float-d absolute pointer-events-none text-3xl select-none" style={{ top: "8%", left: "38%", opacity: 0.12 }}>🔢</div>
          <div className="float-a absolute pointer-events-none text-2xl select-none" style={{ bottom: "20%", right: "30%", opacity: 0.1 }}>✂️</div>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(251,146,60,.12) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 ff-b"
              style={{ background: "rgba(255,255,255,.75)", border: "1px solid rgba(251,146,60,.25)", backdropFilter: "blur(10px)" }}>
              <span>🎨</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#78716c" }}>Discover</span>
            </div>

            <h1 className="ff-d font-bold leading-tight mb-3" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
              Explore <span className="shimmer-text">Activities</span>
            </h1>
            <p className="ff-b text-sm mb-8" style={{ color: "#78716c", maxWidth: 360, margin: "0 auto 2rem" }}>
              Find the perfect activity for your child's age and interest.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c0bab4" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities, categories, ages..."
                className="ff-b w-full rounded-2xl pl-11 pr-5 py-3.5 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,.85)",
                  border: "1px solid rgba(253,186,116,.35)",
                  backdropFilter: "blur(8px)",
                  color: "#1c1917",
                  boxShadow: "0 4px 20px rgba(251,146,60,.08)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FILTER BAR ═══ */}
      <section className="sticky top-16 z-30 anim-2" style={{ background: "rgba(250,248,245,.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(240,235,228,.8)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 space-y-3">

          {/* Category pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="ff-b text-[9px] font-bold uppercase tracking-widest mr-1" style={{ color: "#c0bab4" }}>Subject</span>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const s = CAT_STYLES[cat];
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`pill-btn ff-b px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    isActive
                      ? cat === "All" ? "bg-[#1c1917] text-white border-[#1c1917]" : s.active
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                  }`}>
                  {cat === "All" ? "✨ All" : cat === "Art" ? "🎨 Art" : cat === "Math" ? "🔢 Math" : cat === "Reading" ? "📚 Reading" : "🔬 Science"}
                </button>
              );
            })}
          </div>

          {/* Age pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="ff-b text-[9px] font-bold uppercase tracking-widest mr-1" style={{ color: "#c0bab4" }}>Age</span>
            {AGE_GROUPS.map((age) => {
              const isActive = activeAge === age;
              const c = AGE_COLORS.find(a => a.age === age)!;
              return (
                <button key={age} onClick={() => setActiveAge(age)}
                  className="pill-btn ff-b px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all"
                  style={{
                    background: isActive ? c.activeBg : c.bg,
                    color:      isActive ? c.activeText : c.text,
                    borderColor: isActive ? c.activeBg : c.border,
                  }}>
                  {age}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ GRID ═══ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10 anim-3">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <p className="ff-b text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>
              {filtered.length} {filtered.length === 1 ? "Activity" : "Activities"} found
            </p>
          </div>
          {(activeCategory !== "All" || activeAge !== "All Ages" || search) && (
            <button
              onClick={() => { setActiveCategory("All"); setActiveAge("All Ages"); setSearch(""); }}
              className="ff-b text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(248,113,113,.1)", color: "#f87171", border: "1px solid rgba(248,113,113,.2)" }}>
              ✕ Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl p-16 text-center max-w-sm mx-auto"
            style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
            <p className="text-4xl mb-4">🔍</p>
            <p className="ff-d text-base font-bold" style={{ color: "#1c1917", fontStyle: "italic" }}>Nothing found</p>
            <p className="ff-b text-xs mt-1" style={{ color: "#a8a29e" }}>Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((a) => {
              const s = CAT_STYLES[a.category];
              return (
                <div key={a.id} className="card-hover rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: `0 4px 24px ${s.glow}` }}>

                  {/* Image */}
                  <div className="relative w-full overflow-hidden" style={{ paddingTop: "78%", background: "#faf8f5" }}>
                    <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-contain p-4" />
                    {/* Gradient shimmer */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(250,248,245,.5))" }} />
                    <span className={`absolute top-3 left-3 ff-b text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl ${s.badge}`}>{a.category}</span>
                    <span className="absolute top-3 right-3 ff-b text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl" style={{ background: "rgba(255,255,255,.85)", color: "#a8a29e", backdropFilter: "blur(4px)" }}>{a.age}</span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="ff-d text-sm font-bold mb-0.5" style={{ color: "#1c1917" }}>{a.title}</p>
                    <p className="ff-b text-xs leading-relaxed mb-4" style={{ color: "#a8a29e" }}>{a.desc}</p>
                    <div className="flex gap-2 mt-auto">
                      <Link href={`/auth/dashboard/activities/${a.id}`}
                        className={`lift flex-1 text-center py-2.5 ff-b text-[10px] font-bold rounded-2xl transition-colors uppercase tracking-widest ${s.btn}`}>
                        View 🎯
                      </Link>
                      <button title="Save"
                        className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm transition-all hover:scale-110"
                        style={{ background: "#faf8f5", border: "1px solid #f0ebe4", color: "#d1ccc8" }}>
                        ♡
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ FOOTER (dashboard style) ═══ */}
      <footer style={{ background: "#1c1917" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#34d399,#818cf8,#f87171)", backgroundSize: "200% 100%", animation: "shimmer 6s linear infinite" }} />

        {/* Pastel band */}
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff9f5,#fef3ec,#fde8f0)", padding: "40px 0 0" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(251,146,60,.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-7xl mx-auto px-6 pb-10 relative z-10 text-center">
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

        {/* Dark bottom */}
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