"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

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
  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const mainHeadData = useSelector(
    (state) => state?.ledgerBalance?.mainHeadData
  );

  const subHeadData = useSelector((state) => state?.ledgerBalance?.subHeadData);

  const ledgerData = useSelector((state) => state?.ledgerBalance?.ledgerData);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Ledger Balance</h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <DropdownField
                    control={form.control}
                    name="branch"
                    label="Branch"
                    options={branchData}
                    optionLabelKey="Branch_Name"
                    placeholder="Select branch"
                    searchPlaceholder="Search branch..."
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="mainHead"
                    label="Main Head"
                    options={mainHeadData}
                    optionLabelKey="Head_Name"
                    placeholder="Select main head"
                    searchPlaceholder="Search main head..."
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="subHead"
                    label="Sub Head"
                    options={subHeadData}
                    optionLabelKey="Sub_Head_Name"
                    loading={getSubHeadLoading}
                    disabled={!form.getValues("mainHead")}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="ledger"
                    label="Ledger"
                    options={ledgerData}
                    optionLabelKey="Ledger_Name"
                    loading={getLedgerLoading}
                    disabled={!form.getValues("subHead")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="openingBalance"
                    label="Opening Balance"
                    placeholder="Enter opening balance"
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
                  "Add"
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
