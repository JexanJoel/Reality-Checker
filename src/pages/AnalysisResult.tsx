import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSaveIdea } from "@/hooks/useIdeas"
import type { AnalysisResult as TResult, IdeaInput } from "@/types"
import {
  ArrowLeft, BookmarkPlus, Copy, Check, Bookmark,
  TrendingUp, TrendingDown, AlertTriangle, HelpCircle,
  Target, Map, CheckSquare, MessageSquare
} from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, {
  color: string; bg: string; border: string; glow: string; gradient: string; accentClass: string
}> = {
  "BUILD IT":   { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", glow: "0 0 0 4px rgba(22,163,74,0.12), 0 8px 40px rgba(22,163,74,0.1)",  gradient: "linear-gradient(135deg,#16a34a,#22c55e)", accentClass: "verdict-glow-green"  },
  "NEEDS WORK": { color: "#b45309", bg: "#fffbeb", border: "#fde68a", glow: "0 0 0 4px rgba(217,119,6,0.12), 0 8px 40px rgba(217,119,6,0.1)",  gradient: "linear-gradient(135deg,#d97706,#fbbf24)", accentClass: "verdict-glow-amber"  },
  "RISKY":      { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", glow: "0 0 0 4px rgba(234,88,12,0.12), 0 8px 40px rgba(234,88,12,0.1)",  gradient: "linear-gradient(135deg,#ea580c,#fb923c)", accentClass: "verdict-glow-orange" },
  "PASS":       { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", glow: "0 0 0 4px rgba(220,38,38,0.12), 0 8px 40px rgba(220,38,38,0.1)",  gradient: "linear-gradient(135deg,#dc2626,#f87171)", accentClass: "verdict-glow-red"    },
}

const sections = [
  { key: "strengths",   title: "Strengths",   icon: <TrendingUp size={14} />,   color: "#16a34a", iconBg: "#dcfce7", accentClass: "card-accent-green"  },
  { key: "weaknesses",  title: "Weaknesses",  icon: <TrendingDown size={14} />, color: "#d97706", iconBg: "#fef9c3", accentClass: "card-accent-amber"  },
  { key: "risks",       title: "Risks",       icon: <AlertTriangle size={14} />,color: "#dc2626", iconBg: "#fee2e2", accentClass: "card-accent-red"    },
  { key: "assumptions", title: "Assumptions", icon: <HelpCircle size={14} />,   color: "#7c3aed", iconBg: "#ede9fe", accentClass: "card-accent-purple" },
]

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
          {item}
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items, color, bg }: { items: string[]; color: string; bg: string }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
          <span className="w-5 h-5 rounded-md text-[11px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5"
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
  const location  = useLocation()
  const navigate  = useNavigate()
  const saveIdea  = useSaveIdea()
  const [saved,   setSaved]   = useState(false)
  const [copied,  setCopied]  = useState(false)

  const result: TResult  = location.state?.result
  const input:  IdeaInput = location.state?.input

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "var(--font)" }}>
      <div className="text-center fade-up">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-sm text-gray-400 mb-5">No analysis found.</p>
        <button onClick={() => navigate("/new")}
          className="btn-shine text-sm font-semibold px-6 py-2.5 rounded-xl text-white"
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
    setSaved(true); toast.success("Saved to dashboard!")
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `RealityCheck: ${result.title}\nScore: ${result.score}/100 — ${result.verdict}\n\n${result.summary}\n\nFinal: ${result.finalRecommendation}`
    )
    setCopied(true); toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
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
              className="btn-shine flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50 text-white"
              style={{ background: saved ? "#64748b" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 4px 14px rgba(22,163,74,0.3)" }}>
              {saved ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}
              <span className="hidden sm:block">{saved ? "Saved" : saveIdea.isPending ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">

        {/* Hero verdict card */}
        <div className={`bg-white rounded-2xl border-2 p-6 sm:p-8 fade-up ${vc.accentClass}`}
          style={{ borderColor: vc.border, boxShadow: vc.glow }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5"
                  style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: vc.color }} />
                  {verdict}
                </span>
                <span className="text-xs text-gray-400">Analysis complete</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-3">{result.title}</h1>
              <p className="text-sm text-gray-500 leading-relaxed">{result.summary}</p>
            </div>

            {/* Animated score ring */}
            <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
              <div className="relative w-28 h-28 ring-appear">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                  <circle cx="40" cy="40" r="36" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="7"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={vc.color} />
                      <stop offset="100%" stopColor={vc.color} stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: vc.color }}>{result.score}</span>
                  <span className="text-[10px] text-gray-400">/100</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 sm:text-center">Overall score</span>
            </div>
          </div>
        </div>

        {/* 4-section grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((s, i) => {
            const items = (result as any)[s.key] ?? []
            return (
              <div key={s.key} className={`fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift ${s.accentClass}`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: s.iconBg, color: s.color }}>
                      {s.icon}
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{s.title}</h3>
                  </div>
                  <BulletList items={items} color={s.color} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Target user clarity */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-blue" style={{ animationDelay: "0.20s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600"><Target size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Target user clarity</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.targetUserClarity}</p>
          </div>
        </div>

        {/* MVP scope */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-purple" style={{ animationDelay: "0.25s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600"><Map size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">MVP scope</h3>
            </div>
            <NumberedList items={result.mvpScope ?? []} color="#4f46e5" bg="#eef2ff" />
          </div>
        </div>

        {/* Validation steps */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-teal" style={{ animationDelay: "0.30s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600"><CheckSquare size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Validation steps</h3>
            </div>
            <NumberedList items={result.validationSteps ?? []} color="#0f766e" bg="#f0fdfa" />
          </div>
        </div>

        {/* Final recommendation */}
        <div className="fade-up relative rounded-2xl p-6 sm:p-8 overflow-hidden grain" style={{ background: "#0f172a", animationDelay: "0.35s" }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none dot-grid" style={{ backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <MessageSquare size={14} />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Final recommendation</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{result.finalRecommendation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3 pb-6 fade-up" style={{ animationDelay: "0.40s" }}>
          <button onClick={() => navigate("/new")}
            className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition text-sm card-lift">
            <ArrowLeft size={15} /> Analyse another idea
          </button>
          <button onClick={handleSave} disabled={saved}
            className="btn-shine flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl transition text-sm text-white disabled:opacity-50"
            style={{ background: saved ? "#64748b" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 4px 14px rgba(22,163,74,0.3)" }}>
            {saved ? <><Bookmark size={15} /> Saved</> : <><BookmarkPlus size={15} /> Save to dashboard</>}
          </button>
        </div>

      </div>
    </div>
  )
}