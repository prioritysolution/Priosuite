"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
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
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import MemberSearchTable from "../tables/MemberSearchTable";
import { ClipLoader } from "react-spinners";
import { DatePickerField } from "../formFields/DatePickerField";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";
import { format, getYear } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const parseFlexDate = (dStr) => {
  if (!dStr) return new Date();
  if (dStr instanceof Date) return dStr;
  const parts = dStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2].split("T")[0], 10),
      );
    }
    if (parts[2].split("T")[0].length === 4) {
      return new Date(
        parseInt(parts[2].split("T")[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

const MemberSearchForm = ({
  handleSubmit,
  showDate = false,
  loading,
  label = "Date",
  resetTrigger,
  isLoan = false,
  hideNextButton = false,
  className,
  formLabel = "",
  showLedger = false,
  handleShowLedger,
  insidePosition = false,
  showDateFix = false,
  disableNextButton = false,
  anableRadio = "",
}) => {
  const { t } = useTranslation();

  const RadioData = [
    { label: t("memberSearch.individualCustomer"), value: "1" },
    { label: t("memberSearch.group"), value: "2" },
    { label: t("memberSearch.institution"), value: "3" },
    { label: t("memberSearch.staff"), value: "4" },
  ];

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const sidebarData = useSelector((state) => state.sidebar.sidebarData);

  const dispatch = useDispatch();

  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [isOpeningActive, setIsOpeningActive] = useState(false);
  const [isDateChecked, setIsDateChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");

  useEffect(() => {
    if (anableRadio) {
      setSelectedRadio(String(anableRadio));
    }
  }, [anableRadio]);

  const orgId = getCookieData("orgId");
  const beg_date = getCookieData("beg_date");

  useEffect(() => {
    if (window !== undefined)
      setIsOpeningActive(
        sidebarData?.some((item) => item?.title === "Opening"),
      );
  }, [sidebarData]);

  const {
    getMemberListDataLoading,
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  useEffect(() => {
    // Reset form when `resetTrigger` changes
    if (isDateChecked) {
      form.setValue("memberNo", "");
      form.setValue("dialougeMemberName", "");
    } else
      form.reset({
        date: beg_date ? parseFlexDate(beg_date) : null,
        memberNo: "",
        dialougeMemberName: "",
      });
  }, [resetTrigger]);

  const formSchema = yup.object({
    date: yup
      .date()
      .nullable() // Allow null when not required
      .test("is-required", "Date is required", function (value) {
        // Use the global variable to determine if date is required
        if (showDate) {
          return value !== null && value !== undefined;
        }
        return true; // If not required, null is allowed
      }),
    // .test("is-between", "Invalid date", function (value) {
    //   if (!value || !showDate) return true;
    //   if (
    //     beg_date &&
    //     format(value, "yyyy-MM-dd") ===
    //       format(parseFlexDate(beg_date), "yyyy-MM-dd")
    //   ) {
    //     return true;
    //   } else {
    //     const maxDate =
    //       new Date(endDate) > new Date()
    //         ? format(new Date(), "yyyy-MM-dd")
    //         : endDate;
    //     if (isLoan) return format(value, "yyyy-MM-dd") < startDate;
    //     else
    //       return (
    //         format(value, "yyyy-MM-dd") >= startDate &&
    //         format(value, "yyyy-MM-dd") <= maxDate
    //       );
    //   }
    // }),
    memberNo: yup.string().matches(/^\d{1,10}$/, "Enter a valid member no."),
    dialougeMemberName: yup.string(),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: beg_date ? parseFlexDate(beg_date) : null,
      memberNo: "",
      dialougeMemberName: "",
    },
  });

  // Set date to beg_date when component loads
  useEffect(() => {
    if (beg_date) {
      form.setValue("date", parseFlexDate(beg_date));
    }
  }, [beg_date, form]);

  const handleSearchMember = (e) => {
    e?.preventDefault?.();
    if (!orgId) return;
    const name = form.getValues("dialougeMemberName");
    if (!name) {
      toast.error(t("memberSearch.pleaseEnterName"));
      return;
    }
    // Search always starts from page 1
    if (currentMemberPage === 1) {
      getMemberDataByNameApiCall(orgId, 1, name, selectedRadio || "1");
    } else {
      setCurrentMemberPage(1);
    }
  };

  const handleSelectClick = (data) => {
    form.setValue("memberNo", data.CIF_No);
    setDialougeOpen(false);
  };

  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  );

  const handleDialogueOpenChange = (open) => {
    if (open) {
      form.setValue("dialougeMemberName", "");
      setCurrentMemberPage(1);
      dispatch(getMemberDataByName([]));
    } else {
      dispatch(getMemberDataByName([]));
    }
    setDialougeOpen(open);
  };

  // Pagination only — never auto-call on dialog open / Next / radio change
  useEffect(() => {
    if (!dialougeOpen || !orgId) return;
    const name = form.getValues("dialougeMemberName");
    if (!name) return;
    getMemberDataByNameApiCall(
      orgId,
      currentMemberPage,
      name,
      selectedRadio || "1",
    );
  }, [currentMemberPage]);

  // Clear results when customer type radio changes; user must click Search again
  useEffect(() => {
    if (!dialougeOpen) return;
    dispatch(getMemberDataByName([]));
    setCurrentMemberPage(1);
  }, [selectedRadio]);

  return (
    <div
      className={cn(
        "w-full border border-primary rounded-lg p-2 sm:px-5 lg:px-10",
        className,
      )}
    >
      <Form {...form}>
        <form autoComplete="off" className={`w-full`}>
          <Dialog open={dialougeOpen} onOpenChange={handleDialogueOpenChange}>
            <div
              className={cn(
                "w-full flex flex-col lg:flex-row items-center justify-between gap-x-10 gap-y-2 lg:gap-y-5  ",
                { "gap-x-2": insidePosition },
              )}
            >
              {formLabel ? (
                <h1 className="text-lg font-semibold text-nowrap">
                  {formLabel}
                </h1>
              ) : null}
              {showDate && (
                <div className="flex items-center gap-2 w-full">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label={label === "Date" ? t("common.date") : label}
                    // startYear={
                    //   isLoan
                    //     ? getYear(new Date(startDate))
                    //     : getYear(new Date()) - 100
                    // }
                    // endYear={
                    //   isLoan
                    //     ? getYear(new Date(startDate))
                    //     : getYear(new Date(endDate))
                    // }
                    // disabledDateAfter={
                    //   isLoan
                    //     ? new Date(startDate).setDate(
                    //         new Date(startDate).getDate() - 1,
                    //       )
                    //     : new Date(endDate) > new Date()
                    //       ? new Date()
                    //       : new Date(endDate)
                    // }
                    // isBackDate={isLoan}
                    // onPopover="true"
                    defaultValue={parseFlexDate(beg_date)}
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
              )}

              <FormField
                control={form.control}
                name="memberNo"
                render={({ field }) => (
                  <FormItem className={cn("w-full", { "": !showDate })}>
                    <FormLabel>{t("memberSearch.cifRefNo")}</FormLabel>
                    <FormControl>
                      <div className="flex flex-col lg:flex-row items-center gap-x-10 gap-2 w-full">
                        <div className=" w-full h-full">
                          <div className=" w-full relative ">
                            <Input
                              placeholder={t("memberSearch.memberNoPlaceholder")}
                              className="w-full"
                              type="number"
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value.slice(0, 10);
                                }
                              }}
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

              <div
                className={cn("w-full flex justify-start self-end gap-5 ", {
                  "w-fit": insidePosition,
                })}
              >
                <Button
                  type=""
                  className={cn(
                    "px-5 w-1/2",
                    { hidden: hideNextButton },
                    { "w-full": insidePosition },
                  )}
                  disabled={loading || Boolean(disableNextButton)}
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("memberSearch.next")
                  )}
                </Button>

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
                        <p>{t("memberSearch.viewLedger")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <DialogContent className="w-[calc(100vw-1rem)] max-w-[1000px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
              <DialogHeader className="shrink-0 pr-8 text-left">
                <DialogTitle className="text-base sm:text-lg">
                  {t("memberSearch.searchMembers")}
                </DialogTitle>
              </DialogHeader>

              <RadioGroup
                defaultValue="1"
                value={selectedRadio}
                onValueChange={setSelectedRadio}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0"
              >
                {RadioData.map((item, index) => (
                  <div className="flex items-center gap-2 min-w-0" key={index}>
                    <RadioGroupItem
                      value={item.value}
                      id={item.value}
                      disabled={
                        !!anableRadio && item.value !== String(anableRadio)
                      }
                    />
                    <Label
                      htmlFor={item.value}
                      className="text-xs sm:text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4 shrink-0">
                  <FormField
                    control={form.control}
                    name="dialougeMemberName"
                    render={({ field }) => (
                      <FormItem className="w-full min-w-0">
                        <FormLabel>
                          {RadioData.find(
                            (item) => item.value === selectedRadio,
                          )?.label || t("memberSearch.memberName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder={t("memberSearch.searchByMemberName")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                    onClick={handleSearchMember}
                  >
                    {t("memberSearch.search")}
                  </Button>
                </div>
                <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                  <MemberSearchTable
                    loading={getMemberListDataLoading}
                    data={memberDataByName}
                    handleSelectData={handleSelectClick}
                    currentMemberPage={currentMemberPage}
                    setCurrentMemberPage={setCurrentMemberPage}
                    lastMemberPage={lastMemberPage}
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
export default MemberSearchForm;
