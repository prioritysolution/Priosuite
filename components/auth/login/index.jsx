



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
import { IoIosCloudOutline } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import DropdownFieldNew from "@/common/formFields/DropdownFieldNew";
import InputField from "@/common/formFields/InputField";
import BrandMark from "@/common/BrandMark";
import { setAppLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";

const FeatureStripItem = ({ icon: Icon, label ,className}) => (
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
  const { t, i18n } = useTranslation();
  const [showLoginLoading, setShowLoginLoading] = useState(false);

  const languageOptions = [
    { Id: "en", Option_Value: t("auth.langEnglish") },
    { Id: "bn", Option_Value: t("auth.langBangla") },
    { Id: "hi", Option_Value: t("auth.langHindi") },
    { Id: "or", Option_Value: t("auth.langOdia") },
  ];

  useEffect(() => {
    const current = i18n.language?.split("-")[0] || "en";
    if (form?.getValues?.("language") !== current) {
      form?.setValue?.("language", current, { shouldDirty: false });
    }
  }, [i18n.language, form]);

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
            {t("auth.loading")}
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
        {/* Left Side: Left graphics & branding already part of loginbg.png. We leave this space flexible for large screens */}
        <div className="hidden flex-1 lg:block" />

        {/* Right Side: Login Card container matching design mockup */}
        <section className="flex w-full flex-1 items-center justify-center p-4 sm:p-6 lg:max-w-[620px] lg:flex-initial lg:justify-center lg:p-8 xl:max-w-[680px] xl:p-12">
          <div
            className="flex w-full max-w-[480px] flex-col rounded-3xl border border-white/90 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(13,95,191,0.18)] backdrop-blur-xl transition-all sm:max-w-[500px] sm:p-8 xl:max-w-[520px] xl:p-9"
            style={{ animation: "login-card-in 0.45s ease-out" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3FB] px-2.5 py-1 text-[11px] font-semibold text-[#1B74D6]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("auth.secureLogin")}
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
                {t("auth.welcomeBack")}
              </h2>
              <p className="mt-1 text-[12px] font-medium text-[#7A93B0] sm:text-[13px]">
                {t("auth.signInSubtitle")}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full flex-col gap-2.5 sm:gap-3.5"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
              >
                <input
                  type="text"
                  name="prevent_autofill_user"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                />
                <input
                  type="password"
                  name="prevent_autofill_pass"
                  autoComplete="new-password"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                />
                <DropdownFieldNew
                  control={form.control}
                  name="language"
                  label={t("auth.language")}
                  options={languageOptions}
                  optionValueKey="Id"
                  optionLabelKey="Option_Value"
                  disableSorting
                  startContent={<Globe className="h-4 w-4 text-[#1B74D6]" />}
                  onChange={(value) => {
                    setAppLanguage(value || "en");
                  }}
                />

                <DropdownFieldNew
                  control={form.control}
                  name="year_id"
                  label={t("auth.financialYear")}
                  placeholder={t("auth.selectFinancialYearPlaceholder")}
                  options={financialYear || []}
                  optionValueKey="Id"
                  optionLabelKey="Yr"
                  disabled={!financialYear || financialYear.length === 0}
                  startContent={<CalendarDays className="h-4 w-4 text-[#1B74D6]" />}
                />

                <InputField
                  control={form.control}
                  name="email"
                  label={t("auth.emailUsername")}
                  placeholder={t("auth.enterEmailUsername")}
                  autoComplete="off"
                  autoFocus
                  startContent={<Mail className="h-4 w-4 text-[#1B74D6]" />}
                />

                <InputField
                  control={form.control}
                  name="password"
                  label={t("auth.password")}
                  type="password"
                  placeholder={t("auth.enterPassword")}
                  autoComplete="new-password"
                  startContent={<Lock className="h-4 w-4 text-[#1B74D6]" />}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#1B74D6] to-[#0D5FBF] text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#1668c2] hover:to-[#0b54ab] hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:text-[15px]"
                >
                  {loading ? (
                    <ClipLoader color="#fff" size={22} speedMultiplier={0.7} />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {t("auth.signIn")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex justify-center pt-1">
                  <Link
                    href="/forgotPassword"
                    className="text-[12px] font-semibold text-[#1B74D6] transition-colors hover:text-[#0D5FBF] hover:underline sm:text-[13px]"
                  >
                    {t("auth.forgotPasswordLink")}
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

      <Dialog
        open={showActiveSessionDialog}
        onOpenChange={setShowActiveSessionDialog}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[500px] rounded-2xl p-4 sm:rounded-3xl sm:p-8">
          <div className="flex w-full flex-col gap-4 py-1 sm:gap-5">
            {!showOtpForm ? (
              <>
                <p className="text-center text-base font-semibold text-[#1a2e44] sm:text-lg">
                  {t("auth.terminateSession")}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-red-500 to-red-600 font-semibold text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                    onClick={() => setShowActiveSessionDialog(false)}
                  >
                    {t("auth.cancel")}
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    onClick={handleShowOtpForm}
                  >
                    {t("auth.continue")}
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
                    label={t("auth.otp")}
                    placeholder={t("auth.enterOtp")}
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
                      {t("auth.resendOtp")}
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
                      t("auth.submit")
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