import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanGenerateScheduleAPI = async (orgId, acctNo) => {
  let data = {
    url: endPoints.getLoanGenerateSchedule(orgId, acctNo),
  };

  let res = await doGetApiCall(data);
  return res;
};
