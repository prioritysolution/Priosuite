"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCertificatePrintAPI } from "./CertificatePrintApis";
import { updatePassbookTransAPI } from "@/container/membership/passbookPrint/PassbookPrintApis";
import { format } from "date-fns";

export const useCertificatePrint = () => {
  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  const [dialougeOpen, setDialougeOpen] = useState(false);

  const formSchema = yup.object({
    accountNo: yup.string().required("Account No is required"),
    dialougeMemberNo: yup.string(),
    dialougeAccountName: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      dialougeMemberNo: "",
      dialougeAccountName: "",
    },
  });

  const handleSubmit = (values) => {
    getCertificateApiCall(values);
  };

  const handleSelectAccount = (data) => {
    form.setValue("accountNo", data.Account_No);
    setDialougeOpen(false);
  };

  const handleUpdateCertificate = () => {
    if (orgId) updateCertificateApiCall();
  };

  const getCertificateApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await getCertificatePrintAPI(orgId, item.accountNo);

      if (res.message === "Data Found") {
        setPageData(res.details[0]);
      } else {
        setPageData([]);
        toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      setPageData([]);
      //   toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateCertificateApiCall = async () => {
    setLoading(true);

    const data = {
      org_id: orgId,
      acct_id: pageData?.Acct_Id,
      last_date: format(new Date(), "yyyy-MM-dd"),
      last_line: 0,
      last_trans_sl: 0,
    };

    try {
      await updatePassbookTransAPI(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    handleSelectAccount,
    dialougeOpen,
    setDialougeOpen,
    pageData,
    handleUpdateCertificate,
  };
};
