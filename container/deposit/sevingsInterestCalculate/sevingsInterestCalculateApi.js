// import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
// import { endPoints } from "@/utils/endPoints";

// export const getOperateProductAPI = async (orgId, screen) => {
//   let data = {
//     url: endPoints.getOperateProduct(orgId, screen),
//   };

//   let res = await doGetApiCall(data);
//   return res;
// };

import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOperateProductAPI = async (orgId, screen) => {
  let data = {
    url: endPoints.getOperateProduct(orgId, screen),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const checkParamAPI = async (orgId, prod_id) => {
  let data = {
    url: endPoints.checkParam(orgId, prod_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const runProcessAPI = async (
  org_id,
  prod_id,
  frm_date,
  to_date,
  branch_id,
) => {
  let data = {
    url: endPoints.runProcess(org_id, prod_id, frm_date, to_date, branch_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postLedgerAPI = async (bodyData) => {
  let data = {
    url: endPoints.PostLedger,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
