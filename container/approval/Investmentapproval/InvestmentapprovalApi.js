import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const InvestmentApprovalGetListAPI = (org_id, branch_id) => {
  return doGetApiCall({
    url: endPoints.InvestmentApprovalGetList(org_id, branch_id),
  });
};

export const InvestmentApprovalGetDetailsAPI = (org_id, type_id, type) => {
  return doGetApiCall({
    url: endPoints.InvestmentApprovalGetDetails(org_id, type_id, type),
  });
};

export const InvestmentApprovalApprvRejectAPI = (data) => {
  return doPutApiCall({
    url: endPoints.InvestmentApprovalApprvReject,
    bodyData: data,
  });
};
