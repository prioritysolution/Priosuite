import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getMemberTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getMemberTypeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getShareProductDetailsAPI = async (orgId, prodId) => {
  let data = {
    url: endPoints.getShareProductDetails(orgId, prodId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postShareProductAPI = async (bodyData) => {
  let data = {
    url: endPoints.addShareProduct,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
