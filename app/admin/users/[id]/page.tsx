import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteButton from "../DeleteButton";

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
  // API returns { user: {...} } — unwrap it
  return data?.user ?? data;
}

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  admin:  { bg: "#fde8d8", color: "#b45309" },
  parent: { bg: "#f0fdf9", color: "#0f766e" },
};

export default async function AdminUserIdPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const store  = await cookies();
  const token  = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  let user: any;
  try { user = await fetchUserById(token, id); }
  catch (e: any) {
    return (
      <div className="rounded-2xl p-5 text-sm" style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}>
        <p className="font-semibold mb-1">Could not load user</p>
        <p>{e?.message}</p>
        <Link href="/admin/users" className="mt-3 inline-block text-xs font-semibold" style={{ color: "#0f766e" }}>← Back to Users</Link>
      </div>
    );
  }

  const name   = user.username || user.name || user.fullName || "—";
  const role   = user.role || "parent";
  const badge  = ROLE_BADGE[role] ?? { bg: "#f5f5f4", color: "#78716c" };

  const fields = [
    { label: "User ID",  value: user._id || id,    mono: true },
    { label: "Username", value: name },
    { label: "Email",    value: user.email || "—" },
    { label: "Role",     value: role, badge: true },
    { label: "Joined",   value: user.createdAt ? new Date(user.createdAt).toLocaleString() : "—" },
    { label: "Updated",  value: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—" },
  ];

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#a8a29e" }}>
        <Link href="/admin/users" className="hover:opacity-70 transition-opacity" style={{ color: "#78716c" }}>Users</Link>
        <span>›</span>
        <span style={{ color: "#1c1917" }}>{name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold"
            style={{ background: badge.bg, color: badge.color }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>{name}</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{ background: badge.bg, color: badge.color }}>{role}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/users"
            className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            style={{ background: "white", border: "1px solid #ebe8e4", color: "#78716c" }}>
            ← Back
          </Link>
          <Link href={`/admin/users/${id}/edit`}
            className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            style={{ background: "#fde8d8", color: "#b45309", border: "1px solid #fdd9b4" }}>
            Edit
          </Link>
          <DeleteButton userId={id} />
        </div>
      </div>

      {/* Detail card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #ebe8e4" }}>
        {fields.map((f, i) => (
          <div key={f.label} className="flex items-start px-5 py-4"
            style={{ borderTop: i === 0 ? "none" : "1px solid #f5f2ee" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest w-28 flex-shrink-0 mt-0.5" style={{ color: "#a8a29e" }}>{f.label}</p>
            {f.badge
              ? <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ background: badge.bg, color: badge.color }}>{f.value}</span>
              : <p className={`text-sm ${f.mono ? "font-mono" : "font-medium"}`} style={{ color: f.mono ? "#78716c" : "#1c1917", wordBreak: "break-all" }}>{f.value}</p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}