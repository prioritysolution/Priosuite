"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  CheckDayBeginStatusAPI,
  getCheckFinYearAPI,
  postTerminateActiveSessionAPI,
  userLoginAPI,
} from "./LoginApis"; // API call for logging in
import { getForgotPasswordOtpAPI } from "../forgotPassword/ForgotPasswordApis";
import Cookies from "@/utils/secureCookieHelper";
import { token, beg_date } from "./LoginReducer";
import { formatDateForApi } from "@/utils/dateHelpers";
import { clearStoredUserDashboard } from "@/utils/userDashboardStorage";
import { getStoredLanguage, setAppLanguage } from "@/i18n";
import { getDeviceId, getOsName } from "@/utils/deviceId";

const SUPPORTED_LANGS = ["en", "bn", "hi", "or"];

const FIN_COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: "Strict",
  path: "/",
};

const findLoginFinYear = (details, yearId) => {
  const list = Array.isArray(details) ? details : [];
  if (!list.length) return null;
  if (yearId == null || yearId === "") return list[0];
  return list.find((year) => String(year.Id) === String(yearId)) || list[0];
};

/** Update fin year cookies only when GetLoginFinYear dates differ from cookies. */
export const syncFinYearCookiesIfMismatch = (finYear) => {
  if (!finYear) return false;

  const apiStart = formatDateForApi(finYear.StartDate);
  const apiEnd = formatDateForApi(finYear.End_Date);
  const cookieStart = formatDateForApi(Cookies.get("fin_start_date"));
  const cookieEnd = formatDateForApi(Cookies.get("fin_end_date"));
  let updated = false;

  if (apiStart && apiStart !== cookieStart) {
    Cookies.set("fin_start_date", apiStart, FIN_COOKIE_OPTIONS);
    updated = true;
  }
  if (apiEnd && apiEnd !== cookieEnd) {
    Cookies.set("fin_end_date", apiEnd, FIN_COOKIE_OPTIONS);
    updated = true;
  }

  return updated;
};

