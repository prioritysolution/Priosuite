"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, subDays } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import { postDenominationAPI } from "./DenominationApis";

export const useDenomination = () => {
  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // denominators
  const [denominators, setDenominators] = useState([]);

  // cash Transaction Total
  //   const [cashTransactionTotal, setCashTransactionTotal] = useState([]);

  //   const [cashTransactionGrandTotal, setCashTransactionGrandTotal] = useState(0);

  const [cashDenomArray, setCashDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const startDate = getCookieData("fin_start_date");

  const formSchema = yup.object({
    branchId: yup.string().required("Branch is required"),
    date: yup.date(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      branchId: "",
      date: startDate ? subDays(new Date(startDate), 1) : "",
    },
  });

  const handleSubmit = async (values) => {
    postDenominationApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postDenominationApiCall = async (item) => {
    const denomData = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      value: cash.denominator,
    }));

    let data = {
      open_date: formatDateForApi(item.date),
      branch_id: item.branchId,
      denom_data: denomData,
      org_id: orgId,
    };

    // console.log(data);

    setLoading(true);

    try {
      const res = await postDenominationAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset({ date: subDays(new Date(startDate), 1), branchId: "" });
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setDenominators(defaultDenominators);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //handle in denominators change
  const handleDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...denominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setDenominators(newDenominators);
    }
  };

  //handle cash transaction grand total
  //   const calculateCashTransactionTotalAmount = (note, denominator) => {
  //     const parsedNote = parseFloat(note);
  //     const parsedDenominators = parseFloat(denominator);
  //     if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
  //       return parsedNote * parsedDenominators;
  //     }
  //     return 0;
  //   };

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setDenominators(defaultDenominators);
    // const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    // setCashTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  //   useEffect(() => {
  //     const newTotalAmounts = cashDenomData.map((cash, index) =>
  //       calculateCashTransactionTotalAmount(cash.Note_Value, denominators[index])
  //     );

  //     setCashTransactionTotal(newTotalAmounts);
  //   }, [denominators, cashDenomData]);

  //   useEffect(() => {
  //     // Calculate grand total
  //     const newGrandTotal = cashTransactionTotal.reduce(
  //       (acc, curr) => acc + curr,
  //       0
  //     );
  //     setCashTransactionGrandTotal(newGrandTotal);
  //   }, [cashTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(denominators[idx]) || 0,
      };
    });
    setCashDenomArray(postData);
  }, [denominators]);

  useEffect(() => {
    if (startDate) form.setValue("date", subDays(new Date(startDate), 1));
  }, [startDate]);

  return {
    loading,
    cashDenomData,
    denominators,
    // cashTransactionTotal,
    // cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
  };
};
