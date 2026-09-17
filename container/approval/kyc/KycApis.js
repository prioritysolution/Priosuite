import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getKycApplicationListAPI = async (orgId, branchId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  return await doGetApiCall({
    url: `${baseUrl}/api/Org/ProcessApproval/Kyc/GetList?org_id=${orgId}&branch_id=${branchId}`,
  });
};

export const postKycApprovalAPI = async (data) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  return await doPutApiCall({
    url: `${baseUrl}/api/Org/ProcessApproval.Kyc/ApprvApplication`,
    bodyData: data,
  });
};

export const updateMemberProfileAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.updateMemberProfile,
    bodyData: data,
  });
};

export const updateGroupProfileAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.groupProfileUpdate(),
    bodyData: data,
  });
};

export const updateInstitutionProfileAPI = async (data) => {
  return await doPutApiCall({
    url: endPoints.getInstitutionProfileUpdate(),
    bodyData: data,
  });
};

export const getMemberTypeAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getMemberType(orgId) });
export const getRelationTypeAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getRelationTypeData(orgId) });
export const getGenderAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getGenderData(orgId) });
export const getCasteAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getCasteData(orgId) });
export const getReligionAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getReligionData(orgId) });
export const getGroupTypeAPI = async (orgId) =>
  await doGetApiCall({ url: endPoints.getGroupType(orgId) });

export const getStateAPI = async (orgId) => {
  return await doGetApiCall({ url: endPoints.getMasterStateData(orgId) });
};

export const getDistrictAPI = async (stateId, orgId) => {
  return await doGetApiCall({
    url: endPoints.getMasterDistrictUnderStateData(stateId, orgId),
  });
};

export const getBlockAPI = async (orgId, distId, stateId) => {
  return await doGetApiCall({
    url: endPoints.getMasterBlockUnderDistrictData(orgId, distId, stateId),
  });
};

export const getPoliceStationAPI = async (orgId, distId) => {
  return await doGetApiCall({
    url: endPoints.getMasterPoliceStationUnderDistrictData(orgId, distId),
  });
};

export const getPostOfficeAPI = async (orgId, distId) => {
  return await doGetApiCall({
    url: endPoints.getMasterPostOfficeUnderDistrictData(orgId, distId),
  });
};

export const getVillageAPI = async (orgId, blockId) => {
  return await doGetApiCall({
    url: endPoints.getMasterVillageUnderBlockData(orgId, blockId),
  });
};
