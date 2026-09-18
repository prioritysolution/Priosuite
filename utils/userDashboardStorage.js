const STORAGE_KEY = "prioBankUserDashboard";

const canUseStorage = () => typeof window !== "undefined";

export const getStoredUserDashboard = (orgId, userName) => {
  if (!canUseStorage() || orgId == null || orgId === "") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const isSameUser =
      String(parsed?.orgId) === String(orgId) &&
      String(parsed?.userName ?? "") === String(userName ?? "");

    if (!isSameUser || !Array.isArray(parsed?.data) || !parsed.data.length) {
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setStoredUserDashboard = (orgId, userName, data) => {
  if (!canUseStorage() || !Array.isArray(data) || !data.length) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        orgId,
        userName: userName ?? "",
        data,
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

export const clearStoredUserDashboard = () => {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
};
