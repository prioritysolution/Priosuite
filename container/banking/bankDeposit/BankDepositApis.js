import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBankAccountAPI = async (orgId, branchId) => {
  let data = {
    url: endPoints.getBankAccount(orgId, branchId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBankLedgerAPI = async (orgId, bankId, fromDate, toDate) => {
  let data = {
    url: endPoints.getBankLedger(orgId, bankId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBankBalanceAPI = async (orgId, accountId, date) => {
  let data = {
    url: endPoints.getBankBalance(orgId, accountId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postBankDepositAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBankDeposit,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
