"use client";

import { useTranslation } from "react-i18next";
import { Users, X } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import DepositAgentTable from "./DepositAgentTable";

const DepositAgent = ({
  loading,
  getMemberDataLoading,
  getAgentListLoading = false,
  visibleBlock,
  resetTrigger,
  handleSubmit,
  handleMemberFormSubmit,
  form,
  openAgentListModal = false,
  setOpenAgentListModal,
  editingAgent = null,
  handleEditAgent,
  handleCancelEdit,
  getDepositAgentListApiCall,
  agentCurrentPage = 1,
  setAgentCurrentPage,
  agentLastPage = 1,
  agentPageLimit = 25,
  agentSearchKeyword = null,
  handleSearchAgentList,
  orgId,
  branchId,
}) => {
  const { t } = useTranslation();
  const currentBranchId = branchId ?? getCookieData("userBranchId");
  const currentOrgId = orgId ?? getCookieData("orgId");
  const memberBranchId = form.watch("BranchId");
  const isDifferentBranch =
    memberBranchId != null &&
    String(memberBranchId).trim() !== "" &&
    String(memberBranchId) !== String(currentBranchId ?? "");

  const agentList = useSelector((state) => state?.depositAgent?.agentList || []);

  const handleOpenAgentList = () => {
    if (getDepositAgentListApiCall) {
      getDepositAgentListApiCall(currentOrgId, currentBranchId, agentCurrentPage, agentPageLimit);
    }
    if (setOpenAgentListModal) {
      setOpenAgentListModal(true);
    }
  };

  const handlePageChange = (page) => {
    if (setAgentCurrentPage) {
      setAgentCurrentPage(page);
    }
    if (getDepositAgentListApiCall) {
      getDepositAgentListApiCall(
        currentOrgId,
        currentBranchId,
        page,
        agentPageLimit,
        agentSearchKeyword,
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        {/* Top search with Agent List button inside the box alongside Next */}
        <div className="w-full">
          <MemberSearchForm
            handleSubmit={handleMemberFormSubmit}
            loading={getMemberDataLoading}
            resetTrigger={resetTrigger}
            formLabel={t("master.depositAgent.title")}
            extraButtons={
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenAgentList}
                className="px-5 w-1/2 border-primary text-primary hover:bg-primary/10 font-semibold flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span>{t("master.depositAgent.buttons.agentList", "Agent List")}</span>
              </Button>
            }
          />
        </div>

        {/* Dialog for Agent List */}
        <Dialog open={openAgentListModal} onOpenChange={setOpenAgentListModal}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl h-[80vh] p-4 sm:p-6 gap-4 overflow-hidden flex flex-col rounded-xl shadow-2xl bg-white">
            <DialogHeader className="shrink-0 pr-8 text-left border-b pb-3">
              <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span>{t("master.depositAgent.dialogTitle", "Deposit Agents List")}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full min-h-0 flex-1 overflow-hidden flex flex-col">
              <DepositAgentTable
                data={agentList}
                handleEditData={handleEditAgent}
                loading={getAgentListLoading}
                currentPage={agentCurrentPage}
                setCurrentPage={handlePageChange}
                lastPage={agentLastPage}
                pageLimit={agentPageLimit}
                onSearch={handleSearchAgentList}
                initialSearchValue={agentSearchKeyword || ""}
              />
            </div>
          </DialogContent>
        </Dialog>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {/* Active edit banner */}
              {editingAgent && visibleBlock && (
                <div className="w-full bg-amber-50 border border-amber-300 rounded-md px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>
                      Updating Agent:{" "}
                      <strong>
                        {editingAgent?.Agent_Name ||
                          editingAgent?.Full_Name ||
                          editingAgent?.Agent_Code ||
                          "Selected Agent"}
                      </strong>
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-7 text-xs text-amber-900 hover:bg-amber-100 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Edit
                  </Button>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("membership.issueMembership.sections.basicInfoBlock")}
                    </h4>
                  </div>
                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full flex flex-col gap-2.5">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label={t("membership.issueMembership.fields.memberNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label={t("membership.issueMembership.fields.cifNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("membership.issueMembership.fields.memberName")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("membership.issueMembership.fields.gurdianName")}
                        readOnly
                      />
                      <TextareaField
                        control={form.control}
                        name="address"
                        label={t("membership.issueMembership.fields.address")}
                        readOnly
                        className="resize-none"
                      />
                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("membership.issueMembership.fields.mobileNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="branchName"
                        label={t("membership.issueMembership.fields.branchName")}
                        readOnly
                        className={
                          isDifferentBranch
                            ? "border-red-500 bg-red-50 [&_input]:text-red-600"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {/* agent details */}
              {visibleBlock && (
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.depositAgent.sections.agentDetails")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 items-end">
                    <InputField
                      control={form.control}
                      name="securityAmount"
                      label={t("master.depositAgent.fields.securityAmount", "Security Amount")}
                      placeholder={t("master.depositAgent.placeholders.securityAmount", "Enter security amount")}
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="maxCollectionAmount"
                      label={t("master.depositAgent.fields.maxCollectionAmount", "Max Collection Amount")}
                      placeholder={t("master.depositAgent.placeholders.maxCollectionAmount", "Enter max collection amount")}
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="maxAllowDay"
                      label={t("master.depositAgent.fields.maxAllowDay", "Max Allow Day")}
                      placeholder={t("master.depositAgent.placeholders.maxAllowDay", "Enter max allow day (max 2 digits)")}
                      type="number"
                      onInput={(e) => {
                        const sanitized = e.target.value.replace(/\D/g, "");
                        e.target.value = sanitized.slice(0, 2);
                      }}
                    />

                    {/* Switches row - fully responsive and clean side-by-side layout */}
                    <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-wrap items-center gap-x-8 gap-y-3 pt-1">
                      <FormField
                        control={form.control}
                        name="depositCollection"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-3 space-y-0 py-1">
                            <FormControl>
                              <Switch
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                              {t("master.depositAgent.fields.depositCollection", "Deposit Collection")}
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="loanCollection"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-3 space-y-0 py-1">
                            <FormControl>
                              <Switch
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                              {t("master.depositAgent.fields.loanCollection", "Loan Collection")}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="flex items-center justify-end gap-3 w-full">
                  {editingAgent && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-1/6"
                      onClick={handleCancelEdit}
                    >
                      {t("master.depositAgent.buttons.cancel", "Cancel")}
                    </Button>
                  )}
                  <Button type="submit" className="w-full sm:w-1/5" disabled={loading}>
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : editingAgent ? (
                      t("master.depositAgent.buttons.update", "Update")
                    ) : (
                      t("master.depositAgent.buttons.add", "Add")
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
export default DepositAgent;
