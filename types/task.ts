export type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
export type RepeatType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY' | 'MONTHLY_BY_WEEKDAY'

export interface RepeatSchedule {
  repeatType: RepeatType | null;
  repeatInterval?: number;
  repeatDays?: number[]; // For weekly: days of week (0=Sunday, 1=Monday, etc.)
  repeatMonth?: number; // For annual: month (1-12)
  repeatDay?: number; // For monthly/annual: day of month (1-31)
  repeatWeekOfMonth?: number; // For monthly by weekday: which week (1-5, 5=last)
  repeatDayOfWeek?: number; // For monthly by weekday: day of week (0=Sunday, etc.)
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  estimatedPomodoros: number | null;
  completedPomodoros: number;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  position: number | null;
  
  // Repeat schedule fields
  repeatType: RepeatType | null;
  repeatInterval: number | null;
  repeatDays: string | null; // JSON string
  repeatMonth: number | null;
  repeatDay: number | null;
  repeatWeekOfMonth: number | null;
  repeatDayOfWeek: number | null;
  isTemplate: boolean;
  templateTaskId: string | null;
  
  // Optional sessions field for detailed views
  sessions?: Array<{
    id: string;
    userId: string;
    taskId: string | null;
    type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes: string | null;
  }>;
}

export interface TaskWithRepeatSchedule extends Omit<Task, 'repeatDays'> {
  repeatSchedule?: RepeatSchedule;
} 