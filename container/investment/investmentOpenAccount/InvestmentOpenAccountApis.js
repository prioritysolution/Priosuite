import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getInvestmentTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getInvestmentType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentAccountTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getInvestmentAccountType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentInterestTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getInvestmentInterestType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentMatureAmountAPI = async (
  orgId,
  accountType,
  amount,
  roi,
  duration,
  intType,
  durtype
) => {
  let data = {
    url: endPoints.getInvestmentMatureAmount(
      orgId,
      accountType,
      amount,
      roi,
      duration,
      intType,
      durtype
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentOpenLedgerAPI = async (mode, orgId, type, acctType) => {
  let data = {
    url: endPoints.getInvestmentOpenLedger(mode, orgId, type, acctType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postInvestmentOpenAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addInvestmentOpenAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getInvestmentDurationAPI = async (orgId) => {
  const data = {
    url: endPoints.getInvestmentDuration(orgId),
  };
  return doGetApiCall(data);
};