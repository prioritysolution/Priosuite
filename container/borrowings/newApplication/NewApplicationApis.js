import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBorrowingProductRepayLedgerDataAPI = async (type, orgId) => {
  let url = null;

  switch (type) {
    case "PRODUCTTYPE":
      url = endPoints.getBorrowingsProductType(orgId);
      break;
    case "REPAYMODE":
      url = endPoints.getBorrowingsRepayMode(orgId);
      break;
    case "PRINCIPALLEGDER":
      url = endPoints.getBorrowingsLedgerData(orgId, 1);
      break;
    case "INTERESTLEDGER":
      url = endPoints.getBorrowingsLedgerData(orgId, 2);
      break;
    default:
      url = null;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const addBorrowingsNewApplicationAPI = async (bodyData) => {
  let data = {
    url: endPoints.addBorrowingsNewApplication,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
