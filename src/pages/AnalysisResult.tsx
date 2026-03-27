import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSaveIdea } from "@/hooks/useIdeas"
import type { AnalysisResult as TResult, IdeaInput } from "@/types"
import { ArrowLeft, BookmarkPlus, Copy, Check, Bookmark, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, { emoji: string; color: string; bg: string; border: string; glow: string; cardBg: string }> = {
  "BUILD IT":   { emoji: "🚀", color: "#14532d", bg: "#dcfce7", border: "#86efac", glow: "0 0 0 4px rgba(22,163,74,0.15),0 16px 48px rgba(22,163,74,0.12)", cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  "NEEDS WORK": { emoji: "🔧", color: "#78350f", bg: "#fef9c3", border: "#fde047", glow: "0 0 0 4px rgba(234,179,8,0.15),0 16px 48px rgba(234,179,8,0.12)",  cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)" },
  "RISKY":      { emoji: "⚠️", color: "#7c2d12", bg: "#ffedd5", border: "#fb923c", glow: "0 0 0 4px rgba(234,88,12,0.15),0 16px 48px rgba(234,88,12,0.12)",  cardBg: "linear-gradient(135deg,#fff7ed,#ffedd5)" },
  "PASS":       { emoji: "❌", color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", glow: "0 0 0 4px rgba(220,38,38,0.15),0 16px 48px rgba(220,38,38,0.12)",  cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
}

const sections = [
  { key: "strengths",   emoji: "✅", title: "Strengths",   color: "#14532d", bg: "#dcfce7", border: "#86efac", cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { key: "weaknesses",  emoji: "⚠️", title: "Weaknesses",  color: "#78350f", bg: "#fef9c3", border: "#fde047", cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)" },
  { key: "risks",       emoji: "🚨", title: "Risks",       color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)" },
  { key: "assumptions", emoji: "🤔", title: "Assumptions", color: "#4c1d95", bg: "#ede9fe", border: "#c4b5fd", cardBg: "linear-gradient(135deg,#faf5ff,#ede9fe)" },
]

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
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
            style={{ background: bg, color }}>{i + 1}</span>
          {item}
        </li>
      ))}
    </ol>
  )
}

