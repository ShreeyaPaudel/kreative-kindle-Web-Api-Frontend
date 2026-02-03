import Link from "next/link";

export default function AdminUsersPage() {
  const dummyUsers = [
    { id: "1", email: "demo1@mail.com", role: "parent" },
    { id: "2", email: "demo2@mail.com", role: "instructor" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">/admin/users</h1>

          <Link
            href="/admin/users/create"
            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Create User
          </Link>
        </div>

        <table className="mt-6 w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Role</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((u) => (
              <tr key={u.id}>
                <td className="border px-3 py-2">{u.id}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2">
                  <Link className="mr-3 text-blue-600 hover:underline" href={`/admin/users/${u.id}`}>
                    View
                  </Link>
                  <Link className="text-purple-600 hover:underline" href={`/admin/users/${u.id}/edit`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 text-sm text-gray-500">Dummy table ✅</p>
      </div>
    </div>
  );
}