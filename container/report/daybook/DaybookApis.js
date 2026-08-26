import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDaybookReportAPI = async (orgId, branchId, date) => {
  let data = {
    url: endPoints.getDaybookReport(orgId, branchId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getReportVoucherListAPI = async (
  orgId,
  branchId,
  fromDate,
  toDate,
  mode,
  ledgerId,
  page,
) => {
  let data = {
    url: endPoints.getReportVoucherList(
      orgId,
      branchId,
      fromDate,
      toDate,
      mode,
      ledgerId,
      page,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getReportVoucherDetailsAPI = async (orgId, txnId) => {
  let data = {
    url: endPoints.getReportVoucherDetails(orgId, txnId),
  };

  let res = await doGetApiCall(data);
  return res;
};
