import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const VoucherGetListAPI = (org_id, branch_id) => {
  return doGetApiCall({
    url: endPoints.VoucherGetList(org_id, branch_id),
  });
};
export const VoucherGetDetailsAPI = async (org_id, type_id) => {
  return await doGetApiCall({
    url: endPoints.VoucherGetDetails(org_id, type_id),
  });
};

export const VoucherApprvRejectAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.VoucherApprvReject,
    bodyData: data,
  });
};
