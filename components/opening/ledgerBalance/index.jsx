"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useWatch } from "react-hook-form";

const LedgerBalance = ({
  loading,
  getLedgerLoading,
  getSubHeadLoading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const { t } = useTranslation();
  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);
  const acctTypeData = useSelector(
    (state) => state?.ledgerBalance?.acctTypeData,
  );
  const mainHeadData = useSelector(
    (state) => state?.ledgerBalance?.mainHeadData,
  );
  const subHeadData = useSelector((state) => state?.ledgerBalance?.subHeadData);
  const ledgerData = useSelector((state) => state?.ledgerBalance?.ledgerData);

  const acctType = useWatch({ control: form.control, name: "acctType" });
  const mainHead = useWatch({ control: form.control, name: "mainHead" });
  const subHead = useWatch({ control: form.control, name: "subHead" });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.ledgerBalance.title")}
        </h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-3">
                  <DropdownField
                    control={form.control}
                    name="branch"
                    label={t("opening.ledgerBalance.fields.branch")}
                    options={branchData}
                    optionLabelKey="Branch_Name"
                    placeholder={t("opening.ledgerBalance.placeholders.branch")}
                    searchPlaceholder={t("opening.ledgerBalance.placeholders.searchBranch",
                    )}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="acctType"
                    label={t("opening.ledgerBalance.fields.accountCategory")}
                    options={acctTypeData}
                    optionLabelKey="Cat_Name"
                    placeholder={t("opening.ledgerBalance.placeholders.accountCategory",
                    )}
                    searchPlaceholder={t("opening.ledgerBalance.placeholders.searchAccountCategory",
                    )}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="mainHead"
                    label={t("opening.ledgerBalance.fields.mainHead")}
                    options={mainHeadData}
                    optionLabelKey="Head_Name"
                    placeholder={t("opening.ledgerBalance.placeholders.mainHead")}
                    searchPlaceholder={t("opening.ledgerBalance.placeholders.searchMainHead",
                    )}
                    disabled={!acctType}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="subHead"
                    label={t("opening.ledgerBalance.fields.subHead")}
                    options={subHeadData}
                    optionLabelKey="Sub_Head"
                    optionValueKey="Id"
                    loading={getSubHeadLoading}
                    placeholder={t("opening.ledgerBalance.placeholders.subHead")}
                    searchPlaceholder={t("opening.ledgerBalance.placeholders.searchSubHead",
                    )}
                    disabled={!mainHead}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="ledger"
                    label={t("opening.ledgerBalance.fields.ledger")}
                    options={ledgerData}
                    optionLabelKey="Ledger_Name"
                    loading={getLedgerLoading}
                    placeholder={t("opening.ledgerBalance.placeholders.ledger")}
                    searchPlaceholder={t("opening.ledgerBalance.placeholders.searchLedger",
                    )}
                    disabled={!subHead}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="openingBalance"
                    label={t("opening.ledgerBalance.fields.openingBalance")}
                    placeholder={t("opening.ledgerBalance.placeholders.openingBalance",
                    )}
                    type="number"
                    isRequired
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-1/5 self-end"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader
                    color="#d7e6f4"
                    size={20}
                    speedMultiplier={0.7}
                  />
                ) : (
                  t("opening.ledgerBalance.buttons.add")
                )}
              </Button>
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
export default LedgerBalance;
