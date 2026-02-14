import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchUserById(token: string, id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL missing");

  const res = await fetch(`${base}/api/admin/users/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
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
      typeof data === "string" ? data : data?.message || "Failed to fetch user"
    );
  }

  return data;
}

export default async function AdminUserIdPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // ✅ Next.js 15 safe: params can be Promise
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900">User Details</h1>
          <p className="mt-2 text-sm text-red-600">
            Missing user id in route. (params.id is undefined)
          </p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const store = await cookies();
  const token = store.get("token")?.value;
  if (!token) redirect("/auth/login");

  let user: any;
  try {
    user = await fetchUserById(token, id);
  } catch (e: any) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900">User Details</h1>
          <p className="mt-2 text-sm text-red-600">
            {e?.message || "Failed to load user"}
          </p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back
            </Link>
            <Link
              href={`/admin/users/${id}/edit`}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase text-gray-500">ID</p>
              <p className="font-mono text-sm text-gray-800">{user._id || id}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">Username / Name</p>
              <p className="text-gray-900 font-medium">
                {user.username || user.name || user.fullName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">Email</p>
              <p className="text-gray-800">{user.email || "—"}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">Role</p>
              <p className="text-gray-800">{user.role || "parent"}</p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">Created</p>
              <p className="text-gray-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">Updated</p>
              <p className="text-gray-800">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
