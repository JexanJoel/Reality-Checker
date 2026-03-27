import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useDeleteIdea } from "@/hooks/useIdeas"
import { formatDistanceToNow } from "date-fns"
import type { AnalysisResult } from "@/types"
import { ArrowLeft, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, {
  emoji: string; color: string; bg: string; border: string; glow: string; cardBg: string
}> = {
  "BUILD IT":   { emoji: "🚀", color: "#14532d", bg: "#dcfce7", border: "#86efac", glow: "0 0 0 4px rgba(22,163,74,0.15),0 12px 40px rgba(22,163,74,0.1)",  cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  "NEEDS WORK": { emoji: "🔧", color: "#78350f", bg: "#fef9c3", border: "#fde047", glow: "0 0 0 4px rgba(234,179,8,0.15),0 12px 40px rgba(234,179,8,0.1)",  cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)" },
  "RISKY":      { emoji: "⚠️", color: "#7c2d12", bg: "#ffedd5", border: "#fb923c", glow: "0 0 0 4px rgba(234,88,12,0.15),0 12px 40px rgba(234,88,12,0.1)",  cardBg: "linear-gradient(135deg,#fff7ed,#ffedd5)" },
  "PASS":       { emoji: "❌", color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", glow: "0 0 0 4px rgba(220,38,38,0.15),0 12px 40px rgba(220,38,38,0.1)",  cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
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
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
          {item}
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

export default function IdeaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
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
      <div className="text-center fade-up">
        <div className="text-5xl mb-3 animate-bounce">🔍</div>
        <p className="text-sm text-gray-400">Loading analysis...</p>
      </div>
    </div>
  )

  const result: AnalysisResult = idea.result
  const verdict = result.verdict ?? "NEEDS WORK"
  const vc = verdictConfig[verdict] ?? verdictConfig["NEEDS WORK"]
  const circumference = 2 * Math.PI * 36
  const dash = (result.score / 100) * circumference

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold transition">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              🕐 {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
            </span>
            <button onClick={async () => {
              if (!confirm("Delete this idea permanently?")) return
              await deleteIdea.mutateAsync(id!)
              toast.success("🗑️ Deleted"); navigate("/dashboard")
            }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">

        {/* Hero */}
        <div className="fade-up rounded-2xl border-2 p-6 sm:p-8 relative overflow-hidden"
          style={{ background: vc.cardBg, borderColor: vc.border, boxShadow: vc.glow }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-xl border"
                  style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                  {vc.emoji} {verdict}
                </span>
                <span className="text-xs text-gray-400 font-medium">💾 Saved analysis</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
                {idea.title}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
            </div>
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

        {/* Original input */}
        <div className="fade-up bg-white rounded-2xl border border-gray-100 p-5 card-lift" style={{ animationDelay: "0.06s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 18 }}>📋</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Original input</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs font-bold text-gray-400 block mb-1">👥 Target users</span>
              <span className="text-gray-800 font-medium">{idea.input.targetUsers}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-xs font-bold text-gray-400 block mb-1">🎚️ Mode</span>
              <span className="text-gray-800 font-medium capitalize">{idea.input.mode}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:col-span-2">
              <span className="text-xs font-bold text-gray-400 block mb-1">🔧 Problem solved</span>
              <span className="text-gray-800 font-medium">{idea.input.problemSolved}</span>
            </div>
            {idea.input.goal && (
              <div className="bg-gray-50 rounded-xl p-3 sm:col-span-2">
                <span className="text-xs font-bold text-gray-400 block mb-1">🏆 Goal</span>
                <span className="text-gray-800 font-medium">{idea.input.goal}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-section grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sectionConfig.map((s, i) => {
            const items = (result as any)[s.key] ?? []
            return (
              <div key={s.key} className="fade-up rounded-2xl border-2 card-lift"
                style={{ background: s.cardBg, borderColor: s.border, animationDelay: `${(i + 2) * 0.06}s` }}>
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
          style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderColor: "#93c5fd", animationDelay: "0.36s" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 20 }}>🎯</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-800">Target user clarity</h3>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{result.targetUserClarity}</p>
        </div>

        {/* MVP scope */}
        <div className="fade-up rounded-2xl border-2 p-5 card-lift"
          style={{ background: "linear-gradient(135deg,#faf5ff,#ede9fe)", borderColor: "#c4b5fd", animationDelay: "0.42s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 20 }}>🗺️</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-800">MVP scope</h3>
          </div>
          <NumberedList items={result.mvpScope ?? []} color="#4c1d95" bg="#ede9fe" />
        </div>

        {/* Validation steps */}
        <div className="fade-up rounded-2xl border-2 p-5 card-lift"
          style={{ background: "linear-gradient(135deg,#f0fdfa,#ccfbf1)", borderColor: "#5eead4", animationDelay: "0.48s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 20 }}>✅</span>
            <h3 className="text-xs font-black uppercase tracking-widest text-teal-800">Validation steps</h3>
          </div>
          <NumberedList items={result.validationSteps ?? []} color="#134e4a" bg="#ccfbf1" />
        </div>

        {/* Final recommendation */}
        <div className="fade-up relative rounded-2xl p-6 sm:p-8 overflow-hidden" style={{ background: "#0f172a", animationDelay: "0.54s" }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 22 }}>💬</span>
              <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>Final recommendation</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{result.finalRecommendation}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-6 fade-up" style={{ animationDelay: "0.60s" }}>
          <button onClick={() => navigate("/new")}
            className="btn-shine w-full flex items-center justify-center gap-2 text-white font-black py-4 rounded-xl text-sm"
            style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 8px 28px rgba(22,163,74,0.35)" }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#15803d,#16a34a)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,#16a34a,#22c55e)"}>
            ⚡ Analyse a new idea
          </button>
        </div>

      </div>
    </div>
  )
}