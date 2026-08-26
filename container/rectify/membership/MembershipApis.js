import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getMembershipDataByIdAPI = async (orgId, memberNo, date, type) => {
  let data = {
    url: endPoints.getRectifyMembershipDataById(orgId, memberNo, date, type),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getRectifyTypeAPI = async () => {
  let data = {
    url: endPoints.getMembershipRectifyType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postMembershipAPI = async (bodyData) => {
  let data = {
    url: endPoints.addRectifyMembership,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
