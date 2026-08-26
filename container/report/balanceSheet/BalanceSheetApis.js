import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBalanceSheetReportAPI = async (orgId, branchId, toDate) => {
  let data = {
    url: endPoints.getBalanceSheetReport(orgId, branchId, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
