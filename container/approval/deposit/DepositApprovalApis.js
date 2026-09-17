import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositApprovalListAPI = async (orgId, branchId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  return await doGetApiCall({
    url: `${baseUrl}/api/Org/ProcessApproval/Deposit/GetList?org_id=${orgId}&branch_id=${branchId}`,
  });
};

// New: Get Details API
export const getDepositDetailsAPI = async (vouchId, orgId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  return await doGetApiCall({
    url: `${baseUrl}/api/Org/ProcessApproval/Deposit/GetDetails?vouch_id=${vouchId}&org_id=${orgId}`,
  });
};

// New: Approve/Reject API
export const postDepositApprvRejectAPI = async (data) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  return await doPutApiCall({
    url: `${baseUrl}/api/Org/ProcessApproval/Deposit/ApprvReject`,
    bodyData: data,
  });
};

export const getSpecimenAPI = async (orgId, acctId) => {
  return await doGetApiCall({
    url: endPoints.getSpecimen(orgId, acctId),
  });
};
