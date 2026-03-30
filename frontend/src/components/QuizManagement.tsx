import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';

interface Option {
  id?: number;
  optionText: string;
  optionOrder?: number;
  explanation?: string;
}

interface Question {
  id?: number;
  questionText: string;
  options: Option[];
  correctOptionIndex?: number;
  correctOptionId?: number;
  explanation?: string;
  points?: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  lessonId?: number;
  teacherId: number;
  totalQuestions: number;
  passingScore: number;
  isPublished: boolean;
  allowReview: boolean;
  timeLimit?: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export const QuizManagement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quizzes/course/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: number, teacherId: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}?teacherId=${teacherId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete quiz');
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete quiz');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <button
          onClick={() => { setShowForm(true); setSelectedQuiz(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> New Quiz
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {showForm ? (
        <QuizForm
          courseId={parseInt(courseId || '0')}
          quiz={selectedQuiz}
          onSave={() => { setShowForm(false); fetchQuizzes(); }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="grid gap-4">
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No quizzes yet</p>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{quiz.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span>{quiz.totalQuestions} questions</span>
                      <span>Passing: {quiz.passingScore}%</span>
                      {quiz.timeLimit && <span>Time: {quiz.timeLimit} min</span>}
                      <span className="flex items-center gap-1">
                        {quiz.isPublished ? (
                          <><CheckCircle size={16} className="text-green-600" /> Published</>
                        ) : (
                          <span className="text-yellow-600">Draft</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedQuiz(quiz); setShowForm(true); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.teacherId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface QuizFormProps {
  courseId: number;
  quiz?: Quiz | null;
  onSave: () => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ courseId, quiz, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    passingScore: quiz?.passingScore || 60,
    timeLimit: quiz?.timeLimit || null,
    isPublished: quiz?.isPublished || false,
  });

  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [
          { optionText: '', optionOrder: 1 },
          { optionText: '', optionOrder: 2 },
          { optionText: '', optionOrder: 3 },
          { optionText: '', optionOrder: 4 },
        ],
        correctOptionIndex: 0,
        explanation: '',
        points: 1,
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, field: string, value: string) => {
    const newQuestions = [...questions];
    (newQuestions[qIndex].options[oIndex] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (quiz) {
        // Update existing quiz
        response = await fetch(`/api/quizzes/${quiz.id}?teacherId=${quiz.teacherId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new quiz
        const teacherId = localStorage.getItem('userId');
        response = await fetch(`/api/quizzes?teacherId=${teacherId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            courseId,
            questions: questions.map(q => ({
              ...q,
              quizId: undefined,
              id: undefined,
            })),
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save quiz');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">{quiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              min="1"
              value={formData.timeLimit || ''}
              onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
            Publish quiz (visible to students)
          </label>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Questions</h3>

      <div className="space-y-6 mb-6 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-3">
              <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1} *</label>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <textarea
              required
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 mb-3"
              placeholder="Enter question text"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Options</p>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={question.correctOptionIndex === oIndex}
                    onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                    className="h-4 w-4"
                  />
                  <input
                    type="text"
                    required
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddQuestion}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <Plus size={20} /> Add Question
      </button>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || questions.length === 0}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : quiz ? 'Update Quiz' : 'Create Quiz'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuizManagement;
