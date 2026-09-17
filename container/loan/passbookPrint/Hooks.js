"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getPassbookPrintAPI,
  updatePassbookTransAPI,
} from "./PassbookPrintApis";

export const usePassbookPrint = () => {
  const startDate = getCookieData("fin_start_date");
  const endDate = getCookieData("fin_end_date");

  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState(false);

  const [dialougeOpen, setDialougeOpen] = useState(false);

  const [pageParameter, setPageParameter] = useState(null);
  const [pageData, setPageData] = useState([]);

  const [showPage, setShowPage] = useState("");

  const [showLine, setShowLine] = useState(1);
  const [lastItem, setLastItem] = useState(null);

  const [sl, setSl] = useState("");
  const [lastDate, setLastDate] = useState("");

  const formSchema = yup.object({
    printType: yup.string().nullable(),
    line: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return true;
        const maxDate =
          new Date(endDate) > new Date()
            ? format(new Date(), "yyyy-MM-dd")
            : endDate;
        return (
          format(value, "yyyy-MM-dd") >= startDate &&
          format(value, "yyyy-MM-dd") <= maxDate
        );
      }),
    accountNo: yup.string().required("Account No is required"),
    dialougeMemberNo: yup.string(),
    dialougeAccountName: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      //   date: new Date(startDate),
      line: "",
      printType: "1",
      accountNo: "",
      dialougeMemberNo: "",
      dialougeAccountName: "",
    },
  });

  const { printType, accountNo } = form.watch();

  const handleSubmit = (values) => {
    if (values.printType === "1") getPassbokFrontPageApiCall(values);
    else {
      if (values.date && values.line) getPassbokTransPageApiCall(values);
      else toast.error("Please enter a valid date and line");
    }
  };

  const handleSelectAccount = (data) => {
    form.setValue("accountNo", data.Account_No);
    setDialougeOpen(false);
  };

  const handleUpdateTrans = (lastLine) => {
    if (orgId) updatePassbokTransPageApiCall(orgId, lastLine);
  };

  const getPassbokFrontPageApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await getPassbookPrintAPI(orgId, item.accountNo, "", "", 1);

      if (res.message === "Data Found") {
        setPageParameter(res.details.Parameater[0]);
        setPageData(res.details.Details);
        setShowPage("FIRST");
      } else {
        setPageParameter(null);
        setPageData([]);
        // toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      setPageParameter(null);
      setPageData([]);
      //   toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPassbokTransPageApiCall = async (item) => {
    setLoading(true);

    const postSl =
      format(item.date, "yyyy-MM-dd") === format(lastDate, "yyyy-MM-dd")
        ? sl
        : "";

    try {
      const res = await getPassbookPrintAPI(
        orgId,
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        postSl,
        3,
      );

      if (res.message === "Data Found") {
        setPageParameter(res.details.Parameater[0]);
        setPageData(res.details.Details);
        setLastItem(res.details.Details[res.details.Details.length - 1]);
        setShowLine(item.line);
        setShowPage("TRANS");
      } else {
        setPageParameter(null);
        setPageData([]);
        // toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      setPageParameter(null);
      setPageData([]);
      //   toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updatePassbokTransPageApiCall = async (orgId, lastLine) => {
    setLoading(true);

    const data = {
      org_id: orgId,
      acct_id: lastItem?.Acct_Id,
      last_date: lastItem?.Trans_Date,
      last_line: lastLine,
      last_trans_sl: lastItem?.Id,
    };

    try {
      const res = await updatePassbookTransAPI(data);

      // if (res.message === "Data Found") {
      //   setShowLine(item.line);
      // } else {
      //   setPageParameter(null);
      //   // toast.error(res.details);
      // }
    } catch (error) {
      console.error(error);
      //   toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPassbokTransParamsApiCall = async (accountNo) => {
    setLoading(true);

    try {
      const res = await getPassbookPrintAPI(orgId, accountNo, "", "", 2);

      if (res.message === "Data Found") {
        if (!res.details?.Details) {
          form.setValue("date", new Date(startDate));
          form.setValue("line", 1);
          setLastDate(new Date(startDate));
          setSl("");
        } else {
          form.setValue("date", new Date(res.details.Details[0].Last_Date));
          form.setValue("line", res.details.Details[0].Last_Line);
          setSl(res.details.Details[0].Last_Trans_Sl);
          setLastDate(new Date(res.details.Details[0].Last_Date));
        }
      } else {
        form.setValue("date", new Date(startDate));
        form.setValue("line", 1);
        setSl("");
        // toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      //   toast.error("Something went wrong");
      form.setValue("date", new Date(startDate));
      form.setValue("line", 1);
      setSl("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (printType === "2" && accountNo) {
      getPassbokTransParamsApiCall(accountNo);
    }
  }, [printType, accountNo]);

  return {
    loading,
    form,
    handleSubmit,
    handleSelectAccount,
    dialougeOpen,
    setDialougeOpen,
    pageParameter,
    pageData,
    showPage,
    showLine,
    handleUpdateTrans,
  };
};
