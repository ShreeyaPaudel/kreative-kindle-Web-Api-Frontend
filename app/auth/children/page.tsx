"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Child {
  _id: string;
  name: string;
  age: number;
  avatar: string;
}

const AVATARS = ["🐱", "🐶", "🐼", "🦊", "🐨", "🐸", "🦁", "🐯", "🐻", "🦋"];

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find(r => r.startsWith(`${name}=`))?.split("=")[1] ?? null;
}

export default function ChildrenPage() {
  const router = useRouter();
  const [children, setChildren]   = useState<Child[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm]           = useState({ name: "", age: "", avatar: "🐱" });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getToken = () => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return null; }
    return decodeURIComponent(token);
  };

  const fetchChildren = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res  = await fetch(`${API}/api/children`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setChildren(Array.isArray(data) ? data : []);
    } catch { showToast("Failed to load children", "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.age) return showToast("Name and age are required", "error");
    const token = getToken();
    if (!token) return;

    const body = { name: form.name, age: Number(form.age), avatar: form.avatar };
    const url    = editChild ? `${API}/api/children/${editChild._id}` : `${API}/api/children`;
    const method = editChild ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast(editChild ? "Child updated!" : "Child added!", "success");
        setShowForm(false);
        setEditChild(null);
        setForm({ name: "", age: "", avatar: "🐱" });
        fetchChildren();
      } else {
        showToast("Something went wrong", "error");
      }
    } catch { showToast("Something went wrong", "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this child profile?")) return;
    const token = getToken();
    if (!token) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/api/children/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setChildren(prev => prev.filter(c => c._id !== id));
        showToast("Child removed", "success");
      }
    } catch { showToast("Something went wrong", "error"); }
    setDeleting(null);
  };

  const openEdit = (child: Child) => {
    setEditChild(child);
    setForm({ name: child.name, age: String(child.age), avatar: child.avatar || "🐱" });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditChild(null);
    setForm({ name: "", age: "", avatar: "🐱" });
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "32px 24px" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-xs font-semibold px-5 py-3 rounded-2xl shadow-lg"
          style={{ background: toast.type === "success" ? "#f0fdf9" : "#fff5f5", color: toast.type === "success" ? "#0f766e" : "#b91c1c", border: `1px solid ${toast.type === "success" ? "#99f6e4" : "#fecaca"}` }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1c1917" }}>My Children</h1>
            <p className="text-sm mt-1" style={{ color: "#a8a29e" }}>
              {loading ? "Loading..." : `${children.length} child profile${children.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button onClick={openAdd}
            className="text-sm font-bold px-5 py-2.5 rounded-2xl text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc)" }}>
            + Add Child
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="rounded-3xl p-8 w-full max-w-md shadow-2xl" style={{ background: "white" }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: "#1c1917" }}>
                {editChild ? "Edit Child Profile" : "Add Child Profile"}
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: "#a8a29e" }}>Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Child's name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#f7f6f4", border: "1px solid #ebe8e4", color: "#1c1917" }} />
              </div>

              {/* Age */}
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: "#a8a29e" }}>Age (1-12)</label>
                <input value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                  type="number" min={1} max={12} placeholder="Age"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#f7f6f4", border: "1px solid #ebe8e4", color: "#1c1917" }} />
              </div>

              {/* Avatar */}
              <div className="mb-6">
                <label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: "#a8a29e" }}>Pick an Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(a => (
                    <button key={a} onClick={() => setForm(p => ({ ...p, avatar: a }))}
                      className="w-10 h-10 rounded-xl text-xl transition-all"
                      style={{ background: form.avatar === a ? "#fde8d8" : "#f7f6f4", border: form.avatar === a ? "2px solid #f87171" : "2px solid transparent" }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={() => { setShowForm(false); setEditChild(null); }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "#f7f6f4", color: "#78716c" }}>
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc)" }}>
                  {editChild ? "Save Changes" : "Add Child"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Children Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-sm animate-pulse" style={{ color: "#c0bab4" }}>Loading profiles...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-20 rounded-3xl" style={{ background: "white", border: "1px solid #ebe8e4" }}>
            <div className="text-5xl mb-4">👶</div>
            <p className="text-sm font-medium mb-1" style={{ color: "#1c1917" }}>No children added yet</p>
            <p className="text-xs mb-6" style={{ color: "#a8a29e" }}>Add your child's profile to personalise their experience</p>
            <button onClick={openAdd}
              className="text-sm font-bold px-6 py-2.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc)" }}>
              Add First Child
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children.map(child => (
              <div key={child._id} className="rounded-3xl p-6 flex items-center gap-4 transition-shadow hover:shadow-md"
                style={{ background: "white", border: "1px solid #ebe8e4" }}>
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "#fde8d8" }}>
                  {child.avatar || "🐱"}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate" style={{ color: "#1c1917" }}>{child.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>Age {child.age}</p>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEdit(child)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-opacity hover:opacity-70"
                    style={{ background: "#fde8d8", color: "#b45309" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(child._id)} disabled={deleting === child._id}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-opacity hover:opacity-70 disabled:opacity-40"
                    style={{ background: "#fff5f5", color: "#e11d48" }}>
                    {deleting === child._id ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}