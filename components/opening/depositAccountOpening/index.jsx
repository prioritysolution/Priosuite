"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import MemberSearchTable from "@/common/tables/MemberSearchTable";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";
import getCookieData from "@/utils/getCookieData";
import { getYear } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { ClipLoader } from "react-spinners";

const DepositAccountOpening = ({
  loading,
  getDepositProductLoading,
  addDepositAccountLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleJointAccountAdd,
  handleJointAccountDelete,
  checkDepositAmountDisable,
  checkDepositAmountMessage,
  checkDepositDurationMessage,
  openJointDialog,
  setOpenJointDialog,
  resetTrigger,
}) => {
  const { t } = useTranslation();
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const {
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");

  const accountTypeData = useSelector(
    (state) => state?.openDepositAccount?.depositAccountTypeData,
  );

  const productData = useSelector(
    (state) => state?.openDepositAccount?.depositProductData,
  );

  const durationTypeData = useSelector(
    (state) => state?.openDepositAccount?.durationTypeData,
  );

  const relationTypeData = useSelector(
    (state) => state?.memberProfile?.relationTypeData,
  );

  const maturityInstructionData = useSelector(
    (state) => state?.openDepositAccount?.maturityInstructionData,
  );

  const operationModeData = useSelector(
    (state) => state?.openDepositAccount?.operationModeData,
  );

  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  ).filter((item) => item.Member_No !== form.getValues("memberNo"));

  const payoutModeData = useSelector(
    (state) => state?.openDepositAccount?.payoutModeData,
  );

  const agentData = useSelector(
    (state) => state?.openDepositAccount?.depositAgentData,
  );

  const ecsAccontData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const handleSearchMember = () => {
    if (form.getValues("dialougeMemberName"))
      getMemberDataByNameApiCall(
        orgId,
        currentMemberPage,
        form.getValues("dialougeMemberName"),
      );
    else toast.error("Please enter name");
  };

  useEffect(() => {
    form.setValue("dialougeMemberName", "");
    dispatch(getMemberDataByName([]));
  }, [openJointDialog, form, dispatch]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-2  overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.depositAccountOpening.title")}
        </h3>

        <ScrollArea className="w-full h-full">
          <div className="w-full mb-5">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              loading={loading}
              resetTrigger={resetTrigger}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {/* info block */}
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-5" />
                    <h3 className="text-xl font-semibold text-center flex-grow">
                      {t("opening.depositAccountOpening.basicInfo.title")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowBasicInfo(!showBasicInfo)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {showBasicInfo ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {showBasicInfo && (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label={t("opening.depositAccountOpening.basicInfo.memberNo")}
                        placeholder={t("opening.depositAccountOpening.basicInfo.memberNoPlaceholder",
                        )}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label={t("opening.depositAccountOpening.basicInfo.cifNo")}
                        placeholder={t("opening.depositAccountOpening.basicInfo.cifNoPlaceholder",
                        )}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("opening.depositAccountOpening.basicInfo.memberName")}
                        placeholder={t("opening.depositAccountOpening.basicInfo.memberNamePlaceholder",
                        )}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("opening.depositAccountOpening.basicInfo.guardianName",
                        )}
                        placeholder={t("opening.depositAccountOpening.basicInfo.guardianNamePlaceholder",
                        )}
                        readOnly
                      />
                      <TextareaField
                        control={form.control}
                        name="address"
                        label={t("opening.depositAccountOpening.basicInfo.address")}
                        placeholder={t("opening.depositAccountOpening.basicInfo.addressPlaceholder",
                        )}
                        className="resize-none"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("opening.depositAccountOpening.basicInfo.mobile")}
                        placeholder={t("opening.depositAccountOpening.basicInfo.mobilePlaceholder",
                        )}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.depositAccountOpening.kyc.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="voterId"
                      label={t("opening.depositAccountOpening.kyc.voterId")}
                      placeholder={t("opening.depositAccountOpening.kyc.voterIdPlaceholder",
                      )}
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="aadhaarNo"
                      label={t("opening.depositAccountOpening.kyc.aadhaarNo")}
                      placeholder={t("opening.depositAccountOpening.kyc.aadhaarNoPlaceholder",
                      )}
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="panNo"
                      label={t("opening.depositAccountOpening.kyc.panNo")}
                      placeholder={t("opening.depositAccountOpening.kyc.panNoPlaceholder",
                      )}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.depositAccountOpening.account.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DropdownField
                      control={form.control}
                      name="accountType"
                      label={t("opening.depositAccountOpening.account.accountType")}
                      options={accountTypeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("opening.depositAccountOpening.account.accountTypePlaceholder",
                      )}
                      searchPlaceholder={t("opening.depositAccountOpening.account.accountTypeSearch",
                      )}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="depositProduct"
                      label={t("opening.depositAccountOpening.account.depositProduct")}
                      options={productData}
                      optionLabelKey="Prd_SH_Name"
                      placeholder={t("opening.depositAccountOpening.account.depositProductPlaceholder",
                      )}
                      disabled={!form.getValues("accountType")}
                      loading={getDepositProductLoading}
                      isRequired
                    />

                    <DatePickerField
                      control={form.control}
                      name="openingDate"
                      label={t("opening.depositAccountOpening.account.openingDate")}
                      endYear={getYear(new Date(startDate))}
                      disabledDateAfter={new Date(startDate).setDate(
                        new Date(startDate).getDate() - 1,
                      )}
                      isBackDate={true}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="accountNo"
                      label={t("opening.depositAccountOpening.account.accountNo")}
                      placeholder={t("opening.depositAccountOpening.account.accountNoPlaceholder",
                      )}
                      maxLength={4}
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label={t("opening.depositAccountOpening.account.ledgerFolio")}
                      placeholder={t("opening.depositAccountOpening.account.ledgerFolioPlaceholder",
                      )}
                    />

                    <div className="w-full flex flex-col gap-1.5">
                      <InputField
                        control={form.control}
                        name="openingAmount"
                        label={t("opening.depositAccountOpening.account.openingAmount",
                        )}
                        placeholder={t("opening.depositAccountOpening.account.openingAmountPlaceholder",
                        )}
                        type="number"
                        readOnly={
                          !form.getValues("accountType") ||
                          form.getValues("accountType") === "1" ||
                          form.getValues("accountType") === "4"
                        }
                      />
                      {checkDepositAmountMessage && (
                        <p className="text-destructive text-sm mt-1">
                          {checkDepositAmountMessage}
                        </p>
                      )}
                    </div>

                    {form.getValues("accountType") &&
                      form.getValues("accountType") === "2" && (
                        <>
                          <DropdownField
                            control={form.control}
                            name="durationUnit"
                            label={t("opening.depositAccountOpening.account.durationUnit",
                            )}
                            options={durationTypeData}
                            optionLabelKey="Option_Value"
                            placeholder={t("opening.depositAccountOpening.account.durationUnitPlaceholder",
                            )}
                            searchPlaceholder={t("opening.depositAccountOpening.account.durationUnitSearch",
                            )}
                            disabled={checkDepositAmountDisable}
                          />

                          <div className="w-full flex flex-col gap-1.5">
                            <InputField
                              control={form.control}
                              name="duration"
                              label={t("opening.depositAccountOpening.account.duration",
                              )}
                              placeholder={t("opening.depositAccountOpening.account.durationPlaceholder",
                              )}
                              type="number"
                              readOnly={
                                checkDepositAmountDisable ||
                                !form.getValues("durationUnit")
                              }
                            />
                            {checkDepositDurationMessage && (
                              <p className="text-destructive text-sm mt-1">
                                {checkDepositDurationMessage}
                              </p>
                            )}
                          </div>

                          <InputField
                            control={form.control}
                            name="rateOfInterest"
                            label={t("opening.depositAccountOpening.account.rateOfInterest",
                            )}
                            placeholder={t("opening.depositAccountOpening.account.rateOfInterestPlaceholder",
                            )}
                            readOnly
                          />

                          <DatePickerField
                            control={form.control}
                            name="maturityDate"
                            label={t("opening.depositAccountOpening.account.maturityDate",
                            )}
                            disabled
                          />

                          <InputField
                            control={form.control}
                            name="maturityAmount"
                            label={t("opening.depositAccountOpening.account.maturityAmount",
                            )}
                            placeholder={t("opening.depositAccountOpening.account.maturityAmountPlaceholder",
                            )}
                            readOnly
                          />
                          <DropdownField
                            control={form.control}
                            name="maturityInstruction"
                            label={t("opening.depositAccountOpening.account.maturityInstruction",
                            )}
                            options={maturityInstructionData}
                            optionLabelKey="Option_Value"
                            placeholder={t("opening.depositAccountOpening.account.maturityInstructionPlaceholder",
                            )}
                            searchPlaceholder={t("opening.depositAccountOpening.account.maturityInstructionSearch",
                            )}
                            disabled={checkDepositAmountDisable}
                            isRequired={form.getValues("accountType") === "2"}
                          />
                          {productData.find(
                            (item) =>
                              item.Id ===
                              Number(form.getValues("depositProduct")),
                          )?.Deposit_Type &&
                          (productData.find(
                            (item) =>
                              item.Id ===
                              Number(form.getValues("depositProduct")),
                          )?.Deposit_Type === 7 ||
                            productData.find(
                              (item) =>
                                item.Id ===
                                Number(form.getValues("depositProduct")),
                            )?.Deposit_Type === 8 ||
                            productData.find(
                              (item) =>
                                item.Id ===
                                Number(form.getValues("depositProduct")),
                            )?.Deposit_Type === 65 ||
                            productData.find(
                              (item) =>
                                item.Id ===
                                Number(form.getValues("depositProduct")),
                            )?.Deposit_Type === 79) ? (
                            <>
                              <FormField
                                control={form.control}
                                name="isAvailEcs"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        {t("opening.depositAccountOpening.account.isAvailEcs",
                                        )}
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={checkDepositAmountDisable}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <DropdownField
                                control={form.control}
                                name="ecsAccount"
                                label={t("opening.depositAccountOpening.account.ecsAccount",
                                )}
                                options={ecsAccontData}
                                optionLabelKey="Account_No"
                                placeholder={t("opening.depositAccountOpening.account.ecsAccountPlaceholder",
                                )}
                                searchPlaceholder={t("opening.depositAccountOpening.account.ecsAccountSearch",
                                )}
                                disabled={!form.getValues("isAvailEcs")}
                                isRequired={form.getValues("isAvailEcs")}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                          {productData.find(
                            (item) =>
                              item.Id ===
                              Number(form.getValues("depositProduct")),
                          )?.Deposit_Type &&
                          (productData.find(
                            (item) =>
                              item.Id ===
                              Number(form.getValues("depositProduct")),
                          )?.Deposit_Type === 8 ||
                            productData.find(
                              (item) =>
                                item.Id ===
                                Number(form.getValues("depositProduct")),
                            )?.Deposit_Type === 65) ? (
                            <>
                              <FormField
                                control={form.control}
                                name="isPayoutInterest"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        {t("opening.depositAccountOpening.account.isPayoutInterest",
                                        )}
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={checkDepositAmountDisable}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <DropdownField
                                control={form.control}
                                name="payoutMode"
                                label={t("opening.depositAccountOpening.account.payoutMode",
                                )}
                                options={
                                  productData?.find(
                                    (item) =>
                                      item?.Id ===
                                      Number(form.getValues("depositProduct")),
                                  )?.Deposit_Type === 65
                                    ? payoutModeData.filter(
                                        (data) => data.Id === 73,
                                      )
                                    : payoutModeData
                                }
                                optionLabelKey="Option_Value"
                                placeholder={t("opening.depositAccountOpening.account.payoutModePlaceholder",
                                )}
                                searchPlaceholder={t("opening.depositAccountOpening.account.payoutModeSearch",
                                )}
                                disabled={!form.getValues("isPayoutInterest")}
                                isRequired={form.getValues("isPayoutInterest")}
                              />
                              <InputField
                                control={form.control}
                                name="payoutAmount"
                                label={t("opening.depositAccountOpening.account.payoutAmount",
                                )}
                                placeholder={t("opening.depositAccountOpening.account.payoutAmountPlaceholder",
                                )}
                                type="number"
                                readOnly
                                isRequired={form.getValues("isPayoutInterest")}
                              />{" "}
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                    <DropdownField
                      control={form.control}
                      name="agentId"
                      label={t("opening.depositAccountOpening.account.agent")}
                      options={agentData}
                      optionLabelKey="Agent_Name"
                      placeholder={t("opening.depositAccountOpening.account.agentPlaceholder",
                      )}
                      searchPlaceholder={t("opening.depositAccountOpening.account.agentSearch",
                      )}
                    />

                    <DropdownField
                      control={form.control}
                      name="operationMode"
                      label={t("opening.depositAccountOpening.account.operationMode")}
                      options={operationModeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("opening.depositAccountOpening.account.operationModePlaceholder",
                      )}
                      searchPlaceholder={t("opening.depositAccountOpening.account.operationModeSearch",
                      )}
                      isRequired
                    />

                    {form.getValues("jointHolderDetails").length > 0 &&
                      form.getValues("jointHolderDetails").map((item, id) => (
                        <div key={id} className="self-end">
                          <FormLabel>
                            {t("opening.depositAccountOpening.account.jointMember")}{" "}
                            {id + 1}
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3  w-full">
                              <Input
                                placeholder={`${t("opening.depositAccountOpening.account.enterJointMember",
                                )} ${id + 1}`}
                                readOnly
                                value={item.Full_Name}
                              />

                              <Dialog>
                                <DialogTrigger asChild>
                                  <IoCloseCircleOutline className="text-destructive text-2xl" />
                                </DialogTrigger>

                                <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
                                  <div className="w-full flex flex-col gap-10 p-5">
                                    <p className="text-lg text-center">
                                      {t("opening.depositAccountOpening.deleteJointMember.confirmation",
                                      )}
                                    </p>

                                    <Button
                                      variant="destructive"
                                      className="w-full"
                                      onClick={() =>
                                        handleJointAccountDelete(item.Id)
                                      }
                                    >
                                      {t("opening.depositAccountOpening.deleteJointMember.delete",
                                      )}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </FormControl>
                        </div>
                      ))}

                    {form.getValues("operationMode") &&
                      form.getValues("operationMode") !== "70" && (
                        <Dialog
                          open={openJointDialog}
                          onOpenChange={setOpenJointDialog}
                        >
                          <DialogTrigger asChild>
                            <div className="flex flex-col gap-2 w-full self-end">
                              <div className="bg-primary text-white rounded-md px-3 py-2 text-center cursor-pointer h-fit ">
                                {t("opening.depositAccountOpening.account.addJointMember",
                                )}
                              </div>
                              {form.getValues("jointHolderDetails").length ===
                                0 && (
                                <p className={`text-destructive text-sm `}>
                                  {
                                    form?.formState?.errors?.jointHolderDetails
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                          </DialogTrigger>

                          <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
                            <DialogHeader>
                              <DialogTitle>
                                {t("opening.depositAccountOpening.search.title")}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="w-full">
                              <div className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 ">
                                <InputField
                                  control={form.control}
                                  name="dialougeMemberName"
                                  label={t("opening.depositAccountOpening.search.memberName",
                                  )}
                                  placeholder={t("opening.depositAccountOpening.search.placeholder",
                                  )}
                                />

                                <Button
                                  className="w-full sm:w-auto px-10"
                                  onClick={handleSearchMember}
                                >
                                  {t("opening.depositAccountOpening.search.search")}
                                </Button>
                              </div>
                              <div className="w-full ">
                                <MemberSearchTable
                                  data={memberDataByName}
                                  handleSelectData={handleJointAccountAdd}
                                  currentMemberPage={currentMemberPage}
                                  setCurrentMemberPage={setCurrentMemberPage}
                                  lastMemberPage={lastMemberPage}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.depositAccountOpening.nominee.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="nomineeName"
                      label={t("opening.depositAccountOpening.nominee.name")}
                      placeholder={t("opening.depositAccountOpening.nominee.namePlaceholder",
                      )}
                    />

                    <DropdownField
                      control={form.control}
                      name="nomineeRelation"
                      label={t("opening.depositAccountOpening.nominee.relation")}
                      options={relationTypeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("opening.depositAccountOpening.nominee.relationPlaceholder",
                      )}
                      searchPlaceholder={t("opening.depositAccountOpening.nominee.relationSearch",
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAddress"
                      label={t("opening.depositAccountOpening.nominee.address")}
                      placeholder={t("opening.depositAccountOpening.nominee.addressPlaceholder",
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAge"
                      label={t("opening.depositAccountOpening.nominee.age")}
                      placeholder={t("opening.depositAccountOpening.nominee.agePlaceholder",
                      )}
                      type="number"
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.depositAccountOpening.opening.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="openingBalance"
                      label={t("opening.depositAccountOpening.opening.balance")}
                      placeholder={t("opening.depositAccountOpening.opening.balancePlaceholder",
                      )}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="openingInterest"
                      label={t("opening.depositAccountOpening.opening.interest")}
                      placeholder={t("opening.depositAccountOpening.opening.interestPlaceholder",
                      )}
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  disabled={addDepositAccountLoading}
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                >
                  {addDepositAccountLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("opening.depositAccountOpening.buttons.add")
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
export default DepositAccountOpening;
