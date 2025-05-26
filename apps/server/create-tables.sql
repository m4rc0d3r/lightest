CREATE TABLE user (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT    NOT NULL
                            UNIQUE,
    password        TEXT    NOT NULL,
    activation_link TEXT    NOT NULL
                            UNIQUE,
    is_activated    BOOLEAN NOT NULL
                            DEFAULT (false) 
);
CREATE TABLE session (
    id            INTEGER  PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER  NOT NULL
                           REFERENCES user (id),
    refresh_token TEXT     NOT NULL
                           UNIQUE,
    expires       DATETIME NOT NULL
);
CREATE TABLE test (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL
                      REFERENCES user (id),
    title     TEXT    NOT NULL
);
CREATE TABLE question_type (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL
                 UNIQUE
);
CREATE TABLE question (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER REFERENCES test (id) 
                    NOT NULL,
    type_id         NOT NULL
                    REFERENCES question_type (id),
    content TEXT    NOT NULL,
    worth   DOUBLE  NOT NULL
);
CREATE TABLE correct_extended_answer (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL
                        REFERENCES question (id),
    content     TEXT    NOT NULL
);
CREATE TABLE answer_option (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER REFERENCES question (id) 
                        NOT NULL,
    content     TEXT    NOT NULL,
    is_correct  BOOLEAN NOT NULL
);
CREATE TABLE passed_test (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id    INTEGER REFERENCES test (id) 
                       NOT NULL,
    passing_id INTEGER REFERENCES user (id) 
);
CREATE TABLE passed_question (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    passed_test_id INTEGER REFERENCES passed_test (id) 
                           NOT NULL,
    question_id    INTEGER NOT NULL
                           REFERENCES question (id) 
);
CREATE TABLE passed_extended_answer (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    passed_question_id INTEGER REFERENCES passed_question (id) 
                               NOT NULL,
    correct_answer_id  INTEGER REFERENCES correct_extended_answer (id) 
                               NOT NULL,
    content            TEXT    NOT NULL
);
CREATE TABLE passed_answer_option (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    passed_question_id INTEGER NOT NULL
                               REFERENCES passed_question (id),
    answer_option_id   INTEGER REFERENCES answer_option (id) 
                               NOT NULL,
    is_chosen          BOOLEAN NOT NULL
);
