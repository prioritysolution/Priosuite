import React from "react";
import { Form } from "@/components/ui/form";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import InterestCalculationTable from "./InterestCalculationTable";
import { Send, AlertCircle, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SevingsInterestCalculateComponents = ({
  form,
  handleSubmit,
  productList,
  interestDetails = [],
  isFromDateDisabled,
  loading,
  progress,
  handlePostInterest,
}) => {
  console.log("productList==", productList);

  const fromDateValue = form.watch("fromDate");
  const disabledDateBefore = fromDateValue
    ? new Date(
        new Date(fromDateValue).getFullYear(),
        new Date(fromDateValue).getMonth(),
        new Date(fromDateValue).getDate() + 1,
      )
    : undefined;

  // Retrieve beg_date from cookies
  const begDateCookie = getCookieData("beg_date");
  const defaultVoucherDate = begDateCookie
    ? new Date(begDateCookie)
    : new Date();

  // Dialog confirmation states
  const [showConfirmPost, setShowConfirmPost] = React.useState(false);
  const [postPayload, setPostPayload] = React.useState(null);

  // Calculate total interest amount from all records
  const totalInterest = React.useMemo(() => {
    return interestDetails.reduce(
      (sum, row) => sum + (parseFloat(row.interest_amount) || 0),
      0,
    );
  }, [interestDetails]);

  // Hook form for the sticky posting panel
  const postForm = useForm({
    defaultValues: {
      voucherDate: defaultVoucherDate,
      referenceVoucherNo: "",
      totalAmount: totalInterest,
    },
  });

  // Sync total interest amount when interestDetails changes
  React.useEffect(() => {
    postForm.setValue("totalAmount", totalInterest);
  }, [totalInterest, postForm]);

  const onPostSubmit = (values) => {
    setPostPayload(values);
    setShowConfirmPost(true);
  };

  const handleConfirmYes = () => {
    if (handlePostInterest && postPayload) {
      handlePostInterest({
        ...postPayload,
        interestDetails,
      });
    } else if (postPayload) {
      console.log(
        "Post Interest values:",
        postPayload,
        "with details:",
        interestDetails,
      );
    }
    setShowConfirmPost(false);
    setPostPayload(null);
  };

  const handleConfirmNo = () => {
    setShowConfirmPost(false);
    setPostPayload(null);
  };

  return (
    <div className="w-full h-full p-1 bg-[#fefefe] rounded-lg flex flex-col justify-between">
      <div className="relative flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-4 w-full h-full overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[4px] rounded-lg">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  className="text-slate-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="36"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-primary transition-all duration-300 ease-out"
                  strokeWidth="8"
                  strokeDasharray={226.2}
                  strokeDashoffset={226.2 - (progress / 100) * 226.2}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="36"
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute text-lg font-bold text-primary">
                {progress}%
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-primary animate-pulse">
              Processing interest calculation...
            </p>
          </div>
        )}

        <ScrollArea className="w-full h-full pr-3">
          <div className="flex flex-col justify-start items-center w-full gap-1">
            <h3 className="text-2xl font-semibold text-center w-full">
              Generate Savings Interest
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full p-2"
                autoComplete="off"
              >
                <div className="w-full border border-primary rounded-lg p-4 sm:p-6 gap-4">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DropdownField
                      form={form}
                      name="productType"
                      control={form.control}
                      options={productList}
                      optionLabelKey="Product_Name"
                      optionValueKey="Id"
                      placeholder="Select Product Type"
                      label="Product Type"
                      isRequired={true}
                    />
                    <DatePickerField
                      form={form}
                      name="fromDate"
                      control={form.control}
                      placeholder="Select From Date"
                      label="From Date"
                      disabled={isFromDateDisabled}
                      isRequired={true}
                    />
                    <DatePickerField
                      form={form}
                      name="toDate"
                      control={form.control}
                      placeholder="Select To Date"
                      label="To Date"
                      disabledDateBefore={disabledDateBefore}
                      disabledDateAfter={new Date()}
                      isRequired={true}
                    />
                    <InputField
                      form={form}
                      name="roi"
                      control={form.control}
                      placeholder="Enter ROI"
                      label="ROI"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-32 bg-primary text-white hover:bg-primary/90 font-semibold shadow-md shrink-0"
                    >
                      Run
                    </Button>
                  </div>
                </div>
              </form>
            </Form>

            {/* Results Table Section */}
            {interestDetails && interestDetails.length > 0 && (
              <div className="w-full pb-36">
                <InterestCalculationTable interestDetails={interestDetails} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sticky Posting Panel at the bottom */}
        {interestDetails && interestDetails.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-100 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-b-lg">
            <Form {...postForm}>
              <form onSubmit={postForm.handleSubmit(onPostSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Voucher Date (always pick beg_date from cookies and disable) */}
                  <DatePickerField
                    form={postForm}
                    name="voucherDate"
                    control={postForm.control}
                    placeholder="Select Date"
                    label="Voucher Date"
                    disabled={true}
                    isRequired={true}
                  />

                  {/* Reference Voucher No */}
                  <InputField
                    form={postForm}
                    name="referenceVoucherNo"
                    control={postForm.control}
                    placeholder="Enter Ref Voucher No"
                    label="Reference Voucher No"
                    isRequired={true}
                  />

                  {/* Total Amount (Read-only) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Total Interest Amount
                    </label>
                    <div className="h-10 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-primary text-base">
                      ₹
                      {new Intl.NumberFormat("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalInterest)}
                    </div>
                  </div>

                  {/* Post button */}
                  <div>
                    <Button
                      type="submit"
                      disabled={loading || interestDetails.length === 0}
                      className="w-full h-10 bg-primary text-white hover:bg-primary/90 font-semibold shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Post Interest
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmPost}>
        <DialogContent
          hideClose={true}
          className="w-[calc(100vw-1rem)] sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 px-6 pt-7 pb-5 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <HelpCircle size={22} className="text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-bold text-slate-800">
                Confirm Posting
              </DialogTitle>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Do you want to post of personal Data?
              </p>
            </div>
          </div>

          {/* Info note */}
          <div className="mx-6 mb-5 flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 rounded-lg px-3.5 py-3">
            <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 leading-relaxed text-left">
              Confirming this action will record the interest values into ledger
              records. This action cannot be undone.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={handleConfirmNo}
              className="flex-1 h-9 text-[13px] border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              No
            </Button>
            <Button
              onClick={handleConfirmYes}
              className="flex-1 h-9 text-[13px] bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SevingsInterestCalculateComponents;
