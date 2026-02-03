export default function AdminUserIdPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-800">/admin/users/[id]</h1>
        <p className="mt-3 text-gray-700">
          User ID: <span className="font-semibold">{params.id}</span>
        </p>
      </div>
    </div>
  );
}