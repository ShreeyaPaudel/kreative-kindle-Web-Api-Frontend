import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] overflow-x-hidden font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 md:px-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#f5a623] flex items-center justify-center shadow-md">
            <span className="text-2xl">📖</span>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-[#e07b39] uppercase tracking-widest">Creative</p>
            <p className="text-[11px] font-semibold text-[#e07b39] uppercase tracking-widest">Kindle</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          <Link href="#" className="hover:text-[#e07b39] transition-colors">About</Link>
          <Link href="#" className="hover:text-[#e07b39] transition-colors">Home</Link>
          <Link href="/auth/login" className="hover:text-[#e07b39] transition-colors">Login</Link>
          <Link href="/auth/register" className="hover:text-[#e07b39] transition-colors">Signup</Link>
        </div>

        {/* Mobile menu hint */}
        <div className="md:hidden flex gap-4 text-sm font-medium text-gray-700">
          <Link href="/auth/login" className="hover:text-[#e07b39]">Login</Link>
          <Link href="/auth/register" className="hover:text-[#e07b39]">Signup</Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">

        {/* Organic blob — top left teal */}
        <div
          className="pointer-events-none absolute -top-16 -left-20 w-[320px] h-[320px] opacity-80"
          style={{
            background: "#5bbfb5",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          }}
        />

        {/* Organic blob — bottom left yellow */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-[200px] h-[200px] opacity-70"
          style={{
            background: "#f5c842",
            borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
          }}
        />

        {/* Organic blob — right side orange */}
        <div
          className="pointer-events-none absolute top-1/4 -right-10 w-[180px] h-[340px] opacity-60"
          style={{
            background: "#e07b39",
            borderRadius: "40% 60% 60% 40% / 30% 50% 50% 70%",
          }}
        />

        {/* Leaves / dots — right bottom */}
        <div className="pointer-events-none absolute bottom-8 right-16 opacity-50">
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
            <path d="M10 80 Q30 40 60 20" stroke="#5bbfb5" strokeWidth="3" fill="none"/>
            <path d="M60 20 Q50 50 20 90" stroke="#5bbfb5" strokeWidth="3" fill="none"/>
            <ellipse cx="55" cy="25" rx="14" ry="8" fill="#5bbfb5" opacity="0.6" transform="rotate(-30 55 25)"/>
            <ellipse cx="40" cy="50" rx="12" ry="7" fill="#f5c842" opacity="0.6" transform="rotate(-20 40 50)"/>
          </svg>
        </div>

        {/* Small dots scatter */}
        <div className="pointer-events-none absolute top-1/3 right-[15%] flex flex-col gap-1 opacity-40">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              ))}
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16">

          {/* Illustration — left */}
          <div className="flex items-end justify-center order-2 md:order-1">
            <div className="relative">
              {/* Box/platform behind kids */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[80px] rounded-t-3xl"
                style={{ background: "#5bbfb5" }}
              />
              {/* Illustration image */}
              <img
                src="/images/KidsinBalloon.png"
                alt="Creative Kids"
                className="relative z-10 w-[280px] sm:w-[340px] md:w-[400px] object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* Text — right */}
          <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left">
            <h1
              className="text-[2.6rem] sm:text-[3rem] md:text-[3.4rem] leading-tight text-gray-800 mb-5"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700 }}
            >
              Empowering Creative<br />
              Learning,<br />
              <span className="not-italic">One Activity at a Time</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 max-w-sm leading-relaxed mb-8">
              Discover fun, meaningful, and development-focused activities designed for early learners. Easily browse, filter, and personalise learning experiences.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/register"
                className="rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors shadow-md"
              >
                Explore Activities
              </Link>
              <Link
                href="#features"
                className="rounded-full border border-gray-400 text-gray-700 px-6 py-3 text-sm font-semibold hover:border-gray-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="relative bg-white py-20 px-8 md:px-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-[#e07b39] uppercase tracking-widest mb-2">
            Why choose us
          </p>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            Everything a young learner needs
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🎨",
                color: "#fde8d8",
                title: "Creative Learning",
                desc: "Courses designed to boost creativity, imagination, and confidence in every child.",
              },
              {
                icon: "📚",
                color: "#d8ede8",
                title: "Interactive Content",
                desc: "Learn through stories, activities, and engaging exercises that make learning fun.",
              },
              {
                icon: "👩‍🏫",
                color: "#fce4ec",
                title: "Expert Guidance",
                desc: "Content curated by educators and creative professionals for the best outcomes.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition-transform hover:-translate-y-1 duration-200"
                style={{ background: f.color }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="bg-[#f5f0e8] py-20 px-8 text-center relative overflow-hidden">
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 opacity-40"
          style={{ background: "#5bbfb5", borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%" }}
        />
        <div
          className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 opacity-30"
          style={{ background: "#f5c842", borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%" }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
          >
            Ready to spark curiosity?
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Join Kreative Kindle today and begin your child's creative journey with activities designed to inspire.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-gray-700 transition-colors shadow-lg"
          >
            Create an Account
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400">
        © 2025 Kreative Kindle. All rights reserved.
      </footer>

    </main>
  );
}