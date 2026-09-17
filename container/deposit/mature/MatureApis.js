import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositCloseAccountAPI = async (
  accountNo,
  date,
  orgId,
  prodId,
) => {
  let data = {
    url: endPoints.getDepositCloseAccount(accountNo, date, orgId, prodId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositMatureAccountAPI = async (
  accountNo,
  date,
  orgId,
  prodId,
) => {
  let data = {
    url: endPoints.getDepositMatureAccount(accountNo, date, orgId, prodId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositMaturityInterestAPI = async (
  accountNo,
  date,
  roi,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositMaturityInterest(accountNo, date, roi, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositMaturityBonusInterestAPI = async (
  accountNo,
  date,
  roi,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositMaturityBonusInterest(accountNo, date, roi, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositCloseAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositCloseAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const postDepositMatureAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositMatureAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getSavingsAccountListAPI = async (orgId, type, value, page) => {
  let data = {
    url: endPoints.getSavingsAccountList(orgId, type, value, page),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCalClosingInterestAPI = async (org_id, acct_id, date) => {
  let data = {
    url: endPoints.CalClosingInterest(org_id, acct_id, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
