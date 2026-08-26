import Cookies from "./secureCookieHelper";

const getCookieData = (key) => {
  const cookieValue = Cookies.get(key);

  if (!cookieValue) return null;

  try {
    // Attempt to parse as JSON and return
    return JSON.parse(cookieValue);
  } catch (error) {
    // If parsing fails, return raw value
    return cookieValue;
  }
};

export default getCookieData;
