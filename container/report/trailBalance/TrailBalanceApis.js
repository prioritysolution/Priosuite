import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getTrailBalanceReportAPI = async (
  orgId,
  branchId,
  fromDate,
  toDate
) => {
  let data = {
    url: endPoints.getTrailBalanceReport(orgId, branchId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
