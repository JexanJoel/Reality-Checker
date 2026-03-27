import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowRight, Menu, X,
  Zap, Target, Shield, Map, CheckSquare, Save,
  BarChart2, Lightbulb, TrendingUp
} from "lucide-react"

// Inline GitHub SVG icon (lucide-react removed the Github export)
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

const FEATURES = [
  { icon: <Zap size={20} />,         color: "green",  tag: "Core",     title: "Instant AI analysis",        desc: "Full structured breakdown in under 30 seconds. Score, verdict, strengths, risks, MVP scope — all from a single form submission." },
  { icon: <Target size={20} />,      color: "blue",   tag: null,       title: "User clarity score",          desc: "Know exactly who your product is for before you write a line of code. AI rates how clearly you've defined your target user." },
  { icon: <Shield size={20} />,      color: "red",    tag: null,       title: "Risk & assumption detection", desc: "Surface hidden assumptions and risks that could sink your product early — before you invest time and money building it." },
  { icon: <Map size={20} />,         color: "amber",  tag: null,       title: "MVP scope planner",           desc: "Get a focused, prioritized build plan so you ship the right features first and avoid scope creep from day one." },
  { icon: <CheckSquare size={20} />, color: "teal",   tag: null,       title: "Validation steps",            desc: "Concrete, actionable steps to test market demand before you spend weeks building the wrong thing." },
  { icon: <Save size={20} />,        color: "indigo", tag: null,       title: "Dashboard history",           desc: "Save every analysis to your personal dashboard. Track how your thinking evolves and revisit any idea anytime." },
  { icon: <BarChart2 size={20} />,   color: "purple", tag: "New",      title: "Idea scoring",                desc: "Every idea gets a 0–100 score across multiple dimensions. Compare ideas side by side and know which ones are worth pursuing." },
  { icon: <Lightbulb size={20} />,   color: "orange", tag: null,       title: "3 analysis modes",            desc: "Quick overview, Deep analysis, or Savage mode for brutally honest feedback. Pick the level of detail you need." },
  { icon: <TrendingUp size={20} />,  color: "cyan",   tag: null,       title: "Final recommendation",        desc: "Every report ends with a clear, plain-English recommendation: build it, iterate, or move on — so you always know the next step." },
]

const COLOR_MAP: Record<string, { bg: string; icon: string; tag: string; border: string }> = {
  green:  { bg: "bg-green-50",  icon: "text-green-600",  tag: "bg-green-600 text-white",  border: "hover:border-green-300" },
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   tag: "bg-blue-600 text-white",   border: "hover:border-blue-300" },
  red:    { bg: "bg-red-50",    icon: "text-red-600",    tag: "bg-red-600 text-white",    border: "hover:border-red-300" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  tag: "bg-amber-500 text-white",  border: "hover:border-amber-300" },
  teal:   { bg: "bg-teal-50",   icon: "text-teal-600",   tag: "bg-teal-500 text-white",   border: "hover:border-teal-300" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", tag: "bg-indigo-600 text-white", border: "hover:border-indigo-300" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", tag: "bg-purple-600 text-white", border: "hover:border-purple-300" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600", tag: "bg-orange-500 text-white", border: "hover:border-orange-300" },
  cyan:   { bg: "bg-cyan-50",   icon: "text-cyan-600",   tag: "bg-cyan-500 text-white",   border: "hover:border-cyan-300" },
}

const STEPS = [
  { n: "01", title: "Describe your idea",   desc: "Title, description, target user, problem solved — plain English. Takes 2 minutes." },
  { n: "02", title: "Choose analysis mode", desc: "Quick for a fast overview, Deep for thorough analysis, Savage for brutal honesty." },
  { n: "03", title: "Get your verdict",     desc: "AI returns a scored, structured breakdown across 8 dimensions in under 30 seconds." },
  { n: "04", title: "Save & iterate",       desc: "Save results to your dashboard, revisit anytime, and track how your ideas evolve." },
]

