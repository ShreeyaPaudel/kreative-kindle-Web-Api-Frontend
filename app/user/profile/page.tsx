"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserFromCookie, getTokenFromCookie, clearAuth } from "@/lib/authCookies";
import { updateUserProfile } from "@/lib/userApi";

type User = {
  id: string;
  email: string;
  username: string;
  role?: string;
  image?: string;
};

const FAQ = [
  { q: "How do I save an activity to favourites?", a: "Open any activity and press the ♡ Save to Favourites button on the detail page. You can view all saved activities in the Favourites section." },
  { q: "How is my child's progress tracked?", a: "When you press 'Finish Activity' at the bottom of any activity page, it is recorded in your Progress section with the date and category." },
  { q: "Can I undo a completed activity?", a: "Yes! Go to My Progress, find the activity in the completed list, and press the Undo button next to it." },
  { q: "How do I update my profile picture?", a: "Open the Account section below, click 'Choose File' next to Profile Image, select your photo, and press Save Changes." },
  { q: "Who can see my profile and progress?", a: "Only you can see your profile, progress and favourites. Each account is private and secured with your login credentials." },
  { q: "How do I log out?", a: "Press the Logout button at the bottom of this page, or use the Logout button in the navigation bar." },
];

function getCookieClient(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const API = "http://localhost:3001";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser]             = useState<User | null>(null);
  const [email, setEmail]           = useState("");
  const [username, setUsername]     = useState("");
  const [image, setImage]           = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  // Accordion open states
  const [accountOpen, setAccountOpen] = useState(false);
  const [faqOpen, setFaqOpen]         = useState(false);
  const [aboutOpen, setAboutOpen]     = useState(false);
  const [openFaq, setOpenFaq]         = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    const storedUser = getUserFromCookie();
    if (!token || !storedUser) { router.push("/auth/login"); return; }
    setUser(storedUser);
    setEmail(storedUser.email || "");
    setUsername(storedUser.username || "");
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      if (image) formData.append("image", image);
      const res = await updateUserProfile((user as any)._id || user.id, formData);
      showToast("Profile updated successfully! ✅");
     if (res?.user) {
  setUser(res.user);
  setEmail(res.user.email || "");
  setUsername(res.user.username || "");

  document.cookie = `user=${encodeURIComponent(JSON.stringify(res.user))}; path=/`;

if (res.user.image) {
  setPreviewUrl(res.user.image);
}
}
      setAccountOpen(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  // Profile image URL
  const profileImageUrl = previewUrl
    || (user?.image ? user.image : null);

  // Joined year from cookie (approximate)
  const joinedYear = new Date().getFullYear();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-sm text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-bold text-gray-800 hidden sm:block">Kreative Kindle</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/auth/dashboard" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Home</Link>
            <Link href="/auth/dashboard/activities" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Activities</Link>
            <Link href="/auth/dashboard/updates" className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors">Updates</Link>
          </div>
          {/* Navbar profile picture */}
          <Link href="/user/profile"
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-rose-200 flex items-center justify-center bg-gradient-to-br from-rose-300 to-orange-200 flex-shrink-0">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </Link>
        </div>
      </nav>

      {/* HEADER — profile card */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-10 text-center">

          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gradient-to-br from-rose-200 to-orange-100 flex items-center justify-center">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            {/* Edit badge */}
            <button
              onClick={() => setAccountOpen(true)}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-rose-400 border-2 border-white flex items-center justify-center text-white text-xs shadow-sm hover:bg-rose-500 transition-colors"
              title="Edit profile"
            >
              ✏️
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
            {user.username}
          </h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1 capitalize">{user.role || "Parent"}</p>
          <p className="text-xs text-gray-400 mt-0.5">Joined {joinedYear}</p>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 mt-6">
            <Link href="/auth/dashboard/progress" className="text-center hover:opacity-80 transition-opacity">
              <p className="text-lg font-bold text-gray-800">—</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Completed</p>
            </Link>
            <div className="w-px bg-gray-100" />
            <Link href="/auth/dashboard/favourites" className="text-center hover:opacity-80 transition-opacity">
              <p className="text-lg font-bold text-gray-800">—</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Favourites</p>
            </Link>
            <div className="w-px bg-gray-100" />
            <Link href="/auth/dashboard/activities" className="text-center hover:opacity-80 transition-opacity">
              <p className="text-lg font-bold text-gray-800">9</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Activities</p>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-3">

        {/* ── ACCOUNT ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#fde8d8] flex items-center justify-center text-lg">👤</div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">Account</p>
                <p className="text-xs text-gray-400">Edit personal details</p>
              </div>
            </div>
            <span className={`text-gray-300 text-sm transition-transform duration-200 ${accountOpen ? "rotate-90" : ""}`}>›</span>
          </button>

          {accountOpen && (
            <div className="border-t border-gray-100 p-5">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Profile picture preview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#faf8f5] border border-gray-100">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-rose-200 to-orange-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Profile Picture</p>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-500 hover:border-rose-200 hover:text-rose-400 transition-colors">
                      📷 Choose Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Email</label>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#faf8f5] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Username</label>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#faf8f5] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                {/* Role (read only) */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Role</label>
                  <div className="mt-1.5 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 capitalize">
                    {user.role || "Parent"}
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-widest disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="px-5 py-3 rounded-xl bg-[#faf8f5] border border-gray-200 text-gray-400 text-xs font-semibold uppercase tracking-widest hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── HELP & SUPPORT / FAQ ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setFaqOpen(!faqOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#d8ede8] flex items-center justify-center text-lg">❓</div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">Help & Support</p>
                <p className="text-xs text-gray-400">FAQs and contact</p>
              </div>
            </div>
            <span className={`text-gray-300 text-sm transition-transform duration-200 ${faqOpen ? "rotate-90" : ""}`}>›</span>
          </button>

          {faqOpen && (
            <div className="border-t border-gray-100 p-5 space-y-2">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 bg-[#faf8f5] hover:bg-gray-50 transition-colors text-left"
                  >
                    <p className="text-xs font-semibold text-gray-700 pr-4">{item.q}</p>
                    <span className={`text-gray-300 text-sm flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`}>›</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 pt-2 bg-white">
                      <p className="text-xs text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Contact */}
              <div className="mt-4 p-4 rounded-xl bg-[#fde8d8] border border-orange-100">
                <p className="text-xs font-semibold text-[#b45309] uppercase tracking-widest mb-2">Still need help?</p>
                <p className="text-xs text-[#b45309]">📧 Xyz@Gmail.Com</p>
                <p className="text-xs text-[#b45309] mt-1">📞 +977-9813760646</p>
              </div>
            </div>
          )}
        </div>

        {/* ── ABOUT ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-[#faf8f5] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#ede8fd] flex items-center justify-center text-lg">ℹ️</div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">About</p>
                <p className="text-xs text-gray-400">About Kreative Kindle</p>
              </div>
            </div>
            <span className={`text-gray-300 text-sm transition-transform duration-200 ${aboutOpen ? "rotate-90" : ""}`}>›</span>
          </button>

          {aboutOpen && (
            <div className="border-t border-gray-100 p-5 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">Kreative Kindle</span> is a learning platform designed to help parents and instructors guide young children through fun, educational activities.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our activities are designed by early childhood educators and cover Art, Math, Reading and Science for children aged 2–10.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-gray-100">Version 1.0</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-gray-100">© 2025 Kreative Kindle</span>
              </div>
            </div>
          )}
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick Access</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Activities", emoji: "🎨", href: "/auth/dashboard/activities", bg: "bg-[#fde8d8]" },
              { label: "Progress",   emoji: "📊", href: "/auth/dashboard/progress",   bg: "bg-[#d8ede8]" },
              { label: "Favourites", emoji: "⭐", href: "/auth/dashboard/favourites", bg: "bg-[#fce4ec]" },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                className={`${l.bg} rounded-xl p-4 text-center hover:opacity-80 transition-opacity`}>
                <p className="text-2xl mb-1">{l.emoji}</p>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{l.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── LOGOUT ── */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border border-rose-100 bg-white text-rose-400 text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-colors"
        >
          Log Out
        </button>

        <p className="text-center text-xs text-gray-300 pb-4">Kreative Kindle v1.0 · © 2025</p>
      </div>
    </div>
  );
}