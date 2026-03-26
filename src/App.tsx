import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Landing from "@/pages/Landing"
import Auth from "@/pages/Auth"
import Dashboard from "@/pages/Dashboard"
import NewAnalysis from "@/pages/NewAnalysis"
import AnalysisResult from "@/pages/AnalysisResult"
import IdeaDetail from "@/pages/IdeaDetail"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Loading...
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/auth" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/new" element={<PrivateRoute><NewAnalysis /></PrivateRoute>} />
      <Route path="/result" element={<PrivateRoute><AnalysisResult /></PrivateRoute>} />
      <Route path="/ideas/:id" element={<PrivateRoute><IdeaDetail /></PrivateRoute>} />
    </Routes>
  )
}