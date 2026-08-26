"use client";
import toast from "react-hot-toast";
import { getFinancialYearAPI } from "./FooterApis";
import { getFooterData } from "./FooterReducer";
import { useDispatch } from "react-redux";
import Cookies from "@/utils/secureCookieHelper";
import { getCheckFinYearAPI } from "../auth/login/LoginApis";
import getCookieData from "@/utils/getCookieData";

export const useFooter = () => {
  const dispatch = useDispatch();

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

  const getCheckFinYearApiCall = async (orgId, finId, branchId) => {
    const data = {
      org_id: orgId,
      year_id: finId,
      branch_id: branchId,
    };

    try {
      await getCheckFinYearAPI(data);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return {
    getFinancialYearApiCall,
  };
};
