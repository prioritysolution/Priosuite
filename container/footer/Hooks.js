"use client";
import toast from "react-hot-toast";
import { getFinancialYearAPI } from "./FooterApis";
import { getFooterData } from "./FooterReducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Cookies from "@/utils/secureCookieHelper";
import { getCheckFinYearAPI } from "../auth/login/LoginApis";
import { syncFinYearCookiesIfMismatch } from "../auth/login/Hooks";
import getCookieData from "@/utils/getCookieData";

export const useFooter = () => {
  const dispatch = useDispatch();
  const [finYearCookieVersion, setFinYearCookieVersion] = useState(0);

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const getFinancialYearApiCall = async (orgId) => {
    try {
      const res = await getFinancialYearAPI(orgId);
      if (res && Array.isArray(res.details) && res.details.length > 0) {
        const fin = res.details[0];

        dispatch(getFooterData(fin));

        getCheckFinYearApiCall(orgId, fin.Id, branchId);

        Cookies.set("finId", fin.Id, {
          expires: 7, // 7 day expiration
          secure: true, // Secure cookies
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/",
        });
      } else {
        console.warn(
          "getFinancialYearApiCall: no financial year data found",
          res,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const getCheckFinYearApiCall = async (_orgId, finId, _branchId) => {
    try {
      const res = await getCheckFinYearAPI();
      if (res?.message === "Data Found" || Array.isArray(res?.details)) {
        const yearId = getCookieData("year_id") || finId;
        const list = Array.isArray(res.details) ? res.details : [];
        const selectedYear =
          list.find((year) => String(year.Id) === String(yearId)) || list[0];
        const didUpdate = syncFinYearCookiesIfMismatch(selectedYear);
        if (didUpdate) {
          setFinYearCookieVersion((version) => version + 1);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return {
    getFinancialYearApiCall,
    finYearCookieVersion,
  };
};
