import { isWithinInterval, addDays, format } from 'date-fns';

export const isDeadline = (dateString, daysAhead = 7) => {
  if (!dateString) return false;
  const today = new Date();
  const end = addDays(today, daysAhead);
  return isWithinInterval(new Date(dateString), { start: today, end });
};

export const isAfterDeadline = (dateString) => {
  if (!dateString) return false;
  return new Date() > new Date(dateString);
};

export const dateFormat = (date) => {
    return format(date, 'dd-MM-yyyy');
}
