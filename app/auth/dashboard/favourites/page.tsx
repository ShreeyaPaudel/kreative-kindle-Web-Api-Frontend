"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Favourite {
  _id: string;
  activityId: number;
  activityTitle: string;
  category: string;
  age: string;
  image: string;
  savedAt: string;
}

const CATEGORY_BADGE: Record<string, string> = {
  Art:     "bg-[#fde8d8] text-[#b45309]",
  Math:    "bg-[#d8ede8] text-[#0f766e]",
  Reading: "bg-[#fce4ec] text-[#be185d]",
  Science: "bg-[#ede8fd] text-[#6d28d9]",
};

const CATEGORY_BTN: Record<string, string> = {
  Art:     "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]",
  Math:    "bg-[#d8ede8] text-[#0f766e] hover:bg-[#c0e2da]",
  Reading: "bg-[#fce4ec] text-[#be185d] hover:bg-[#f9ccda]",
  Science: "bg-[#ede8fd] text-[#6d28d9] hover:bg-[#ddd5fa]",
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const API = "http://localhost:3001";

export default function FavouritesPage() {
  const router = useRouter();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }

    const fetchFavourites = async () => {
      try {
        const res = await fetch(`${API}/api/progress/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    try {
      await fetch(`${API}/api/progress/favourites/${activityId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites((prev) => prev.filter((f) => f.activityId !== activityId));
      showToast("Removed from favourites");
    } catch { showToast("Something went wrong"); }
  };

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
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">Saved</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
            My Favourites
          </h1>
          <p className="text-sm text-gray-400">Activities you've saved for quick access.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-3 animate-pulse">⭐</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Loading...</p>
          </div>
        ) : favourites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center max-w-sm mx-auto">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-sm font-semibold text-gray-600 mb-1">No favourites yet</p>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Save activities by pressing the ♡ button on any activity page.
            </p>
            <Link href="/auth/dashboard/activities"
              className="inline-flex items-center gap-2 rounded-xl bg-[#fde8d8] text-[#b45309] px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#f9d5b5] transition-colors">
              Browse Activities →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-6 text-center">
              {favourites.length} {favourites.length === 1 ? "Activity" : "Activities"} saved
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {favourites.map((fav) => (
                <div key={fav._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

                  {/* Image */}
                  <div className="relative w-full bg-[#faf8f5]" style={{ paddingTop: "75%" }}>
                    <img
                      src={fav.image}
                      alt={fav.activityTitle}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                    <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${CATEGORY_BADGE[fav.category] ?? "bg-gray-100 text-gray-500"}`}>
                      {fav.category}
                    </span>
                    {/* Remove button */}
                    <button
                      onClick={() => removeFavourite(fav.activityId)}
                      title="Remove from favourites"
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors text-xs shadow-sm"
                    >
                      ♥
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 text-center">
                    <p className="text-sm font-bold text-gray-800">{fav.activityTitle}</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 mb-4">{fav.age}</p>
                    <Link
                      href={`/auth/dashboard/activities/${fav.activityId}`}
                      className={`mt-auto text-center py-2.5 text-xs font-bold rounded-xl transition-colors uppercase tracking-widest ${CATEGORY_BTN[fav.category] ?? "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      View Activity
                    </Link>
                  </div>
                </div>
              ))}
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