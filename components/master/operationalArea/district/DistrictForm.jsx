import { useTranslation } from "react-i18next";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ClipLoader } from "react-spinners";

const DistrictForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  stateData,
  onCancel,
}) => {
  const { t } = useTranslation();

  const isEdit = editData && Object.keys(editData).length > 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        autoComplete="off"
      >
        <InputField
          control={form.control}
          name="name"
          label={t("master.operationalArea.fields.districtName")}
          placeholder={t("master.operationalArea.placeholders.districtName")}
          isRequired
        />
        <DropdownField
          control={form.control}
          name="stateId"
          label={t("master.operationalArea.fields.state")}
          options={stateData}
          optionLabelKey="State_Name"
          placeholder={t("master.operationalArea.placeholders.state")}
          searchPlaceholder={t("master.operationalArea.placeholders.searchState")}
        />
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-[110px] rounded-lg px-5"
            onClick={onCancel}
            disabled={postLoading || updateLoading}
          >
            {t("common.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            className="h-10 min-w-[120px] rounded-lg px-6"
            disabled={postLoading || updateLoading}
          >
            {postLoading || updateLoading ? (
              <ClipLoader color="#fff" size={18} speedMultiplier={0.7} />
            ) : isEdit ? (
              t("common.buttons.update")
            ) : (
              t("common.buttons.add")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DistrictForm;
