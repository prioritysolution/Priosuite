import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getProfitLossReportAPI = async (
  orgId,
  branchId,
  fromDate,
  toDate
) => {
  let data = {
    url: endPoints.getProfitLossReport(orgId, branchId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
