import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDisburseListAPI = async (orgId, branchId,date) => {
  let data = {
    url: endPoints.getDisburseList(orgId, branchId,date),
  };

  let res = await doGetApiCall(data);
  return res;
};

// export const getLoanShareDepositBalanceAPI = async (
//   orgId,
//   prodId,
//   memberId,
//   date
// ) => {
//   let data = {
//     url: endPoints.getLoanShareDepositBalance(orgId, prodId, memberId, date),
//   };
// 
//   let res = await doGetApiCall(data);
//   return res;
// };
// 
// export const getLoanDisburseNeedAmountAPI = async (
//   orgId,
//   prodId,
//   memberId,
//   date,
//   shareBal,
//   disbAmount
// ) => {
//   let data = {
//     url: endPoints.getLoanDisburseNeedAmount(
//       orgId,
//       prodId,
//       memberId,
//       date,
//       shareBal,
//       disbAmount
//     ),
//   };
// 
//   let res = await doGetApiCall(data);
//   return res;
// };

export const postLoanDisburseAPI = async (bodyData) => {
  let data = {
    url: endPoints.addLoanDisburse,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getDeductionListAPI = async (orgId, prodid, amt, mode, share_bal, mem_id, date) => {
  let data = {
    url: endPoints.GetDeductionList(orgId, prodid, amt, mode, share_bal, mem_id, date),
  };
  return await doGetApiCall(data);
};
