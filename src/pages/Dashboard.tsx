import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useIdeas, useDeleteIdea } from "@/hooks/useIdeas"
import { formatDistanceToNow } from "date-fns"
import { Plus, LogOut, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, {
  emoji: string; label: string; color: string; bg: string
  border: string; barColor: string; cardBg: string; accentClass: string
}> = {
  "BUILD IT":   { emoji: "🚀", label: "BUILD IT",   color: "#14532d", bg: "#dcfce7", border: "#86efac", barColor: "linear-gradient(90deg,#16a34a,#4ade80)", cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", accentClass: "card-accent-green"  },
  "NEEDS WORK": { emoji: "🔧", label: "NEEDS WORK", color: "#78350f", bg: "#fef9c3", border: "#fde047", barColor: "linear-gradient(90deg,#d97706,#fbbf24)", cardBg: "linear-gradient(135deg,#fffbeb,#fef9c3)", accentClass: "card-accent-amber"  },
  "RISKY":      { emoji: "⚠️", label: "RISKY",      color: "#7c2d12", bg: "#ffedd5", border: "#fb923c", barColor: "linear-gradient(90deg,#ea580c,#fb923c)", cardBg: "linear-gradient(135deg,#fff7ed,#ffedd5)", accentClass: "card-accent-amber"  },
  "PASS":       { emoji: "❌", label: "PASS",        color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", barColor: "linear-gradient(90deg,#dc2626,#f87171)", cardBg: "linear-gradient(135deg,#fef2f2,#fee2e2)", accentClass: "card-accent-red"    },
}

const statCards = [
  { emoji: "📊", label: "Total analyses", color: "#1e40af", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#93c5fd" },
  { emoji: "⭐", label: "Average score",  color: "#92400e", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d" },
  { emoji: "🚀", label: "Build it",       color: "#14532d", bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "#86efac" },
  { emoji: "📉", label: "Pass / Risky",   color: "#7f1d1d", bg: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "#fca5a5" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { data: ideas, isLoading } = useIdeas()
  const deleteIdea = useDeleteIdea()

  const buildCount = ideas?.filter((i: any) => i.result?.verdict === "BUILD IT").length ?? 0
  const avgScore   = ideas?.length
    ? Math.round(ideas.reduce((acc: number, i: any) => acc + (i.result?.score ?? 0), 0) / ideas.length)
    : 0
  const passRisky  = ideas?.filter((i: any) => ["PASS","RISKY"].includes(i.result?.verdict)).length ?? 0

  const statValues = [ideas?.length ?? 0, avgScore || "—", buildCount, passRisky]

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
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">{user?.email}</span>
            <button onClick={() => navigate("/new")}
              className="btn-shine flex items-center gap-1.5 text-white text-sm font-bold px-4 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 14px rgba(22,163,74,0.4)" }}>
              <Plus size={15} /> New analysis
            </button>
            <button onClick={async () => { await signOut(); toast.success("Signed out 👋"); navigate("/") }}
              className="w-9 h-9 rounded-xl hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-400 transition">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-8 fade-up">
          <div className="flex items-center gap-3 mb-1">
            <span style={{ fontSize: 28 }}>🧠</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Your idea analyses</h1>
          </div>
          <p className="text-sm text-gray-400 ml-11">
            {ideas?.length
              ? `${ideas.length} idea${ideas.length !== 1 ? "s" : ""} analysed so far`
              : "No analyses yet — time to reality-check your first idea!"}
          </p>
        </div>

        {/* Stats */}
        {ideas && ideas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {statCards.map((s, i) => (
              <div key={i} className="fade-up rounded-2xl border p-4 card-lift"
                style={{ background: s.bg, borderColor: s.border, animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                </div>
                <p className="text-2xl font-black" style={{ color: s.color }}>{statValues[i]}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-3 bg-gray-100 rounded mb-3 w-3/4" />
                <div className="h-2 bg-gray-100 rounded mb-6 w-1/3" />
                <div className="h-1.5 bg-gray-100 rounded mb-2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!ideas || ideas.length === 0) && (
          <div className="text-center py-24 fade-up">
            <div className="text-7xl mb-5">💡</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No analyses yet</h2>
            <p className="text-sm text-gray-400 mb-7 max-w-xs mx-auto leading-relaxed">
              Run your first reality check and find out if your idea is worth building.
            </p>
            <button onClick={() => navigate("/new")}
              className="btn-shine inline-flex items-center gap-2 text-white font-bold px-7 py-3 rounded-xl"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 8px 24px rgba(22,163,74,0.35)" }}>
              🚀 Analyse my first idea
            </button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && ideas && ideas.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea: any, idx: number) => {
              const result  = idea.result
              const verdict = result?.verdict ?? "NEEDS WORK"
              const score   = result?.score ?? 0
              const vc      = verdictConfig[verdict] ?? verdictConfig["NEEDS WORK"]
              return (
                <div key={idea.id}
                  onClick={() => navigate(`/ideas/${idea.id}`)}
                  className={`fade-up group rounded-2xl border overflow-hidden cursor-pointer card-lift ${vc.accentClass}`}
                  style={{ background: "white", borderColor: vc.border, animationDelay: `${idx * 0.05}s` }}
                  onMouseEnter={e => (e.currentTarget.style.background = vc.cardBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug flex-1 group-hover:text-gray-700 transition">
                        {idea.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-xl border whitespace-nowrap flex-shrink-0"
                        style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                        {vc.emoji} {vc.label}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400 font-medium">Score</span>
                      <span className="font-black" style={{ color: vc.color }}>{score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 mb-4 overflow-hidden">
                      <div className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, background: vc.barColor }} />
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{result?.summary}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-300">
                        {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Delete this analysis?")) {
                            deleteIdea.mutate(idea.id)
                            toast.success("Deleted 🗑️")
                          }
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* New card */}
            <div onClick={() => navigate("/new")}
              className="group rounded-2xl border-2 border-dashed border-gray-200 p-5 cursor-pointer hover:border-green-400 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] card-lift"
              style={{ background: "white" }}
              onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg,#f0fdf4,#dcfce7)")}
              onMouseLeave={e => (e.currentTarget.style.background = "white")}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
              <p className="text-sm font-bold text-gray-300 group-hover:text-green-600 transition">New analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}