"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDays, addMonths, addYears, format, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import { getMemberDataByIdAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import {
  getDepositAccountTypeData,
  getDepositAgentData,
  getDepositProductData,
  getDurationTypeData,
  getEcsAccountData,
  getMaturityInstructionData,
  getOperationModeData,
  getPayoutModeData,
} from "@/container/deposit/openDepositAccount/OpenDepositAccountReducer";
import {
  checkDepositAmountAPI,
  checkDepositDurationAPI,
  getDepositAccountTypeDataAPI,
  getDepositAgentDataAPI,
  getDepositEcsAccountAPI,
  getDepositInterestRateAPI,
  getDepositMaturityAmountAPI,
  getDepositPayoutAmountAPI,
  getDepositProductDataAPI,
  getOpenDepositAccountDataAPI,
} from "@/container/deposit/openDepositAccount/OpenDepositAccountApis";
import { postOpeningDepositAccountAPI } from "./DepositAccountOpeningApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";

export const useDepositAccountOpening = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const productData = useSelector(
    (state) => state?.openDepositAccount?.depositProductData,
  );

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getDepositProductLoading, setGetDepositProductLoading] =
    useState(false);
  const [addDepositAccountLoading, setAddDepositAccountLoading] =
    useState(false);

  const [openJointDialog, setOpenJointDialog] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [depositMember, setDepositMember] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [checkDepositAmountDisable, setCheckDepositAmountDisable] =
    useState(true);
  const [checkDepositAmountMessage, setCheckDepositAmountMessage] =
    useState("");
  const [checkDepositDurationDisable, setCheckDepositDurationDisable] =
    useState(false);
  const [checkDepositDurationMessage, setCheckDepositDurationMessage] =
    useState("");

  const [jointMemberDialougeOpen, setJointMemberDialougeOpen] = useState(false);
  const [deleteJointMemberDialougeOpen, setDeleteJointMemberDialougeOpen] =
    useState(false);

  const formSchema = yup.object({
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    voterId: yup.string().nullable(),
    aadhaarNo: yup.string().nullable(),
    panNo: yup.string().nullable(),
    accountType: yup.string().required("Account type is required"),
    depositProduct: yup.string().required("Deposit product is required"),
    openingDate: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Opening date is required")
      .required("Opening date is required")
      .test("is-between", "Invalid Date", function (value) {
        if (!value) return false;
        return format(value, "yyyy-MM-dd") < startDate;
      }),
    accountNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable(),
    ledgerFolio: yup.string().nullable(),
    openingAmount: yup.string().nullable(), // Use string to handle empty strings first
    // .transform((value) => (value === "" ? null : value)) // Convert empty string to null
    // .nullable() // Allow null values for required validation
    // .test(
    //   "is-positive-integer",
    //   "Opening amount must be a positive integer without decimal points",
    //   function (value) {
    //     const { accountType } = this.parent; // Access accountType in the current form values
    //     if (accountType === "2" && value) {
    //       const numberValue = Number(value);
    //       // Check if the value is a positive integer and not a decimal
    //       return Number.isInteger(numberValue) && numberValue > 0;
    //     } // Required error for null values
    //   }
    // ),
    rateOfInterest: yup.string().nullable(),
    duration: yup
      .string() // Use string to handle empty strings
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for proper validation
      // .required("Duration is required") // Show "required" error if null or empty
      .test(
        "is-positive-integer",
        "Duration must be a positive integer without decimal points",
        (value) => {
          if (!value) return true; // The required validation will trigger if value is null
          const numberValue = Number(value);
          // Check if the value is a positive integer and not a decimal
          return Number.isInteger(numberValue) && numberValue > 0;
        },
      ),
    durationUnit: yup.string().nullable(),
    maturityDate: yup.string().nullable(),
    maturityAmount: yup.string().nullable(),
    maturityInstruction: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null or empty by default
      .test(
        "is-required-when-accountType-2",
        "Maturity instruction is required when term account",
        function (value) {
          const { accountType } = this.parent; // Access accountType in the current form values
          if (accountType === "2") {
            // If accountType is "2", validate the field is not null or empty
            return value !== null && value.trim() !== "";
          }
          return true; // Allow empty for other accountType values
        },
      ),
    operationMode: yup.string().nullable(),
    isAvailEcs: yup.boolean().nullable(),
    ecsAccount: yup
      .string()
      .test(
        "ecsAccount-required",
        "ECS account is required when ECS is available",
        function (value) {
          const { isAvailEcs, isPayoutInterest } = this.parent; // Access the value of isAvailEcs
          if (
            (isAvailEcs || isPayoutInterest) &&
            (!value || value.trim() === "")
          ) {
            return false; // Fail the validation if ECS is available but ecsAccount is empty
          }
          return true; // Pass validation if ECS is not available or ecsAccount is valid
        },
      ),
    isPayoutInterest: yup.boolean(),
    payoutMode: yup
      .string()
      .test(
        "is-required-payoutMode",
        "Payout mode is required when payout interest is true",
        function (value) {
          const { isPayoutInterest } = this.parent;
          if (isPayoutInterest && (!value || value.trim() === "")) {
            return false; // Fail if required and empty
          }
          return true; // Pass if not required or value is valid
        },
      ),
    payoutAmount: yup
      .string()
      .test(
        "is-required-payoutAmount",
        "Payout amount is required when payout interest is true",
        function (value) {
          const { isPayoutInterest } = this.parent;
          if (isPayoutInterest && (!value || value.trim() === "")) {
            return false; // Fail if required and empty
          }
          return true; // Pass if not required or value is valid
        },
      )
      .test(
        "is-valid-decimal",
        "Payout amount cannot have more than two decimal places",
        (value) => {
          // Allow empty string or null when isPayoutInterest is false
          if (value === "" || value === null) return true;
          if (!maxTwoDecimalPlaces.test(Math.abs(Number(value)))) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      ),
    agentId: yup.string(),
    jointHolderDetails: yup
      .array()
      .test(
        "min-1-child-if-operationMode-is-not-70",
        "At least one member is required",
        function (value) {
          const { operationMode } = this.parent;
          if (
            operationMode &&
            operationMode !== "70" &&
            (!value || value.length < 1)
          ) {
            return false; // Validation fails if anotherField is 1 and members array has less than 1 item
          }
          return true; // Validation passes otherwise
        },
      ),
    nomineeName: yup.string().nullable(),
    nomineeRelation: yup.string().nullable(),
    nomineeAddress: yup.string().nullable(),
    nomineeAge: yup
      .string()
      .test(
        "is-positive-integer",
        "Nominee age must be a number greater than 0",
        (value) => {
          if (!value || value.trim() === "") return true; // Pass if empty or null, as it's optional
          const numValue = parseFloat(value);
          return Number.isInteger(numValue) && numValue > 0; // Ensure it's a whole number greater than 0
        },
      ),
    openingBalance: yup
      .string()
      .test(
        "is-required-openingBalance",
        "Opening balance is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-number",
        "Opening balance must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Opening balance can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      )
      .test(
        "is-equal-to-openingAmount",
        "Opening balance must be equal to deposit amount",
        function (value) {
          const accountType = this.parent.accountType;
          const openingAmount = this.parent.openingAmount;

          if (accountType === "2") {
            return value === openingAmount; // Must be exactly equal
          }
          return true; // Skip validation if accountType is not "2"
        },
      ),
    openingInterest: yup
      .string()
      .test(
        "is-required-openingInterest",
        "Opening interest is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-whole-number",
        "Opening interest must be a number greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return Number.isInteger(numValue) && numValue > 0; // Ensure it's a whole number and greater than 0
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      voterId: "",
      aadhaarNo: "",
      panNo: "",
      accountType: "",
      depositProduct: "",
      openingDate: null,
      accountNo: "",
      ledgerFolio: "",
      openingAmount: "",
      rateOfInterest: "",
      duration: "",
      durationUnit: "",
      maturityDate: "",
      maturityAmount: "",
      maturityInstruction: "",
      operationMode: "",
      isAvailEcs: false,
      ecsAccount: "",
      isPayoutInterest: false,
      payoutMode: "",
      payoutAmount: "",
      agentId: "",
      jointHolderDetails: [],
      nomineeName: "",
      nomineeRelation: "",
      nomineeAddress: "",
      nomineeAge: "",
      openingBalance: "",
      openingInterest: "",
    },
  });

  const { control } = form;

  const {
    accountType,
    depositProduct,
    openingDate,
    openingAmount,
    duration,
    durationUnit,
    payoutMode,
    rateOfInterest,
    operationMode,
    isAvailEcs,
    ecsAccount,
    isPayoutInterest,
    payoutAmount,
    openingBalance,
  } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    postOpenDepositApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const handleJointAccountAdd = (values) => {
    if (form.getValues("jointHolderDetails").length < 2) {
      if (
        form
          .getValues("jointHolderDetails")
          .filter((item) => item.Id === values.Id).length === 0
      ) {
        const currentMembers = form.getValues("jointHolderDetails") || [];
        form.setValue("jointHolderDetails", [...currentMembers, values]);
        setJointMemberDialougeOpen(false);
        // Clear the input
      } else {
        toast.error("Member already added");
      }
      setOpenJointDialog(false);
    } else {
      toast.error("Please remove a member first");
    }
  };

  const handleJointAccountDelete = (values) => {
    const newMemberList = form
      .getValues("jointHolderDetails")
      .filter((item) => item.Id !== values);
    form.setValue("jointHolderDetails", [...newMemberList]);
    setDeleteJointMemberDialougeOpen(false);
    // Clear the input
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpenDepositApiCall = async (item) => {
    let data = {
      start_date: startDate,
      mem_id: depositMember.Id || null,
      ref_ac_no: item.accountNo || null,
      ledg_fol: item.ledgerFolio || null,
      open_date: item.openingDate
        ? formatDateForApi(item.openingDate)
        : null,
      prod_type: item.accountType || null,
      dep_type:
        productData.find((prod) => prod.Id === Number(item.depositProduct))
          ?.Deposit_Type || null,
      prod_id: item.depositProduct || null,
      oper_mode: item.operationMode || null,
      roi: item.rateOfInterest || null,
      dep_amount: item.openingAmount || null,
      duration: item.duration || null,
      dur_unit: item.durationUnit || null,
      mature_ins: item.maturityInstruction || null,
      mature_date: item.maturityDate
        ? formatDateForApi(item.maturityDate)
        : null,
      mature_amt: item.maturityAmount || null,
      nom_name: item.nomineeName || null,
      nom_rel: item.nomineeRelation || null,
      nom_add: item.nomineeAddress || null,
      nom_age: item.nomineeAge || null,
      joint_hld1:
        item.jointHolderDetails.length > 0
          ? item.jointHolderDetails[0]?.Id
          : null,
      joint_hld2:
        item.jointHolderDetails.length > 1
          ? item.jointHolderDetails[1]?.Id
          : null,
      ecs_avail: item.isAvailEcs || null,
      ecs_ac_id: item.ecsAccount || null,
      is_payout: item.isPayoutInterest,
      pay_mode: item.payoutMode || null,
      pay_amt: item.payoutAmount || null,
      cbs_ac_no: null,
      agent_id: item.agentId || null,
      open_intt: item.openingInterest || null,
      open_balance: item.openingBalance || null,
      branch_Id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setAddDepositAccountLoading(true);

    try {
      const res = await postOpeningDepositAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setResetTrigger((prev) => prev + 1);
        // toast.success(res.details || res.message);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setAddDepositAccountLoading(false);
    }
  };

  const getDepositAccountTypeDataApiCall = async (orgId) => {
    setLoading(true);
    try {
      const res = await getDepositAccountTypeDataAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getDepositAccountTypeData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getDepositAccountTypeData([]));
      }
    } catch (error) {
      dispatch(getDepositAccountTypeData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDepositProductDataApiCall = async (orgId, typeId) => {
    setGetDepositProductLoading(true);
    try {
      const res = await getDepositProductDataAPI(orgId, typeId);
      if (res.message === "Data Found") {
        dispatch(getDepositProductData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getDepositProductData([]));
      }
    } catch (error) {
      dispatch(getDepositProductData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setGetDepositProductLoading(false);
    }
  };

  const getDurationTypeDataApiCall = async (org_id) => {
    setLoading(true);
    try {
      const res = await getOpenDepositAccountDataAPI("DURATIONTYPE", org_id || orgId);
      if (res.message === "Data Found") {
        dispatch(getDurationTypeData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getDurationTypeData([]));
      }
    } catch (error) {
      dispatch(getDurationTypeData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getOperationModeDataApiCall = async (org_id) => {
    setLoading(true);
    try {
      const res = await getOpenDepositAccountDataAPI("OPERATIONMODE", org_id || orgId);
      if (res.message === "Data Found") {
        dispatch(getOperationModeData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getOperationModeData([]));
      }
    } catch (error) {
      dispatch(getOperationModeData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMaturityInstructionDataApiCall = async (org_id) => {
    setLoading(true);
    try {
      const res = await getOpenDepositAccountDataAPI("MATURITYINSTRUCTION", org_id || orgId);
      if (res.message === "Data Found") {
        dispatch(getMaturityInstructionData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getMaturityInstructionData([]));
      }
    } catch (error) {
      dispatch(getMaturityInstructionData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPayoutModeDataApiCall = async (org_id) => {
    setLoading(true);
    try {
      const res = await getOpenDepositAccountDataAPI("PAYOUTMODE", org_id || orgId);
      if (res.message === "Data Found") {
        dispatch(getPayoutModeData(res.details));
      } else {
        toast.error(res.details);
        dispatch(getPayoutModeData([]));
      }
    } catch (error) {
      dispatch(getPayoutModeData([]));
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkDepositAmountApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await checkDepositAmountAPI(
        form.getValues("depositProduct"),
        form.getValues("openingAmount"),
        orgId,
      );
      if (res.message === "Data Found") {
        setCheckDepositAmountDisable(false);
        setCheckDepositAmountMessage("");
        getDepositAgentApiCall(orgId);
      } else {
        setCheckDepositAmountDisable(true);
        setCheckDepositAmountMessage(res.details);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setCheckDepositAmountDisable(true);
      setCheckDepositAmountMessage("");
    } finally {
      setLoading(false);
    }
  };

  const checkDepositDurationApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await checkDepositDurationAPI(
        form.getValues("depositProduct"),
        form.getValues("duration"),
        form.getValues("durationUnit"),
        orgId,
      );
      if (res.message === "Data Found") {
        setCheckDepositDurationDisable(false);
        setCheckDepositDurationMessage("");
        if (form.getValues("openingDate")) {
          if (form.getValues("durationUnit") === "17")
            form.setValue(
              "maturityDate",
              addDays(
                form.getValues("openingDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "18")
            form.setValue(
              "maturityDate",
              addMonths(
                form.getValues("openingDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "19")
            form.setValue(
              "maturityDate",
              addYears(
                form.getValues("openingDate"),
                Number(form.getValues("duration")),
              ),
            );
        }
        toast.success(res.details);
      } else {
        setCheckDepositDurationDisable(true);
        setCheckDepositDurationMessage(res.details);
        form.setValue("maturityDate", null);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setCheckDepositDurationDisable(true);
      setCheckDepositDurationMessage("");
      form.setValue("maturityDate", null);
    } finally {
      setLoading(false);
    }
  };

  const getDepositInterestRateApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getDepositInterestRateAPI(
        form.getValues("depositProduct"),
        form.getValues("duration") || 0,
        form.getValues("durationUnit") || 0,
        format(form.getValues("openingDate"), "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("rateOfInterest", res.details);
      } else {
        form.setValue("rateOfInterest", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("rateOfInterest", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositMaturityAmountApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getDepositMaturityAmountAPI(
        form.getValues("depositProduct"),
        form.getValues("duration"),
        form.getValues("durationUnit"),
        form.getValues("openingAmount"),
        form.getValues("rateOfInterest"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("maturityAmount", res.details);
      } else {
        form.setValue("maturityAmount", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("maturityAmount", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositPayoutAmountApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getDepositPayoutAmountAPI(
        form.getValues("depositProduct"),
        form.getValues("payoutMode"),
        form.getValues("openingAmount"),
        form.getValues("rateOfInterest"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("payoutAmount", res.details);
      } else {
        form.setValue("payoutAmount", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("payoutAmount", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositAgentApiCall = async (orgId) => {
    setLoading(true);
    try {
      const res = await getDepositAgentDataAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getDepositAgentData(res.details));
      } else {
        dispatch(getDepositAgentData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getDepositAgentData([]));
    } finally {
      setLoading(false);
    }
  };

  const getDepositEcsAccountApiCall = async (orgId, memberId) => {
    setLoading(true);

    try {
      const res = await getDepositEcsAccountAPI(orgId, memberId);
      if (res.message === "Data Found") {
        dispatch(getEcsAccountData(res.details));
      } else {
        dispatch(getEcsAccountData([]));
      }
      console.log("res", res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getEcsAccountData([]));
    } finally {
      setLoading(false);
    }
  };

  const getMemberDataByIdApiCall = async (orgId, memberNo) => {
    setLoading(true);
    try {
      const res = await getMemberDataByIdAPI(orgId, memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setDepositMember(res.details[0]);
        form.setValue("memberNo", res.details[0].Cust_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Cust_Mob || "");
        form.setValue("voterId", res.details[0].Cust_Voter || "");
        form.setValue("aadhaarNo", res.details[0].Cust_Aadar || "");
        form.setValue("panNo", res.details[0].Cust_Pan || "");
      } else {
        setVisibleBlock(false);
        setDepositMember(null);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("voterId", "");
        form.setValue("aadhaarNo", "");
        form.setValue("panNo", "");
        toast.error(res.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setDepositMember(null);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("voterId", "");
      form.setValue("aadhaarNo", "");
      form.setValue("panNo", "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountType) getDepositProductDataApiCall(orgId, accountType);
    form.setValue("depositProduct", "");
  }, [accountType]);

  useEffect(() => {
    if (openingAmount && openingAmount > 0 && depositProduct)
      checkDepositAmountApiCall(orgId);
  }, [openingAmount, depositProduct]);

  useEffect(() => {
    if (duration && duration > 0 && durationUnit && depositProduct)
      checkDepositDurationApiCall(orgId);
  }, [duration, durationUnit, depositProduct]);

  useEffect(() => {
    form.setValue("duration", "");
    setCheckDepositDurationMessage("");
  }, [durationUnit]);

  useEffect(() => {
    if (
      depositProduct &&
      duration &&
      duration > 0 &&
      durationUnit &&
      openingAmount &&
      openingAmount > 0 &&
      rateOfInterest &&
      rateOfInterest > 0
    ) {
      getDepositMaturityAmountApiCall(orgId);
    }
  }, [depositProduct, duration, durationUnit, openingAmount, rateOfInterest]);

  useEffect(() => {
    if (
      payoutMode &&
      openingAmount &&
      openingAmount > 0 &&
      rateOfInterest &&
      rateOfInterest > 0
    ) {
      getDepositPayoutAmountApiCall(orgId);
    }
  }, [payoutMode, openingAmount, rateOfInterest]);

  useEffect(() => {
    form.setValue("jointHolderDetails", []);
  }, [operationMode]);

  const prevDuration = useRef();
  const prevDurationUnit = useRef();
  const prevDepositProduct = useRef();
  const prevOpeningDate = useRef();

  useEffect(() => {
    const currentDuration = form.getValues("duration");
    const currentDurationUnit = form.getValues("durationUnit");
    const currentDepositProduct = form.getValues("depositProduct");
    const currentOpeningDate = form.getValues("openingDate");

    if (
      (accountType === "2"
        ? currentDuration &&
          currentDurationUnit &&
          currentDepositProduct &&
          currentOpeningDate &&
          (currentDuration !== prevDuration.current ||
            currentDurationUnit !== prevDurationUnit.current ||
            currentDepositProduct !== prevDepositProduct.current ||
            currentOpeningDate !== prevOpeningDate.current)
        : currentDepositProduct &&
          currentOpeningDate &&
          (currentDepositProduct !== prevDepositProduct.current ||
            currentOpeningDate !== prevOpeningDate.current)) &&
      orgId
    ) {
      getDepositInterestRateApiCall(orgId);
    }

    prevDuration.current = currentDuration;
    prevDurationUnit.current = currentDurationUnit;
    prevDepositProduct.current = currentDepositProduct;
    prevOpeningDate.current = currentOpeningDate;
  }, [duration, durationUnit, depositProduct, accountType, openingDate]);

  useEffect(() => {
    if (isAvailEcs) {
      getDepositEcsAccountApiCall(orgId, depositMember.Id);
    }
  }, [isAvailEcs]);

  useEffect(() => {
    form.trigger("openingAmount");
  }, [accountType, openingAmount]);

  useEffect(() => {
    form.trigger("ecsAccount");
  }, [isAvailEcs, ecsAccount, isPayoutInterest]);

  useEffect(() => {
    form.trigger("payoutAmount");
    form.trigger("payoutMode");
  }, [isPayoutInterest, payoutMode, payoutAmount]);

  useEffect(() => {
    if (accountType === "2") form.trigger("openingBalance");
  }, [accountType, openingAmount, openingBalance]);

  return {
    loading,
    getDepositProductLoading,
    addDepositAccountLoading,
    getDepositAccountTypeDataApiCall,
    getDurationTypeDataApiCall,
    getMaturityInstructionDataApiCall,
    getOperationModeDataApiCall,
    getPayoutModeDataApiCall,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleJointAccountAdd,
    handleJointAccountDelete,
    jointMemberDialougeOpen,
    deleteJointMemberDialougeOpen,
    checkDepositAmountDisable,
    checkDepositAmountMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,
    openJointDialog,
    setOpenJointDialog,
    resetTrigger,
  };
};
