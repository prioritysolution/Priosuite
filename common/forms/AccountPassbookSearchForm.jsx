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
import { IoSearch } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeposit } from "@/container/deposit/deposit/Hooks";
import AccountSearchTable from "../tables/AccountSearchTable";
import { getSearchAccountData } from "@/container/deposit/deposit/DepositReducer";
import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";

const AccountPassbookSearchForm = ({
  form,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
  showButton = false,
  handleSubmit,
  generatePDF,
  pageData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("memberNo");

  const {
    getAccountLoading,
    getAccountListApiCall,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
  } = useDeposit(true);

  const handleSearchAccountListByMemberNo = () => {
    if (form.getValues("dialougeMemberNo")) {
      getAccountListApiCall(2, form.getValues("dialougeMemberNo"), 1);
      setCurrentAccountPage(1);
    } else toast.error(t("forms.pleaseEnterMemberNo"));
  };

  const handleSearchAccountListByName = () => {
    if (form.getValues("dialougeAccountName")) {
      getAccountListApiCall(1, form.getValues("dialougeAccountName"), 1);
      setCurrentAccountPage(1);
    } else toast.error(t("forms.pleaseEnterName"));
  };

  const accountListData = useSelector(
    (state) => state?.deposit?.searchAccountData,
  );

  useEffect(() => {
    form.setValue("dialougeAccountName", "");
    form.setValue("dialougeMemberNo", "");
    dispatch(getSearchAccountData([]));
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
      getAccountListApiCall(type, value, currentAccountPage);
    }
  }, [currentAccountPage]);

  const FormTag = showButton ? "form" : "div";

  console.log("accountNo=", form.getValues("accountNo"));

  return (
    <Form {...form}>
      <FormTag
        autoComplete={showButton ? "off" : undefined}
        className="w-full"
        onSubmit={
          showButton && handleSubmit
            ? form.handleSubmit(handleSubmit)
            : undefined
        }
      >
        <Dialog open={dialougeOpen} onOpenChange={setDialougeOpen}>
          <div className="w-full flex flex-wrap items-end gap-5">
            <div className="w-full sm:w-72">
              <InputField
                control={form.control}
                name="accountNo"
                label={t("forms.accountNo")}
                placeholder={t("forms.enterAccountNo")}
                type="number"
                isBlurUpdate
                onInput={(e) => {
                  if (e.target.value.length > 8) {
                    e.target.value = e.target.value.slice(0, 8);
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
            {showButton ? (
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="w-12 h-10 p-0 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center"
                >
                  {false ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    <PiFileMagnifyingGlassBold />
                  )}
                </Button>
                <div
                  className={cn(
                    "w-12 h-10 p-0 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                    {
                      "pointer-events-none opacity-50":
                        !pageData || pageData?.length < 1,
                    },
                  )}
                  onClick={() => {
                    if (pageData) {
                      generatePDF();
                    }
                  }}
                >
                  <HiMiniPrinter />
                </div>
              </div>
            ) : null}
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
                      {t("forms.byMemberNo")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="name"
                      className="w-full"
                      style={{
                        backgroundColor: activeTab === "name" ? "#2563eb" : "",
                        color: activeTab === "name" ? "#ffffff" : "",
                      }}
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
                      className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                      onClick={handleSearchAccountListByName}
                    >
                      {t("forms.search")}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <AccountSearchTable
                  data={accountListData}
                  handleSelectData={handleSelectClick}
                  currentAccountPage={currentAccountPage}
                  setCurrentAccountPage={setCurrentAccountPage}
                  lastAccountPage={lastAccountPage}
                  loading={getAccountLoading}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </FormTag>
    </Form>
  );
};
export default AccountPassbookSearchForm;
