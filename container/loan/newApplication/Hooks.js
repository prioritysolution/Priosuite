"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getCheckLoanDurationUnitDataAPI,
  getCheckLoanEligibleAPI,
  getCheckLoanSecurityAPI,
  GetCheckProdEligibleAPI,
  getGrpInstDataAPI,
  getLoanDurationUnitAPI,
  getLoanEmiAPI,
  getLoanInterestRateAPI,
  getLoanProductDataAPI,
  getLoanPurposeAPI,
  getLoanRepaymentModeAPI,
  getLoanSecurityProductAPI,
  GetProdTypeAPI,
  postCheckLoanAmountAPI,
  postLoanApplicationAPI,
  postLoanMemberInfoAPI,
  getLoanEcsAccountAPI,
  getDeductionListAPI,
  getSecurityTypeAPI,
} from "./NewApplicationApis";

import {
  getCheckBalanceAPI,
  getMemberDataByIdAPI,
  getCashDenomAPI,
} from "@/container/membership/issueMembership/IssueMembershipApis";

import { getNoteDenomData } from "@/container/membership/issueMembership/IssueMembershipReducer";

import {
  getDurationUnitData,
  getLoanProductData,
  getLoanPurposeData,
  getProdTypeData,
  getRepaymentModeData,
  getSecurityData,
  getEcsAccountData,
  setCurrentProductType,
  setDeductionList,
  setEcsAccountNo,
} from "./NewApplicationReducer";
import { addDays, addMonths, format, parse } from "date-fns";

const alphanumericWithHyphenUnderscoreRegex = /^[a-zA-Z0-9-_]*$/;

