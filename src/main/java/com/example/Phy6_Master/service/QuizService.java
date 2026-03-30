package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.AddQuestionRequest;
import com.example.Phy6_Master.dto.CreateQuizRequest;
import com.example.Phy6_Master.dto.QuizResponse;
import com.example.Phy6_Master.dto.UpdateQuestionRequest;
import com.example.Phy6_Master.dto.UpdateQuizRequest;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Lesson;
import com.example.Phy6_Master.model.Option;
import com.example.Phy6_Master.model.Question;
import com.example.Phy6_Master.model.Quiz;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.CourseRepository;
import com.example.Phy6_Master.repository.LessonRepository;
import com.example.Phy6_Master.repository.OptionRepository;
import com.example.Phy6_Master.repository.QuestionRepository;
import com.example.Phy6_Master.repository.QuizRepository;
import com.example.Phy6_Master.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new quiz with questions
     */
    public Quiz createQuiz(Long teacherId, CreateQuizRequest request) {
        // Validate teacher exists and is a teacher
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with id: " + teacherId));

        if (teacher.getRole() != User.Role.TEACHER) {
            throw new IllegalArgumentException("User is not a teacher");
        }

        // Validate course exists
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + request.getCourseId()));

        // Validate course belongs to teacher (if course has a teacher assigned)
        if (course.getTeacher() != null && !course.getTeacher().getId().equals(teacherId)) {
            throw new IllegalArgumentException("Teacher can only create quizzes for their own courses");
        }

        // Validate lesson exists if provided
        Lesson lesson = null;
        if (request.getLessonId() != null) {
            lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id: " + request.getLessonId()));

            // Validate lesson belongs to course
            if (!lesson.getCourse().getId().equals(request.getCourseId())) {
                throw new IllegalArgumentException("Lesson does not belong to the specified course");
            }
        }

        // Create quiz
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCourse(course);
        quiz.setLesson(lesson);
        quiz.setTeacher(teacher);
        quiz.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 60);
        quiz.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : false);
        quiz.setAllowReview(request.getAllowReview() != null ? request.getAllowReview() : true);
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setTotalQuestions(0);

        quiz = quizRepository.save(quiz);

        // Add questions
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (int i = 0; i < request.getQuestions().size(); i++) {
                CreateQuizRequest.QuestionRequest qReq = request.getQuestions().get(i);
                addQuestionToQuiz(quiz, qReq, i);
            }
            quiz.setTotalQuestions(request.getQuestions().size());
            quiz = quizRepository.save(quiz);
        }

        return quiz;
    }

    /**
     * Helper method to add a question to a quiz
     */
    private void addQuestionToQuiz(Quiz quiz, CreateQuizRequest.QuestionRequest qReq, int index) {
        if (qReq.getOptions() == null || qReq.getOptions().isEmpty()) {
            throw new IllegalArgumentException("Each question must have at least one option");
        }

        if (qReq.getCorrectOptionIndex() < 0 || qReq.getCorrectOptionIndex() >= qReq.getOptions().size()) {
            throw new IllegalArgumentException("Correct option index is out of range");
        }

        Question question = new Question();
        question.setQuiz(quiz);
        question.setQuestionText(qReq.getQuestionText());
        question.setQuestionOrder(qReq.getQuestionOrder() != null ? qReq.getQuestionOrder() : index);
        question.setExplanation(qReq.getExplanation());
        question.setPoints(qReq.getPoints() != null ? qReq.getPoints() : 1.0);

        question = questionRepository.save(question);

        // Add options
        Long correctOptionId = null;
        for (int i = 0; i < qReq.getOptions().size(); i++) {
            CreateQuizRequest.OptionRequest oReq = qReq.getOptions().get(i);

            Option option = new Option();
            option.setQuestion(question);
            option.setOptionText(oReq.getOptionText());
            option.setOptionOrder(oReq.getOptionOrder() != null ? oReq.getOptionOrder() : i + 1);
            option.setExplanation(oReq.getExplanation());

            option = optionRepository.save(option);

            // Track correct option
            if (i == qReq.getCorrectOptionIndex()) {
                correctOptionId = option.getId();
            }
        }

        // Update question with correct option
        question.setCorrectOptionId(correctOptionId);
        questionRepository.save(question);
    }

    /**
     * Get quiz by ID with full details
     */
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));
    }

    /**
     * Get all quizzes for a course
     */
    public List<Quiz> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourse_IdOrderByCreatedAtDesc(courseId);
    }

    /**
     * Get published quizzes for a course (visible to students)
     */
    public List<Quiz> getPublishedQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourse_IdAndIsPublishedTrue(courseId);
    }

    /**
     * Get quizzes created by a teacher
     */
    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        return quizRepository.findByTeacher_Id(teacherId);
    }

    /**
     * Update quiz details
     */
    public Quiz updateQuiz(Long quizId, Long teacherId, UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findByIdAndTeacher_Id(quizId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found or unauthorized"));

        if (request.getTitle() != null) {
            quiz.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            quiz.setDescription(request.getDescription());
        }
        if (request.getPassingScore() != null) {
            quiz.setPassingScore(request.getPassingScore());
        }
        if (request.getIsPublished() != null) {
            quiz.setIsPublished(request.getIsPublished());
        }
        if (request.getAllowReview() != null) {
            quiz.setAllowReview(request.getAllowReview());
        }
        if (request.getTimeLimit() != null) {
            quiz.setTimeLimit(request.getTimeLimit());
        }

        return quizRepository.save(quiz);
    }

    /**
     * Delete a quiz and all its questions
     */
    public void deleteQuiz(Long quizId, Long teacherId) {
        Quiz quiz = quizRepository.findByIdAndTeacher_Id(quizId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found or unauthorized"));

        quizRepository.delete(quiz);
    }

    /**
     * Add a question to an existing quiz
     */
    public Question addQuestion(Long quizId, Long teacherId, AddQuestionRequest request) {
        Quiz quiz = quizRepository.findByIdAndTeacher_Id(quizId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found or unauthorized"));

        if (request.getOptions() == null || request.getOptions().isEmpty()) {
            throw new IllegalArgumentException("Each question must have at least one option");
        }

        if (request.getCorrectOptionIndex() < 0 || request.getCorrectOptionIndex() >= request.getOptions().size()) {
            throw new IllegalArgumentException("Correct option index is out of range");
        }

        Question question = new Question();
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setQuestionOrder(request.getQuestionOrder() != null ? request.getQuestionOrder() : quiz.getTotalQuestions());
        question.setExplanation(request.getExplanation());
        question.setPoints(request.getPoints() != null ? request.getPoints() : 1.0);

        question = questionRepository.save(question);

        // Add options
        Long correctOptionId = null;
        for (int i = 0; i < request.getOptions().size(); i++) {
            AddQuestionRequest.AddOptionRequest oReq = request.getOptions().get(i);

            Option option = new Option();
            option.setQuestion(question);
            option.setOptionText(oReq.getOptionText());
            option.setOptionOrder(oReq.getOptionOrder() != null ? oReq.getOptionOrder() : i + 1);
            option.setExplanation(oReq.getExplanation());

            option = optionRepository.save(option);

            if (i == request.getCorrectOptionIndex()) {
                correctOptionId = option.getId();
            }
        }

        // Update question with correct option
        question.setCorrectOptionId(correctOptionId);
        question = questionRepository.save(question);

        // Update total questions count
        quiz.setTotalQuestions(quiz.getTotalQuestions() + 1);
        quizRepository.save(quiz);

        return question;
    }

    /**
     * Get a specific question by ID
     */
    public Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));
    }

    /**
     * Update a specific question
     */
    public Question updateQuestion(Long quizId, Long questionId, Long teacherId, UpdateQuestionRequest request) {
        // Verify authorization
        Quiz quiz = quizRepository.findByIdAndTeacher_Id(quizId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found or unauthorized"));

        Question question = questionRepository.findByIdAndQuiz_Id(questionId, quizId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found in the specified quiz"));

        // Validate options
        if (request.getOptions() == null || request.getOptions().isEmpty()) {
            throw new IllegalArgumentException("Each question must have at least one option");
        }

        // Update question text
        question.setQuestionText(request.getQuestionText());

        if (request.getQuestionOrder() != null) {
            question.setQuestionOrder(request.getQuestionOrder());
        }

        if (request.getExplanation() != null) {
            question.setExplanation(request.getExplanation());
        }

        if (request.getPoints() != null) {
            question.setPoints(request.getPoints());
        }

        // Handle options: delete old ones and create new ones
        question.getOptions().clear();

        for (int i = 0; i < request.getOptions().size(); i++) {
            UpdateQuestionRequest.UpdateOptionRequest oReq = request.getOptions().get(i);

            Option option = new Option();
            option.setQuestion(question);
            option.setOptionText(oReq.getOptionText());
            option.setOptionOrder(oReq.getOptionOrder() != null ? oReq.getOptionOrder() : i + 1);
            option.setExplanation(oReq.getExplanation());

            optionRepository.save(option);
            question.getOptions().add(option);
        }

        // Update correct option
        Long correctOptionId = request.getCorrectOptionId();
        boolean isValidOption = question.getOptions().stream()
                .anyMatch(opt -> opt.getId().equals(correctOptionId));

        if (!isValidOption) {
            throw new IllegalArgumentException("Correct option ID does not belong to this question");
        }

        question.setCorrectOptionId(correctOptionId);

        return questionRepository.save(question);
    }

    /**
     * Delete a specific question
     */
    public void deleteQuestion(Long quizId, Long questionId, Long teacherId) {
        // Verify authorization
        Quiz quiz = quizRepository.findByIdAndTeacher_Id(quizId, teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found or unauthorized"));

        Question question = questionRepository.findByIdAndQuiz_Id(questionId, quizId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found in the specified quiz"));

        questionRepository.delete(question);

        // Update total questions count
        quiz.setTotalQuestions(quiz.getTotalQuestions() - 1);
        quizRepository.save(quiz);
    }

    /**
     * Convert Quiz entity to QuizResponse DTO
     */
    public QuizResponse convertToResponse(Quiz quiz) {
        QuizResponse response = new QuizResponse();
        response.setId(quiz.getId());
        response.setTitle(quiz.getTitle());
        response.setDescription(quiz.getDescription());
        response.setCourseId(quiz.getCourseId());
        response.setLessonId(quiz.getLessonId());
        response.setTeacherId(quiz.getTeacherId());
        response.setTotalQuestions(quiz.getTotalQuestions());
        response.setPassingScore(quiz.getPassingScore());
        response.setIsPublished(quiz.getIsPublished());
        response.setAllowReview(quiz.getAllowReview());
        response.setTimeLimit(quiz.getTimeLimit());
        response.setCreatedAt(quiz.getCreatedAt());
        response.setUpdatedAt(quiz.getUpdatedAt());

        // Convert questions
        List<QuizResponse.QuestionResponse> questionResponses = quiz.getQuestions().stream()
                .map(this::convertQuestionToResponse)
                .collect(Collectors.toList());
        response.setQuestions(questionResponses);

        return response;
    }

    private QuizResponse.QuestionResponse convertQuestionToResponse(Question question) {
        QuizResponse.QuestionResponse qResponse = new QuizResponse.QuestionResponse();
        qResponse.setId(question.getId());
        qResponse.setQuestionText(question.getQuestionText());
        qResponse.setQuestionOrder(question.getQuestionOrder());
        qResponse.setQuizId(question.getQuizId());
        qResponse.setCorrectOptionId(question.getCorrectOptionId());
        qResponse.setExplanation(question.getExplanation());
        qResponse.setPoints(question.getPoints());

        // Convert options
        List<QuizResponse.QuestionResponse.OptionResponse> optionResponses = question.getOptions().stream()
                .map(this::convertOptionToResponse)
                .collect(Collectors.toList());
        qResponse.setOptions(optionResponses);

        return qResponse;
    }

    private QuizResponse.QuestionResponse.OptionResponse convertOptionToResponse(Option option) {
        QuizResponse.QuestionResponse.OptionResponse oResponse = new QuizResponse.QuestionResponse.OptionResponse();
        oResponse.setId(option.getId());
        oResponse.setOptionText(option.getOptionText());
        oResponse.setOptionOrder(option.getOptionOrder());
        oResponse.setQuestionId(option.getQuestionId());
        oResponse.setExplanation(option.getExplanation());

        return oResponse;
    }
}
