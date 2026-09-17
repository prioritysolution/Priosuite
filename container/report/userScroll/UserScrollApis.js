import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getUserScrollAPI = async (orgId, branchId, date, userId) => {
  let data = {
    url: endPoints.getUserScrollReport(orgId, branchId, date, userId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getScrollUserListAPI = async (orgId, branchId) => {
  let data = {
    url: endPoints.getScrollUserList(orgId, branchId),
  };

  let res = await doGetApiCall(data);
  return res;
};
