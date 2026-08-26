"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormMessage } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ClipLoader } from "react-spinners";

const IssueCheque = ({
  loading,
  getAccountLoading,
  postIssueChequeLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Issue Cheque</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full mb-10">
            <AccountSearchForm
              loading={getAccountLoading}
              handleSubmit={handleAccountFormSubmit}
              resetTrigger={resetTrigger}
              allowAlphanumeric
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
                    Account Details
                  </h3>
                  <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="accountNo"
                      label="Account No."
                      placeholder="Enter account no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="refAccountNo"
                      label="Ref. Account No."
                      placeholder="Enter  ref. account no."
                      readOnly
                    />

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
                      label="CIF. No."
                      placeholder="Enter cif. no."
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
                      name="guardianName"
                      label="Guardian Name"
                      placeholder="Enter guardian name"
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
                      name="availableBalance"
                      label="Available Balance"
                      placeholder="Enter available balance"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="operationMode"
                      label="Operation Mode"
                      placeholder="Enter operation mode"
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Cheque Details
                  </h3>
                  <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="fromNo"
                      label="From No."
                      placeholder="Enter from no."
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="toNo"
                      label="To No."
                      placeholder="Enter to no."
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="noOfLeaves"
                      label="No. of Leaves"
                      placeholder="Enter no. of leaves"
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="chargeAmount"
                      label="Charge Amount"
                      placeholder="Enter charge amount"
                      type="number"
                    />

                    <TextareaField
                      control={form.control}
                      name="amountInWords"
                      label="Amount in Words"
                      placeholder="Total amount in words"
                      className="text-red-500 text-base resize-none"
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button type="submit" className="w-full sm:w-1/5 self-end">
                  {postIssueChequeLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Save"
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
export default IssueCheque;
