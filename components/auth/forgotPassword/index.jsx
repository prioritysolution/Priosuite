"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import {
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import InputField from "@/common/formFields/InputField";
import BrandMark from "@/common/BrandMark";
import { cn } from "@/lib/utils";
import { IoIosCloudOutline } from "react-icons/io";

const FeatureStripItem = ({ icon: Icon, label, className }) => (
  <div className={`flex flex-1 flex-col items-center gap-1.5 text-center ${className}`}>
    <Icon
      size={28}
      className="shrink-0 text-white"
      strokeWidth={2}
      style={{ width: 28, height: 28 }}
    />
    <p className="text-[12px] font-medium leading-snug text-white/90 xl:text-[13px]">
      {label}
    </p>
  </div>
);

const ForgotPassword = ({
  form,
  loading,
  verifyOtpLoading,
  handleSubmit,
  handleVerifyOtp,
  page,
  mailVerified,
  showResendOtp,
  handleResendOtp,
}) => {
  const isResetStep = page !== 1;

  return (
    <div className="relative h-full max-h-full w-full overflow-hidden bg-[#d7eefc]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/finalloginimg.png"
          alt=""
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="select-none object-cover object-left"
        />
        <div className="absolute inset-0 bg-white/25 lg:hidden" />
      </div>

      <div className="relative z-10 flex h-full max-h-full flex-col overflow-hidden lg:flex-row">
        <section className="relative hidden h-full min-h-0 flex-1 overflow-visible lg:block">
          <div className="absolute left-96 top-6 z-20 xl:left-96 xl:top-4">
            <BrandMark />
          </div>
          {/* Feature Strip */}
          <div className="absolute bottom-5 left-8 z-20 flex w-[min(92%,720px)] items-start justify-between gap-4 rounded-2xl px-6 py-4 xl:bottom-3 xl:left-14 xl:px-8 2xl:left-16">
            <FeatureStripItem
              icon={ShieldCheck}
              label="Secure & Reliable"
              className="border-r-2 border-r-[#1B74D6]"
            />
            <FeatureStripItem
              icon={IoIosCloudOutline}
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

        <section className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden p-3 sm:p-5 lg:w-[min(100%,780px)] lg:-ml-8 lg:justify-start lg:pl-4 lg:pr-8 xl:w-[860px] xl:-ml-12 xl:pl-6 xl:pr-10">
          <div
            className="flex max-h-full w-full max-w-[540px] flex-col overflow-y-auto rounded-2xl border border-white/80 bg-white/95 px-5 py-6 shadow-[0_18px_50px_rgba(22,58,95,0.14)] backdrop-blur-md sm:max-w-[580px] sm:rounded-3xl sm:px-10 sm:py-8"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            <div className="mb-3 flex items-center justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F8FD] px-2 py-0.5 text-[10px] font-medium text-[#6F87A3] sm:text-[11px]">
                <Lock className="h-3 w-3" />
                Secure Reset
              </span>
            </div>

            <div className="mb-3 flex justify-center sm:mb-4">
              <BrandMark compact />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                {isResetStep ? "Reset Password" : "Forgot Password"}
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                {isResetStep
                  ? "Enter the code sent to your email and set a new password"
                  : "Enter your email to receive a reset code"}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full flex-col gap-2.5 sm:gap-4"
                autoComplete="off"
              >
                {!isResetStep ? (
                  <InputField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                    isRequired
                    startContent={<Mail className="h-4 w-4" />}
                  />
                ) : (
                  <>
                    <InputField
                      control={form.control}
                      name="code"
                      label="Code"
                      placeholder="Enter code"
                      type="number"
                      maxLength={6}
                      disabled={mailVerified}
                      isRequired
                      startContent={<KeyRound className="h-4 w-4" />}
                      endContent={
                        <div
                          onClick={!verifyOtpLoading ? handleVerifyOtp : undefined}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B74D6] text-white",
                            { "bg-green-500": mailVerified },
                            {
                              "pointer-events-none opacity-50": verifyOtpLoading,
                            },
                            { "cursor-pointer": !verifyOtpLoading && !mailVerified }
                          )}
                        >
                          {verifyOtpLoading ? (
                            <ClipLoader color="#fff" size={16} speedMultiplier={0.7} />
                          ) : (
                            <FaCheckCircle />
                          )}
                        </div>
                      }
                    />

                    {showResendOtp && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="self-start text-[12px] font-medium text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                      >
                        Resend OTP
                      </button>
                    )}

                    <InputField
                      control={form.control}
                      name="password"
                      label="New Password"
                      placeholder="Enter new password"
                      type="password"
                      disabled={!mailVerified}
                      isRequired
                      startContent={<Lock className="h-4 w-4" />}
                    />

                    <InputField
                      control={form.control}
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      type="password"
                      disabled={!mailVerified}
                      isRequired
                      startContent={<Lock className="h-4 w-4" />}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading || (isResetStep && !mailVerified)}
                  className="cursor-pointer mt-2 h-12 w-full rounded-xl bg-linear-to-r from-[#1B74D6] to-[#0D5FBF] text-[14px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1668c2] hover:to-[#0b54ab] hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:h-13 sm:text-[15px]"
                >
                  {loading ? (
                    <ClipLoader color="#fff" size={22} speedMultiplier={0.7} />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {isResetStep ? "Submit" : "Next"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="text-[12px] font-medium text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </Form>

            <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-[#eef3f8] pt-4 text-[10px] text-[#9AADC2] sm:text-[11px]">
              <Link
                href="https://prioritysolutions.in"
                target="_blank"
                className="text-[#9AADC2] hover:text-[#1B74D6]"
              >
                Powered by Priority Solutions
              </Link>
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

export default ForgotPassword;
