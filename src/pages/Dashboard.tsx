import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useIdeas, useDeleteIdea } from "@/hooks/useIdeas"
import { formatDistanceToNow } from "date-fns"
import { Plus, LogOut, TrendingUp, CheckCircle, AlertTriangle, XCircle, Lightbulb, Trash2, BarChart2 } from "lucide-react"
import toast from "react-hot-toast"

const verdictConfig: Record<string, {
  color: string; bg: string; border: string
  icon: React.ReactNode; barColor: string; glow: string; accentClass: string
}> = {
  "BUILD IT":   { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", icon: <CheckCircle size={11} />,  barColor: "#16a34a", glow: "rgba(22,163,74,0.08)",  accentClass: "card-accent-green"  },
  "NEEDS WORK": { color: "#b45309", bg: "#fffbeb", border: "#fde68a", icon: <AlertTriangle size={11} />, barColor: "#d97706", glow: "rgba(217,119,6,0.08)",  accentClass: "card-accent-amber"  },
  "RISKY":      { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", icon: <AlertTriangle size={11} />, barColor: "#ea580c", glow: "rgba(234,88,12,0.08)",  accentClass: "card-accent-amber"  },
  "PASS":       { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", icon: <XCircle size={11} />,      barColor: "#dc2626", glow: "rgba(220,38,38,0.08)",  accentClass: "card-accent-red"    },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { data: ideas, isLoading } = useIdeas()
  const deleteIdea = useDeleteIdea()

  const buildCount = ideas?.filter((i: any) => i.result?.verdict === "BUILD IT").length ?? 0
  const avgScore   = ideas?.length
    ? Math.round(ideas.reduce((acc: number, i: any) => acc + (i.result?.score ?? 0), 0) / ideas.length)
    : 0

  async function handleSignOut() {
    await signOut(); toast.success("Signed out"); navigate("/")
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg"
              style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
              RC
            </div>
            <span className="font-bold text-gray-900 tracking-tight">RealityCheck</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[180px]">{user?.email}</span>
            <button onClick={() => navigate("/new")}
              className="btn-shine flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
              style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 4px 14px rgba(22,163,74,0.35)" }}>
              <Plus size={15} /> New analysis
            </button>
            <button onClick={handleSignOut}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">Your analyses</h1>
          <p className="text-sm text-gray-400">
            {ideas?.length ? `${ideas.length} idea${ideas.length !== 1 ? "s" : ""} analysed` : "No analyses yet — run your first reality check"}
          </p>
        </div>

        {/* Stats bar */}
        {ideas && ideas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total analyses", value: ideas.length,     color: "#0f172a", icon: <BarChart2 size={16} />, iconBg: "#f1f5f9",  iconColor: "#64748b"  },
              { label: "Average score",  value: `${avgScore}`,    color: "#2563eb", icon: <TrendingUp size={16} />, iconBg: "#eff6ff",  iconColor: "#2563eb"  },
              { label: "Build it",       value: buildCount,        color: "#16a34a", icon: <CheckCircle size={16} />, iconBg: "#f0fdf4", iconColor: "#16a34a"  },
              { label: "Pass / Risky",   value: ideas.filter((i: any) => ["PASS","RISKY"].includes(i.result?.verdict)).length,
                color: "#dc2626", icon: <XCircle size={16} />, iconBg: "#fef2f2", iconColor: "#dc2626" },
            ].map((s, i) => (
              <div key={i} className="fade-up bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 card-lift"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.iconBg, color: s.iconColor }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-3 bg-gray-100 rounded mb-3 w-3/4" />
                <div className="h-2 bg-gray-100 rounded mb-6 w-1/3" />
                <div className="h-1.5 bg-gray-100 rounded mb-2" />
                <div className="h-2 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!ideas || ideas.length === 0) && (
          <div className="text-center py-24 fade-up">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl relative"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", boxShadow: "0 8px 32px rgba(22,163,74,0.12)" }}>
              💡
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No analyses yet</h2>
            <p className="text-sm text-gray-400 mb-7 max-w-xs mx-auto leading-relaxed">
              Run your first reality check and find out if your idea is worth building.
            </p>
            <button onClick={() => navigate("/new")}
              className="btn-shine inline-flex items-center gap-2 text-white font-semibold px-7 py-3 rounded-xl transition"
              style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 8px 24px rgba(22,163,74,0.3)" }}>
              <Lightbulb size={16} /> Analyse my first idea
            </button>
          </div>
        )}

        {/* Ideas grid */}
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
                  className={`fade-up group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer card-lift ${vc.accentClass}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-green-700 transition-colors flex-1">
                        {idea.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap flex-shrink-0"
                        style={{ color: vc.color, background: vc.bg, borderColor: vc.border }}>
                        {vc.icon} {verdict}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Score</span>
                      <span className="font-bold" style={{ color: vc.color }}>{score}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
                      <div className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, background: `linear-gradient(90deg, ${vc.barColor}, ${vc.barColor}cc)` }} />
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{result?.summary}</p>

                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-50">
                      <span className="text-xs text-gray-300">
                        {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Delete this analysis?")) { deleteIdea.mutate(idea.id); toast.success("Deleted") }}}
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
              className="group bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 cursor-pointer hover:border-green-300 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px]"
              style={{ background: "linear-gradient(135deg, #fafafa, #f8fafc)" }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, #f0fdf4, #dcfce7)"}
              onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, #fafafa, #f8fafc)"}>
              <div className="w-11 h-11 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-green-300 flex items-center justify-center mb-3 transition">
                <Plus size={20} className="text-gray-300 group-hover:text-green-500 transition" />
              </div>
              <p className="text-sm font-semibold text-gray-300 group-hover:text-green-600 transition">New analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}