"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  _id: string;
  userId: string;
  username: string;
  userImage: string;
  caption: string;
  image?: string;
  likes: string[];
  createdAt: string;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find(r => r.startsWith(`${name}=`))?.split("=")[1] ?? null;
}
function timeAgo(d: string) {
  const diff  = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const API = "http://localhost:3001";

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const [search,   setSearch]   = useState("");

  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) { router.push("/auth/login"); return; }
    fetch(`${API}/api/posts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const token = getCookie("token");
    if (!token) return;
    setDeleting(postId);
    try {
      const res = await fetch(`${API}/api/posts/${postId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        showToast("Post deleted", "success");
      } else {
        showToast("Failed to delete post", "error");
      }
    } catch { showToast("Something went wrong", "error"); }
    setDeleting(null);
  };

  const filtered = posts.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase()) ||
    p.caption?.toLowerCase().includes(search.toLowerCase())
  );

  const totalLikes = posts.reduce((a, p) => a + p.likes.length, 0);

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
          <h1 className="text-xl font-bold" style={{ color: "#1c1917" }}>Post Moderation</h1>
          <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>Review and remove community posts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Posts",    value: posts.length,                                     icon: "📝", style: "background:#faf8f5;border:1px solid #ebe8e4" },
          { label: "Total Likes",    value: totalLikes,                                        icon: "♥",  style: "background:#fff5f5;border:1px solid #fecaca" },
          { label: "Unique Authors", value: new Set(posts.map(p => p.userId)).size,            icon: "👤", style: "background:#f0fdf9;border:1px solid #99f6e4" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ ...Object.fromEntries(s.style.split(";").map(p => p.split(":").map(v => v.trim()))) }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{s.icon}</span>
              <span className="text-xs font-semibold" style={{ color: "#a8a29e" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1c1917" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by username or caption..."
          style={{ width: "100%", borderRadius: 12, border: "1px solid #ebe8e4", padding: "10px 14px", fontSize: 14, color: "#1c1917", background: "white", outline: "none" }}
          onFocus={e => e.target.style.borderColor = "#fca5a5"}
          onBlur={e  => e.target.style.borderColor = "#ebe8e4"} />
      </div>

      {loading ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <p className="text-sm animate-pulse" style={{ color: "#c0bab4" }}>Loading posts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <p className="text-2xl mb-2">📢</p>
          <p className="text-sm font-semibold" style={{ color: "#1c1917" }}>{search ? "No matching posts" : "No posts yet"}</p>
          <p className="text-xs mt-1" style={{ color: "#a8a29e" }}>Community posts will appear here for moderation</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #ebe8e4" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #ebe8e4", background: "#faf8f5" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8a29e" }}>
              {filtered.length} {filtered.length === 1 ? "post" : "posts"} {search && `matching "${search}"`}
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: "#f5f2ee" }}>
            {filtered.map(post => (
              <div key={post._id} className="p-5 transition-colors hover:bg-[#faf8f5]">
                <div className="flex items-start gap-4">
                  {/* avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "#fde8d8", color: "#b45309" }}>
                    {post.username?.charAt(0).toUpperCase() ?? "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>{post.username || "Unknown"}</span>
                      <span className="text-[10px]" style={{ color: "#c0bab4" }}>{timeAgo(post.createdAt)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: "#fff5f5", color: "#e11d48" }}>
                        ♥ {post.likes.length}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "#44403c" }}>{post.caption}</p>
                    {post.image && (
                      <div className="mt-2 mb-2">
                        <img src={post.image} alt="Post" className="rounded-xl object-cover"
                          style={{ maxHeight: 160, maxWidth: 240, border: "1px solid #ebe8e4" }} />
                      </div>
                    )}
                    <p className="text-[10px] font-mono" style={{ color: "#c0bab4" }}>ID: {post._id}</p>
                  </div>

                  <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id}
                    className="flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all hover:opacity-80 disabled:opacity-40"
                    style={{ background: "#fff5f5", color: "#e11d48", border: "1px solid #fecaca" }}>
                    {deleting === post._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}