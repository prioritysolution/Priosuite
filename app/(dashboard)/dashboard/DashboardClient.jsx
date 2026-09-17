"use client";

import DashboardContainer from "@/container/dashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";
import { CheckDayBeginStatusAPI } from "@/container/auth/login/LoginApis";
import { useDispatch } from "react-redux";
import { beg_date } from "@/container/auth/login/LoginReducer";
import { formatDateForApi } from "@/utils/dateHelpers";

const DashboardClient = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkDayBeginStatus = async () => {
      try {
        const res = await CheckDayBeginStatusAPI(
          formatDateForApi(new Date()),
          Cookies.get("orgId"),
          Cookies.get("year_id"),
          Cookies.get("userBranchId"),
        );

        if (res.message === "Success") {
          Cookies.set("beg_id", res.data.Beg_Id);
          Cookies.set("beg_date", res.data.Last_Date);
          if (res.data.Last_Date) {
            const begDateObj = new Date(res.data.Last_Date);
            const formattedDate = begDateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            dispatch(beg_date(formattedDate));
          }
          router.push("/dashboard");
        } else {
          router.push("/beginpage");
        }
      } catch (err) {
        if (err.response?.status === 400) {
          router.push("/beginpage");
          return;
        }
        console.error("Error checking day begin status:", err);
      }
    };

    checkDayBeginStatus();
  }, [router, dispatch]);

  return <DashboardContainer />;
};

export default DashboardClient;
