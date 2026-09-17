"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import InputField from "@/common/formFields/InputField";
import AccountSummary from "@/components/dashboard/AccountSummary";
import BranchLiquidityTable from "@/components/dashboard/BranchLiquidityTable";
import CashDenominationTally from "@/components/dashboard/CashDenominationTally";
import FieldAgentTable from "@/components/dashboard/FieldAgentTable";
import LiquidFundsCard from "@/components/dashboard/LiquidFundsCard";
import MemberQuickActions from "@/components/dashboard/MemberQuickActions";
import MemberSummaryCards from "@/components/dashboard/MemberSummaryCards";
import MemberTransactionTable from "@/components/dashboard/MemberTransactionTable";
import MicrofinanceStatsGrid from "@/components/dashboard/MicrofinanceStatsGrid";
import NpaCards from "@/components/dashboard/NpaCards";
import {
  branchLiquidity,
  cashTally,
  fieldAgents,
  liquidFunds,
  microfinanceStatCards,
  npaMetrics,
} from "@/components/dashboard/microfinanceMockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as yup from "yup";

const Dashboard = ({ dashboardItemData }) => {
  const [userName, setUserName] = useState("Member");
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    setUserName(getCookieData("userName") || "Member");
    setLastLogin(format(new Date(), "dd MMM yyyy, hh:mm a"));
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-slate-800 sm:text-lg">
            Welcome, {userName} <span aria-hidden>👋</span>
          </h2>
          {lastLogin ? (
            <p className="hidden shrink-0 text-sm text-slate-500 md:block">
              Last Login: {lastLogin}
            </p>
          ) : null}
        </div>
      </header>

      <ScrollArea className="min-h-0 w-full flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-3 pb-6 sm:gap-6 sm:p-4 lg:p-6">
          <MemberSummaryCards dashboardItemData={dashboardItemData} />

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-12">
            <div className="min-w-0 lg:col-span-2 xl:col-span-6">
              <MemberTransactionTable />
            </div>
            <div className="min-w-0 xl:col-span-3">
              <AccountSummary />
            </div>
            <div className="min-w-0 xl:col-span-3">
              <MemberQuickActions />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const AdminDashboard = ({ form, openingLedgerBranchData }) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-slate-50">
      <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
        <div className="w-full space-y-3 sm:space-y-4">
          <MicrofinanceStatsGrid cards={microfinanceStatCards} />

          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="w-full min-w-0 lg:col-span-4">
              <LiquidFundsCard data={liquidFunds} />
            </div>
            <div className="w-full min-w-0 lg:col-span-8">
              <FieldAgentTable agents={fieldAgents} />
            </div>
          </div>

          <BranchLiquidityTable
            branches={branchLiquidity}
            form={form}
            openingLedgerBranchData={openingLedgerBranchData}
          />

          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="w-full min-w-0 lg:col-span-8">
              <CashDenominationTally data={cashTally} />
            </div>
            <div className="w-full min-w-0 lg:col-span-4">
              <NpaCards metrics={npaMetrics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Day Begin Dialog component
const DayBeginDialog = ({
  isOpen,
  setIsOpen,
  updateDayBeginLoading,
  updateDayBeginApiCall,
}) => {
  const beg_date_cookie = getCookieData("beg_date");
  const fin_start_date = getCookieData("fin_start_date");
  const fin_end_date = getCookieData("fin_end_date");

  const dayBeginSchema = yup.object({
    currentBeginDate: yup.string().nullable(),
    newBeginDate: yup
      .mixed()
      .test(
        "required-date",
        "Please select a new begin date",
        (value) => value instanceof Date && !isNaN(value.getTime()),
      ),
  });

  const form = useForm({
    resolver: yupResolver(dayBeginSchema),
    defaultValues: {
      currentBeginDate: beg_date_cookie || "",
      newBeginDate: null,
    },
  });

  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      form.reset({
        currentBeginDate: beg_date_cookie
          ? format(new Date(beg_date_cookie), "dd-MM-yyyy")
          : "",
        newBeginDate: null,
      });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, beg_date_cookie, form]);

  const onSubmit = async (values) => {
    if (
      !(values.newBeginDate instanceof Date) ||
      isNaN(values.newBeginDate.getTime())
    ) {
      toast.error("Please select a new begin date.");
      form.setError("newBeginDate", {
        type: "manual",
        message: "Please select a new begin date",
      });
      return;
    }
    await updateDayBeginApiCall(values.newBeginDate, () => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="w-[calc(100vw-1rem)] sm:max-w-[425px]"
        hideClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update Day Begin Date</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              control={form.control}
              name="currentBeginDate"
              label="Current Begin Date"
              disabled
              readOnly
            />
            <DatePickerField
              control={form.control}
              // isManualInput={true}
              name="newBeginDate"
              label="New Date"
              placeholder="Select new begin date"
              disabledDateBefore={
                fin_start_date ? new Date(fin_start_date) : undefined
              }
              disabledDateAfter={
                fin_end_date ? new Date(fin_end_date) : undefined
              }
              isRequired
              allowClear={false}
            />
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={updateDayBeginLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateDayBeginLoading}
                className="w-full sm:w-auto"
              >
                {updateDayBeginLoading ? (
                  <ClipLoader size={16} color="#ffffff" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Main export component that decides which dashboard to show
const MainDashboard = ({
  dashboardItemData,
  begDate,
  form,
  openingLedgerBranchData,
  updateDayBeginLoading,
  updateDayBeginApiCall,
}) => {
  const [isMainDash, setIsMainDash] = useState(null);
  const [isDayBeginOpen, setIsDayBeginOpen] = useState(false);

  useEffect(() => {
    setIsMainDash(Number(getCookieData("Is_Main_Dash")));

    const handleKeyDown = (e) => {
      if (e.key === "F10") {
        e.preventDefault();
        setIsDayBeginOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isMainDash === null) {
    return null;
  }

  return (
    <>
      {isMainDash === 1 ? (
        <AdminDashboard
          form={form}
          openingLedgerBranchData={openingLedgerBranchData}
        />
      ) : (
        <Dashboard dashboardItemData={dashboardItemData} begDate={begDate} />
      )}
      <DayBeginDialog
        isOpen={isDayBeginOpen}
        setIsOpen={setIsDayBeginOpen}
        updateDayBeginLoading={updateDayBeginLoading}
        updateDayBeginApiCall={updateDayBeginApiCall}
      />
    </>
  );
};

export default MainDashboard;
