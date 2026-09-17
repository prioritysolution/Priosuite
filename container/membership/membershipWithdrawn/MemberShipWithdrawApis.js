import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postMembershipWithdrawAPI = async (bodyData) => {
  let data = {
    url: endPoints.addMembershipWithdraw,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
