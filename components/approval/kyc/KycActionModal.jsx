import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import InputField from "@/common/formFields/InputField";
import {
  Edit,
  Save,
  XCircle,
  CheckCircle2,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import KYCDropdownField from "@/common/formFields/KYCDropdownField";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useWatch } from "react-hook-form";
import Spinner from "@/common/loader/Spinner";
import { useTranslation } from "react-i18next";

const KycActionModal = ({
  open,
  setOpen,
  form,
  selectedApplication,
  onUpdate,
  onApproveReject,
  isEditMode,
  setIsEditMode,
  masterDataLists = {},
  fetchMasterDataForEdit,
  fetchLocationDetails,
  loading,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, getValues, reset } = form;

  // Watch values for dependent dropdowns
  const watchedStateId = useWatch({ control, name: "stateId" });
  const watchedDistrictId = useWatch({ control, name: "districtId" });
  const watchedBlockId = useWatch({ control, name: "blockId" });

  const watchedPresentStateId = useWatch({ control, name: "presentStateId" });
  const watchedPresentDistrictId = useWatch({
    control,
    name: "presentDistrictId",
  });
  const watchedPresentBlockId = useWatch({ control, name: "presentBlockId" });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [originalValues, setOriginalValues] = useState({});

  const hasFormChanged = () => {
    const currentValues = getValues();

    // Helper function to compare two values deeply
    const deepCompare = (obj1, obj2) => {
      // Direct reference equality
      if (obj1 === obj2) return true;

      // Treat null, undefined, and empty string as equivalent for form comparison
      const normalize = (val) =>
        val === null || val === undefined ? "" : String(val).trim();

      const normalized1 = normalize(obj1);
      const normalized2 = normalize(obj2);

      // Handle primitive comparison (including string vs number)
      if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return normalized1 === normalized2;
      }

      // Handle null objects
      if (obj1 === null || obj2 === null) return normalized1 === normalized2;

      // Handle dates
      if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
      }

      // Handle objects/arrays
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => deepCompare(obj1[key], obj2[key]));
    };

    // Compare each field and track changes
    const currentKeys = Object.keys(currentValues);
    const originalKeys = Object.keys(originalValues);

    // Check if number of fields changed
    if (currentKeys.length !== originalKeys.length) return true;

    const changedFields = [];

    // Check each field for changes
    for (const key of currentKeys) {
      const currentValue = currentValues[key];
      const originalValue = originalValues[key];

      if (!deepCompare(currentValue, originalValue)) {
        changedFields.push({
          field: key,
          from: originalValue,
          to: currentValue,
        });
      }
    }

    if (changedFields.length > 0) {
      console.log("Changed fields:", changedFields);
      return true;
    }

    return false; // No changes found
  };

  const handleUpdateProfileClick = async () => {
    await fetchMasterDataForEdit();
    await fetchLocationDetails(selectedApplication);
    setOriginalValues(getValues());
    setIsEditMode(true);
  };

  const handleUpdate = (data) => {
    if (!hasFormChanged()) {
      // Debug: Log the values for troubleshooting
      console.log("Original values:", originalValues);
      console.log("Current values:", getValues());
      toast.error(t("kycApproval.noChangesDetected"));
      return;
    }
    onUpdate(data);
    // console.log("Updating profile with data:", data);
  };

  const type = selectedApplication?.Customer_Type?.toString();

  const getFieldsConfig = () => {
    const config = {
      profile: [],
      location: [],
      permanentLocation: [],
      presentLocation: [],
      identity: [],
    };

    if (["2", "3"].includes(type)) {
      config.profile = [
        {
          name: "grp_no",
          label: t("kycApproval.fields.groupNo"),
          fieldType: "text",
          isDisabled: true,
          maxLength: 5,
        },
        {
          name: "cust_type",
          label: t("kycApproval.fields.groupType"),
          fieldType: "dropdown",
          optionsList: masterDataLists.groupTypes,
          labelKey: "Option_Value",
        },
        { name: "grp_name", label: t("kycApproval.fields.groupName") },
        { name: "gerp_dob", label: t("kycApproval.fields.dateOfFormation"), fieldType: "date" },
        { name: "grp_ben", label: t("kycApproval.fields.noOfBeneficiary"), fieldType: "number" },
        {
          name: "grp_mob",
          label: t("kycApproval.fields.mobileNo"),
          fieldType: "number",
          maxLength: 10,
        },
        { name: "grp_add", label: t("kycApproval.fields.address") },
        { name: "grp_doc", label: t("kycApproval.fields.regDocumentNo") },
      ];
      config.location = [
        {
          name: "stateId",
          label: t("kycApproval.fields.state"),
          type: "dropdown",
          optionsList: masterDataLists.states,
          labelKey: "State_Name",
        },
        {
          name: "districtId",
          label: t("kycApproval.fields.district"),
          type: "dropdown",
          optionsList: masterDataLists.districts,
          labelKey: "Dist_Name",
          isDisabled: !watchedStateId,
        },
        {
          name: "blockId",
          label: t("kycApproval.fields.block"),
          type: "dropdown",
          optionsList: masterDataLists.blocks,
          labelKey: "Block_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "policeStationId",
          label: t("kycApproval.fields.policeStation"),
          type: "dropdown",
          optionsList: masterDataLists.policeStations,
          labelKey: "STation_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "postOfficeId",
          label: t("kycApproval.fields.postOffice"),
          type: "dropdown",
          optionsList: masterDataLists.postOffices,
          labelKey: "Post_Off_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "villageId",
          label: t("kycApproval.fields.villageWardNo"),
          type: "dropdown",
          optionsList: masterDataLists.villages,
          labelKey: "Vill_Name",
          isDisabled: !watchedBlockId,
        },
      ];
    } else if (type === "4") {
      config.profile = [
        { name: "inst_name", label: t("kycApproval.fields.institutionName") },
        { name: "inst_dob", label: t("kycApproval.fields.dateOfFormation"), fieldType: "date" },
        { name: "inst_ben", label: t("kycApproval.fields.noOfBeneficiary"), fieldType: "number" },
        {
          name: "inst_mob",
          label: t("kycApproval.fields.mobileNo"),
          fieldType: "number",
          maxLength: 10,
        },
        { name: "inst_add", label: t("kycApproval.fields.address") },
        { name: "inst_doc", label: t("kycApproval.fields.regDocumentNo") },
      ];
      config.location = [
        {
          name: "stateId",
          label: t("kycApproval.fields.state"),
          type: "dropdown",
          optionsList: masterDataLists.states,
          labelKey: "State_Name",
        },
        {
          name: "districtId",
          label: t("kycApproval.fields.district"),
          type: "dropdown",
          optionsList: masterDataLists.districts,
          labelKey: "Dist_Name",
          isDisabled: !watchedStateId,
        },
        {
          name: "blockId",
          label: t("kycApproval.fields.block"),
          type: "dropdown",
          optionsList: masterDataLists.blocks,
          labelKey: "Block_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "policeStationId",
          label: t("kycApproval.fields.policeStation"),
          type: "dropdown",
          optionsList: masterDataLists.policeStations,
          labelKey: "STation_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "postOfficeId",
          label: t("kycApproval.fields.postOffice"),
          type: "dropdown",
          optionsList: masterDataLists.postOffices,
          labelKey: "Post_Off_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "villageId",
          label: t("kycApproval.fields.villageWardNo"),
          type: "dropdown",
          optionsList: masterDataLists.villages,
          labelKey: "Vill_Name",
          isDisabled: !watchedBlockId,
        },
      ];
    } else {
      config.profile = [
        {
          name: "memberNo",
          label: t("kycApproval.fields.memberNo"),
          fieldType: "text",
          maxLength: 5,
        },
        {
          name: "memberType",
          label: t("kycApproval.fields.memberType"),
          fieldType: "dropdown",
          optionsList: masterDataLists.memberTypes,
          labelKey: "Option_Value",
        },
        { name: "firstName", label: t("kycApproval.fields.firstName") },
        { name: "middleName", label: t("kycApproval.fields.middleName") },
        { name: "lastName", label: t("kycApproval.fields.lastName") },
        { name: "relationName", label: t("kycApproval.fields.relationName") },
        {
          name: "relationType",
          label: t("kycApproval.fields.relationType"),
          fieldType: "dropdown",
          optionsList: masterDataLists.relationTypes,
          labelKey: "Option_Value",
        },
        { name: "dob", label: t("kycApproval.fields.dateOfBirth"), fieldType: "date" },
        {
          name: "gender",
          label: t("kycApproval.fields.gender"),
          fieldType: "dropdown",
          optionsList: masterDataLists.genders,
          labelKey: "Option_Value",
        },
        {
          name: "caste",
          label: t("kycApproval.fields.caste"),
          fieldType: "dropdown",
          optionsList: masterDataLists.castes,
          labelKey: "Option_Value",
        },
        {
          name: "religion",
          label: t("kycApproval.fields.religion"),
          fieldType: "dropdown",
          optionsList: masterDataLists.religions,
          labelKey: "Option_Value",
        },
        {
          name: "mobile",
          label: t("kycApproval.fields.mobileNo"),
          fieldType: "number",
          maxLength: 10,
        },
        { name: "email", label: t("kycApproval.fields.email") },
      ];

      config.permanentLocation = [
        { name: "address", label: t("kycApproval.fields.address"), fieldType: "text" },
        {
          name: "stateId",
          label: t("kycApproval.fields.state"),
          type: "dropdown",
          optionsList: masterDataLists.states,
          labelKey: "State_Name",
        },
        {
          name: "districtId",
          label: t("kycApproval.fields.district"),
          type: "dropdown",
          optionsList: masterDataLists.districts,
          labelKey: "Dist_Name",
          isDisabled: !watchedStateId,
        },
        {
          name: "blockId",
          label: t("kycApproval.fields.block"),
          type: "dropdown",
          optionsList: masterDataLists.blocks,
          labelKey: "Block_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "policeStationId",
          label: t("kycApproval.fields.policeStation"),
          type: "dropdown",
          optionsList: masterDataLists.policeStations,
          labelKey: "STation_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "postOfficeId",
          label: t("kycApproval.fields.postOffice"),
          type: "dropdown",
          optionsList: masterDataLists.postOffices,
          labelKey: "Post_Off_Name",
          isDisabled: !watchedDistrictId,
        },
        {
          name: "villageId",
          label: t("kycApproval.fields.villageWardNo"),
          type: "dropdown",
          optionsList: masterDataLists.villages,
          labelKey: "Vill_Name",
          isDisabled: !watchedBlockId,
        },
      ];

      config.presentLocation = [
        { name: "presentAddress", label: t("kycApproval.fields.address"), fieldType: "text" },
        {
          name: "presentStateId",
          label: t("kycApproval.fields.state"),
          type: "dropdown",
          optionsList: masterDataLists.states,
          labelKey: "State_Name",
        },
        {
          name: "presentDistrictId",
          label: t("kycApproval.fields.district"),
          type: "dropdown",
          optionsList: masterDataLists.presentDistricts,
          labelKey: "Dist_Name",
          isDisabled: !watchedPresentStateId,
        },
        {
          name: "presentBlockId",
          label: t("kycApproval.fields.block"),
          type: "dropdown",
          optionsList: masterDataLists.presentBlocks,
          labelKey: "Block_Name",
          isDisabled: !watchedPresentDistrictId,
        },
        {
          name: "presentPoliceStationId",
          label: t("kycApproval.fields.policeStation"),
          type: "dropdown",
          optionsList: masterDataLists.presentPoliceStations,
          labelKey: "STation_Name",
          isDisabled: !watchedPresentDistrictId,
        },
        {
          name: "presentPostOfficeId",
          label: t("kycApproval.fields.postOffice"),
          type: "dropdown",
          optionsList: masterDataLists.presentPostOffices,
          labelKey: "Post_Off_Name",
          isDisabled: !watchedPresentDistrictId,
        },
        {
          name: "presentVillageId",
          label: t("kycApproval.fields.villageWardNo"),
          type: "dropdown",
          optionsList: masterDataLists.presentVillages,
          labelKey: "Vill_Name",
          isDisabled: !watchedPresentBlockId,
        },
      ];

      config.identity = [
        {
          name: "aadhaarNo",
          label: t("kycApproval.fields.aadhaarNo"),
          fieldType: "number",
          maxLength: 12,
        },
        { name: "voterId", label: t("kycApproval.fields.voterId"), uppercase: true },
        { name: "rationNo", label: t("kycApproval.fields.rationCard"), uppercase: true },
        { name: "panNo", label: t("kycApproval.fields.panCard"), uppercase: true },
      ];
    }

    return config;
  };

  const fieldsConfig = getFieldsConfig();

  const getMappedName = (value, optionsList, labelKey) => {
    if (
      !optionsList ||
      !Array.isArray(optionsList) ||
      value === null ||
      value === undefined
    ) {
      return value || t("common.notAvailable");
    }

    const found = optionsList.find((opt) => String(opt.Id) === String(value));

    if (found) {
      if (labelKey && found[labelKey]) return found[labelKey];
      return found.Option_Value || found.label || value;
    }
    return value;
  };

  const renderSmartField = ({
    name,
    label,
    fieldType = "text",
    optionsList = null,
    labelKey = "Option_Value",
    isDisabled = false,
    maxLength = null,
    uppercase = false,
  }) => {
    // VIEW MODE
    if (!isEditMode) {
      const rawValue = getValues(name);
      let displayValue = rawValue;

      if (optionsList && optionsList.length > 0) {
        displayValue = getMappedName(rawValue, optionsList, labelKey);
      } else if (fieldType === "date" && rawValue) {
        try {
          const dateVal = new Date(rawValue);
          if (!isNaN(dateVal.getTime())) {
            displayValue = dateVal
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-");
          } else {
            displayValue = rawValue;
          }
        } catch (e) {
          displayValue = rawValue;
        }
      }

      return (
        <div className="flex flex-col gap-1.5 min-w-0" key={name}>
          <Label className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 min-h-10 flex items-center break-words font-medium">
            {displayValue !== null &&
            displayValue !== undefined &&
            displayValue !== ""
              ? displayValue
              : t("common.notAvailable")}
          </div>
        </div>
      );
    }

    // EDIT MODE
    if (fieldType === "dropdown" || optionsList) {
      return (
        <FormField
          key={name}
          control={control}
          name={name}
          render={({ field }) => (
            <KYCDropdownField
              label={label}
              value={field.value}
              onChange={field.onChange}
              options={optionsList}
              optionLabelKey={labelKey}
              disabled={isDisabled}
            />
          )}
        />
      );
    }

    if (fieldType === "date") {
      return (
        <DatePickerField
          key={name}
          control={control}
          name={name}
          label={label}
          endYear={new Date().getFullYear()}
        />
      );
    }

    // Text/Number Input Logic
    return (
      <InputField
        key={name}
        control={control}
        name={name}
        label={label}
        type={fieldType === "number" ? "number" : "text"}
        placeholder={t("kycApproval.enterField", { field: label })}
        disabled={isDisabled}
        maxLength={maxLength}
        isUpper={uppercase}
      />
    );
  };

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error(t("kycApproval.pleaseEnterRejectionRemarks"));
      return;
    }
    onApproveReject(2, rejectRemarks);
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setIsEditMode(false);
            setRejectRemarks("");
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[90vw] lg:max-w-7xl h-[min(96dvh,100%)] max-h-[96dvh] sm:h-[90vh] sm:max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-lg">
          <DialogHeader className="shrink-0 border-b bg-white space-y-0 text-left p-0">
            <div className="flex flex-col gap-2.5 w-full min-w-0 p-3 pr-10 sm:p-4 sm:pr-12 lg:p-5 lg:pr-14">
              <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                {t("kycApproval.kycApproval")}
              </DialogTitle>

              <div className="flex flex-col gap-2 min-w-0 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs sm:text-sm text-gray-500 leading-snug break-all">
                    <span className="text-gray-400">{t("kycApproval.appNo")}</span>{" "}
                    <span className="font-medium text-gray-700">
                      {selectedApplication?.Appl_No ||
                        selectedApplication?.Application_No ||
                        "—"}
                    </span>
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-primary leading-snug break-words">
                    {selectedApplication?.Full_Name ||
                      selectedApplication?.Customer_Name ||
                      "—"}
                  </p>
                </div>

                <div className="w-full lg:w-auto lg:shrink-0">
                  {!isEditMode ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white transition-all h-9 w-full lg:w-auto px-3"
                      onClick={handleUpdateProfileClick}
                      disabled={loading}
                    >
                      <Edit className="w-4 h-4 mr-2 shrink-0" />
                      {t("kycApproval.updateProfile")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-400 text-red-500 hover:bg-red-50 h-9 w-full lg:w-auto px-3"
                      onClick={() => {
                        reset();
                        setIsEditMode(false);
                      }}
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4 mr-2 shrink-0" />
                      {t("kycApproval.cancelEdit")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 bg-gray-50/50">
            {loading ? (
              <div className="flex justify-center items-center min-h-[240px] sm:h-96 w-full">
                <Spinner />
              </div>
            ) : (
              <Form {...form}>
                <form
                  id="kyc-profile-form"
                  onSubmit={handleSubmit(handleUpdate)}
                  className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6"
                  autoComplete="off"
                >
                  <div
                    className={cn(
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5 p-3 sm:p-5 lg:p-7 rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300",
                      isEditMode &&
                        "ring-1 ring-primary/20 border-primary/30 shadow-md",
                    )}
                  >
                    {fieldsConfig.profile.map((field) =>
                      renderSmartField(field),
                    )}

                    {fieldsConfig.location &&
                      fieldsConfig.location.length > 0 && (
                        <>
                          <div className="col-span-full border-t border-gray-100 my-1 sm:my-2 pt-3 sm:pt-4">
                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.locationDetails")}
                            </h4>
                          </div>
                          {fieldsConfig.location.map((field) =>
                            renderSmartField(field),
                          )}
                        </>
                      )}

                    {fieldsConfig.permanentLocation &&
                      fieldsConfig.permanentLocation.length > 0 && (
                        <>
                          <div className="col-span-full border-t border-gray-100 my-1 sm:my-2 pt-3 sm:pt-4">
                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.permanentAddress")}
                            </h4>
                          </div>
                          {fieldsConfig.permanentLocation.map((field) =>
                            renderSmartField(field),
                          )}
                        </>
                      )}

                    {fieldsConfig.presentLocation &&
                      fieldsConfig.presentLocation.length > 0 && (
                        <>
                          <div className="col-span-full border-t border-gray-100 my-1 sm:my-2 pt-3 sm:pt-4">
                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.presentAddress")}
                            </h4>
                          </div>
                          {fieldsConfig.presentLocation.map((field) =>
                            renderSmartField(field),
                          )}
                        </>
                      )}

                    {fieldsConfig.identity.length > 0 && (
                      <>
                        <div className="col-span-full border-t border-gray-100 my-1 sm:my-2 pt-3 sm:pt-4">
                          <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                            {t("kycApproval.identityDocuments")}
                          </h4>
                        </div>
                        {fieldsConfig.identity.map((field) =>
                          renderSmartField(field),
                        )}
                      </>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-4 lg:p-6 border-t bg-white flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            {isEditMode ? (
              <Button
                type="submit"
                form="kyc-profile-form"
                className="bg-primary hover:bg-primary/90 px-4 sm:px-6 font-semibold w-full sm:w-auto"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.saveAndUpdate")}
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-4 sm:px-8 font-bold min-w-0 sm:min-w-[120px] transition-all flex-1 sm:flex-none sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={isEditMode || loading}
              >
                <Ban className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.reject")}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-8 font-bold min-w-0 sm:min-w-[120px] transition-all flex-1 sm:flex-none sm:w-auto"
                onClick={() => onApproveReject(1)}
                disabled={isEditMode || loading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.approve")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-[500px] z-[9999] p-4 sm:p-6">
          <DialogHeader className="text-left pr-8">
            <DialogTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {t("kycApproval.rejectApplication")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 sm:py-4">
            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("kycApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder={t("kycApproval.enterRejectionReason")}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="min-h-[100px] focus-visible:ring-red-500"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowRejectModal(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              onClick={handleRejectConfirm}
            >
              {t("kycApproval.confirmRejection")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KycActionModal;
