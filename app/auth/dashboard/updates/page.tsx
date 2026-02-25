"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}
function getUserFromCookie(): any {
  const raw = getCookie("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

const API = "http://localhost:3001";

// Soft pastel blobs for background atmosphere
function FloatingBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(253,200,200,0.18) 0%, transparent 70%)",
        animation: "floatA 18s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "30%", right: "-8%",
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,230,220,0.15) 0%, transparent 70%)",
        animation: "floatB 22s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "20%",
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,210,250,0.13) 0%, transparent 70%)",
        animation: "floatC 26s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-40px, 30px) scale(1.04); }
          70%       { transform: translate(20px, -20px) scale(0.98); }
        }
        @keyframes floatC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(25px, -35px) scale(1.06); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .post-card {
          animation: fadeSlideUp 0.4s ease forwards;
        }
        .compose-expanded {
          animation: popIn 0.25s ease forwards;
        }
        .like-btn:active { transform: scale(1.3); }
        .like-btn { transition: transform 0.15s ease, color 0.2s ease; }
      `}</style>
    </div>
  );
}

export default function UpdatesPage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts]               = useState<Post[]>([]);
  const [loading, setLoading]           = useState(true);
  const [caption, setCaption]           = useState("");
  const [image, setImage]               = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting, setPosting]           = useState(false);
  const [toast, setToast]               = useState<string | null>(null);
  const [toastType, setToastType]       = useState<"success"|"error">("success");
  const [currentUser, setCurrentUser]   = useState<any>(null);
  const [showCompose, setShowCompose]   = useState(false);

  const showToast = (msg: string, type: "success"|"error" = "success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getCookie("token");
    const user  = getUserFromCookie();
    if (!token || !user) { router.push("/auth/login"); return; }
    setCurrentUser(user);
    fetchPosts(token);
  }, []);

  const fetchPosts = async (token: string) => {
    try {
      const res  = await fetch(`${API}/api/posts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePost = async () => {
    const token = getCookie("token");
    if (!token || !caption.trim()) { showToast("Write something first!", "error"); return; }
    setPosting(true);
    try {
      const fd = new FormData();
      fd.append("caption", caption);
      if (image) fd.append("image", image);
      const res  = await fetch(`${API}/api/posts`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [data.data, ...prev]);
        setCaption(""); setImage(null); setImagePreview(null); setShowCompose(false);
        showToast("Update shared with the community! 🎉");
      } else showToast(data.message || "Failed to post", "error");
    } catch { showToast("Something went wrong", "error"); }
    setPosting(false);
  };

  const handleLike = async (postId: string) => {
    const token = getCookie("token");
    if (!token) return;
    try {
      const res  = await fetch(`${API}/api/posts/${postId}/like`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, likes: Array(data.likes).fill("") } : p));
    } catch {}
  };

  const handleDelete = async (postId: string) => {
    const token = getCookie("token");
    if (!token) return;
    try {
      await fetch(`${API}/api/posts/${postId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      showToast("Post removed");
    } catch { showToast("Something went wrong", "error"); }
  };

  const isLiked = (post: Post) => {
    const uid = currentUser?._id || currentUser?.id;
    return post.likes.some((l: any) => String(l) === String(uid) || String(l?._id) === String(uid));
  };
  const isOwner = (post: Post) => {
    const uid = currentUser?._id || currentUser?.id;
    return String(post.userId) === String(uid);
  };

  const Avatar = ({ src, name, size = 10 }: { src?: string; name?: string; size?: number }) => (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm`}
      style={{ background: "linear-gradient(135deg, #f9a8d4, #fb923c)", minWidth: size * 4, minHeight: size * 4 }}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" />
           : <svg xmlns="http://www.w3.org/2000/svg" className="text-white" style={{ width: size * 1.8, height: size * 1.8 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>}
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ background: "#faf8f5", fontFamily: "'Georgia', serif" }}>
      <FloatingBlobs />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-widest transition-all"
          style={{
            background: toastType === "success" ? "linear-gradient(135deg, #1a1a1a, #2d2d2d)" : "#e11d48",
            color: "white", animation: "fadeSlideUp 0.3s ease forwards",
          }}>
          {toast}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30" style={{ backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.92)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-bold text-gray-800 hidden sm:block" style={{ fontFamily: "'Georgia', serif" }}>Kreative Kindle</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Home",       href: "/auth/dashboard" },
              { label: "Activities", href: "/auth/dashboard/activities" },
              { label: "Updates",    href: "/auth/dashboard/updates", active: true },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${l.active ? "text-rose-400 border-b-2 border-rose-300 pb-0.5" : "text-gray-400 hover:text-rose-400"}`}
                style={{ fontFamily: "sans-serif" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/user/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-rose-100 shadow-sm" style={{ minWidth: 36 }}>
            {currentUser?.image
              ? <img src={currentUser.image} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f9a8d4, #fb923c)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>}
          </Link>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div className="relative overflow-hidden" style={{ background: "white", borderBottom: "1px solid #f0ede8" }}>
        {/* Decorative gradient strip */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(253,200,200,0.12) 0%, rgba(200,230,220,0.10) 50%, rgba(220,210,250,0.10) 100%)"
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(251,146,60,0.08), transparent 70%)" }} />
        <div className="absolute -bottom-6 left-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,168,212,0.10), transparent 70%)" }} />

        <div className="relative max-w-2xl mx-auto px-6 py-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#f87171", fontFamily: "sans-serif" }}>Community</p>
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif", fontStyle: "italic", letterSpacing: "-0.02em" }}>
            Updates
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#9ca3af", fontFamily: "sans-serif" }}>
            A shared space for parents to celebrate their children's milestones.
          </p>

          {/* Stats strip */}
          <div className="flex justify-center gap-8 mt-8">
            {[
              { value: posts.length, label: "Posts" },
              { value: posts.reduce((a, p) => a + p.likes.length, 0), label: "Likes" },
              { value: new Set(posts.map(p => p.userId)).size, label: "Parents" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>{s.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "#d1d5db", fontFamily: "sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* COMPOSE CARD */}
        <div className="rounded-3xl overflow-hidden shadow-sm" style={{ background: "white", border: "1px solid #f0ede8" }}>
          {!showCompose ? (
            <button onClick={() => setShowCompose(true)} className="w-full flex items-center gap-4 p-5 hover:bg-[#faf8f5] transition-colors">
              <Avatar src={currentUser?.image} name={currentUser?.username} size={10} />
              <div className="flex-1 rounded-2xl px-4 py-3 text-sm text-left" style={{ background: "#faf8f5", border: "1px solid #ede9e4", color: "#d1d5db", fontFamily: "sans-serif" }}>
                What did your child accomplish today?
              </div>
              <div className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white" style={{ background: "linear-gradient(135deg, #fb7185, #fb923c)", fontFamily: "sans-serif" }}>
                Post
              </div>
            </button>
          ) : (
            <div className="p-6 compose-expanded space-y-5">
              {/* User row */}
              <div className="flex items-center gap-3">
                <Avatar src={currentUser?.image} name={currentUser?.username} size={11} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{currentUser?.username}</p>
                  <p className="text-[10px] uppercase tracking-widest capitalize" style={{ color: "#9ca3af", fontFamily: "sans-serif" }}>{currentUser?.role || "Parent"}</p>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share a milestone, an achievement, or a proud moment..."
                rows={4}
                maxLength={500}
                className="w-full rounded-2xl px-5 py-4 text-sm leading-relaxed resize-none focus:outline-none transition-all"
                style={{
                  background: "#faf8f5", border: "1.5px solid #ede9e4", color: "#374151",
                  fontFamily: "sans-serif",
                }}
                onFocus={(e) => e.target.style.borderColor = "#fca5a5"}
                onBlur={(e) => e.target.style.borderColor = "#ede9e4"}
              />
              <div className="flex justify-between items-center -mt-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: caption.length > 450 ? "#f87171" : "#d1d5db", fontFamily: "sans-serif" }}>{caption.length}/500</span>
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ede8" }}>
                  <img src={imagePreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: 280 }} />
                  <button onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>✕</button>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: "inset 0 -40px 40px rgba(250,248,245,0.6)" }} />
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid #f5f2ee" }}>
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all hover:scale-105"
                  style={{ background: "#fdf6f0", border: "1px solid #fde8d8", color: "#b45309", fontFamily: "sans-serif" }}>
                  📷 Add Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                <div className="flex items-center gap-2">
                  <button onClick={() => { setShowCompose(false); setCaption(""); setImage(null); setImagePreview(null); }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors"
                    style={{ background: "#faf8f5", border: "1px solid #ede9e4", color: "#9ca3af", fontFamily: "sans-serif" }}>
                    Cancel
                  </button>
                  <button onClick={handlePost} disabled={posting || !caption.trim()}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all hover:shadow-md disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #fb7185, #fb923c)", fontFamily: "sans-serif" }}>
                    {posting ? "Sharing..." : "Share Update"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FEED */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fde8d8, #fce4ec)", animation: "floatA 3s ease-in-out infinite" }}>
                <span className="text-xl">📢</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#d1d5db", fontFamily: "sans-serif" }}>Loading updates...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl p-16 text-center" style={{ background: "white", border: "1px solid #f0ede8" }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, #fde8d8, #fce4ec)" }}>📢</div>
            <p className="text-base font-bold mb-1" style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>No updates yet</p>
            <p className="text-xs" style={{ color: "#9ca3af", fontFamily: "sans-serif" }}>Be the first to share a milestone!</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div key={post._id} className="post-card rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              style={{ background: "white", border: "1px solid #f0ede8", animationDelay: `${idx * 0.06}s` }}>

              {/* Post image — full bleed at top if present */}
              {post.image && (
                <div className="relative" style={{ background: "#f5f2ee" }}>
                  <img src={post.image} alt="Post" className="w-full object-cover" style={{ maxHeight: 320 }} />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.7) 0%, transparent 40%)" }} />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={post.userImage} name={post.username} size={10} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{post.username}</p>
                      <p className="text-[10px]" style={{ color: "#9ca3af", fontFamily: "sans-serif" }}>{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  {isOwner(post) && (
                    <button onClick={() => handleDelete(post._id)}
                      className="text-[10px] font-semibold uppercase tracking-widest transition-colors hover:opacity-80 px-3 py-1.5 rounded-lg"
                      style={{ color: "#f87171", background: "#fff1f2", fontFamily: "sans-serif" }}>
                      Delete
                    </button>
                  )}
                </div>

                {/* Caption */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#374151", fontFamily: "sans-serif" }}>{post.caption}</p>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #f5f2ee", paddingTop: 12 }}>
                  <button onClick={() => handleLike(post._id)} className="like-btn flex items-center gap-2">
                    <span className="text-lg transition-transform" style={{ display: "inline-block" }}>
                      {isLiked(post) ? "♥" : "♡"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: isLiked(post) ? "#fb7185" : "#d1d5db", fontFamily: "sans-serif" }}>
                      {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 mt-10" style={{ background: "#111827" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>Kreative Kindle</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280", maxWidth: 180, fontFamily: "sans-serif" }}>Fun, meaningful activities for early learners.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4b5563", fontFamily: "sans-serif" }}>Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Dashboard",  href: "/auth/dashboard" },
                  { label: "Activities", href: "/auth/dashboard/activities" },
                  { label: "Progress",   href: "/auth/dashboard/progress" },
                  { label: "Updates",    href: "/auth/dashboard/updates" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="text-xs hover:text-white transition-colors" style={{ color: "#6b7280", fontFamily: "sans-serif" }}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4b5563", fontFamily: "sans-serif" }}>Contact</p>
              <p className="text-xs" style={{ color: "#6b7280", fontFamily: "sans-serif" }}>+977-9813760646</p>
              <p className="text-xs" style={{ color: "#6b7280", fontFamily: "sans-serif" }}>Xyz@Gmail.Com</p>
            </div>
          </div>
          <div className="pt-6 text-center" style={{ borderTop: "1px solid #1f2937" }}>
            <p className="text-xs" style={{ color: "#374151", fontFamily: "sans-serif" }}>© 2025 Kreative Kindle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}