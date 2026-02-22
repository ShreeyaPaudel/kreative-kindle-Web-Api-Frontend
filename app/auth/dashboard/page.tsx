import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50">
      
      {/* NAVIGATION */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-gray-800">
                Kreative Kindle
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Admin
              </Link>
              <Link
                href="/user/profile"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Profile
              </Link>

              <LogoutButton className="border-0 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-5 py-2 rounded-full hover:shadow-md transition-shadow text-sm font-medium" />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to Our Learning Platform
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                Highlights!
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Discover a world of creative activities designed to inspire
              young minds. Safe, structured learning for all ages.
            </p>

            <div className="flex gap-4">
              <Link
                href="/admin/users"
                className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full hover:shadow-md transition-shadow"
              >
                Get Started
              </Link>

              <Link
                href="/forgot-password"
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Materials Included
              </span>
              <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                Step-by-Step
              </span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Clear Outcomes
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Age 3–12
              </span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <img
                src="/images/hero.png"
                alt="Hero"
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Adaptive Learning: Best Outcome Craft Activity
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Trust Support",
              desc: "Platform built with safety at core. Every activity carefully vetted and age-appropriate."
            },
            {
              title: "Best Instructions",
              desc: "Clear step-by-step instructions guide children through activities with ease."
            },
            {
              title: "Safe Environment",
              desc: "Secure nurturing space where children explore, learn and grow confidently."
            }
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Create Your Own Requirement
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <img
              src="/images/craft-circle.png"
              alt="Craft"
              className="w-full max-w-sm rounded-full shadow-lg"
            />
          </div>

          <div className="space-y-6">
            {["Choose Your Activity", "Gather Materials", "Start Creating"].map(
              (step, index) => (
                <div key={step} className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Follow the structured guidance to complete your creative journey successfully.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Recommended Activities
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={`/images/activity${i}.png`}
                alt={`Activity ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Activity Title
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Creative and structured learning activity designed for early development.
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full hover:shadow-md transition-shadow text-sm">
                  Start Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-16"></div>
    </div>
  );
}
