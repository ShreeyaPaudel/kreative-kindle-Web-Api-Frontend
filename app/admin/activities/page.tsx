"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Activity {
  _id: string;
  title: string;
  category: string;
  age: string;
  duration: string;
  description: string;
  image: string;
  materials: string[];
  steps: string[];
}

const CAT_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Art:     { bg: "#fde8d8", color: "#b45309", border: "#fdd9b4" },
  Math:    { bg: "#f0fdf9", color: "#0f766e", border: "#99f6e4" },
  Reading: { bg: "#fce4ec", color: "#be185d", border: "#fbcfe8" },
  Science: { bg: "#ede8fd", color: "#6d28d9", border: "#ddd6fe" },
};

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find(r => r.startsWith(`${name}=`))?.split("=")[1] ?? null;
}

export default function AdminActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities`, {
      headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
    })
      .then(async r => {
        if (r.status === 401 || r.status === 403) { router.push("/auth/login"); return; }
        const d = await r.json();
        setActivities(Array.isArray(d) ? d : []);
      })
      .catch(() => showToast("Failed to load activities", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity? This cannot be undone.")) return;
    const token = getCookie("token");
    if (!token) return;
    setDeleting(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${decodeURIComponent(token)}` },
      });
      if (res.ok) {
        setActivities(prev => prev.filter(a => a._id !== id));
        showToast("Activity deleted", "success");
      } else {
        showToast("Failed to delete activity", "error");
      }
    } catch { showToast("Something went wrong", "error"); }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-xs font-semibold px-5 py-3 rounded-xl shadow-lg"
          style={{ background: toast.type === "success" ? "#f0fdf9" : "#fff5f5", color: toast.type === "success" ? "#0f766e" : "#b91c1c", border: `1px solid ${toast.type === "success" ? "#99f6e4" : "#fecaca"}` }}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>Activities</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>
            {loading ? "Loading..." : `${activities.length} activities · manage, edit or remove`}
          </p>
        </div>
        <Link href="/admin/activities/new"
          className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>
          + Add Activity
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <p className="text-sm animate-pulse" style={{ color: "#c0bab4" }}>Loading activities...</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <table className="w-full text-left">
            <thead style={{ background: "#faf8f5" }}>
              <tr>
                {["Activity", "Category", "Age", "Duration", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8a29e" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => {
                const cat = CAT_COLORS[a.category] ?? { bg: "#f5f5f4", color: "#78716c", border: "#e5e5e5" };
                return (
                  <tr key={a._id} style={{ borderTop: i === 0 ? "none" : "1px solid #f5f2ee" }}
                    className="transition-colors hover:bg-[#faf8f5]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background: cat.bg }}>
                          <img src={a.image} alt={a.title} className="w-full h-full object-contain p-1.5"
                            onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#1c1917" }}>{a.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                        style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
                        {a.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#78716c" }}>{a.age}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#78716c" }}>{a.duration}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/activities/${a._id}/edit`}
                          className="text-xs font-semibold hover:opacity-70 transition-opacity"
                          style={{ color: "#b45309" }}>Edit</Link>
                        <button onClick={() => handleDelete(a._id)} disabled={deleting === a._id}
                          className="text-xs font-semibold hover:opacity-70 transition-opacity disabled:opacity-40"
                          style={{ color: "#e11d48" }}>
                          {deleting === a._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {activities.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: "#a8a29e" }}>
                  No activities found. <Link href="/admin/activities/new" style={{ color: "#e8703a" }}>Add one →</Link>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}