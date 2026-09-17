import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBorrowingsAccountAPI = async (orgId, branch_id) => {
  let data = {
    url: endPoints.getBorrowingsAccount(orgId, branch_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBorrowingsAccountInfoAPI = async (orgId, borrowId, date) => {
  let data = {
    url: endPoints.getBorrowingsAccountInfo(orgId, borrowId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBorrowingsLedgerAPI = async (
  orgId,
  borrowId,
  fromDate,
  toDate,
  mode,
) => {
  let data = {
    url: endPoints.getBorrowingsLedger(orgId, borrowId, fromDate, toDate, mode),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postBorrowingsTransactionDisburseAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBorrowingsTransactionDisburse,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
export const postBorrowingsTransactionRepaymentAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBorrowingsTransactionRepayment,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
