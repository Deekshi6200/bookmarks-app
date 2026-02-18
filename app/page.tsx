"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoading(false);
      if (data.user) window.location.href = "/dashboard";
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 text-white">
      <div className="p-10 rounded-2xl bg-slate-900 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-6">🔖 Bookmark App</h1>
        <button
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/dashboard`,
              },
            })
          }
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
