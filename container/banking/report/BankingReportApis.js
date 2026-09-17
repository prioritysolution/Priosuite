import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBankReportTypeAPI = async () => {
  let data = {
    url: endPoints.getBankReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBankReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate
) => {
  let url = null;

  switch (type) {
    case "113":
      url = endPoints.getBankReportDetailedListData(
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
