-- Add completedPomodoros column to Task table
ALTER TABLE "Task" ADD COLUMN "completedPomodoros" INTEGER NOT NULL DEFAULT 0; 