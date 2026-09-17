// getOperateProduct

import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOperateProductAPI = async (orgId, screen) => {
  let data = {
    url: endPoints.getOperateProduct(orgId, screen),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getParamAPI = async (orgId, charge_id, prod_id) => {
  let data = {
    url: endPoints.getParam(orgId, charge_id, prod_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getListAPI = async (
  charge_id,
  prod_id,
  date,
  branch_id,
  org_id,
) => {
  let data = {
    url: endPoints.getList(charge_id, prod_id, date, branch_id, org_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postLedgerChargeAPI = async (bodyData) => {
  let data = {
    url: endPoints.PostLedgerCharge,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
