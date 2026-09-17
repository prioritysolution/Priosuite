"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import {
  getLoanDurationUnitAPI,
  getLoanProductLedgerAPI,
  getLoanProductLedgerHeadAPI,
  getLoanProductListAPI,
  getLoanProductMemberTypeAPI,
  getLoanProductTypeAPI,
  getSecureDepositProductAPI,
  postLoanProductAPI,
  updateLoanProductAPI,
} from "./LoanProductApis";
import {
  getDurationUnitData,
  getLedgerData,
  getLoanProductListData,
  getMemberTypeData,
  getProductTypeData,
  getSecureProductData,
} from "./LoanProductReducer";

const extractList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.details)) return res.details;
  if (Array.isArray(res.Data)) return res.Data;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.details?.data)) return res.details.data;
  if (Array.isArray(res.details?.Data)) return res.details.Data;
  return [];
};

const normalizeOptionRows = (list, labelKeys = ["Option_Value"]) => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const rawId =
        item.Id ??
        item.id ??
        item.Option_Id ??
        item.value ??
        item.Ledger_Id ??
        item.Type_Id ??
        item.Head_Id ??
        null;
      let label;
      for (const key of labelKeys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
          label = item[key];
          break;
        }
      }
      if (label === undefined) {
        label =
          item.Option_Value ??
          item.Ledger_Name ??
          item.Name ??
          item.name ??
          item.Type_Name ??
          item.Member_Type ??
          item.Product_Name ??
          "";
      }
      if (rawId === null || rawId === undefined || rawId === "") return null;
      return {
        ...item,
        Id: rawId,
        Option_Value: item.Option_Value ?? label,
        Ledger_Name: item.Ledger_Name ?? label,
        Product_Name: item.Product_Name ?? label,
      };
    })
    .filter(Boolean);
};

const optionalNumber = () =>
  yup
    .string()
    .nullable()
    .transform((value) => (value === "" || value === null ? "" : value));

const requiredPositiveDecimal = (label) =>
  yup
    .string()
    .required(`${label} is required`)
    .test("is-positive-number", `${label} must be greater than 0`, (value) => {
      if (!value || value.trim() === "") return false;
      return parseFloat(value) > 0;
    })
    .test(
      "is-valid-decimal",
      `${label} can have at most two decimal places`,
      (value) => {
        if (value && !maxTwoDecimalPlaces.test(value)) return false;
        return true;
      },
    );

const optionalDecimal = (label) =>
  optionalNumber().test(
    "is-valid-decimal",
    `${label} can have at most two decimal places`,
    (value) => {
      if (!value || value === "") return true;
      return maxTwoDecimalPlaces.test(value);
    },
  );

const requiredInteger = (label) =>
  yup
    .string()
    .required(`${label} is required`)
    .test("is-integer", `${label} must be a non-decimal number`, (value) => {
      if (!value || value === "") return false;
      return Number.isInteger(Number(value));
    })
    .test("is-positive", `${label} must be greater than 0`, (value) => {
      if (!value || value === "") return false;
      return Number(value) > 0;
    });

const optionalInteger = (label) =>
  optionalNumber().test(
    "is-integer",
    `${label} must be a non-decimal number`,
    (value) => {
      if (!value || value === "") return true;
      return Number.isInteger(Number(value));
    },
  );

const toApiNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toApiTinyIntOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const defaultFormValues = {
  productType: "",
  loanType: "",
  productName: "",
  prodShName: "",
  minAmt: "",
  maxAmt: "",
  minDur: "",
  maxDur: "",
  durUnit: "",
  roi: "",
  prnCurrGl: "",
  prnOdGl: "",
  inttCurrGl: "",
  inttOdGl: "",
  isOverdue: "0",
  overdueOn: "",
  overdueCount: "",
  overdurRate: "",
  graceDays: "",
  graceOn: "",
  isNpa: "0",
  npaAfter: "",
  secureProdId: "",
  maxAllowed: "",
  memberType: "",
  financeType: "",
  isProject: "0",
  isMortg: "0",
  isGurr: "0",
  provCurGl: "",
  provOdGl: "",
};

