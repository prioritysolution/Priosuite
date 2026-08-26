import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getCertificatePrintAPI = async (orgId, accountNo) => {
  let data = {
    url: endPoints.getDepositCertificatePrint(orgId, accountNo),
  };

  let res = await doGetApiCall(data);
  return res;
};
