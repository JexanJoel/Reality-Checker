import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft, Loader2, Zap, Search, Flame } from "lucide-react"
import toast from "react-hot-toast"

const modes = [
  { value: "quick",  icon: <Zap size={20} />,    label: "Quick",   desc: "Fast overview",          activeBorder: "#3b82f6", activeBg: "#eff6ff",  dotColor: "#3b82f6", iconBg: "#eff6ff", iconColor: "#2563eb" },
  { value: "deep",   icon: <Search size={20} />,  label: "Deep",    desc: "All 8 dimensions",       activeBorder: "#16a34a", activeBg: "#f0fdf4",  dotColor: "#16a34a", iconBg: "#f0fdf4", iconColor: "#16a34a" },
  { value: "savage", icon: <Flame size={20} />,   label: "Savage",  desc: "Brutally honest",        activeBorder: "#dc2626", activeBg: "#fef2f2",  dotColor: "#dc2626", iconBg: "#fef2f2", iconColor: "#dc2626" },
]

export default function NewAnalysis() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "", description: "", targetUsers: "",
    problemSolved: "", goal: "", mode: "deep",
  })

  const filled = form.title && form.description && form.targetUsers && form.problemSolved

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const tid = toast.loading("Analysing with Groq AI...")
    try {
      const { data, error } = await supabase.functions.invoke("analyze-idea", { body: { idea: form } })
      if (error) throw error
      toast.success("Analysis complete!", { id: tid })
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
              style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
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
        <div className="mb-8 fade-up">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border mb-4"
            style={{ background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            New Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Reality check your idea
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Be specific. The more detail you give, the sharper the analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-accent-green fade-up" style={{ animationDelay: "0.05s" }}>
            <div className="p-5 sm:p-6 space-y-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Core information</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Idea title <span className="text-red-400">*</span>
                </label>
                <input name="title" required value={form.title} onChange={handleChange}
                  placeholder="e.g. AI-powered expense tracker for freelancers"
                  className="input-glow w-full border-2 border-gray-100 text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition"
                  style={{ background: form.title ? "#fafffe" : "white" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Describe your idea <span className="text-red-400">*</span>
                </label>
                <textarea name="description" required value={form.description} onChange={handleChange}
                  rows={4} placeholder="What is it? How does it work? What makes it different?"
                  className="input-glow w-full border-2 border-gray-100 text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition resize-none"
                  style={{ background: form.description ? "#fafffe" : "white" }} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-accent-blue fade-up" style={{ animationDelay: "0.10s" }}>
            <div className="p-5 sm:p-6 space-y-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Target & problem</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Who is it for? <span className="text-red-400">*</span>
                  </label>
                  <input name="targetUsers" required value={form.targetUsers} onChange={handleChange}
                    placeholder="e.g. Junior developers"
                    className="input-glow w-full border-2 border-gray-100 text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your goal <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                  </label>
                  <input name="goal" value={form.goal} onChange={handleChange}
                    placeholder="e.g. 100 users in 4 weeks"
                    className="input-glow w-full border-2 border-gray-100 text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  What problem does it solve? <span className="text-red-400">*</span>
                </label>
                <textarea name="problemSolved" required value={form.problemSolved} onChange={handleChange}
                  rows={3} placeholder="What pain point are you solving? Why does this matter?"
                  className="input-glow w-full border-2 border-gray-100 text-gray-900 rounded-xl px-4 py-2.5 text-sm placeholder-gray-300 transition resize-none" />
              </div>
            </div>
          </div>

          {/* Mode selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 fade-up" style={{ animationDelay: "0.15s" }}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Analysis mode</p>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => {
                const active = form.mode === m.value
                return (
                  <button key={m.value} type="button"
                    onClick={() => setForm((p) => ({ ...p, mode: m.value }))}
                    className="relative p-4 rounded-xl border-2 text-left transition-all duration-200 card-lift"
                    style={{
                      borderColor: active ? m.activeBorder : "#f1f5f9",
                      background: active ? m.activeBg : "white",
                      boxShadow: active ? `0 0 0 1px ${m.activeBorder}20, 0 4px 16px ${m.activeBorder}15` : "none",
                    }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: active ? m.iconBg : "#f8fafc", color: active ? m.iconColor : "#94a3b8" }}>
                      {m.icon}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{m.label}</div>
                    <div className="text-xs text-gray-400 leading-snug">{m.desc}</div>
                    {active && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full pulse-dot"
                        style={{ background: m.dotColor }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || !filled}
            className="btn-shine w-full flex items-center justify-center gap-2.5 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[15px] fade-up"
            style={{
              background: filled ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#94a3b8",
              boxShadow: filled ? "0 8px 24px rgba(22,163,74,0.35)" : "none",
              animationDelay: "0.20s",
            }}>
            {loading
              ? <><Loader2 size={17} className="animate-spin" /> Analysing your idea...</>
              : <><Zap size={17} /> Run Reality Check</>}
          </button>

          <p className="text-center text-xs text-gray-400 fade-up" style={{ animationDelay: "0.25s" }}>
            Powered by Groq + Llama 3.3 70B · Usually takes 15–30 seconds
          </p>
        </form>
      </div>
    </div>
  )
}