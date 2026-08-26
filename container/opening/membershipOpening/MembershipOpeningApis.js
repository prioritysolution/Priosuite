import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getOpeningMemberDataByIdAPI = async (orgId, memberNo) => {
  let data = {
    url: endPoints.getOpeningMemberDataById(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postOpeningMembershipAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningMembership,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
