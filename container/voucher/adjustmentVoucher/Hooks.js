"use client";
import { useEffect, useState, useRef } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAdjustmentVoucherLedgerListAPI,
  postAdjustmentVoucherAPI,
} from "./AdjustmentVoucherApis";
import { getLedgerListData } from "../voucherEntry/VoucherEntryReducer";
import {
  alphanumericWithHyphenUnderscoreRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";

export const useAdjustmentVoucher = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const endDate = getCookieData("fin_end_date");

  const [tableData, setTableData] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    date: yup.date().required("Voucher date is required"),
    manVoucherNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test(
        "is-valid-manual-vouch-no",
        "Manual voucher no. is invalid",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
        }
      ),
    narration: yup.string().required("Narration is required"),
    gl: yup.string().required("Gl is required"),
    amount: yup
      .string()
      .required("Amount is required") // Ensure the field is required
      .test(
        "is-greater-than-zero",
        "Amount must be greater than 0",
        (value) => {
          if (!value) return false; // If the value is empty, it's invalid
          const numberValue = parseFloat(value);
          return numberValue > 0; // Validate that the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Amount must be a valid number with up to 2 decimal places",
        (value) => {
          if (!value) return false; // If the value is empty, it's invalid
          return maxTwoDecimalPlaces.test(value); // Validate with regex for up to 2 decimal places
        }
      ),
    drCr: yup.string().required("Dr/Cr is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: null,
      manVoucherNo: "",
      narration: "",
      gl: "",
      amount: "",
      drCr: "",
    },
  });

  const handleSubmit = async (values) => {
    setTableData((prev) => {
      return [...prev, values];
    });
    form.resetField("gl");
    form.resetField("amount");
    form.resetField("drCr");
  };

  const handleDeleteTableData = async (idx) => {
    const newTableData = tableData.filter((_, index) => index !== idx);

    setTableData(newTableData);
  };

  const handlePostAdjustmentVoucher = async () => {
    if (tableData && tableData.length > 0 && totalCredit === totalDebit) {
      postAdjustmentVoucherApiCall();
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postAdjustmentVoucherApiCall = async () => {
    let data = {
      trans_date: form.getValues("date"),
      narration: form.getValues("narration"),
      manual_vouch_no: form.getValues("manVoucherNo"),
      vouch_data: tableData.map((data) => ({
        gl: data.gl,
        drCr: data.drCr,
        amount: data.amount,
      })),
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postAdjustmentVoucherAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setTableData([]);
        // toast.success(res.details || res.message);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const getAdjustmentVoucherLedgerListApiCall = async () => {
    setLoading(true);

    try {
      const res = await getAdjustmentVoucherLedgerListAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getLedgerListData(res.details));
      } else {
        dispatch(getLedgerListData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLedgerListData([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      let newTotalCredit = tableData
        .filter((data) => data.drCr === "C")
        .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);

      let newTotalDebit = tableData
        .filter((data) => data.drCr === "D")
        .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);

      setTotalCredit(newTotalCredit);
      setTotalDebit(newTotalDebit);
    } else {
      setTotalCredit(0);
      setTotalDebit(0);
    }
  }, [tableData]);

  useEffect(() => {
    form.reset({ date: endDate });
  }, [endDate]);

  return {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getAdjustmentVoucherLedgerListApiCall,
    tableData,
    totalCredit,
    totalDebit,
    handleDeleteTableData,
    handlePostAdjustmentVoucher,
  };
};
