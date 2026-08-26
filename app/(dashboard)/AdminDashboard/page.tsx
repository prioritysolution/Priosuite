"use client";

import React, { useEffect } from "react";
import AdminDashboardContainer from "@/container/AdminDashboard";

import { useDispatch } from "react-redux";
import { CheckDayBeginStatusAPI } from "@/container/auth/login/LoginApis";
import Cookies from "@/utils/secureCookieHelper";
import { beg_date } from "@/container/auth/login/LoginReducer";

import { useRouter } from "next/navigation";

const AdminDashboardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkDayBeginStatus = async () => {
      try {
        const res = await CheckDayBeginStatusAPI(
          new Date().toISOString().split("T")[0],
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
          router.push("/AdminDashboard");
        } else {
          router.push("/beginpage");
        }
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as any).response?.status === 400
        ) {
          router.push("/beginpage");
          return;
        }
        console.error("Error checking day begin status:", err);
      }
    };

    checkDayBeginStatus();
  }, [router, dispatch]);
  return <AdminDashboardContainer />;
};

export default AdminDashboardPage;
