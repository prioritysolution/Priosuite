"use client";
import { useState } from "react";
import { postLogoutAPI } from "./NavbarApis";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";

export const useLogout = () => {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const postLogoutApiCall = async () => {
    setLogoutLoading(true);
    try {
      const res = await postLogoutAPI();
      if (res.message === "Success") {
        toast.success("Logged out successfully");
      } else {
        toast.error(res.message);
      }
      Cookies.remove("prioBankClientToken");
      Cookies.remove("orgId");
      Cookies.remove("userName");
      Cookies.remove("userOrgName");
      Cookies.remove("userBranchId");
      Cookies.remove("userBranchName");
      Cookies.remove("userBranchAddress");
      Cookies.remove("userOrgAddress");
      Cookies.remove("userOrgRegistration");
      Cookies.remove("userOrgLogo");
      Cookies.remove("userIsActiveDenomination");
      Cookies.remove("year_id");
      Cookies.remove("beg_id");
      Cookies.remove("beg_date");
      Cookies.remove("finId");
      Cookies.remove("is_open");
      Cookies.remove("fin_start_date");
      Cookies.remove("fin_end_date");
      Cookies.remove("is_pass_header");

      // Priosuite IMS

      Cookies.remove("priosuite_Ims_prioBankClientToken");
      Cookies.remove("priosuite_Ims_Is_Main_Dash");
      Cookies.remove("priosuite_Ims_orgId");
      Cookies.remove("priosuite_Ims_userName");
      Cookies.remove("priosuite_Ims_userOrgName");
      Cookies.remove("priosuite_Ims_userBranchId");
      Cookies.remove("priosuite_Ims_userBranchName");
      Cookies.remove("priosuite_Ims_userBranchAddress");
      Cookies.remove("priosuite_Ims_userOrgAddress");
      Cookies.remove("priosuite_Ims_userOrgRegistration");
      Cookies.remove("priosuite_Ims_userOrgLogo");
      Cookies.remove("priosuite_Ims_userIsActiveDenomination");
      Cookies.remove("priosuite_Ims_year_id");
      Cookies.remove("priosuite_Ims_is_open");
      Cookies.remove("priosuite_Ims_fin_start_date");
      Cookies.remove("priosuite_Ims_fin_end_date");
      Cookies.remove("priosuite_Ims_is_pass_header");
      Cookies.remove("priosuite_Ims_beg_id");
      Cookies.remove("priosuite_Ims_beg_date");

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLogoutLoading(false);
    }
  };
  return {
    logoutLoading,
    postLogoutApiCall,
  };
};
