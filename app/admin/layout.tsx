import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { font-family: 'DM Sans', sans-serif; }
`;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const token = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  return (
    <div className="min-h-screen" style={{ background: "#f7f6f4", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{adminStyles}</style>

      {/* Top bar */}
      <header style={{ background: "white", borderBottom: "1px solid #ebe8e4", height: 56 }}
        className="sticky top-0 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
            <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>Kreative Kindle</span>
            <span className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: "#fde8d8", color: "#b45309" }}>Admin</span>
          </div>
        </div>
        <Link href="/auth/dashboard"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "#78716c", background: "#f7f6f4", border: "1px solid #ebe8e4" }}>
          ← Back to App
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 min-h-[calc(100vh-56px)] sticky top-14 flex-shrink-0 p-4"
          style={{ background: "white", borderRight: "1px solid #ebe8e4" }}>
          <nav className="space-y-0.5">
            <p className="text-[9px] font-bold uppercase tracking-widest px-3 py-2 mt-1" style={{ color: "#c0bab4" }}>Users</p>
            <Link href="/admin/users"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[#faf8f5]"
              style={{ color: "#44403c" }}>
              <span>👥</span> Manage Users
            </Link>

            <p className="text-[9px] font-bold uppercase tracking-widest px-3 py-2 mt-3" style={{ color: "#c0bab4" }}>Activities</p>
            <Link href="/admin/activities"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[#faf8f5]"
              style={{ color: "#44403c" }}>
              <span>🎨</span> All Activities
            </Link>
            <Link href="/admin/activities/new"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[#faf8f5]"
              style={{ color: "#44403c" }}>
              <span>➕</span> Add Activity
            </Link>

            <p className="text-[9px] font-bold uppercase tracking-widest px-3 py-2 mt-3" style={{ color: "#c0bab4" }}>Community</p>
            <Link href="/admin/posts"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[#faf8f5]"
              style={{ color: "#44403c" }}>
              <span>📢</span> Moderate Posts
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}