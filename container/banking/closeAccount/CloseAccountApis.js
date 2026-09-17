import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postBankClosingAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBankCloseAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
