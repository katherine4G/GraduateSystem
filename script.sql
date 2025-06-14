
CREATE DATABASE IF NOT EXISTS sistema_graduados;
USE sistema_graduados;

--  Roles
CREATE TABLE Roles (
    IdRole INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100)
);

INSERT INTO Roles (IdRole, Name) VALUES
(1, 'Administrador'),
(2, 'Graduado'),
(3, 'Facilitador');

-- Carreras
CREATE TABLE Career (
    IdCarrer INT PRIMARY KEY AUTO_INCREMENT,
    Area VARCHAR(100),
    Name VARCHAR(100)
);

INSERT INTO Career (IdCarrer, Area, Name) VALUES
(1, 'Tecnología', 'Ingeniería en Sistemas'),
(2, 'Educación', 'Docencia General');

-- 👥 Usuarios (comunes para todos los roles)
CREATE TABLE Users (
    IdUser INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100),
    LastName1 VARCHAR(100),
    LastName2 VARCHAR(100),
    IdentityNumber VARCHAR(20) UNIQUE,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Address VARCHAR(255),
    Password VARCHAR(255),
    IdRole INT,
    FOREIGN KEY (IdRole) REFERENCES Roles(IdRole)
);


INSERT INTO Users (IdUser, FirstName, LastName1, LastName2, IdentityNumber, Email, Phone, Address, Password, IdRole) VALUES
(1, 'Ana', 'Ramírez', 'Mora', '10101010', 'admin@email.com', '8888-0000', 'San José', '$2b$10$OgFTWYvsioqVqhdS.Pow6uZZevjO7ammN0r0kqcgfLTa45fA9RDEm', 1),
(2, 'Luis', 'Gómez', 'Alvarado', '20223333', 'grad1@email.com', '8888-8888', 'Cartago', '$2b$10$OgFTWYvsioqVqhdS.Pow6uZZevjO7ammN0r0kqcgfLTa45fA9RDEm', 2),
(3, 'María', 'Fernández', 'Solís', '30334444', 'fac1@email.com', '8222-2222', 'Heredia', '$2b$10$OgFTWYvsioqVqhdS.Pow6uZZevjO7ammN0r0kqcgfLTa45fA9RDEm', 3);


-- 🎓 Graduados (solo los de rol 2)
CREATE TABLE Graduates (
    IdGraduate INT PRIMARY KEY,
    GraduationYear YEAR,
    IdCarrer INT,
    Category VARCHAR(50),
    WorkPhone VARCHAR(20),
    FOREIGN KEY (IdGraduate) REFERENCES Users(IdUser),
    FOREIGN KEY (IdCarrer) REFERENCES Career(IdCarrer)
);

INSERT INTO Graduates (IdGraduate, GraduationYear, IdCarrer, Category, WorkPhone) VALUES
(2, 2022, 1, 'default', '8000-2222');

-- 🎤 Facilitadores (solo los de rol 3)
CREATE TABLE Speakers (
    IdSpeaker INT PRIMARY KEY,
    Specialty VARCHAR(100),
    WorkPhone VARCHAR(20),
    FOREIGN KEY (IdSpeaker) REFERENCES Users(IdUser)
);

INSERT INTO Speakers (IdSpeaker, Specialty, WorkPhone) VALUES
(3, 'Desarrollo Web y Bases de Datos', '8777-3333');

-- Talleres
CREATE TABLE Courses (
    IdCourse INT PRIMARY KEY AUTO_INCREMENT,
    Name_course VARCHAR(100),
    Description TEXT,
    Date_course DATE,
    Time_course TIME,
    Modality VARCHAR(50),
    IdSpeaker INT,
    FOREIGN KEY (IdSpeaker) REFERENCES Speakers(IdSpeaker)
);

INSERT INTO Courses (Name_course, Description, Date_course, Time_course, Modality, IdSpeaker) VALUES
('Curso de React Básico', 'Aprende los fundamentos de React.js', '2024-07-15', '10:00:00', 'Virtual', 3);

-- Relación N:N entre Graduados y Cursos
CREATE TABLE Course_Graduate (
    IdCourse INT,
    IdGraduate INT,
	Completed   TINYINT(1) DEFAULT 0, -- marcar cuando un graduado completa un taller
    CompletedAt DATETIME NULL,
    PRIMARY KEY (IdCourse, IdGraduate),
    FOREIGN KEY (IdCourse) REFERENCES Courses(IdCourse),
    FOREIGN KEY (IdGraduate) REFERENCES Graduates(IdGraduate)
);

