import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOpeningLedgerBranchAPI = async (orgId, branchId) => {
  let data = {
    url: endPoints.getOpeningLedgerBranch(orgId, branchId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerMainHeadAPI = async () => {
  let data = {
    url: endPoints.getOpeningLedgerMainHead,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerSubHeadAPI = async (headId) => {
  let data = {
    url: endPoints.getOpeningLedgerSubHead(headId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerAPI = async (subId) => {
  let data = {
    url: endPoints.getOpeningLedger(subId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postOpeningLedgerAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningLedger,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
