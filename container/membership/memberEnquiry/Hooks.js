"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parse } from "date-fns";
import { useIssueMembership } from "../issueMembership/Hooks";
import { getMemberEnquiryInfoAPI } from "./MemberEnquiryApis";
import { useShareLedger } from "@/common/ledger/shareLedger/Hooks";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";
import { useLoanLedger } from "@/common/ledger/loanLedger/Hooks";
import { getMemberDataByName } from "../issueMembership/IssueMembershipReducer";

export const useMemberEnquiry = () => {
  const dispatch = useDispatch();

  const fromDate = getCookieData("fin_start_date");

  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState("1");

  const orgId = getCookieData("orgId");

  const {
    getMemberListDataLoading,
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  const {
    loading: getShareLedgerLoading,
    showLedger: showShareLedger,
    setShowLedger: setShowShareLedger,
    ledgerHeaderData: shareLedgerHeaderData,
    ledgerTableData: shareLedgerTableData,
    totalRefund,
    totalIssue,
    userName: shareUserName,
    currentDate: shareCurrentDate,
    currentTime: shareCurrentTime,
    getShareLedgerHeaderApiCall,
    getShareLedgerDataApiCall,
  } = useShareLedger();

  const {
    loading: getDepositLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData: depositLedgerHeaderData,
    ledgerTableData: depositLedgerTableData,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    userName: depositUserName,
    currentDate: depositCurrentDate,
    currentTime: depositCurrentTime,
    getDepositLedgerHeaderApiCall,
    getDepositLedgerDataApiCall,
  } = useDepositLedger();

  const {
    loading: getLoanLedgerLoading,
    showLedger: showLoanLedger,
    setShowLedger: setShowLoanLedger,
    ledgerHeaderData: loanLedgerHeaderData,
    ledgerTableData: loanLedgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName: loanUserName,
    currentDate: loanCurrentDate,
    currentTime: loanCurrentTime,
    getLoanLedgerHeaderApiCall,
    getLoanLedgerDataApiCall,
  } = useLoanLedger();

  const [loading, setLoading] = useState(null);
  const [dialougeOpen, setDialougeOpen] = useState(false);

  const [membershipDetails, setMembershipDetails] = useState(null);

  const [depositActiveAccount, setDepositActiveAccount] = useState([]);
  const [depositClosedAccount, setDepositClosedAccount] = useState([]);

  const [loanActiveAccount, setLoanActiveAccount] = useState([]);
  const [loanClosedAccount, setLoanClosedAccount] = useState([]);

  const formSchema = yup.object({
    fromDate: yup.string().nullable(),
    toDate: yup.string().nullable(),
    cifNo: yup.string().required("CIF no is required"),
    dialougeMemberName: yup.string().nullable(),
    memberNo: yup.string().nullable(),
    name: yup.string().nullable(),
    gurdian: yup.string().nullable(),
    contact: yup.string().nullable(),
    address: yup.string().nullable(),
    depositType: yup.string().nullable(),
    loanType: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: new Date(),
      cifNo: "",
      dialougeMemberName: "",
      memberNo: "",
      name: "",
      gurdian: "",
      contact: "",
      address: "",
      depositType: "",
      loanType: "",
    },
  });

  const { control } = form;
  const { depositType, loanType } = useWatch({ control });

  const handleSubmit = (values) => {
    console.log("values from handleSubmit", values);
    getMemberDataByIdApiCall(values);
    setLedgerFromDate(values.fromDate);
    setLedgerToDate(values.toDate);
  };

  const handleSearchMember = () => {
    if (form.getValues("dialougeMemberName")) {
      getMemberDataByNameApiCall(
        orgId,
        1,
        form.getValues("dialougeMemberName"),
        selectedRadio,
      );
      setCurrentMemberPage(1);
    } else toast.error("Please enter name");
  };

  const handleSelectClick = (data) => {
    form.setValue("cifNo", data.CIF_No);
    setDialougeOpen(false);
  };

  const handleShowLedger = (type, memberNo) => {
    if (type === "SHARE") {
      getShareLedgerHeaderApiCall(memberNo, ledgerToDate, ledgerFromDate);
      setShowShareLedger(true);
    } else if (type === "DEPOSIT") {
      getDepositLedgerHeaderApiCall(memberNo, ledgerToDate, ledgerFromDate);
      setShowLedgerDialog(true);
    } else if (type === "LOAN") {
      getLoanLedgerHeaderApiCall(memberNo, ledgerToDate, ledgerFromDate);
      getLoanLedgerDataApiCall(memberNo, ledgerToDate, ledgerFromDate);
      setShowLoanLedger(true);
    }
  };

  const getMemberDataByIdApiCall = async (item) => {
    setLoading(true);

    console.log("item from getMemberDataByIdApiCall", item);

    try {
      const res = await getMemberEnquiryInfoAPI(
        item.cifNo,
        item.fromDate ? format(item.fromDate, "yyyy-MM-dd") : null,
        item.toDate ? format(item.toDate, "yyyy-MM-dd") : null,
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details.Personal_Info[0].Cust_No);
        form.setValue("name", res.details.Personal_Info[0].Full_Name);
        form.setValue("gurdian", res.details.Personal_Info[0].Relation_Name);
        form.setValue("contact", res.details.Personal_Info[0].Cust_Mob);
        form.setValue("address", res.details.Personal_Info[0].Address);
        setMembershipDetails(
          res.details.Membership_Details
            ? res.details.Membership_Details[0]
            : null,
        );
        setDepositActiveAccount(
          res.details.Deposit_Account_Active
            ? res.details.Deposit_Account_Active
            : [],
        );
        setDepositClosedAccount(
          res.details.Deposit_Account_Closed
            ? res.details.Deposit_Account_Closed
            : [],
        );
        setLoanActiveAccount(
          res.details.Loan_Active ? res.details.Loan_Active : [],
        );
        setLoanClosedAccount(
          res.details.Loan_Closed ? res.details.Loan_Closed : [],
        );
        form.setValue(
          "depositType",
          res.details.Deposit_Account_Active ? "active" : "closed",
        );
        form.setValue(
          "loanType",
          res.details.Loan_Active ? "active" : "closed",
        );
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("name", "");
        form.setValue("gurdian", "");
        form.setValue("contact", "");
        form.setValue("address", "");
        setMembershipDetails(null);
        setDepositActiveAccount([]);
        setDepositClosedAccount([]);
        setLoanActiveAccount([]);
        setLoanClosedAccount([]);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("name", "");
      form.setValue("gurdian", "");
      form.setValue("contact", "");
      form.setValue("address", "");
      setMembershipDetails(null);
      setDepositActiveAccount([]);
      setDepositClosedAccount([]);
      setLoanActiveAccount([]);
      setLoanClosedAccount([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate) {
      form.setValue("fromDate", new Date(fromDate));
    }
  }, [fromDate]);

  useEffect(() => {
    getMemberDataByNameApiCall(
      orgId,
      currentMemberPage,
      form.getValues("dialougeMemberName"),
      selectedRadio,
    );
  }, [currentMemberPage, selectedRadio]);

  useEffect(() => {
    dispatch(getMemberDataByName([]));
    form.setValue("dialougeMemberName", "");
  }, [dialougeOpen]);

  return {
    loading,
    getMemberListDataLoading,
    form,
    handleSubmit,
    handleSearchMember,
    handleSelectClick,
    dialougeOpen,
    setDialougeOpen,
    membershipDetails,
    depositActiveAccount,
    depositClosedAccount,
    depositType,
    loanActiveAccount,
    loanClosedAccount,
    loanType,
    ledgerFromDate,
    ledgerToDate,
    handleShowLedger,
    showShareLedger,
    setShowShareLedger,
    shareLedgerHeaderData,
    shareLedgerTableData,
    totalRefund,
    totalIssue,
    shareUserName,
    shareCurrentDate,
    shareCurrentTime,
    showLedgerDialog,
    setShowLedgerDialog,
    depositLedgerHeaderData,
    depositLedgerTableData,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    depositUserName,
    depositCurrentDate,
    depositCurrentTime,
    showLoanLedger,
    setShowLoanLedger,
    loanLedgerHeaderData,
    loanLedgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    loanUserName,
    loanCurrentDate,
    loanCurrentTime,
    getShareLedgerLoading,
    getDepositLedgerLoading,
    getLoanLedgerLoading,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
    selectedRadio,
    setSelectedRadio,
  };
};
