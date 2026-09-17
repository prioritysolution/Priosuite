import {
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "../../../utils/apiConfig";
import { endPoints } from "../../../utils/endPoints";

export const getMemberProfileAPI = async (type, orgId) => {
  let url = null;
  switch (type) {
    case "RELATIONTYPE":
      url = endPoints.getRelationTypeData(orgId);
      break;
    case "GENDER":
      url = endPoints.getGenderData(orgId);
      break;
    case "CASTE":
      url = endPoints.getCasteData(orgId);
      break;
    case "RELIGION":
      url = endPoints.getReligionData(orgId);
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

export const getUpdateMemberDataByIdAPI = async (orgId, memberNo) => {
  const data = {
    url: endPoints.getUpdateMemberDataById(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postMemberProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.postMemberProfile,
    bodyData,
  };

  let res = await doPostApiCall(data);
  console.log("MemberProfileAPI res=", res);
  return res;
};

export const updateMemberProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateMemberProfile,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getMemberTypeDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getMemberTypeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMemberTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getMemberType(orgId),
  };
  let res = await doGetApiCall(data);
  return res;
};
