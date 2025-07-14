-- Insert sample users
INSERT INTO users (email, full_name, password_hash, role, semester, college) VALUES
('admin@csehub.com', 'Admin User', '$2b$10$example_hash', 'admin', NULL, 'CSE Hub'),
('student1@example.com', 'Priya Sharma', '$2b$10$example_hash', 'student', 3, 'IIT Delhi'),
('student2@example.com', 'Rahul Kumar', '$2b$10$example_hash', 'student', 4, 'NIT Trichy'),
('teacher1@example.com', 'Dr. Sharma', '$2b$10$example_hash', 'admin', NULL, 'IIT Delhi');

-- Insert sample notes
INSERT INTO notes (title, subject, semester, description, file_url, uploaded_by, downloads) VALUES
('Data Structures and Algorithms', 'DSA', 3, 'Comprehensive notes covering arrays, linked lists, stacks, queues, trees, and graphs with examples.', '/notes/dsa-complete.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 1250),
('Object Oriented Programming in Java', 'OOP', 2, 'Complete OOP concepts including inheritance, polymorphism, encapsulation, and abstraction.', '/notes/java-oop.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 980),
('Database Management Systems', 'DBMS', 4, 'SQL queries, normalization, transactions, indexing, and database design principles.', '/notes/dbms-notes.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 1100),
('Computer Networks', 'CN', 5, 'OSI model, TCP/IP, routing protocols, network security, and wireless networks.', '/notes/computer-networks.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 850),
('Operating Systems', 'OS', 4, 'Process management, memory management, file systems, and synchronization.', '/notes/operating-systems.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 1050),
('Software Engineering', 'SE', 6, 'SDLC models, requirements engineering, design patterns, and testing methodologies.', '/notes/software-engineering.pdf', (SELECT id FROM users WHERE email = 'teacher1@example.com'), 720);

-- Insert sample quizzes
INSERT INTO quizzes (topic, subject, description, duration, difficulty, created_by) VALUES
('Data Structures', 'DSA', 'Test your knowledge of arrays, linked lists, stacks, and queues', 15, 'medium', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Object Oriented Programming', 'OOP', 'Basic OOP concepts including inheritance and polymorphism', 20, 'easy', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Database Queries', 'DBMS', 'Advanced SQL queries, joins, and database optimization', 18, 'hard', (SELECT id FROM users WHERE email = 'teacher1@example.com'));

-- Insert sample questions for the first quiz
INSERT INTO questions (quiz_id, question, options, correct_answer, explanation) VALUES
((SELECT id FROM quizzes WHERE topic = 'Data Structures'), 
 'Which data structure follows the Last In First Out (LIFO) principle?', 
 '["Queue", "Stack", "Array", "Linked List"]', 
 'Stack', 
 'A stack follows the LIFO principle where the last element added is the first one to be removed.'),

((SELECT id FROM quizzes WHERE topic = 'Data Structures'), 
 'What is the time complexity of searching in a balanced binary search tree?', 
 '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 
 'O(log n)', 
 'In a balanced BST, the height is log n, so searching takes O(log n) time.'),

((SELECT id FROM quizzes WHERE topic = 'Data Structures'), 
 'Which sorting algorithm has the best average-case time complexity?', 
 '["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"]', 
 'Quick Sort', 
 'Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.');

-- Insert sample videos
INSERT INTO videos (title, subject, description, youtube_id, duration, views, level, created_by) VALUES
('Introduction to Data Structures', 'DSA', 'Learn the fundamentals of data structures including arrays, linked lists, and their applications.', 'dQw4w9WgXcQ', '45:30', 12500, 'beginner', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Object Oriented Programming Concepts', 'OOP', 'Deep dive into OOP principles: encapsulation, inheritance, polymorphism, and abstraction.', 'dQw4w9WgXcQ', '38:15', 9800, 'intermediate', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('SQL Queries and Database Design', 'DBMS', 'Master SQL queries, joins, subqueries, and learn database design best practices.', 'dQw4w9WgXcQ', '52:20', 8900, 'intermediate', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Computer Networks Fundamentals', 'CN', 'Understanding network protocols, OSI model, and TCP/IP stack with practical examples.', 'dQw4w9WgXcQ', '41:45', 7600, 'beginner', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Operating System Concepts', 'OS', 'Process management, memory allocation, and file systems explained with examples.', 'dQw4w9WgXcQ', '48:30', 10200, 'advanced', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Software Engineering Principles', 'SE', 'SDLC methodologies, design patterns, and software testing strategies.', 'dQw4w9WgXcQ', '35:15', 6400, 'intermediate', (SELECT id FROM users WHERE email = 'teacher1@example.com'));

-- Insert sample announcements
INSERT INTO announcements (title, content, type, created_by) VALUES
('Welcome to CSE Hub!', 'We are excited to have you join our learning community. Explore notes, take quizzes, and watch video lectures to excel in your CSE journey.', 'general', (SELECT id FROM users WHERE email = 'admin@csehub.com')),
('New Quiz Added: Advanced Algorithms', 'Test your knowledge with our latest quiz on advanced algorithms including dynamic programming and graph algorithms.', 'general', (SELECT id FROM users WHERE email = 'teacher1@example.com')),
('Maintenance Notice', 'The platform will undergo scheduled maintenance on Sunday from 2 AM to 4 AM IST. Please save your progress before this time.', 'urgent', (SELECT id FROM users WHERE email = 'admin@csehub.com'));
