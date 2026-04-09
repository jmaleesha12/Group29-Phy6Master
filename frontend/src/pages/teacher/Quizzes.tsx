import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useCourses,
  useCreateTeacherQuiz,
  useDeleteTeacherQuiz,
  useTeacherQuizzes,
} from "@/lib/api";

function createQuestion() {
  return {
    text: "",
    options: [
      { text: "", correct: true },
      { text: "", correct: false },
    ],
  };
}

export default function TeacherQuizzes() {
  const teacherId = Number(localStorage.getItem("authUserId")) || 0;
  const { data: courses = [] } = useCourses();
  const teacherCourses = useMemo(() => courses.filter((c) => c.teacher?.id === teacherId), [courses, teacherId]);

  const { data: quizzes = [], isLoading } = useTeacherQuizzes(teacherId || undefined);
  const createQuiz = useCreateTeacherQuiz();
  const deleteQuiz = useDeleteTeacherQuiz();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<number | undefined>();
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [questions, setQuestions] = useState([createQuestion()]);

  const addQuestion = () => setQuestions((prev) => [...prev, createQuestion()]);

  const setQuestionText = (index: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, text: value } : q)));
  };

  const setOptionText = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qIndex
          ? q
          : {
              ...q,
              options: q.options.map((o, oi) => (oi === oIndex ? { ...o, text: value } : o)),
            }
      )
    );
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qIndex
          ? q
          : {
              ...q,
              options: q.options.map((o, oi) => ({ ...o, correct: oi === oIndex })),
            }
      )
    );
  };

  const resetForm = () => {
    setTitle("");
    setCourseId(undefined);
    setStatus("PUBLISHED");
    setQuestions([createQuestion()]);
  };

  const handleCreate = () => {
    if (!title.trim() || !courseId) {
      toast.error("Title and class are required.");
      return;
    }

    if (questions.some((q) => !q.text.trim() || q.options.some((o) => !o.text.trim()))) {
      toast.error("Please complete all question and option fields.");
      return;
    }

    createQuiz.mutate(
      {
        teacherId,
        title: title.trim(),
        courseId,
        status,
        questions,
      },
      {
        onSuccess: () => {
          toast.success("Quiz uploaded successfully.");
          setShowCreate(false);
          resetForm();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to upload quiz.");
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteQuiz.mutate(
      { id, teacherId },
      {
        onSuccess: () => toast.success("Quiz deleted."),
        onError: (err: any) => toast.error(err?.message || "Failed to delete quiz."),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Quiz Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload quizzes and publish them for students.</p>
        </div>
        <Button className="gradient-cta text-primary-foreground" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> Upload Quiz
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <FileQuestion className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No quizzes uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{quiz.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Class ID: {quiz.courseId}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    quiz.status === "PUBLISHED" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {quiz.status}
                </span>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(quiz.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Upload New Quiz</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" className="bg-secondary border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={courseId ?? ""}
                onChange={(e) => setCourseId(Number(e.target.value) || undefined)}
              >
                <option value="">Select class</option>
                {teacherCourses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>

              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="rounded-lg border border-border p-4 bg-secondary/30 space-y-3">
                  <Input
                    value={q.text}
                    onChange={(e) => setQuestionText(qi, e.target.value)}
                    placeholder={`Question ${qi + 1}`}
                    className="bg-secondary border-border"
                  />

                  {q.options.map((o, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" checked={o.correct} onChange={() => setCorrectOption(qi, oi)} />
                      <Input
                        value={o.text}
                        onChange={(e) => setOptionText(qi, oi, e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="bg-secondary border-border"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" onClick={addQuestion}>Add Question</Button>
              <Button className="gradient-cta text-primary-foreground" onClick={handleCreate} disabled={createQuiz.isPending}>
                {createQuiz.isPending ? "Uploading..." : "Upload Quiz"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
