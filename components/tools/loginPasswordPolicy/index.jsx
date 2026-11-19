"use client";

import InputField from "@/common/formFields/InputField";
import { TimePickerField } from "@/common/formFields/TimePickerField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";

const CheckField = ({ control, name, label }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          </FormControl>
          {label}
        </FormLabel>
      </FormItem>
    )}
  />
);

const LoginPasswordPolicy = ({ form, handleSubmit, loading, saving }) => {
  const { t } = useTranslation();
  const passwordsExpire = useWatch({
    control: form.control,
    name: "is_expire",
  });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h1 className="text-2xl font-semibold text-center">
          {t("loginPasswordPolicy.title")}
        </h1>

        <ScrollArea className="h-full w-full">
          <Form {...form}>
            <form
              autoComplete="off"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 pb-4 w-full"
            >
              <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                <section className="flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h2 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("loginPasswordPolicy.loginAttemptRules")}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    control={form.control}
                    name="max_attempts"
                    type="number"
                    label={t("loginPasswordPolicy.maxAttempts")}
                    hint={t("loginPasswordPolicy.maxAttemptsHint")}
                    isRequired
                    autoComplete="off"
                  />
                  <InputField
                    control={form.control}
                    name="lock_duration_min"
                    type="number"
                    label={t("loginPasswordPolicy.lockDuration")}
                    hint={t("loginPasswordPolicy.lockDurationHint")}
                    isRequired
                    autoComplete="off"
                  />
                  <TimePickerField
                    control={form.control}
                    name="daily_reset_time"
                    label={t("loginPasswordPolicy.dailyResetTime")}
                    hint={t("loginPasswordPolicy.dailyResetTimeHint")}
                    placeholder={t("loginPasswordPolicy.dailyResetTime")}
                    clearLabel={t("loginPasswordPolicy.clearDailyResetTime")}
                    isRequired
                  />
                </div>
              </section>

              <section className="flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h2 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("loginPasswordPolicy.passwordPolicy")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    control={form.control}
                    name="min_chars"
                    type="number"
                    label={t("loginPasswordPolicy.minChars")}
                    hint={t("loginPasswordPolicy.minCharsHint")}
                    isRequired
                    autoComplete="off"
                  />
                  <InputField
                    control={form.control}
                    name="max_chars"
                    type="number"
                    label={t("loginPasswordPolicy.maxChars")}
                    hint={t("loginPasswordPolicy.maxCharsHint")}
                    isRequired
                    autoComplete="off"
                  />
                </div>

                <p className="mb-2 mt-4 text-sm font-medium text-slate-800">
                  {t("loginPasswordPolicy.complexity")}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CheckField
                    control={form.control}
                    name="req_upper"
                    label={t("loginPasswordPolicy.reqUpper")}
                  />
                  <CheckField
                    control={form.control}
                    name="req_lower"
                    label={t("loginPasswordPolicy.reqLower")}
                  />
                  <CheckField
                    control={form.control}
                    name="req_number"
                    label={t("loginPasswordPolicy.reqNumber")}
                  />
                  <CheckField
                    control={form.control}
                    name="req_special"
                    label={t("loginPasswordPolicy.reqSpecial")}
                  />
                </div>

                <div className="mt-4">
                  <InputField
                    control={form.control}
                    name="unique_recent"
                    type="number"
                    label={t("loginPasswordPolicy.uniqueRecent")}
                    hint={t("loginPasswordPolicy.uniqueRecentHint")}
                    isRequired
                    autoComplete="off"
                  />
                </div>

                <div className="mt-4">
                  <CheckField
                    control={form.control}
                    name="is_expire"
                    label={t("loginPasswordPolicy.passwordsExpire")}
                  />
                </div>

                {passwordsExpire ? (
                  <div className="mt-4">
                    <InputField
                      control={form.control}
                      name="expire_days"
                      type="number"
                      label={t("loginPasswordPolicy.expireDays")}
                      hint={t("loginPasswordPolicy.expireDaysHint")}
                      isRequired
                      autoComplete="off"
                    />
                  </div>
                ) : null}
              </section>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || saving} className="w-full sm:w-1/5 self-end gap-2">
                {saving ? (
                  <ClipLoader color="#d7e6f4" size={16} speedMultiplier={0.7} />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {t("loginPasswordPolicy.saveRules")}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
      </div>

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <ClipLoader color="#00264D" size={28} speedMultiplier={0.7} />
        </div>
      ) : null}
    </div>
  );
};

export default LoginPasswordPolicy;