const EXAMPLES = [
  { title: "Micro-SaaS expense tracker", score: 84, verdict: "BUILD IT",   vColor: "text-green-700 bg-green-50 border-green-200", bar: "#16a34a", summary: "Clear niche, underserved market. Well-scoped MVP for solo developers." },
  { title: "AI chatbot for restaurants",  score: 58, verdict: "NEEDS WORK", vColor: "text-amber-700 bg-amber-50 border-amber-200", bar: "#d97706", summary: "Solid problem but crowded market. Needs tighter niche to differentiate." },
  { title: "Crypto portfolio tracker",    score: 29, verdict: "PASS",       vColor: "text-red-700 bg-red-50 border-red-200",       bar: "#dc2626", summary: "Oversaturated with well-funded competitors. No clear differentiator." },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const handleCTA = () => navigate(user ? "/new" : "/auth")

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "var(--font)" }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
              style={{ background: "var(--green)" }}>RC</div>
            <span className="font-bold text-gray-900 tracking-tight">RealityCheck</span>
            <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{ background: "var(--green-light)", color: "var(--green)", borderColor: "var(--green-border)" }}>
              Open Source
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href="https://github.com/JexanJoel/Build-Signal" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition px-3 py-2">
              <GithubIcon size={15} /> GitHub
            </a>
            {user ? (
              <button className="btn-primary text-sm px-4 py-2" onClick={() => navigate("/dashboard")}>Dashboard →</button>
            ) : (
              <>
                <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition px-3 py-2"
                  onClick={() => navigate("/auth")}>Sign in</button>
                <button className="btn-primary text-sm px-4 py-2" onClick={() => navigate("/auth")}>Get started free</button>
              </>
            )}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            <a href="https://github.com/JexanJoel/Build-Signal" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2.5 rounded-xl hover:bg-gray-50">
              <GithubIcon size={15} /> GitHub
            </a>
            <button onClick={() => { navigate("/auth"); setMenuOpen(false) }}
              className="w-full text-left text-sm text-gray-600 font-medium px-3 py-2.5 rounded-xl hover:bg-gray-50">
              Sign in
            </button>
            <button onClick={() => { navigate("/auth"); setMenuOpen(false) }}
              className="btn-primary w-full text-sm py-3">
              Get started free
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #f0fdf4 0%, white 60%)" }} />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "#86efac" }} />

        <div className="relative max-w-5xl mx-auto">
          {/* Badge cluster */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl mx-auto">
            {[
              { text: "Groq + Llama 3.3 70B",   bg: "bg-green-50  border-green-100  text-green-700" },
              { text: "8 analysis dimensions",   bg: "bg-blue-50   border-blue-100   text-blue-700" },
              { text: "BUILD IT / PASS verdict", bg: "bg-amber-50  border-amber-100  text-amber-700" },
              { text: "Works in 30 seconds",     bg: "bg-teal-50   border-teal-100   text-teal-700" },
              { text: "Save to dashboard",       bg: "bg-indigo-50 border-indigo-100 text-indigo-700" },
              { text: "Apache 2.0",              bg: "bg-gray-50   border-gray-200   text-gray-600" },
            ].map((b, i) => (
              <span key={i} className={`inline-flex items-center border text-[11px] font-medium px-3 py-1.5 rounded-full ${b.bg}`}>
                {b.text}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Your idea's permanent<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
              reality check.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Log your idea, get full AI analysis, and know whether to build it — before you waste a single day.
            Structured verdict. Clear next steps. <span className="text-gray-900 font-medium">Every time.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <button onClick={handleCTA}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold px-10 py-4 rounded-2xl transition-all"
              style={{ background: "var(--green)", boxShadow: "0 10px 25px -5px rgba(22,163,74,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--green-dark)"; e.currentTarget.style.transform = "scale(1.02)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.transform = "scale(1)" }}>
              Analyse an idea free <ArrowRight size={18} />
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold px-10 py-4 rounded-2xl transition-all hover:bg-gray-50">
              <GithubIcon size={18} /> View on GitHub
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free forever · No credit card · Open source</p>
        </div>

        {/* Hero terminal card */}
        <div className="relative max-w-3xl mx-auto mt-14 sm:mt-20 px-2 sm:px-0">
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-gray-500 text-xs font-mono">realitycheck · idea: micro-saas-tracker</span>
            </div>
            <div className="p-5 sm:p-7 font-mono text-xs sm:text-sm space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-green-400 flex-shrink-0">→</span>
                <div>
                  <p className="text-green-300">Running Reality Check · Groq + Llama 3.3 70B</p>
                  <p className="text-gray-500 text-xs mt-0.5">mode: deep · target: freelancers · 8 dimensions</p>
                </div>
              </div>
              <div className="border-l-2 border-green-500/30 ml-1.5 pl-4 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <p className="text-green-300">Score: 84/100 · Verdict: <span className="font-bold text-green-400">BUILD IT</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 flex-shrink-0">✓</span>
                  <p className="text-blue-300">3 strengths · 2 weaknesses · 3 risks identified</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 flex-shrink-0">✓</span>
                  <p className="text-amber-300">MVP: 3 core features · 3 validation steps ready</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-start gap-3">
                <span className="text-indigo-400 flex-shrink-0">💾</span>
                <p className="text-indigo-300">Analysis saved to dashboard · ready to revisit anytime</p>
              </div>
              <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
                <p className="text-gray-400 text-xs">Final: <span className="text-white">Clear niche, underserved market, strong recurring revenue potential.</span></p>
                <span className="text-xs text-gray-600 font-mono">~28s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example cards */}
      <section className="py-10 sm:py-14 border-y border-gray-100 bg-gray-50 overflow-hidden">
        <p className="text-center text-xs text-gray-400 font-semibold uppercase tracking-widest mb-8 px-4">
          Example analyses
        </p>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-4">
          {EXAMPLES.map((e) => (
            <div key={e.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{e.title}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border whitespace-nowrap flex-shrink-0 ${e.vColor}`}>
                  {e.verdict}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Score</span>
                <span className="font-semibold text-gray-700">{e.score}/100</span>
              </div>
              <div className="h-1 rounded-full bg-gray-100 mb-3">
                <div className="h-1 rounded-full" style={{ width: `${e.score}%`, background: e.bar }} />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{e.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border mb-4"
              style={{ background: "var(--green-light)", color: "var(--green)", borderColor: "var(--green-border)" }}>
              <Zap size={11} /> Everything included
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Everything you need to validate fast
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Not just a chatbot — a structured idea review tool that gives you real answers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const c = COLOR_MAP[f.color]
              return (
                <div key={i}
                  className={`group relative bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 transition-all duration-200 hover:shadow-md ${c.border} cursor-default`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 ${c.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className={c.icon}>{f.icon}</span>
                    </div>
                    {f.tag && <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${c.tag}`}>{f.tag}</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { v: "8",    l: "Analysis sections",  color: "text-green-600" },
              { v: "30s",  l: "Avg. analysis time",  color: "text-blue-600" },
              { v: "3",    l: "Analysis modes",      color: "text-amber-600" },
              { v: "100%", l: "Free to use",         color: "text-indigo-600" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.v}</p>
                <p className="text-xs text-gray-400 font-medium">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">How it works</h2>
            <p className="text-gray-400 text-base">From idea to verdict — in under a minute</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 sm:left-7 top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />
            <div className="space-y-4 sm:space-y-0">
              {STEPS.map((s, i) => (
                <div key={i} className="relative flex items-start gap-4 sm:gap-6 sm:pb-8 last:pb-0">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-lg"
                    style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", boxShadow: "0 8px 20px -4px rgba(22,163,74,0.4)" }}>
                    <span className="text-sm">{s.n}</span>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-sm hover:border-green-200 transition min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{s.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-black text-lg">RC</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                Stop guessing. Start validating.
              </h2>
              <p className="text-green-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Free forever. Open source. Built for builders who move fast.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button onClick={handleCTA}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition shadow-lg"
                  style={{ color: "var(--green)" }}>
                  Get started free <ArrowRight size={17} />
                </button>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl transition">
                  <GithubIcon size={17} /> View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black"
              style={{ background: "var(--green)" }}>RC</div>
            <span className="font-bold text-gray-900 text-sm">RealityCheck</span>
            <span className="text-gray-400 text-sm">· Open Source</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm text-center">© 2025 RealityCheck. Built for builders who ship.</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-gray-700 transition flex items-center gap-1">
              <GithubIcon size={12} /> GitHub
            </a>
            <span>·</span>
            <span className="font-mono border border-gray-200 px-2 py-0.5 rounded">Apache 2.0</span>
          </div>
        </div>
      </footer>

    </div>
  )
}