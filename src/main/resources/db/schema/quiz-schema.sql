-- Quiz module schema (logical reference; runtime schema is managed by JPA)

CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id BIGINT NOT NULL,
    lesson_id BIGINT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_quiz_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    text VARCHAR(2000) NOT NULL,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE answer_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    text VARCHAR(1000) NOT NULL,
    is_correct BIT NOT NULL,
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE quiz_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    current_question_index INT NOT NULL,
    total_questions INT NOT NULL,
    score INT NOT NULL,
    started_at DATETIME NOT NULL,
    submitted_at DATETIME NULL,
    CONSTRAINT fk_session_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    CONSTRAINT fk_session_student FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE student_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_student_answer_session FOREIGN KEY (session_id) REFERENCES quiz_sessions(id),
    CONSTRAINT fk_student_answer_question FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT fk_student_answer_option FOREIGN KEY (selected_option_id) REFERENCES answer_options(id)
);
