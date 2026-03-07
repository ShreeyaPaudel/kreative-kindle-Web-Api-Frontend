import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteButton from "./DeleteButton";
import LimitSelect from "./LimitSelect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AnyUser = { _id?: string; id?: string; name?: string; fullName?: string; username?: string; email?: string; role?: string; createdAt?: string; };
type Meta    = { page?: number; limit?: number; total?: number; totalPages?: number; };

function normalizeUsers(payload: any): AnyUser[] {
  if (Array.isArray(payload)) return payload;
  if (payload?.data  && Array.isArray(payload.data))  return payload.data;
  if (payload?.users && Array.isArray(payload.users)) return payload.users;
  return [];
}
function normalizeMeta(payload: any): Meta {
  if (payload?.meta)       return payload.meta;
  if (payload?.pagination) return payload.pagination;
  return {};
}

async function fetchAdminUsers(token: string, page: number, limit: number) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is missing");
  const res  = await fetch(`${base}/api/admin/users?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (res.status === 401 || res.status === 403) { redirect("/auth/login"); }
  if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || `Error ${res.status}`);
  return data;
}

const ROLE_BADGE: Record<string, string> = {
  admin:  "background:#fde8d8;color:#b45309",
  parent: "background:#f0fdf9;color:#0f766e",
};

export default async function AdminUsersPage({ searchParams }: { searchParams?: Promise<{ page?: string; limit?: string }> }) {
  const sp    = (await searchParams) ?? {};
  const store = await cookies();
  const token = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  const page  = Math.max(parseInt(sp.page  ?? "1", 10) || 1, 1);
  const limit = Math.max(parseInt(sp.limit ?? "10", 10) || 10, 1);

  let payload: any;
  try { payload = await fetchAdminUsers(token, page, limit); }
  catch (e: any) {
    return (
      <div className="rounded-2xl p-5 text-sm" style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}>
        <p className="font-semibold mb-1">Could not load users</p>
        <p>{e?.message}</p>
      </div>
    );
  }

  const users      = normalizeUsers(payload);
  const meta       = normalizeMeta(payload);
  const total      = meta.total      ?? users.length;
  const totalPages = meta.totalPages ?? 1;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>Manage Users</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>View, edit and remove user accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <LimitSelect />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users",  value: total,                                    icon: "👥", style: "background:#faf8f5;border:1px solid #ebe8e4" },
          { label: "Admins",       value: users.filter(u => u.role === "admin").length,  icon: "🛡️", style: "background:#fdf6f0;border:1px solid #fdd9b4" },
          { label: "Parents",      value: users.filter(u => u.role !== "admin").length, icon: "👨‍👩‍👧", style: "background:#f0fdf9;border:1px solid #99f6e4" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ ...Object.fromEntries(s.style.split(";").map(p => p.split(":").map(v => v.trim()))) }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{s.icon}</span>
              <span className="text-xs font-semibold" style={{ color: "#a8a29e" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1c1917" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #ebe8e4" }}>
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #ebe8e4" }}>
          <p className="text-xs font-semibold" style={{ color: "#78716c" }}>
            {total} users · Page {page} of {totalPages}
          </p>
        </div>

        <table className="w-full text-left">
          <thead style={{ background: "#faf8f5" }}>
            <tr>
              {["User", "Email", "Role", "Joined", "Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8a29e" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const id    = u._id || u.id || "";
              const name  = u.username || u.name || u.fullName || "—";
              const email = u.email || "—";
              const role  = u.role || "parent";
              const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
              return (
                <tr key={id || email} style={{ borderTop: i === 0 ? "none" : "1px solid #f5f2ee" }}
                  className="transition-colors hover:bg-[#faf8f5]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "#fde8d8", color: "#b45309" }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#1c1917" }}>{name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#78716c" }}>{email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                      style={{ ...(ROLE_BADGE[role] ? Object.fromEntries(ROLE_BADGE[role].split(";").map(p => p.split(":").map(v => v.trim()))) : { background: "#f5f5f4", color: "#78716c" }) }}>
                      {role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#a8a29e" }}>{joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/users/${id}`}
                        className="text-xs font-semibold transition-colors hover:opacity-70"
                        style={{ color: "#0f766e" }}>View</Link>
                      <Link href={`/admin/users/${id}/edit`}
                        className="text-xs font-semibold transition-colors hover:opacity-70"
                        style={{ color: "#b45309" }}>Edit</Link>
                      <DeleteButton userId={id} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: "#a8a29e" }}>No users found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid #f5f2ee" }}>
          <Link href={`/admin/users?page=${Math.max(page - 1, 1)}&limit=${limit}`}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: page > 1 ? "white" : "#faf8f5", color: page > 1 ? "#44403c" : "#c0bab4", border: "1px solid #ebe8e4", pointerEvents: page > 1 ? "auto" : "none" }}>
            ← Previous
          </Link>
          <span className="text-xs" style={{ color: "#a8a29e" }}>Page <strong style={{ color: "#1c1917" }}>{page}</strong> of <strong style={{ color: "#1c1917" }}>{totalPages}</strong></span>
          <Link href={`/admin/users?page=${Math.min(page + 1, totalPages)}&limit=${limit}`}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: page < totalPages ? "white" : "#faf8f5", color: page < totalPages ? "#44403c" : "#c0bab4", border: "1px solid #ebe8e4", pointerEvents: page < totalPages ? "auto" : "none" }}>
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}