function InfoCard({ emoji, title, children, bg, border, titleColor }: {
  emoji: string; title: string; children: React.ReactNode
  bg: string; border: string; titleColor: string
}) {
  return (
    <div className="fade-up rounded-2xl border-2 p-5 card-lift" style={{ background: bg, borderColor: border }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: titleColor }}>{title}</h3>
      </div>
      {children}
    </div>
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f1f5f9", fontFamily: "var(--font)" }}>
      <div className="text-center fade-up">
        <div className="text-7xl mb-4">🔍</div>
        <p className="text-sm text-gray-400 mb-5">No analysis found.</p>
        <button onClick={() => navigate("/new")} className="btn-shine text-sm font-bold px-6 py-3 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>Run a new analysis →</button>
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
    navigator.clipboard.writeText(`RealityCheck: ${result.title}\nScore: ${result.score}/100 — ${result.verdict}\n\n${result.summary}\n\nFinal: ${result.finalRecommendation}`)
    setCopied(true); toast.success("📋 Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: "#f1f5f9", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderBottom: "1px solid #334155" }}
        className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 14px rgba(22,163,74,0.5)" }}>RC</div>
            <span className="font-black text-white text-base tracking-tight">RealityCheck</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl transition"
              style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#334155"; e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#94a3b8" }}>
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span className="hidden sm:block">{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button onClick={handleSave} disabled={saved || saveIdea.isPending}
              className="btn-shine flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white disabled:opacity-60"
              style={{ background: saved ? "#475569" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 4px 14px rgba(22,163,74,0.4)" }}>
              {saveIdea.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}
              <span className="hidden sm:block">{saved ? "Saved" : saveIdea.isPending ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 sm:py-10 space-y-5">

        {/* Hero */}
        <div className="fade-up rounded-2xl border-2 p-6 sm:p-10"
          style={{ background: vc.cardBg, borderColor: vc.border, boxShadow: vc.glow }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="inline-flex items-center gap-2 text-sm font-black px-4 py-2 rounded-xl border"
                  style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                  <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: vc.color }} />
                  {vc.emoji} {verdict}
                </span>
                <span className="text-xs text-gray-400 font-medium">✓ Analysis complete</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-4 leading-tight">{result.title}</h1>
              <p className="text-sm text-gray-600 leading-relaxed text-base">{result.summary}</p>
            </div>
            {/* Fixed score ring */}
            <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 flex-shrink-0">
              <div className="relative w-32 h-32 ring-appear">
                <svg className="w-32 h-32" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="7" />
                  <circle cx="40" cy="40" r="36" fill="none"
                    stroke={vc.color} strokeWidth="7"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={circumference * 0.25}
                    strokeLinecap="round" />
                  <text x="40" y="36" textAnchor="middle" dominantBaseline="middle"
                    fontSize="16" fontWeight="900" fill={vc.color}>{result.score}</text>
                  <text x="40" y="50" textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="#94a3b8">/100</text>
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-semibold">Overall score</span>
            </div>
          </div>
        </div>

        {/* Market & Competitive — NEW */}
        {(result.marketOpportunity || result.competitiveEdge) && (
          <div className="grid sm:grid-cols-2 gap-5">
            {result.marketOpportunity && (
              <InfoCard emoji="📈" title="Market opportunity" bg="linear-gradient(135deg,#f0fdf4,#dcfce7)" border="#86efac" titleColor="#14532d">
                <p className="text-sm text-gray-700 leading-relaxed">{result.marketOpportunity}</p>
              </InfoCard>
            )}
            {result.competitiveEdge && (
              <InfoCard emoji="⚔️" title="Competitive edge" bg="linear-gradient(135deg,#eff6ff,#dbeafe)" border="#93c5fd" titleColor="#1e3a8a">
                <p className="text-sm text-gray-700 leading-relaxed">{result.competitiveEdge}</p>
              </InfoCard>
            )}
          </div>
        )}

        {/* 4-section grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {sections.map((s, i) => {
            const items = (result as any)[s.key] ?? []
            return (
              <div key={s.key} className="fade-up rounded-2xl border-2 card-lift"
                style={{ background: s.cardBg, borderColor: s.border, animationDelay: `${i * 0.06}s` }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: s.color }}>{s.title}</h3>
                  </div>
                  <BulletList items={items} color={s.color} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Target user */}
        <InfoCard emoji="🎯" title="Target user clarity" bg="linear-gradient(135deg,#eff6ff,#dbeafe)" border="#93c5fd" titleColor="#1e3a8a">
          <p className="text-sm text-blue-900 leading-relaxed">{result.targetUserClarity}</p>
        </InfoCard>

        {/* MVP + Validation side by side */}
        <div className="grid sm:grid-cols-2 gap-5">
          <InfoCard emoji="🗺️" title="MVP scope" bg="linear-gradient(135deg,#faf5ff,#ede9fe)" border="#c4b5fd" titleColor="#4c1d95">
            <NumberedList items={result.mvpScope ?? []} color="#4c1d95" bg="#ede9fe" />
          </InfoCard>
          <InfoCard emoji="✅" title="Validation steps" bg="linear-gradient(135deg,#f0fdfa,#ccfbf1)" border="#5eead4" titleColor="#134e4a">
            <NumberedList items={result.validationSteps ?? []} color="#134e4a" bg="#ccfbf1" />
          </InfoCard>
        </div>

        {/* Monetization + Founder — NEW */}
        {(result.monetizationThoughts || result.founderFitNote) && (
          <div className="grid sm:grid-cols-2 gap-5">
            {result.monetizationThoughts && (
              <InfoCard emoji="💰" title="Monetization thoughts" bg="linear-gradient(135deg,#fffbeb,#fef3c7)" border="#fcd34d" titleColor="#78350f">
                <p className="text-sm text-amber-900 leading-relaxed">{result.monetizationThoughts}</p>
              </InfoCard>
            )}
            {result.founderFitNote && (
              <InfoCard emoji="👤" title="Founder fit" bg="linear-gradient(135deg,#fdf2f8,#fce7f3)" border="#f9a8d4" titleColor="#831843">
                <p className="text-sm leading-relaxed" style={{ color: "#831843" }}>{result.founderFitNote}</p>
              </InfoCard>
            )}
          </div>
        )}

        {/* Final recommendation */}
        <div className="fade-up relative rounded-2xl p-8 overflow-hidden" style={{ background: "#0f172a" }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.07] pointer-events-none"
            style={{ background: "radial-gradient(circle, #22c55e, transparent)", transform: "translate(30%,-30%)" }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontSize: 26 }}>💬</span>
              <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "#64748b" }}>Final recommendation</h3>
            </div>
            <p className="text-base leading-relaxed" style={{ color: "#e2e8f0" }}>{result.finalRecommendation}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 pb-8">
          <button onClick={() => navigate("/new")}
            className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-bold py-4 px-6 rounded-xl transition text-sm card-lift">
            <ArrowLeft size={15} /> Analyse another idea
          </button>
          <button onClick={handleSave} disabled={saved}
            className="btn-shine flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl text-sm text-white disabled:opacity-60"
            style={{ background: saved ? "#475569" : "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: saved ? "none" : "0 6px 24px rgba(22,163,74,0.4)" }}>
            {saved ? "💾 Saved to dashboard" : "💾 Save to dashboard"}
          </button>
        </div>
      </div>
    </div>
  )
}