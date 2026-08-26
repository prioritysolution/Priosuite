"use client";

import Login from "../../../components/auth/login";
import { useLogin } from "./Hooks";

const LoginContainer = () => {
  const {
    loading,
    afterLoginLoading,
    terminateSessionLoading,
    loginForm,
    handleLoginSubmit,
    showActiveSessionDialog,
    setShowActiveSessionDialog,
    showOtpForm,
    handleShowOtpForm,
    otpForm,
    handleOtpFormSubmit,
    showResendOtp,
    handleResendOtp,
  } = useLogin();

  return (
    <Login
      loading={loading}
      afterLoginLoading={afterLoginLoading}
      terminateSessionLoading={terminateSessionLoading}
      form={loginForm}
      handleSubmit={handleLoginSubmit}
      showActiveSessionDialog={showActiveSessionDialog}
      setShowActiveSessionDialog={setShowActiveSessionDialog}
      showOtpForm={showOtpForm}
      handleShowOtpForm={handleShowOtpForm}
      otpForm={otpForm}
      handleOtpFormSubmit={handleOtpFormSubmit}
      showResendOtp={showResendOtp}
      handleResendOtp={handleResendOtp}
    />
  );
};

export default LoginContainer;
