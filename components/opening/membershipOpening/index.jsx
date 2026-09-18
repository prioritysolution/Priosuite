"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const MembershipOpening = ({
  loading,
  addOpeningLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  const { t } = useTranslation();

  const memberTypeData = useSelector(
    (state) => state?.shareProduct?.memberTypeData,
  );

  const relationTypeData = useSelector(
    (state) => state?.memberProfile?.relationTypeData,
  );

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.membershipOpening.title")}
        </h3>

        <ScrollArea className="w-full h-full   ">
          <div className="w-full mb-10">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              loading={loading}
              resetTrigger={resetTrigger}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.membershipOpening.basicInfo.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="memberName"
                      label={t("opening.membershipOpening.basicInfo.memberName")}
                      placeholder={t("opening.membershipOpening.basicInfo.memberNamePlaceholder",
                      )}
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="gurdianName"
                      label={t("opening.membershipOpening.basicInfo.guardianName")}
                      placeholder={t("opening.membershipOpening.basicInfo.guardianNamePlaceholder",
                      )}
                      readOnly
                    />
                    <TextareaField
                      control={form.control}
                      name="address"
                      label={t("opening.membershipOpening.basicInfo.address")}
                      placeholder={t("opening.membershipOpening.basicInfo.addressPlaceholder",
                      )}
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="mobile"
                      label={t("opening.membershipOpening.basicInfo.mobile")}
                      placeholder={t("opening.membershipOpening.basicInfo.mobilePlaceholder",
                      )}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.membershipOpening.admission.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DatePickerField
                      control={form.control}
                      name="date"
                      label={t("opening.membershipOpening.admission.admissionDate")}
                      endYear={getYear(new Date(startDate))}
                      disabledDateAfter={new Date(startDate).setDate(
                        new Date(startDate).getDate() - 1,
                      )}
                      isBackDate={true}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="admissionNo"
                      label={t("opening.membershipOpening.admission.admissionNo")}
                      placeholder={t("opening.membershipOpening.admission.admissionNoPlaceholder",
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label={t("opening.membershipOpening.admission.ledgerFolio")}
                      placeholder={t("opening.membershipOpening.admission.ledgerFolioPlaceholder",
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memberType"
                      render={({ field }) => (
                        <DropdownField
                          label={t("opening.membershipOpening.admission.memberType")}
                          value={field.value}
                          onChange={field.onChange}
                          options={memberTypeData}
                          optionLabelKey="Option_Value"
                          placeholder={t("opening.membershipOpening.admission.memberTypePlaceholder",
                          )}
                          searchPlaceholder={t("opening.membershipOpening.admission.searchMemberType",
                          )}
                          isRequired
                        />
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeName"
                      label={t("opening.membershipOpening.admission.nomineeName")}
                      placeholder={t("opening.membershipOpening.admission.nomineeNamePlaceholder",
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nomineeRelation"
                      render={({ field }) => (
                        <DropdownField
                          label={t("opening.membershipOpening.admission.nomineeRelation",
                          )}
                          value={field.value}
                          onChange={field.onChange}
                          options={relationTypeData}
                          optionLabelKey="Option_Value"
                          placeholder={t("opening.membershipOpening.admission.nomineeRelationPlaceholder",
                          )}
                          searchPlaceholder={t("opening.membershipOpening.admission.searchRelation",
                          )}
                        />
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAge"
                      label={t("opening.membershipOpening.admission.nomineeAge")}
                      placeholder={t("opening.membershipOpening.admission.nomineeAgePlaceholder",
                      )}
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAddress"
                      label={t("opening.membershipOpening.admission.nomineeAddress")}
                      placeholder={t("opening.membershipOpening.admission.nomineeAddressPlaceholder",
                      )}
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.membershipOpening.share.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="openingShare"
                      label={t("opening.membershipOpening.share.openingShare")}
                      placeholder={t("opening.membershipOpening.share.openingSharePlaceholder",
                      )}
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="openingDividend"
                      label={t("opening.membershipOpening.share.openingDividend")}
                      placeholder={t("opening.membershipOpening.share.openingDividendPlaceholder",
                      )}
                      type="number"
                      isRequired
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  disabled={addOpeningLoading}
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                >
                  {addOpeningLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("opening.membershipOpening.buttons.add")
                  )}
                </Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default MembershipOpening;
