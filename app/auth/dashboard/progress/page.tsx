"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CompletedActivity {
  _id: string;
  activityId: number;
  activityTitle: string;
  category: string;
  completedAt: string;
}

const CATEGORY_BADGE: Record<string, string> = {
  Art:     "bg-[#fde8d8] text-[#b45309]",
  Math:    "bg-[#d8ede8] text-[#0f766e]",
  Reading: "bg-[#fce4ec] text-[#be185d]",
  Science: "bg-[#ede8fd] text-[#6d28d9]",
};

const CATEGORY_ICON: Record<string, string> = {
  Art: "🎨", Math: "🔢", Reading: "📖", Science: "🔬",
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function isThisWeek(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

const API = "http://localhost:3001";

export default function ProgressPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<CompletedActivity[]>([]);
  const [favCount, setFavCount]     = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }

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

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const undoComplete = async (activityId: number) => {
    const token = getCookie("token");
    if (!token) return;
    try {
      await fetch(`${API}/api/progress/complete/${activityId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities((prev) => prev.filter((a) => a.activityId !== activityId));
      showToast("Completion removed");
    } catch { showToast("Something went wrong"); }
  };

  const thisWeekCount = activities.filter((a) => isThisWeek(a.completedAt)).length;

  // Count per category
  const catCounts = activities.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Activities Done", value: activities.length, emoji: "🎯", bg: "bg-[#fde8d8]", text: "text-[#b45309]" },
    { label: "This Week",       value: thisWeekCount,      emoji: "📅", bg: "bg-[#d8ede8]", text: "text-[#0f766e]" },
    { label: "Favourites",      value: favCount,           emoji: "⭐", bg: "bg-[#fce4ec]", text: "text-[#be185d]" },
    { label: "Categories",      value: Object.keys(catCounts).length, emoji: "🗂️", bg: "bg-[#ede8fd]", text: "text-[#6d28d9]" },
  ];

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
            <Link href="/auth/dashboard/activities" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Activities</Link>
            <Link href="/auth/dashboard/updates" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Updates</Link>
          </div>
          <Link href="/user/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-orange-200 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">Track</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
            My Progress
          </h1>
          <p className="text-sm text-gray-400">See everything you've completed so far.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-3 animate-pulse">📊</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center`}>
                  <p className="text-2xl mb-1">{s.emoji}</p>
                  <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CATEGORY BREAKDOWN */}
            {Object.keys(catCounts).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">By Category</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(catCounts).map(([cat, count]) => (
                    <div key={cat} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${CATEGORY_BADGE[cat] ?? "bg-gray-100 text-gray-500"}`}>
                      <span className="text-base">{CATEGORY_ICON[cat] ?? "📌"}</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{cat}</span>
                      <span className="text-xs font-bold opacity-70">× {count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLETED LIST */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Completed Activities</p>

              {activities.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-3xl mb-3">🎯</p>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Nothing completed yet</p>
                  <p className="text-xs text-gray-400 mb-5">Complete your first activity to start tracking progress!</p>
                  <Link href="/auth/dashboard/activities"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#fde8d8] text-[#b45309] px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#f9d5b5] transition-colors">
                    Browse Activities →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((a) => (
                    <div key={a._id} className="flex items-center gap-4 p-4 rounded-xl bg-[#faf8f5] border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                        {CATEGORY_ICON[a.category] ?? "📌"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{a.activityTitle}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${CATEGORY_BADGE[a.category] ?? "bg-gray-100 text-gray-500"}`}>
                            {a.category}
                          </span>
                          <span className="text-[10px] text-gray-400">{timeAgo(a.completedAt)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/auth/dashboard/activities/${a.activityId}`}
                        className="flex-shrink-0 text-[10px] font-semibold text-gray-400 hover:text-rose-400 uppercase tracking-widest transition-colors"
                      >
                        View →
                      </Link>
                      <button
                        onClick={() => undoComplete(a.activityId)}
                        title="Undo completion"
                        className="flex-shrink-0 text-[10px] font-semibold text-gray-300 hover:text-rose-400 uppercase tracking-widest transition-colors"
                      >
                        Undo
                      </button>
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-xs flex-shrink-0">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
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
                  { label: "Favourites", href: "/auth/dashboard/favourites" },
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