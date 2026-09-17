"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDays, addMonths, addYears, format } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import {
  getCheckBalanceAPI,
  getMemberDataByIdAPI,
} from "@/container/membership/issueMembership/IssueMembershipApis";
import {
  checkDepositAmountAPI,
  checkDepositDurationAPI,
  getDepositAccountTypeDataAPI,
  getDepositProductDataAPI,
  getDepositAgentDataAPI,
  getDepositEcsAccountAPI,
  getDepositMaturityAmountAPI,
  getDepositPayoutAmountAPI,
  getOpenDepositAccountDataAPI,
  postOpenDepositAccountAPI,
  getDepositInterestRateAPI,
  CheckAllowProcessDepositAPI,
  GetGrpInstMemberAPI,
} from "./OpenDepositAccountApis";
import {
  getDepositAccountTypeData,
  getDepositAgentData,
  getDepositProductData,
  getDurationTypeData,
  getEcsAccountData,
  getMaturityInstructionData,
  getOperationModeData,
  getPayoutModeData,
} from "./OpenDepositAccountReducer";
import {
  alphanumericWithHyphenUnderscoreRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";

const parseDateHelper = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;

  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
      if (parts[2].split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

export const useOpenDepositAccount = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const productData = useSelector(
    (state) => state?.openDepositAccount?.depositProductData,
  );

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getDepositProductLoading, setGetDepositProductLoading] =
    useState(false);
  const [getOpenDepositLoading, setGetOpenDepositLoading] = useState(false);
  const [postOpenDepositLoading, setPostOpenDepositLoading] = useState(false);

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

  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);

  const [allowProcessDeposit, setAllowProcessDeposit] = useState(false);

  const [jointMemberDialougeOpen, setJointMemberDialougeOpen] = useState(false);
  const [specialJointDialogOpen, setSpecialJointDialogOpen] = useState(false);
  const [deleteJointMemberDialougeOpen, setDeleteJointMemberDialougeOpen] =
    useState(false);

  // Group/Institute member data for special joint dialog
  const [grpInstMemberData, setGrpInstMemberData] = useState([]);
  const [grpInstMemberLoading, setGrpInstMemberLoading] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [depositReceiptData, setDepositReceiptData] = useState(null);

  // denominators
  const [inDenominators, setInDenominators] = useState([]);
  const [outDenominators, setOutDenominators] = useState([]);

  // cash Transaction Total
  const [cashInTransactionTotal, setCashInTransactionTotal] = useState([]);
  const [cashOutTransactionTotal, setCashOutTransactionTotal] = useState([]);

  const [cashInTransactionGrandTotal, setCashInTransactionGrandTotal] =
    useState(0);

  const [cashOutTransactionGrandTotal, setCashOutTransactionGrandTotal] =
    useState(0);

  const [cashInDenomArray, setCashInDenomArray] = useState([]);
  const [cashOutDenomArray, setCashOutDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const formSchema = yup.object({
    memberNo: yup.string().nullable(),
    memberId: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    branchName: yup.string().nullable(),
    BranchId: yup.string().nullable(),
    voterId: yup.string().nullable(),
    aadhaarNo: yup.string().nullable(),
    panNo: yup.string().nullable(),
    accountType: yup.string().required("Account type is required"),
    depositProduct: yup.string().required("Deposit product is required"),
    openingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Opening date is required")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return false;
        if (!startDate || !endDate) return true;
        const sDate = parseDateHelper(startDate);
        const eDate = parseDateHelper(endDate);
        if (!sDate || !eDate) return true;

        const beg_date = getCookieData("beg_date");
        const begDateParsed = parseDateHelper(beg_date);

        const today = new Date();
        const max = eDate > today ? today : eDate;
        const maxDate =
          begDateParsed &&
          !isNaN(begDateParsed.getTime()) &&
          begDateParsed > max
            ? begDateParsed
            : max;

        const valDate = new Date(value);
        valDate.setHours(0, 0, 0, 0);
        sDate.setHours(0, 0, 0, 0);
        maxDate.setHours(23, 59, 59, 999);

        return valDate >= sDate && valDate <= maxDate;
      }),
    accountNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test("not-only-zero", "Account no. cannot be only 0", (value) => {
        if (!value) return true;
        return !/^[0]+$/.test(value);
      })
      .max(5, "Account no. must be at most 5 characters") // Validate maximum length
      .test("is-valid-account-no", "Account no. is invalid", (value) => {
        if (value === null) return true; // Skip validation if value is null or empty
        return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
      }),
    ledgerFolio: yup.string().nullable(),
    openingAmount: yup.string().nullable(),
    // .transform((value) => (value === "" ? null : value)) // Convert empty string to null
    // .nullable() // Allow null values for required validation
    // .test(
    //   "is-integer",
    //   "Opening amount must be a positive integer",
    //   function (value) {
    //     const { accountType } = this.parent; // Access accountType in the current form values
    //     if (Number(accountType) === 2 && value) {
    //       const numberValue = Number(value);
    //       // Check if the value is a positive integer and not a decimal
    //       return Number.isInteger(numberValue) && numberValue > 0;
    //     } else return true; // Required error for null values
    //   }
    // ),
    rateOfInterest: yup.string().nullable(),
    duration: yup
      .string()
      .notRequired() // Allow field to be optional
      .test(
        "is-positive-integer",
        "Duration must be a positive integer without decimal points",
        (value) => {
          if (!value) return true; // Allow empty value
          const numberValue = Number(value);
          return Number.isInteger(numberValue) && numberValue > 0; // Validate only when a value is provided
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
          if (Number(accountType) === 2) {
            // If accountType is "2", validate the field is not null or empty
            return value !== null && value.trim() !== "";
          }
          return true; // Allow empty for other accountType values
        },
      ),
    operationMode: yup.string().required("Operation mode is required"),
    isAvailEcs: yup.boolean(),
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
            operationMode !== "1" &&
            (!value || value.length < 1)
          ) {
            return false; // Validation fails if anotherField is 1 and members array has less than 1 item
          }
          return true; // Validation passes otherwise
        },
      ),
    nomineeName: yup.string(),
    nomineeRelation: yup.string(),
    nomineeAddress: yup.string(),
    nomineeAge: yup
      .string()
      .test("is-valid-age", "Nominee age must be 3 digits or less", (value) => {
        if (!value || value.trim() === "") return true; // Pass if empty or null, as it's optional
        const numValue = parseFloat(value);
        return Number.isInteger(numValue) && value.length <= 2; // Ensure it's 3 digits or less
      }),
    nomineePercentage: yup
      .string()
      .test("is-valid-percentage", function (value) {
        const currentNominees = this.parent.nomineeDetails || [];
        const totalUsedPercentage = currentNominees.reduce(
          (sum, nominee) => sum + Number(nominee.nomineePercentage || 0),
          0,
        );
        const remainingPercentage = 100 - totalUsedPercentage;
        const newPercentage = Number(value || 0);

        // If no value provided, it's valid (field is optional until adding)
        if (!value || value.trim() === "") return true;

        // Check if new percentage exceeds remaining
        if (newPercentage > remainingPercentage) {
          return this.createError({
            message: `Only ${remainingPercentage}% remaining. Cannot add ${newPercentage}%`,
          });
        }

        // Check if percentage is valid
        if (newPercentage <= 0 || newPercentage > 100) {
          return this.createError({
            message: "Percentage must be between 1 and 100",
          });
        }

        return true;
      }),
    nomineeDetails: yup.array(),
    photo: yup.mixed(),
    signature: yup.mixed(),
    transMode: yup.string().required("Transaction mode is required"),
    bank: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test(
        "is-valid-ref-vouch-no",
        "Reference voucher number is invalid",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange", // Trigger validation on input change
    defaultValues: {
      memberNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      Customer_Type: "",
      voterId: "",
      aadhaarNo: "",
      panNo: "",
      accountType: "",
      depositProduct: "",
      openingDate: new Date(),
      accountNo: "",
      ledgerFolio: "",
      openingAmount: "",
      rateOfInterest: "",
      duration: "",
      durationUnit: "",
      // maturityDate: new Date(),
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
      nomineeDetails: [], // Added nomineeDetails array
      nomineeName: "",
      nomineeRelation: "",
      nomineeAddress: "",
      nomineeAge: "",
      nomineePercentage: "", // Added missing nomineePercentage
      photo: "",
      signature: "",
      transMode: "cash",
      refVouchNo: "",
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
    transMode,
    payoutAmount,
    savings,
    savingsBalance,
  } = useWatch({
    control,
  });

  const customerType = form.watch("Customer_Type");

  // Calculate maturity date when duration or durationUnit changes
  useEffect(() => {
    if (duration && durationUnit && openingDate) {
      let maturityDate;
      const durationNum = parseInt(duration);

      switch (durationUnit) {
        case 1: // Days
          maturityDate = addDays(new Date(openingDate), durationNum);
          break;
        case 2: // Months
          maturityDate = addMonths(new Date(openingDate), durationNum);
          break;
        case 3: // Years
          maturityDate = addYears(new Date(openingDate), durationNum);
          break;
        default:
          // If durationUnit is not recognized, don't update maturityDate
          return;
      }

      if (maturityDate) {
        const currentMaturityDate = form.getValues("maturityDate");
        // Only update if the calculated date is different from current value
        if (
          !currentMaturityDate ||
          maturityDate.getTime() !== new Date(currentMaturityDate).getTime()
        ) {
          form.setValue("maturityDate", maturityDate, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }
  }, [duration, durationUnit, openingDate, form]);

  const handleSubmit = async (values) => {
    console.log("postOpenDepositApiCall=", values);

    postOpenDepositApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setDepositReceiptData(null);
  };

  const handleGenerateDepositReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsReceiptOpen(true);
  };

  const handleJointAccountAdd = (values) => {
    if (form.getValues("jointHolderDetails").length < 2) {
      // Get the ID from either regular dialog (Id) or special dialog (Cust_Id)
      const newMemberId = values.Id || values.Cust_Id;
      if (
        form
          .getValues("jointHolderDetails")
          .filter((item) => (item.Id || item.Cust_Id) === newMemberId)
          .length === 0
      ) {
        const currentMembers = form.getValues("jointHolderDetails") || [];
        form.setValue("jointHolderDetails", [...currentMembers, values]);
        setJointMemberDialougeOpen(false);
        // Clear the input
      } else {
        toast.error("Member already added");
      }
    } else {
      toast.error("Please remove a member first");
    }
  };

  const handleJointAccountDelete = (values) => {
    const newMemberList = form
      .getValues("jointHolderDetails")
      .filter((item) => (item.Id || item.Cust_Id) !== values);
    form.setValue("jointHolderDetails", [...newMemberList]);
    setDeleteJointMemberDialougeOpen(false);
    // Clear the input
  };

  const handleAddNominee = () => {
    const nomineeName = form.getValues("nomineeName");
    const nomineeRelation = form.getValues("nomineeRelation");
    const nomineeAddress = form.getValues("nomineeAddress");
    const nomineeAge = form.getValues("nomineeAge");
    const nomineePercentage = form.getValues("nomineePercentage");

    // Check if all required fields are filled
    if (
      !nomineeName ||
      !nomineeRelation ||
      !nomineeAddress ||
      !nomineeAge ||
      !nomineePercentage
    ) {
      toast.error("Please fill all nominee details");
      return;
    }

    // Calculate total percentage after adding new nominee
    const currentNominees = form.getValues("nomineeDetails") || [];
    const totalUsedPercentage = currentNominees.reduce(
      (sum, nominee) => sum + Number(nominee.nomineePercentage || 0),
      0,
    );
    const newPercentage = Number(nomineePercentage);
    const totalAfterAdding = totalUsedPercentage + newPercentage;

    // Check if total would exceed 100%
    if (totalAfterAdding > 100) {
      toast.error(
        `Cannot add nominee. Total would be ${totalAfterAdding}%. Only ${100 - totalUsedPercentage}% remaining.`,
      );
      return;
    }

    // Check if total would equal exactly 100% and this would be the last nominee
    if (totalAfterAdding === 100) {
      toast.success(
        `Nominee added successfully. Total percentage reached 100%. No more nominees can be added.`,
      );
    } else {
      toast.success(
        `Nominee added successfully. ${100 - totalAfterAdding}% remaining.`,
      );
    }

    // Create nominee object
    const nominee = {
      id: Date.now(), // Simple unique ID
      nomineeName,
      nomineeRelation,
      nomineeAddress,
      nomineeAge,
      nomineePercentage,
    };

    // Add to nomineeDetails array
    form.setValue("nomineeDetails", [...currentNominees, nominee]);

    // Clear the form fields
    form.setValue("nomineeName", "");
    form.setValue("nomineeRelation", "");
    form.setValue("nomineeAddress", "");
    form.setValue("nomineeAge", "");
    form.setValue("nomineePercentage", "");
  };

  const handleDeleteNominee = (id) => {
    const newNomineeList = form
      .getValues("nomineeDetails")
      .filter((item) => item.id !== id);
    form.setValue("nomineeDetails", [...newNomineeList]);
    toast.success("Nominee removed successfully");
  };

  const postOpenDepositApiCall = async (data) => {
    setPostOpenDepositLoading(true);
    const cashDetails = cashInDenomArray.map((inItem, idx) => {
      return {
        note_id: inItem.note_id,
        in_qnty: inItem.denominator,
        out_qnty: cashOutDenomArray.filter(
          (outItem) => inItem.note_id === outItem.note_id,
        )[0].denominator,
        tot_amount: cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });

    // Create a new FormData object
    const formData = new FormData();

    // Append all the form data fields to the FormData object
    formData.append("member_id", depositMember.Id);
    formData.append("ref_ac_no", data.accountNo);
    formData.append("ledg_folio", data.ledgerFolio);
    formData.append("open_date", formatDateForApi(data.openingDate));
    formData.append("prod_type", data.accountType);
    formData.append(
      "dep_type",
      productData.find((prod) => prod.Id === Number(data.depositProduct))
        .Deposit_Type,
    );
    formData.append("prod_id", data.depositProduct);
    formData.append("oper_mode", data.operationMode);
    formData.append("proi", data.rateOfInterest);
    formData.append("pamount", data.openingAmount);
    formData.append("duration", data.duration);
    formData.append("dur_unit", data.durationUnit);
    formData.append("matur_ins", data.maturityInstruction);
    formData.append(
      "matur_date",
      data.maturityDate ? formatDateForApi(data.maturityDate) : null,
    );
    formData.append("matur_amt", data.maturityAmount);

    // Append sing_data as array data like cash_details
    if (data.jointHolderDetails && data.jointHolderDetails.length > 0) {
      data.jointHolderDetails.forEach((holder, index) => {
        // Handle both regular dialog (Id) and special dialog (Cust_Id)
        const custId = holder.Id || holder.Cust_Id;
        formData.append(`sing_data[${index}][cust_id]`, custId);
      });
    } else {
      // Send empty array as JSON string when no joint holders
      formData.append("sing_data", JSON.stringify([]));
    }

    // Append nom_data as array data like cash_details
    if (data.nomineeDetails && data.nomineeDetails.length > 0) {
      data.nomineeDetails.forEach((nominee, index) => {
        formData.append(`nom_data[${index}][nom_name]`, nominee.nomineeName);
        formData.append(`nom_data[${index}][nom_rel]`, nominee.nomineeRelation);
        formData.append(`nom_data[${index}][nom_add]`, nominee.nomineeAddress);
        formData.append(`nom_data[${index}][nom_age]`, nominee.nomineeAge);
        formData.append(
          `nom_data[${index}][nom_perc]`,
          nominee.nomineePercentage,
        );
      });
    } else {
      // Send empty array as JSON string when no nominees
      formData.append("nom_data", JSON.stringify([]));
    }

    formData.append("ecs_avail", data.isAvailEcs ? 1 : 0);
    formData.append("ecs_ac_id", data.ecsAccount || null);
    formData.append("is_int_payout", data.isPayoutInterest ? 1 : 0);
    formData.append("pay_mode", data.payoutMode || null);
    formData.append("pay_amt", data.payoutAmount || null);
    formData.append("cbs_ac_no", null);
    formData.append("agent_id", data.agentId);
    formData.append("ref_vouch", data.refVouchNo ? data.refVouchNo : null);
    formData.append(
      "sb_id",
      data.transMode === "savings" ? data.savings : null,
    );
    formData.append("bank_id", data.transMode === "bank" ? data.bank : null);
    formData.append("branch_id", branchId);
    formData.append("fin_id", finId);
    formData.append("org_id", orgId);
    formData.append("Customer_Type", data.Customer_Type);

    // Append the file fields if they exist
    if (data.photo) {
      formData.append("spec_image", data.photo);
    }
    if (data.signature) {
      formData.append("spec_sing", data.signature);
    }

    // Append the cash details as a JSON string if necessary
    // formData.append("cash_details", JSON.stringify(cashDetails));

    cashDetails.forEach((cashItem, index) => {
      for (let key in cashItem) {
        formData.append(`cash_details[${index}][${key}]`, cashItem[key]);
      }
    });

    console.log("formData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await postOpenDepositAccountAPI(
        formData,
        "multipart/form-data",
      );

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        setVisibleBlock(false);
        form.reset();
        setResetTrigger((prev) => prev + 1);
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setDepositReceiptData(res.Data[0]);
      } else {
        console.error("API Error Response:", res);
        toast.error(res.details || res.message);
        setSuccessMessage(null);
        setVisibleBlock(true);
      }
    } catch (error) {
      console.error("Full Error Details:", error);
      console.error("Error Response:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
      toast.error(
        error.response?.data?.details ||
          error.response?.data?.message ||
          "Something went wrong",
      );
      setSuccessMessage(null);
      setVisibleBlock(true);
    } finally {
      setPostOpenDepositLoading(false);
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
      const res = await getOpenDepositAccountDataAPI(
        "DURATIONTYPE",
        org_id || orgId,
      );
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
      const res = await getOpenDepositAccountDataAPI(
        "OPERATIONMODE",
        org_id || orgId,
      );
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
      const res = await getOpenDepositAccountDataAPI(
        "MATURITYINSTRUCTION",
        org_id || orgId,
      );
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
      const res = await getOpenDepositAccountDataAPI(
        "PAYOUTMODE",
        org_id || orgId,
      );
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
        form.getValues("Customer_Type"),
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

  const GetGrpInstMemberApiCall = async (orgId, parrId) => {
    setGrpInstMemberLoading(true);
    try {
      const res = await GetGrpInstMemberAPI(orgId, parrId);
      console.log("grpInstMemberLoading res=", res);
      if (res.message === "Data Found") {
        setGrpInstMemberData(res.details);
      } else {
        setGrpInstMemberData([]);
        toast.error(res.details || "No members found");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setGrpInstMemberData([]);
    } finally {
      setGrpInstMemberLoading(false);
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
        form.getValues("Customer_Type"),
      );
      if (res.message === "Data Found") {
        setCheckDepositDurationDisable(false);
        setCheckDepositDurationMessage("");
        if (form.getValues("openingDate")) {
          if (form.getValues("durationUnit") === "1")
            form.setValue(
              "maturityDate",
              addDays(
                form.getValues("openingDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "2")
            form.setValue(
              "maturityDate",
              addMonths(
                form.getValues("openingDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "3")
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
        form.getValues("Customer_Type"),
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
        form.getValues("Customer_Type"),
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

  const getDepositPayoutAmountApiCall = async () => {
    setLoading(true);

    try {
      const res = await getDepositPayoutAmountAPI(
        form.getValues("depositProduct"),
        form.getValues("payoutMode"),
        form.getValues("openingAmount"),
        form.getValues("rateOfInterest"),
        orgId,
        form.getValues("Customer_Type"),
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
    setGetOpenDepositLoading(true);
    try {
      const res = await getMemberDataByIdAPI(orgId, memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setDepositMember(res.details[0]);
        form.setValue("memberNo", res.details[0].Cust_No || "");
        form.setValue("memberId", res.details[0].Member_Id || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Cust_Mob || "");
        form.setValue("Customer_Type", res.details[0].Customer_Type || "");
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        form.setValue("voterId", res.details[0].Cust_Voter || "");
        form.setValue("aadhaarNo", res.details[0].Cust_Aadar || "");
        form.setValue("panNo", res.details[0].Cust_Pan || "");
        form.setValue("memberId", res.details[0].Id || "");
      } else {
        setVisibleBlock(false);
        setDepositMember(null);
        form.setValue("memberNo", "");
        form.setValue("memberId", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("Customer_Type", "");
        form.setValue("branchName", "");
        form.setValue("BranchId", "");
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
      form.setValue("memberId", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("Customer_Type", "");
      form.setValue("branchName", "");
      form.setValue("BranchId", "");
      form.setValue("voterId", "");
      form.setValue("aadhaarNo", "");
      form.setValue("panNo", "");
      form.setValue("memberId", "");
    } finally {
      setGetOpenDepositLoading(false);
    }
  };

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        format(form.getValues("openingDate"), "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue(
          "savingsBalance",
          res.details ? Number(res.details)?.toFixed(2) : "",
        );
      } else {
        toast.error(res.details || res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle in denominators change
  const handleInDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...inDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setInDenominators(newDenominators);
    }
  };
  //handle in denominators change
  const handleOutDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...outDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setOutDenominators(newDenominators);
    }
  };

  //handle cash transaction grand total
  const calculateCashTransactionTotalAmount = (note, denominator) => {
    const parsedNote = parseFloat(note);
    const parsedDenominators = parseFloat(denominator);
    if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
      return parsedNote * parsedDenominators;
    }
    return 0;
  };

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashInTransactionTotal(defaultTotalAmounts);
    setCashOutTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );

    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        outDenominators[index],
      ),
    );

    setCashOutTransactionTotal(newTotalAmounts);
  }, [outDenominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashInTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashInTransactionGrandTotal(newGrandTotal);
  }, [cashInTransactionTotal]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashOutTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashOutTransactionGrandTotal(newGrandTotal);
  }, [cashOutTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(inDenominators[idx]) || 0,
        totalAmount: cashInTransactionTotal[idx],
      };
    });
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(outDenominators[idx]) || 0,
        totalAmount: cashOutTransactionTotal[idx],
      };
    });
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal]);

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
      depositProduct &&
      payoutMode &&
      openingAmount &&
      openingAmount > 0 &&
      rateOfInterest &&
      rateOfInterest > 0
    ) {
      getDepositPayoutAmountApiCall();
    }
  }, [depositProduct, payoutMode, openingAmount, rateOfInterest]);

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
      (Number(accountType) === 2
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
    if (accountType && accountType !== "1") {
      getDepositEcsAccountApiCall(orgId, depositMember?.Id);
    }
  }, [accountType]);

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

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("openingDate");

    if (
      currentSavings &&
      currentDate &&
      (currentSavings !== prevSavings.current ||
        currentDate !== prevDate.current)
    ) {
      getCheckBalanceApiCall();
    }

    prevSavings.current = currentSavings;
    prevDate.current = currentDate;
  }, [savings, openingDate]);

  useEffect(() => {
    if (savings)
      form.setValue(
        "savingsName",
        savingsAccountData?.find(
          (account) => account?.Id?.toString() === savings,
        )?.Full_Name || "",
      );
  }, [savings]);

  useEffect(() => {
    form.setValue("savings", "");
    form.setValue("bank", "");
  }, [transMode]);

  useEffect(() => {
    if (transMode === "savings") {
      if (
        savingsBalance &&
        openingAmount &&
        Number(savingsBalance) > Number(openingAmount)
      )
        setInsufficientBalanceDisable(false);
      else {
        setInsufficientBalanceDisable(true);
      }
    } else {
      setInsufficientBalanceDisable(false);
    }
  }, [transMode, savingsBalance, openingAmount]);

  const checkAllowProcessDepositApiCall = async (
    orgId,
    productId,
    customerType,
  ) => {
    try {
      const res = await CheckAllowProcessDepositAPI(
        orgId,
        productId,
        customerType,
      );
      if (res.message === "Data Found") {
        setAllowProcessDeposit(true);
      } else if (res.message === "Error Found") {
        setAllowProcessDeposit(false);
        toast.error(res.details || "Customer Is Not Allow On This Product!!");
      } else {
        setAllowProcessDeposit(false);
      }
    } catch (error) {
      console.error("Error checking allow process deposit:", error);
      setAllowProcessDeposit(false);
    }
  };

  // Check allow process deposit when depositProduct changes
  useEffect(() => {
    if (depositProduct && customerType) {
      checkAllowProcessDepositApiCall(
        orgId,
        form.getValues("depositProduct"),
        form.getValues("Customer_Type"),
      );
    } else {
      setAllowProcessDeposit(false);
    }
  }, [depositProduct, customerType]);

  return {
    loading,
    getDepositProductLoading,
    getOpenDepositLoading,
    postOpenDepositLoading,
    accountType,
    depositProduct,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    insufficientBalanceDisable,
    allowProcessDeposit,
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
    specialJointDialogOpen,
    deleteJointMemberDialougeOpen,
    grpInstMemberData,
    grpInstMemberLoading,
    GetGrpInstMemberApiCall,
    checkDepositAmountDisable,
    checkDepositAmountMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,

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
    transMode,
    payoutAmount,
    savings,
    savingsBalance,

    setJointMemberDialougeOpen,
    setSpecialJointDialogOpen,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    depositReceiptData,
    handleGenerateDepositReceipt,
  };
};
