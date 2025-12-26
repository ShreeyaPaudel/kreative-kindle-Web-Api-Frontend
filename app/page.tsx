import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Kreative Kindle
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-purple-100">
            A creative learning platform designed to inspire young minds
            through engaging courses, activities, and interactive content.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-white px-6 py-3 font-medium text-purple-700 hover:bg-purple-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-white px-6 py-3 font-medium text-white hover:bg-white hover:text-purple-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold text-gray-900">
          Why Kreative Kindle?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              🎨 Creative Learning
            </h3>
            <p className="text-sm text-gray-600">
              Courses designed to boost creativity, imagination, and confidence.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              📚 Interactive Content
            </h3>
            <p className="text-sm text-gray-600">
              Learn through stories, activities, and engaging exercises.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              👩‍🏫 Expert Guidance
            </h3>
            <p className="text-sm text-gray-600">
              Content curated by educators and creative professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Ready to get started?
        </h2>
        <p className="mb-6 text-gray-700">
          Join Kreative Kindle today and begin your creative journey.
        </p>

        <Link
          href="/register"
          className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
        >
          Create an Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400">
        © 2025 Kreative Kindle. All rights reserved.
      </footer>
    </main>
  );
}
