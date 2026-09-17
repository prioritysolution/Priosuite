import {
  formatDateForDisplay,
  parseLocalDate,
} from "@/utils/dateHelpers";

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }
    const display = formatDateForDisplay(dateString);
    return display || String(dateString);
  } catch (error) {
    return dateString;
  }
};

export { formatDateForDisplay, parseLocalDate };
export { formatDateForApi, normalizeLocalNoon } from "@/utils/dateHelpers";
