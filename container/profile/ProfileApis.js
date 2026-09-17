import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getUserProfileDetailsAPI = async () => {
  let data = {
    url: endPoints.getUserProfileDetails,
  };

  const res = await doGetApiCall(data);
  return res;
};

export const updateUserProfileDetailsAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateUserProfileDetails,
    bodyData,
  };

  const res = await doPutApiCall(data);
  return res;
};
