"use client";

import { CheckDayBeginStatusAPI } from "@/container/auth/login/LoginApis";
import LoginContainer from "../../../container/auth/login";
import getCookieData from "../../../utils/getCookieData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "../../../utils/secureCookieHelper";
import { useDispatch } from "react-redux";
import { beg_date } from "@/container/auth/login/LoginReducer";

const LoginPage = () => {
  const token = getCookieData("prioBankClientToken");
  const isMainDash = Number(getCookieData("Is_Main_Dash"));

  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, isMainDash, router]);

  return <LoginContainer />;
};

export default LoginPage;
