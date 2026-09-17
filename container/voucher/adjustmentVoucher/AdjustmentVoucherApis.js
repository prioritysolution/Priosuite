import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postAdjustmentVoucherAPI = async (bodyData) => {
  let data = {
    url: endPoints.addAdjustmentVoucher,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getAdjustmentVoucherLedgerListAPI = async () => {
  let data = {
    url: endPoints.getAdjustmentVoucherLedgerList,
  };

  let res = await doGetApiCall(data);
  return res;
};
