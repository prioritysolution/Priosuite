import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const ApprovalbankingGetListAPI = (org_id, branch_id) => {
  return doGetApiCall({
    url: endPoints.ApprovalbankingGetList(org_id, branch_id),
  });
};
export const ApprovalbankingGetDetailsAPI = async (org_id, type_id, type) => {
  return await doGetApiCall({
    url: endPoints.ApprovalbankingGetDetails(org_id, type_id, type),
  });
};

export const ApprovalbankingUpdateAccountAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.ApprovalbankingUpdateAccount,
    bodyData: data,
  });
};

export const ApprovalbankingApprvRejectAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.ApprovalbankingApprvReject,
    bodyData: data,
  });
};

export const getBankAccountTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getBankAccountType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBankGlAPI = async (orgId, typeId) => {
  let data = {
    url: endPoints.getBankGl(orgId, typeId),
  };

  let res = await doGetApiCall(data);
  return res;
};
