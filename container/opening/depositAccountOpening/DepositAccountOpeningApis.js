import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postOpeningDepositAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningDepositAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
