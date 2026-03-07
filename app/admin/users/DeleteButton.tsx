"use client";
// DeleteButton.tsx
import { useRouter } from "next/navigation";

export default function DeleteButton({ userId }: { userId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1];
    const res   = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) router.refresh();
    else alert("Failed to delete user");
  };

  return (
    <button onClick={handleDelete}
      className="text-xs font-semibold hover:opacity-70 transition-opacity"
      style={{ color: "#e11d48" }}>
      Delete
    </button>
  );
}