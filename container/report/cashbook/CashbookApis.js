import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getCashbookReportAPI = async (orgId, branchId, date) => {
  let data = {
    url: endPoints.getCashbookReport(orgId, branchId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
