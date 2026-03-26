import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { IdeaInput, AnalysisResult } from "@/types"

export function useIdeas() {
  return useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useSaveIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ input, result }: { input: IdeaInput; result: AnalysisResult }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from("ideas").insert({
        user_id: user!.id,
        title: input.title,
        input,
        result,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ideas"] }),
  })
}

export function useDeleteIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ideas").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ideas"] }),
  })
}