export const useLoanProduct = () => {
  const dispatch = useDispatch();
  const orgId = getCookieData("orgId");

  const [getLoading, setGetLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [openDialouge, setOpenDialouge] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pageLimit] = useState(10);

  const formSchema = yup.object({
    productType: yup.string().required("Product type is required"),
    loanType: yup.string().required("Loan type is required"),
    productName: yup.string().required("Product name is required"),
    prodShName: yup
      .string()
      .required("Short name is required")
      .max(10, "Short name must be at most 10 characters"),
    minAmt: requiredPositiveDecimal("Minimum amount"),
    maxAmt: requiredPositiveDecimal("Maximum amount").test(
      "max-gte-min",
      "Maximum amount must be greater than or equal to minimum amount",
      function (value) {
        const { minAmt } = this.parent;
        if (!value || !minAmt) return true;
        return parseFloat(value) >= parseFloat(minAmt);
      },
    ),
    minDur: requiredInteger("Minimum duration"),
    maxDur: requiredInteger("Maximum duration").test(
      "max-gte-min-dur",
      "Maximum duration must be greater than or equal to minimum duration",
      function (value) {
        const { minDur } = this.parent;
        if (!value || !minDur) return true;
        return Number(value) >= Number(minDur);
      },
    ),
    durUnit: yup.string().required("Duration unit is required"),
    roi: requiredPositiveDecimal("Rate of interest"),
    prnCurrGl: yup.string().required("Principal current GL is required"),
    prnOdGl: yup.string().required("Principal overdue GL is required"),
    inttCurrGl: yup.string().required("Interest current GL is required"),
    inttOdGl: yup.string().required("Interest overdue GL is required"),
    isOverdue: optionalNumber(),
    overdueOn: optionalNumber(),
    overdueCount: optionalInteger("Overdue count"),
    overdurRate: optionalDecimal("Overdue rate"),
    graceDays: optionalInteger("Grace days"),
    graceOn: optionalNumber(),
    isNpa: optionalNumber(),
    npaAfter: optionalInteger("NPA after"),
    secureProdId: optionalNumber(),
    maxAllowed: optionalDecimal("Max allowed"),
    memberType: optionalNumber(),
    financeType: optionalNumber(),
    isProject: optionalNumber(),
    isMortg: optionalNumber(),
    isGurr: optionalNumber(),
    provCurGl: optionalNumber(),
    provOdGl: optionalNumber(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const handleSubmit = (values) => {
    if (editData && Object.keys(editData).length > 0) {
      putLoanProductApiCall(editData.Id, orgId, values);
    } else {
      postLoanProductApiCall(orgId, values);
    }
  };

  const handleEditData = (data) => {
    setEditData(data);
    setOpenDialouge(true);
  };

  const buildPayload = (orgId, item, prodId = null) => {
    const payload = {
      org_id: Number(orgId),
      product_type: Number(item.productType),
      loan_type: Number(item.loanType),
      product_name: item.productName || "",
      prod_sh_name: item.prodShName || "",
      min_amt: Number(item.minAmt),
      max_amt: Number(item.maxAmt),
      min_dur: Number(item.minDur),
      max_dur: Number(item.maxDur),
      dur_unit: Number(item.durUnit),
      roi: Number(item.roi),
      prn_curr_gl: Number(item.prnCurrGl),
      prn_od_gl: Number(item.prnOdGl),
      intt_curr_gl: Number(item.inttCurrGl),
      intt_od_gl: Number(item.inttOdGl),
      is_overdue: toApiTinyIntOrNull(item.isOverdue),
      overdue_on: toApiNumberOrNull(item.overdueOn),
      overdue_count: toApiTinyIntOrNull(item.overdueCount),
      overdur_rate: toApiNumberOrNull(item.overdurRate),
      grace_days: toApiTinyIntOrNull(item.graceDays),
      grace_on: toApiNumberOrNull(item.graceOn),
      is_npa: toApiTinyIntOrNull(item.isNpa),
      npa_after: toApiTinyIntOrNull(item.npaAfter),
      secure_prod_id: toApiNumberOrNull(item.secureProdId),
      max_allowed: toApiNumberOrNull(item.maxAllowed),
      member_type: toApiNumberOrNull(item.memberType),
      finance_type: toApiNumberOrNull(item.financeType),
      is_project: toApiTinyIntOrNull(item.isProject),
      is_mortg: toApiTinyIntOrNull(item.isMortg),
      is_gurr: toApiTinyIntOrNull(item.isGurr),
      prov_cur_gl: toApiNumberOrNull(item.provCurGl),
      prov_od_gl: toApiNumberOrNull(item.provOdGl),
    };

    if (prodId) {
      payload.prod_id = Number(prodId);
    }

    return payload;
  };

  const showApiError = (error, fallbackMessage) => {
    const details = error?.response?.data?.details;
    if (details && typeof details === "object") {
      Object.values(details)
        .flat()
        .forEach((msg) => toast.error(msg));
      return;
    }
    toast.error(fallbackMessage || "Something went wrong");
  };

  const postLoanProductApiCall = async (orgId, item) => {
    setPostLoading(true);
    try {
      const res = await postLoanProductAPI(buildPayload(orgId, item));
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset(defaultFormValues);
        setOpenDialouge(false);
        setCurrentPage(1);
        getLoanProductListApiCall(orgId, 1, pageLimit);
      } else {
        toast.error(res.details || res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      showApiError(error);
    } finally {
      setPostLoading(false);
    }
  };

  const putLoanProductApiCall = async (prodId, orgId, item) => {
    setUpdateLoading(true);
    try {
      const res = await updateLoanProductAPI(
        buildPayload(orgId, item, prodId),
      );
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset(defaultFormValues);
        setOpenDialouge(false);
        getLoanProductListApiCall(orgId, currentPage, pageLimit);
      } else {
        toast.error(res.details || res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      showApiError(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getLoanProductListApiCall = async (
    orgId,
    page = currentPage,
    limit = pageLimit,
  ) => {
    setGetLoading(true);
    try {
      const res = await getLoanProductListAPI(orgId, page, limit);
      if (res.message === "Data Found") {
        const list = Array.isArray(res.details)
          ? res.details
          : res.details?.data || [];
        dispatch(getLoanProductListData(list));
        setLastPage(res.details?.last_page || 1);
        if (res.details?.current_page) {
          setCurrentPage(res.details.current_page);
        }
      } else {
        dispatch(getLoanProductListData([]));
        setLastPage(res.details?.last_page || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getLoanProductListData([]));
      setLastPage(0);
    } finally {
      setGetLoading(false);
    }
  };

  const getProductTypeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getLoanProductTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getProductTypeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getProductTypeData([]));
    }
  };

  const getDurationUnitDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getLoanDurationUnitAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getDurationUnitData(list));
    } catch (error) {
      console.error(error);
      dispatch(getDurationUnitData([]));
    }
  };

  const getMemberTypeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getLoanProductMemberTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res), [
        "Option_Value",
        "Member_Type",
        "Type_Name",
        "Name",
      ]);
      dispatch(getMemberTypeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getMemberTypeData([]));
    }
  };

  const getLedgerDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getLoanProductLedgerAPI(orgId);
      let list = normalizeOptionRows(extractList(res), [
        "Ledger_Name",
        "Option_Value",
        "Name",
      ]);
      if (list.length === 0) {
        const headRes = await getLoanProductLedgerHeadAPI();
        list = normalizeOptionRows(extractList(headRes), [
          "Ledger_Name",
          "Option_Value",
          "Name",
        ]);
      }
      dispatch(getLedgerData(list));
    } catch (error) {
      console.error(error);
      try {
        const headRes = await getLoanProductLedgerHeadAPI();
        const list = normalizeOptionRows(extractList(headRes), [
          "Ledger_Name",
          "Option_Value",
          "Name",
        ]);
        dispatch(getLedgerData(list));
      } catch (fallbackError) {
        console.error(fallbackError);
        dispatch(getLedgerData([]));
      }
    }
  };

  const getSecureProductDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getSecureDepositProductAPI(orgId);
      const raw = extractList(res);
      const list = normalizeOptionRows(raw, ["Product_Name", "Option_Value"]);
      dispatch(getSecureProductData(list.length ? list : raw));
    } catch (error) {
      console.error(error);
      dispatch(getSecureProductData([]));
    }
  };

  const loadMasterDropdowns = async (orgId) => {
    if (!orgId) return;
    await Promise.all([
      getProductTypeDataApiCall(orgId),
      getDurationUnitDataApiCall(orgId),
      getMemberTypeDataApiCall(orgId),
      getLedgerDataApiCall(orgId),
      getSecureProductDataApiCall(orgId),
    ]);
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        productType: editData.Product_Type?.toString() || "",
        loanType: editData.Loan_Type?.toString() || "",
        productName: editData.Product_Name || "",
        prodShName: editData.Prod_Sh_Name || "",
        minAmt: editData.Min_Amt?.toString() || "",
        maxAmt: editData.Max_Amt?.toString() || "",
        minDur: editData.Min_Dur?.toString() || "",
        maxDur: editData.Max_Dur?.toString() || "",
        durUnit: editData.Dur_Unit?.toString() || "",
        roi: editData.Roi?.toString() || "",
        prnCurrGl: editData.Prn_Curr_Gl?.toString() || "",
        prnOdGl: editData.Prn_Od_Gl?.toString() || "",
        inttCurrGl: editData.Intt_Curr_GL?.toString() || "",
        inttOdGl: editData.Intt_Od_Gl?.toString() || "",
        isOverdue:
          editData.Is_Overdue === null || editData.Is_Overdue === undefined
            ? "0"
            : editData.Is_Overdue.toString(),
        overdueOn: editData.Overdue_On?.toString() || "",
        overdueCount: editData.Overdue_Count?.toString() || "",
        overdurRate: editData.Overdur_Rate?.toString() || "",
        graceDays: editData.Grace_Days?.toString() || "",
        graceOn: editData.Grace_On?.toString() || "",
        isNpa:
          editData.Is_NPA === null || editData.Is_NPA === undefined
            ? "0"
            : editData.Is_NPA.toString(),
        npaAfter: editData.Npa_After?.toString() || "",
        secureProdId: editData.Secure_Prod_Id?.toString() || "",
        maxAllowed: editData.Max_Allowed?.toString() || "",
        memberType: editData.Member_Type?.toString() || "",
        financeType: editData.Finance_Type?.toString() || "",
        isProject:
          editData.Is_Project === null || editData.Is_Project === undefined
            ? "0"
            : editData.Is_Project.toString(),
        isMortg:
          editData.Is_Mortg === null || editData.Is_Mortg === undefined
            ? "0"
            : editData.Is_Mortg.toString(),
        isGurr:
          editData.Is_Gurr === null || editData.Is_Gurr === undefined
            ? "0"
            : editData.Is_Gurr.toString(),
        provCurGl: editData.Prov_Cur_GL?.toString() || "",
        provOdGl: editData.Prov_Od_Gl?.toString() || "",
      });
    } else {
      form.reset(defaultFormValues);
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (!openDialouge) {
      setEditData(null);
      form.reset(defaultFormValues);
    }
  }, [openDialouge]);

  return {
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    form,
    handleSubmit,
    editData,
    handleEditData,
    getLoanProductListApiCall,
    getProductTypeDataApiCall,
    getDurationUnitDataApiCall,
    getMemberTypeDataApiCall,
    getLedgerDataApiCall,
    getSecureProductDataApiCall,
    loadMasterDropdowns,
    currentPage,
    setCurrentPage,
    lastPage,
    pageLimit,
  };
};
