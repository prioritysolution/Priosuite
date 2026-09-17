import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postDepositRenewalAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositRenewalAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
