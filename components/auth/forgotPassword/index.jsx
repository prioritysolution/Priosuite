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
    <div className="relative h-full max-h-full w-full overflow-hidden bg-[#d7eefc]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/floginpagebg.png"
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
        <section className="relative hidden h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex">
         
         {/* left side content — matches mockup: brand, one-line headline, two-line subtitle */}
          <div className="relative z-20 shrink-0 px-10 pt-8 xl:px-14 xl:pt-10 2xl:px-16">
            <BrandMark />
            <h1 className="mt-7 whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#163A5F] xl:mt-8 xl:text-[26px] 2xl:text-[28px]">
              {t("auth.smarterBanking")}
              <span className="mx-2.5 font-medium text-[#1B74D6]">|</span>
              {t("auth.strongerCommunities")}
            </h1>
            <p className="mt-3 max-w-[460px] text-[13px] leading-[1.55] text-[#6B849E] xl:text-[14px]">
              {t("auth.subtitle")}
            </p>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-0 py-2">
            <Image
              src="/floginpageimg.png"
              alt={t("auth.illustrationAlt")}
              width={1536}
              height={1024}
              priority
              unoptimized
              className="h-auto w-[min(85%,780px)] max-h-[min(520px,55vh)] object-contain"
            />
          </div>

          {/* Bottom feature strip — solid gradient bar, full width, pinned to bottom */}
          <div className="relative z-20 mt-auto w-full shrink-0  px-10 py-5 xl:px-14 xl:py-6 2xl:px-16">
            <div className="mx-auto flex w-full max-w-[720px] items-start justify-between gap-4">
              <FeatureStripItem icon={ShieldCheck} label={t("auth.secureReliable")}  className="border-r-2 border-r-[#1B74D6]" />
              <FeatureStripItem icon={IoIosCloudOutline} label={t("auth.scalableArchitecture")}  className="border-r-2 border-r-[#1B74D6]" />
              <FeatureStripItem icon={Zap} label={t("auth.fasterOperations")}  className="border-r-2 border-r-[#1B74D6]" />
              <FeatureStripItem icon={Users} label={t("auth.betterMemberService")}  />
            </div>
          </div>
        </section>

        {/* Right form — same layout as login */}
        <section className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden p-3 sm:p-5 lg:w-[min(100%,720px)] lg:-ml-16 lg:justify-start lg:pl-2 lg:pr-8 xl:w-[780px] xl:-ml-24 xl:pl-4 xl:pr-10">
          <div
            className="flex max-h-full w-full max-w-[500px] flex-col overflow-y-auto rounded-2xl border border-white/80 bg-white/95 px-5 py-5 shadow-[0_18px_50px_rgba(22,58,95,0.14)] backdrop-blur-md sm:max-w-[540px] sm:rounded-[28px] sm:px-9 sm:py-7"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            <div className="mb-2 flex items-center justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F8FD] px-2 py-0.5 text-[10px] font-medium text-[#6F87A3] sm:text-[11px]">
                <Lock className="h-3 w-3" />
                {t("auth.secureReset")}
              </span>
            </div>

            <div className="mb-3 flex justify-center sm:mb-4">
              <BrandMark compact />
            </div>

            <div className="mb-5">
              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                {isResetStep
                  ? t("auth.resetPassword")
                  : t("auth.forgotPassword")}
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                {isResetStep
                  ? t("auth.resetSubtitle")
                  : t("auth.forgotSubtitle")}
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
                    label={t("auth.email")}
                    placeholder={t("auth.enterEmail")}
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
                      label={t("auth.code")}
                      placeholder={t("auth.enterCode")}
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
                        {t("auth.resendOtp")}
                      </button>
                    )}

                    <InputField
                      control={form.control}
                      name="password"
                      label={t("auth.newPassword")}
                      placeholder={t("auth.enterNewPassword")}
                      type="password"
                      disabled={!mailVerified}
                      isRequired
                      startContent={<Lock className="h-4 w-4" />}
                    />

                    <InputField
                      control={form.control}
                      name="confirmPassword"
                      label={t("auth.confirmPassword")}
                      placeholder={t("auth.confirmNewPassword")}
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
                      {isResetStep ? t("auth.submit") : t("auth.next")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="text-[12px] font-medium text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                  >
                    {t("auth.backToSignIn")}
                  </Link>
                </div>
              </form>
            </Form>

            <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-[#eef3f8] pt-4 text-[10px] text-[#9AADC2] sm:text-[11px]">
              {/* <Image
                src="/pristlogo.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              /> */}
              <Link
                href="https://prioritysolutions.in"
                target="_blank"
                className="text-[#9AADC2] hover:text-[#1B74D6]"
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
