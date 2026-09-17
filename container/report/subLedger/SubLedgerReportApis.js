import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getSubLedgerReportAPI = async (
  orgId,
  subLedgerId,
  fromDate,
  toDate,
) => {
  let data = {
    url: endPoints.getSubLedgerReport(orgId, subLedgerId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
