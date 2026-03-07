"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ userId }: { userId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete user");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
