"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import {
  getCalculateDividendAPI,
  getLastDividendPaidDateAPI,
  postCalculateDividendAPI,
} from "./CalculateDividendApis";

export const useCalculateDividend = () => {
  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    fromDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("From date is required")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return false;
        return (
          format(value, "yyyy-MM-dd") >= startDate &&
          format(value, "yyyy-MM-dd") <= endDate
        );
      }),
    uptoDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("Upto date is required")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return false;
        return (
          format(value, "yyyy-MM-dd") >= startDate &&
          format(value, "yyyy-MM-dd") <= endDate
        );
      }),
    dividendRate: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null for handling missing fields
      .required("No. of share is required") // Required message
      .test(
        "is-integer",
        "No. of share must be an integer",
        (value) => value !== null && maxTwoDecimalPlaces.test(value) // Use regex for integer validation
      )
      .test(
        "is-greater-than-zero",
        "No. of share must be greater than 0",
        (value) => value !== null && parseInt(value, 10) > 0 // Ensure value is greater than 0
      ),
    postingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("Posting date is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      //   fromDate: new Date(),
      //   uptoDate: new Date(),
      //   postingDate: new Date(),
      dividendRate: "",
    },
  });

  const { fromDate, uptoDate, dividendRate } = form.watch();

  const handleSubmit = (values) => {
    postCalculateDividendApiCall(values);
  };

  const handleCalculateDividend = () => {
    if (fromDate && uptoDate && dividendRate)
      getCalculateDividendApiCall(
        orgId,
        format(form.getValues("fromDate"), "yyyy-MM-dd"),
        format(form.getValues("uptoDate"), "yyyy-MM-dd"),
        form.getValues("dividendRate")
      );
    else toast.error("Please add from date upto date and rate");
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postCalculateDividendApiCall = async (item) => {
    setLoading(true);

    const dividendData = tableData.map((data) => ({
      member_id: data.Id,
      dividend: data.Dividend,
    }));

    let data = {
      trans_date: format(item.postingDate, "yyyy-MM-dd"),
      from_date: format(item.fromDate, "yyyy-MM-dd"),
      to_date: format(item.uptoDate, "yyyy-MM-dd"),
      div_array: dividendData,
      branch_id: branchId,
      org_id: orgId,
    };
    try {
      const res = await postCalculateDividendAPI(data);
      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setTableData([]);
      } else {
        toast.error(res.details);
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

  const getLastDividendPaidDateApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getLastDividendPaidDateAPI(orgId);
      if (res.message === "Data Found") {
        // form.setValue("fromDate", res.details);
      } else {
        // form.setValue("fromDate", new Date(startDate));
        toast.error(res.details);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      //   form.setValue("fromDate", new Date(startDate));
    } finally {
      setLoading(false);
    }
  };

  const getCalculateDividendApiCall = async (
    orgId,
    fromDate,
    toDate,
    dividendRate
  ) => {
    setLoading(true);
    try {
      const res = await getCalculateDividendAPI(
        orgId,
        fromDate,
        toDate,
        dividendRate
      );

      if (res.message === "Data Found") {
        setTableData(res.details);
      } else {
        setTableData([]);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      setTableData([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate) form.setValue("fromDate", new Date(startDate));
  }, [startDate]);

  useEffect(() => {
    if (endDate) form.setValue("uptoDate", new Date(endDate));
  }, [endDate]);

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleCalculateDividend,
    getLastDividendPaidDateApiCall,
  };
};
