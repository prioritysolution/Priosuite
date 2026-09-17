import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postSubLedgerAPI = async (bodyData) => {
  let data = {
    url: endPoints.addSubLedger,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateSubLedgerAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateSubLedger,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getSubLedgerAPI = async (orgId, branchId, page, keyword) => {
  let data = {
    url: endPoints.getSubLedgerData(orgId, branchId, page, keyword),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getSubLedgerHeadAPI = async () => {
  let data = {
    url: endPoints.getSubLedgerHeadData,
  };

  let res = await doGetApiCall(data);
  return res;
};
