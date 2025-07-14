-- Clear all temporary data from tables
DELETE FROM quiz_attempts;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM notes;
DELETE FROM videos;
DELETE FROM announcements;

-- Reset sequences if needed
-- Note: UUID primary keys don't use sequences, so this is mainly for reference
