import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  let role: string | null = null;
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      role = parsed.role;
    } catch {}
  }

  if (!token) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/images/logo.png" alt="Kreative Kindle" className="h-9 w-9 object-contain" />
              <span className="text-sm font-bold text-gray-800 hidden sm:block">Kreative Kindle</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/auth/dashboard" className="text-xs font-semibold uppercase tracking-widest text-rose-500 border-b-2 border-rose-400 pb-0.5">Home</Link>
              <Link href="/auth/dashboard/updates" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors">Updates</Link>
              {role === "admin" && (
                <Link href="/admin/users" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors">Admin</Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/user/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white"
                title="Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <LogoutButton className="bg-gradient-to-r from-rose-500 to-orange-400 text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest hover:shadow-md transition-shadow border-0" />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden gap-5 pb-2 pt-0.5 overflow-x-auto">
            <Link href="/auth/dashboard" className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-widest text-rose-500">Home</Link>
            <Link href="/auth/dashboard/updates" className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Updates</Link>
            {role === "admin" && (
              <Link href="/admin/users" className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Admin</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm min-h-[300px]">

          {/* Colourful blobs in background */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #5bbfb5, transparent)" }} />
          <div className="pointer-events-none absolute -bottom-10 right-1/3 w-48 h-48 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #f5c842, transparent)" }} />
          <div className="pointer-events-none absolute top-0 left-1/2 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #e07b39, transparent)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left */}
            <div className="flex flex-col justify-center p-8 sm:p-12 space-y-5 relative z-10">
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">Today's Highlight</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug"
                style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                Welcome to Our<br />
                <span className="not-italic text-rose-500">Learning Platform!</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Explore educational activities for kids. Browse and personalise learning for every age group.
              </p>
              <Link
                href="/auth/dashboard/activities"
                className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest shadow-md hover:shadow-lg transition-shadow"
              >
                Browse Activities →
              </Link>
            </div>

            {/* Right — hero image fills the panel */}
            <div className="relative hidden lg:block min-h-[300px]">
              <img
                src="/images/hero.png"
                alt="Learning"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AGE FILTER ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2">Browse by Age:</p>
          {[
            { label: "Age 2–3", color: "bg-[#fde8d8] text-[#c05621] border-[#fbd5b5]" },
            { label: "Age 3–4", color: "bg-[#d8ede8] text-[#276749] border-[#b2d9cf]" },
            { label: "Age 4+",  color: "bg-[#fce4ec] text-[#c2185b] border-[#f8bbd0]" },
            { label: "Age 5–6", color: "bg-[#fef9c3] text-[#92400e] border-[#fde68a]" },
            { label: "Age 6–9", color: "bg-[#e8d5f5] text-[#6b21a8] border-[#d8b4fe]" },
            { label: "Other",   color: "bg-white text-gray-500 border-gray-200" },
          ].map(({ label, color }) => (
            <Link
              key={label}
              href={`/auth/dashboard/activities?age=${encodeURIComponent(label)}`}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm hover:-translate-y-0.5 ${color}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── QUICK ACCESS ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Quick Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🎨", label: "Activities", sub: "Browse all activities",
              href: "/auth/dashboard/activities",
              grad: "from-[#fde8d8] to-[#fce4ec]", border: "border-orange-100",
            },
            {
              icon: "📊", label: "My Progress", sub: "View your learning report",
              href: "/auth/dashboard/progress",
              grad: "from-[#d8ede8] to-[#c6e2f5]", border: "border-teal-100",
            },
            {
              icon: "⭐", label: "Favourites", sub: "Your saved activities",
              href: "/auth/dashboard/favourites",
              grad: "from-[#fce4ec] to-[#e8d5f5]", border: "border-pink-100",
            },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={`flex items-center gap-4 bg-gradient-to-br ${c.grad} rounded-xl border ${c.border} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                {c.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
              </div>
              <span className="ml-auto text-gray-400 text-sm">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROGRESS + UPDATES ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Learning Progress</p>
            <Link href="/auth/dashboard/progress" className="text-xs font-semibold text-rose-500 hover:underline uppercase tracking-widest">View →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "12", label: "Activities Done", bg: "from-[#fde8d8] to-[#fce4ec]" },
              { value: "4h 30m", label: "Time Spent", bg: "from-[#d8ede8] to-[#c6e2f5]" },
              { value: "3", label: "This Week", bg: "from-[#fce4ec] to-[#e8d5f5]" },
              { value: "5 ⭐", label: "Favourites", bg: "from-[#fef9c3] to-[#fde8d8]" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-4 text-center bg-gradient-to-br ${s.bg}`}>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Latest Updates</p>
              <Link href="/auth/dashboard/updates" className="text-xs font-semibold text-rose-500 hover:underline uppercase tracking-widest">See All →</Link>
            </div>
            <div className="space-y-3">
              {[
                { title: "New activities added this week!", sub: "Nature Collage, DIY Volcano, Painting with Shapes", dot: "bg-rose-400" },
                { title: "Platform maintenance scheduled", sub: "Sunday 2am–4am. No downtime expected.", dot: "bg-orange-300" },
                { title: "Rainbow Art is trending 🌈", sub: "Most completed activity this month!", dot: "bg-[#5bbfb5]" },
              ].map((u) => (
                <div key={u.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-gray-100">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${u.dot}`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{u.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{u.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/auth/dashboard/updates"
            className="mt-5 self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:shadow-md transition-shadow"
          >
            View All Updates →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS — uses craft-circle image ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Craft image panel with gradient overlay */}
            <div className="relative min-h-[280px] lg:min-h-[340px]">
              <img
                src="/images/craft-circle.png"
                alt="Craft Activities"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60 lg:to-white/80" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-100">
                  🎨 Get Creative
                </span>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col justify-center p-8 sm:p-10 space-y-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">How It Works</p>
              <h2 className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                Create Your Own Requirement
              </h2>
              <div className="space-y-3 pt-2">
                {[
                  { step: 1, label: "Choose Your Activity", sub: "Browse by age, subject or interest", grad: "from-rose-500 to-orange-400" },
                  { step: 2, label: "Gather Materials", sub: "Check what you need before starting", grad: "from-[#5bbfb5] to-[#4aa8a0]" },
                  { step: 3, label: "Start Creating", sub: "Follow step-by-step instructions", grad: "from-orange-400 to-[#f5c842]" },
                ].map(({ step, label, sub, grad }) => (
                  <div key={step} className="flex items-center gap-4 p-3 rounded-xl bg-[#faf8f5] border border-gray-100">
                    <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/dashboard/activities"
                className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest shadow-md hover:shadow-lg transition-shadow mt-2"
              >
                Explore Activities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECOMMENDED ACTIVITIES ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Curated For You</p>
            <h2 className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
              Recommended Activities
            </h2>
          </div>
          <Link href="/auth/dashboard/activities" className="text-xs font-semibold text-rose-500 hover:underline uppercase tracking-widest">
            Show All →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: 1, title: "Rainbow Art", category: "Art", age: "Age 3–6" },
            { i: 2, title: "Counting Caterpillar", category: "Math", age: "Age 4–7" },
            { i: 3, title: "Story Time Fun", category: "Reading", age: "Age 5–8" },
            { i: 4, title: "Build a Robot", category: "Science", age: "Age 6–10" },
          ].map(({ i, title, category, age }) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              {/* Image — fixed ratio, object-contain so no stretching */}
              <div className="relative w-full bg-[#faf8f5]" style={{ paddingTop: "75%" }}>
                <img
                  src={`/images/activity${i}.png`}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
                <span className="absolute top-2 left-2 bg-white text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                  {category}
                </span>
              </div>
              {/* Card content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-bold text-gray-800">{title}</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 mb-4">{age}</p>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/auth/dashboard/activities/${i}`}
                    className="flex-1 text-center py-2.5 bg-gradient-to-r from-rose-500 to-orange-400 text-white text-xs font-bold rounded-xl hover:shadow-md transition-shadow uppercase tracking-widest"
                  >
                    Start
                  </Link>
                  <Link
                    href={`/auth/dashboard/favourites?add=${i}`}
                    title="Save"
                    className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-gray-100 flex items-center justify-center text-gray-300 hover:text-rose-400 hover:border-rose-200 transition-colors text-sm"
                  >
                    ♡
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-white">Kreative Kindle</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">
                Fun, meaningful, and development-focused activities for early learners.
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Dashboard", href: "/auth/dashboard" },
                  { label: "Activities", href: "/auth/dashboard/activities" },
                  { label: "My Progress", href: "/auth/dashboard/progress" },
                  { label: "Updates", href: "/auth/dashboard/updates" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="text-xs text-gray-500 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Contact</p>
              <p className="text-xs text-gray-500">+977-9813760646</p>
              <p className="text-xs text-gray-500">Xyz@Gmail.Com</p>
              <div className="flex gap-3 pt-1">
                <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm">📘</a>
                <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm">📷</a>
                <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm">💬</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-600">© 2025 Kreative Kindle. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}