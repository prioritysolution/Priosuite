import { useTranslation } from "react-i18next";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ClipLoader } from "react-spinners";

const SubLedgerForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  headListData,
}) => {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-3 py-5"
        autoComplete="off"
      >
        <InputField
          control={form.control}
          name="ledgerName"
          label={t("master.subLedger.fields.ledgerName")}
          placeholder={t("master.subLedger.placeholders.ledgerName")}
        />

        {/* <div onFocus={handleStopPropagation} onClick={handleStopPropagation}> */}
        <DropdownField
          control={form.control}
          name="underHead"
          label={t("master.subLedger.fields.underHead")}
          options={headListData || []}
          optionLabelKey="Ledger_Name"
          placeholder={t("master.subLedger.placeholders.underHead")}
          searchPlaceholder={t("master.subLedger.placeholders.searchUnderHead")}
        />

        <InputField
          control={form.control}
          name="openingBalance"
          label={t("master.subLedger.fields.openingBalance")}
          placeholder={t("master.subLedger.placeholders.openingBalance")}
          type="number"
        />

        <div className="w-full flex items-center justify-end">
          <Button
            type="submit"
            className="w-1/4"
            disabled={postLoading || updateLoading}
          >
            {postLoading || updateLoading ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : editData && Object.keys(editData).length > 0 ? (
              t("common.buttons.edit")
            ) : (
              t("common.buttons.add")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SubLedgerForm;
