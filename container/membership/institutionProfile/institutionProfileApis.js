import {
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "../../../utils/apiConfig";
import { endPoints } from "../../../utils/endPoints";

export const getInstitutionProfileAPI = async (type) => {
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

export const getUpdateInstitutionDataByIdAPI = async (orgId, memberNo) => {
  const data = {
    url: endPoints.getUpdateMemberDataById(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postInstitutionProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.postInstitutionProfile,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateInstitutionProfileAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateMemberProfile,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};



// this is my code
export const getInstitutionProfileDataById = async (orgId, memberNo) => {
  const data = {
    url: endPoints.getInstitutionProfileData(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const updateInstitutionProfile = async (bodyData)=>{
  const data={
    url:endPoints.getInstitutionProfileUpdate(),
    bodyData
  }
  let res= await doPutApiCall(data);
  return res;
}
