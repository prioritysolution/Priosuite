import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postMasterOperationalAPI = async (bodyData, type) => {
  let url = null;

  switch (type) {
    case "STATE":
      url = endPoints.addMasterState;
      break;
    case "DISTRICT":
      url = endPoints.addMasterDistrict;
      break;
    case "BLOCK":
      url = endPoints.addMasterBlock;
      break;
    case "POLICESTATION":
      url = endPoints.addMasterPoliceStation;
      break;
    case "POSTOFFICE":
      url = endPoints.addMasterPostOffice;
      break;
    case "VILLAGE":
      url = endPoints.addMasterVillage;
      break;
    case "UNIT":
      url = endPoints.addMasterUnit;
      break;
    default:
      url = null;
  }

  let data = {
    url,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateMasterOperationalAPI = async (bodyData, type) => {
  let url = null;

  switch (type) {
    case "STATE":
      url = endPoints.updateMasterState;
      break;
    case "DISTRICT":
      url = endPoints.updateMasterDistrict;
      break;
    case "BLOCK":
      url = endPoints.updateMasterBlock;
      break;
    case "POLICESTATION":
      url = endPoints.updateMasterPoliceStation;
      break;
    case "POSTOFFICE":
      url = endPoints.updateMasterPostOffice;
      break;
    case "VILLAGE":
      url = endPoints.updateMasterVillage;
      break;
    case "UNIT":
      url = endPoints.updateMasterUnit;
      break;
    default:
      url = null;
  }

  let data = {
    url,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getMasterOperationalAPI = async (id, type, page, keyword = "") => {
  let url = null;

  switch (type) {
    case "STATE":
      url = endPoints.getMasterStateData(id);
      break;
    case "DISTRICT":
      url = endPoints.getMasterDistrictData(id, page);
      break;
    case "BLOCK":
      url = endPoints.getMasterBlockData(id, page);
      break;
    case "POLICESTATION":
      url = endPoints.getMasterPoliceStationData(id, page);
      break;
    case "POSTOFFICE":
      url = endPoints.getMasterPostOfficeData(id, page);
      break;
    case "VILLAGE":
      url = endPoints.getMasterVillageData(id, page);
      break;
    case "UNIT":
      url = endPoints.getMasterUnitData(id, page, keyword);
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

export const getMasterDistrictUnderStateAPI = async (stateId, orgId) => {
  let data = {
    url: endPoints.getMasterDistrictUnderStateData(stateId, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMasterBlockUnderDistrictAPI = async (
  orgId,
  distId,
  stateId
) => {
  let data = {
    url: endPoints.getMasterBlockUnderDistrictData(orgId, distId, stateId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMasterPoliceStationUnderDistrictAPI = async (orgId, distId) => {
  let data = {
    url: endPoints.getMasterPoliceStationUnderDistrictData(orgId, distId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMasterPostOfficeUnderDistrictAPI = async (orgId, distId) => {
  let data = {
    url: endPoints.getMasterPostOfficeUnderDistrictData(orgId, distId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMasterVillageUnderBlockAPI = async (orgId, blockId) => {
  let data = {
    url: endPoints.getMasterVillageUnderBlockData(orgId, blockId),
  };

  let res = await doGetApiCall(data);
  return res;
};
