import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const BorrowingsGetListAPI = (orgId, branchId) => {
  return doGetApiCall({
    url: endPoints.BorrowingsGetList(orgId, branchId),
  });
};

export const BorrowingsApprvRejectAPI = (data) => {
  return doPutApiCall({
    url: endPoints.BorrowingsApprvReject,
    bodyData: data,
  });
};
