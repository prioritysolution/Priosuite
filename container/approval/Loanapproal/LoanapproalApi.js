import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanListAPI = async (orgId, branchId) => {
  return await doGetApiCall({
    url: endPoints.LoanGetList(orgId, branchId),
  });
};

export const getLoanDetailsAPI = async (orgId, applId, branch_id) => {
  return await doGetApiCall({
    url: endPoints.LoanGetDetails(orgId, applId, branch_id),
  });
};

export const GetDeductionListAPI = async (orgId, prodid, amt, mode, share_bal, mem_id, date) => {
  return await doGetApiCall({
    url: endPoints.GetDeductionList(orgId, prodid, amt, mode, share_bal, mem_id, date),
  });
};

export const LoanApprvRejectAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.LoanApprvReject,
    bodyData: data,
  });
};
