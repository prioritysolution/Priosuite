import axios from "axios";
import Cookies from "./secureCookieHelper";
import getCookieData from "./getCookieData";
import toast from "react-hot-toast";

const makeApiCall = async (method, data, content = "application/json") => {
  try {
    let token = null;
    if (typeof window !== "undefined") {
      token = getCookieData("prioBankClientToken");
    }

    const headers = {
      "Content-Type": content,
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    let body;

    body =
      content === "multipart/form-data"
        ? data.bodyData
        : JSON.stringify(data.bodyData);

    let response;

    switch (method) {
      case "GET":
        response = await axios.get(data?.url, { headers });
        break;
      case "POST":
        response = await axios.post(data?.url, body, { headers });
        break;
      case "PUT":
        response = await axios.put(data?.url, body, { headers });
        break;
      case "DELETE":
        response = await axios.delete(data?.url, { headers });
        break;
    }

    console.log("response", response);

    if (response?.token) {
      Cookies.set("prioBankClientToken", response?.token, {
        expires: 7, // 7 day expiration
        secure: true, // Secure cookies
        sameSite: "Strict", // Prevent CSRF attacks
        path: "/",
      });
    }

    // Validate response data exists
    if (!response.data) {
      console.warn("API response missing data field:", response);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: data?.url,
      method: method,
    });

    if (error.response?.status === 401) {
      Cookies.remove("prioBankClientToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Redirect to login page
      }
    }
    throw error;
  }
};

export const doGetApiCall = (data) => makeApiCall("GET", data);
export const doPostApiCall = (data, content) =>
  makeApiCall("POST", data, content);
export const doDeleteApiCall = (data) => makeApiCall("DELETE", data);
export const doPutApiCall = (data) => makeApiCall("PUT", data);
