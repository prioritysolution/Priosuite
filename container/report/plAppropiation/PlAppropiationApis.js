import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getPlAppropiationReportAPI = async (orgId, branchId, toDate) => {
  let data = {
    url: endPoints.getPlAppropiationReport(orgId, branchId, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
