import { format } from 'timeago.js';

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const formattedDate =
    newDate < oneWeekAgo
      ? newDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : format(newDate);
  return formattedDate;
};
