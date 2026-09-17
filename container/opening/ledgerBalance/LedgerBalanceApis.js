import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOpeningLedgerBranchAPI = async (orgId, branchId) => {
  let data = {
    url: endPoints.getOpeningLedgerBranch(orgId, branchId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerAcctTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getLedgerAcctType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerMainHeadAPI = async (orgId, acctType) => {
  let data = {
    url: endPoints.getLedgerMainHead(orgId, acctType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerSubHeadAPI = async (orgId, acctHead) => {
  let data = {
    url: endPoints.getLedgerSubHead(orgId, acctHead),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpeningLedgerAPI = async (orgId, subId) => {
  let data = {
    url: endPoints.getOpeningLedger(orgId, subId),
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
