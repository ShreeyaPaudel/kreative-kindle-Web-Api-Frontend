import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditUserForm from "../edit/EditUserform"; 

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

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Failed to fetch user");

  return data;
}

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);

  const store = await cookies();
  const token = store.get("token")?.value;

  if (!token) redirect("/auth/login");

  const user = await fetchUserById(token, id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>

          <div className="flex gap-3">
            <Link
              href={`/admin/users/${id}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <EditUserForm user={user} userId={id} />
        </div>
      </div>
    </div>
  );
}
