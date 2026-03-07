"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AnyUser = { _id?: string; id?: string; username?: string; name?: string; fullName?: string; email?: string; role?: string; };

function getCookie(name: string) {
  return document.cookie.split("; ").find(r => r.startsWith(`${name}=`))?.split("=")[1];
}

export default function EditUserForm({ user, userId }: { user: AnyUser; userId: string }) {
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [username, setUsername] = useState(user.username || user.name || user.fullName || "");
  const [email,    setEmail]    = useState(user.email || "");
  const [role,     setRole]     = useState(user.role || "parent");

  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${decodeURIComponent(token)}` },
        body: JSON.stringify({ username, email, role }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast(data?.message || "Failed to update user", "error"); setLoading(false); return; }
      showToast("User updated successfully!", "success");
      setTimeout(() => { router.push(`/admin/users/${userId}`); router.refresh(); }, 800);
    } catch { showToast("Something went wrong", "error"); setLoading(false); }
  };

  const inputStyle = {
    width: "100%", borderRadius: 12, border: "1px solid #ebe8e4",
    padding: "10px 14px", fontSize: 14, color: "#1c1917",
    background: "#faf8f5", outline: "none", transition: "border-color .15s",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && (
        <div className="rounded-xl px-4 py-3 text-xs font-semibold"
          style={{ background: toast.type === "success" ? "#f0fdf9" : "#fff5f5", color: toast.type === "success" ? "#0f766e" : "#b91c1c", border: `1px solid ${toast.type === "success" ? "#99f6e4" : "#fecaca"}` }}>
          {toast.msg}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#a8a29e" }}>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#fca5a5"}
          onBlur={e  => e.target.style.borderColor = "#ebe8e4"}
          placeholder="Enter username" />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#a8a29e" }}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#fca5a5"}
          onBlur={e  => e.target.style.borderColor = "#ebe8e4"}
          placeholder="Enter email" />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#a8a29e" }}>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
          <option value="parent">parent</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white disabled:opacity-60 transition-opacity"
          style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest"
          style={{ background: "#faf8f5", border: "1px solid #ebe8e4", color: "#78716c" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}