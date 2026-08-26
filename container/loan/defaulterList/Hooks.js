"use client";

import { useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getDefaulterListAPI } from "./DefaulterListApis";

export const useDefaulterList = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [asOnDate, setAsOnDate] = useState(null);
  const [productType, setProductType] = useState("");
  const [reportType, setReportType] = useState("");

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const formSchema = yup.object({
    asOnDate: yup.date().required("As on date is required"),
    productType: yup.string().required("Product type is required"),
    reportType: yup.string().required("Report type is required"),
    branch: yup.string().required("Branch is required"),
    viewType: yup.string().required("View type is required"),
    fromMonth: yup.string(),
    toMonth: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      asOnDate: null,
      productType: "",
      reportType: "",
      branch: `${branchId}`,
      viewType: "0",
      fromMonth: "",
      toMonth: "",
    },
  });

  const handleSubmit = (values) => {
    getDefaulterListApiCall(values);
    setAsOnDate(values.asOnDate);
    setProductType(values.productType);
    setReportType(values.reportType);
  };

  const getDefaulterListApiCall = async (item) => {
    setLoading(true);

    const postAsOnDate = item.asOnDate && format(item.asOnDate, "yyyy-MM-dd");

    try {
      const res = await getDefaulterListAPI(
        orgId,
        item.productType,
        postAsOnDate,
        item.fromMonth || 0,
        item.toMonth || 0,
        item.reportType,
        item.viewType,
      );

      if (res.message === "Data Found") {
        // Safeguard against undefined or unexpected res.details
        const details = Array.isArray(res.details) ? res.details : [];

        const groupedData = details.reduce(
          (acc, current) => {
            const principal = parseFloat(current.Balance) || 0;
            const interest = parseFloat(current.Interest) || 0;
            const odPrincipal = parseFloat(current.OD_Principal) || 0;
            const odInterest = parseFloat(current.OD_Interest) || 0;

            // Collect each row in transactions
            acc.transactions.push(current);

            // Update totals
            acc.grandTotalPrincipal += principal;
            acc.grandTotalInterest += interest;
            acc.grandTotalOdPrincipal += odPrincipal;
            acc.grandTotalOdInterest += odInterest;

            return acc;
          },
          {
            transactions: [],
            grandTotalPrincipal: 0,
            grandTotalInterest: 0,
            grandTotalOdPrincipal: 0,
            grandTotalOdInterest: 0,
          },
        );

        // Construct final object with separate totals object
        const finalData = {
          transactions: groupedData.transactions,
          grandTotal: {
            principal: groupedData.grandTotalPrincipal,
            interest: groupedData.grandTotalInterest,
            odPrincipal: groupedData.grandTotalOdPrincipal,
            odInterest: groupedData.grandTotalOdInterest,
          },
        };

        setTableData(finalData);
        console.log(finalData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    asOnDate,
    productType,
    reportType,
  };
};
