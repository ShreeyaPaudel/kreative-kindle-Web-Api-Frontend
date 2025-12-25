export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome to Kreative Kindle
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Users</h2>
          <p className="mt-2 text-2xl font-semibold text-purple-500">
            120
          </p>
          <p className="text-sm text-gray-500">Total registered users</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Courses</h2>
          <p className="mt-2 text-2xl font-semibold text-purple-500">
            18
          </p>
          <p className="text-sm text-gray-500">Active learning modules</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Progress</h2>
          <p className="mt-2 text-2xl font-semibold text-purple-500">
            75%
          </p>
          <p className="text-sm text-gray-500">Average completion rate</p>
        </div>
      </section>
    </main>
  );
}
