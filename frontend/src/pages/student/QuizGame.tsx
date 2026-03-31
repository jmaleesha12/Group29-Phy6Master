import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Flag, PlayCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useActiveQuizSession,
  useAnswerCurrentQuizQuestion,
  useCurrentQuizQuestion,
  useMoveToNextQuizQuestion,
  useQuizSession,
  useStartQuizSession,
  useStudentCourses,
  useSubmitQuizSession,
  useVisibleQuizzes,
} from "@/lib/api";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function QuizGame() {
  const navigate = useNavigate();
  const studentId = Number(localStorage.getItem("authUserId")) || undefined;

  const { data: courses = [] } = useStudentCourses(studentId);
  const [courseId, setCourseId] = useState<number | undefined>();
  const [quizId, setQuizId] = useState<number | undefined>();
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const { data: visibleQuizzes = [], isLoading: loadingQuizzes, error: visibleError } = useVisibleQuizzes(studentId, courseId);
  const { data: activeSession, error: activeSessionError } = useActiveQuizSession(studentId, quizId);
  const { data: sessionInfo } = useQuizSession(sessionId, studentId);
  const { data: currentQuestion, isLoading: loadingQuestion, error: currentQuestionError } = useCurrentQuizQuestion(sessionId, studentId);

  const startSession = useStartQuizSession();
  const answerQuestion = useAnswerCurrentQuizQuestion();
  const nextQuestion = useMoveToNextQuizQuestion();
  const submitSession = useSubmitQuizSession();

  useEffect(() => {
    if (!courseId && courses.length > 0) {
      setCourseId(courses[0].id);
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (courseId && visibleQuizzes.length > 0) {
      const stillExists = visibleQuizzes.some((q) => q.id === quizId);
      if (!stillExists) {
        setQuizId(visibleQuizzes[0].id);
        setSessionId(undefined);
      }
    }
    if (courseId && visibleQuizzes.length === 0) {
      setQuizId(undefined);
      setSessionId(undefined);
    }
  }, [courseId, quizId, visibleQuizzes]);

  useEffect(() => {
    if (activeSession?.id) {
      setSessionId(activeSession.id);
    }
  }, [activeSession]);

  useEffect(() => {
    const status = (visibleError as any)?.status || (activeSessionError as any)?.status || (currentQuestionError as any)?.status;
    if (status === 403) {
      toast.error("You are not allowed to access this quiz.");
      navigate("/student/dashboard");
    }
  }, [activeSessionError, currentQuestionError, navigate, visibleError]);

  const progressValue = useMemo(() => {
    if (!currentQuestion) return 0;
    return Math.round((currentQuestion.questionIndex / currentQuestion.totalQuestions) * 100);
  }, [currentQuestion]);

  const handleStartOrResume = () => {
    if (!studentId || !quizId) return;
    startSession.mutate(
      { studentId, quizId },
      {
        onSuccess: (res) => {
          setSessionId(res.id);
          setSelectedOptionId(null);
          toast.success("Quiz session started.");
        },
        onError: (err: any) => {
          if (err?.status === 403) {
            toast.error("You are not enrolled in this class.");
            navigate("/student/dashboard");
            return;
          }
          toast.error(err?.message || "Could not start quiz.");
        },
      }
    );
  };

  const handleSubmitAnswer = () => {
    if (!studentId || !sessionId || !selectedOptionId) {
      toast.info("Select an answer first.");
      return;
    }
    answerQuestion.mutate(
      { sessionId, studentId, selectedOptionId },
      {
        onSuccess: () => toast.success("Answer saved."),
        onError: (err: any) => toast.error(err?.message || "Could not save answer."),
      }
    );
  };

  const handleNext = () => {
    if (!studentId || !sessionId) return;
    nextQuestion.mutate(
      { sessionId, studentId },
      {
        onSuccess: () => setSelectedOptionId(null),
        onError: (err: any) => toast.error(err?.message || "Could not move to next question."),
      }
    );
  };

  const handleSubmitQuiz = () => {
    if (!studentId || !sessionId) return;
    submitSession.mutate(
      { sessionId, studentId },
      {
        onSuccess: (res) => {
          toast.success(`Quiz submitted. Score: ${res.score}/${res.totalQuestions}`);
        },
        onError: (err: any) => toast.error(err?.message || "Could not submit quiz."),
      }
    );
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Interactive Quiz Game</h1>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Choose Class and Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={courseId ?? ""}
                onChange={(e) => {
                  const nextCourseId = Number(e.target.value);
                  setCourseId(Number.isFinite(nextCourseId) ? nextCourseId : undefined);
                  setSelectedOptionId(null);
                }}
              >
                <option value="">Select class</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>

              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={quizId ?? ""}
                onChange={(e) => {
                  const nextQuizId = Number(e.target.value);
                  setQuizId(Number.isFinite(nextQuizId) ? nextQuizId : undefined);
                  setSessionId(undefined);
                  setSelectedOptionId(null);
                }}
                disabled={!courseId || loadingQuizzes}
              >
                <option value="">Select quiz</option>
                {visibleQuizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="gradient-cta text-primary-foreground"
                onClick={handleStartOrResume}
                disabled={!quizId || startSession.isPending}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                {activeSession?.status === "ACTIVE" ? "Resume Session" : "Start Session"}
              </Button>
              {loadingQuizzes && <p className="text-sm text-muted-foreground">Loading quizzes...</p>}
              {!loadingQuizzes && courseId && visibleQuizzes.length === 0 && (
                <p className="text-sm text-muted-foreground">No published quizzes available for this class.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {sessionInfo?.status === "COMPLETED" && (
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="shadow-card border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Session completed</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Final Score: <span className="font-semibold text-foreground">{sessionInfo.score}/{sessionInfo.totalQuestions}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {sessionInfo?.status === "ACTIVE" && (
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Question Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {currentQuestion ? `${currentQuestion.questionIndex}/${currentQuestion.totalQuestions}` : "-"}
                  </span>
                </div>
                <Progress value={progressValue} />
              </div>

              {loadingQuestion ? (
                <p className="text-sm text-muted-foreground">Loading question...</p>
              ) : currentQuestion ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Question {currentQuestion.questionIndex}</p>
                    <p className="text-base font-medium text-foreground">{currentQuestion.question.text}</p>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.question.options.map((option) => {
                      const isSelected = selectedOptionId === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOptionId(option.id)}
                          className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:bg-accent/40"
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            {isSelected ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleSubmitAnswer} disabled={answerQuestion.isPending || !selectedOptionId}>
                      Save Answer
                    </Button>

                    {!currentQuestion.lastQuestion ? (
                      <Button className="gradient-cta text-primary-foreground" onClick={handleNext} disabled={nextQuestion.isPending}>
                        Next Question
                      </Button>
                    ) : (
                      <Button className="gradient-cta text-primary-foreground" onClick={handleSubmitQuiz} disabled={submitSession.isPending}>
                        <Flag className="h-4 w-4 mr-2" /> Submit Quiz
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Start or resume a session to play.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
