export const pickApiMessage = (details, fallback = "") => {
  if (typeof details === "string" && details.trim()) return details.trim();
  if (Array.isArray(details) && details.length > 0) {
    const first = details[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    return first?.Message || first?.message || fallback;
  }
  if (details && typeof details === "object") {
    return details.Message || details.message || fallback;
  }
  return fallback;
};

export const isApiSuccess = (res) => res?.message === "Success";

export const approvalErrorText = (source, fallback = "Process Failed") => {
  const data = source?.response?.data ?? source ?? {};
  const fromDetails = pickApiMessage(data.details, "");
  if (fromDetails) return fromDetails;
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (message && message !== "Error" && message !== "Success") return message;
  return fallback;
};
