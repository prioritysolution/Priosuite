"use client";


import { useTranslation } from "react-i18next";
import React from "react";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import MemberSearchTable from "@/common/tables/MemberSearchTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import InputField from "@/common/formFields/InputField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";
import getCookieData from "@/utils/getCookieData";
import { getYear } from "date-fns";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import {
  User,
  Users,
  MapPin,
  Calendar,
  Percent,
  UserPlus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DepositReceipt from "../deposit/DepositReceipt";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OpenDepositAccount = ({
  loading,
  getDepositProductLoading,
  getOpenDepositLoading,
  postOpenDepositLoading,
  accountType,
  openingDate,
  transMode,
  openingAmount,
  depositProduct,
  notes,
  inDenominators,
  outDenominators,
  cashInTransactionTotal,
  cashOutTransactionTotal,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  getDepositAccountTypeDataApiCall,
  getDurationTypeDataApiCall,
  getMaturityInstructionDataApiCall,
  getOperationModeDataApiCall,
  getPayoutModeDataApiCall,
  getDepositEcsAccountApiCall,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleJointAccountAdd,
  handleJointAccountDelete,
  handleAddNominee,
  handleDeleteNominee,
  jointMemberDialougeOpen,
  setJointMemberDialougeOpen,
  specialJointDialogOpen,
  setSpecialJointDialogOpen,
  grpInstMemberData,
  grpInstMemberLoading,
  GetGrpInstMemberApiCall,
  deleteJointMemberDialougeOpen,
  setDeleteJointMemberDialougeOpen,
  checkDepositAmountDisable,
  checkDepositAmountMessage,
  checkDepositDurationDisable,
  checkDepositDurationMessage,
  resetTrigger,
  isReceiptOpen,
  setIsReceiptOpen,
  depositReceiptData,
  handleGenerateDepositReceipt,
  insufficientBalanceDisable,
  allowProcessDeposit,
  isAvailEcs,
  isPayoutInterest,
}) => {
  const { t } = useTranslation();

  const RadioData = [
    { label: t("memberSearch.individualCustomer"), value: "1" },
    { label: t("memberSearch.group"), value: "2" },
    { label: t("memberSearch.institution"), value: "3" },
    { label: t("memberSearch.staff"), value: "4" },
  ];

  console.log("notes=", notes);

  const dispatch = useDispatch();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");

  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const orgId = getCookieData("orgId");

  // Fetch group/institute member data when special dialog opens
  useEffect(() => {
    if (specialJointDialogOpen && orgId) {
      const parrId = form.getValues("memberId"); // Using memberNo as parr_id
      if (parrId) {
        GetGrpInstMemberApiCall(orgId, parrId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialJointDialogOpen]);

  const {
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

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

  console.log("relationTypeData", relationTypeData);

  const maturityInstructionData = useSelector(
    (state) => state?.openDepositAccount?.maturityInstructionData,
  );

  const operationModeData = useSelector(
    (state) => state?.openDepositAccount?.operationModeData,
  );

  // console.log("operationModeData", operationModeData);

  const watchedJointHolderDetails = form.watch("jointHolderDetails");
  const jointHolderDetailsForCheck = useMemo(
    () => watchedJointHolderDetails || [],
    [watchedJointHolderDetails],
  );
  const memberNoForCheck = form.watch("memberNo");

  const jointDetails = form.watch("jointHolderDetails") || [];
  const primaryId = form.watch("memberNo");

  // const memberDataByName = useSelector(
  //   (state) => state?.issueMembership?.memberDataByName,
  // ).filter((item) => {
  //   return (
  //     item.Cust_No !== Number(primaryId) &&
  //     !jointDetails.some((jh) => jh.Cust_No === item.Cust_No)
  //   );
  // });

  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  ).filter((item) => item.Member_No !== form.getValues("memberNo"));

  const memberDataById = useSelector(
    (state) => state?.issueMembership?.memberDataById,
  );

  console.log("memberDataById", memberDataById);

  const payoutModeData = useSelector(
    (state) => state?.openDepositAccount?.payoutModeData,
  );

  const agentData = useSelector(
    (state) => state?.openDepositAccount?.depositAgentData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const ecsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const handleSearchMember = () => {
    if (form.getValues("dialougeMemberName"))
      getMemberDataByNameApiCall(
        orgId,
        currentMemberPage,
        form.getValues("dialougeMemberName"),
        selectedRadio,
      );
    else toast.error("Please enter name");
  };

  useEffect(() => {
    form.setValue("dialougeMemberName", "");
    dispatch(getMemberDataByName([]));
  }, [jointMemberDialougeOpen, form, dispatch]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };

      console.log("file=", file);

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!memberNoForCheck) {
      setPhotoPreview(null);
      setSignaturePreview(null);
    }
  }, [memberNoForCheck]);

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log("form.getValues accountType=", form.getValues("accountType"));

  console.log("form.getValues operationMode=", form.getValues("operationMode"));

  // Check if search member ID equals any joint holder customer number
  const checkMemberIdMatch = useCallback(() => {
    const searchMemberId = form.getValues("memberNo");
    const jointHolderDetails = form.getValues("jointHolderDetails") || [];

    if (searchMemberId && jointHolderDetails.length > 0) {
      const matchingJointHolder = jointHolderDetails.find(
        (jointHolder) => jointHolder.Cust_No === Number(searchMemberId),
      );

      if (matchingJointHolder) {
        toast.error("You Cannot Add Same Customer As Joint Holder!");

        return true;
      }
    }
    return false;
  }, [form]);

  // Wrapper function to check before adding joint holder
  const handleJointAccountAddWithCheck = (memberData) => {
    const primaryId = form.getValues("memberNo");
    const jointDetails = form.getValues("jointHolderDetails") || [];
    const memberId = form.getValues("memberId");

    console.log("memberId=", memberId);
    console.log("jointDetails=", jointDetails);
    console.log("memberData=", memberData);

    // Check if the member being added is the primary holder
    if (memberData && memberData.Id === Number(memberId)) {
      toast.error("You Cannot Add Same Customer As Joint Holder!");
      return;
    }

    // Check if the member is already in the joint holder list
    // const isAlreadyIn = jointDetails.some(
    //   (jh) => jh.Cust_No === memberData.Cust_No,
    // );
    const isAlreadyIn = jointDetails.some((jh) => jh.Id === memberData.Id);

    if (isAlreadyIn) {
      toast.error("This member is already added as a joint holder!");
      return;
    }

    // Pass the unique and valid member to the original handler
    handleJointAccountAdd(memberData);
  };

  // Run the check when joint holder details change or search member changes
  React.useEffect(() => {
    checkMemberIdMatch();
  }, [jointHolderDetailsForCheck, memberNoForCheck, checkMemberIdMatch]);

  const branchId = getCookieData("userBranchId");
  const beg_date = getCookieData("beg_date");

  useEffect(() => {
    if (beg_date) {
      form.setValue("openingDate", new Date(beg_date));
    }
  }, [beg_date, form]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <ScrollArea className="w-full h-full px-2 sm:px-10">
          <div className="w-full mb-2">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              loading={getOpenDepositLoading}
              resetTrigger={resetTrigger}
              formLabel={t("deposit.openDepositAccount.title")}
              showDateFix={true}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("Form Validation Errors:", errors);
                toast.error("Please fill all required fields correctly.");
              })}
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.basicInfo")}
                  </h3>
                  {getOpenDepositLoading ? (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-20 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label={t("deposit.fields.memberNo")}
                        placeholder={t("deposit.placeholders.memberNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label={t("deposit.fields.cifNo")}
                        placeholder={t("deposit.placeholders.cifNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("deposit.fields.memberName")}
                        placeholder={t("deposit.placeholders.memberName")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("deposit.fields.guardianName")}
                        placeholder={t("deposit.placeholders.guardianName")}
                        readOnly
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("deposit.sections.address")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("deposit.placeholders.address")}
                                {...field}
                                className="resize-none"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("deposit.fields.mobileNo")}
                        placeholder={t("deposit.placeholders.mobileNo")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="branchName"
                        label={t("deposit.fields.branchName")}
                        placeholder={t("deposit.placeholders.branchName")}
                        readOnly
                        className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.kycDetails")}
                  </h3>
                  {getOpenDepositLoading ? (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 3 }).map((_, index) => (
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
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="voterId"
                        label={t("deposit.fields.voterId")}
                        placeholder={t("deposit.placeholders.voterId")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="aadhaarNo"
                        label={t("deposit.fields.aadhaarNo")}
                        placeholder={t("deposit.placeholders.aadhaarNo")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="panNo"
                        label={t("deposit.fields.panNo")}
                        placeholder={t("deposit.placeholders.panNo")}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.accountInfo")}
                  </h3>
                  {getOpenDepositLoading ? (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 8 }).map((_, index) => (
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
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      <DropdownField
                        control={form.control}
                        name="accountType"
                        label={t("deposit.fields.accountType")}
                        options={accountTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("deposit.placeholders.selectAccountType")}
                        searchPlaceholder={t("deposit.placeholders.searchAccountType")}
                        isRequired
                      />

                      <DropdownField
                        control={form.control}
                        name="depositProduct"
                        label={t("deposit.fields.product")}
                        options={productData}
                        optionLabelKey="Prd_SH_Name"
                        loading={getDepositProductLoading}
                        disabled={
                          !productData ||
                          !(productData.length > 0) ||
                          !form.getValues("accountType")
                        }
                        isRequired
                      />

                      <DatePickerField
                        control={form.control}
                        name="openingDate"
                        label={t("deposit.fields.openingDate")}
                        startYear={
                          startDate
                            ? getYear(new Date(startDate))
                            : getYear(new Date())
                        }
                        disabledDateAfter={
                          endDate
                            ? new Date(endDate) > new Date()
                              ? new Date()
                              : new Date(endDate)
                            : new Date()
                        }
                        endYear={
                          endDate
                            ? getYear(new Date(endDate))
                            : getYear(new Date())
                        }
                        value={openingDate}
                        disabled={!allowProcessDeposit}
                        onPopover={true}
                        isRequired
                      />

                      <InputField
                        control={form.control}
                        name="accountNo"
                        label={t("deposit.fields.manualRefAccountNo")}
                        placeholder={t("deposit.placeholders.accountNo")}
                        disabled={!allowProcessDeposit}
                      />

                      <InputField
                        control={form.control}
                        name="ledgerFolio"
                        label={t("deposit.fields.ledgerFolio")}
                        placeholder={t("deposit.placeholders.ledgerFolio")}
                        disabled={!allowProcessDeposit}
                      />

                      <FormField
                        control={form.control}
                        name="openingAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {productData.find(
                                (item) => item.Id === Number(depositProduct),
                              )?.Deposit_Type &&
                              productData.find(
                                (item) => item.Id === Number(depositProduct),
                              )?.Deposit_Type === 4
                                ? "Installment"
                                : "Opening"}{" "}
                              Amount
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${
                                  productData.find(
                                    (item) =>
                                      item.Id === Number(depositProduct),
                                  )?.Deposit_Type &&
                                  productData.find(
                                    (item) =>
                                      item.Id === Number(depositProduct),
                                  )?.Deposit_Type === 4
                                    ? "Installment"
                                    : "Opening"
                                } amount`}
                                disabled={
                                  !depositProduct || !allowProcessDeposit
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            {checkDepositAmountMessage && (
                              <p className="text-destructive text-sm">
                                {checkDepositAmountMessage}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      {/* Account Type 2 - Term Deposit */}

                      {Number(accountType) === 2 && depositProduct ? (
                        <>
                          <DropdownField
                            control={form.control}
                            name="durationUnit"
                            label={t("deposit.fields.durationUnit")}
                            options={durationTypeData}
                            optionLabelKey="Option_Value"
                            placeholder={t("deposit.placeholders.selectDurationUnit")}
                            searchPlaceholder={t("deposit.placeholders.searchDurationUnit")}
                            disabled={
                              checkDepositAmountDisable || !allowProcessDeposit
                            }
                          />
                          <InputField
                            control={form.control}
                            name="duration"
                            label={t("deposit.fields.duration")}
                            placeholder={t("deposit.placeholders.duration")}
                            readOnly={
                              checkDepositAmountDisable ||
                              !form.getValues("durationUnit") ||
                              !allowProcessDeposit
                            }
                            errorMessage={checkDepositDurationMessage}
                          />

                          <InputField
                            control={form.control}
                            name="rateOfInterest"
                            label={t("deposit.fields.rateOfInterest")}
                            placeholder={t("deposit.placeholders.rateOfInterest")}
                            readOnly
                          />

                          <DatePickerField
                            control={form.control}
                            name="maturityDate"
                            label={t("deposit.fields.maturityDate")}
                            disabled
                          />

                          <InputField
                            control={form.control}
                            name="maturityAmount"
                            label={t("deposit.fields.maturityAmount")}
                            placeholder={t("deposit.placeholders.maturityAmount")}
                            readOnly
                          />
                          <DropdownField
                            control={form.control}
                            name="maturityInstruction"
                            label={t("deposit.fields.maturityInstruction")}
                            options={maturityInstructionData}
                            optionLabelKey="Option_Value"
                            placeholder={t("deposit.placeholders.selectMaturityInstruction")}
                            searchPlaceholder={t("deposit.placeholders.searchMaturityInstruction")}
                            disabled={
                              checkDepositAmountDisable || !allowProcessDeposit
                            }
                            isRequired={
                              Number(form.getValues("accountType")) === 2
                            }
                          />
                          <FormField
                            control={form.control}
                            name="isAvailEcs"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Is Avail ECS
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={
                                      checkDepositAmountDisable ||
                                      !allowProcessDeposit
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <DropdownField
                            control={form.control}
                            name="ecsAccount"
                            label={t("deposit.fields.ecsAccount")}
                            options={ecsAccountData}
                            optionLabelKey="Account_No"
                            disabled={!isAvailEcs || !allowProcessDeposit}
                            isRequired={form.getValues("isAvailEcs")}
                          />
                          {Number(accountType) === 2 &&
                          (productData.find(
                            (item) => item.Id === Number(depositProduct),
                          )?.Deposit_Type === 3 ||
                            productData.find(
                              (item) => item.Id === Number(depositProduct),
                            )?.Deposit_Type === 4) ? (
                            <>
                              {" "}
                              <FormField
                                control={form.control}
                                name="isPayoutInterest"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Is Payout Interest
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={
                                          checkDepositAmountDisable ||
                                          !allowProcessDeposit
                                        }
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <DropdownField
                                control={form.control}
                                name="payoutMode"
                                label={t("deposit.fields.payoutMode")}
                                options={
                                  productData?.find(
                                    (item) =>
                                      item?.Id === Number(depositProduct),
                                  )?.Deposit_Type === 4
                                    ? payoutModeData.filter(
                                        (data) => data.Id === 2,
                                      )
                                    : payoutModeData
                                }
                                optionLabelKey="Option_Value"
                                placeholder={t("deposit.placeholders.selectPayoutMode")}
                                searchPlaceholder={t("deposit.placeholders.searchPayoutMode")}
                                disabled={
                                  !isPayoutInterest || !allowProcessDeposit
                                }
                                isRequired={form.getValues("isPayoutInterest")}
                              />
                              <InputField
                                control={form.control}
                                name="payoutAmount"
                                label={t("deposit.fields.payoutAmount")}
                                placeholder={t("deposit.placeholders.payoutAmount")}
                                readOnly
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      <DropdownField
                        control={form.control}
                        name="agentId"
                        label={t("deposit.fields.agent")}
                        options={agentData}
                        optionLabelKey="Agent_Name"
                        placeholder={t("deposit.placeholders.selectAgent")}
                        searchPlaceholder={t("deposit.placeholders.searchAgent")}
                        disabled={
                          checkDepositAmountDisable || !allowProcessDeposit
                        }
                      />

                      {/* Operation Mode */}
                      <FormField
                        control={form.control}
                        name="operationMode"
                        render={({ field }) => {
                          // Customer types that should not allow "Single" operation mode (Id: 70)
                          const restrictedCustomerTypes = [2, 3, 4];
                          const customerType = form.getValues("Customer_Type");

                          // Filter out "Single" option (Id: 70) for restricted customer types
                          const filteredOptions =
                            restrictedCustomerTypes.includes(
                              Number(customerType),
                            )
                              ? operationModeData.filter(
                                  (option) => option.Id !== 1,
                                )
                              : operationModeData;

                          return (
                            <DropdownField
                              label={t("deposit.fields.operationMode")}
                              value={field.value}
                              onChange={field.onChange}
                              options={filteredOptions}
                              optionLabelKey="Option_Value"
                              placeholder={t("deposit.placeholders.selectOperationMode")}
                              searchPlaceholder={t("deposit.placeholders.searchOperationMode")}
                              disabled={
                                checkDepositAmountDisable ||
                                !allowProcessDeposit
                              }
                              isRequired
                            />
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Joint Member Details */}
              <div className="flex flex-col w-full gap-3 sm:gap-4 lg:gap-6">
                {form.getValues("operationMode") &&
                  form.getValues("operationMode") !== 1 && (
                    <>
                      {/* Button to open appropriate dialog */}
                      <div
                        className="flex flex-col gap-2 w-full"
                        onClick={() => {
                          const customerType = form.getValues("Customer_Type");
                          const restrictedTypes = [2, 3, 4];
                          if (restrictedTypes.includes(Number(customerType))) {
                            setSpecialJointDialogOpen(true);
                          } else {
                            setJointMemberDialougeOpen(true);
                          }
                        }}
                      >
                        <div className="bg-primary text-white rounded-md px-3 sm:px-4 py-2 sm:py-3 text-center cursor-pointer h-fit hover:bg-primary/90 transition-all duration-200 text-sm sm:text-base font-medium shadow-sm hover:shadow-md">
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add Joint Member Details
                          </span>
                        </div>
                        {form.getValues("jointHolderDetails").length === 0 && (
                          <p
                            className={`text-destructive text-xs sm:text-sm text-center sm:text-left px-1`}
                          >
                            {
                              form?.formState?.errors?.jointHolderDetails
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Regular Joint Member Dialog */}
                      <Dialog
                        open={jointMemberDialougeOpen}
                        onOpenChange={setJointMemberDialougeOpen}
                      >
                        <DialogContent className="w-[calc(100vw-1rem)] max-w-[825px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
                          <DialogHeader className="shrink-0 pr-8 text-left">
                            <DialogTitle className="text-base sm:text-lg">
                              Search Members
                            </DialogTitle>
                          </DialogHeader>

                          <RadioGroup
                            defaultValue="1"
                            value={selectedRadio}
                            onValueChange={setSelectedRadio}
                            className="flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0"
                          >
                            {RadioData.map((item, index) => (
                              <div
                                className="flex items-center gap-2 min-w-0"
                                key={index}
                              >
                                <RadioGroupItem
                                  value={item.value}
                                  id={item.value}
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
                                    <FormLabel>{t("deposit.fields.memberName")}</FormLabel>
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
                                className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                                onClick={handleSearchMember}
                              >
                                Search
                              </Button>
                            </div>
                            <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                              <MemberSearchTable
                                data={memberDataByName}
                                handleSelectData={
                                  handleJointAccountAddWithCheck
                                }
                                currentMemberPage={currentMemberPage}
                                setCurrentMemberPage={setCurrentMemberPage}
                                lastMemberPage={lastMemberPage}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                {form.getValues("operationMode") &&
                  form.getValues("operationMode") !== 70 && (
                    <div className="w-full">
                      {form.getValues("jointHolderDetails").length > 0 && (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <FormLabel className="text-sm sm:text-base lg:text-lg font-semibold text-foreground flex items-center gap-2">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {t("deposit.sections.jointHolderDetails")}
                              <span className="text-xs sm:text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {form.getValues("jointHolderDetails").length}{" "}
                                member
                                {form.getValues("jointHolderDetails").length > 1
                                  ? "s"
                                  : ""}
                              </span>
                            </FormLabel>
                          </div>
                          {/* joint holder Table */}
                          <div className="border rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader className="bg-muted/50">
                                  <TableRow>
                                    <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">
                                      {t("deposit.common.custNo")}
                                    </TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left hidden md:table-cell">
                                      {t("deposit.common.cifNoShort")}
                                    </TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left min-w-[120px] sm:min-w-[150px]">
                                      {t("deposit.common.fullName")}
                                    </TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left hidden lg:table-cell min-w-[100px]">{t("deposit.fields.relation")}</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center sm:text-right">{t("deposit.common.action")}</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {form
                                    .getValues("jointHolderDetails")
                                    .map((item, id) => (
                                      <TableRow
                                        key={id}
                                        className="hover:bg-muted/30 transition-colors border-b border-muted/20"
                                      >
                                        <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden sm:table-cell">
                                          <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                                            {item.Cust_No || "-"}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden md:table-cell">
                                          <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                                            {item.CIF_No || "-"}
                                          </span>
                                        </TableCell>
                                        <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 min-w-[120px] sm:min-w-[150px]">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                              <svg
                                                className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            </div>
                                            <span className="font-medium">
                                              {item.Full_Name || "-"}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden lg:table-cell">
                                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                            {item.Relation_Name || "-"}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center sm:text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 lg:h-auto lg:w-auto transition-all duration-200 rounded-md"
                                                title="Remove member"
                                              >
                                                <svg
                                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                  />
                                                </svg>
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-[calc(100vw-1rem)] max-w-sm p-4 sm:p-5 rounded-lg">
                                              <div className="w-full flex flex-col gap-4 sm:gap-5">
                                                <div className="text-center min-w-0">
                                                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
                                                    <svg
                                                      className="w-6 h-6 sm:w-7 sm:h-7 text-destructive"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                                                    {t("deposit.buttons.removeJointHolder")}
                                                  </h3>
                                                  <p className="text-sm text-muted-foreground break-words">
                                                    Are you sure you want to
                                                    remove{" "}
                                                    <span className="font-medium text-foreground">
                                                      {item.Full_Name}
                                                    </span>{" "}
                                                    from the joint holder
                                                    details?
                                                  </p>
                                                </div>
                                                <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
                                                  <Button
                                                    variant="outline"
                                                    className="w-full flex-1"
                                                    onClick={() => {
                                                      setDeleteJointMemberDialougeOpen(
                                                        false,
                                                      );
                                                    }}
                                                  >
                                                    Cancel
                                                  </Button>
                                                  <Button
                                                    variant="destructive"
                                                    className="w-full flex-1"
                                                    onClick={() =>
                                                      handleJointAccountDelete(
                                                        item.Id || item.Cust_Id,
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      className="w-4 h-4 mr-2"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                      />
                                                    </svg>
                                                    Remove Member
                                                  </Button>
                                                </div>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Nominee Block */}
                {visibleBlock && (
                  <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      {t("deposit.sections.nomineeDetails")}
                    </h3>

                    {getOpenDepositLoading ? (
                      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-end">
                          <InputField
                            control={form.control}
                            name="nomineeName"
                            label={t("deposit.fields.nomineeName")}
                            placeholder={t("deposit.placeholders.nomineeName")}
                            className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
                          />
                          <DropdownField
                            control={form.control}
                            name="nomineeRelation"
                            label={t("deposit.fields.relation")}
                            options={relationTypeData}
                            optionLabelKey="Option_Value"
                            placeholder={t("deposit.placeholders.selectRelation")}
                            searchPlaceholder={t("deposit.placeholders.searchRelation")}
                            className="h-10"
                          />

                          <InputField
                            control={form.control}
                            name="nomineeAddress"
                            label={t("deposit.fields.nomineeAddress")}
                            placeholder={t("deposit.placeholders.nomineeAddress")}
                            className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
                          />

                          <FormField
                            control={form.control}
                            name="nomineeAge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                                  Age
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("deposit.placeholders.age")}
                                    type="text"
                                    maxLength={2}
                                    className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Only allow whole numbers and limit to 2 digits
                                      if (
                                        value === "" ||
                                        (/^\d{1,2}$/.test(value) &&
                                          Number(value) <= 99)
                                      ) {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nomineePercentage"
                            render={({ field }) => {
                              // Calculate total percentage including current input
                              const currentNominees =
                                form.getValues("nomineeDetails") || [];
                              const totalUsedPercentage =
                                currentNominees.reduce(
                                  (sum, nominee) =>
                                    sum +
                                    Number(nominee.nomineePercentage || 0),
                                  0,
                                );
                              const currentInputPercentage = Number(
                                field.value || 0,
                              );
                              const totalWithCurrent =
                                totalUsedPercentage + currentInputPercentage;
                              const remainingPercentage =
                                100 - totalUsedPercentage;

                              return (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                                    Nominee (%)
                                    {remainingPercentage < 100 && (
                                      <span className="text-xs text-muted-foreground">
                                        ({remainingPercentage}% remaining)
                                      </span>
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("deposit.placeholders.percentage")}
                                      type="number"
                                      min="1"
                                      max="100"
                                      className={`h-10 transition-all focus:ring-2 focus:ring-primary/20 ${
                                        totalWithCurrent > 100
                                          ? "border-red-500 focus:ring-red-200"
                                          : ""
                                      }`}
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        // Allow empty value
                                        if (value === "") {
                                          field.onChange(value);
                                          return;
                                        }

                                        // Allow decimal numbers with up to 2 decimal places
                                        if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                                          return;
                                        }

                                        const numValue = Number(value);

                                        // Allow any value up to 100, but we'll show error if it exceeds remaining
                                        if (numValue >= 1 && numValue <= 100) {
                                          field.onChange(value);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  {field.value && totalWithCurrent > 100 && (
                                    <p className="text-sm font-medium text-destructive">
                                      Total would be {totalWithCurrent}%.
                                      Maximum allowed is 100%.
                                    </p>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button
                            type="button"
                            onClick={handleAddNominee}
                            className="bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-2 px-6 py-5 rounded-lg font-bold group transition-all"
                          >
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Nominee
                          </Button>
                        </div>

                        {form.getValues("nomineeDetails").length > 0 && (
                          <div className="w-full mt-4">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <FormLabel className="text-sm sm:text-base lg:text-lg font-semibold text-foreground flex items-center gap-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                {t("deposit.sections.nomineeDetails")}
                                <span className="text-xs sm:text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                  {form.getValues("nomineeDetails").length}{" "}
                                  nominee
                                  {form.getValues("nomineeDetails").length > 1
                                    ? "s"
                                    : ""}
                                </span>
                              </FormLabel>
                            </div>

                            <div className="border rounded-lg overflow-hidden shadow-sm">
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader className="bg-muted/50">
                                    <TableRow>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left">{t("deposit.common.name")}</TableHead>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">{t("deposit.fields.relation")}</TableHead>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left hidden md:table-cell">
                                        {t("deposit.sections.address")}
                                      </TableHead>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left">{t("deposit.common.age")}</TableHead>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left">{t("deposit.common.percentage")}</TableHead>
                                      <TableHead className="font-semibold text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center sm:text-right">{t("deposit.common.action")}</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {form
                                      .getValues("nomineeDetails")
                                      .map((item) => (
                                        <TableRow
                                          key={item.id}
                                          className="hover:bg-muted/30 transition-colors border-b border-muted/20"
                                        >
                                          <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                              </div>
                                              <span className="font-medium">
                                                {item.nomineeName}
                                              </span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden sm:table-cell">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                              {relationTypeData?.find(
                                                (rel) =>
                                                  rel.Id ===
                                                  item.nomineeRelation,
                                              )?.Option_Value ||
                                                item.nomineeRelation}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden md:table-cell">
                                            <span className="text-muted-foreground">
                                              {item.nomineeAddress}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                              {item.nomineeAge}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-xs sm:text-sm px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium focus:ring-2 ring-purple-200">
                                              {Number(
                                                item.nomineePercentage,
                                              ).toFixed(2)}
                                              %
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-center sm:text-right px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              type="button"
                                              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 rounded-md"
                                              onClick={() =>
                                                handleDeleteNominee(item.id)
                                              }
                                              title="Remove nominee"
                                            >
                                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      {t("deposit.sections.specimen")}
                    </h3>
                    {getOpenDepositLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:gap-20 gap-x-10 gap-y-3 ">
                        <div className="w-full flex flex-col gap-2 items-center">
                          <Skeleton className="w-[80px] h-5 self-start rounded-none bg-secondary" />
                          <Skeleton className="w-[200px] h-[200px] rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                        <div className="w-full flex flex-col gap-2 items-center">
                          <Skeleton className="w-[80px] h-5 self-start rounded-none bg-secondary" />
                          <Skeleton className="w-[200px] h-[200px] rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:gap-20 gap-x-10 gap-y-3 ">
                        <FormField
                          control={form.control}
                          name="photo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("deposit.common.photo")}</FormLabel>
                              <div className="w-[200px] h-[200px] border border-primary mx-auto relative">
                                {photoPreview && (
                                  <Image
                                    src={photoPreview}
                                    alt="Photo Preview"
                                    fill
                                  />
                                )}
                              </div>
                              <FormControl>
                                <Input
                                  placeholder={t("deposit.uploadSpecimen.uploadPhoto")}
                                  type="file"
                                  accept="image/*"
                                  className=""
                                  onChange={(e) => {
                                    handlePhotoChange(e);
                                    field.onChange(e.target.files[0]);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="signature"
                          render={({ field }) => (
                            <FormItem className="h-full flex flex-col justify-between">
                              <div>
                                <FormLabel>{t("deposit.common.signature")}</FormLabel>
                                <div className="w-[200px] h-[50px] border border-primary mx-auto relative">
                                  {signaturePreview && (
                                    <Image
                                      src={signaturePreview}
                                      alt="Signature Preview"
                                      className=""
                                      fill
                                    />
                                  )}
                                </div>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder={t("deposit.uploadSpecimen.uploadSignature")}
                                  type="file"
                                  accept="image/*"
                                  className=""
                                  onChange={(e) => {
                                    handleSignatureChange(e);
                                    field.onChange(e.target.files[0]);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* ── Transaction block ── */}
                {visibleBlock && (
                  <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:px-5 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      {t("deposit.sections.transaction")}
                    </h3>
                    {getOpenDepositLoading ? (
                      <div className="w-full flex flex-col gap-3">
                        <Skeleton className=" h-10 w-full lg:w-[400px] bg-secondary " />
                        <div className="w-48 flex flex-col gap-[10px]">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="transMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                              <FormLabel>
                                {t("deposit.common.selectTransanctionMode")}{"  "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="cash" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {t("deposit.common.cash")}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="bank" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {t("deposit.common.bank")}
                                    </FormLabel>
                                  </FormItem>
                                  {Number(accountType) !== 1 && (
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="savings" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {t("deposit.common.savings")}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                          <InputField
                            control={form.control}
                            name="refVouchNo"
                            label={t("deposit.fields.refVoucherNo")}
                            placeholder={t("deposit.placeholders.refVoucherNo")}
                          />
                          {transMode === "cash" ? (
                            isActiveDenom ? (
                              <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-10 col-span-2">
                                <DoubleCashDenomTable
                                  notes={notes}
                                  inDenominators={inDenominators}
                                  outDenominators={outDenominators}
                                  totalInAmount={cashInTransactionTotal}
                                  totalOutAmount={cashOutTransactionTotal}
                                  cashInTransactionGrandTotal={
                                    cashInTransactionGrandTotal
                                  }
                                  cashOutTransactionGrandTotal={
                                    cashOutTransactionGrandTotal
                                  }
                                  handleInDenominatorChange={
                                    handleInDenominatorChange
                                  }
                                  handleOutDenominatorChange={
                                    handleOutDenominatorChange
                                  }
                                />
                              </div>
                            ) : null
                          ) : transMode === "bank" ? (
                            <FormField
                              control={form.control}
                              name="bank"
                              render={({ field }) => (
                                <DropdownField
                                  label={t("deposit.fields.bank")}
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name" // Specify the key for label
                                  placeholder={t("deposit.placeholders.selectBank")}
                                  searchPlaceholder={t("deposit.placeholders.searchBank")}
                                />
                              )}
                            />
                          ) : (
                            <>
                              <FormField
                                control={form.control}
                                name="savings"
                                render={({ field }) => (
                                  <DropdownField
                                    label={t("deposit.fields.savings")}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={ecsAccountData}
                                    optionLabelKey="Account_No" // Specify the key for label
                                    placeholder={t("deposit.placeholders.selectSavings")}
                                    searchPlaceholder={t("deposit.placeholders.searchSavings")}
                                  />
                                )}
                              />
                              <InputField
                                control={form.control}
                                name="savingsName"
                                label={t("deposit.fields.accountHolderName")}
                                placeholder={t("deposit.placeholders.memberName")}
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="savingsBalance"
                                label={t("deposit.fields.availableBalance")}
                                placeholder={t("deposit.placeholders.availableBalance")}
                                readOnly
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Add setion  */}
                {visibleBlock && (
                  <Button
                    type="submit"
                    className="w-full sm:w-1/5 self-end"
                    onClick={() => {
                      const operationMode = form.getValues("operationMode");
                      const jointHolderDetails =
                        form.getValues("jointHolderDetails") || [];

                      if (
                        (operationMode === "2" || operationMode === "3") &&
                        jointHolderDetails.length === 0
                      ) {
                        toast.error(
                          "At least one joint member is required for this operation mode",
                        );
                        return;
                      }
                    }}
                    disabled={
                      postOpenDepositLoading ||
                      (transMode === "cash" &&
                        isActiveDenom &&
                        Number(cashInTransactionGrandTotal) -
                          Number(cashOutTransactionGrandTotal) !==
                          Number(openingAmount)) ||
                      !Number(openingAmount) ||
                      (transMode === "bank" && !form.getValues("bank")) ||
                      (transMode === "savings" && !savings) ||
                      checkDepositAmountDisable ||
                      checkDepositDurationDisable ||
                      insufficientBalanceDisable ||
                      ((form.getValues("operationMode") === "2" ||
                        form.getValues("operationMode") === "3") &&
                        (form.getValues("jointHolderDetails") || []).length ===
                          0)
                    }
                  >
                    {postOpenDepositLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      t("deposit.buttons.add")
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
        showNextButton={true}
        handleNextButton={handleGenerateDepositReceipt}
        nextLabel="Print Receipt"
      />
      {!showSuccessMessage && (
        <DepositReceipt
          isOpen={isReceiptOpen}
          setIsOpen={setIsReceiptOpen}
          depositReceiptData={depositReceiptData}
        />
      )}

      <Dialog
        open={specialJointDialogOpen}
        onOpenChange={setSpecialJointDialogOpen}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[900px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
          <DialogHeader className="shrink-0 pr-8 text-left">
            <DialogTitle className="text-base sm:text-lg">
              Add Joint Member
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Select members to add as joint holders
            </DialogDescription>
          </DialogHeader>

          {grpInstMemberLoading ? (
            <div className="flex justify-center py-8">
              <ClipLoader size={40} color="#3B82F6" />
            </div>
          ) : (
            <div className="w-full min-h-0 flex-1 overflow-auto rounded-md border border-border">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] whitespace-nowrap">
                        {t("deposit.common.serialNo")}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        {t("deposit.common.memberNoShort")}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">{t("deposit.common.cifNoShort")}</TableHead>
                      <TableHead className="whitespace-nowrap">
                        {t("deposit.common.fullName")}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">{t("deposit.fields.relationName")}</TableHead>
                      <TableHead className="whitespace-nowrap">
                        {t("deposit.sections.address")}
                      </TableHead>
                      <TableHead className="text-right whitespace-nowrap">{t("deposit.common.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grpInstMemberData.length > 0 ? (
                      grpInstMemberData.map((member, index) => (
                        <TableRow key={member.Cust_Id || index}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {member.Cust_No || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {member.CIF_No || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {member.Full_Name || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {member.Relation_Name || "-"}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {member.Address || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleJointAccountAdd(member);
                                setSpecialJointDialogOpen(false);
                              }}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenDepositAccount;
