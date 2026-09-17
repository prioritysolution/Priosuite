import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getInvestmentClosingInterestAPI = async (bodyData) => {
  let data = {
    url: endPoints.getInvestmentClosingInterest,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const postInvestmentCloseAPI = async (bodyData) => {
  let data = {
    url: endPoints.addInvestmentClose,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
