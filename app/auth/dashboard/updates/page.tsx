"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../../components/LogoutButton";

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

const MILESTONE_TAGS = [
  { label: "First time! 🌟" },
  { label: "Art project 🎨" },
  { label: "Reading win 📚" },
  { label: "Math success 🔢" },
  { label: "Science fun 🔬" },
  { label: "Proud moment 🏆" },
];

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ff-d { font-family: 'Playfair Display', Georgia, serif; }
  .ff-b { font-family: 'DM Sans', sans-serif; }
  @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes blobMorph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes heartPop  { 0%{transform:scale(1)} 40%{transform:scale(1.45)} 70%{transform:scale(.9)} 100%{transform:scale(1)} }
  .anim-1{animation:fadeUp .45s .05s ease both}
  .anim-2{animation:fadeUp .45s .12s ease both}
  .anim-3{animation:fadeUp .45s .2s ease both}
  .float-a{animation:floatUp 6s ease-in-out infinite}
  .float-b{animation:floatUp 8s 1.5s ease-in-out infinite}
  .blob{animation:blobMorph 9s ease-in-out infinite}
  .spin-slow{animation:spinSlow 35s linear infinite}
  .post-card{animation:fadeUp 0.4s ease forwards}
  .compose-in{animation:fadeIn 0.25s ease forwards}
  .nav-glass{background:rgba(250,248,245,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(253,186,116,.25)}
  .nav-link{position:relative}
  .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#f87171,#fb923c);transition:width .25s ease;border-radius:2px}
  .nav-link:hover::after,.nav-link.active::after{width:100%}
  .lift{transition:transform .2s ease,box-shadow .2s ease}
  .lift:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.07)}
  .like-btn{transition:transform .15s ease}
  .like-btn:active{animation:heartPop .35s ease}
  .tag-pill{transition:all .18s ease}
  .tag-pill:hover{transform:translateY(-1px) scale(1.03)}
  .shimmer-text{background:linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#f87171);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
  .card-hover{transition:transform .22s ease,box-shadow .22s ease}
  .card-hover:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.07)}
