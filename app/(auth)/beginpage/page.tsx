"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "@/utils/secureCookieHelper";
import toast from "react-hot-toast";
import { CheckDayBeginStatusAPI } from "@/container/auth/login/LoginApis";
import { useDispatch } from "react-redux";
import { beg_date } from "@/container/auth/login/LoginReducer";
import Link from "next/link";
import { useLogout } from "@/container/navbar/Hooks";

const BeginPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const branchName = getCookieData("userBranchName");
  const orgName = getCookieData("userOrgName");
  const orgId = getCookieData("orgId");
  const yearId = getCookieData("year_id");
  const branchId = getCookieData("userBranchId");
  const token = Cookies.get("prioBankClientToken");

  const { postLogoutApiCall } = useLogout();

  const data = new Date();
  const currentDate = data.toISOString().split("T")[0];
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleBeginSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Org/StartBusinessDays?org_id=${orgId}&year_id=${yearId}&branch_id=${branchId}&date=${currentDate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.message === "Success") {
        Cookies.set("beg_id", res.data.data.Beg_Id);
        Cookies.set("beg_date", res.data.data.Beg_Date);

        const begDateObj = new Date(res.data.data.Beg_Date);
        const formattedDate = begDateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        dispatch(beg_date(formattedDate));
        router.push("/dashboard");
      } else {
        router.push("/beginpage");
      }
    } catch (error: any) {
      if (error.response) {
        console.log("API Error:", error.response.data);
        toast.error(
          error.response.data?.details || "Failed to start business day",
        );
      } else {
        console.log("error", error);
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    const checkDayBeginStatus = async () => {
      try {
        const res = await CheckDayBeginStatusAPI(
          new Date().toISOString().split("T")[0],
          Cookies.get("orgId"),
          Cookies.get("year_id"),
          Cookies.get("userBranchId"),
        );
        console.log("CheckDayBeginStatusAPI in beginpage", res);
        if (res.message === "Success") {
          router.push("/dashboard");
        }
      } catch (err: any) {
        if (err.response?.status !== 400) {
          console.error("Error checking day begin status:", err);
        }
      }
    };
    checkDayBeginStatus();
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-secondary">
      <div className="hidden lg:flex w-full lg:w-1/2 h-[30vh] sm:h-[40vh] lg:h-screen bg-white relative items-center justify-center p-4">
        <div className="relative w-full h-full max-h-[300px] sm:max-h-[400px] lg:max-h-[768px]">
          <Image
            src="/lodingImg.png"
            fill
            priority
            className="object-contain p-2 sm:p-4 lg:p-6"
            alt="Login Image"
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-secondary p-3 sm:p-4 lg:p-5 xl:p-8 h-screen overflow-hidden">
        <div
          className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col items-center justify-center gap-3 lg:gap-4 border-2 border-primary rounded-xl p-4 sm:p-6 lg:p-6 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 2.5rem)" }}
        >
          {/* Title */}
          <div className="text-center w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-[600] mb-1 sm:mb-2 text-primary leading-tight">
              Welcome to{" "}
              <span className={cn("text-blue-500 italic font-libre font-bold")}>
                Priosuite
              </span>
            </h1>
          </div>

          {/* Date & Time */}
          <div className="w-full text-center space-y-1">
            <div className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-800 tracking-wide">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs sm:text-sm lg:text-sm text-gray-500">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Information Cards */}
          <div className="w-full space-y-2 lg:space-y-2">
            {/* Organisation Card */}
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Organisation Name
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {orgName || "N/A"}
              </p>
            </div>

            {/* Branch Card */}
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Branch Name
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {branchName || "N/A"}
              </p>
            </div>

            {/* Working Date Card */}
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Working Date
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleBeginSession}
              disabled={loading}
              style={{ backgroundColor: "#00264d" }}
              className="w-full text-sm sm:text-base lg:text-base py-2.5 sm:py-3 text-white font-semibold rounded-xl transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={22} speedMultiplier={0.7} />
              ) : (
                "Process To Day Begin"
              )}
            </button>
            <button
              onClick={postLogoutApiCall}
              disabled={loading}
              className="w-full text-sm sm:text-base lg:text-base py-2.5 sm:py-3 text-white font-semibold rounded-xl transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <footer className="absolute w-full h-[50px] bottom-0 left-0 flex items-center justify-start px-2 text-sm xl:text-white">
        <p>
          Designed and Developed by{" "}
          <Link href="#" target="_blank" className="font-[500]">
            General Computer
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default BeginPage;
