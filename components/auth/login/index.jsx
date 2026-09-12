
"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Cloud,
  Coins,
  Globe,
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DropdownFieldNew from "@/common/formFields/DropdownFieldNew";
import InputField from "@/common/formFields/InputField";
import BrandMark from "@/common/BrandMark";

const languageOptions = [
  { Id: "en", Option_Value: "English" },
  { Id: "bn", Option_Value: "Bangla" },
  { Id: "hi", Option_Value: "Hindi" },
  { Id: "ur", Option_Value: "Urdu" },
];

const FeatureStripItem = ({ icon: Icon, label, className }) => (
  <div className={`flex flex-1 flex-col items-center gap-2 text-center ${className}`}>
    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
    <p className="text-[11px] font-medium leading-snug text-white/90 xl:text-xs">
      {label}
    </p>
  </div>
);


const Login = ({
  loading,
  afterLoginLoading,
  terminateSessionLoading,
  form,
  handleSubmit,
  financialYear = [],
  showActiveSessionDialog,
  setShowActiveSessionDialog,
  showOtpForm,
  handleShowOtpForm,
  otpForm,
  handleOtpFormSubmit,
  showResendOtp,
  handleResendOtp,
}) => {
  const [showLoginLoading, setShowLoginLoading] = useState(false);

  useEffect(() => {
    if (afterLoginLoading && !showLoginLoading) {
      setShowLoginLoading(true);
      const timer = setTimeout(() => {
        setShowLoginLoading(false);
      }, 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [afterLoginLoading, showLoginLoading]);

  if (afterLoginLoading || showLoginLoading) {
    return (
      <div className="flex h-full min-h-dvh w-full flex-col items-center justify-center gap-4 bg-[#eaf4fc] px-4 sm:gap-6">
        <BrandMark />
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="text-base font-medium tracking-wide text-gray-700 sm:text-lg">
            Loading
          </p>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="inline-block h-2 w-2 rounded-full bg-[#1B74D6] sm:h-2.5 sm:w-2.5"
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

  return (
    <div className="relative h-full max-h-full w-full overflow-hidden bg-[#d7eefc]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/finalloginimg.png"
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full object-cover object-[left_center] lg:object-center"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#e8f3fc]/75 via-white/45 to-[#d7eefc]/80 lg:bg-transparent lg:from-transparent lg:via-transparent lg:to-transparent" />
        <div className="absolute inset-y-0 right-0 hidden w-[48%] bg-linear-to-l from-white/70 via-white/35 to-transparent lg:block" />
      </div>

      <div className="relative z-10 flex h-full max-h-full flex-col overflow-hidden lg:flex-row">
        <section className="relative hidden h-full min-h-0 flex-1 overflow-hidden lg:block">
          {/* BrandMark — top left */}
          {/* <div className="absolute left-8 top-6 z-20 xl:left-60 xl:top-1 2xl:left-16">
            <BrandMark />
          </div> */}

          {/* Feature Strip — fixed above bottom so it stays fully visible */}
          <div className="absolute bottom-6 left-8 z-20 flex w-[min(92%,720px)] items-start justify-between gap-4 rounded-2xl px-6 py-5 xl:bottom-3 xl:left-14 xl:px-8 2xl:left-16">
            <FeatureStripItem
              icon={ShieldCheck}
              label="Secure & Reliable"
              className="border-r-2 border-r-[#1B74D6]"
            />
            <FeatureStripItem
              icon={Cloud}
              label="Scalable Architecture"
              className="border-r-2 border-r-[#1B74D6]"
            />
            <FeatureStripItem
              icon={Zap}
              label="Faster Operations"
              className="border-r-2 border-r-[#1B74D6]"
            />
            <FeatureStripItem icon={Users} label="Better Member Service" />
          </div>
        </section>

        {/* Right login — fixed, no scroll */}
        <section className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden p-3 sm:p-5 lg:w-[min(100%,530px)] lg:justify-end lg:pr-10 xl:w-[560px] xl:pr-12">
          <div
            className="w-full max-w-[420px] rounded-2xl border border-white/80 bg-white/95 px-4 py-4 shadow-[0_18px_50px_rgba(22,58,95,0.14)] backdrop-blur-md sm:max-w-[450px] sm:rounded-3xl sm:px-7 sm:py-5"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            <div className="mb-2 flex items-center justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F8FD] px-2 py-0.5 text-[10px] font-medium text-[#6F87A3] sm:text-[11px]">
                <Lock className="h-3 w-3" />
                Secure Login
              </span>
            </div>

            <div className="mb-2 flex justify-center sm:mb-3">
              <BrandMark compact />
            </div>

            <div className="mb-4 text-center">
              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                Welcome Back
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                Sign in to continue to your institution
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full flex-col gap-1 sm:gap-3"
                autoComplete="off"
              >
                <DropdownFieldNew
                  control={form.control}
                  name="language"
                  label="Language"
                  options={languageOptions}
                  optionValueKey="Id"
                  optionLabelKey="Option_Value"
                  startContent={<Globe className="h-4 w-4" />}
                />

                <DropdownFieldNew
                  control={form.control}
                  name="year_id"
                  label="Financial Year"
                  options={financialYear || []}
                  optionValueKey="Id"
                  optionLabelKey="Yr"
                  disabled={!financialYear || financialYear.length === 0}
                  startContent={<CalendarDays className="h-4 w-4" />}
                />

                <InputField
                  control={form.control}
                  name="email"
                  label="Email / Username"
                  placeholder="Enter your email or username"
                  autoComplete="username"
                  autoFocus
                  startContent={<Mail className="h-4 w-4" />}
                />

                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  startContent={<Lock className="h-4 w-4" />}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer mt-1 h-11 w-full rounded-xl bg-linear-to-r from-[#1B74D6] to-[#0D5FBF] text-[14px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1668c2] hover:to-[#0b54ab] hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:text-[15px]"
                >
                  {loading ? (
                    <ClipLoader color="#fff" size={22} speedMultiplier={0.7} />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex justify-center">
                  <Link
                    href="/forgotPassword"
                    className="text-[12px] font-medium text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </Form>

{/*  */}
            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-[#eef3f8] pt-3 text-[10px] text-[#9AADC2] sm:text-[11px]">
             

             <Link href="https://prioritysolutions.in" target="_blank" className="text-[#9AADC2] hover:text-[#1B74D6]">              
              Powered by Priority Solutions
             </Link>
            </div>
          </div>
        </section>
      </div>

      <Dialog
        open={showActiveSessionDialog}
        onOpenChange={setShowActiveSessionDialog}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[500px] rounded-2xl p-4 sm:rounded-3xl sm:p-8">
          <div className="flex w-full flex-col gap-4 py-1 sm:gap-5">
            {!showOtpForm ? (
              <>
                <p className="text-center text-base font-semibold text-[#1a2e44] sm:text-lg">
                  Want to terminate your session?
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-red-500 to-red-600 font-semibold text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                    onClick={() => setShowActiveSessionDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    onClick={handleShowOtpForm}
                  >
                    Continue
                  </Button>
                </div>
              </>
            ) : (
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
                      <Lock className="h-4 w-4 text-[#b0bec8]" />
                    }
                  />

                  {showResendOtp && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[13px] font-medium text-[#1B74D6] hover:underline focus:outline-none"
                    >
                      Resend OTP
                    </button>
                  )}

                  <Button
                    type="submit"
                    disabled={terminateSessionLoading}
                    className="h-11 w-full rounded-xl bg-linear-to-r from-[#1B74D6] to-[#0D5FBF] text-[14px] font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#1668c2] hover:to-[#0b54ab] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:text-[15px]"
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

      <style>{`
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;