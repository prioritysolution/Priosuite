import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getAccountListAPI = async (orgId, type, value, page) => {
  let data = {
    url: endPoints.getAccountList(orgId, type, value, page),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getAccountDetailsByAccountNoAPI = async (
  accountNo,
  type,
  date,
  orgId,
  prodId,
) => {
  let data = {
    url: endPoints.getAccountDetailsByAccountNo(
      accountNo,
      type,
      date,
      orgId,
      prodId,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositLedgerAPI = async (
  accountId,
  fromDate,
  toDate,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositLedger(accountId, fromDate, toDate, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDeposit,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getOperateProductAPI = async (orgId, screen) => {
  let data = {
    url: endPoints.getOperateProduct(orgId, screen),
  };

  let res = await doGetApiCall(data);
  return res;
};
