"use client";

import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getForgotPasswordOtpAPI,
  getVerifyForgotPasswordOtpAPI,
  postNewForgotPasswordAPI,
} from "./ForgotPasswordApis";
import { useRouter } from "next/navigation";

export const useForgotPassword = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [mail, setMail] = useState("");
  const [mailVerified, setMailVerified] = useState(false);
  const [showResendOtp, setShowResendOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  // Form validation schema
  const formSchema = yup.object({
    email: yup
      .string()
      .email()
      .test("email-required-on-page-1", "Email is required", function (value) {
        if (page === 1 && !value) {
          return this.createError({ message: "Email is required" });
        }
        return true;
      }),
    code: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable(), // Allow null values
    // .required("Code is required")
    // .test("is-number", "OTP must be a number", (value) => {
    //   // Check if value is a valid number (string type of digits)
    //   return /^[0-9]+$/.test(value); // Regex to check if it's only digits
    // })
    // .test("max-length", "OTP must not exceed 6 digits", (value) => {
    //   // Check if the length is 6 digits or less
    //   return value === null || value.length <= 6;
    // }),
    password: yup
      .string()
      .test(
        "password-required-on-page-2",
        "Password is required",
        function (value) {
          if (page === 2 && !value) {
            return this.createError({ message: "Password is required" });
          }
          return true;
        }
      ),
    confirmPassword: yup
      .string()
      .test(
        "confirm-password-validation",
        "Confirm password is required and must match password",
        function (value) {
          const { password } = this.parent;
          if (page === 2) {
            if (!value) {
              return this.createError({
                message: "Confirm password is required",
              });
            }
            if (value !== password) {
              return this.createError({ message: "Passwords must match" });
            }
          }
          return true;
        }
      ),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control } = form;
  const { code } = useWatch({ control });

  // Handle form submission
  const handleSubmit = (values) => {
    if (page === 1) {
      getForgotPasswordOtpApiCall(values.email);
    } else {
      if (mail && mailVerified) {
        postNewForgotPasswordApiCall(values);
      } else {
        toast.error("Verify email properly");
      }
    }
  };

  const handleVerifyOtp = () => {
    if (!mailVerified) {
      if (code && mail) {
        getVerifyForgotPasswordOtpApiCall(code, mail);
      } else {
        toast.error("Check OTP and Email!");
      }
    } else {
      toast.error("Your email is already verified!");
    }
  };

  const handleResendOtp = () => {
    if (mail) {
      getForgotPasswordOtpApiCall(mail);
    } else {
      toast.error("Check your entered email!");
    }
  };

  // Function to call the login API
  const getForgotPasswordOtpApiCall = async (email) => {
    setLoading(true);
    try {
      const res = await getForgotPasswordOtpAPI(email, 1);
      if (res.message === "Success") {
        setPage(2);
        setMail(email);
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

  // Function to call the login API
  const getVerifyForgotPasswordOtpApiCall = async (code, mail) => {
    setVerifyOtpLoading(true);
    try {
      const res = await getVerifyForgotPasswordOtpAPI(code, mail);

      if (res.message === "Success") {
        setMailVerified(true);
        toast.success(res.details);
      } else {
        toast.error(res.details);
        setShowResendOtp(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const postNewForgotPasswordApiCall = async (item) => {
    setLoading(true);

    const data = {
      user_mail: mail,
      user_pass: item.password,
      confirm_password: item.confirmPassword,
    };

    try {
      const res = await postNewForgotPasswordAPI(data);

      console.log(res);

      if (res.message === "Success") {
        form.reset();
        toast.success(res.details);
        router.push("/login");
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

  return {
    form,
    loading,
    verifyOtpLoading,
    handleSubmit,
    handleVerifyOtp,
    page,
    mailVerified,
    showResendOtp,
    handleResendOtp,
  };
};
