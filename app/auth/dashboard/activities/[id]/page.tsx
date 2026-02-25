"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const ACTIVITIES: Record<number, {
  id: number; title: string; category: string; age: string;
  image: string; duration: string; desc: string;
  materials: { label: string; emoji: string }[];
  steps: { text: string; emoji: string }[];
}> = {
  1: {
    id: 1, title: "Rainbow Art", category: "Art", age: "Age 3–6",
    image: "/images/activity1.png", duration: "30 mins",
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
  },
  2: {
    id: 2, title: "Counting Caterpillar", category: "Math", age: "Age 4–7",
    image: "/images/activity2.png", duration: "20 mins",
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
  },
  3: {
    id: 3, title: "Story Time Fun", category: "Reading", age: "Age 5–8",
    image: "/images/activity3.png", duration: "25 mins",
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
  },
  4: {
    id: 4, title: "Build a Robot", category: "Science", age: "Age 6–10",
    image: "/images/activity4.png", duration: "45 mins",
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
  },
  5: {
    id: 5, title: "Nature Collage", category: "Art", age: "Age 3–6",
    image: "/images/activity1.png", duration: "35 mins",
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
  },
  6: {
    id: 6, title: "DIY Volcano", category: "Science", age: "Age 5–9",
    image: "/images/activity2.png", duration: "40 mins",
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
  },
  7: {
    id: 7, title: "Shape Painting", category: "Art", age: "Age 2–5",
    image: "/images/activity3.png", duration: "20 mins",
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
  },
  8: {
    id: 8, title: "Number Puzzles", category: "Math", age: "Age 4–7",
    image: "/images/activity4.png", duration: "25 mins",
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
  },
  9: {
    id: 9, title: "Alphabet Hunt", category: "Reading", age: "Age 3–6",
    image: "/images/activity1.png", duration: "20 mins",
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
  },
};

const CATEGORY_STYLES: Record<string, { badge: string; bg: string }> = {
  Art:     { badge: "bg-[#fde8d8] text-[#b45309]", bg: "bg-[#fdf6f0]" },
  Math:    { badge: "bg-[#d8ede8] text-[#0f766e]", bg: "bg-[#f0faf7]" },
  Reading: { badge: "bg-[#fce4ec] text-[#be185d]", bg: "bg-[#fdf0f5]" },
  Science: { badge: "bg-[#ede8fd] text-[#6d28d9]", bg: "bg-[#f5f0ff]" },
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const API = "http://localhost:3001";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const activity = ACTIVITIES[id];

  const [isFav, setIsFav]           = useState(false);
  const [isDone, setIsDone]         = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Check existing favourite + completion state on load
  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }

    const checkState = async () => {
      try {
        const [favRes, progRes] = await Promise.all([
          fetch(`${API}/api/progress/favourites`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/progress`,            { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const favs  = await favRes.json();
        const prog  = await progRes.json();
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
        await fetch(`${API}/api/progress/favourites/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFav(false);
        showToast("Removed from favourites");
      } else {
        await fetch(`${API}/api/progress/favourites`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId:    activity.id,
            activityTitle: activity.title,
            category:      activity.category,
            age:           activity.age,
            image:         activity.image,
          }),
        });
        setIsFav(true);
        showToast("Saved to favourites ⭐");
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
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId:    activity.id,
          activityTitle: activity.title,
          category:      activity.category,
        }),
      });
      setIsDone(true);
      showToast("Activity marked as complete! 🎉");
    } catch { showToast("Something went wrong"); }
    setDoneLoading(false);
  };

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm w-full">
          <p className="text-4xl mb-4">🤔</p>
          <p className="text-sm font-semibold text-gray-700 mb-1">Activity not found</p>
          <p className="text-xs text-gray-400 mb-6">This activity doesn't exist yet.</p>
          <Link href="/auth/dashboard/activities"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-400 text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-rose-500 transition-colors">
            ← Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const style = CATEGORY_STYLES[activity.category] ?? { badge: "bg-gray-100 text-gray-500", bg: "bg-gray-50" };

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-bold text-gray-800 hidden sm:block">Kreative Kindle</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/auth/dashboard" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Home</Link>
            <Link href="/auth/dashboard/activities" className="text-xs font-semibold uppercase tracking-widest text-rose-400 border-b-2 border-rose-300 pb-0.5">Activities</Link>
            <Link href="/auth/dashboard/updates" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Updates</Link>
          </div>
          <Link href="/user/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-orange-200 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-widest mb-6">
          <Link href="/auth/dashboard" className="hover:text-rose-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/auth/dashboard/activities" className="hover:text-rose-400 transition-colors">Activities</Link>
          <span>›</span>
          <span className="text-gray-600">{activity.title}</span>
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className={`flex items-center justify-center min-h-[260px] lg:min-h-[340px] ${style.bg} p-10`}>
              <img src={activity.image} alt={activity.title}
                className="w-full max-w-[220px] object-contain drop-shadow-md" />
            </div>
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${style.badge}`}>{activity.category}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">{activity.age}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">⏱ {activity.duration}</span>
                {isDone && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-green-100 text-green-600">✓ Completed</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                {activity.title}
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">{activity.desc}</p>

              {/* Save to favourites */}
              <button
                onClick={toggleFavourite}
                disabled={favLoading}
                className={`self-start flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isFav
                    ? "bg-rose-50 border-rose-200 text-rose-400"
                    : "bg-[#faf8f5] border-gray-200 text-gray-400 hover:text-rose-400 hover:border-rose-200"
                }`}
              >
                {isFav ? "♥ Saved to Favourites" : "♡ Save to Favourites"}
              </button>
            </div>
          </div>
        </div>

        {/* MATERIALS + STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🛒</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">What You Need</p>
            </div>
            <ul className="space-y-3">
              {activity.materials.map((m, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f5] border border-gray-100">
                  <span className="text-xl w-8 text-center flex-shrink-0">{m.emoji}</span>
                  <span className="text-sm text-gray-600">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">📋</span>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Steps to Follow</p>
            </div>
            <ol className="space-y-3">
              {activity.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-gray-100">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="text-lg">{step.emoji}</span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Step {i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed pt-0.5">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* FINISH ACTIVITY BUTTON */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-800">All done? 🎉</p>
            <p className="text-xs text-gray-400 mt-0.5">Mark this activity as complete to track your progress.</p>
          </div>
          <button
            onClick={finishActivity}
            disabled={isDone || doneLoading}
            className={`flex-shrink-0 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              isDone
                ? "bg-green-100 text-green-600 border border-green-200 cursor-default"
                : "bg-gradient-to-r from-rose-400 to-orange-300 text-white hover:shadow-md"
            }`}
          >
            {isDone ? "✓ Already Completed!" : doneLoading ? "Saving..." : "Finish Activity"}
          </button>
        </div>

        <Link href="/auth/dashboard/activities"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 text-gray-400 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:border-rose-200 hover:text-rose-400 transition-colors">
          ← Back to Activities
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-white">Kreative Kindle</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">Fun, meaningful activities for early learners.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Dashboard", href: "/auth/dashboard" },
                  { label: "Activities", href: "/auth/dashboard/activities" },
                  { label: "Progress", href: "/auth/dashboard/progress" },
                  { label: "Updates", href: "/auth/dashboard/updates" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="text-xs text-gray-500 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Contact</p>
              <p className="text-xs text-gray-500">+977-9813760646</p>
              <p className="text-xs text-gray-500">Xyz@Gmail.Com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-600">© 2025 Kreative Kindle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}