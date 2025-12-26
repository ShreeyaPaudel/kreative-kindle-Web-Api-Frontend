export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome to Kreative Kindle
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">👤 User</span>
          <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
            😊
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Courses</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">
            12
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Enrolled</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">
            5
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">
            3
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Progress</p>
          <h2 className="mt-2 text-2xl font-semibold text-purple-500">
            68%
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>📘 Enrolled in “Creative Writing Basics”</li>
            <li>✅ Completed “Introduction to Design”</li>
            <li>📝 Started “Storytelling for Kids”</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">
            <button className="rounded-lg bg-purple-500 py-2 text-white hover:bg-purple-600">
              Browse Courses
            </button>
            <button className="rounded-lg border py-2 text-gray-700 hover:bg-gray-50">
              View Profile
            </button>
            <button className="rounded-lg border py-2 text-gray-700 hover:bg-gray-50">
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
