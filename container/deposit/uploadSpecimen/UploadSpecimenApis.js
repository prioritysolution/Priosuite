import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postUploadSpecimenAPI = async (bodyData, content) => {
  let data = {
    url: endPoints.addUploadSpecimen,
    bodyData,
  };

  let res = await doPostApiCall(data, content);
  return res;
};
