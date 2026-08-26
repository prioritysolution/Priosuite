import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOpeningLedgerBranchAPI = async (orgId, branchId) => {
  let data = {
    url: endPoints.getOpeningLedgerBranch(orgId, branchId),
  };

  let res = await doGetApiCall(data);
  return res;
};
