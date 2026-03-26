import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Loader2, CheckCircle, Zap, BarChart2, Lightbulb, Shield } from "lucide-react"
import toast from "react-hot-toast"

// Inline GitHub SVG icon (lucide-react removed the Github export)
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

const loginFeatures = [
  { icon: <Zap size={14} />,         text: "AI analysis in under 30 seconds" },
  { icon: <BarChart2 size={14} />,   text: "Score, verdict, and structured breakdown" },
  { icon: <CheckCircle size={14} />, text: "Save and revisit every analysis" },
  { icon: <Shield size={14} />,      text: "Secure by Supabase Auth" },
]

const registerFeatures = [
  { icon: <Lightbulb size={14} />,   text: "Unlimited idea analyses — free" },
  { icon: <Zap size={14} />,         text: "Groq + Llama 3.3 70B under the hood" },
  { icon: <BarChart2 size={14} />,   text: "Dashboard history for all your ideas" },
  { icon: <CheckCircle size={14} />, text: "MVP scope and validation steps" },
]

function LeftPanel({ isLogin }: { isLogin: boolean }) {
  const features = isLogin ? loginFeatures : registerFeatures
  return (
    <div
      className="hidden lg:flex lg:w-[45%] flex-col min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #14532d 0%, #16a34a 60%, #22c55e 100%)" }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-900 opacity-20 rounded-full blur-3xl" />

      {/* Logo */}
      <div className="relative z-10 p-10 pb-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">RC</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">RealityCheck</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-10">
        <div className="w-full max-w-xs space-y-7 text-center">
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
            {isLogin ? <>Validate ideas,<br />With confidence.</> : <>Stop building the<br />Wrong thing.</>}
          </h2>

          <div className="flex flex-col gap-2.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm text-left">
                <span className="text-green-200 flex-shrink-0">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { v: "8",    l: "Analysis sections" },
              { v: "30s",  l: "Avg. analysis time" },
              { v: "100%", l: "Free to use" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-xl py-3">
                <p className="text-white font-bold text-xl">{s.v}</p>
                <p className="text-green-200 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Mini result card */}
          <div className="bg-black/20 border border-white/15 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs font-mono">Micro-SaaS Tracker</span>
              <span className="bg-green-500/30 text-green-200 text-[10px] px-2 py-0.5 rounded-full border border-green-400/30 font-bold">
                BUILD IT
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1 mb-2">
              <div className="h-1 rounded-full bg-green-300" style={{ width: "84%" }} />
            </div>
            <p className="text-green-300 text-xs font-mono">Score: 84/100 · Clear niche, strong MVP</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-10 pt-0">
        <p className="text-white/25 text-xs">© 2025 RealityCheck · Apache 2.0</p>
      </div>
    </div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !password) return toast.error("Please fill in all fields")
    if (!isLogin && !name) return toast.error("Please enter your name")
    if (password.length < 6) return toast.error("Password must be at least 6 characters")

    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Welcome back!")
        navigate("/dashboard")
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        })
        if (error) throw error
        if (data.session) {
          toast.success("Account created! Welcome 🎉")
          navigate("/dashboard")
        } else {
          toast.error("Please disable email confirmation in Supabase Auth settings.")
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  async function handleGithub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  function switchMode() {
    setIsLogin(!isLogin)
    setName(""); setEmail(""); setPassword("")
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font)" }}>
      <LeftPanel isLogin={isLogin} />

      {/* Right panel */}
      <div className="relative w-full lg:w-[55%] flex items-center justify-center px-6 sm:px-16 bg-gray-50 min-h-screen">

        {/* Back — desktop */}
        <div className="hidden lg:flex absolute top-8 left-8">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition font-medium">
            <ArrowLeft size={14} /> Back to home
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Back — mobile */}
          <div className="lg:hidden flex justify-start mb-6">
            <button onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition font-medium">
              <ArrowLeft size={14} /> Back to home
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
              style={{ background: "var(--green)" }}>RC</div>
            <span className="font-bold text-gray-900">RealityCheck</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-sm text-gray-400">
                {isLogin ? "Sign in to your account" : "Free forever · No credit card needed"}
              </p>
            </div>

            <div className="space-y-3">
              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleGoogle}
                  className="flex items-center justify-center gap-2 border-2 border-gray-100 hover:border-green-200 hover:bg-green-50 text-gray-700 rounded-xl py-2.5 transition text-sm font-medium">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                  Google
                </button>
                <button onClick={handleGithub}
                  className="flex items-center justify-center gap-2 border-2 border-gray-100 hover:border-green-200 hover:bg-green-50 text-gray-700 rounded-xl py-2.5 transition text-sm font-medium">
                  <GithubIcon size={15} />
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-3">
                <hr className="flex-1 border-gray-100" />
                <span className="text-gray-300 text-xs font-medium">OR</span>
                <hr className="flex-1 border-gray-100" />
              </div>

              {/* Name (register only) */}
              {!isLogin && (
                <input type="text" placeholder="Full name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-100 focus:border-green-400 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-green-50 transition placeholder-gray-300"
                />
              )}

              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-100 focus:border-green-400 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-green-50 transition placeholder-gray-300"
              />

              <div className="space-y-1">
                <input type="password" placeholder={isLogin ? "Password" : "Password (min 6 characters)"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full border-2 border-gray-100 focus:border-green-400 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-green-50 transition placeholder-gray-300"
                />
                {isLogin && (
                  <div className="flex justify-end">
                    <button className="text-xs font-medium transition hover:underline" style={{ color: "var(--green)" }}>
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <button onClick={handleSubmit}
                disabled={loading || !email || !password || (!isLogin && !name)}
                className="w-full flex items-center justify-center gap-2 text-white rounded-xl py-3 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                style={{ background: "var(--green)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--green-dark)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--green)")}>
                {loading && <Loader2 size={15} className="animate-spin" />}
                {isLogin ? "Sign in" : "Create free account"}
              </button>

              {!isLogin && (
                <p className="text-center text-gray-300 text-xs">
                  By signing up you agree to our{" "}
                  <span className="cursor-pointer hover:underline" style={{ color: "var(--green)" }}>Terms</span>
                  {" & "}
                  <span className="cursor-pointer hover:underline" style={{ color: "var(--green)" }}>Privacy Policy</span>
                </p>
              )}
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={switchMode} className="font-semibold hover:underline" style={{ color: "var(--green)" }}>
              {isLogin ? "Create one free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}