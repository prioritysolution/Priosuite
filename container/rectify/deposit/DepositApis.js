import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositDataByIdAPI = async (
  orgId,
  accountNo,
  date,
  type,
  prodId
) => {
  let data = {
    url: endPoints.getRectifyDepositDataById(
      orgId,
      accountNo,
      date,
      type,
      prodId
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getRectifyTypeAPI = async () => {
  let data = {
    url: endPoints.getDepositRectifyType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositAPI = async (bodyData) => {
  let data = {
    url: endPoints.addRectifyDeposit,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
