import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getGlBalancingAPI = async (orgId, branchId, date) => {
  let data = {
    url: endPoints.getGlBalancingReport(orgId, branchId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
