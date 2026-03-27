import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSaveIdea } from "@/hooks/useIdeas"
import type { AnalysisResult as TResult, IdeaInput } from "@/types"
import { ArrowLeft, BookmarkPlus, Copy, Check, Bookmark, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, {
  emoji: string; color: string; bg: string; border: string
  glow: string; gradient: string; cardBg: string
}> = {
  "BUILD IT":   { emoji: "🚀", color: "#14532d", bg: "#dcfce7", border: "#86efac", glow: "0 0 0 4px rgba(22,163,74,0.15),0 12px 40px rgba(22,163,74,0.12)", gradient: "linear-gradient(135deg,#16a34a,#22c55e)", cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  "NEEDS WORK": { emoji: "🔧", color: "#78350f", bg: "#fef9c3", border: "#fde047", glow: "0 0 0 4px rgba(234,179,8,0.15),0 12px 40px rgba(234,179,8,0.12)",   gradient: "linear-gradient(135deg,#d97706,#fbbf24)", cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)" },
  "RISKY":      { emoji: "⚠️", color: "#7c2d12", bg: "#ffedd5", border: "#fb923c", glow: "0 0 0 4px rgba(234,88,12,0.15),0 12px 40px rgba(234,88,12,0.12)",   gradient: "linear-gradient(135deg,#ea580c,#fb923c)", cardBg: "linear-gradient(135deg,#fff7ed,#ffedd5)" },
  "PASS":       { emoji: "❌", color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", glow: "0 0 0 4px rgba(220,38,38,0.15),0 12px 40px rgba(220,38,38,0.12)",   gradient: "linear-gradient(135deg,#dc2626,#f87171)", cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
}

const sectionConfig = [
  { key: "strengths",   emoji: "✅", title: "Strengths",   color: "#14532d", bg: "#dcfce7", border: "#86efac", cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { key: "weaknesses",  emoji: "⚠️", title: "Weaknesses",  color: "#78350f", bg: "#fef9c3", border: "#fde047", cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)" },
  { key: "risks",       emoji: "🚨", title: "Risks",       color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
  { key: "assumptions", emoji: "🤔", title: "Assumptions", color: "#4c1d95", bg: "#ede9fe", border: "#c4b5fd", cardBg: "linear-gradient(135deg,#faf5ff,#ede9fe)" },
]

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color }}>
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items, color, bg }: { items: string[]; color: string; bg: string }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
          <span className="w-6 h-6 rounded-lg text-xs font-black flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: bg, color }}>
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ol>
  )
}

export default function AnalysisResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const saveIdea = useSaveIdea()
  const [saved, setSaved]   = useState(false)
  const [copied, setCopied] = useState(false)

  const result: TResult  = location.state?.result
  const input:  IdeaInput = location.state?.input

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "var(--font)" }}>
      <div className="text-center fade-up">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-sm text-gray-400 mb-5">No analysis found.</p>
        <button onClick={() => navigate("/new")} className="btn-shine text-sm font-bold px-6 py-2.5 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>
          Run a new analysis →
        </button>
      </div>
    </div>
  )

  const verdict = result.verdict ?? "NEEDS WORK"
  const vc = verdictConfig[verdict] ?? verdictConfig["NEEDS WORK"]
  const circumference = 2 * Math.PI * 36
  const dash = (result.score / 100) * circumference

  async function handleSave() {
    if (saved) return
    await saveIdea.mutateAsync({ input, result })
    setSaved(true); toast.success("💾 Saved to dashboard!")
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `RealityCheck: ${result.title}\nScore: ${result.score}/100 — ${result.verdict}\n\n${result.summary}\n\nFinal: ${result.finalRecommendation}`
    )
    setCopied(true); toast.success("📋 Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 12px rgba(22,163,74,0.35)" }}>
              RC
            </div>
            <span className="font-bold text-gray-900 tracking-tight">RealityCheck</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-3.5 py-2 rounded-xl transition">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              <span className="hidden sm:block">{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button onClick={handleSave} disabled={saved || saveIdea.isPending}
              className="btn-shine flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-60 transition"
              style={{ background: saved ? "#64748b" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 4px 14px rgba(22,163,74,0.35)" }}>
              {saveIdea.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}
              <span className="hidden sm:block">{saved ? "Saved" : saveIdea.isPending ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">

        {/* Hero verdict card */}
        <div className="fade-up rounded-2xl border-2 p-6 sm:p-8 relative overflow-hidden"
          style={{ background: vc.cardBg, borderColor: vc.border, boxShadow: vc.glow }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-xl border"
                  style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                  <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: vc.color }} />
                  {vc.emoji} {verdict}
                </span>
                <span className="text-xs text-gray-400 font-medium">Analysis complete ✓</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
                {result.title}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
            </div>

            {/* Score ring */}
            <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
              <div className="relative w-28 h-28 ring-appear">
                <svg className="w-28 h-28" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="7" />
                  <circle cx="40" cy="40" r="36" fill="none"
                    stroke={vc.color} strokeWidth="7"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={circumference * 0.25}
                    strokeLinecap="round" />
                  <text x="40" y="37" textAnchor="middle" dominantBaseline="middle"
                    fontSize="15" fontWeight="900" fill={vc.color}>{result.score}</text>
                  <text x="40" y="51" textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="#94a3b8">/100</text>
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Overall score</span>
            </div>
          </div>
        </div>

        {/* 4-section grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sectionConfig.map((s, i) => {
            const items = (result as any)[s.key] ?? []
            return (
              <div key={s.key} className="fade-up rounded-2xl border-2 overflow-hidden card-lift"
                style={{ background: s.cardBg, borderColor: s.border, animationDelay: `${i * 0.06}s` }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: s.color }}>{s.title}</h3>
                  </div>
                  <BulletList items={items} color={s.color} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Target user clarity */}
        <div className="fade-up rounded-2xl border-2 p-5 card-lift"
          style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderColor: "#93c5fd", animationDelay: "0.24s" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 20 }}>🎯</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-800">Target user clarity</h3>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{result.targetUserClarity}</p>
        </div>

        {/* MVP scope */}
        <div className="fade-up rounded-2xl border-2 p-5 card-lift"
          style={{ background: "linear-gradient(135deg,#faf5ff,#ede9fe)", borderColor: "#c4b5fd", animationDelay: "0.30s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 20 }}>🗺️</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-800">MVP scope</h3>
          </div>
          <NumberedList items={result.mvpScope ?? []} color="#4c1d95" bg="#ede9fe" />
        </div>

        {/* Validation steps */}
        <div className="fade-up rounded-2xl border-2 p-5 card-lift"
          style={{ background: "linear-gradient(135deg,#f0fdfa,#ccfbf1)", borderColor: "#5eead4", animationDelay: "0.36s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 20 }}>✅</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-teal-800">Validation steps</h3>
          </div>
          <NumberedList items={result.validationSteps ?? []} color="#134e4a" bg="#ccfbf1" />
        </div>

        {/* Final recommendation */}
        <div className="fade-up relative rounded-2xl p-6 sm:p-8 overflow-hidden" style={{ background: "#0f172a", animationDelay: "0.42s" }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-[0.08] pointer-events-none"
            style={{ background: "radial-gradient(circle, #22c55e, transparent)", transform: "translate(30%,-30%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 22 }}>💬</span>
              <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>
                Final recommendation
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{result.finalRecommendation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3 pb-6 fade-up" style={{ animationDelay: "0.48s" }}>
          <button onClick={() => navigate("/new")}
            className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-bold py-3.5 px-6 rounded-xl transition text-sm card-lift">
            <ArrowLeft size={15} /> Analyse another
          </button>
          <button onClick={handleSave} disabled={saved}
            className="btn-shine flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl text-sm text-white disabled:opacity-60 transition"
            style={{ background: saved ? "#64748b" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 6px 20px rgba(22,163,74,0.35)" }}>
            {saved ? "💾 Saved to dashboard" : "💾 Save to dashboard"}
          </button>
        </div>

      </div>
    </div>
  )
}