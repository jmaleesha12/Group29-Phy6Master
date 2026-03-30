import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Target, Play, BookOpen, Loader2 } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

export const QuizPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quizzes/course/${courseId}/published`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId: number) => {
    // Check if user is logged in (you might want to add authentication check here)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to take quizzes');
      return;
    }

    // Navigate to quiz attempt page
    navigate(`/quizzes/${quizId}/attempt`);
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'No time limit';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Error Loading Quizzes</h2>
          <p>{error}</p>
          <button
            onClick={fetchQuizzes}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Quizzes</h1>
          <p className="text-gray-600">Test your knowledge and track your progress</p>
        </div>

        {/* Quiz Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Available</h3>
            <p className="text-gray-600">There are no published quizzes for this course yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Quiz Header */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>

                  {quiz.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {quiz.description}
                    </p>
                  )}

                  {/* Quiz Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{quiz.totalQuestions} questions</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>Passing score: {quiz.passingScore}%</span>
                    </div>

                    {quiz.timeLimit && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(quiz.timeLimit)}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {quiz.allowReview && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Review Answers
                      </span>
                    )}
                    {quiz.timeLimit && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Timed Quiz
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Play className="h-4 w-4" />
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Quiz Instructions</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Make sure you have a stable internet connection</li>
            <li>• Find a quiet place to take the quiz without distractions</li>
            <li>• Read each question carefully before selecting your answer</li>
            <li>• You can navigate between questions using the Previous/Next buttons</li>
            <li>• Your answers are saved automatically as you go</li>
            <li>• Once submitted, you cannot change your answers</li>
            {quizzes.some(q => q.timeLimit) && (
              <li>• Some quizzes have time limits - keep track of the timer</li>
            )}
            {quizzes.some(q => q.allowReview) && (
              <li>• You can review your answers after submitting (if enabled)</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
