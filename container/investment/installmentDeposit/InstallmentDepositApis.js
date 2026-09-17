import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postInvestmentInstallmentDepositAPI = async (bodyData) => {
  let data = {
    url: endPoints.addInvestmentInstallmentDeposit,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
