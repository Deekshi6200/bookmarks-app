"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [dark, setDark] = useState(true);
  const [listening, setListening] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/";
      return;
    }
    setUser(data.user);
    fetchBookmarks(data.user.id);
  };

  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("favorite", { ascending: false })
      .order("created_at", { ascending: false });
    setBookmarks(data || []);
  };

  const generateThumbnail = (query: string) => {
    let prompt = query;
    if (query.toLowerCase().includes('song') || query.toLowerCase().includes('music')) {
      prompt = `${query} music album cover vibrant`;
    } else if (query.toLowerCase().includes('movie') || query.toLowerCase().includes('film')) {
      prompt = `${query} movie poster cinematic`;
    } else if (query.toLowerCase().includes('show') || query.toLowerCase().includes('series')) {
      prompt = `${query} tv series poster`;
    }
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;
  };

  const addManualBookmark = async () => {
    if (!user || !title.trim()) {
      alert("Please enter a title");
      return;
    }
    setLoading(true);
    try {
      let finalUrl = url.trim() || `https://www.google.com/search?q=${encodeURIComponent(title)}`;
      if (!url.trim()) window.open(finalUrl, "_blank");
      
      await supabase.from("bookmarks").insert({
        title: title.trim(),
        url: finalUrl,
        thumbnail: generateThumbnail(title),
        user_id: user.id,
        favorite: false,
      });
      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Error adding bookmark");
    } finally {
      setLoading(false);
    }
  };

  const addQuickSearch = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}`;
      window.open(searchUrl, "_blank");
      await supabase.from("bookmarks").insert({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        url: searchUrl,
        thumbnail: generateThumbnail(title),
        user_id: user.id,
        favorite: false,
      });
      setTitle("");
      fetchBookmarks(user.id);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.start();
    setListening(true);
    rec.onresult = async (e: any) => {
      const text = e.results[0][0].transcript;
      setTitle(text);
      setListening(false);
      if (showQuickSearch) setTimeout(() => addQuickSearch(), 500);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
  };

  const toggleFav = async (id: string, fav: boolean) => {
    await supabase.from("bookmarks").update({ favorite: !fav }).eq("id", id);
    fetchBookmarks(user.id);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const filtered = bookmarks
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
    .filter(b => tab === "fav" ? b.favorite : true);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${dark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'}`}></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute w-[200%] h-[200%]" style={{
            backgroundImage: dark
              ? `radial-gradient(${2 + i}px ${2 + i}px at ${20 + i * 15}% ${30 + i * 20}%, white, transparent), radial-gradient(${1 + i}px ${1 + i}px at ${60 + i * 10}% ${70 - i * 15}%, white, transparent), radial-gradient(${2 + i}px ${2 + i}px at ${40 - i * 10}% ${50 + i * 10}%, white, transparent)`
              : `radial-gradient(${2 + i}px ${2 + i}px at ${20 + i * 15}% ${30 + i * 20}%, rgba(99, 102, 241, 0.5), transparent), radial-gradient(${1 + i}px ${1 + i}px at ${60 + i * 10}% ${70 - i * 15}%, rgba(168, 85, 247, 0.5), transparent)`,
            backgroundSize: `${200 + i * 50}px ${200 + i * 50}px`,
            opacity: dark ? 0.6 - i * 0.15 : 0.4 - i * 0.1,
            animation: `moveStars ${120 + i * 80}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }} />
        ))}
        <div className="absolute inset-0" style={{
          backgroundImage: dark ? 'radial-gradient(1px 1px at 30% 40%, white, transparent), radial-gradient(1px 1px at 70% 60%, white, transparent)' : 'radial-gradient(2px 2px at 30% 40%, rgba(236, 72, 153, 0.6), transparent)',
          backgroundSize: '200px 200px',
          opacity: 0.5,
          animation: 'twinkle 4s ease-in-out infinite',
        }} />
        <div className="absolute inset-0" style={{
          background: dark ? 'radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.2), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.15), transparent 50%)' : 'radial-gradient(ellipse at 30% 40%, rgba(139, 92, 246, 0.3), transparent 60%)',
          animation: 'pulse 10s ease-in-out infinite',
        }} />
      </div>

      <div className={`relative z-10 ${dark ? 'text-white' : 'text-gray-900'}`}>
        <header className="flex justify-between items-center p-6">
          <h1 className={`text-3xl font-bold ${dark ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'}`}>
            🌌 Smart OTT Bookmarks
          </h1>
          <div className="flex gap-3">
            <button onClick={() => setDark(!dark)} className={`px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-lg ${dark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all hover:scale-105 shadow-lg text-white">
              Logout
            </button>
          </div>
        </header>

        <div className="flex justify-center gap-3 mb-4">
          <button onClick={() => setShowQuickSearch(false)} className={`px-6 py-2 rounded-lg transition-all font-semibold ${!showQuickSearch ? 'bg-purple-600 text-white shadow-lg scale-105' : dark ? 'bg-white/20 hover:bg-white/30' : 'bg-purple-200 text-purple-900 hover:bg-purple-300'}`}>
            ✏️ Manual Entry
          </button>
          <button onClick={() => setShowQuickSearch(true)} className={`px-6 py-2 rounded-lg transition-all font-semibold ${showQuickSearch ? 'bg-purple-600 text-white shadow-lg scale-105' : dark ? 'bg-white/20 hover:bg-white/30' : 'bg-purple-200 text-purple-900 hover:bg-purple-300'}`}>
            🔍 Quick Search
          </button>
        </div>

        <div className={`max-w-md mx-auto backdrop-blur-xl p-6 rounded-2xl shadow-2xl border ${dark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-purple-200'}`}>
          {!showQuickSearch ? (
            <>
              <input className={`w-full p-3 mb-3 rounded-lg outline-none transition-all ${dark ? 'bg-white/90 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500' : 'bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-400 border border-purple-200'}`} placeholder="Title (e.g., KGF Song)" value={title} onChange={e => setTitle(e.target.value)} />
              <input className={`w-full p-3 mb-3 rounded-lg outline-none transition-all ${dark ? 'bg-white/90 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500' : 'bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-400 border border-purple-200'}`} placeholder="URL (optional)" value={url} onChange={e => setUrl(e.target.value)} />
              <button onClick={addManualBookmark} disabled={loading} className={`w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-3 rounded-xl transition-all font-semibold shadow-lg text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                {loading ? "⏳ Adding..." : "✨ Add Bookmark"}
              </button>
            </>
          ) : (
            <>
              <input className={`w-full p-3 mb-3 rounded-lg outline-none transition-all ${dark ? 'bg-white/90 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500' : 'bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-400 border border-purple-200'}`} placeholder="Search (e.g., KGF song)" value={title} onChange={e => setTitle(e.target.value)} onKeyPress={e => e.key === 'Enter' && addQuickSearch()} />
              <button onClick={addQuickSearch} disabled={loading} className={`w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-3 rounded-xl transition-all font-semibold shadow-lg text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                {loading ? "⏳ Searching..." : "🔎 Search & Save"}
              </button>
              <button onClick={startVoice} disabled={listening || loading} className={`w-full mt-3 bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl transition-all font-semibold shadow-lg text-white ${listening || loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}`}>
                {listening ? "🎙 Listening..." : "🎤 Voice Search"}
              </button>
            </>
          )}
        </div>

        <div className="max-w-md mx-auto mt-6">
          <input className={`w-full p-3 rounded-lg outline-none shadow-lg transition-all ${dark ? 'bg-white/90 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500' : 'bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-400 border border-purple-200'}`} placeholder="🔍 Filter bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button onClick={() => setTab("all")} className={`px-6 py-2 rounded-full transition-all font-semibold ${tab === "all" ? dark ? "bg-white text-black shadow-lg scale-110" : "bg-purple-600 text-white shadow-lg scale-110" : dark ? "bg-white/20 hover:bg-white/30" : "bg-purple-200 hover:bg-purple-300 text-purple-900"}`}>
            📚 All
          </button>
          <button onClick={() => setTab("fav")} className={`px-6 py-2 rounded-full transition-all font-semibold ${tab === "fav" ? "bg-yellow-400 text-black shadow-lg scale-110" : "bg-yellow-400/40 hover:bg-yellow-400/60 text-yellow-900"}`}>
            ⭐ Favorites
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-10">
          {filtered.map((b) => (
            <div key={b.id} className={`backdrop-blur-xl p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border ${dark ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:shadow-purple-600/40' : 'bg-white/70 border-purple-200 hover:shadow-purple-400/40'}`}>
              <div className="relative overflow-hidden rounded-xl mb-3 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
                <img src={b.thumbnail || generateThumbnail(b.title)} alt={b.title} className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300" loading="lazy" onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes('ui-avatars')) {
                    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(b.title)}&size=800&background=random&bold=true`;
                  }
                }} />
              </div>
              <h3 className={`text-center font-semibold text-sm line-clamp-2 min-h-[2.5rem] ${dark ? 'text-white' : 'text-gray-900'}`}>{b.title}</h3>
              <div className="flex justify-between mt-3 items-center">
                <button onClick={() => toggleFav(b.id, b.favorite)} className="text-3xl transition-transform hover:scale-125">
                  {b.favorite ? "⭐" : "☆"}
                </button>
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-xs transition-all text-white font-medium">
                  Open
                </a>
                <button onClick={() => deleteBookmark(b.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-xs transition-all text-white font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={`text-center mt-20 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-2xl">📭 No bookmarks yet</p>
            <p className="mt-2">Start adding your favorite content!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes moveStars { from { transform: translate(0, 0); } to { transform: translate(-50%, -50%); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