const parseDateHelper = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;

  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
      if (parts[2].split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

export const useNewApplication = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");
  const beg_date = getCookieData("beg_date");

  const [resetTrigger, setResetTrigger] = useState(0);
  const [resetGuaranteeMember, setResetGuaranteeMember] = useState(0);

  const [loading, setLoading] = useState(false);
  const [postNewLoanLoading, setPostNewLoanLoading] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [loanMemberProduct, setLoanMemberProduct] = useState(null);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [loanEligible, setLoanEligible] = useState(false);

  const [guaranteeMemberDetails, setGuaranteeMemberDetails] = useState(null);

  // const [checkDepositAmountDisable, setCheckDepositAmountDisable] =
  //   useState(false);
  // const [allowProcessDeposit, setAllowProcessDeposit] = useState(true);

  const [securityTable, setSecurityTable] = useState([]);
  const [guaranteeTable, setGuaranteeTable] = useState([]);

  const [disableSecurityType, setDisableSecurityType] = useState(false);
  const [externalSecurityTypes, setExternalSecurityTypes] = useState([]);

  const [showEmi, setShowEmi] = useState(false);

  // Group related state
  const [getGroupLoading, setGetGroupLoading] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // cash Transaction Total
  const [cashInTransactionTotal, setCashInTransactionTotal] = useState([]);
  const [cashOutTransactionTotal, setCashOutTransactionTotal] = useState([]);

  const [cashInTransactionGrandTotal, setCashInTransactionGrandTotal] =
    useState(0);

  const [cashOutTransactionGrandTotal, setCashOutTransactionGrandTotal] =
    useState(0);

  const [cashInDenomArray, setCashInDenomArray] = useState([]);
  const [cashOutDenomArray, setCashOutDenomArray] = useState([]);

  // Denominator states
  const [inDenominators, setInDenominators] = useState([]);
  const [outDenominators, setOutDenominators] = useState([]);

  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const productData = useSelector(
    (state) => state?.newApplication?.loanProductData,
  );

  const deductionList = useSelector(
    (state) => state?.newApplication?.DeductionList,
  );

  const ecsAccountData = useSelector(
    (state) => state?.newApplication?.ecsAccountData,
  );

  const formSchema = yup.object({
    memberName: yup.string().nullable(),
    memberId: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    memberType: yup.string().nullable(),
    shareBalance: yup.string().nullable(),
    applicationDate: yup.string().nullable(),
    sanctionDate: yup
      .string()
      .required("Sanction date is required")
      .test(
        "is-after-application",
        "Sanction date must be greater than or equal to application date",
        function (value) {
          const { applicationDate } = this.parent;
          if (!applicationDate || !value) return true; // skip if either is missing

          return value >= applicationDate;
        },
      ),
    applicationNo: yup.string().required("Manual application no. is required"),
    accountNo: yup.string().nullable(),
    ledgFolio: yup.string().nullable(),
    productId: yup.string().required("Product is required"),
    applicationAmount: yup.string().required("Application amount is required"),
    rateOfInterest: yup.string().required("Rate of interest is required"),
    duration: yup.string().required("Duration is required"),
    durationUnit: yup.string().required("Duration unit is required"),
    repaymentMode: yup.string().required("Repayment mode is required"),
    finalRepaymentDate: yup.string().nullable(),
    emiAmount: yup.string().nullable(),
    securityOption: yup.string().nullable(),
    securityType: yup.string().nullable(),
    securityAccount: yup.string().nullable(),
    maxAllow: yup.string().nullable(),
    maxLoanAmount: yup.string().nullable(),
    certificateType: yup.string().nullable(),
    certificateNumber: yup.string().nullable(),
    issueDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    issueAmount: yup.string().nullable(),
    roi: yup.string().nullable(),
    maturityDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    maturityAmount: yup.string().nullable(),
    guaranteeName: yup.string().nullable(),
    guaranteeGuardianName: yup.string().nullable(),
    guaranteeAddress: yup.string().nullable(),
    BranchId: yup.string().nullable(),
    branchName: yup.string().nullable(),
    CustType: yup.string().nullable(),
    // operationMode: yup.string().nullable(),
    productTypeId: yup.string().required("Product Type is Required"),
    dialougeMemberName: yup.string().nullable(),
    jointHolderDetails: yup
      .array()
      .transform((value) => (value === "" ? [] : value)),
    // .test(
    //   "min-1-child-if-71-or-72",
    //   "At least one joint member is required",
    // function (value) {
    //   const { operationMode } = this.parent;
    //   const arrayValue = Array.isArray(value) ? value : [];
    //   if ((operationMode === "71" || operationMode === "72") && arrayValue.length < 1) {
    //     return false;
    //   }
    //   return true;
    // },
    // )
    CustomerType: yup.string().nullable(),
    externalSecurityType: yup.string().nullable(),
    extTypeName: yup.string().nullable(),
    extPropertyLocation: yup.string().nullable(),
    extPropertyArea: yup.string().nullable(),
    extOwnerName: yup.string().nullable(),
    extCoOwnerName: yup.string().nullable(),
    extPropertyDetails: yup.string().nullable(),
    extLatitude: yup.string().nullable(),
    extLongitude: yup.string().nullable(),
    extSecurityValue: yup.string().nullable(),
    extItemName: yup.string().nullable(),
    extItemDetails: yup.string().nullable(),
    extItemBrand: yup.string().nullable(),
    extItemCost: yup.string().nullable(),
    extOwnContribution: yup.string().nullable(),
    extDetails: yup.string().nullable(),
    projectName: yup.string().nullable(),
    projectcost: yup.string().nullable(),
    projectowncont: yup.string().nullable(),
    projectmouza: yup.string().nullable(),
    projectplotno: yup.string().nullable(),
    projectland: yup.string().nullable(),
    projecthypothicated: yup.string().nullable(),
    projectincome: yup.string().nullable(),
    member_info: yup.array().nullable(),
    loanPurpose: yup.string().required("Loan Purpose is Required"),
    isAvailEcs: yup.boolean(),
    ecsAccount: yup
      .string()
      .test(
        "ecsAccount-required",
        "ECS account is required when ECS is available",
        function (value) {
          const { isAvailEcs } = this.parent;
          if (isAvailEcs && (!value || value.trim() === "")) {
            return false;
          }
          return true;
        },
      ),

    transMode: yup.string().required("Transaction mode is required"),
    bank: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test(
        "is-valid-ref-vouch-no",
        "Reference voucher number is invalid",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberName: "",
      memberId: "",
      gurdianName: "",
      address: "",
      mobile: "",
      memberType: "",
      shareBalance: "",
      applicationDate: "",
      sanctionDate: "",
      applicationNo: "",
      accountNo: "",
      ledgFolio: "",
      productId: "",
      securityOption: "",
      securityType: "E",
      securityAccount: "",
      applicationAmount: "",
      rateOfInterest: "",
      duration: "",
      durationUnit: "",
      repaymentMode: "",
      finalRepaymentDate: "",
      emiAmount: "",
      certificateType: "",
      certificateNumber: "",
      issueAmount: "",
      roi: "",
      maturityAmount: "",
      guaranteeName: "",
      guaranteeGuardianName: "",
      guaranteeAddress: "",
      BranchId: "",
      branchName: "",
      CustType: "",
      productTypeId: "",
      dialougeMemberName: "",
      jointHolderDetails: [],
      CustomerType: "",
      projectName: "",
      projectcost: "",
      projectowncont: "",
      projectmouza: "",
      projectplotno: "",
      projectland: "",
      projecthypothicated: "",
      projectincome: "",
      // operationMode: "70",
      member_info: [],
      loanPurpose: "",
      isAvailEcs: false,
      ecsAccount: "",
      transMode: "cash",
      refVouchNo: "",
    },
  });

  const { control } = form;
  const {
    productId,
    productTypeId,
    applicationAmount,
    duration,
    durationUnit,
    rateOfInterest,
    maxAllow,
    securityType,
    CustomerType,
    isAvailEcs,
    // operationMode,
    ecsAccount,
    applicationDate,
    sanctionDate,
    jointHolderDetails,
    transMode,
    savings,
    savingsBalance,
  } = useWatch({
    control,
    name: [
      "productId",
      "productTypeId",
      "applicationAmount",
      "duration",
      "durationUnit",
      "rateOfInterest",
      "maxAllow",
      "securityType",
      // "operationMode",
      "jointHolderDetails",
      "isAvailEcs",
      "ecsAccount",
      "applicationDate",
      "sanctionDate",
      "transMode",
      "savings",
      "savingsBalance",
    ],
  });

  const getProdTypeDataApiCall = useCallback(
    async (org_id) => {
      setLoading(true);
      try {
        const res = await GetProdTypeAPI(org_id);
        if (res.message === "Data Found") {
          dispatch(getProdTypeData(res.details));
        } else {
          dispatch(getProdTypeData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(getProdTypeData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getLoanPurposeAPICall = useCallback(
    async (org_id) => {
      setLoading(true);
      try {
        const res = await getLoanPurposeAPI(org_id);
        if (res.message === "Data Found") {
          dispatch(getLoanPurposeData(res.details));
        } else {
          dispatch(getLoanPurposeData([]));
        }
      } catch (error) {
        console.error("Error in getLoanPurposeAPICall:", error);
        toast.error("Something went wrong");
        dispatch(getLoanPurposeData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getLoanEcsAccountApiCall = useCallback(
    async (orgId, memberId) => {
      setLoading(true);

      try {
        const res = await getLoanEcsAccountAPI(orgId, memberId);
        if (res.message === "Data Found") {
          // form.setValue("savingsName", res.details[0].Full_Name || "");
          dispatch(getEcsAccountData(res.details));
        } else {
          dispatch(getEcsAccountData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(getEcsAccountData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getLoanDurationUnitApiCall = useCallback(
    async (prodId, orgId) => {
      setLoading(true);
      try {
        const res = await getLoanDurationUnitAPI(prodId, orgId);
        if (res.message === "Data Found") {
          dispatch(getDurationUnitData(res.details));
        } else {
          dispatch(getDurationUnitData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(getDurationUnitData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getLoanRepaymentModeApiCall = useCallback(
    async (prodId, orgId) => {
      setLoading(true);
      try {
        const res = await getLoanRepaymentModeAPI(prodId, orgId);
        if (res.message === "Data Found") {
          dispatch(getRepaymentModeData(res.details));
        } else {
          dispatch(getRepaymentModeData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(getRepaymentModeData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  // const getLoanInterestRateApiCall = useCallback(
  //   async (orgId, prodId) => {
  //     setLoading(true);
  //     try {
  //       const res = await getLoanInterestRateAPI(orgId, prodId);
  //       if (res.message === "Data Found") {
  //         form.setValue("rateOfInterest", res.details[0].Roi || "");
  //       } else {
  //         form.setValue("rateOfInterest", "");
  //       }
  //     } catch (error) {
  //       toast.error("Something went wrong");
  //       console.error(error);
  //       form.setValue("rateOfInterest", "");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [form],
  // );

  const getDeductionListApiCall = useCallback(
    async (orgId, prodId, amount) => {
      setLoading(true);
      try {
        const formattedDate = beg_date
          ? format(parseDateHelper(beg_date), "yyyy-MM-dd")
          : null;
        const memId =
          loanMemberProduct?.Id ||
          loanMemberProduct?.cust_Id ||
          form.getValues("memberId") ||
          "";
        const res = await getDeductionListAPI(
          orgId,
          prodId,
          amount,
          "1",
          "",
          memId,
          formattedDate,
        );
        if (res.message === "Data Found") {
          const mappedDetails = (res.details || []).map((item) => {
            const chargePerc = parseFloat(item.Charg_Perc || 0);
            const chargeAmt = parseFloat(item.Charge_Amt || 0);
            const finalCharge =
              chargePerc > 0
                ? (parseFloat(amount || 0) * chargePerc) / 100
                : chargeAmt;
            return {
              ...item,
              Final_Charge: finalCharge.toFixed(2),
            };
          });
          dispatch(setDeductionList(mappedDetails));
          return { hasData: true, details: mappedDetails };
        } else {
          dispatch(setDeductionList([]));
          return { hasData: false, details: [] };
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(setDeductionList([]));
        return { hasData: false, error };
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getSecurityTypeApiCall = useCallback(async (orgId) => {
    try {
      const res = await getSecurityTypeAPI(orgId);
      if (res.message === "Data Found") {
        setExternalSecurityTypes(res.details || []);
      } else {
        setExternalSecurityTypes([]);
      }
    } catch (error) {
      console.error(error);
      setExternalSecurityTypes([]);
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      getSecurityTypeApiCall(orgId);
    }
  }, [orgId, getSecurityTypeApiCall]);

  const FormhandleSubmit = (values, deductionList) => {
    console.log("Hooks.js handleSubmit called with:", values);
    if (
      (values.securityOption === "SECURITY" && !(securityTable.length > 0)) ||
      (values.securityOption === "GUARANTEE" && !(guaranteeTable.length > 0)) ||
      (values.securityOption === "GROUP" &&
        !(values.member_info && values.member_info.length > 0))
    )
      toast.error("Please add security or guarantee");
    else {
      if (
        disableSecurityType &&
        values.securityOption === "SECURITY" &&
        Number(values.applicationAmount) >
          (values.maxLoanAmount ? Number(values.maxLoanAmount) : 0)
      )
        toast.error("Application amount cannot exceed eligible amount");
      else {
        const totalMemberAmount = (values.member_info || []).reduce(
          (sum, item) => sum + Number(item.Application_Amount || 0),
          0,
        );

        // if (totalMemberAmount > Number(values.applicationAmount)) {
        //   return toast.error(
        //     `Total member application amount cannot exceed group application amount ${totalMemberAmount}`,
        //   );
        // }

        if (
          values.securityOption === "GROUP" &&
          totalMemberAmount < Number(values.applicationAmount)
        ) {
          return toast.error(
            `Total member application amount cannot be less than group application amount ${totalMemberAmount}`,
          );
        }

        postLoanApplicationApiCall(values, deductionList);
      }
    }
  };

  const getGroupDataByIdApiCall = useCallback(
    async (orgId, memberNo) => {
      console.log("getGroupDataByIdApiCall called with:", { orgId, memberNo });
      setGetGroupLoading(true);
      try {
        const res = await getGrpInstDataAPI(orgId, "G", memberNo);
        console.log("getGrpInstDataAPI response:", res);

        if (res.message === "Data Found") {
          setShowForm(true);
          setGroupData(res.details[0]);

          if (res.details[0].member_info) {
            let memberInfo = res.details[0].member_info;
            if (typeof memberInfo === "string") {
              try {
                memberInfo = JSON.parse(memberInfo);
              } catch (e) {
                console.error("Error parsing member_info:", e);
                memberInfo = [];
              }
            }
            form.setValue("member_info", memberInfo);
          } else {
            form.setValue("member_info", []);
          }
        } else {
          setGroupData(null);
          form.setValue("member_info", []);
        }
      } catch (error) {
        console.error("Error in getGroupDataByIdApiCall:", error);
        setVisibleBlock(false);
        toast.error("Something went wrong");
        form.setValue("member_info", []);
      } finally {
        setGetGroupLoading(false);
      }
    },
    [form],
  );

  const handleMemberFormSubmit = (values) => {
    // Reset form and security/guarantee states for the new search
    form.reset();
    setSecurityTable([]);
    setGuaranteeTable([]);
    setLoanMemberProduct(null);
    setLoanEligible(false);
    setShowEmi(false);

    postLoanMemberInfoByIdApiCall(values);
    const selectedDate = values.date ? new Date(values.date) : "";
    form.setValue("applicationDate", selectedDate);
    form.setValue("sanctionDate", selectedDate);
  };

  const handleGuaranteeMemberSearch = (values) => {
    getLoanGuranteeMemberInfoByIdApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const handleAddSecurityTable = (value) => {
    if (!value) return toast.error("Select a valid security");
    const newValue = {
      Id: value?.Id,
      certificateType: value?.Prod_Name || "",
      certificateNo: value?.Account_No || "",
      issueDate: value?.Opening_Date || "",
      issueAmount: value?.Balance || "",
      roi: value?.ROI || "",
      maturityDate: value?.Maturity_Date || "",
      maturityAmount: value?.Maturity_Amount || "",
    };
    setSecurityTable((prev) => [...prev, newValue]);
    form.setValue("securityAccount", "");
  };

  const handleAddExternalSecurityTable = () => {
    const extType = Number(form.getValues("externalSecurityType"));
    if (!extType) return toast.error("Please select external security type");

    let newValue = {
      Id: securityTable.length + 1,
      externalSecurityType: extType,
    };

    if (extType === 1) {
      if (
        !form.getValues("certificateType") ||
        !form.getValues("certificateNumber") ||
        !form.getValues("issueDate") ||
        !form.getValues("issueAmount") ||
        !form.getValues("roi") ||
        !form.getValues("maturityDate") ||
        !form.getValues("maturityAmount")
      ) {
        return toast.error("Please enter all fields");
      }
      newValue = {
        ...newValue,
        certificateType: form.getValues("certificateType") || "",
        certificateNo: form.getValues("certificateNumber") || "",
        issueDate: form.getValues("issueDate")
          ? format(form.getValues("issueDate"), "yyyy-MM-dd")
          : "",
        issueAmount: form.getValues("issueAmount") || "",
        roi: form.getValues("roi") || "",
        maturityDate: form.getValues("maturityDate")
          ? format(form.getValues("maturityDate"), "yyyy-MM-dd")
          : "",
        maturityAmount: form.getValues("maturityAmount") || "",
      };
    } else if (extType === 2) {
      if (
        !form.getValues("extTypeName") ||
        !form.getValues("extPropertyLocation") ||
        !form.getValues("extPropertyArea") ||
        !form.getValues("extOwnerName") ||
        !form.getValues("extPropertyDetails") ||
        !form.getValues("extSecurityValue")
      ) {
        return toast.error("Please enter all required fields");
      }
      newValue = {
        ...newValue,
        extTypeName: form.getValues("extTypeName") || "",
        extPropertyLocation: form.getValues("extPropertyLocation") || "",
        extPropertyArea: form.getValues("extPropertyArea") || "",
        extOwnerName: form.getValues("extOwnerName") || "",
        extCoOwnerName: form.getValues("extCoOwnerName") || "",
        extPropertyDetails: form.getValues("extPropertyDetails") || "",
        extLatitude: form.getValues("extLatitude") || "",
        extLongitude: form.getValues("extLongitude") || "",
        extSecurityValue: form.getValues("extSecurityValue") || "",
      };
    } else if (extType === 3) {
      if (
        !form.getValues("extItemName") ||
        !form.getValues("extItemDetails") ||
        !form.getValues("extItemCost") ||
        !form.getValues("extOwnContribution")
      ) {
        return toast.error("Please enter all required fields");
      }
      newValue = {
        ...newValue,
        extItemName: form.getValues("extItemName") || "",
        extItemDetails: form.getValues("extItemDetails") || "",
        extItemBrand: form.getValues("extItemBrand") || "",
        extOwnerName: form.getValues("extOwnerName") || "",
        extCoOwnerName: form.getValues("extCoOwnerName") || "",
        extItemCost: form.getValues("extItemCost") || "",
        extOwnContribution: form.getValues("extOwnContribution") || "",
      };
    } else if (extType === 4) {
      if (
        !form.getValues("extTypeName") ||
        !form.getValues("extDetails") ||
        !form.getValues("extSecurityValue")
      ) {
        return toast.error("Please enter all required fields");
      }
      newValue = {
        ...newValue,
        extTypeName: form.getValues("extTypeName") || "",
        extDetails: form.getValues("extDetails") || "",
        extSecurityValue: form.getValues("extSecurityValue") || "",
      };
    }

    const newSecurityTable = [...securityTable, newValue];

    setSecurityTable(newSecurityTable);

    // Reset external fields
    form.setValue("certificateType", "");
    form.setValue("certificateNumber", "");
    form.setValue("issueDate", "");
    form.setValue("issueAmount", "");
    form.setValue("roi", "");
    form.setValue("maturityDate", "");
    form.setValue("maturityAmount", "");
    form.setValue("extTypeName", "");
    form.setValue("extPropertyLocation", "");
    form.setValue("extPropertyArea", "");
    form.setValue("extOwnerName", "");
    form.setValue("extCoOwnerName", "");
    form.setValue("extPropertyDetails", "");
    form.setValue("extLatitude", "");
    form.setValue("extLongitude", "");
    form.setValue("extItemName", "");
    form.setValue("extItemDetails", "");
    form.setValue("extItemBrand", "");
    form.setValue("extItemCost", "");
    form.setValue("extOwnContribution", "");
    form.setValue("extDetails", "");
    form.setValue("extSecurityValue", "");
  };

  const handleAddGuaranteeTable = () => {
    if (guaranteeMemberDetails) {
      const isDuplicate = guaranteeTable.some(
        (item) => item.Id === guaranteeMemberDetails?.Id,
      );

      if (isDuplicate) {
        toast.error("This guarantee member has already been added");
        return;
      }

      setGuaranteeTable((prev) => [
        ...prev,
        {
          Id: guaranteeMemberDetails?.Id,
          guaranteeName: guaranteeMemberDetails?.Full_Name,
          guaranteeGuardianName: guaranteeMemberDetails?.Relation_Name,
          guaranteeAddress: guaranteeMemberDetails?.Address,
        },
      ]);

      setGuaranteeMemberDetails(null);
      setResetGuaranteeMember((prev) => prev + 1);
      form.setValue("guaranteeName", "");
      form.setValue("guaranteeGuardianName", "");
      form.setValue("guaranteeAddress", "");
    } else {
      toast.error("Please select a guarantee member");
    }
  };

  const handleDeleteSecurityTable = (id) => {
    const newSecurityTable = securityTable.filter((_, i) => i !== id);

    setSecurityTable(newSecurityTable);
  };

  const handleDeleteGuaranteeTable = (id) => {
    const newGuaranteeTable = guaranteeTable.filter((data) => data.Id !== id);

    setGuaranteeTable(newGuaranteeTable);
  };

  const postLoanApplicationApiCall = useCallback(
    async (item, deductionList) => {
      console.log("postLoanApplicationApiCall=", item, deductionList);

      const securityDetails = securityTable.map((data) => {
        const base = {
          dep_id: null,
          balance: null,
          Sec_Type: null,
          Cert_Type: null,
          Cert_No: null,
          Issue_Date: null,
          Roi: null,
          Matyrity_Date: null,
          Maturity_Value: null,
          Address: null,
          sec_area: null,
          sec_owner: null,
          sec_coown: null,
          sec_details: null,
          lati: null,
          sec_long: null,
          sec_item: null,
          sec_brand: null,
          sec_cost: null,
          own_cont: null,
          Sec_Src: null,
        };

        if (item?.securityType === "I") {
          return {
            ...base,
            dep_id: data.Id || null,
            Sec_Src: 1,
            Sec_Type: 1,
            Cert_Type: data?.certificateType || null,
            Cert_No: data?.certificateNo || null,
            Issue_Date: data?.issueDate || null,
            balance: data?.issueAmount || null,
            Roi: data?.roi || null,
            Matyrity_Date: data?.maturityDate || null,
            Maturity_Value: data?.maturityAmount || null,
          };
        } else {
          const extType = Number(data?.externalSecurityType);
          if (extType === 1) {
            return {
              ...base,
              Sec_Src: 2,
              Sec_Type: extType,
              Cert_Type: data?.certificateType || null,
              Cert_No: data?.certificateNo || null,
              Issue_Date: data?.issueDate || null,
              balance: data?.issueAmount || null,
              Roi: data?.roi || null,
              Matyrity_Date: data?.maturityDate || null,
              Maturity_Value: data?.maturityAmount || null,
            };
          } else if (extType === 2) {
            return {
              ...base,
              Sec_Src: 2,
              Sec_Type: extType,
              Cert_Type: data?.extTypeName || null,
              Address: data?.extPropertyLocation || null,
              sec_area: data?.extPropertyArea || null,
              sec_owner: data?.extOwnerName || null,
              sec_coown: data?.extCoOwnerName || null,
              sec_details: data?.extPropertyDetails || null,
              lati: data?.extLatitude || null,
              sec_long: data?.extLongitude || null,
              balance: data?.extSecurityValue || null,
            };
          } else if (extType === 3) {
            return {
              ...base,
              Sec_Src: 2,
              Sec_Type: extType,
              sec_item: data?.extItemName || null,
              sec_details: data?.extItemDetails || null,
              sec_brand: data?.extItemBrand || null,
              sec_owner: data?.extOwnerName || null,
              sec_coown: data?.extCoOwnerName || null,
              sec_cost: data?.extItemCost || null,
              own_cont: data?.extOwnContribution || null,
            };
          } else if (extType === 4) {
            return {
              ...base,
              Sec_Src: 2,
              Sec_Type: extType,
              Cert_Type: data?.extTypeName || null,
              sec_details: data?.extDetails || null,
              balance: data?.extSecurityValue || null,
            };
          }
          return { ...base, Sec_Src: 2, Sec_Type: extType || null };
        }
      });

      const guaranteeList = guaranteeTable.map((data) => ({ mem_id: data.Id }));
      const projectList = {
        prj_name: item.projectName || "",
        prj_code: item.projectcost || "",
        own_cb: item.projectowncont || "",
        proj_mouza: item.projectmouza || "",
        proj_plotno: item.projectplotno || "",
        land_area: item.projectland || "",
        hyp_val: item.projecthypothicated || "",
        inc_amt: item.projectincome || "",
        sec_dtls: "",
      };

      const groupList = (item.member_info || []).map((data) => ({
        mem_id: data.Id || data.Id, // Ensure we have the ID correctly
        appl_amount: data.Application_Amount || 0,
        dur_unit: data.Duration_Unit || "",
        duration: data.Duration || "",
        rate: data.Rate || 0,
      }));

      let data = {
        org_id: orgId,
        branch_Id: branchId,
        appl_date: format(new Date(item.applicationDate), "yyyy-MM-dd"),
        mem_id: loanMemberProduct.Id,
        case_no: item.applicationNo,
        ln_purpose: item.loanPurpose,
        prod_id: item.productId,
        roi: item.rateOfInterest,
        duration: item.duration,
        dur_unit: item.durationUnit,
        appl_amount: item.applicationAmount,
        repay_mode: item.repaymentMode,
        repay_within:
          item.finalRepaymentDate &&
          !isNaN(new Date(item.finalRepaymentDate).getTime())
            ? format(new Date(item.finalRepaymentDate), "yyyy-MM-dd")
            : null,
        joint_1: (item.jointHolderDetails || [])[0]?.Id || "",
        joint_2: (item.jointHolderDetails || [])[1]?.Id || "",
        ecs_mode: item.isAvailEcs === true ? 1 : 0,
        sb_id: item.voucherMode === "savings" ? item.savings : null,
        bank_id: item.voucherMode === "bank" ? item.bank : null,
        ref_vouch: item.refVouchNo ? item.refVouchNo : null,
        fin_id: finId,
        sec_details: securityDetails,
        gur_details: guaranteeList,
        shg_mem: groupList,
        // sec_details: item.securityOption === "SECURITY" ? securityDetails : [],
        // gur_details: item.securityOption === "GUARANTEE" ? guaranteeList : [],
        // shg_mem: item.securityOption === "GROUP" ? groupList : [],
        charge_data:
          deductionList && deductionList.length > 0
            ? deductionList.map((data) => ({
                ledg_id: data.Deduct_Gl,
                ded_amt: data.Final_Charge,
                ded_id: data.Id,
                ded_perc: data.Charg_Perc,
              }))
            : [],
        proj_dtls: [projectList],
      };

      console.log("postLoanApplicationApiCall post =", data);
      console.log("deductionList in post:", deductionList);
      console.log("charge_data being sent:", data.charge_data);

      setPostNewLoanLoading(true);
      try {
        const res = await postLoanApplicationAPI(data);
        if (res.message === "Success") {
          setVisibleBlock(false);
          setSuccessMessage(res.details);
          setShowSuccessMessage(true);
          form.reset();
          setLoanMemberProduct(null);
          setLoanEligible(false);
          setShowEmi(false);
          setResetTrigger((prev) => prev + 1);
        } else {
          toast.error(res.details);
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        setSuccessMessage(null);
      } finally {
        setPostNewLoanLoading(false);
      }
    },
    [
      securityTable,
      guaranteeTable,
      loanMemberProduct,
      branchId,
      orgId,
      form,
      setPostNewLoanLoading,
      setVisibleBlock,
      setSuccessMessage,
      setShowSuccessMessage,
      setLoanMemberProduct,
      setLoanEligible,
      setShowEmi,
      setResetTrigger,
    ],
  );

  const postLoanMemberInfoByIdApiCall = useCallback(
    async (item) => {
      setLoading(true);

      resetFields();

      try {
        const res = await postLoanMemberInfoAPI(
          orgId,
          item.memberNo,
          format(item.date, "yyyy-MM-dd"),
        );
        if (res.message === "Data Found") {
          setVisibleBlock(true);
          form.setValue("memberName", res.details[0].Full_Name || "");
          form.setValue("memberId", res.details[0].Id || "");
          form.setValue("gurdianName", res.details[0].Relation_Name || "");
          form.setValue("address", res.details[0].Address || "");
          form.setValue("mobile", res.details[0].Mem_Mob || "");
          form.setValue("memberType", res.details[0].Member_Type || "");
          form.setValue("shareBalance", res.details[0].Balance || "");
          form.setValue("BranchId", res.details[0].Branch_Id || "");
          form.setValue("branchName", res.details[0].Branch_Name || "");
          form.setValue("CustType", res.details[0].Cust_Type || "");
          form.setValue("CustomerType", res.details[0].Customer_Type || "");
          setLoanMemberProduct(res.details[0] || null);

          await getProdTypeDataApiCall(orgId);
          await getGroupDataByIdApiCall(orgId, res.details[0].CIF_No);
          await getLoanPurposeAPICall(orgId);
          await getLoanEcsAccountApiCall(orgId, res.details[0].Id);
        } else {
          setVisibleBlock(false);
          form.setValue("memberName", "");
          form.setValue("memberId", "");
          form.setValue("gurdianName", "");
          form.setValue("address", "");
          form.setValue("mobile", "");
          form.setValue("memberType", "");
          form.setValue("shareBalance", "");
          form.setValue("BranchId", "");
          form.setValue("branchName", "");
          form.setValue("CustType", "");
          form.setValue("CustomerType", "");
          form.setValue("productTypeId", "");
          setLoanMemberProduct(null);
          toast.error(res.details);
        }
      } catch (error) {
        setVisibleBlock(false);
        toast.error("Something went wrong");
        console.error(error);
        form.setValue("memberName", "");
        form.setValue("memberId", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("memberType", "");
        form.setValue("shareBalance", "");
        form.setValue("BranchId", "");
        form.setValue("branchName", "");
        form.setValue("CustType", "");
        form.setValue("CustomerType", "");
        form.setValue("productTypeId", "");

        setLoanMemberProduct(null);
      } finally {
        setLoading(false);
      }
    },
    [
      orgId,
      form,
      getProdTypeDataApiCall,
      getGroupDataByIdApiCall,
      getLoanPurposeAPICall,
      getLoanEcsAccountApiCall,
    ],
  );

  const getLoanGuranteeMemberInfoByIdApiCall = useCallback(
    async (item) => {
      setLoading(true);

      try {
        const res = await postLoanMemberInfoAPI(
          orgId,
          item.memberNo,
          format(form.getValues("applicationDate"), "yyyy-MM-dd"),
        );
        if (res.message === "Data Found") {
          if (res.details[0].Id !== loanMemberProduct.Id) {
            setGuaranteeMemberDetails(res.details[0]);
            form.setValue("guaranteeName", res.details[0].Full_Name || "");
            form.setValue(
              "guaranteeGuardianName",
              res.details[0].Relation_Name || "",
            );
            form.setValue("guaranteeAddress", res.details[0].Address || "");
          } else {
            toast.error("Guarantee member cannot be the same as loan member");
          }
        } else {
          toast.error(res.details);
          setGuaranteeMemberDetails(null);
          form.setValue("guaranteeName", "");
          form.setValue("guaranteeGuardianName", "");
          form.setValue("guaranteeAddress", "");
        }
      } catch (error) {
        setGuaranteeMemberDetails(null);
        form.setValue("guaranteeName", "");
        form.setValue("guaranteeGuardianName", "");
        form.setValue("guaranteeAddress", "");
      } finally {
        setLoading(false);
      }
    },
    [orgId, form, loanMemberProduct],
  );

  useEffect(() => {
    form.trigger("ecsAccount");
  }, [isAvailEcs, ecsAccount, form]);

  useEffect(() => {
    if (!isAvailEcs) {
      form.setValue("ecsAccount", "");
    }
  }, [isAvailEcs, form]);

  const getLoanProductDataApiCall = useCallback(
    async (orgId, typeId) => {
      console.log("getLoanProductDataApiCall called with:", { orgId, typeId });
      setLoading(true);

      try {
        const res = await getLoanProductDataAPI(orgId, typeId);
        console.log("getLoanProductDataAPI response:", res);

        if (res.message === "Data Found") {
          dispatch(getLoanProductData(res.details));
        } else {
          console.log("No product data found");
          dispatch(getLoanProductData([]));
        }
      } catch (error) {
        console.error("Error in getLoanProductDataApiCall:", error);
        toast.error("Something went wrong");
        dispatch(getLoanProductData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getCheckLoanEligibleApiCall = useCallback(
    async (orgId, appProductId, loanProductId) => {
      if (!loanMemberProduct) return;
      setLoading(true);

      try {
        const applicationDate = form.getValues("applicationDate");
        if (!applicationDate) {
          setLoading(false);
          return;
        }

        const res = await getCheckLoanEligibleAPI(
          orgId,
          appProductId,
          loanProductId,
          format(new Date(applicationDate), "yyyy-MM-dd"),
        );
        if (res.message === "Data Found") {
          setLoanEligible(true);

          getLoanDurationUnitApiCall(appProductId, orgId);
          getLoanRepaymentModeApiCall(appProductId, orgId);
          // getLoanInterestRateApiCall(orgId, appProductId);

          const selectedProduct = productData.find(
            (item) => item.Id.toString() === appProductId,
          );

          setShowEmi(!!selectedProduct && selectedProduct.Loan_Type === 24);

          console.log(
            productData.filter((item) => item.Id.toString() === appProductId),
          );
        } else {
          setLoanEligible(false);
          toast.error(res.details);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        setLoanEligible(false);
      } finally {
        setLoading(false);
      }
    },
    [
      form,
      loanMemberProduct,
      productId,
      getLoanDurationUnitApiCall,
      getLoanRepaymentModeApiCall,
      // getLoanInterestRateApiCall,
      productData,
    ],
  );

  const getCheckLoanSecurityApiCall = useCallback(
    async (orgId, productId, loanProductId) => {
      if (!loanMemberProduct) return;
      setLoading(true);
      try {
        const applicationDate = form.getValues("applicationDate");
        if (!applicationDate) {
          setLoading(false);
          return;
        }

        const res = await getCheckLoanSecurityAPI(
          orgId,
          productId,
          loanProductId,
          format(new Date(applicationDate), "yyyy-MM-dd"),
        );
        if (res.message === "Data Found") {
          dispatch(getSecurityData(res.details.DropdownData));
          form.setValue("maxAllow", res.details.maxAllow);
          form.setValue("securityType", "I");
          form.setValue("securityOption", "SECURITY");
          setDisableSecurityType(true);
        } else {
          form.setValue("maxAllow", "");
          // toast.error(res.details);
          dispatch(getSecurityData([]));
          setDisableSecurityType(false);
        }
      } catch (error) {
        form.setValue("maxAllow", "");
        toast.error("Something went wrong");
        dispatch(getSecurityData([]));
        setDisableSecurityType(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form, loanMemberProduct],
  );

  const getLoanSecurityProductApiCall = useCallback(
    async (orgId) => {
      if (!loanMemberProduct) return;
      setLoading(true);
      try {
        const applicationDate = form.getValues("applicationDate");
        if (!applicationDate) {
          setLoading(false);
          return;
        }

        const res = await getLoanSecurityProductAPI(
          orgId,
          loanMemberProduct.Id,
          format(new Date(applicationDate), "yyyy-MM-dd"),
        );
        if (res.message === "Data Found") {
          dispatch(getSecurityData(res.details));
        } else {
          toast.error(res.details);
          dispatch(getSecurityData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        dispatch(getSecurityData([]));
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form, loanMemberProduct],
  );

  const getCheckLoanDurationUnitDataApiCall = useCallback(
    async (orgId, prodId, duration, durationUnit) => {
      setLoading(true);
      try {
        const res = await getCheckLoanDurationUnitDataAPI(
          orgId,
          prodId,
          duration,
          durationUnit,
        );
        if (res.message === "Data Found") {
          toast.success(res.details);
        } else {
          toast.error(res.details);
        }
        console.log(res);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getLoanEmiApiCall = useCallback(
    async (orgId) => {
      setLoading(true);

      try {
        const res = await getLoanEmiAPI(
          orgId,
          form.getValues("applicationAmount"),
          form.getValues("rateOfInterest"),
          form.getValues("duration"),
        );
        if (res.message === "Data Found") {
          form.setValue("emiAmount", res.details || "");
        } else {
          form.setValue("emiAmount", "");
        }
        console.log(res);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        form.setValue("emiAmount", "");
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  const postCheckLoanAmountApiCall = useCallback(
    async (orgId) => {
      setLoading(true);

      try {
        const res = await postCheckLoanAmountAPI(
          orgId,
          form.getValues("productId"),
          form.getValues("applicationAmount"),
        );
        if (res.message === "Data Found") {
          setAmountErrorMessage("");
        } else {
          setAmountErrorMessage(res.details);
        }
        console.log(res);
      } catch (error) {
        setVisibleBlock(false);
        toast.error("Something went wrong");
        setAmountErrorMessage("");
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  const handleJointAccountAdd = (memberData) => {
    const currentJointHolders = form.getValues("jointHolderDetails") || [];
    form.setValue("jointHolderDetails", [...currentJointHolders, memberData]);
    toast.success("Joint holder added successfully!");
  };

  const handleJointAccountDelete = (memberId) => {
    const currentJointHolders = form.getValues("jointHolderDetails") || [];
    const updatedJointHolders = currentJointHolders.filter(
      (holder) => holder.Id !== memberId && holder.Cust_Id !== memberId,
    );
    form.setValue("jointHolderDetails", updatedJointHolders);
    toast.success("Joint holder removed successfully!");
  };

  // useEffect(() => {
  //   if (productId && orgId && loanMemberProduct) {
  //     dispatch(getSecurityData([]));
  //     setSecurityTable([]);
  //     form.setValue("securityType", "E");
  //     getCheckLoanEligibleApiCall(orgId);
  //     getCheckLoanSecurityApiCall(orgId);
  //   }
  // }, [
  //   productId,
  //   orgId,
  //   loanMemberProduct,
  //   dispatch,
  //   form,
  //   getCheckLoanEligibleApiCall,
  //   getCheckLoanSecurityApiCall,
  // ]);

  // useEffect(() => {
  //   if (productId && applicationAmount && orgId) {
  //     postCheckLoanAmountApiCall(orgId);
  //   }
  // }, [productId, applicationAmount, orgId, postCheckLoanAmountApiCall]);

  useEffect(() => {
    if (productId && duration && durationUnit && orgId) {
      getCheckLoanDurationUnitDataApiCall(
        orgId,
        productId,
        duration,
        durationUnit,
      );
    }
  }, [
    productId,
    duration,
    durationUnit,
    orgId,
    getCheckLoanDurationUnitDataApiCall,
  ]);

  // TODO:
  // useEffect(() => {
  //   console.log("Final Repayment Date useEffect triggered");
  //   // const appDate = form.getValues("applicationDate");
  //   // const sancDate = form.getValues("sanctionDate");
  //   const appDate = applicationDate;
  //   const sancDate = sanctionDate;

  //   // The UI uses sanctionDate for "Application Date"
  //   const effectiveDate = sancDate || appDate;

  //   console.log("Final Repayment Date Calculation:", {
  //     duration,
  //     durationUnit,
  //     effectiveDate,
  //     appDate,
  //     sancDate,
  //     durationUnitType: typeof durationUnit,
  //     hasDuration: !!duration,
  //     hasDurationUnit: !!durationUnit,
  //     hasEffectiveDate: !!effectiveDate,
  //   });

  //   // Force calculation if all values exist
  //   if (duration && durationUnit && effectiveDate) {
  //     try {
  //       let parsedDate;
  //       if (effectiveDate instanceof Date) {
  //         parsedDate = effectiveDate;
  //       } else {
  //         // Try parsing common formats if it's a string
  //         parsedDate = new Date(effectiveDate);
  //         if (isNaN(parsedDate.getTime())) {
  //           // Fallback to parse from date-fns if standard Date constructor fails
  //           parsedDate = parse(effectiveDate, "yyyy-MM-dd", new Date());
  //         }
  //       }

  //       if (isNaN(parsedDate.getTime())) {
  //         console.log("Invalid date detected");
  //         return;
  //       }

  //       let finalDate;
  //       const durationUnitStr = String(durationUnit);
  //       console.log("Duration unit value:", durationUnitStr);

  //       if (durationUnitStr === 30) {
  //         // Days calculation
  //         finalDate = addDays(parsedDate, Number(duration));
  //         console.log(`Adding ${duration} days to`, parsedDate);
  //       } else if (durationUnitStr === 29) {
  //         // Months calculation
  //         finalDate = addMonths(parsedDate, Number(duration));
  //         console.log(`Adding ${duration} months to`, parsedDate);
  //       } else {
  //         // Try to handle other duration unit values or clear if invalid
  //         console.log("Invalid duration unit:", durationUnitStr);
  //         form.setValue("finalRepaymentDate", "");
  //         return;
  //       }

  //       // Set the final repayment date as a Date object
  //       console.log("Setting final repayment date to:", finalDate);
  //       form.setValue("finalRepaymentDate", finalDate);
  //       // Force a re-render by triggering a form update
  //       form.trigger("finalRepaymentDate");
  //     } catch (error) {
  //       console.error("Error calculating final repayment date:", error);
  //       form.setValue("finalRepaymentDate", "");
  //     }
  //   } else {
  //     console.log("Missing required values for calculation");
  //   }
  // }, [duration, durationUnit, applicationDate, sanctionDate]);

  useEffect(() => {
    if (
      productId &&
      applicationAmount &&
      rateOfInterest &&
      duration &&
      orgId &&
      showEmi
    ) {
      getLoanEmiApiCall(orgId);
    }
  }, [
    duration,
    applicationAmount,
    rateOfInterest,
    orgId,
    showEmi,
    productId,
    getLoanEmiApiCall,
  ]);

  useEffect(() => {
    const securityTableTotal = securityTable.reduce(
      (sum, item) => sum + (item.issueAmount ? Number(item.issueAmount) : 0),
      0,
    );
    form.setValue(
      "maxLoanAmount",
      (securityTableTotal * (maxAllow ? Number(maxAllow) : 0)) / 100 || 0,
    );
  }, [securityTable, maxAllow]);

  // Transaction related functions
  //handle cash transaction grand total
  const calculateCashTransactionTotalAmount = (note, denominator) => {
    const parsedNote = parseFloat(note);
    const parsedDenominators = parseFloat(denominator);
    if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
      return parsedNote * parsedDenominators;
    }
    return 0;
  };

  //handle in denominators change
  const handleInDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...inDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setInDenominators(newDenominators);
    }
  };

  //handle out denominators change
  const handleOutDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...outDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setOutDenominators(newDenominators);
    }
  };

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashInTransactionTotal(defaultTotalAmounts);
    setCashOutTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );

    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        outDenominators[index],
      ),
    );

    setCashOutTransactionTotal(newTotalAmounts);
  }, [outDenominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashInTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashInTransactionGrandTotal(newGrandTotal);
  }, [cashInTransactionTotal]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashOutTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashOutTransactionGrandTotal(newGrandTotal);
  }, [cashOutTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(inDenominators[idx]) || 0,
        totalAmount: cashInTransactionTotal[idx],
      };
    });
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(outDenominators[idx]) || 0,
        totalAmount: cashOutTransactionTotal[idx],
      };
    });
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal]);

  const getNoteDenomApiCall = useCallback(async () => {
    console.log("Fetching note denomination data...");
    try {
      const res = await getCashDenomAPI();
      console.log("Note denom API response:", res);
      if (res.message === "Data Found") {
        console.log("Dispatching note denom data:", res.details);
        dispatch(getNoteDenomData(res.details));
      } else {
        console.log("No data found, dispatching empty array");
        dispatch(getNoteDenomData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error fetching note denom:", error);
      dispatch(getNoteDenomData([]));
    }
  }, [dispatch]);

  const getCheckBalanceApiCall = useCallback(
    async (acNo, date, organizationId) => {
      setLoading(true);

      try {
        const accountNo = acNo || form.getValues("savings");
        const targetDate = date || form.getValues("applicationDate");
        const currentOrgId = organizationId || orgId;

        console.log("getCheckBalanceApiCall triggered:", {
          accountNo,
          targetDate,
          currentOrgId,
        });

        if (!accountNo || !targetDate) {
          console.log(
            "getCheckBalanceApiCall skipped due to missing accountNo or targetDate",
          );
          return;
        }

        const formattedDate = format(new Date(targetDate), "yyyy-MM-dd");
        console.log("Checking balance API with:", {
          accountNo,
          formattedDate,
          currentOrgId,
        });

        const res = await getCheckBalanceAPI(
          accountNo,
          formattedDate,
          currentOrgId,
        );
        console.log("getCheckBalanceAPI response:", res);
        if (res.message === "Data Found") {
          form.setValue(
            "savingsBalance",
            res.details ? Number(res.details)?.toFixed(2) : "",
          );
        } else {
          toast.error(res.details || res.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error in getCheckBalanceApiCall:", error);
      } finally {
        setLoading(false);
      }
    },
    [form, orgId],
  );

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("applicationDate");

    console.log("Watcher useEffect for savings/date triggered:", {
      currentSavings,
      currentDate,
      prevSavings: prevSavings.current,
      prevDate: prevDate.current,
    });

    if (
      currentSavings &&
      currentDate &&
      (currentSavings !== prevSavings.current ||
        currentDate !== prevDate.current)
    ) {
      console.log("Calling getCheckBalanceApiCall from watcher");
      getCheckBalanceApiCall();
    }

    prevSavings.current = currentSavings;
    prevDate.current = currentDate;
  }, [savings, applicationDate]);

  useEffect(() => {
    if (savings) {
      form.setValue(
        "savingsName",
        ecsAccountData?.find((account) => account?.Id?.toString() === savings)
          ?.Full_Name || "",
      );
      dispatch(setEcsAccountNo(savings));
    } else {
      form.setValue("savingsName", "");
      form.setValue("savingsBalance", "");
      dispatch(setEcsAccountNo(""));
    }
  }, [savings, ecsAccountData, dispatch]);

  useEffect(() => {
    // Ensure transMode has a default value if undefined
    if (!transMode) {
      form.setValue("transMode", "cash");
    }
    form.setValue("savings", "");
    form.setValue("bank", "");
  }, [transMode]);

  useEffect(() => {
    if (transMode === "savings") {
      if (
        savingsBalance &&
        applicationAmount &&
        Number(savingsBalance) > Number(applicationAmount)
      )
        setInsufficientBalanceDisable(false);
      else {
        setInsufficientBalanceDisable(true);
      }
    } else {
      setInsufficientBalanceDisable(false);
    }
  }, [transMode, savingsBalance, applicationAmount]);

  useEffect(() => {
    if (!disableSecurityType && securityType === "I" && orgId)
      getLoanSecurityProductApiCall(orgId);
  }, [securityType, disableSecurityType, orgId, getLoanSecurityProductApiCall]);

  const resetFields = () => {
    const fields = [
      "applicationNo",
      "accountNo",
      "ledgFolio",
      "productId",
      "applicationAmount",
      "rateOfInterest",
      "duration",
      "durationUnit",
      "repaymentMode",
      "finalRepaymentDate",
      "emiAmount",
      "securityOption",
      "securityType",
      "securityAccount",
      "maxAllow",
      "maxLoanAmount",
      "certificateType",
      "certificateNumber",
      "issueDate",
      "issueAmount",
      "roi",
      "maturityDate",
      "maturityAmount",
      "guaranteeName",
      "guaranteeGuardianName",
      "guaranteeAddress",
      "BranchId",
      "branchName",
      "CustType",
      "productTypeId",
      "dialougeMemberName",
      "jointHolderDetails",
      "CustomerType",
      "projectName",
      "projectcost",
      "projectowncont",
      "projectmouza",
      "projectplotno",
      "projectland",
      "projecthypothicated",
      "projectincome",
      "member_info",
      "loanPurpose",
      "isAvailEcs",
      "ecsAccount",
    ];

    fields.forEach((field) => {
      if (field === "isAvailEcs") {
        form.setValue(field, false);
      } else if (field === "jointHolderDetails" || field === "member_info") {
        form.setValue(field, []);
      } else {
        form.setValue(field, "");
      }
    });
  };

  return {
    loading,
    form,
    externalSecurityTypes,
    getSecurityTypeApiCall,
    FormhandleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    amountErrorMessage,
    showEmi,
    loanEligible,
    getLoanProductDataApiCall,
    getProdTypeDataApiCall,
    getLoanPurposeAPICall,
    handleAddSecurityTable,
    handleAddExternalSecurityTable,
    handleDeleteSecurityTable,
    securityTable,
    resetTrigger,
    postNewLoanLoading,
    disableSecurityType,
    handleGuaranteeMemberSearch,
    handleAddGuaranteeTable,
    resetGuaranteeMember,
    guaranteeTable,
    CustomerType,
    handleDeleteGuaranteeTable,
    guaranteeMemberDetails,
    handleJointAccountAdd,
    handleJointAccountDelete,
    getGroupDataByIdApiCall,
    getGroupLoading,
    groupData,
    setLoading,
    productTypeId,
    isAvailEcs,
    ecsAccount,
    ecsAccountData: useSelector(
      (state) => state?.newApplication?.ecsAccountData,
    ),
    deductionList: deductionList,
    // checkDepositAmountDisable,
    // allowProcessDeposit,
    getCheckLoanSecurityApiCall,
    getCheckLoanEligibleApiCall,
    setSecurityTable,
    loanMemberProduct,
    productId,

    transMode,

    savings,
    savingsBalance,

    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,

    // Transaction related
    cashDenomData,
    inDenominators,
    outDenominators,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    bankAccountData,
    getLoanProductDataApiCall,
    getProdTypeDataApiCall,
    getLoanPurposeAPICall,
    getCheckLoanSecurityApiCall,
    getCheckLoanEligibleApiCall,
    getNoteDenomApiCall,
    postCheckLoanAmountApiCall,
    getCheckLoanDurationUnitDataApiCall,
    getCheckBalanceApiCall,
    getDeductionListApiCall,
    // operationMode,
    jointHolderDetails,
    setInsufficientBalanceDisable,
    FormhandleSubmit,
    cashInDenomArray,
    cashOutDenomArray,
  };
};
