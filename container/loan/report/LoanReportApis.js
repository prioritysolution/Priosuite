import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanReportTypeAPI = async () => {
  let data = {
    url: endPoints.getLoanReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate,
  productId,
) => {
  let url = null;

  switch (type) {
    case "110":
      url = endPoints.getLoanReportDisburseRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "111":
      url = endPoints.getLoanReportRepayRegisterData(
        orgId,
        branchId,
        fromDate,
        toDate,
        productId,
      );
      break;
    case "112":
      url = endPoints.getLoanReportDetailedListData(
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

export const getLoanRepaymentCollectionReceiptAPI = async (orgId, transId) => {
  let data = {
    url: endPoints.getLoanRepaymentCollectionReceipt(orgId, transId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const LoanGetProductAPI = async (orgId) => {
  let url = endPoints.LoanGetProduct(orgId);

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};
