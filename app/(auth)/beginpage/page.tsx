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
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Clock,
  Landmark,
  Building2,
  Calendar,
  Play,
  LogOut,
  ShieldCheck,
  Lock,
} from "lucide-react";

const BeginPage = () => {
  const { t } = useTranslation();
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
          error.response.data?.details || t("auth.failedToStartBusinessDay"),
        );
      } else {
        console.log("error", error);
        toast.error(t("auth.anErrorOccurred"));
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
    <div className="relative h-full min-h-dvh w-full overflow-hidden bg-[#e9f4fc]">
      {/* Background Graphic: /loginbg.png for desktop (lg+), /bgimage.png for mobile & tablet (<lg) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Mobile & Tablet Background */}
        <div className="relative h-full w-full lg:hidden">
          <Image
            src="/bgimage.png"
            alt=""
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="select-none object-cover object-center"
          />
        </div>

        {/* Desktop Background */}
        <div className="relative hidden h-full w-full lg:block">
          <Image
            src="/loginbg.png"
            alt=""
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="select-none object-cover object-left"
          />
        </div>

        {/* Soft overlay on mobile screens so text/form inputs remain crisp */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] lg:hidden" />
      </div>

      <div className="relative z-10 flex h-full min-h-dvh w-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left Side: Left graphics & branding already part of loginbg.png */}
        <div className="hidden flex-1 lg:block" />

        {/* Right Content Section: Welcome / Begin Day Card */}
        <section className="flex w-full flex-1 items-center justify-center p-4 sm:p-6 lg:max-w-[620px] lg:flex-initial lg:justify-center lg:p-8 xl:max-w-[680px] xl:p-12">
          <div
            className="flex w-full max-w-[500px] flex-col rounded-3xl border border-white/90 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(13,95,191,0.18)] backdrop-blur-xl transition-all sm:max-w-[540px] sm:p-8 xl:max-w-[560px] xl:p-9"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            {/* Header: Welcome & Subtitle */}
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#163A5F] sm:text-3xl">
                {t("auth.welcomeTo")}{" "}
                <span className="bg-gradient-to-r from-[#1B74D6] to-[#0D5FBF] bg-clip-text text-transparent">
                  PrioSuite
                </span>
              </h1>
              <p className="mt-1 text-xs font-semibold tracking-wide text-[#7A93B0] sm:text-sm">
                Cooperative Banking System (CBS)
              </p>
            </div>

            {/* Date & Time pill banner */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2.5 rounded-xl border border-[#D5E6F7] bg-[#F0F7FD] px-4 py-2.5 text-xs font-semibold text-[#1B74D6] sm:text-sm">
              <span className="inline-flex items-center gap-1.5 text-[#2A527A]">
                <CalendarDays className="h-4 w-4 text-[#1B74D6]" />
                {formatDate(currentTime)}
              </span>
              <span className="hidden text-[#B0C8E0] sm:inline">|</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#163A5F]">
                <Clock className="h-4 w-4 text-[#1B74D6]" />
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Info Cards */}
            <div className="w-full space-y-3">
              {/* Organisation Card */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#E2EEF8] bg-white/95 p-3.5 shadow-xs transition-all hover:border-[#1B74D6]/30 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FD] text-[#1B74D6]">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-wide text-[#7A93B0] sm:text-xs">
                    {t("auth.organisationName")}
                  </p>
                  <p className="truncate text-sm font-bold text-[#163A5F] sm:text-[15px]">
                    {orgName || t("common.notAvailable")}
                  </p>
                </div>
              </div>

              {/* Branch Card */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#E2EEF8] bg-white/95 p-3.5 shadow-xs transition-all hover:border-[#1B74D6]/30 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FD] text-[#1B74D6]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-wide text-[#7A93B0] sm:text-xs">
                    {t("auth.branchName")}
                  </p>
                  <p className="truncate text-sm font-bold text-[#163A5F] sm:text-[15px]">
                    {branchName || t("common.notAvailable")}
                  </p>
                </div>
              </div>

              {/* Working Date Card */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#E2EEF8] bg-white/95 p-3.5 shadow-xs transition-all hover:border-[#1B74D6]/30 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FD] text-[#1B74D6]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-wide text-[#7A93B0] sm:text-xs">
                    {t("auth.workingDate")}
                  </p>
                  <p className="truncate text-sm font-bold text-[#163A5F] sm:text-[15px]">
                    {formatDate(currentTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleBeginSession}
                disabled={loading}
                className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B74D6] to-[#0D5FBF] text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1668c2] hover:to-[#0b54ab] hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:text-[15px]"
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={20} speedMultiplier={0.7} />
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>{t("auth.processToDayBegin")}</span>
                  </>
                )}
              </button>

              <button
                onClick={postLogoutApiCall}
                disabled={loading}
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 text-sm font-semibold text-red-600 shadow-xs transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("auth.logout")}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BeginPage;
