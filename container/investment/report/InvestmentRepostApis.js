import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getInvestmentReportTypeAPI = async () => {
  let data = {
    url: endPoints.getInvestmentReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getInvestmentReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate
) => {
  let url = null;

  switch (type) {
    case "114":
      url = endPoints.getInvestmentReportDetailedListData(
        orgId,
        branchId,
        fromDate,
        toDate
      );
      break;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};
