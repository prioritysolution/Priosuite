"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoPrint, IoSearch } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanAccountSearchTable from "../tables/LoanAccountSearchTable";
import { useRepayment } from "@/container/loan/repayment/Hooks";
import { format, getYear } from "date-fns";
import { DatePickerField } from "../formFields/DatePickerField";
import { getLoanAccountSearchData } from "@/container/loan/repayment/RepaymentReducer";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import getCookieData from "@/utils/getCookieData";
const parseFlexDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  const parts = String(dateStr).split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
      );
    } else {
      // DD-MM-YYYY
      return new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const LoanAccountSearchForm = ({
  handleSubmit,
  buttonLabel = "Next",
  showPrintButton = false,
  printButtonLabel = "Print",
  disablePrintButton = false,
  handlePrint,
  resetTrigger,
  showLedger = false,
  handleShowLedger,
  formLabel = "",
  showDateFix = false,
}) => {
  const dispatch = useDispatch();

  const beg_date = getCookieData("beg_date");

  console.log("beg_date", beg_date);
  console.log("showDateFix", showDateFix);

  const sidebarData = useSelector((state) => state.sidebar.sidebarData);

  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [isOpeningActive, setIsOpeningActive] = useState(false);
  const [isDateChecked, setIsDateChecked] = useState(false);

  const [activeTab, setActiveTab] = useState("memberNo");

  useEffect(() => {
    if (window !== undefined)
      setIsOpeningActive(
        sidebarData?.some((item) => item?.title === "Opening"),
      );
  }, [sidebarData]);

  const {
    getLoanAccountLoading,
    getLoanAccountListApiCall,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
  } = useRepayment();

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    date: yup
      .date()
      .required("Date is required")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return true;
        const parsedValue = parseFlexDate(value);
        if (isNaN(parsedValue.getTime())) return false;
        parsedValue.setHours(0, 0, 0, 0);

        if (startDate && endDate) {
          const start = parseFlexDate(startDate);
          const end = parseFlexDate(endDate);

          if (start && !isNaN(start.getTime())) {
            start.setHours(0, 0, 0, 0);
            if (parsedValue < start) return false;
          }

          if (end && !isNaN(end.getTime())) {
            end.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const max = end > today ? today : end;

            // Allow up to beg_date if beg_date is newer than the financial year end date
            const begDateParsed = parseFlexDate(beg_date);
            if (begDateParsed && !isNaN(begDateParsed.getTime())) {
              begDateParsed.setHours(0, 0, 0, 0);
            }
            const actualMax =
              begDateParsed &&
              !isNaN(begDateParsed.getTime()) &&
              begDateParsed > max
                ? begDateParsed
                : max;

            if (parsedValue > actualMax) return false;
          }
        }
        return true;
      }),
    accountNo: yup.string(),
    dialougeMemberNo: yup.string(),
    dialougeMemberName: yup.string(),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: beg_date ? parseFlexDate(beg_date) : new Date(),
      accountNo: "",
    },
  });

  useEffect(() => {
    if (beg_date) {
      const parsedDate = parseFlexDate(beg_date);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        form.setValue("date", parsedDate);
      }
    }
  }, [beg_date]);

  const handleSearchAccountListByMemberNo = () => {
    if (form.getValues("dialougeMemberNo")) {
      getLoanAccountListApiCall(2, form.getValues("dialougeMemberNo"), 1);
      setCurrentAccountPage(1);
    } else toast.error("Please enter member no.");
  };

  const handleSearchAccountListByName = () => {
    if (form.getValues("dialougeMemberName")) {
      getLoanAccountListApiCall(1, form.getValues("dialougeMemberName"), 1);
      setCurrentAccountPage(1);
    } else toast.error("Please enter name");
  };

  const handleSelectClick = (data) => {
    form.setValue("accountNo", data.Account_No);
    setDialougeOpen(false);
  };

  const loanAccountListData = useSelector(
    (state) => state?.repayment?.loanAccountSearchData,
  );

  useEffect(() => {
    form.setValue("dialougeMemberName", "");
    form.setValue("dialougeMemberNo", "");
    dispatch(getLoanAccountSearchData([]));
    setCurrentAccountPage(1);
  }, [dialougeOpen]);

  useEffect(() => {
    if (
      form.getValues("dialougeMemberNo") ||
      form.getValues("dialougeMemberName")
    ) {
      const value =
        activeTab === "memberNo"
          ? form.getValues("dialougeMemberNo")
          : form.getValues("dialougeMemberName");
      const type = activeTab === "memberNo" ? 2 : 1;
      getLoanAccountListApiCall(type, value, currentAccountPage);
    }
  }, [currentAccountPage]);

  useEffect(() => {
    // Reset form when `resetTrigger` changes
    if (isDateChecked) {
      form.setValue("memberNo", "");
      form.setValue("dialougeMemberName", "");
      form.setValue("dialougeMemberNo", "");
    } else
      form.reset({
        date: beg_date ? parseFlexDate(beg_date) : new Date(),
        accountNo: "",
        dialougeMemberName: "",
        dialougeMemberNo: "",
      });
  }, [resetTrigger]);

  return (
    <div className="w-full border border-primary rounded-lg p-2 sm:px-5 lg:px-10">
      <Form {...form} className="">
        <form autoComplete="off" className="w-full">
          <Dialog
            open={dialougeOpen}
            onOpenChange={setDialougeOpen}
            className=""
          >
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-x-10 gap-y-2 lg:gap-y-5  ">
              {formLabel ? (
                <h1 className="text-lg font-semibold text-nowrap">
                  {formLabel}
                </h1>
              ) : null}

              <div className="flex items-center gap-2 w-full">
                <DatePickerField
                  control={form.control}
                  name="date"
                  label="Date"
                  disabled={true}
                />
                {isOpeningActive && showDateFix && (
                  <Checkbox
                    checked={isDateChecked}
                    onCheckedChange={setIsDateChecked}
                    className="mt-8 w-5 h-5"
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="accountNo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Account No.</FormLabel>

                    <FormControl>
                      <div className="">
                        <div className="">
                          <div className="relative w-full">
                            <Input
                              placeholder="Enter account no."
                              className="w-full "
                              type="number"
                              // onInput={(e) => {
                              //   if (e.target.value.length > 5) {
                              //     e.target.value = e.target.value.slice(0, 5);
                              //   }
                              // }}
                              {...field}
                            />
                            <div className="absolute right-0 top-0 py-3 px-3">
                              <DialogTrigger
                                asChild
                                className="cursor-pointer text-lg"
                              >
                                <IoSearch />
                              </DialogTrigger>
                            </div>
                          </div>
                          <FormMessage />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-start self-end gap-5">
                <Button
                  type=""
                  className={cn("px-5 w-1/2", {
                    "w-fit text-xl h-10": showPrintButton,
                  })}
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  {buttonLabel}
                </Button>
                {showPrintButton ? (
                  <div
                    className={cn(
                      "px-5 w-fit flex items-center justify-center text-white bg-primary hover:bg-primary/80 cursor-pointer rounded-md  text-xl",
                      { "bg-gray-400 cursor-not-allowed": disablePrintButton },
                    )}
                    onClick={() => {
                      if (!disablePrintButton) handlePrint();
                    }}
                  >
                    {printButtonLabel}
                  </div>
                ) : null}

                {showLedger && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={handleShowLedger}
                          className="p-2 px-5 w-1/2 text-2xl bg-primary rounded-md text-white cursor-pointer flex items-center justify-center text-center"
                        >
                          <IoPrint />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Ledger</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <DialogContent className="w-[calc(100vw-1rem)] max-w-[1000px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
              <DialogHeader className="shrink-0 pr-8 text-left">
                <DialogTitle className="text-base sm:text-lg">
                  Search Account
                </DialogTitle>
              </DialogHeader>
              <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
                <div className="w-full shrink-0">
                  <Tabs
                    defaultValue="memberNo"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full flex items-center justify-center flex-col"
                  >
                    <TabsList className="w-full sm:w-[70%]">
                      <TabsTrigger
                        value="memberNo"
                        className="w-full"
                        style={{
                          backgroundColor:
                            activeTab === "memberNo" ? "#2563eb" : "",
                          color: activeTab === "memberNo" ? "#ffffff" : "",
                        }}
                      >
                        By Member No.
                      </TabsTrigger>
                      <TabsTrigger
                        value="name"
                        className="w-full"
                        style={{
                          backgroundColor:
                            activeTab === "name" ? "#2563eb" : "",
                          color: activeTab === "name" ? "#ffffff" : "",
                        }}
                      >
                        By Member Name
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="memberNo"
                      className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                    >
                      <FormField
                        control={form.control}
                        name="dialougeMemberNo"
                        render={({ field }) => (
                          <FormItem className="w-full min-w-0">
                            <FormLabel>Member No.</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="Search by enter member no."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                        onClick={handleSearchAccountListByMemberNo}
                      >
                        Search
                      </Button>
                    </TabsContent>
                    <TabsContent
                      value="name"
                      className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                    >
                      <FormField
                        control={form.control}
                        name="dialougeMemberName"
                        render={({ field }) => (
                          <FormItem className="w-full min-w-0">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="off"
                                placeholder="Search by enter name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                        onClick={handleSearchAccountListByName}
                      >
                        Search
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                  <LoanAccountSearchTable
                    loading={getLoanAccountLoading}
                    data={loanAccountListData}
                    handleSelectData={handleSelectClick}
                    currentAccountPage={currentAccountPage}
                    setCurrentAccountPage={setCurrentAccountPage}
                    lastAccountPage={lastAccountPage}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};
export default LoanAccountSearchForm;
