"use client";

import ForgotPassword from "@/components/auth/forgotPassword";
import { useForgotPassword } from "./Hooks";

const ForgotPasswordContainer = () => {
  const {
    loading,
    verifyOtpLoading,
    form,
    handleSubmit,
    handleVerifyOtp,
    page,
    mailVerified,
    showResendOtp,
    handleResendOtp,
  } = useForgotPassword();
  return (
    <ForgotPassword
      form={form}
      loading={loading}
      verifyOtpLoading={verifyOtpLoading}
      handleSubmit={handleSubmit}
      handleVerifyOtp={handleVerifyOtp}
      page={page}
      mailVerified={mailVerified}
      showResendOtp={showResendOtp}
      handleResendOtp={handleResendOtp}
    />
  );
};
export default ForgotPasswordContainer;
