import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getInvestmentAccountAPI = async (orgId, type) => {
  let data = {
    url: endPoints.getInvestmentAccount(orgId, type),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentLedgerAPI = async (
  orgId,
  investId,
  fromDate,
  toDate,
) => {
  let data = {
    url: endPoints.getInvestmentLedger(orgId, investId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postInvestmentInterestAPI = async (bodyData) => {
  let data = {
    url: endPoints.addInvestmentInterest,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