export const useLogin = () => {
  const [os, setOS] = useState("Unknown");
  const [IP, setIP] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [afterLoginLoading, setAfterLoaginLoading] = useState(false);
  const [terminateSessionLoading, setTerminateSessionLoading] = useState(false);

  const [mail, setMail] = useState("");
  const [showActiveSessionDialog, setShowActiveSessionDialog] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [financialYear, setFinancialYear] = useState([]);

  // Form validation schema
  const formSchema = yup.object({
    language: yup.string().required("Language is required"),
    email: yup
      .string()
      .trim()
      .required("Email or username is required")
      .test(
        "email-or-username",
        "Enter a valid email or username",
        (value) => {
          if (!value) return false;
          if (value.includes("@")) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          return value.length >= 2;
        },
      ),
    password: yup.string().required("Password is required"),
    year_id: yup.string().required("Financial year is required"),
  });

  const otpFormSchema = yup.object({
    otp: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values
      .required("Code is required") // Required validation
      .test("is-number", "OTP must be a number", (value) => {
        // Check if value is a valid number (string type of digits)
        return /^[0-9]+$/.test(value); // Regex to check if it's only digits
      })
      .test("max-length", "OTP must not exceed 6 digits", (value) => {
        // Check if the length is 6 digits or less
        return value === null || value.length <= 6;
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const loginForm = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      language: "en",
      email: "",
      password: "",
      year_id: "",
    },
  });

  const selectedLanguage = loginForm.watch("language");

  useEffect(() => {
    const initial = getStoredLanguage();
    if (initial && initial !== loginForm.getValues("language")) {
      loginForm.setValue("language", initial, { shouldDirty: false });
    }
    setAppLanguage(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => {
    if (!selectedLanguage) return;
    const next =
      selectedLanguage === "ur"
        ? "or"
        : SUPPORTED_LANGS.includes(selectedLanguage)
          ? selectedLanguage
          : "en";
    if (next !== selectedLanguage) {
      loginForm.setValue("language", next, { shouldDirty: false });
      return;
    }
    setAppLanguage(next);
  }, [selectedLanguage, loginForm]);

  const otpForm = useForm({
    resolver: yupResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const getOS = () => getOsName();

  // Handle form submission
  const handleLoginSubmit = (values) => {
    const { language, ...rest } = values;
    const resolvedDeviceId = deviceId || getDeviceId();
    let data = {
      ...rest,
      user_device: os,
      user_ip: IP,
      user_device_id: resolvedDeviceId,
    };

    console.log("handel val=", values);

    if (language) {
      setAppLanguage(language === "ur" ? "or" : language);
    }

    userLoginApiCall(data);
    setMail(values.email);
  };

  const handleShowOtpForm = () => {
    setShowOtpForm(true);
    getTerminateActiveSessionOtpApiCall(mail);
  };

  const handleOtpFormSubmit = (values) => {
    postTerminateActiveSessionApiCall(values);
  };

  const handleResendOtp = () => {
    if (mail) {
      getTerminateActiveSessionOtpApiCall(mail);
    } else {
      toast.error("Check your entered email!");
    }
  };

  // Function to call the login API
  const userLoginApiCall = async (item) => {
    setLoading(true);
    try {
      console.log("item in login api call=", item);

      const res = await userLoginAPI(item);
      console.log("res in login api call=", res);
      if (res.message === "Login Successful") {
        // Keep selected language — reset() would otherwise force "en" via watch
        const selectedLang = loginForm.getValues("language") || "en";
        loginForm.reset({
          language: selectedLang,
          email: "",
          password: "",
          year_id: "",
        });
        setAppLanguage(selectedLang === "ur" ? "or" : selectedLang);
        setAfterLoaginLoading(true);
        toast.success("Logged In Successfully");
        clearStoredUserDashboard();

        // Todo : set cookies
        Cookies.set("prioBankClientToken", res.token, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        // // Dispatch token to Redux store
        // dispatch(token(res.token));

        Cookies.set("Is_Main_Dash", res.Is_Main_Dash, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        Cookies.set("orgId", res.org_id, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userName", res.User_Name, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userOrgName", res.org_name, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userBranchId", res.branch_id, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userBranchName", res.branch_name, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userBranchAddress", res.branch_add, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userOrgAddress", res.org_add, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userOrgRegistration", res.org_reg, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userOrgLogo", res.Logo, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("userIsActiveDenomination", res.Is_Denom, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("year_id", item.year_id, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("is_open", res?.is_open, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("fin_start_date", res?.fin_start_date, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
        Cookies.set("fin_end_date", res?.fin_end_date, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        let selectedFinYear = findLoginFinYear(financialYear, item.year_id);
        if (!selectedFinYear) {
          try {
            const fyRes = await getCheckFinYearAPI();
            if (fyRes?.message === "Data Found" || Array.isArray(fyRes?.details)) {
              selectedFinYear = findLoginFinYear(fyRes.details, item.year_id);
            }
          } catch (fyErr) {
            console.error(fyErr);
          }
        }
        syncFinYearCookiesIfMismatch(selectedFinYear);
        Cookies.set("is_pass_header", res?.is_pass_header, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });

        let checkDayBeginStatusRes;
        try {
          checkDayBeginStatusRes = await CheckDayBeginStatusAPI(
            formatDateForApi(new Date()),
            Cookies.get("orgId"),
            Cookies.get("year_id"),
            Cookies.get("userBranchId"),
          );

          if (checkDayBeginStatusRes?.message === "Success") {
            if (checkDayBeginStatusRes.data?.Last_Date) {
              Cookies.set("beg_id", checkDayBeginStatusRes.data.Beg_Id);
              Cookies.set("beg_date", checkDayBeginStatusRes.data.Last_Date);
              const begDateObj = new Date(
                checkDayBeginStatusRes.data.Last_Date,
              );
              const formattedDate = begDateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              dispatch(beg_date(formattedDate));
            }

            // if (res.Is_Main_Dash === 1) {
            //   router.replace("/AdminDashboard");
            // } else {
            // }
            router.replace("/dashboard");
          } else if (checkDayBeginStatusRes?.message === "Error") {
            if (checkDayBeginStatusRes.data) {
              Cookies.set("beg_id", checkDayBeginStatusRes.data.Beg_Id);
              Cookies.set("beg_date", checkDayBeginStatusRes.data.Last_Date);

              // Format the date before dispatching to Redux
              const begDateObj = new Date(
                checkDayBeginStatusRes.data.Last_Date,
              );
              const formattedDate = begDateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              // Dispatch beg_date to Redux store
              dispatch(beg_date(formattedDate));
            }

            router.replace("/beginpage");
          } else {
            setAfterLoaginLoading(false);
          }
        } catch (err) {
          setAfterLoaginLoading(false);
          throw err;
        }
      } else {
        toast.error(res.details);
        setAfterLoaginLoading(false);
        if (res.details === "User Already Have A Active Session !!") {
          setShowOtpForm(false);
          setShowResendOtp(false);
          setShowActiveSessionDialog(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setAfterLoaginLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getTerminateActiveSessionOtpApiCall = async (email) => {
    setLoading(true);
    try {
      const res = await getForgotPasswordOtpAPI(email, 2);
      if (res.message === "Success") {
        toast.success(res.details);
      } else {
        toast.error(res.details);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const postTerminateActiveSessionApiCall = async (item) => {
    setTerminateSessionLoading(true);

    const data = {
      user_mail: mail,
      user_otp: item.otp,
    };

    try {
      const res = await postTerminateActiveSessionAPI(data);
      if (res.message === "Success") {
        otpForm.reset();
        setShowActiveSessionDialog(false);
        toast.success(res.details);
      } else {
        toast.error(res.details);
        setShowResendOtp(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setTerminateSessionLoading(false);
    }
  };

  useEffect(() => {
    setOS(getOS());
    setDeviceId(getDeviceId());
    fetch("https://api-bdc.net/data/client-ip")
      .then((response) => response.json())
      .then((data) => setIP(data.ipString))
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  useEffect(() => {
    console.log("deviceId=", deviceId);
  }, [deviceId]);

  useEffect(() => {
    const fetchFinancialYear = async () => {
      try {
        const res = await getCheckFinYearAPI();
        const list = res.details || [];
        setFinancialYear(list);
        const currentYear = loginForm.getValues("year_id");
        if (list.length && !currentYear) {
          loginForm.setValue("year_id", String(list[0].Id), {
            shouldValidate: true,
          });
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch financial year");
      }
    };
    fetchFinancialYear();
  }, [loginForm]);

  return {
    loginForm,
    loading,
    afterLoginLoading,
    terminateSessionLoading,
    handleLoginSubmit,
    financialYear,
    showActiveSessionDialog,
    setShowActiveSessionDialog,
    showOtpForm,
    handleShowOtpForm,
    otpForm,
    handleOtpFormSubmit,
    showResendOtp,
    handleResendOtp,
  };
};
