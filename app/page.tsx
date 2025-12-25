export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Kreative Kindle
        </h1>

        <p className="mb-6 text-center text-gray-600">
          A creative learning platform for early childhood education.
        </p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="w-full rounded-lg bg-purple-500 py-2 text-center text-white"
          >
            Login
          </a>

          <a
            href="/register"
            className="w-full rounded-lg border border-purple-500 py-2 text-center text-purple-500"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
