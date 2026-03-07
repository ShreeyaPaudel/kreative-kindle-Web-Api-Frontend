import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditUserForm from "./EditUserform";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchUserById(token: string, id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL missing");
  const res  = await fetch(`${base}/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to fetch user");
  return data?.user ?? data;
}

export default async function AdminUserEditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const store  = await cookies();
  const token  = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  const user = await fetchUserById(token, id);
  const name = user.username || user.name || user.fullName || "—";

  return (
    <div className="max-w-xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#a8a29e" }}>
        <Link href="/admin/users" className="hover:opacity-70 transition-opacity" style={{ color: "#78716c" }}>Users</Link>
        <span>›</span>
        <Link href={`/admin/users/${id}`} className="hover:opacity-70 transition-opacity" style={{ color: "#78716c" }}>{name}</Link>
        <span>›</span>
        <span style={{ color: "#1c1917" }}>Edit</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>Edit User</h1>
        <Link href={`/admin/users/${id}`}
          className="text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ background: "white", border: "1px solid #ebe8e4", color: "#78716c" }}>
          Cancel
        </Link>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #ebe8e4" }}>
        <EditUserForm user={user} userId={id} />
      </div>
    </div>
  );
}