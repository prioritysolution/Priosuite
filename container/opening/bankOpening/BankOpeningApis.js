import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postOpeningBankAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningBankAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
