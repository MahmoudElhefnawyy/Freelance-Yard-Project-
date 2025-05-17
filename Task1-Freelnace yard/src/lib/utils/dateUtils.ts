import { addDays, addMonths, format, isAfter, isBefore, isToday, isWeekend } from "date-fns";

export interface DateRange {
  start: Date;
  end: Date;
}

// Get date range based on filter
export const getDateRangeFromFilter = (filter: string): DateRange | null => {
  const today = new Date();
  
  switch (filter) {
    case 'today':
      return {
        start: today,
        end: today
      };
      
    case 'weekend':
      // Find the next weekend
      let weekendStart = today;
      
      // If today is not already a weekend, find the next weekend
      if (!isWeekend(today)) {
        // Calculate days until Saturday (6 - current day of week)
        const daysUntilWeekend = (6 - today.getDay()) % 7;
        weekendStart = addDays(today, daysUntilWeekend);
      }
      
      // Weekend ends on Sunday
      const weekendEnd = addDays(weekendStart, isWeekend(today) && today.getDay() === 0 ? 0 : 1);
      
      return {
        start: weekendStart,
        end: weekendEnd
      };
      
    case 'week':
      return {
        start: today,
        end: addDays(today, 7)
      };
      
    case 'month':
      return {
        start: today,
        end: addMonths(today, 1)
      };
      
    default:
      return null;
  }
};

// Check if an event date is within a date range
export const isEventInDateRange = (eventDate: Date, range: DateRange): boolean => {
  if (isToday(eventDate)) {
    return true;
  }
  
  return isAfter(eventDate, range.start) && isBefore(eventDate, range.end);
};

// Format a date range for display
export const formatDateRange = (startDate: Date, endDate: Date | null): string => {
  if (!endDate) {
    return format(startDate, "MMMM d, yyyy");
  }
  
  // Same day
  if (
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return format(startDate, "MMMM d, yyyy");
  }
  
  // Same month and year
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${format(startDate, "MMMM d")}-${format(endDate, "d, yyyy")}`;
  }
  
  // Different months
  return `${format(startDate, "MMMM d")}-${format(endDate, "MMMM d, yyyy")}`;
};
