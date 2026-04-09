import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api-client";
import type { CurrentQuestionResponse, QuizSessionResponse, QuizSummary } from "./types";

export function useVisibleQuizzes(studentId: number | undefined, courseId: number | undefined) {
  return useQuery<QuizSummary[]>({
    queryKey: ["visible-quizzes", studentId, courseId],
    queryFn: async () => {
      const page = await get<{ content: QuizSummary[] }>(`/api/quizzes/visible?studentId=${studentId}&page=0&size=100`);
      const items = page.content ?? [];
      if (!courseId) {
        return items;
      }
      return items.filter((quiz) => quiz.courseId === courseId);
    },
    enabled: !!studentId && !!courseId,
  });
}

export function useStartQuizSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, quizId }: { studentId: number; quizId: number }) =>
      post<QuizSessionResponse>("/api/quiz-sessions", { studentId, quizId }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["active-quiz-session", data.studentId, data.quizId] });
      qc.invalidateQueries({ queryKey: ["quiz-session", data.id, data.studentId] });
      qc.invalidateQueries({ queryKey: ["current-quiz-question", data.id, data.studentId] });
    },
  });
}

export function useActiveQuizSession(studentId: number | undefined, quizId: number | undefined) {
  return useQuery<QuizSessionResponse>({
    queryKey: ["active-quiz-session", studentId, quizId],
    queryFn: () => get<QuizSessionResponse>(`/api/quiz-sessions/active?studentId=${studentId}&quizId=${quizId}`),
    enabled: !!studentId && !!quizId,
    retry: false,
  });
}

export function useQuizSession(sessionId: number | undefined, studentId: number | undefined) {
  return useQuery<QuizSessionResponse>({
    queryKey: ["quiz-session", sessionId, studentId],
    queryFn: () => get<QuizSessionResponse>(`/api/quiz-sessions/${sessionId}?studentId=${studentId}`),
    enabled: !!sessionId && !!studentId,
  });
}

export function useCurrentQuizQuestion(sessionId: number | undefined, studentId: number | undefined) {
  return useQuery<CurrentQuestionResponse>({
    queryKey: ["current-quiz-question", sessionId, studentId],
    queryFn: () => get<CurrentQuestionResponse>(`/api/quiz-sessions/${sessionId}/current-question?studentId=${studentId}`),
    enabled: !!sessionId && !!studentId,
    retry: false,
  });
}

export function useAnswerCurrentQuizQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, studentId, selectedOptionId }: { sessionId: number; studentId: number; selectedOptionId: number }) =>
      post<QuizSessionResponse>(`/api/quiz-sessions/${sessionId}/answer`, { studentId, selectedOptionId }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quiz-session", data.id, data.studentId] });
      qc.invalidateQueries({ queryKey: ["current-quiz-question", data.id, data.studentId] });
    },
  });
}

export function useMoveToNextQuizQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, studentId }: { sessionId: number; studentId: number }) =>
      post<QuizSessionResponse>(`/api/quiz-sessions/${sessionId}/next`, { studentId }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quiz-session", data.id, data.studentId] });
      qc.invalidateQueries({ queryKey: ["current-quiz-question", data.id, data.studentId] });
    },
  });
}

export function useSubmitQuizSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, studentId }: { sessionId: number; studentId: number }) =>
      post<QuizSessionResponse>(`/api/quiz-sessions/${sessionId}/submit`, { studentId }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quiz-session", data.id, data.studentId] });
      qc.invalidateQueries({ queryKey: ["active-quiz-session", data.studentId, data.quizId] });
    },
  });
}
