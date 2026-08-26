import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getInvestmentRenewalInfoAPI = async (orgId, accountNo) => {
  let data = {
    url: endPoints.getInvestmentRenewalInfo(orgId, accountNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postInvestmentRenewalAPI = async (bodyData) => {
  let data = {
    url: endPoints.addInvestmentRenewal,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
