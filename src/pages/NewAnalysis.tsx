import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const modes = [
  { value: "quick",  emoji: "⚡", label: "Quick",  desc: "Fast overview, key insights",  activeBorder: "#3b82f6", activeBg: "linear-gradient(135deg,#eff6ff,#dbeafe)", dotColor: "#3b82f6" },
  { value: "deep",   emoji: "🔍", label: "Deep",   desc: "Thorough, all 8 dimensions",   activeBorder: "#16a34a", activeBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", dotColor: "#16a34a" },
  { value: "savage", emoji: "🔥", label: "Savage", desc: "Brutally honest, no filter",   activeBorder: "#dc2626", activeBg: "linear-gradient(135deg,#fef2f2,#fee2e2)", dotColor: "#dc2626" },
]

export default function NewAnalysis() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", targetUsers: "", problemSolved: "", goal: "", mode: "deep" })
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
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen" style={{ background: "#f1f5f9", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderBottom: "1px solid #334155" }}
        className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 14px rgba(22,163,74,0.5)" }}>RC</div>
            <span className="font-black text-white text-base tracking-tight">RealityCheck</span>
          </div>
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition"
            style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#334155"; e.currentTarget.style.color = "white" }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#94a3b8" }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        <div className="mb-10 fade-up text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">Reality check your idea</h1>
          <p className="text-base text-gray-500 leading-relaxed">Be specific — the more detail you give, the sharper the analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Core info */}
          <div className="rounded-2xl border-2 overflow-hidden fade-up"
            style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderColor: "#86efac", animationDelay: "0.05s" }}>
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <span style={{ fontSize: 20 }}>💡</span>
              <p className="text-xs font-black uppercase tracking-widest text-green-800">Core information</p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Idea title <span className="text-red-500">*</span></label>
                <input name="title" required value={form.title} onChange={handleChange}
                  placeholder="e.g. AI-powered expense tracker for freelancers"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Describe your idea <span className="text-red-500">*</span></label>
                <textarea name="description" required value={form.description} onChange={handleChange}
                  rows={5} placeholder="What is it? How does it work? What makes it different from existing solutions?"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-300 resize-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Target */}
          <div className="rounded-2xl border-2 overflow-hidden fade-up"
            style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderColor: "#93c5fd", animationDelay: "0.10s" }}>
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <span style={{ fontSize: 20 }}>🎯</span>
              <p className="text-xs font-black uppercase tracking-widest text-blue-900">Target & problem</p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Who is it for? <span className="text-red-500">*</span></label>
                  <input name="targetUsers" required value={form.targetUsers} onChange={handleChange}
                    placeholder="e.g. Solo freelancers earning $2k–$15k/month"
                    className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Your goal <span className="text-xs font-normal text-gray-400">(optional)</span></label>
                  <input name="goal" value={form.goal} onChange={handleChange}
                    placeholder="e.g. 100 paying users in 4 weeks"
                    className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-300 shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">What problem does it solve? <span className="text-red-500">*</span></label>
                <textarea name="problemSolved" required value={form.problemSolved} onChange={handleChange}
                  rows={3} placeholder="What pain point are you solving? Why does this matter to your user?"
                  className="input-glow w-full border-2 border-white bg-white text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-300 resize-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Mode */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-5">
              <span style={{ fontSize: 20 }}>🎚️</span>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Analysis mode</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {modes.map(m => {
                const active = form.mode === m.value
                return (
                  <button key={m.value} type="button"
                    onClick={() => setForm(p => ({ ...p, mode: m.value }))}
                    className="relative p-5 rounded-xl border-2 text-left transition-all duration-200 card-lift"
                    style={{ borderColor: active ? m.activeBorder : "#f1f5f9", background: active ? m.activeBg : "white",
                      boxShadow: active ? `0 4px 20px ${m.activeBorder}25` : "none" }}>
                    <div className="text-3xl mb-3">{m.emoji}</div>
                    <div className="text-sm font-black text-gray-900 mb-1">{m.label}</div>
                    <div className="text-xs text-gray-400 leading-snug">{m.desc}</div>
                    {active && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: m.dotColor }} />}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={loading || !filled}
            className="btn-shine w-full flex items-center justify-center gap-3 text-white font-black py-4 rounded-xl transition-all disabled:opacity-40 text-base fade-up"
            style={{ background: filled ? "linear-gradient(135deg,#16a34a,#22c55e)" : "#d1d5db",
              boxShadow: filled ? "0 8px 28px rgba(22,163,74,0.45)" : "none", animationDelay: "0.20s" }}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> Analysing your idea...</> : <>⚡ Run Reality Check</>}
          </button>
          <p className="text-center text-xs text-gray-400 fade-up" style={{ animationDelay: "0.25s" }}>
            🤖 Groq + Llama 3.3 70B · Usually 15–30 seconds
          </p>
        </form>
      </div>
    </div>
  )
}