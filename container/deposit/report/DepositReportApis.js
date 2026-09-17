import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositReportProductTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositReportProductType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositReportTypeAPI = async () => {
  let data = {
    url: endPoints.getDepositReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate,
  productId,
) => {
  let url = null;

  switch (type) {
    case "105":
      url = endPoints.getDepositReportOpeningRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "106":
      url = endPoints.getDepositReportTransRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "107":
      url = endPoints.getDepositReportCloseRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "108":
      url = endPoints.getDepositReportDetailedListData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "109":
      url = endPoints.getDepositReportInterestListData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getTransactionDepositReceiptAPI = async (orgId, transId, date) => {
  let data = {
    url: endPoints.getTransactionDepositReceipt(orgId, transId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
