export interface RepeatSchedule {
  repeatType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY' | 'MONTHLY_BY_WEEKDAY' | null;
  repeatInterval?: number;
  repeatDays?: number[]; // For weekly: days of week (0=Sunday, 1=Monday, etc.)
  repeatMonth?: number; // For annual: month (1-12)
  repeatDay?: number; // For monthly/annual: day of month (1-31)
  repeatWeekOfMonth?: number; // For monthly by weekday: which week (1-5, 5=last)
  repeatDayOfWeek?: number; // For monthly by weekday: day of week (0=Sunday, etc.)
}

export function calculateNextRepeatDate(currentDate: Date, schedule: RepeatSchedule): Date | null {
  if (!schedule.repeatType) return null;

  const nextDate = new Date(currentDate);

  switch (schedule.repeatType) {
    case 'DAILY':
      const dailyInterval = schedule.repeatInterval || 1;
      nextDate.setDate(nextDate.getDate() + dailyInterval);
      return nextDate;

    case 'WEEKLY':
      const interval = schedule.repeatInterval || 1;
      if (schedule.repeatDays && schedule.repeatDays.length > 0) {
        // For weekly repeats with specific days, we need to:
        // 1. First jump by the full interval (N weeks)
        // 2. Then find the next occurrence of any specified day
        
        // Jump by the full interval first
        const baseDate = new Date(currentDate);
        baseDate.setDate(baseDate.getDate() + (7 * interval));
        
        // Now find the next occurrence of any specified day starting from baseDate
        // Look within the target week (the week we jumped to)
        const startOfTargetWeek = new Date(baseDate);
        startOfTargetWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Go to Sunday of that week
        
        // Check each day of the target week for a match
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const checkDate = new Date(startOfTargetWeek);
          checkDate.setDate(startOfTargetWeek.getDate() + dayOffset);
          
          if (schedule.repeatDays.includes(checkDate.getDay())) {
            return checkDate;
          }
        }
        
        // If no match in the target week (shouldn't happen), fall back to the first specified day
        const firstDay = Math.min(...schedule.repeatDays);
        const fallbackDate = new Date(startOfTargetWeek);
        fallbackDate.setDate(startOfTargetWeek.getDate() + firstDay);
        return fallbackDate;
      } else {
        // Repeat on the same day of week every N weeks
        nextDate.setDate(nextDate.getDate() + (7 * interval));
      }
      return nextDate;

    case 'MONTHLY':
      const monthlyInterval = schedule.repeatInterval || 1;
      const targetDay = schedule.repeatDay || currentDate.getDate();
      nextDate.setMonth(nextDate.getMonth() + monthlyInterval);
      
      // Handle cases where the target day doesn't exist in the next month
      const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
      nextDate.setDate(Math.min(targetDay, lastDayOfMonth));
      return nextDate;

    case 'ANNUALLY':
      const targetMonth = (schedule.repeatMonth || (currentDate.getMonth() + 1)) - 1; // Convert to 0-based
      const targetDayOfMonth = schedule.repeatDay || currentDate.getDate();
      
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      nextDate.setMonth(targetMonth);
      
      // Handle Feb 29 on non-leap years
      const lastDayOfTargetMonth = new Date(nextDate.getFullYear(), targetMonth + 1, 0).getDate();
      nextDate.setDate(Math.min(targetDayOfMonth, lastDayOfTargetMonth));
      return nextDate;

    case 'MONTHLY_BY_WEEKDAY':
      if (schedule.repeatWeekOfMonth && schedule.repeatDayOfWeek !== undefined) {
        const monthlyByWeekdayInterval = schedule.repeatInterval || 1;
        const targetWeek = schedule.repeatWeekOfMonth;
        const targetDayOfWeek = schedule.repeatDayOfWeek;
        
        // Move to next month by the interval
        nextDate.setMonth(nextDate.getMonth() + monthlyByWeekdayInterval);
        nextDate.setDate(1);
        
        if (targetWeek === 5) {
          // Last occurrence of the day in the month
          const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0);
          
          // Find the last occurrence of the target day
          for (let day = lastDayOfMonth.getDate(); day >= 1; day--) {
            const testDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), day);
            if (testDate.getDay() === targetDayOfWeek) {
              nextDate.setDate(day);
              return nextDate;
            }
          }
        } else {
          // Find the Nth occurrence of the day in the month
          let occurrenceCount = 0;
          
          for (let day = 1; day <= 31; day++) {
            const testDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), day);
            
            // Check if this day exists and is the target day of week
            if (testDate.getMonth() === nextDate.getMonth() && testDate.getDay() === targetDayOfWeek) {
              occurrenceCount++;
              if (occurrenceCount === targetWeek) {
                nextDate.setDate(day);
                return nextDate;
              }
            }
          }
        }
      }
      return nextDate;

    default:
      return null;
  }
}

export function formatRepeatSchedule(schedule: RepeatSchedule): string {
  if (!schedule.repeatType) return '';

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Last'];

  switch (schedule.repeatType) {
    case 'DAILY':
      return 'Repeat daily';

    case 'WEEKLY':
      const interval = schedule.repeatInterval || 1;
      if (schedule.repeatDays && schedule.repeatDays.length > 0) {
        const days = schedule.repeatDays.map(day => dayNames[day]).join(', ');
        return interval === 1 ? `Every ${days}` : `Every ${interval} weeks on ${days}`;
      }
      return interval === 1 ? 'Repeat weekly' : `Every ${interval} weeks`;

    case 'MONTHLY':
      const day = schedule.repeatDay;
      return day ? `Monthly on day ${day}` : 'Repeat monthly';

    case 'ANNUALLY':
      const month = schedule.repeatMonth;
      const dayOfMonth = schedule.repeatDay;
      if (month && dayOfMonth) {
        return `Annually on ${monthNames[month - 1]} ${dayOfMonth}`;
      }
      return 'Repeat annually';

    case 'MONTHLY_BY_WEEKDAY':
      if (schedule.repeatWeekOfMonth && schedule.repeatDayOfWeek !== undefined) {
        const week = ordinals[schedule.repeatWeekOfMonth];
        const day = dayNames[schedule.repeatDayOfWeek];
        return `${week} ${day} of every month`;
      }
      return 'Repeat monthly by weekday';

    default:
      return '';
  }
} 