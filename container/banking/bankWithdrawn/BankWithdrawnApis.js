import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postBankWithdrawnAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBankWithdrawn,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
