import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const modes = [
  {
    value: "quick", emoji: "⚡", label: "Quick",
    desc: "Fast overview, key insights",
    activeBorder: "#3b82f6", activeBg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    badgeBg: "#dbeafe", badgeColor: "#1e40af", dotColor: "#3b82f6",
  },
  {
    value: "deep", emoji: "🔍", label: "Deep",
    desc: "Thorough, all 8 dimensions",
    activeBorder: "#16a34a", activeBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
    badgeBg: "#dcfce7", badgeColor: "#14532d", dotColor: "#16a34a",
  },
  {
    value: "savage", emoji: "🔥", label: "Savage",
    desc: "Brutally honest, no filter",
    activeBorder: "#dc2626", activeBg: "linear-gradient(135deg,#fef2f2,#fee2e2)",
    badgeBg: "#fee2e2", badgeColor: "#7f1d1d", dotColor: "#dc2626",
  },
]

const fieldCards = [
  {
    emoji: "💡", title: "Core information", color: "#14532d",
    bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "#86efac",
  },
  {
    emoji: "🎯", title: "Target & problem", color: "#1e3a8a",
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#93c5fd",
  },
]

export default function NewAnalysis() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "", description: "", targetUsers: "",
    problemSolved: "", goal: "", mode: "deep",
  })

  const filled = form.title && form.description && form.targetUsers && form.problemSolved

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const tid = toast.loading("🧠 Analysing with Groq AI...")
    try {
      const { data, error } = await supabase.functions.invoke("analyze-idea", { body: { idea: form } })
      if (error) throw error
      toast.success("✅ Analysis complete!", { id: tid })
      navigate("/result", { state: { result: data, input: form } })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.", { id: tid })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 12px rgba(22,163,74,0.35)" }}>
              RC
            </div>
            <span className="font-bold text-gray-900 tracking-tight">RealityCheck</span>
          </div>
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition font-medium">
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-8 fade-up text-center sm:text-left">
          <div className="text-5xl mb-3">🔬</div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Reality check your idea
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Be specific — the more detail you give, the sharper the analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Card 1 — Core */}
          <div className="rounded-2xl border overflow-hidden fade-up"
            style={{ background: fieldCards[0].bg, borderColor: fieldCards[0].border, animationDelay: "0.05s" }}>
            <div className="px-5 pt-4 pb-1 flex items-center gap-2">
              <span style={{ fontSize: 18 }}>{fieldCards[0].emoji}</span>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: fieldCards[0].color }}>
                {fieldCards[0].title}
              </p>
            </div>
            <div className="p-5 pt-3 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Idea title <span className="text-red-400">*</span>
                </label>
                <input name="title" required value={form.title} onChange={handleChange}
                  placeholder="e.g. AI-powered expense tracker for freelancers"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Describe your idea <span className="text-red-400">*</span>
                </label>
                <textarea name="description" required value={form.description} onChange={handleChange}
                  rows={4} placeholder="What is it? How does it work? What makes it different?"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition resize-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Card 2 — Target */}
          <div className="rounded-2xl border overflow-hidden fade-up"
            style={{ background: fieldCards[1].bg, borderColor: fieldCards[1].border, animationDelay: "0.10s" }}>
            <div className="px-5 pt-4 pb-1 flex items-center gap-2">
              <span style={{ fontSize: 18 }}>{fieldCards[1].emoji}</span>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: fieldCards[1].color }}>
                {fieldCards[1].title}
              </p>
            </div>
            <div className="p-5 pt-3 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Who is it for? <span className="text-red-400">*</span>
                  </label>
                  <input name="targetUsers" required value={form.targetUsers} onChange={handleChange}
                    placeholder="e.g. Solo freelancers"
                    className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Your goal <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <input name="goal" value={form.goal} onChange={handleChange}
                    placeholder="e.g. 100 users in 4 weeks"
                    className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  What problem does it solve? <span className="text-red-400">*</span>
                </label>
                <textarea name="problemSolved" required value={form.problemSolved} onChange={handleChange}
                  rows={3} placeholder="What pain point are you solving? Why does this matter?"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition resize-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Mode selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 18 }}>🎚️</span>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Analysis mode</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {modes.map(m => {
                const active = form.mode === m.value
                return (
                  <button key={m.value} type="button"
                    onClick={() => setForm(p => ({ ...p, mode: m.value }))}
                    className="relative p-4 rounded-xl border-2 text-left transition-all duration-200 card-lift"
                    style={{
                      borderColor: active ? m.activeBorder : "#f1f5f9",
                      background: active ? m.activeBg : "white",
                      boxShadow: active ? `0 4px 20px ${m.activeBorder}25` : "none",
                    }}>
                    <div className="text-2xl mb-2">{m.emoji}</div>
                    <div className="text-sm font-black text-gray-900 mb-0.5">{m.label}</div>
                    <div className="text-xs text-gray-400 leading-snug">{m.desc}</div>
                    {active && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full pulse-dot"
                        style={{ background: m.dotColor }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || !filled}
            className="btn-shine w-full flex items-center justify-center gap-2.5 text-white font-black py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base fade-up"
            style={{
              background: filled ? "linear-gradient(135deg,#16a34a,#22c55e)" : "#d1d5db",
              boxShadow: filled ? "0 8px 28px rgba(22,163,74,0.4)" : "none",
              animationDelay: "0.20s",
            }}>
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Analysing your idea...</>
              : <>⚡ Run Reality Check</>}
          </button>

          <p className="text-center text-xs text-gray-400 fade-up" style={{ animationDelay: "0.25s" }}>
            🤖 Powered by Groq + Llama 3.3 70B · ~15–30 seconds
          </p>
        </form>
      </div>
    </div>
  )
}