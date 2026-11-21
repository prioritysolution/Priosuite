import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postDepositInterestSetupAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositInterestSetup,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getDepositIntSlabListAPI = async (
  orgId,
  prodId = 0,
  page = 1,
  pageSize = 25,
) => {
  return await doGetApiCall({
    url: endPoints.getDepositIntSlabList(orgId, prodId, page, pageSize),
  });
};

export const updateDepositIntSlabAPI = async (bodyData) => {
  return await doPutApiCall({
    url: endPoints.updateDepositIntSlab,
    bodyData,
  });
};
