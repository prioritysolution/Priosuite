import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postLoanMemberInfoAPI = async (orgId, memberNo, date) => {
  let data = {
    url: endPoints.getLoanMemberInfo(orgId, memberNo, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanProductDataAPI = async (orgId, typeId) => {
  let data = {
    url: endPoints.getLoanProductData(orgId, typeId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCheckLoanEligibleAPI = async (
  orgId,
  prodId,
  memberId,
  date,
) => {
  let data = {
    url: endPoints.getCheckLoanEligible(orgId, prodId, memberId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCheckLoanSecurityAPI = async (
  orgId,
  prodId,
  memberId,
  date,
) => {
  let data = {
    url: endPoints.getCheckLoanSecurity(orgId, prodId, memberId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanSecurityProductAPI = async (orgId, memberId, date) => {
  let data = {
    url: endPoints.getLoanSecurityProduct(orgId, memberId, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanDurationUnitAPI = async (prodId, orgId) => {
  let data = {
    url: endPoints.getLoanDurationUnitData(prodId, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCheckLoanDurationUnitDataAPI = async (
  orgId,
  prodId,
  duration,
  durationUnit,
) => {
  let data = {
    url: endPoints.getCheckLoanDurationUnitData(
      orgId,
      prodId,
      duration,
      durationUnit,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanRepaymentModeAPI = async (prodId, orgId) => {
  let data = {
    url: endPoints.getLoanRepaymentModeData(prodId, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanInterestRateAPI = async (orgId, prodId) => {
  let data = {
    url: endPoints.getLoanInterestRate(orgId, prodId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanEmiAPI = async (orgId, principal, roi, duration) => {
  let data = {
    url: endPoints.getLoanEmi(orgId, principal, roi, duration),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postCheckLoanAmountAPI = async (orgId, productId, amount) => {
  let data = {
    url: endPoints.checkLoanAmount(orgId, productId, amount),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postLoanApplicationAPI = async (bodyData) => {
  let data = {
    url: endPoints.addLoanApplication,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const GetProdTypeAPI = async (org_id) => {
  let data = {
    url: endPoints.GetProdType(org_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const GetCheckProdEligibleAPI = async (orgId, prodId, custType) => {
  let data = {
    url: endPoints.GetCheckProdEligible(orgId, prodId, custType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getGrpInstDataAPI = async (orgId, type, memberNo) => {
  let data = {
    url: endPoints.GetGrpInstData(orgId, type, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanPurposeAPI = async (org_id) => {
  let data = {
    url: endPoints.GetLoanPurpose(org_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanEcsAccountAPI = async (orgId, memberId) => {
  let data = {
    url: endPoints.getDepositEcsAccount(orgId, memberId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDeductionListAPI = async (
  orgId,
  prodId,
  amt,
  mode,
  share_bal,
  mem_id,
  date,
) => {
  let data = {
    url: endPoints.GetDeductionList(
      orgId,
      prodId,
      amt,
      mode,
      share_bal,
      mem_id,
      date,
    ),
  };
  let res = await doGetApiCall(data);
  return res;
};

export const getSecurityTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.GetSecurityType(orgId),
  };
  let res = await doGetApiCall(data);
  return res;
};
