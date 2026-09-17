import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getShareIssueDataByIdAPI = async (orgId, memberId, date) => {
  let data = {
    url: endPoints.getShareIssueDataById(orgId, memberId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getShareLedgerAPI = async (
  accountId,
  fromDate,
  toDate,

  orgId,
) => {
  let data = {
    url: endPoints.getShareLedger(accountId, fromDate, toDate, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postShareIssueAPI = async (bodyData) => {
  let data = {
    url: endPoints.addShareIssue,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
