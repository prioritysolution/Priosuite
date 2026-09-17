import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getGrpInstDataAPI = async (orgId, type, memberNo) => {
  let data = {
    url: endPoints.GetGrpInstData(orgId, type, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const GetGrpDesigDataAPI = async (orgId) => {
  let data = {
    url: endPoints.GetInstDesig(orgId),
  };
  let res = await doGetApiCall(data);
  return res;
};

export const GetEcsAccountDataAPI = async (orgId, memb_id) => {
  let data = {
    url: endPoints.GetEcsAccount(orgId, memb_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const PostMapGrpInstMember = async (bodydata) => {
  let data = {
    url: endPoints.PostMapGrpInstMember,
    bodyData: bodydata,
  };
  let res = await doPostApiCall(data);
  return res;
};

export const UpdateMapMemberAPI = async (bodydata) => {
  let data = {
    url: endPoints.UpdateMapMember,
    bodyData: bodydata,
  };
  let res = await doPutApiCall(data);
  return res;
};

export const DeleteMapMemberAPI = async (bodydata) => {
  let data = {
    url: endPoints.DeleteMapMember,
    bodyData: bodydata,
  };
  let res = await doPutApiCall(data);
  return res;
};
