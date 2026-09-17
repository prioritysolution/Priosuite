"use client";

import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { addProvisionAPI } from "./ProvisionApis";
import { useSelector } from "react-redux";

export const useProvision = () => {
  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    date: yup.date().required("Voucher date is required"),
    ledger: yup.string().required("Ledger is required"),
    provisionType: yup.string().required("Provision type is required"),
    percent: yup
      .string()
      .test(
        "percent-or-amount",
        "Either Percent or Amount is required",
        function (value) {
          const { amount } = this.parent;
          if (!value && !amount) return false; // both empty → fail
          if (value) {
            const numberValue = parseFloat(value);
            return numberValue > 0; // percent must be > 0 if filled
          }
          return true; // valid if amount has value
        },
      ),
    amount: yup
      .string()
      .test(
        "amount-or-percent",
        "Either Amount or Percent is required",
        function (value) {
          const { percent } = this.parent;
          if (!value && !percent) return false; // both empty → fail
          if (value) {
            const numberValue = parseFloat(value);
            return numberValue > 0; // amount must be > 0 if filled
          }
          return true; // valid if percent has value
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: endDate ? new Date(endDate) : null,
      ledger: "",
      percent: "",
      amount: "",
    },
  });

  const { control } = form;

  const { amount, percent } = useWatch({ control });

  const handleSubmit = async (values) => {
    if (orgId) {
      postProvisionApiCall(values);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postProvisionApiCall = async (item) => {
    let data = {
      prov_date: item.date ? format(item.date, "yyyy-MM-dd") : null,
      ledg_id: item.ledger || "",
      prov_type: item.provisionType || "",
      prov_perc: item.percent || "",
      prov_amt: item.amount || "",
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await addProvisionAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset({
          date: item.date,
        });
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

  useEffect(() => {
    if (endDate) form.setValue("date", new Date(endDate));
  }, [endDate]);

  useEffect(() => {
    if (amount || percent) {
      form.trigger("amount");
      form.trigger("percent");
    }
  }, [amount, percent]);

  return {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
  };
};
