"use client";

import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { getCheckFinYearAPI } from "@/container/auth/login/LoginApis";
import { toast } from "react-hot-toast";
import { Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DropdownFieldNew from "@/common/formFields/DropdownFieldNew";
import InputField from "@/common/formFields/InputField";

const languageOptions = [
  { Id: "en", Option_Value: "English" },
  { Id: "bn", Option_Value: "Bangla" },
  { Id: "hi", Option_Value: "Hindi" },
  { Id: "ur", Option_Value: "Urdu" },
];

const Login = ({
  loading,
  afterLoginLoading,
  terminateSessionLoading,
  form,
  handleSubmit,
  showActiveSessionDialog,
  setShowActiveSessionDialog,
  showOtpForm,
  handleShowOtpForm,
  otpForm,
  handleOtpFormSubmit,
  showResendOtp,
  handleResendOtp,
}) => {
  const [financialYear, setFinancialYear] = useState([]);
  const [showLoginLoading, setShowLoginLoading] = useState(false);

  useEffect(() => {
    const fetchFinancialYear = async () => {
      try {
        const res = await getCheckFinYearAPI();
        setFinancialYear(res.details || []);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch financial year");
      }
    };
    fetchFinancialYear();
  }, []);

  useEffect(() => {
    if (afterLoginLoading && !showLoginLoading) {
      setShowLoginLoading(true);
      const timer = setTimeout(
        () => {
          setShowLoginLoading(false);
          console.log("5 minutes completed, proceeding...");
        },
        5 * 60 * 1000,
      );
      return () => clearTimeout(timer);
    }
  }, [afterLoginLoading, showLoginLoading]);

  /* ── Loading Screen ── */
  if (afterLoginLoading || showLoginLoading) {
    return (
      <div className="min-h-dvh h-full w-full flex flex-col items-center justify-center gap-4 sm:gap-6 bg-gray-100 px-4">
        <Image
          src="/lodingImg.png"
          alt="Logo"
          width={300}
          height={300}
          className="object-contain w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px]"
          priority
        />
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="text-gray-700 text-base sm:text-lg font-medium tracking-wide">
            Loading
          </p>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#1769c2] inline-block"
                style={{
                  animation: "bounce-dot 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes bounce-dot {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  /* ── Main Login Page ── */
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-3 sm:p-6 relative overflow-x-hidden bg-[#eef2f6]">
      {/* Background — faded on mobile, full on desktop */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Image
          src="/logo.png"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 sm:opacity-60 md:opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-white/55 sm:bg-white/35 md:bg-transparent" />
      </div>

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] bg-white/95 backdrop-blur-lg rounded-[16px] sm:rounded-[24px] shadow-xl sm:shadow-2xl border border-white/20 px-4 pt-5 pb-4 sm:px-8 sm:pt-9 sm:pb-7 mx-auto overflow-y-auto overscroll-contain"
        style={{ maxHeight: "calc(100dvh - 1.5rem)" }}
      >
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-3 sm:mb-6">
          <Image
            src="/pristlogo.png"
            alt="PrioSuite"
            width={60}
            height={60}
            className="object-contain w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16"
          />
          <div className="flex flex-col">
            <span className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold tracking-tight text-[#1a3a5c] leading-none">
              Prio<span className="text-[#1769c2]">Suite</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="block h-[1.5px] w-5 sm:w-7 bg-[#1769c2]" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[3px] text-[#1769c2]">
                CBS
              </span>
              <span className="block h-[1.5px] w-5 sm:w-7 bg-[#1769c2]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-2 sm:mt-4 mb-4 sm:mb-6">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#1a2e44]">
            Welcome Back!
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#8a9ab0] mt-0.5 sm:mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3 sm:space-y-4"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <DropdownFieldNew
                control={form.control}
                name="language"
                label="Select Language"
                options={languageOptions}
                optionValueKey="Id"
                optionLabelKey="Option_Value"
                isRequired
              />

              <DropdownFieldNew
                control={form.control}
                name="year_id"
                label="Financial Year"
                options={financialYear || []}
                optionValueKey="Id"
                optionLabelKey="Yr"
                disabled={!financialYear || financialYear.length === 0}
              />
            </div>

            <InputField
              control={form.control}
              name="email"
              label="User ID"
              placeholder="User ID"
              autoComplete="off"
            />

            <InputField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />

            {/* Forgot Password */}
            <div className="flex justify-end pt-0.5 sm:pt-1">
              <Link
                href="/forgotPassword"
                className="text-[12px] sm:text-[13px] text-[#1769c2] font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] sm:h-[50px] rounded-[10px] sm:rounded-[12px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[14px] sm:text-[15px] font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <ClipLoader color="#fff" size={22} speedMultiplier={0.7} />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center text-[10px] sm:text-[11px] text-[#b0bec8] mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#f0f4f8]">
          © {new Date().getFullYear()} Priority Solutions. All rights reserved.
        </div>
      </div>

      {/* ── Active Session Dialog ── */}
      <Dialog
        open={showActiveSessionDialog}
        onOpenChange={setShowActiveSessionDialog}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[500px] rounded-[16px] sm:rounded-[20px] p-4 sm:p-8">
          <div className="w-full flex flex-col gap-4 sm:gap-5 py-1">
            {!showOtpForm ? (
              /* Session Terminate Confirmation */
              <>
                <p className="text-center text-base sm:text-lg font-semibold text-[#1a2e44]">
                  Want to terminate your session?
                </p>
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-[12px] h-[44px] sm:h-[46px] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => setShowActiveSessionDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-[12px] h-[44px] sm:h-[46px] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={handleShowOtpForm}
                  >
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              /* OTP Form */
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(handleOtpFormSubmit)}
                  className="w-full space-y-4 sm:space-y-5"
                  autoComplete="off"
                >
                  <InputField
                    control={otpForm.control}
                    name="otp"
                    label="OTP"
                    placeholder="Enter your OTP"
                    type="number"
                    maxLength={6}
                    startContent={
                      <Lock className="w-[17px] h-[17px] text-[#b0bec8]" />
                    }
                  />

                  {showResendOtp && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[13px] text-[#1769c2] font-medium hover:underline focus:outline-none"
                    >
                      Resend OTP
                    </button>
                  )}

                  <Button
                    type="submit"
                    disabled={terminateSessionLoading}
                    className="w-full h-[44px] sm:h-[50px] rounded-[12px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[14px] sm:text-[15px] font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {terminateSessionLoading ? (
                      <ClipLoader
                        color="#fff"
                        size={22}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
