import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getPassbookPrintAPI = async (orgId, accountNo, date, sl, mode) => {
  let data = {
    url: endPoints.getLoanPassbookPrint(orgId, accountNo, date, sl, mode),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const updatePassbookTransAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateLoanPassbookTrans,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
