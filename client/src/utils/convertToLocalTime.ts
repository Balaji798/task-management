import moment from 'moment-timezone';

/**
 * Converts UTC time to local time based on the user's timezone.
 *
 * @param {string} utcTime - The UTC time string to convert.
 * @returns {string} - The formatted local time string.
 */
export const convertToLocalTime = (utcTime: string): string => {
  // Get the user's timezone
  const userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert UTC time to user's local time
  return moment(utcTime).tz(userTimezone).format('YYYY-MM-DD');
};
