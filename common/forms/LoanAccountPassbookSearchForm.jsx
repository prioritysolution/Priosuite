"use client";

import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import InputField from "../formFields/InputField";
import {
  premiumTabsList,
  premiumTabsTrigger,
} from "../formFields/fieldStyles";
import { IoSearch } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanAccountSearchTable from "../tables/LoanAccountSearchTable";
import { useRepayment } from "@/container/loan/repayment/Hooks";
import { getLoanAccountSearchData } from "@/container/loan/repayment/RepaymentReducer";

const LoanAccountPassbookSearchForm = ({
  form,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("memberNo");

  const {
    getLoanAccountListApiCall,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
  } = useRepayment();

  const handleSearchAccountListByMemberNo = () => {
    if (form.getValues("dialougeMemberNo")) {
      getLoanAccountListApiCall(2, form.getValues("dialougeMemberNo"), 1);
      setCurrentAccountPage(1);
    } else toast.error(t("forms.pleaseEnterMemberNo"));
  };

  const handleSearchAccountListByName = () => {
    if (form.getValues("dialougeAccountName")) {
      getLoanAccountListApiCall(1, form.getValues("dialougeAccountName"), 1);
      setCurrentAccountPage(1);
    } else toast.error(t("forms.pleaseEnterName"));
  };

  const accountListData = useSelector(
    (state) => state?.repayment?.loanAccountSearchData,
  );

  useEffect(() => {
    form.setValue("dialougeAccountName", "");
    form.setValue("dialougeMemberNo", "");
    dispatch(getLoanAccountSearchData([]));
    setCurrentAccountPage(1);
  }, [dialougeOpen]);

  useEffect(() => {
    if (
      form.getValues("dialougeMemberNo") ||
      form.getValues("dialougeAccountName")
    ) {
      const value =
        activeTab === "memberNo"
          ? form.getValues("dialougeMemberNo")
          : form.getValues("dialougeAccountName");
      const type = activeTab === "memberNo" ? 2 : 1;
      getLoanAccountListApiCall(type, value, currentAccountPage);
    }
  }, [currentAccountPage]);

  return (
    <Form {...form}>
      <div className="w-full">
        <Dialog open={dialougeOpen} onOpenChange={setDialougeOpen}>
          <div className="w-full">
            <InputField
              control={form.control}
              name="accountNo"
              label={t("forms.accountNo")}
              placeholder={t("forms.enterAccountNo")}
              type="number"
              isBlurUpdate
              onInput={(e) => {
                if (e.target.value.length > 6) {
                  e.target.value = e.target.value.slice(0, 6);
                }
              }}
              endContent={
                <DialogTrigger
                  asChild
                  className="cursor-pointer text-lg text-muted-foreground hover:text-primary transition-colors"
                >
                  <span>
                    <IoSearch />
                  </span>
                </DialogTrigger>
              }
            />
          </div>

          <DialogContent className="w-[calc(100vw-1rem)] max-w-[1000px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
            <DialogHeader className="shrink-0 pr-8 text-left">
              <DialogTitle className="text-base sm:text-lg">
                {t("forms.searchAccount")}
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
                  <TabsList className={premiumTabsList("w-full sm:w-[70%]")}>
                    <TabsTrigger
                      value="memberNo"
                      className={premiumTabsTrigger(activeTab === "memberNo")}
                    >
                      {t("forms.byMemberNo")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="name"
                      className={premiumTabsTrigger(activeTab === "name")}
                    >
                      {t("forms.byName")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="memberNo"
                    className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                  >
                    <InputField
                      control={form.control}
                      name="dialougeMemberNo"
                      label={t("forms.memberNo")}
                      autoComplete="off"
                      placeholder={t("forms.searchByMemberNo")}
                    />
                    <Button
                      type="button"
                      className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                      onClick={handleSearchAccountListByMemberNo}
                    >
                      {t("forms.search")}
                    </Button>
                  </TabsContent>
                  <TabsContent
                    value="name"
                    className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                  >
                    <InputField
                      control={form.control}
                      name="dialougeAccountName"
                      label={t("forms.name")}
                      autoComplete="off"
                      placeholder={t("forms.searchByName")}
                    />
                    <Button
                      type="button"
                      className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                      onClick={handleSearchAccountListByName}
                    >
                      {t("forms.search")}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <LoanAccountSearchTable
                  data={accountListData}
                  handleSelectData={handleSelectClick}
                  currentAccountPage={currentAccountPage}
                  setCurrentAccountPage={setCurrentAccountPage}
                  lastAccountPage={lastAccountPage}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
};

export default LoanAccountPassbookSearchForm;
