/**
 * Returns truncated string
 * @param string - String that needs to be truncated
 * @param number - Index upto which string needs to be truncated
 * @returns {string} Truncated String
 */
export function truncateString(str: string, num: number): string {
  if (!str) {
    return '';
  } else if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
}
