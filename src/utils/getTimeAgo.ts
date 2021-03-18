// --- Main function
export default function timeSince(dateParam: any) {
  if (!dateParam) {
    return null;
  }

  // Setup of different variables
  const date =
    typeof dateParam === 'object' ? dateParam : new Date(dateParam * 1000);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  let today: any = new Date();

  today = new Date(today.toLocaleString('en-US', { timeZone: 'UTC' }));

  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return 'jetzt';
  } else if (seconds < 60) {
    return `${seconds} s`;
  } 
  // else if (seconds < 90) {
  //   return 'about a minute';
  // } 
  else if (minutes < 60) {
    return `${minutes} min`;
  } else if (hours < 24) {
    return `${hours} h`;
  } else if (days < 8) {
    return `${days} d`;
  }
  //   else if (isToday) {
  //     return getFormattedDate(date, 'Today'); // Today at 10:20
  //   }
  //   else if (isYesterday) {
  //     return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  //   }
  else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getFormattedDate(
  date: any,
  prefomattedDate: 'Today' | 'Yesterday' | false = false,
  hideYear = false
) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];

  var monthShort = month.substring(0,3);

  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${prefomattedDate} at ${hours}:${minutes}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${day} ${monthShort}`;
  }

  // 10. January 2017. at 10:20
  //   return `${day} ${month} ${year}. at ${hours}:${minutes}`;
  // 10. January 2017
  return `${day} ${monthShort} ${year}`;
}
