import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBranchListAPI = async (orgId, branchId) => {
  return doGetApiCall({
    url: endPoints.getOpeningLedgerBranch(orgId, branchId),
  });
};

export const postLogoutAPI = async () => {
  let data = {
    url: endPoints.logout,
  };

  const res = await doPostApiCall(data);
  return res;
};
