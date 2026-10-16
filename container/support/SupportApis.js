import { endPoints } from "@/utils/endPoints";

export const getSupportDomain = () => {
  if (typeof window !== "undefined" && window.location?.host) {
    return window.location.host;
  }
  return String(process.env.NEXT_PUBLIC_SUPPORT_DOMAIN || "").trim();
};

export const supportApiKey = () =>
  String(process.env.NEXT_PUBLIC_SUPPORT_API_KEY || "").trim();

const supportRequest = async ({ url, method = "GET", body, token }) => {
  const apiKey = supportApiKey();
  if (!apiKey) {
    return {
      success: false,
      status: 0,
      message: "Support is not configured",
      data: null,
      errors: null,
    };
  }

  const headers = {
    Accept: "application/json",
    "X-Api-Key": apiKey,
  };
  if (token) headers["X-Client-Token"] = token;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(url, {
      method,
      credentials: "omit",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => null);
    return {
      success: Boolean(payload?.success) && response.ok,
      status: response.status,
      message: payload?.message || "",
      data: payload?.data ?? null,
      errors: payload?.errors || null,
    };
  } catch {
    return {
      success: false,
      status: 0,
      message: "Unable to reach support",
      data: null,
      errors: null,
    };
  }
};

export const getSupportProjectAPI = () =>
  supportRequest({
    url: endPoints.supportProject(getSupportDomain()),
  });

export const raiseSupportTicketAPI = (payload) =>
  supportRequest({
    url: endPoints.supportTickets,
    method: "POST",
    body: { domain: getSupportDomain(), ...payload },
  });

export const getSupportTicketListAPI = (query, token) =>
  supportRequest({
    url: endPoints.supportTicketList(query),
    token,
  });

export const getSupportTicketAPI = (number, phone, token) =>
  supportRequest({
    url: endPoints.supportTicketDetail(number, phone),
    token,
  });

export const getSupportMessagesAPI = (number, phone, token) =>
  supportRequest({
    url: endPoints.supportTicketMessages(number, phone),
    token,
  });

export const sendSupportMessageAPI = (number, phone, token, payload) =>
  supportRequest({
    url: endPoints.supportTicketMessages(number, phone),
    method: "POST",
    token,
    body: payload,
  });

export const getSupportRealtimeAPI = (phone, token, number) => {
  const params = new URLSearchParams({ phone });
  if (number) params.set("number", number);
  return supportRequest({
    url: endPoints.supportRealtime(params.toString()),
    token,
  });
};
