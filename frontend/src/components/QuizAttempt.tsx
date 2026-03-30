import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Clock, BarChart3 } from 'lucide-react';

interface Option {
  id: number;
  optionText: string;
  optionOrder: number;
  explanation?: string;
}

interface Question {
  id: number;
  questionText: string;
  options: Option[];
  correctOptionId: number;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  totalQuestions: number;
  passingScore: number;
  allowReview: boolean;
  timeLimit?: number;
  questions: Question[];
}

export const QuizAttempt: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quiz || !quiz.timeLimit) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) {
          return quiz.timeLimit! * 60;
        }
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      const data = await response.json();
      setQuiz(data);
      if (data.timeLimit) {
        setTimeLeft(data.timeLimit * 60);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionId: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion!.id, optionId);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      if (answers.get(question.id) === question.correctOptionId) {
        earnedPoints += question.points;
      }
    });

    const finalScore = Math.round((earnedPoints / totalPoints) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-4">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-center py-8">Quiz not found</div>;
  }

  if (submitted) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <BarChart3 size={48} className={`mx-auto mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`} />
          <h2 className="text-3xl font-bold mb-2">{passed ? 'Congratulations!' : 'Quiz Completed'}</h2>
          <div className="text-5xl font-bold mb-2">{score}%</div>
          <p className="text-lg text-gray-600 mb-6">
            {passed ? `You passed! (Required: ${quiz.passingScore}%)` : `You scored ${score}% (Required: ${quiz.passingScore}%)`}
          </p>

          {quiz.allowReview && (
            <div className="mt-8 text-left">
              <h3 className="font-semibold text-lg mb-4">Review Your Answers</h3>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const selectedOptionId = answers.get(question.id);
                  const isCorrect = selectedOptionId === question.correctOptionId;
                  const selectedOption = question.options.find(o => o.id === selectedOptionId);
                  const correctOption = question.options.find(o => o.id === question.correctOptionId);

                  return (
                    <div key={question.id} className="border-l-4 pl-4" style={{ borderColor: isCorrect ? '#10b981' : '#ef4444' }}>
                      <p className="font-medium mb-2">{index + 1}. {question.questionText}</p>
                      <p className="text-sm"><strong>Your answer:</strong> {selectedOption?.optionText || 'Not answered'}</p>
                      {!isCorrect && <p className="text-sm"><strong>Correct answer:</strong> {correctOption?.optionText}</p>}
                      {question.explanation && <p className="text-sm text-gray-600 mt-2"><strong>Explanation:</strong> {question.explanation}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOptionId = answers.get(currentQuestion.id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={20} />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {quiz.totalQuestions}</span>
            <span className="text-sm text-gray-600">{answers.size} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQuestion.questionText}</h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map(option => (
            <label
              key={option.id}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              style={{
                backgroundColor: selectedOptionId === option.id ? '#eff6ff' : '',
                borderColor: selectedOptionId === option.id ? '#3b82f6' : '',
              }}
            >
              <input
                type="radio"
                name="option"
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => handleSelectOption(option.id)}
                className="h-4 w-4"
              />
              <span className="ml-3">{option.optionText}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestionIndex < quiz.totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Quiz
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Progress:</strong> Questions {currentQuestionIndex + 1}-{Math.min(currentQuestionIndex + 1, quiz.totalQuestions)} of {quiz.totalQuestions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
