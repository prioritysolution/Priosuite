import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postBankTransferAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBankTransfer,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
