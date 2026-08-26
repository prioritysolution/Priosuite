import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postDepositInterestSetupAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositInterestSetup,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
