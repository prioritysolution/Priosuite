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
        <h3 className="text-2xl font-semibold ">Open Deposit Account</h3>

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
                      Basic Info Block
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowBasicInfo(!showBasicInfo)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {showBasicInfo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  {showBasicInfo && (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label="Member No."
                        placeholder="Enter member no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label="CIF No."
                        placeholder="Enter cif no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label="Member Name"
                        placeholder="Enter member name"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label="Gurdian Name"
                        placeholder="Enter gurdian name"
                        readOnly
                      />
                      <TextareaField
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="Enter address"
                        className="resize-none"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="mobile"
                        label="Mobile No."
                        placeholder="Enter mobile no."
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    KYC Details Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="voterId"
                      label="Voter ID"
                      placeholder="Enter voter id"
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="aadhaarNo"
                      label="Aadhaar No."
                      placeholder="Enter aadhaar no."
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="panNo"
                      label="Pan No."
                      placeholder="Enter pan no."
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Account Info Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DropdownField
                      control={form.control}
                      name="accountType"
                      label="Account Type"
                      options={accountTypeData}
                      optionLabelKey="Option_Value"
                      placeholder="Select account type"
                      searchPlaceholder="Search account type..."
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="depositProduct"
                      label="Deposit Product"
                      options={productData}
                      optionLabelKey="Prd_SH_Name"
                      disabled={!form.getValues("accountType")}
                      loading={getDepositProductLoading}
                      isRequired
                    />

                    <DatePickerField
                      control={form.control}
                      name="openingDate"
                      label="Opening Date"
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
                      label="Manual Account No."
                      placeholder="Enter account no."
                      maxLength={4}
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label="Ledger Folio"
                      placeholder="Enter ledger folio"
                    />

                    <div className="w-full flex flex-col gap-1.5">
                      <InputField
                        control={form.control}
                        name="openingAmount"
                        label="Installment / Deposit Amount"
                        placeholder="Enter installment / deposit amount"
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
                            label="Duration Unit"
                            options={durationTypeData}
                            optionLabelKey="Option_Value"
                            placeholder="Select duration unit"
                            searchPlaceholder="Search duration unit..."
                            disabled={checkDepositAmountDisable}
                          />

                          <div className="w-full flex flex-col gap-1.5">
                            <InputField
                              control={form.control}
                              name="duration"
                              label="Duration"
                              placeholder="Enter duration"
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
                            label="Rate Of Interest"
                            placeholder="Enter rate of interest"
                            readOnly
                          />

                          <DatePickerField
                            control={form.control}
                            name="maturityDate"
                            label="Maturity Date"
                            disabled
                          />

                          <InputField
                            control={form.control}
                            name="maturityAmount"
                            label="Maturity Amount"
                            placeholder="Enter maturity amount"
                            readOnly
                          />
                          <DropdownField
                            control={form.control}
                            name="maturityInstruction"
                            label="Maturity Instruction"
                            options={maturityInstructionData}
                            optionLabelKey="Option_Value"
                            placeholder="Select maturity instruction"
                            searchPlaceholder="Search maturity instruction..."
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
                                        Is Avail ECS
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
                                label="ECS Account"
                                options={ecsAccontData}
                                optionLabelKey="Account_No"
                                placeholder="Select ecs account"
                                searchPlaceholder="Search ecs account..."
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
                                        Is Payout Interest
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
                                label="Payout Mode"
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
                                placeholder="Select payout mode"
                                searchPlaceholder="Search payout mode..."
                                disabled={!form.getValues("isPayoutInterest")}
                                isRequired={form.getValues("isPayoutInterest")}
                              />
                              <InputField
                                control={form.control}
                                name="payoutAmount"
                                label="Payout Amount"
                                placeholder="Enter payout amount"
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
                      label="Agent"
                      options={agentData}
                      optionLabelKey="Agent_Name"
                      placeholder="Select agent"
                      searchPlaceholder="Search agent..."
                    />

                    <DropdownField
                      control={form.control}
                      name="operationMode"
                      label="Operation Mode"
                      options={operationModeData}
                      optionLabelKey="Option_Value"
                      placeholder="Select operation mode"
                      searchPlaceholder="Search operation mode..."
                      isRequired
                    />

                    {form.getValues("jointHolderDetails").length > 0 &&
                      form.getValues("jointHolderDetails").map((item, id) => (
                        <div key={id} className="self-end">
                          <FormLabel>Joint Member {id + 1}</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3  w-full">
                              <Input
                                placeholder={`Enter joint member ${id + 1}`}
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
                                      Are you sure to delete this member ?
                                    </p>

                                    <Button
                                      variant="destructive"
                                      className="w-full"
                                      onClick={() =>
                                        handleJointAccountDelete(item.Id)
                                      }
                                    >
                                      Delete
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
                                Add Joint Member Details
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
                              <DialogTitle>Search Members</DialogTitle>
                            </DialogHeader>
                            <div className="w-full">
                              <div className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 ">
                                <InputField
                                  control={form.control}
                                  name="dialougeMemberName"
                                  label="Member Name"
                                  placeholder="Search by enter member name"
                                />

                                <Button
                                  className="w-full sm:w-auto px-10"
                                  onClick={handleSearchMember}
                                >
                                  Search
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
                    Nominee Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="nomineeName"
                      label="Nominee Name"
                      placeholder="Enter nominee name"
                    />

                    <DropdownField
                      control={form.control}
                      name="nomineeRelation"
                      label="Nominee Relation"
                      options={relationTypeData}
                      optionLabelKey="Option_Value"
                      placeholder="Select relation"
                      searchPlaceholder="Search relation..."
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAddress"
                      label="Nominee Address"
                      placeholder="Enter nominee address"
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAge"
                      label="Nominee Age"
                      placeholder="Enter nominee age"
                      type="number"
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Opening Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="openingBalance"
                      label="Opening Balance"
                      placeholder="Enter opening balance"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="openingInterest"
                      label="Opening Interest"
                      placeholder="Enter opening interest"
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
                    "Add"
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
