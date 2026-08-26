import { doGetApiCall, doPostApiCall } from "../../../utils/apiConfig";
import { endPoints } from "../../../utils/endPoints";

export const getForgotPasswordOtpAPI = async (mail, mode) => {
  let data = {
    url: endPoints.getForgotPasswordOtp(mail, mode),
  };
  let res = await doGetApiCall(data);
  return res;
};

export const getVerifyForgotPasswordOtpAPI = async (otp, mail) => {
  let data = {
    url: endPoints.getVerifyForgotPasswordOtp(otp, mail),
  };
  let res = await doGetApiCall(data);
  return res;
};

export const postNewForgotPasswordAPI = async (bodyData) => {
  let data = {
    url: endPoints.postNewForgotPassword,
    bodyData,
  };
  let res = await doPostApiCall(data);
  return res;
};
