"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../../../components/LogoutButton";

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

const ACTIVITIES: Record<number, {
  id: number; title: string; category: string; age: string;
  image: string; duration: string; desc: string;
  materials: { label: string; emoji: string }[];
  steps: { text: string; emoji: string }[];
  outcomes: { label: string; emoji: string; color: string; bg: string }[];
}> = {
  1: {
    id: 1, title: "Rainbow Art", category: "Art", age: "Age 3–6",
    image: "/images/rainbowart.png", duration: "30 mins",
    desc: "Create a colourful rainbow using paint and sponges. A wonderful first art activity that builds colour recognition and fine motor skills.",
    materials: [
      { label: "Watercolour paints", emoji: "🎨" },
      { label: "Sponge pieces", emoji: "🧽" },
      { label: "White cardstock", emoji: "📄" },
      { label: "Bowl of water", emoji: "💧" },
      { label: "Paper towel", emoji: "🧻" },
    ],
    steps: [
      { text: "Lay out your paper on a flat surface and put on an apron.", emoji: "👕" },
      { text: "Dip a sponge piece into red paint and dab it in an arc at the top.", emoji: "🔴" },
      { text: "Rinse the sponge, then repeat with orange just below.", emoji: "🟠" },
      { text: "Continue with yellow, green, blue and purple.", emoji: "🌈" },
      { text: "Let it dry fully before displaying your masterpiece!", emoji: "✨" },
    ],
    outcomes: [
      { label: "Colour Recognition", emoji: "🌈", color: "#e8703a", bg: "#fff9f5" },
      { label: "Fine Motor Skills", emoji: "✋", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Creativity & Expression", emoji: "🎨", color: "#be185d", bg: "#fdf4ff" },
      { label: "Patience & Focus", emoji: "🧘", color: "#6d28d9", bg: "#f5f0ff" },
    ],
  },
  2: {
    id: 2, title: "Counting Caterpillar", category: "Math", age: "Age 4–7",
    image: "/images/countingcatterpillar.png", duration: "20 mins",
    desc: "Build a caterpillar and practice counting with beads and string. Great for number recognition and hand-eye coordination.",
    materials: [
      { label: "Colourful beads (at least 20)", emoji: "📿" },
      { label: "Thick string or pipe cleaner", emoji: "🧵" },
      { label: "Number cards 1–10", emoji: "🔢" },
    ],
    steps: [
      { text: "Lay out number cards 1 to 10 in a row on the table.", emoji: "🃏" },
      { text: "Thread that many beads for each number onto the string.", emoji: "📿" },
      { text: "Tie a small knot after each group to separate segments.", emoji: "🪢" },
      { text: "Continue until you reach number 10.", emoji: "🔟" },
      { text: "Count each segment together and say the number out loud.", emoji: "🗣️" },
    ],
    outcomes: [
      { label: "Number Recognition", emoji: "🔢", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Hand-Eye Coordination", emoji: "👁️", color: "#e8703a", bg: "#fff9f5" },
      { label: "Sequencing Skills", emoji: "📊", color: "#6d28d9", bg: "#f5f0ff" },
      { label: "Concentration", emoji: "🎯", color: "#be185d", bg: "#fdf4ff" },
    ],
  },
  3: {
    id: 3, title: "Story Time Fun", category: "Reading", age: "Age 5–8",
    image: "/images/storytime.png", duration: "25 mins",
    desc: "Read along and answer fun comprehension questions. Builds vocabulary, listening, and critical thinking skills.",
    materials: [
      { label: "A picture book of your choice", emoji: "📖" },
      { label: "Pencil and paper", emoji: "✏️" },
      { label: "Colouring pencils (optional)", emoji: "🖍️" },
    ],
    steps: [
      { text: "Choose a picture book and sit comfortably together.", emoji: "🛋️" },
      { text: "Read the story aloud slowly, pausing at the pictures.", emoji: "📖" },
      { text: "After each page, ask 'what do you think happens next?'", emoji: "🤔" },
      { text: "Discuss: Who? What happened? How did it end?", emoji: "💬" },
      { text: "Draw your favourite scene from the story.", emoji: "🖼️" },
    ],
    outcomes: [
      { label: "Vocabulary Building", emoji: "📚", color: "#be185d", bg: "#fdf4ff" },
      { label: "Critical Thinking", emoji: "🧠", color: "#6d28d9", bg: "#f5f0ff" },
      { label: "Listening Skills", emoji: "👂", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Imagination", emoji: "💭", color: "#e8703a", bg: "#fff9f5" },
    ],
  },
  4: {
    id: 4, title: "Build a Robot", category: "Science", age: "Age 6–10",
    image: "/images/buildarobot.png", duration: "45 mins",
    desc: "Use recycled materials to design and build your very own cardboard robot. Encourages creativity and engineering thinking.",
    materials: [
      { label: "Cardboard boxes (various sizes)", emoji: "📦" },
      { label: "Aluminium foil", emoji: "🪙" },
      { label: "Bottle caps", emoji: "🔵" },
      { label: "Tape and glue", emoji: "📎" },
      { label: "Markers and paint", emoji: "🖊️" },
    ],
    steps: [
      { text: "Collect boxes and decide what becomes the body, head and limbs.", emoji: "🤖" },
      { text: "Stack and tape the boxes together to form the robot shape.", emoji: "📦" },
      { text: "Wrap sections in aluminium foil for a metallic look.", emoji: "✨" },
      { text: "Glue bottle caps on as buttons, eyes or decorations.", emoji: "👁️" },
      { text: "Add details like a mouth, dials and a name badge!", emoji: "🏷️" },
    ],
    outcomes: [
      { label: "Engineering Thinking", emoji: "⚙️", color: "#6d28d9", bg: "#f5f0ff" },
      { label: "Spatial Reasoning", emoji: "🧩", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Problem Solving", emoji: "💡", color: "#e8703a", bg: "#fff9f5" },
      { label: "Creative Design", emoji: "🎨", color: "#be185d", bg: "#fdf4ff" },
    ],
  },
  5: {
    id: 5, title: "Nature Collage", category: "Art", age: "Age 3–6",
    image: "/images/naturecollage.png", duration: "35 mins",
    desc: "Collect leaves, petals and twigs outdoors to create a stunning nature collage.",
    materials: [
      { label: "Collected leaves, petals, twigs", emoji: "🍃" },
      { label: "Thick paper or cardboard", emoji: "📄" },
      { label: "PVA glue", emoji: "🧴" },
      { label: "Paintbrush for glue", emoji: "🖌️" },
    ],
    steps: [
      { text: "Go on a short nature walk and collect interesting items.", emoji: "🚶" },
      { text: "Arrange your items on the cardboard without gluing first.", emoji: "🎨" },
      { text: "When happy with the design, glue each piece down.", emoji: "🧴" },
      { text: "Let it dry for at least an hour.", emoji: "⏳" },
      { text: "Display your nature collage proudly!", emoji: "🖼️" },
    ],
    outcomes: [
      { label: "Nature Awareness", emoji: "🌿", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Artistic Composition", emoji: "🎨", color: "#e8703a", bg: "#fff9f5" },
      { label: "Sensory Exploration", emoji: "🖐️", color: "#be185d", bg: "#fdf4ff" },
      { label: "Decision Making", emoji: "🧠", color: "#6d28d9", bg: "#f5f0ff" },
    ],
  },
  6: {
    id: 6, title: "DIY Volcano", category: "Science", age: "Age 5–9",
    image: "/images/diyvolcano.png", duration: "40 mins",
    desc: "Make a baking soda volcano and watch it erupt! Teaches basic chemistry in a fun, spectacular way.",
    materials: [
      { label: "Baking soda (3 tbsp)", emoji: "🧂" },
      { label: "White vinegar (½ cup)", emoji: "🍶" },
      { label: "Dish soap", emoji: "🫧" },
      { label: "Red food colouring", emoji: "🔴" },
      { label: "Small plastic bottle", emoji: "🍾" },
      { label: "Clay", emoji: "🏔️" },
    ],
    steps: [
      { text: "Build a volcano shape around a small plastic bottle using clay.", emoji: "🏔️" },
      { text: "Place the bottle-volcano on a tray to catch overflow.", emoji: "🪣" },
      { text: "Add 3 tablespoons of baking soda into the bottle.", emoji: "🧂" },
      { text: "Mix vinegar with red food colouring and dish soap.", emoji: "🧪" },
      { text: "Pour the mixture in and watch it erupt!", emoji: "🌋" },
    ],
    outcomes: [
      { label: "Basic Chemistry", emoji: "🧪", color: "#6d28d9", bg: "#f5f0ff" },
      { label: "Scientific Curiosity", emoji: "🔬", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Cause & Effect", emoji: "⚡", color: "#e8703a", bg: "#fff9f5" },
      { label: "Following Instructions", emoji: "📋", color: "#be185d", bg: "#fdf4ff" },
    ],
  },
  7: {
    id: 7, title: "Shape Painting", category: "Art", age: "Age 2–5",
    image: "/images/shapepainting.png", duration: "20 mins",
    desc: "Explore shapes by dipping objects in paint and stamping patterns on paper.",
    materials: [
      { label: "Poster paint (various colours)", emoji: "🎨" },
      { label: "White paper", emoji: "📄" },
      { label: "Toilet rolls, sponges, star cutouts", emoji: "⭐" },
      { label: "Shallow trays for paint", emoji: "🫙" },
    ],
    steps: [
      { text: "Pour different paint colours into shallow trays.", emoji: "🎨" },
      { text: "Dip the end of a toilet roll in paint — it makes a circle!", emoji: "⭕" },
      { text: "Stamp it onto the paper and lift carefully.", emoji: "🖐️" },
      { text: "Try other objects for different shapes.", emoji: "🔷" },
      { text: "Name each shape as you stamp it together.", emoji: "🗣️" },
    ],
    outcomes: [
      { label: "Shape Recognition", emoji: "🔷", color: "#e8703a", bg: "#fff9f5" },
      { label: "Colour Learning", emoji: "🌈", color: "#be185d", bg: "#fdf4ff" },
      { label: "Fine Motor Skills", emoji: "✋", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Pattern Making", emoji: "🎯", color: "#6d28d9", bg: "#f5f0ff" },
    ],
  },
  8: {
    id: 8, title: "Number Puzzles", category: "Math", age: "Age 4–7",
    image: "/images/numberpuzzle.png", duration: "25 mins",
    desc: "Solve fun number puzzles and match quantities to numerals with colourful cards.",
    materials: [
      { label: "Printed number cards 1–10", emoji: "🔢" },
      { label: "Small counters or buttons", emoji: "🔵" },
      { label: "Pencil", emoji: "✏️" },
    ],
    steps: [
      { text: "Shuffle the number cards and lay them face up.", emoji: "🃏" },
      { text: "Pick a card and read the number out loud.", emoji: "👆" },
      { text: "Count out that many counters and place them next to the card.", emoji: "🔵" },
      { text: "Check your work by counting again.", emoji: "✅" },
      { text: "Try ordering all the cards from smallest to largest.", emoji: "📈" },
    ],
    outcomes: [
      { label: "Number Matching", emoji: "🔢", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Logical Thinking", emoji: "🧩", color: "#6d28d9", bg: "#f5f0ff" },
      { label: "Memory Skills", emoji: "🧠", color: "#e8703a", bg: "#fff9f5" },
      { label: "Self-Checking", emoji: "✅", color: "#be185d", bg: "#fdf4ff" },
    ],
  },
  9: {
    id: 9, title: "Alphabet Hunt", category: "Reading", age: "Age 3–6",
    image: "/images/alphabethunt.png", duration: "20 mins",
    desc: "Search the room for objects that start with each letter of the alphabet.",
    materials: [
      { label: "Alphabet sheet or cards", emoji: "🔤" },
      { label: "Pencil to tick off found items", emoji: "✏️" },
    ],
    steps: [
      { text: "Print out the alphabet on a sheet of paper.", emoji: "📄" },
      { text: "Pick a letter and say its sound together.", emoji: "🗣️" },
      { text: "Hunt around the room for something starting with that sound.", emoji: "🔍" },
      { text: "Tick it off the list when found!", emoji: "✅" },
      { text: "Try to find something for every letter.", emoji: "🏆" },
    ],
    outcomes: [
      { label: "Letter Recognition", emoji: "🔤", color: "#be185d", bg: "#fdf4ff" },
      { label: "Phonics Awareness", emoji: "🗣️", color: "#e8703a", bg: "#fff9f5" },
      { label: "Observation Skills", emoji: "🔍", color: "#0f766e", bg: "#f0fdf9" },
      { label: "Memory & Recall", emoji: "🧠", color: "#6d28d9", bg: "#f5f0ff" },
    ],
  },
};

const CAT_STYLES: Record<string, { badge: string; from: string; to: string; border: string; num: string; glow: string }> = {
  Art:     { badge: "bg-[#fde8d8] text-[#b45309]", from: "#fff9f5", to: "#fde8d8", border: "rgba(253,186,116,.4)", num: "#e8703a", glow: "rgba(248,113,113,.1)"  },
  Math:    { badge: "bg-[#d8ede8] text-[#0f766e]", from: "#f0fdf9", to: "#d1fae5", border: "rgba(134,239,172,.4)", num: "#0f766e", glow: "rgba(52,211,153,.1)"   },
  Reading: { badge: "bg-[#fce4ec] text-[#be185d]", from: "#fdf4ff", to: "#fce4ec", border: "rgba(249,204,218,.4)", num: "#be185d", glow: "rgba(190,24,93,.08)"   },
  Science: { badge: "bg-[#ede8fd] text-[#6d28d9]", from: "#f5f0ff", to: "#ede8fd", border: "rgba(221,213,250,.4)", num: "#6d28d9", glow: "rgba(109,40,217,.08)"  },
};

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
  .anim-5{animation:fadeUp .45s .36s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1.5s ease-in-out infinite}
  .blob{animation:blobMorph 9s ease-in-out infinite}
  .spin-slow{animation:spinSlow 30s linear infinite}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after,.nav-link.active::after{width:100%}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
  .card-in{transition:transform .2s ease,box-shadow .2s ease}
  .card-in:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06)}
  .step-hover{transition:background .18s ease}
  .step-hover:hover{background:#fff5f0 !important}
  .outcome-card{transition:transform .2s ease,box-shadow .2s ease}
  .outcome-card:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 12px 32px rgba(0,0,0,.08)}
`;

export default function ActivityDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = Number(params?.id);
  const activity = ACTIVITIES[id];
  const user    = typeof window !== "undefined" ? getUserFromCookie() : null;

  const [isFav,       setIsFav]       = useState(false);
  const [isDone,      setIsDone]      = useState(false);
  const [favLoading,  setFavLoading]  = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [toast,       setToast]       = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }
    const checkState = async () => {
      try {
        const [favRes, progRes] = await Promise.all([
          fetch(`${API}/api/progress/favourites`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/progress`,            { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const favs = await favRes.json();
        const prog = await progRes.json();
        setIsFav(favs.some((f: any) => f.activityId === id));
        setIsDone(prog.activities?.some((a: any) => a.activityId === id));
      } catch {}
    };
    checkState();
  }, [id]);

  const toggleFavourite = async () => {
    const token = getCookie("token");
    if (!token || !activity) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await fetch(`${API}/api/progress/favourites/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setIsFav(false); showToast("Removed from favourites");
      } else {
        await fetch(`${API}/api/progress/favourites`, {
          method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ activityId: activity.id, activityTitle: activity.title, category: activity.category, age: activity.age, image: activity.image }),
        });
        setIsFav(true); showToast("Saved to favourites ⭐");
      }
    } catch { showToast("Something went wrong"); }
    setFavLoading(false);
  };

  const finishActivity = async () => {
    const token = getCookie("token");
    if (!token || !activity) return;
    setDoneLoading(true);
    try {
      await fetch(`${API}/api/progress/complete`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id, activityTitle: activity.title, category: activity.category }),
      });
      setIsDone(true); showToast("Activity marked as complete! 🎉");
    } catch { showToast("Something went wrong"); }
    setDoneLoading(false);
  };

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#faf8f5" }}>
        <div className="rounded-3xl p-14 text-center max-w-sm w-full" style={{ background: "white", border: "1px solid #f0ebe4" }}>
          <p className="text-5xl mb-4">🤔</p>
          <p className="ff-d text-lg font-bold" style={{ color: "#1c1917", fontStyle: "italic" }}>Activity not found</p>
          <p className="ff-b text-xs mt-1 mb-6" style={{ color: "#a8a29e" }}>This activity doesn't exist yet.</p>
          <Link href="/auth/dashboard/activities"
            className="inline-flex items-center gap-2 rounded-2xl text-white px-6 py-3 ff-b text-xs font-bold uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>
            ← Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const cs = CAT_STYLES[activity.category] ?? CAT_STYLES.Art;

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{pageStyles}</style>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 ff-b text-xs font-bold px-6 py-3 rounded-2xl shadow-xl"
          style={{ background: "#1c1917", color: "white", backdropFilter: "blur(10px)" }}>
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
              <LogoutButton className="ff-b hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white [background:linear-gradient(135deg,#f87171,#fb923c)]" />
            </div>
          </div>
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

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 ff-b text-[10px] font-bold uppercase tracking-widest mb-6 anim-1" style={{ color: "#c0bab4" }}>
          <Link href="/auth/dashboard" className="hover:text-[#e8703a] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/auth/dashboard/activities" className="hover:text-[#e8703a] transition-colors">Activities</Link>
          <span>›</span>
          <span style={{ color: "#78716c" }}>{activity.title}</span>
        </div>

        {/* ═══ HERO CARD ═══ */}
        <div className="rounded-3xl overflow-hidden mb-5 anim-1" style={{
          background: `linear-gradient(135deg, ${cs.from}, ${cs.to})`,
          border: `1px solid ${cs.border}`,
          boxShadow: `0 8px 40px ${cs.glow}`,
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image side — with blobs */}
            <div className="relative min-h-[280px] lg:min-h-[360px] overflow-hidden flex items-center justify-center p-10">
              {/* background blobs */}
              <div className="blob absolute pointer-events-none" style={{ top: -40, right: -30, width: 200, height: 200, background: `radial-gradient(circle, ${cs.num}30, transparent)`, filter: "blur(40px)" }} />
              <div className="blob absolute pointer-events-none" style={{ bottom: -30, left: -20, width: 160, height: 160, background: "radial-gradient(circle, rgba(196,181,253,.3), transparent)", filter: "blur(35px)", animationDelay: "4s" }} />
              {/* spinning ring */}
              <div className="spin-slow absolute pointer-events-none" style={{ width: 260, height: 260, borderRadius: "50%", border: `1px dashed ${cs.num}25` }} />
              {/* dot grid */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${cs.num}18 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
              {/* floating emoji watermarks */}
              <div className="float-a absolute pointer-events-none text-5xl select-none" style={{ top: "8%", right: "12%", opacity: 0.12 }}>
                {activity.category === "Art" ? "🎨" : activity.category === "Math" ? "🔢" : activity.category === "Reading" ? "📚" : "🔬"}
              </div>
              <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ bottom: "10%", left: "8%", opacity: 0.1 }}>✨</div>
              {/* actual image */}
              <div className="float-a relative z-10">
                <img src={activity.image} alt={activity.title}
                  className="w-full max-w-[220px] object-contain"
                  style={{ filter: `drop-shadow(0 16px 32px ${cs.num}35)` }} />
              </div>
            </div>

            {/* Info side */}
            <div className="flex flex-col justify-center p-8 sm:p-10 gap-5" style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)" }}>
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`ff-b text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl ${cs.badge}`}>{activity.category}</span>
                <span className="ff-b text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl" style={{ background: "rgba(250,248,245,.9)", color: "#78716c" }}>{activity.age}</span>
                <span className="ff-b text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl" style={{ background: "rgba(250,248,245,.9)", color: "#78716c" }}>⏱ {activity.duration}</span>
                {isDone && (
                  <span className="ff-b text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl" style={{ background: "#dcfce7", color: "#16a34a" }}>✓ Completed</span>
                )}
              </div>

              <h1 className="ff-d font-bold leading-tight" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
                {activity.title}
              </h1>
              <p className="ff-b text-sm leading-relaxed" style={{ color: "#78716c", maxWidth: 380 }}>{activity.desc}</p>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap pt-1">
                <button onClick={toggleFavourite} disabled={favLoading}
                  className="lift ff-b flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                  style={isFav
                    ? { background: "rgba(248,113,113,.12)", color: "#f87171", border: "1px solid rgba(248,113,113,.25)" }
                    : { background: "rgba(255,255,255,.8)", color: "#a8a29e", border: "1px solid rgba(240,235,228,.8)" }}>
                  {isFav ? "♥ Saved" : "♡ Save to Favourites"}
                </button>
                <button onClick={finishActivity} disabled={isDone || doneLoading}
                  className="lift ff-b flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all"
                  style={isDone
                    ? { background: "#dcfce7", color: "#16a34a" }
                    : { background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 16px rgba(248,113,113,.28)" }}>
                  {isDone ? "✓ Completed!" : doneLoading ? "Saving..." : "🎉 Mark Complete"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LEARNING OUTCOMES ═══ */}
        <div className="rounded-3xl p-6 sm:p-8 mb-5 anim-2" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 32px rgba(0,0,0,.04)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 4px 12px rgba(248,113,113,.25)" }}>🎓</div>
            <div>
              <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>What they develop</p>
              <p className="ff-d font-bold text-lg" style={{ color: "#1c1917", fontStyle: "italic" }}>Learning Outcomes</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activity.outcomes.map((o, i) => (
              <div key={i} className="outcome-card rounded-2xl p-5 text-center relative overflow-hidden"
                style={{ background: o.bg, border: `1.5px solid ${o.color}20` }}>
                {/* watermark */}
                <div className="absolute -bottom-1 -right-1 text-5xl select-none pointer-events-none" style={{ opacity: 0.08 }}>{o.emoji}</div>
                <div className="text-3xl mb-3">{o.emoji}</div>
                <p className="ff-b text-xs font-bold" style={{ color: o.color }}>{o.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ MATERIALS + STEPS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 anim-3">

          {/* Materials */}
          <div className="rounded-3xl p-6 sm:p-7" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "#fff9f5", border: "1px solid #fdd9b4" }}>🛒</div>
              <div>
                <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Gather first</p>
                <p className="ff-d text-sm font-bold" style={{ color: "#1c1917", fontStyle: "italic" }}>What You Need</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {activity.materials.map((m, i) => (
                <li key={i} className="card-in flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#faf8f5", border: "1px solid #f0ebe4" }}>
                  <span className="text-xl w-9 text-center flex-shrink-0 p-1.5 rounded-xl" style={{ background: "white" }}>{m.emoji}</span>
                  <span className="ff-b text-sm" style={{ color: "#78716c" }}>{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="rounded-3xl p-6 sm:p-7" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "#f0fdf9", border: "1px solid #99f6e4" }}>📋</div>
              <div>
                <p className="ff-b text-[9px] font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Do this</p>
                <p className="ff-d text-sm font-bold" style={{ color: "#1c1917", fontStyle: "italic" }}>Steps to Follow</p>
              </div>
            </div>
            <ol className="space-y-2.5">
              {activity.steps.map((step, i) => (
                <li key={i} className="step-hover flex items-start gap-3 p-3 rounded-2xl" style={{ background: "#faf8f5", border: "1px solid #f0ebe4" }}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
                    <span className="text-lg">{step.emoji}</span>
                    <span className="ff-b text-[8px] font-bold uppercase tracking-widest" style={{ color: "#d1ccc8" }}>{i + 1}</span>
                  </div>
                  <span className="ff-b text-sm leading-relaxed" style={{ color: "#78716c" }}>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ═══ FINISH BANNER ═══ */}
        <div className="rounded-3xl p-6 mb-8 anim-4 relative overflow-hidden" style={{
          background: isDone ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "linear-gradient(135deg,#fff9f5,#fde8d8)",
          border: isDone ? "1px solid rgba(134,239,172,.5)" : "1px solid rgba(253,186,116,.4)",
          boxShadow: isDone ? "0 4px 24px rgba(52,211,153,.1)" : "0 4px 24px rgba(251,146,60,.08)",
        }}>
          <div className="absolute -right-4 -bottom-4 text-8xl select-none pointer-events-none" style={{ opacity: 0.08 }}>🎉</div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div>
              <p className="ff-d font-bold text-lg" style={{ color: "#1c1917", fontStyle: "italic" }}>
                {isDone ? "Activity Completed! 🎉" : "All done?"}
              </p>
              <p className="ff-b text-xs mt-0.5" style={{ color: "#a8a29e" }}>
                {isDone ? "Great work! This has been added to your progress." : "Mark this activity as complete to track your progress."}
              </p>
            </div>
            <button onClick={finishActivity} disabled={isDone || doneLoading}
              className="lift flex-shrink-0 ff-b px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
              style={isDone
                ? { background: "#dcfce7", color: "#16a34a", border: "1px solid rgba(134,239,172,.5)", cursor: "default" }
                : { background: "linear-gradient(135deg,#f87171,#fb923c)", color: "white", boxShadow: "0 4px 16px rgba(248,113,113,.28)" }}>
              {isDone ? "✓ Already Completed!" : doneLoading ? "Saving..." : "Finish Activity 🎯"}
            </button>
          </div>
        </div>

        <Link href="/auth/dashboard/activities"
          className="lift inline-flex items-center gap-2 rounded-2xl ff-b text-xs font-bold uppercase tracking-widest anim-5"
          style={{ background: "white", color: "#a8a29e", border: "1px solid #f0ebe4", padding: "10px 20px" }}>
          ← Back to Activities
        </Link>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: "#1c1917" }}>
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