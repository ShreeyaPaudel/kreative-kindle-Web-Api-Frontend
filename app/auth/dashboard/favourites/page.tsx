import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FavouritesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center gap-4 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
        <div className="text-5xl mb-4">⭐</div>
        <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">Coming Soon</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          My Favourites
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Activities you've saved and bookmarked will appear here for quick access.
        </p>
        <Link href="/auth/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:shadow-md transition-shadow">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}