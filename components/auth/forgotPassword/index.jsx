"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { IoIosCloudOutline } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import InputField from "@/common/formFields/InputField";
import BrandMark from "@/common/BrandMark";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const isResetStep = page !== 1;

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

        {/* Right form — same layout as login */}
        <section className="flex w-full flex-1 items-center justify-center p-4 sm:p-6 lg:max-w-[620px] lg:flex-initial lg:justify-center lg:p-8 xl:max-w-[680px] xl:p-12">
          <div
            className="flex w-full max-w-[480px] flex-col rounded-3xl border border-white/90 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(13,95,191,0.18)] backdrop-blur-xl transition-all sm:max-w-[500px] sm:p-8 xl:max-w-[520px] xl:p-9"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3FB] px-2.5 py-1 text-[11px] font-semibold text-[#1B74D6]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("auth.secureReset")}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A93B0]">
                <Lock className="h-3 w-3" />
                SSL 256-bit
              </span>
            </div>

            <div className="my-2 flex justify-center sm:my-3">
              <BrandMark compact />
            </div>

            <div className="mb-5 text-center">
              <h2 className="text-[22px] font-extrabold tracking-tight text-[#163A5F] sm:text-[24px]">
                {isResetStep
                  ? t("auth.resetPassword")
                  : t("auth.forgotPassword")}
              </h2>
              <p className="mt-1 text-[12px] font-medium text-[#7A93B0] sm:text-[13px]">
                {isResetStep
                  ? t("auth.resetSubtitle")
                  : t("auth.forgotSubtitle")}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full flex-col gap-2.5 sm:gap-3.5"
                autoComplete="off"
              >
                {!isResetStep ? (
                  <InputField
                    control={form.control}
                    name="email"
                    label={t("auth.email")}
                    placeholder={t("auth.enterEmail")}
                    autoComplete="email"
                    autoFocus
                    isRequired
                    startContent={<Mail className="h-4 w-4 text-[#1B74D6]" />}
                  />
                ) : (
                  <>
                    <InputField
                      control={form.control}
                      name="code"
                      label={t("auth.code")}
                      placeholder={t("auth.enterCode")}
                      type="number"
                      maxLength={6}
                      disabled={mailVerified}
                      isRequired
                      startContent={<KeyRound className="h-4 w-4 text-[#1B74D6]" />}
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
                        {t("auth.resendOtp")}
                      </button>
                    )}

                    <InputField
                      control={form.control}
                      name="password"
                      label={t("auth.newPassword")}
                      placeholder={t("auth.enterNewPassword")}
                      type="password"
                      autoComplete="new-password"
                      disabled={!mailVerified}
                      isRequired
                      startContent={<Lock className="h-4 w-4 text-[#1B74D6]" />}
                    />

                    <InputField
                      control={form.control}
                      name="confirmPassword"
                      label={t("auth.confirmPassword")}
                      placeholder={t("auth.confirmNewPassword")}
                      type="password"
                      autoComplete="new-password"
                      disabled={!mailVerified}
                      isRequired
                      startContent={<Lock className="h-4 w-4 text-[#1B74D6]" />}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading || (isResetStep && !mailVerified)}
                  className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#1B74D6] to-[#0D5FBF] text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1668c2] hover:to-[#0b54ab] hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:text-[15px]"
                >
                  {loading ? (
                    <ClipLoader color="#fff" size={22} speedMultiplier={0.7} />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {isResetStep ? t("auth.submit") : t("auth.next")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex justify-center pt-1">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t("auth.backToSignIn")}</span>
                  </Link>
                </div>
              </form>
            </Form>

            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-[#edf2f7] pt-3 text-[11px] text-[#9AADC2]">
              <Link
                href="https://prioritysolutions.in"
                target="_blank"
                className="font-medium text-[#9AADC2] transition-colors hover:text-[#1B74D6]"
              >
                {t("auth.poweredBy")}
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
