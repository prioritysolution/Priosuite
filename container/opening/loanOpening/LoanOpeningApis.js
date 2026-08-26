import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postOpeningLoanAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningLoanAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
