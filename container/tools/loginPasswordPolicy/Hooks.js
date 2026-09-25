"use client";

import { useRef, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import getCookieData from "@/utils/getCookieData";
import {
  addLoginPasswordPolicyAPI,
  getLoginPasswordPolicyAPI,
  updateLoginPasswordPolicyAPI,
} from "./LoginPasswordPolicyApis";

const defaultValues = {
  max_attempts: "3",
  lock_duration_min: "30",
  daily_reset_time: "00:00",
  min_chars: "10",
  max_chars: "12",
  req_upper: true,
  req_lower: true,
  req_number: true,
  req_special: true,
  unique_recent: "5",
  is_expire: true,
  expire_days: "90",
};

const toFlag = (value) => (value ? 1 : 0);

const toTime = (value) => {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "";
};

const intField = (t, min, max, requiredMessage) =>
  yup
    .number()
    .typeError(t("loginPasswordPolicy.enterNumberRange", { min, max }))
    .integer(t("loginPasswordPolicy.wholeNumber"))
    .min(min, t("loginPasswordPolicy.minimumIs", { min }))
    .max(max, t("loginPasswordPolicy.maximumIs", { max }))
    .required(requiredMessage);

const buildFormSchema = (t) =>
  yup.object({
    max_attempts: intField(
      t,
      1,
      20,
      t("loginPasswordPolicy.maxAttemptsRequired"),
    ),
    lock_duration_min: intField(
      t,
      1,
      1440,
      t("loginPasswordPolicy.lockDurationRequired"),
    ),
    daily_reset_time: yup
      .string()
      .required(t("loginPasswordPolicy.dailyResetRequired"))
      .matches(/^\d{2}:\d{2}$/, t("loginPasswordPolicy.useHhMm")),
    min_chars: intField(t, 6, 64, t("loginPasswordPolicy.minCharsRequired")),
    max_chars: intField(t, 6, 128, t("loginPasswordPolicy.maxCharsRequired")).test(
      "gte-min",
      t("loginPasswordPolicy.maxAtLeastMin"),
      function validateMaxChars(value) {
        const min = Number(this.parent.min_chars);
        if (value == null || Number.isNaN(min)) return true;
        return value >= min;
      },
    ),
    req_upper: yup.boolean(),
    req_lower: yup.boolean(),
    req_number: yup.boolean(),
    req_special: yup.boolean(),
    unique_recent: intField(
      t,
      0,
      24,
      t("loginPasswordPolicy.uniqueRecentRequired"),
    ),
    is_expire: yup.boolean(),
    expire_days: yup
      .number()
      .transform((value, original) =>
        original === "" || original == null ? null : value,
      )
      .nullable()
      .when("is_expire", {
        is: true,
        then: (schema) =>
          intField(t, 1, 365, t("loginPasswordPolicy.expireDaysRequired")),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

const mapDetailsToForm = (details) => ({
  max_attempts: String(details.Max_Attempts ?? ""),
  lock_duration_min: String(details.Lock_Duration_Min ?? ""),
  daily_reset_time: toTime(details.Daily_Reset_Time) || "00:00",
  min_chars: String(details.Min_Chars ?? ""),
  max_chars: String(details.Max_Chars ?? ""),
  req_upper: Number(details.Req_Upper) === 1,
  req_lower: Number(details.Req_Lower) === 1,
  req_number: Number(details.Req_Number) === 1,
  req_special: Number(details.Req_Special) === 1,
  unique_recent: String(details.Unique_Recent ?? ""),
  is_expire: Number(details.Is_Expire) === 1,
  expire_days: String(details.Expire_Days ?? ""),
});

export const useLoginPasswordPolicy = () => {
  const { t } = useTranslation();
  const tRef = useRef(t);
  tRef.current = t;

  const orgId = getCookieData("orgId");
  const [policyId, setPolicyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: (values, context, options) =>
      yupResolver(buildFormSchema(tRef.current))(values, context, options),
    defaultValues,
  });

  const buildBody = (values) => {
    const body = {
     
      
      org_id: Number(orgId),
      max_attempts: Number(values.max_attempts),
      lock_duration_min: Number(values.lock_duration_min),
      daily_reset_time: toTime(values.daily_reset_time),
      min_chars: Number(values.min_chars),
      max_chars: Number(values.max_chars),
      req_upper: toFlag(values.req_upper),
      req_lower: toFlag(values.req_lower),
      req_number: toFlag(values.req_number),
      req_special: toFlag(values.req_special),
      unique_recent: Number(values.unique_recent),
      is_expire: toFlag(values.is_expire),
      expire_days: values.is_expire ? Number(values.expire_days) : 0,
    };

    if (policyId) body.policy_id = policyId;
    return body;
  };

  const getPolicyApiCall = async (nextOrgId) => {
    setLoading(true);
    try {
      const res = await getLoginPasswordPolicyAPI(nextOrgId);
      if (res?.message === "Data Found" && res.details) {
        setPolicyId(res.details.Id ?? null);
        form.reset(mapDetailsToForm(res.details));
      } else {
        setPolicyId(null);
        form.reset(defaultValues);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || t("loginPasswordPolicy.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!orgId) {
      toast.error(t("loginPasswordPolicy.orgMissing"));
      return;
    }

    setSaving(true);
    try {
      const body = buildBody(values);
      const res = policyId
        ? await updateLoginPasswordPolicyAPI(body)
        : await addLoginPasswordPolicyAPI(body);

      if (res?.message === "Success") {
        toast.success(res.details || t("loginPasswordPolicy.saved"));
        await getPolicyApiCall(orgId);
      } else {
        toast.error(res?.details || res?.message || t("loginPasswordPolicy.saveFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || t("loginPasswordPolicy.somethingWrong"));
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    handleSubmit,
    loading,
    saving,
    getPolicyApiCall,
  };
};
