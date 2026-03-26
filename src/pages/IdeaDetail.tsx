import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useDeleteIdea } from "@/hooks/useIdeas"
import { formatDistanceToNow } from "date-fns"
import type { AnalysisResult } from "@/types"
import {
  ArrowLeft, Trash2, TrendingUp, TrendingDown,
  AlertTriangle, HelpCircle, Target, Map, CheckSquare, MessageSquare
} from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, { color: string; bg: string; border: string; glow: string; accentClass: string }> = {
  "BUILD IT":   { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", glow: "0 0 0 4px rgba(22,163,74,0.12), 0 8px 40px rgba(22,163,74,0.08)",  accentClass: "verdict-glow-green"  },
  "NEEDS WORK": { color: "#b45309", bg: "#fffbeb", border: "#fde68a", glow: "0 0 0 4px rgba(217,119,6,0.12), 0 8px 40px rgba(217,119,6,0.08)",  accentClass: "verdict-glow-amber"  },
  "RISKY":      { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", glow: "0 0 0 4px rgba(234,88,12,0.12), 0 8px 40px rgba(234,88,12,0.08)",  accentClass: "verdict-glow-orange" },
  "PASS":       { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", glow: "0 0 0 4px rgba(220,38,38,0.12), 0 8px 40px rgba(220,38,38,0.08)",  accentClass: "verdict-glow-red"    },
}

const sections = [
  { key: "strengths",   title: "Strengths",   icon: <TrendingUp size={14} />,    color: "#16a34a", iconBg: "#dcfce7", accentClass: "card-accent-green"  },
  { key: "weaknesses",  title: "Weaknesses",  icon: <TrendingDown size={14} />,  color: "#d97706", iconBg: "#fef9c3", accentClass: "card-accent-amber"  },
  { key: "risks",       title: "Risks",       icon: <AlertTriangle size={14} />, color: "#dc2626", iconBg: "#fee2e2", accentClass: "card-accent-red"    },
  { key: "assumptions", title: "Assumptions", icon: <HelpCircle size={14} />,    color: "#7c3aed", iconBg: "#ede9fe", accentClass: "card-accent-purple" },
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

export default function IdeaDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const deleteIdea = useDeleteIdea()
  const [idea, setIdea]       = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from("ideas").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (error) { navigate("/dashboard"); return }
        setIdea(data); setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "var(--font)" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#16a34a", borderTopColor: "transparent" }} />
    </div>
  )

  const result: AnalysisResult = idea.result
  const verdict = result.verdict ?? "NEEDS WORK"
  const vc = verdictConfig[verdict] ?? verdictConfig["NEEDS WORK"]
  const circumference = 2 * Math.PI * 36
  const dash = (result.score / 100) * circumference

  async function handleDelete() {
    if (!confirm("Delete this idea permanently?")) return
    await deleteIdea.mutateAsync(id!)
    toast.success("Deleted"); navigate("/dashboard")
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
            </span>
            <button onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">

        {/* Hero */}
        <div className={`fade-up bg-white rounded-2xl border-2 p-6 sm:p-8 ${vc.accentClass}`}
          style={{ borderColor: vc.border, boxShadow: vc.glow }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5"
                  style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: vc.color }} />
                  {verdict}
                </span>
                <span className="text-xs text-gray-400">Saved analysis</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-3">{idea.title}</h1>
              <p className="text-sm text-gray-500 leading-relaxed">{result.summary}</p>
            </div>
            <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
              <div className="relative w-28 h-28 ring-appear">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                  <circle cx="40" cy="40" r="36" fill="none"
                    stroke="url(#scoreGrad2)" strokeWidth="7"
                    strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={vc.color} />
                      <stop offset="100%" stopColor={vc.color} stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: vc.color }}>{result.score}</span>
                  <span className="text-[10px] text-gray-400">/100</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">Overall score</span>
            </div>
          </div>
        </div>

        {/* Original input */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 p-5 card-lift" style={{ animationDelay: "0.05s" }}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Original input</h3>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-0.5">Target users</span>
              <span className="text-gray-700">{idea.input.targetUsers}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-0.5">Mode</span>
              <span className="text-gray-700 capitalize">{idea.input.mode}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs font-semibold text-gray-400 block mb-0.5">Problem solved</span>
              <span className="text-gray-700">{idea.input.problemSolved}</span>
            </div>
            {idea.input.goal && (
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-gray-400 block mb-0.5">Goal</span>
                <span className="text-gray-700">{idea.input.goal}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-section grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((s, i) => {
            const items = (result as any)[s.key] ?? []
            return (
              <div key={s.key} className={`fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift ${s.accentClass}`}
                style={{ animationDelay: `${(i + 2) * 0.05}s` }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: s.iconBg, color: s.color }}>{s.icon}</div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{s.title}</h3>
                  </div>
                  <BulletList items={items} color={s.color} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Target user clarity */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-blue" style={{ animationDelay: "0.30s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Target size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Target user clarity</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.targetUserClarity}</p>
          </div>
        </div>

        {/* MVP scope */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-purple" style={{ animationDelay: "0.35s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Map size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">MVP scope</h3>
            </div>
            <NumberedList items={result.mvpScope ?? []} color="#4f46e5" bg="#eef2ff" />
          </div>
        </div>

        {/* Validation steps */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden card-lift card-accent-teal" style={{ animationDelay: "0.40s" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><CheckSquare size={14} /></div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Validation steps</h3>
            </div>
            <NumberedList items={result.validationSteps ?? []} color="#0f766e" bg="#f0fdfa" />
          </div>
        </div>

        {/* Final recommendation */}
        <div className="fade-up relative rounded-2xl p-6 sm:p-8 overflow-hidden" style={{ background: "#0f172a", animationDelay: "0.45s" }}>
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
            style={{ background: "radial-gradient(circle, #22c55e, transparent)", transform: "translate(30%, -30%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <MessageSquare size={14} />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
                Final recommendation
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{result.finalRecommendation}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-6 fade-up" style={{ animationDelay: "0.50s" }}>
          <button onClick={() => navigate("/new")}
            className="btn-shine w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition text-sm"
            style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 8px 24px rgba(22,163,74,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#15803d,#16a34a)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,#16a34a,#22c55e)"}>
            Analyse a new idea →
          </button>
        </div>

      </div>
    </div>
  )
}