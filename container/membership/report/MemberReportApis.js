import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getMembershipReportTypeAPI = async () => {
  let data = {
    url: endPoints.getMemberReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMemberReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate,
  memberId,
) => {
  let url = null;

  switch (type) {
    case "100":
      url = endPoints.getMemberReportMemberRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        memberId,
      );
      break;
    case "101":
      url = endPoints.getMemberReportTransRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        memberId,
      );
      break;
    case "102":
      url = endPoints.getMemberReportWithdrawnRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        memberId,
      );
      break;
    case "103":
      url = endPoints.getMemberReportDetailedListData(
        orgId,
        branchId,
        fromDate,
        toDate,
        memberId,
      );
      break;
    case "104":
      url = endPoints.getMemberReportDividendListData(
        orgId,
        branchId,
        fromDate,
        toDate,
        memberId,
      );
      break;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getTransactionShareReceiptAPI = async (orgId, transId, date) => {
  let data = {
    url: endPoints.getTransactionShareReceipt(orgId, transId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
