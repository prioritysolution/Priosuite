"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Renewal = ({
  loading,
  getRenewalLoading,
  postRenewalLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  checkDepositDurationDisable,
  checkDepositDurationMessage,
  resetTrigger,
}) => {
  const durationTypeData = useSelector(
    (state) => state?.openDepositAccount?.durationTypeData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const operateProductData = useSelector(
    (state) => state?.deposit?.operateProductData,
  );

  console.log("form.getValues('durationUnit')", form.getValues("durationUnit"));
  

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        {/* <h3 className="text-2xl font-semibold ">Renewal</h3> */}

        <ScrollArea className="w-full h-full px-2 ">
          <div className="w-full mb-10">
            <AccountSearchForm
              handleSubmit={handleAccountFormSubmit}
              loading={getRenewalLoading}
              resetTrigger={resetTrigger}
              allowAlphanumeric
              formLabel="Renewal"
              operateProductData={operateProductData}
              showProduct={true}
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
                    Basic Info Block
                  </h3>
                  {getRenewalLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label="Member No."
                        placeholder="Enter member no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label="CIF No."
                        placeholder="Enter cif no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="refAcNo"
                        label="Manual / REF. Account No."
                        placeholder="Enter manual / ref. account no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label="Member Name"
                        placeholder="Enter member name"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label="Gurdian Name"
                        placeholder="Enter gurdian name"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label="Mobile No."
                        placeholder="Enter mobile no."
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="panNo"
                        label="Pan No."
                        placeholder="Enter pan no."
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="depositAmount"
                        label="Deposit Amount"
                        placeholder="Enter deposit amount"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="rateOfInterest"
                        label="Rate Of Interest"
                        placeholder="Enter rate of interest"
                        readOnly
                      />

                      <DatePickerField
                        control={form.control}
                        name="maturityDate"
                        label="Maturity Date"
                        disabled
                      />

                      <InputField
                        control={form.control}
                        name="maturityAmount"
                        label="Maturity Amount"
                        placeholder="Enter maturity amount"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Renewal Info Block
                  </h3>
                  {getRenewalLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <Skeleton className="w-full h-28 bg-secondary rounded-md" />
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <FormField
                        control={form.control}
                        name="renewalType"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full ">
                            <FormLabel>Select renewal type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-5 sm:space-y-0 gap-x-5"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="principal" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Principal Value
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="maturity" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Maturity Value
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DatePickerField
                        control={form.control}
                        name="renewalDate"
                        label="Renewal Date"
                        disabled
                      />

                      <DatePickerField
                        control={form.control}
                        name="effectDate"
                        label="Effect Date"
                        disabled
                      />

                      <InputField
                        control={form.control}
                        name="depositBalance"
                        label="Deposit Amount"
                        placeholder="Enter deposit amount"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="duration"
                        label="Duration"
                        placeholder="Enter duration"
                        type="number"
                        hint={checkDepositDurationMessage}
                        hintClassName="text-destructive text-sm"
                      />

                      <DropdownField
                        control={form.control}
                        name="durationUnit"
                        label="Duration Unit"
                        options={durationTypeData}
                        optionLabelKey="Option_Value"
                        placeholder="Select duration unit"
                        searchPlaceholder="Search duration unit..."
                      />

                      <InputField
                        control={form.control}
                        name="newRateOfInterest"
                        label="Rate Of Interest"
                        placeholder="Enter rate of interest"
                        className="w-full"
                        containerClassName="w-full"
                        readOnly
                      />

                      <DatePickerField
                        control={form.control}
                        name="newMaturityDate"
                        label="Maturity Date"
                        disabled
                      />

                      <InputField
                        control={form.control}
                        name="newMaturityAmount"
                        label="Maturity Amount"
                        placeholder="Enter maturity amount"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock &&
                form.getValues("renewalType") === "principal" && (
                  <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:p-5 gap-5">
                    <h3 className="w-full text-center text-xl font-semibold">
                      Transanction Block
                    </h3>
                    {getRenewalLoading ? (
                      <div className="w-full border border-primary rounded-md p-5 mb-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-[10px]"
                          >
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                        <div></div>
                        <div className="w-full flex flex-col gap-[10px]">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full border border-primary rounded-md p-5 mb-5 grid grid-cols-3 gap-5">
                        <InputField
                          control={form.control}
                          name="payoutAmount"
                          label="Payout Amount"
                          placeholder="Enter payout amount"
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="refVouchNo"
                          label="Ref. Vouch No."
                          placeholder="Enter ref. vouch no."
                        />
                        <FormField
                          control={form.control}
                          name="transMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit col-span-3">
                              <FormLabel>Select transanction mode</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="bank" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Bank
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="savings" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Savings
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {form.getValues("transMode") === "bank" ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                        <DropdownField
                          control={form.control}
                          name="bank"
                          label="Bank"
                          options={bankAccountData}
                          optionLabelKey="Bank_Name"
                          placeholder="Select bank"
                          searchPlaceholder="Search bank..."
                        />
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                        <DropdownField
                          control={form.control}
                          name="savings"
                          label="Savings"
                          options={savingsAccountData}
                          optionLabelKey="Account_No"
                          placeholder="Select savings"
                          searchPlaceholder="Search savings..."
                        />
                      </div>
                    )}
                  </div>
                )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={postRenewalLoading || checkDepositDurationDisable}
                >
                  {postRenewalLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Process To Renewal"
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
export default Renewal;
