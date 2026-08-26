import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getAccountLedgerDataAPI = async () => {
  let data = {
    url: endPoints.getAccountLedgerDataReport,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getAccountLedgerReportAPI = async (
  orgId,
  branchId,
  fromDate,
  toDate,
  ledgerId
) => {
  let data = {
    url: endPoints.getAccountLedgerReport(
      orgId,
      branchId,
      fromDate,
      toDate,
      ledgerId
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};