-- INSERT INTO Course_Graduate (IdCourse, IdGraduate) VALUES
-- (1, 2,);

-- Relación N:N entre Carreras y Cursos
CREATE TABLE Career_Course (
    IdCarrer INT,
    IdCourse INT,
    PRIMARY KEY (IdCarrer, IdCourse),
    FOREIGN KEY (IdCarrer) REFERENCES Career(IdCarrer),
    FOREIGN KEY (IdCourse) REFERENCES Courses(IdCourse)
);

INSERT INTO Career_Course (IdCarrer, IdCourse) VALUES
(1, 1);

-- 1) Crear tabla de opciones de preferencia
CREATE TABLE PreferenceOptions (
  IdOption INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO PreferenceOptions (Name) VALUES
  ('Tecnología'),
  ('Educación'),
  ('Presencial'),
  ('Virtual'),
  ('Desarrollo Web'),
  ('Bases de Datos');

-- 3) Crear tabla intermedia N:N graduados ↔ opciones
CREATE TABLE GraduatePreferences (
  IdGraduate INT NOT NULL,
  IdOption   INT NOT NULL,
  PRIMARY KEY (IdGraduate, IdOption),
  FOREIGN KEY (IdGraduate) REFERENCES Graduates(IdGraduate) ON DELETE CASCADE,
  FOREIGN KEY (IdOption)   REFERENCES PreferenceOptions(IdOption) ON DELETE CASCADE
);

INSERT INTO GraduatePreferences (IdGraduate, IdOption) VALUES
  (2, 1),  -- Luis Gómez → Tecnología
  (2, 3),  -- Luis Gómez → Presencial
  (2, 5);  -- Luis Gómez → Desarrollo Web
  
-- relaciona cursos y categorías
CREATE TABLE CourseCategories (
  IdCourse INT NOT NULL,
  IdOption INT NOT NULL,
  PRIMARY KEY (IdCourse, IdOption),
  FOREIGN KEY (IdCourse) REFERENCES Courses(IdCourse) ON DELETE CASCADE,
  FOREIGN KEY (IdOption) REFERENCES PreferenceOptions(IdOption) ON DELETE CASCADE
);

INSERT INTO CourseCategories (IdCourse, IdOption) VALUES
  (1, 1),  -- Curso 1 → Tecnología
  (1, 4);  -- Curso 1 → Virtual

-- --------------------------------------------------------------


-- 1.2 Tablas de encuestas
CREATE TABLE SurveyQuestions (
  IdQuestion    INT PRIMARY KEY AUTO_INCREMENT,
  Text          VARCHAR(255) NOT NULL,
  Category      VARCHAR(50)    NOT NULL  -- p.ej. 'satisfaccion', 'impacto'
);

CREATE TABLE SurveyResponses (
  IdResponse    INT PRIMARY KEY AUTO_INCREMENT,
  IdGraduate    INT NOT NULL,
  IdCourse      INT NOT NULL,
  IdQuestion    INT NOT NULL,
  AnswerText    TEXT  NOT NULL,
  CreatedAt     DATETIME  DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (IdGraduate) REFERENCES Graduates(IdGraduate),
  FOREIGN KEY (IdCourse)   REFERENCES Courses(IdCourse),
  FOREIGN KEY (IdQuestion) REFERENCES SurveyQuestions(IdQuestion)
);

-- 1) Insertar preguntas de encuesta
INSERT INTO SurveyQuestions (Text, Category) VALUES
  ('¿Cómo calificarías la claridad del contenido del taller?',     'satisfaccion'),
  ('¿El facilitador respondió adecuadamente tus dudas?',           'satisfaccion'),
  ('¿Recomendarías este taller a otros graduados?',               'satisfaccion'),
  ('¿En qué medida este taller ha impactado tus habilidades?',     'impacto'),
  ('¿Planeas aplicar lo aprendido en tu trabajo o estudios?',      'impacto');

-- 2) Insertar respuestas de muestra para Luis Gómez (IdGraduate=2) en el Curso 1
INSERT INTO SurveyResponses (IdGraduate, IdCourse, IdQuestion, AnswerText) VALUES
  (2, 1, 1, 'La explicación fue muy clara y estructurada'),
  (2, 1, 2, 'Sí, todas mis dudas fueron resueltas satisfactoriamente'),
  (2, 1, 3, 'Definitivamente, ya lo he recomendado a dos compañeros'),
  (2, 1, 4, 'Ha mejorado significativamente mi comprensión de React'),
  (2, 1, 5, 'Sí, ya empecé a usar hooks en mis proyectos personales');
