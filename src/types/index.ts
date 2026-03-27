export interface IdeaInput {
  title: string
  description: string
  targetUsers: string
  problemSolved: string
  goal?: string
  mode?: "quick" | "deep" | "savage"
}

export interface AnalysisResult {
  id?: string
  user_id?: string
  title: string
  input: IdeaInput
  summary: string
  score: number
  verdict: "BUILD IT" | "NEEDS WORK" | "RISKY" | "PASS"
  marketOpportunity?: string
  competitiveEdge?: string
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  assumptions: string[]
  targetUserClarity: string
  mvpScope: string[]
  validationSteps: string[]
  monetizationThoughts?: string
  founderFitNote?: string
  finalRecommendation: string
  created_at?: string
}