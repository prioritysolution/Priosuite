import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getMembershipApprovalListAPI = async (orgId, branchId) => {
    return await doGetApiCall({
        url: `${baseUrl}/api/Org/ProcessApproval/Membership/GetList?org_id=${orgId}&branch_id=${branchId}`,
    });
};

export const getMembershipDetailsAPI = async (vouchId, orgId) => {
    return await doGetApiCall({
        url: `${baseUrl}/api/Org/ProcessApproval/Membership/GetDtls?vouch_id=${vouchId}&org_id=${orgId}`,
    });
};

export const postMembershipApproveRejectAPI = async (data) => {
    return await doPutApiCall({
        url: `${baseUrl}/api/Org/ProcessApproval/Transactions/ApprvReject`,
        bodyData: data,
    });
};