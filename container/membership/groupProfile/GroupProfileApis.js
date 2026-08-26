import {
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "../../../utils/apiConfig";
import { endPoints } from "../../../utils/endPoints";

export const getGroupProfileAPI = async (type) => {
  let url = null;
  switch (type) {
    case "RELATIONTYPE":
      url = endPoints.getRelationTypeData;
      break;
    case "GENDER":
      url = endPoints.getGenderData;
      break;
    case "CASTE":
      url = endPoints.getCasteData;
      break;
    case "RELIGION":
      url = endPoints.getReligionData;
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

export const getUpdateGroupDataByIdAPI = async (orgId, memberNo) => {
  const data = {
    url: endPoints.getUpdateMemberDataById(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

// This is my code
export const getGroupUpdateDataById = async (orgId, memberNo) => {
  const data = {
    url: endPoints.getGroupUpdateData(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

// update the group profile
export const updateTheGroupProfile = async (bodyData)=>{
  const data={
    url:endPoints.groupProfileUpdate(),
    bodyData
  }
  let res= await doPutApiCall(data);
  return res;
}










export const postGroupProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.postGroupProfile,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateGroupProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateMemberProfile,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getGroupTypeDataApi = async (orgId) => {
  let data = {
    url: endPoints.getGroupType(orgId),
  };

  let res = await doGetApiCall(data);

  console.log("getGroupTypeDataApi", res);
  return res;
};



