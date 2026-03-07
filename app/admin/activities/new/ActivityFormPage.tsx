"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Art", "Math", "Reading", "Science"];
const AGE_GROUPS  = ["Ages 2–5", "Ages 3–6", "Ages 4–7", "Ages 5–9", "Ages 6–10"];
const DURATIONS   = ["15 min", "20 min", "25 min", "30 min", "35 min", "40 min", "45 min", "60 min"];

interface ActivityForm {
  title: string;
  category: string;
  age: string;
  duration: string;
  description: string;
  image: string;
  materials: string;
  steps: string;
}

const EMPTY: ActivityForm = {
  title: "", category: "Art", age: "Ages 3–6", duration: "30 min",
  description: "", image: "", materials: "", steps: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: 12, border: "1px solid #ebe8e4",
  padding: "10px 14px", fontSize: 14, color: "#1c1917",
  background: "#faf8f5", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: "#a8a29e", marginBottom: 6,
};

// ── helper ──
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find(r => r.startsWith(`${name}=`))?.split("=")[1] ?? null;
}

export default function ActivityFormPage({ initialData, activityId }: { initialData?: Partial<ActivityForm>; activityId?: string }) {
  const router    = useRouter();
  const isEdit    = !!activityId;
  const [form,    setForm]    = useState<ActivityForm>({ ...EMPTY, ...initialData });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: "success"|"error" } | null>(null);

  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const set = (key: keyof ActivityForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast("Title is required", "error"); return; }

    setLoading(true);

    const activity = {
      ...form,
      materials: form.materials.split("\n").map(s => s.trim()).filter(Boolean),
      steps:     form.steps.split("\n").map(s => s.trim()).filter(Boolean),
    };

    try {
      const token = getCookie("token");
      const url   = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/activities/${activityId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/activities`;
      const res  = await fetch(url, {
        method:  isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeURIComponent(token!)}`,
        },
        body: JSON.stringify(activity),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        showToast(data?.message || "Failed to save activity", "error");
        setLoading(false);
        return;
      }
      showToast(isEdit ? "Activity updated!" : "Activity added!", "success");
      setTimeout(() => router.push("/admin/activities"), 800);
    } catch {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-xs font-semibold px-5 py-3 rounded-xl shadow-lg"
          style={{ background: toast.type === "success" ? "#f0fdf9" : "#fff5f5", color: toast.type === "success" ? "#0f766e" : "#b91c1c", border: `1px solid ${toast.type === "success" ? "#99f6e4" : "#fecaca"}` }}>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#a8a29e" }}>
        <Link href="/admin/activities" className="hover:opacity-70" style={{ color: "#78716c" }}>Activities</Link>
        <span>›</span>
        <span style={{ color: "#1c1917" }}>{isEdit ? "Edit Activity" : "Add Activity"}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>{isEdit ? "Edit Activity" : "Add New Activity"}</h1>
        <Link href="/admin/activities"
          className="text-xs font-semibold px-3 py-2 rounded-lg"
          style={{ background: "white", border: "1px solid #ebe8e4", color: "#78716c" }}>
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl p-6 space-y-5" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8a29e" }}>Basic Info</p>

          <div>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Rainbow Watercolour Art" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#fca5a5"}
              onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={set("category")} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age Group</label>
              <select value={form.age} onChange={set("age")} style={inputStyle}>
                {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duration</label>
              <select value={form.duration} onChange={set("duration")} style={inputStyle}>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3}
              placeholder="Brief description of the activity..."
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = "#fca5a5"}
              onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
          </div>

          <div>
            <label style={labelStyle}>Image path</label>
            <input value={form.image} onChange={set("image")} placeholder="/images/myactivity.png" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#fca5a5"}
              onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
            <p className="text-[10px] mt-1" style={{ color: "#c0bab4" }}>Place image in /public/images/ and enter path here</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 space-y-5" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8a29e" }}>Content</p>

          <div>
            <label style={labelStyle}>Materials (one per line)</label>
            <textarea value={form.materials} onChange={set("materials")} rows={5}
              placeholder={"Watercolour paints\nPaintbrush\nWhite paper\nCup of water"}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
              onFocus={e => e.target.style.borderColor = "#fca5a5"}
              onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
          </div>

          <div>
            <label style={labelStyle}>Steps (one per line)</label>
            <textarea value={form.steps} onChange={set("steps")} rows={7}
              placeholder={"Lay paper flat on table\nWet brush and dip into first colour\n..."}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
              onFocus={e => e.target.style.borderColor = "#fca5a5"}
              onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Activity"}
        </button>
      </form>
    </div>
  );
}