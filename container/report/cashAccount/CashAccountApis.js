import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getCashAccountReportAPI = async (
  orgId,
  branchId,
  fromDate,
  toDate,
  mode
) => {
  let data = {
    url: endPoints.getCashAccountReport(orgId, branchId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
