import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getPassbookPrintAPI = async (orgId, accountNo, date, sl, mode, prodId) => {
  let data = {
    url: endPoints.getDepositPassbookPrint(orgId, accountNo, date, sl, mode, prodId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const updatePassbookTransAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateDepositPassbookTrans,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