`;

// Original Avatar logic — untouched
function Avatar({ src, name, size = 40 }: { src?: string; name?: string; size?: number }) {
  const initials = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border-2"
      style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg,#fda4af,#fb923c)", borderColor: "#fcd9b6" }}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        : <span className="ff-b font-bold text-white" style={{ fontSize: size * 0.38 }}>{initials}</span>}
    </div>
  );
}

export default function UpdatesPage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [posts,        setPosts]        = useState<Post[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [caption,      setCaption]      = useState("");
  const [selectedTag,  setSelectedTag]  = useState<string | null>(null);
  const [image,        setImage]        = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posting,      setPosting]      = useState(false);
  const [toast,        setToast]        = useState<string | null>(null);
  const [toastType,    setToastType]    = useState<"success"|"error">("success");
  const [currentUser,  setCurrentUser]  = useState<any>(null);
  const [showCompose,  setShowCompose]  = useState(false);

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

  // ── original fetch/post/like/delete logic — untouched ──
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
      const fullCaption = selectedTag ? `${selectedTag} ${caption}` : caption;
      fd.append("caption", fullCaption);
      if (image) fd.append("image", image);
      const res  = await fetch(`${API}/api/posts`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [data.data, ...prev]);
        setCaption(""); setImage(null); setImagePreview(null);
        setSelectedTag(null); setShowCompose(false);
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

  const totalLikes    = posts.reduce((a, p) => a + p.likes.length, 0);
  const uniqueParents = new Set(posts.map(p => p.userId)).size;

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <style>{pageStyles}</style>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 ff-b text-xs font-bold px-6 py-3 rounded-2xl shadow-xl"
          style={{ background: toastType === "success" ? "#1c1917" : "#e11d48", color: "white", animation: "fadeUp .3s ease" }}>
          {toast}
        </div>
      )}

      {/* ═══ NAVBAR ═══ */}
      <nav className="nav-glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/auth/dashboard" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", filter: "blur(8px)", transform: "scale(1.1)" }} />
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2" style={{ borderColor: "rgba(251,146,60,.25)", background: "white" }}>
                  <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain p-1" />
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="ff-d font-bold text-sm leading-none" style={{ color: "#1c1917" }}>Kreative Kindle</p>
                <p className="ff-b text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "#c0bab4" }}>Learning Platform</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Home",       href: "/auth/dashboard",            active: false, emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", active: false, emoji: "🎨" },
                { label: "Updates",    href: "/auth/dashboard/updates",    active: true,  emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className={`nav-link ${l.active ? "active" : ""} ff-b flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all`}
                  style={{ color: l.active ? "#e8703a" : "#a8a29e", background: l.active ? "rgba(251,146,60,.08)" : "transparent" }}>
                  <span className="text-sm">{l.emoji}</span>{l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
            
              <Link href="/user/profile"
                className="w-9 h-9 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all hover:scale-105"
                style={{ borderColor: "#fcd9b6", boxShadow: "0 2px 12px rgba(251,146,60,.2)" }}>
                {currentUser?.image
                  ? <img src={currentUser.image} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#fda4af,#fb923c)" }}>
                      <span className="ff-b font-bold text-white text-xs">{currentUser?.username?.charAt(0).toUpperCase() ?? "?"}</span>
                    </div>}
              </Link>
              <LogoutButton className="ff-b hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white [background:linear-gradient(135deg,#f87171,#fb923c)]" />
            </div>
          </div>
          <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
            {[
              { label: "Home",       href: "/auth/dashboard" },
              { label: "Activities", href: "/auth/dashboard/activities" },
              { label: "Updates",    href: "/auth/dashboard/updates" },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className="flex-shrink-0 ff-b px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#a8a29e" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ HERO BANNER ═══ */}
      <section className="anim-1">
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg,#fff9f5 0%,#fef3ec 35%,#fde8f0 65%,#f5eeff 100%)",
          borderBottom: "1px solid rgba(253,186,116,.3)", minHeight: 240,
        }}>
          <div className="blob absolute pointer-events-none" style={{ top: -50, right: "8%", width: 240, height: 240, background: "radial-gradient(circle,rgba(253,164,175,.4),rgba(251,146,60,.15))", filter: "blur(50px)" }} />
          <div className="blob absolute pointer-events-none" style={{ bottom: -40, left: "5%", width: 200, height: 200, background: "radial-gradient(circle,rgba(196,181,253,.35),transparent)", filter: "blur(40px)", animationDelay: "4s" }} />
          <div className="spin-slow absolute pointer-events-none" style={{ top: -40, right: "22%", width: 210, height: 210, borderRadius: "50%", border: "2px dashed rgba(251,146,60,.12)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.12) 1px,transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4 }} />
          <div className="float-a absolute pointer-events-none text-4xl select-none" style={{ top: "10%", right: "36%", opacity: 0.13 }}>📢</div>
          <div className="float-b absolute pointer-events-none text-3xl select-none" style={{ bottom: "12%", right: "8%", opacity: 0.11 }}>🎉</div>
          <div className="float-a absolute pointer-events-none text-2xl select-none" style={{ top: "55%", left: "10%", opacity: 0.1 }}>🏆</div>

          <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 py-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ff-b"
              style={{ background: "rgba(255,255,255,.75)", border: "1px solid rgba(251,146,60,.25)", backdropFilter: "blur(10px)" }}>
              <span>📢</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#78716c" }}>Community</span>
            </div>
            <h1 className="ff-d font-bold leading-tight mb-2" style={{ fontSize: "clamp(2.2rem,5vw,3rem)", color: "#1c1917", fontStyle: "italic", letterSpacing: "-0.03em" }}>
              <span className="shimmer-text">Updates</span>
            </h1>
            <p className="ff-b text-sm" style={{ color: "#78716c", maxWidth: 320, margin: "0 auto" }}>
              A shared space for parents to celebrate their children's milestones.
            </p>
            {!loading && (
              <div className="flex justify-center gap-4 mt-7 flex-wrap">
                {[
                  { value: posts.length,  label: "Posts",   icon: "📝" },
                  { value: totalLikes,    label: "Likes",   icon: "♥" },
                  { value: uniqueParents, label: "Parents", icon: "👨‍👩‍👧" },
                ].map((s) => (
                  <div key={s.label} className="text-center px-5 py-3 rounded-2xl"
                    style={{ background: "rgba(255,255,255,.7)", border: "1px solid rgba(253,186,116,.2)", backdropFilter: "blur(8px)" }}>
                    <p className="text-lg mb-0.5">{s.icon}</p>
                    <p className="ff-d font-bold text-xl" style={{ color: "#1c1917", lineHeight: 1 }}>{s.value}</p>
                    <p className="ff-b text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: "#c0bab4" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FEED ═══ */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── COMPOSE ── */}
        <div className="anim-2 rounded-3xl overflow-hidden" style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          {!showCompose ? (
            <button onClick={() => setShowCompose(true)} className="w-full flex items-center gap-4 p-5 hover:bg-[#faf8f5] transition-colors">
              <Avatar src={currentUser?.image} name={currentUser?.username} size={44} />
              <div className="flex-1 rounded-2xl px-4 py-3 text-sm text-left ff-b" style={{ background: "#faf8f5", border: "1px solid #f0ebe4", color: "#c0bab4" }}>
                What did your child accomplish today?
              </div>
              <div className="flex-shrink-0 px-4 py-2.5 rounded-2xl ff-b text-xs font-bold uppercase tracking-widest text-white"
                style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 3px 12px rgba(248,113,113,.25)" }}>
                Post
              </div>
            </button>
          ) : (
            <div className="p-6 compose-in space-y-4">
              <div className="flex items-center gap-3">
                <Avatar src={currentUser?.image} name={currentUser?.username} size={44} />
                <div>
                  <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>{currentUser?.username ?? "You"}</p>
                  <p className="ff-b text-[10px] uppercase tracking-widest capitalize" style={{ color: "#c0bab4" }}>{currentUser?.role ?? "Parent"}</p>
                </div>
              </div>

              {/* milestone tags */}
              <div>
                <p className="ff-b text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#c0bab4" }}>Tag a milestone</p>
                <div className="flex flex-wrap gap-2">
                  {MILESTONE_TAGS.map(tag => (
                    <button key={tag.label} onClick={() => setSelectedTag(selectedTag === tag.label ? null : tag.label)}
                      className="tag-pill ff-b text-[10px] font-bold px-3 py-1.5 rounded-xl border"
                      style={{
                        background:  selectedTag === tag.label ? "#1c1917" : "#faf8f5",
                        color:       selectedTag === tag.label ? "white"   : "#78716c",
                        borderColor: selectedTag === tag.label ? "#1c1917" : "#f0ebe4",
                      }}>
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share a milestone, an achievement, or a proud moment..."
                rows={4}
                maxLength={500}
                className="w-full rounded-2xl px-5 py-4 ff-b text-sm leading-relaxed resize-none focus:outline-none"
                style={{ background: "#faf8f5", border: "1.5px solid #f0ebe4", color: "#374151" }}
                onFocus={e => e.target.style.borderColor = "#fca5a5"}
                onBlur={e  => e.target.style.borderColor = "#f0ebe4"}
              />
              <p className="ff-b text-[10px] text-right -mt-2 font-semibold" style={{ color: caption.length > 450 ? "#f87171" : "#c0bab4" }}>
                {caption.length}/500
              </p>

              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ebe4" }}>
                  <img src={imagePreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: 260 }} />
                  <button onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}>✕</button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #f0ebe4" }}>
                <button onClick={() => fileRef.current?.click()}
                  className="lift flex items-center gap-2 px-4 py-2.5 rounded-2xl ff-b text-xs font-bold uppercase tracking-widest"
                  style={{ background: "#fff9f5", border: "1px solid #fdd9b4", color: "#e8703a" }}>
                  📷 Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex items-center gap-2">
                  <button onClick={() => { setShowCompose(false); setCaption(""); setImage(null); setImagePreview(null); setSelectedTag(null); }}
                    className="ff-b px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest"
                    style={{ background: "#faf8f5", border: "1px solid #f0ebe4", color: "#a8a29e" }}>
                    Cancel
                  </button>
                  <button onClick={handlePost} disabled={posting || !caption.trim()}
                    className="lift ff-b px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#f87171,#fb923c)", boxShadow: "0 3px 12px rgba(248,113,113,.25)" }}>
                    {posting ? "Sharing..." : "Share ✨"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── POSTS ── */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-pulse">📢</div>
            <p className="ff-b text-xs font-bold uppercase tracking-widest" style={{ color: "#c0bab4" }}>Loading updates...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="anim-3 rounded-3xl p-16 text-center" style={{ background: "white", border: "1px solid #f0ebe4" }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl blob"
              style={{ background: "linear-gradient(135deg,#fde8d8,#fce4ec)" }}>📢</div>
            <p className="ff-d font-bold text-xl mb-1" style={{ color: "#1c1917", fontStyle: "italic" }}>No updates yet</p>
            <p className="ff-b text-xs" style={{ color: "#a8a29e" }}>Be the first to share a milestone!</p>
          </div>
        ) : posts.map((post, idx) => (
          <div key={post._id} className="card-hover post-card rounded-3xl overflow-hidden"
            style={{ background: "white", border: "1px solid #f0ebe4", boxShadow: "0 4px 20px rgba(0,0,0,.04)", animationDelay: `${idx * 0.06}s` }}>

            {/* post image — original src untouched */}
            {post.image && (
              <div className="relative" style={{ background: "#faf8f5" }}>
                <img src={post.image} alt="Post" className="w-full object-cover" style={{ maxHeight: 320 }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top,rgba(255,255,255,.5) 0%,transparent 40%)" }} />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar src={post.userImage} name={post.username} size={44} />
                  <div>
                    <p className="ff-d font-bold text-sm" style={{ color: "#1c1917" }}>{post.username || "Parent"}</p>
                    <p className="ff-b text-[10px]" style={{ color: "#c0bab4" }}>{timeAgo(post.createdAt)}</p>
                  </div>
                </div>
                {isOwner(post) && (
                  <button onClick={() => handleDelete(post._id)}
                    className="ff-b text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                    style={{ color: "#f87171", background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.15)" }}>
                    Delete
                  </button>
                )}
              </div>

              <p className="ff-b text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>{post.caption}</p>

              <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid #f0ebe4" }}>
                <button onClick={() => handleLike(post._id)} className="like-btn flex items-center gap-2">
                  <span className="text-xl" style={{ display: "inline-block", color: isLiked(post) ? "#f87171" : "#d1ccc8" }}>
                    {isLiked(post) ? "♥" : "♡"}
                  </span>
                  <span className="ff-b text-xs font-bold uppercase tracking-widest" style={{ color: isLiked(post) ? "#f87171" : "#c0bab4" }}>
                    {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                  </span>
                </button>
                {isOwner(post)
                  ? <span className="ff-b text-[10px] ml-auto px-2 py-1 rounded-lg" style={{ background: "#f0fdf9", color: "#16a34a" }}>✓ Your post</span>
                  : <span className="ff-b text-[10px] ml-auto" style={{ color: "#d1ccc8" }}>by <span style={{ color: "#a8a29e", fontWeight: 600 }}>{post.username}</span></span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-10" style={{ background: "#1c1917" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#f87171,#fb923c,#fbbf24,#34d399,#818cf8,#f87171)", backgroundSize: "200% 100%", animation: "shimmer 6s linear infinite" }} />
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff9f5,#fef3ec,#fde8f0)", paddingTop: 40, paddingBottom: 40 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(251,146,60,.15) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#c0bab4" }}>Kreative Kindle</p>
            <h3 className="ff-d font-bold text-2xl mb-6" style={{ color: "#1c1917", fontStyle: "italic" }}>Built for Curious Minds ✨</h3>
            <div className="flex justify-center flex-wrap gap-3">
              {[
                { label: "Dashboard",  href: "/auth/dashboard",            emoji: "🏠" },
                { label: "Activities", href: "/auth/dashboard/activities", emoji: "🎨" },
                { label: "Progress",   href: "/auth/dashboard/progress",   emoji: "📊" },
                { label: "Favourites", href: "/auth/dashboard/favourites", emoji: "⭐" },
                { label: "Updates",    href: "/auth/dashboard/updates",    emoji: "📢" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className="ff-b text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,.7)", color: "#78716c", border: "1px solid rgba(253,186,116,.3)", backdropFilter: "blur(8px)" }}>
                  <span>{l.emoji}</span>{l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl overflow-hidden"><img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" /></div>
                <span className="ff-d text-sm font-bold text-white">Kreative Kindle</span>
              </div>
              <p className="ff-b text-xs leading-relaxed" style={{ color: "#78716c", maxWidth: 200 }}>Fun, meaningful activities crafted for curious early learners.</p>
              <div className="flex gap-2">
                {["📘","📷","💬"].map((icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110" style={{ background: "#292524" }}>{icon}</a>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#57534e" }}>Contact</p>
              <p className="ff-b text-xs" style={{ color: "#78716c" }}>📞 +977-9813760646</p>
              <p className="ff-b text-xs" style={{ color: "#78716c" }}>✉️ Xyz@Gmail.Com</p>
            </div>
            <div>
              <p className="ff-b text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#57534e" }}>Version</p>
              <div className="p-3 rounded-2xl" style={{ background: "#292524", border: "1px solid #333" }}>
                <p className="ff-b text-xs" style={{ color: "#78716c" }}>Kreative Kindle v1.0 · 2025</p>
                <p className="ff-b text-[10px] mt-1" style={{ color: "#57534e" }}>Built with ❤️ for early learners</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px" style={{ background: "#292524" }} />
            <div className="w-7 h-7 rounded-full flex items-center justify-center ff-d text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#f87171,#fb923c)" }}>K</div>
            <div className="flex-1 h-px" style={{ background: "#292524" }} />
          </div>
          <p className="ff-b text-xs text-center" style={{ color: "#44403c" }}>© 2025 Kreative Kindle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}