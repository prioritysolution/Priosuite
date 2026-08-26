import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postOpeningInvestmentAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningInvestmentAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
