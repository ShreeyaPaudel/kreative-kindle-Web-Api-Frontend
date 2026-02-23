"use client";

import Link from "next/link";
import { useState } from "react";

// Each activity now has its OWN unique image
const ACTIVITIES = [
  { id: 1, title: "Rainbow Art",         category: "Art",     age: "Age 3–6",  image: "/images/activity1.png", desc: "Create a colourful rainbow using paint and sponges.",       btnColor: "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]" },
  { id: 2, title: "Counting Caterpillar",category: "Math",    age: "Age 4–7",  image: "/images/activity2.png", desc: "Build a caterpillar and practice counting with beads.",      btnColor: "bg-[#d8ede8] text-[#0f766e] hover:bg-[#c0e2da]" },
  { id: 3, title: "Story Time Fun",      category: "Reading", age: "Age 5–8",  image: "/images/activity3.png", desc: "Read along and answer fun questions about the story.",       btnColor: "bg-[#fce4ec] text-[#be185d] hover:bg-[#f9ccda]" },
  { id: 4, title: "Build a Robot",       category: "Science", age: "Age 6–10", image: "/images/activity4.png", desc: "Use recycled materials to build your very own robot.",        btnColor: "bg-[#ede8fd] text-[#6d28d9] hover:bg-[#ddd5fa]" },
  { id: 5, title: "Nature Collage",      category: "Art",     age: "Age 3–6",  image: "/images/activity1.png", desc: "Collect leaves and flowers to make a beautiful collage.",   btnColor: "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]" },
  { id: 6, title: "DIY Volcano",         category: "Science", age: "Age 5–9",  image: "/images/activity2.png", desc: "Make a baking soda volcano and watch it erupt!",            btnColor: "bg-[#ede8fd] text-[#6d28d9] hover:bg-[#ddd5fa]" },
  { id: 7, title: "Shape Painting",      category: "Art",     age: "Age 2–5",  image: "/images/activity3.png", desc: "Explore shapes by stamping objects dipped in paint.",       btnColor: "bg-[#fde8d8] text-[#b45309] hover:bg-[#f9d5b5]" },
  { id: 8, title: "Number Puzzles",      category: "Math",    age: "Age 4–7",  image: "/images/activity4.png", desc: "Match quantities to numerals with colourful cards.",         btnColor: "bg-[#d8ede8] text-[#0f766e] hover:bg-[#c0e2da]" },
  { id: 9, title: "Alphabet Hunt",       category: "Reading", age: "Age 3–6",  image: "/images/activity1.png", desc: "Search for objects that start with each letter.",           btnColor: "bg-[#fce4ec] text-[#be185d] hover:bg-[#f9ccda]" },
];

const CATEGORIES = ["All", "Art", "Math", "Reading", "Science"];

const CATEGORY_BADGE: Record<string, string> = {
  Art:     "bg-[#fde8d8] text-[#b45309]",
  Math:    "bg-[#d8ede8] text-[#0f766e]",
  Reading: "bg-[#fce4ec] text-[#be185d]",
  Science: "bg-[#ede8fd] text-[#6d28d9]",
};

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITIES.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
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

      {/* HERO BANNER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">Discover</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
            Explore Activities
          </h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Find the perfect activity for your child's age and interest.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mt-7">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-2xl border border-gray-200 bg-[#faf8f5] pl-11 pr-5 py-3.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>

          {/* Category tabs — each category gets its own pastel colour */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const pastel: Record<string, string> = {
                All:     isActive ? "bg-gray-800 text-white"                         : "bg-white border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600",
                Art:     isActive ? "bg-[#f9d5b5] text-[#b45309] border-[#f9d5b5]"  : "bg-white border border-gray-200 text-gray-400 hover:bg-[#fdf0e4] hover:text-[#b45309] hover:border-[#f9d5b5]",
                Math:    isActive ? "bg-[#b2d9cf] text-[#0f766e] border-[#b2d9cf]"  : "bg-white border border-gray-200 text-gray-400 hover:bg-[#e6f5f2] hover:text-[#0f766e] hover:border-[#b2d9cf]",
                Reading: isActive ? "bg-[#f9ccda] text-[#be185d] border-[#f9ccda]"  : "bg-white border border-gray-200 text-gray-400 hover:bg-[#fdf0f5] hover:text-[#be185d] hover:border-[#f9ccda]",
                Science: isActive ? "bg-[#ddd5fa] text-[#6d28d9] border-[#ddd5fa]"  : "bg-white border border-gray-200 text-gray-400 hover:bg-[#f3f0fd] hover:text-[#6d28d9] hover:border-[#ddd5fa]",
              };
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${pastel[cat]}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-6 text-center">
          {filtered.length} {filtered.length === 1 ? "Activity" : "Activities"} found
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center max-w-sm mx-auto">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-gray-500">No activities found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

                {/* Image — unique per activity */}
                <div className="relative w-full bg-[#faf8f5]" style={{ paddingTop: "75%" }}>
                  <img
                    src={a.image}
                    alt={a.title}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${CATEGORY_BADGE[a.category]}`}>
                    {a.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 text-center">
                  <p className="text-sm font-bold text-gray-800">{a.title}</p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 mb-2">{a.age}</p>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{a.desc}</p>
                  <div className="flex gap-2 mt-auto">
                    {/* Each category gets its own pastel button colour */}
                    <Link
                      href={`/auth/dashboard/activities/${a.id}`}
                      className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-colors uppercase tracking-widest ${a.btnColor}`}
                    >
                      View
                    </Link>
                    <button
                      title="Save"
                      className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-gray-100 flex items-center justify-center text-gray-300 hover:text-rose-300 transition-colors text-sm"
                    >
                      ♡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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