import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteButton from "./DeleteButton";
import LimitSelect from "./LimitSelect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AnyUser = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

type Meta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

function normalizeUsers(payload: any): AnyUser[] {
  if (Array.isArray(payload)) return payload;

  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.users && Array.isArray(payload.users)) return payload.users;
  if (payload?.result && Array.isArray(payload.result)) return payload.result;

  return [];
}

function normalizeMeta(payload: any): Meta {
  if (payload?.meta) return payload.meta;
  if (payload?.pagination) return payload.pagination;
  return {};
}

async function fetchAdminUsers(token: string, page: number, limit: number) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is missing in .env.local");

  const res = await fetch(`${base}/api/admin/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || `Failed to fetch users (${res.status})`
    );
  }

  return data;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}) {
  const sp = (await searchParams) ?? {};
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  // ✅ read from URL: /admin/users?page=2&limit=5
 const page = Math.max(parseInt(sp.page ?? "1", 10) || 1, 1);
const limit = Math.max(parseInt(sp.limit ?? "5", 10) || 5, 1);

  let payload: any;
  try {
    payload = await fetchAdminUsers(token, page, limit);
  } catch (e: any) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          
            <Link
              href="/auth/dashboard"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Could not load users</p>
            <p className="mt-1">{e?.message ?? "Unknown error"}</p>
            <p className="mt-2 text-xs text-red-600">
              Check NEXT_PUBLIC_API_URL and confirm token is sent as
              Authorization: Bearer &lt;token&gt;
            </p>
          </div>
        </div>
      </div>
    );
  }

  const users = normalizeUsers(payload);
  const meta = normalizeMeta(payload);

  const total = meta.total ?? users.length;
  const totalPages = meta.totalPages ?? 1;
 const hasPrevPage = page > 1;
const hasNextPage = page < totalPages;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
    <p className="text-sm text-gray-600">
      View users, open details, and edit.
    </p>
  </div>

  <div className="flex items-center gap-4">
    <LimitSelect />

    <Link
      href="/auth/dashboard"
      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      Back to Dashboard
    </Link>
  </div>
</div>

        {/* Table Card */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">{total}</span>
              <span className="ml-3 text-gray-400">
                (Page {page} of {totalPages})
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Endpoint:{" "}
              <span className="font-mono">
                {`/api/admin/users?page=${page}&limit=${limit}`}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const id = u._id || u.id || "";
                  const name = u.name || u.fullName || "—";
                  const email = u.email || "—";
                  const role = u.role || "parent";

                  return (
                    <tr key={id || email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{email}</td>
                      <td className="px-6 py-4 text-gray-600">{role}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm">
                          <Link
                            href={`/admin/users/${id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/users/${id}/edit`}
                            className="text-amber-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton userId={id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {users.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-10 text-center text-sm text-gray-500"
                      colSpan={4}
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <Link
             href={`/admin/users?page=${Math.max(page - 1, 1)}&limit=${limit}`}
              className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
                hasPrevPage
                  ? "bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 pointer-events-none"
              }`}
            >
              Previous
            </Link>

            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>

            <Link
              href={`/admin/users?page=${Math.min(page + 1, totalPages)}&limit=${limit}`}
              className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
                hasNextPage
                  ? "bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 pointer-events-none"
              }`}
            >
              Next
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Pagination is now wired to backend meta (page/limit/totalPages).
        </p>
      </div>
    </div>
  );
}