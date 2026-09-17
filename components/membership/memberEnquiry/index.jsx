

"use client";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import DepositLedger from "@/common/ledger/depositLedger/DepositLedger";
import LoanLedger from "@/common/ledger/loanLedger/LoanLedger";
import ShareLedger from "@/common/ledger/shareLedger/ShareLedger";
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
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { IoPrint, IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const MemberEnquiry = ({
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
  fromDate,
  toDate,
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
}) => {
  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  );

  const RadioData = [
    { label: "Individual Customer", value: "1" },
    { label: "Group", value: "2" },
    { label: "Institution", value: "3" },
    { label: "Staff", value: "4" },
  ];

  const hasMembership = !!membershipDetails;
  const hasDeposit =
    depositActiveAccount.length > 0 || depositClosedAccount.length > 0;
  const hasLoan = loanActiveAccount.length > 0 || loanClosedAccount.length > 0;

  const defaultTab = hasMembership
    ? "membership"
    : hasDeposit
      ? "deposit"
      : "loan";

  return (
    <div className="w-full h-full flex flex-col lg:flex-row justify-between p-1 bg-[#fefefe] rounded-lg gap-2">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-xl sm:text-2xl font-semibold text-center">
          Member Enquiry
        </h3>

        <ScrollArea className="w-full h-full  flex flex-col">
          <Form {...form}>
            <form
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {/* Search / Date Section */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-3 border border-primary rounded-lg p-3 sm:p-5 py-3">
                <DatePickerField
                  control={form.control}
                  name="fromDate"
                  label="From Date"
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label="To Date"
                  disabled
                />

                <Dialog open={dialougeOpen} onOpenChange={setDialougeOpen}>
                  <FormField
                    control={form.control}
                    name="cifNo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start justify-center sm:col-span-2 xl:col-span-1">
                        <div className="w-full sm:w-[200px]">
                          <FormLabel>CIF No.</FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-x-10 w-full">
                            <div className="w-full h-full flex items-end gap-2">
                              <div className="w-full relative">
                                <Input
                                  placeholder="Enter cif no."
                                  className="w-full"
                                  type="number"
                                  onInput={(e) => {
                                    if (e.target.value.length > 10) {
                                      e.target.value = e.target.value.slice(
                                        0,
                                        10,
                                      );
                                    }
                                  }}
                                  {...field}
                                />
                                <div className="absolute right-0 top-0 py-3 px-3">
                                  <DialogTrigger
                                    asChild
                                    className="cursor-pointer text-lg"
                                  >
                                    <IoSearch />
                                  </DialogTrigger>
                                </div>
                              </div>
                              <Button
                                onClick={form.handleSubmit(handleSubmit)}
                                className="px-4 sm:px-5 shrink-0"
                                disabled={loading}
                              >
                                {loading ? (
                                  <ClipLoader
                                    color="#d7e6f4"
                                    size={20}
                                    speedMultiplier={0.7}
                                  />
                                ) : (
                                  "Next"
                                )}
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
                          <RadioGroupItem value={item.value} id={item.value} />
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
                        <InputField
                          control={form.control}
                          name="dialougeMemberName"
                          label="Member Name"
                          placeholder="Search by enter member name"
                          autoComplete="off"
                          formItemClassName="w-full min-w-0"
                        />
                        <Button
                          type="button"
                          onClick={handleSearchMember}
                          className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
                        >
                          Search
                        </Button>
                      </div>
                      <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                        <MemberSearchTable
                          loading={getMemberListDataLoading}
                          data={memberDataByName}
                          handleSelectData={handleSelectClick}
                          currentMemberPage={currentMemberPage}
                          setCurrentMemberPage={setCurrentMemberPage}
                          lastMemberPage={lastMemberPage}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Personal Details Section */}
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 py-3 gap-2">
                <h3 className="w-full text-center text-lg sm:text-xl font-semibold">
                  Personal Details
                </h3>
                {loading ? (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div className="w-full flex flex-col gap-[10px]" key={i}>
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    ))}
                    <div className="w-full flex flex-col gap-[10px] sm:col-span-2 xl:col-span-1">
                      <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                      <Skeleton className="h-20 w-full rounded-md bg-secondary" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-3">
                    <InputField
                      control={form.control}
                      name="memberNo"
                      label="Member No"
                      placeholder="Enter member no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Enter name"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="gurdian"
                      label="Gurdian"
                      placeholder="Enter gurdian"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="contact"
                      label="Contact No."
                      placeholder="Enter contact no."
                      readOnly
                    />

                    <TextareaField
                      control={form.control}
                      name="address"
                      label="Address"
                      placeholder="Enter address"
                      readOnly
                      className="resize-none"
                    />
                  </div>
                )}
              </div>

              {/* show table section */}
              {(hasMembership || hasDeposit || hasLoan) && (
                <div className="w-full border border-primary rounded-lg p-3 sm:p-5 py-3 flex flex-col gap-3">
                  <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-muted/60 p-1 rounded-lg">
                      {hasMembership && (
                        <TabsTrigger
                          value="membership"
                          className="flex-1 min-w-[100px] text-xs sm:text-sm data-[state=active]:shadow-sm transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                          Membership
                        </TabsTrigger>
                      )}
                      {hasDeposit && (
                        <TabsTrigger
                          value="deposit"
                          className="flex-1 min-w-[100px] text-xs sm:text-sm data-[state=active]:shadow-sm transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                          Deposit
                        </TabsTrigger>
                      )}
                      {hasLoan && (
                        <TabsTrigger
                          value="loan"
                          className="flex-1 min-w-[100px] text-xs sm:text-sm data-[state=active]:shadow-sm transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                          Loan
                        </TabsTrigger>
                      )}
                    </TabsList>

                    {/* Membership Tab */}
                    {hasMembership && (
                      <TabsContent
                        value="membership"
                        className="mt-3 animate-in fade-in-0 slide-in-from-top-1 duration-300"
                      >
                        <ScrollArea className="w-full rounded-md border">
                          <div className="min-w-[500px]">
                            <Table>
                              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                  <TableHead className="whitespace-nowrap">
                                    Serial No.
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Balance
                                  </TableHead>
                                  <TableHead className="text-right whitespace-nowrap">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="hover:bg-muted/40 transition-colors">
                                  <TableCell className="font-medium">
                                    1
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {membershipDetails.Status}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {membershipDetails.Share_Balance}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                      <Button
                                        type="button"
                                        size="icon"
                                        onClick={() =>
                                          handleShowLedger(
                                            "SHARE",
                                            membershipDetails.Full_Name,
                                          )
                                        }
                                        className="rounded-md"
                                      >
                                        <IoPrint />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    )}

                    {/* Deposit Tab */}
                    {hasDeposit && (
                      <TabsContent
                        value="deposit"
                        className="mt-3 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-300"
                      >
                        <div className="w-full flex justify-end">
                          <FormField
                            control={form.control}
                            name="depositType"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[140px] sm:w-[160px]">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {depositActiveAccount.length > 0 && (
                                      <SelectItem value="active">
                                        Active
                                      </SelectItem>
                                    )}
                                    {depositClosedAccount.length > 0 && (
                                      <SelectItem value="closed">
                                        Closed
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <ScrollArea className="w-full rounded-md border">
                          <div className="min-w-[800px]">
                            <Table>
                              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                  <TableHead className="whitespace-nowrap">
                                    Serial No.
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Account No.
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Product Name
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Balance
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Maturity Date
                                  </TableHead>
                                  <TableHead className="text-right whitespace-nowrap">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(depositType === "active"
                                  ? depositActiveAccount
                                  : depositClosedAccount
                                ).map((data, index) => (
                                  <TableRow
                                    key={index}
                                    className="hover:bg-muted/40 transition-colors"
                                  >
                                    <TableCell className="font-medium">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Member_No}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Status}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Prod_Name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Balance}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Maturity_Date &&
                                        format(
                                          data.Maturity_Date,
                                          "dd-MM-yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end">
                                        <Button
                                          type="button"
                                          size="icon"
                                          onClick={() =>
                                            handleShowLedger(
                                              "DEPOSIT",
                                              data.Full_Name,
                                            )
                                          }
                                          className="rounded-md"
                                        >
                                          <IoPrint />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    )}

                    {/* Loan Tab */}
                    {hasLoan && (
                      <TabsContent
                        value="loan"
                        className="mt-3 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-300"
                      >
                        <div className="w-full flex justify-end">
                          <FormField
                            control={form.control}
                            name="loanType"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[140px] sm:w-[160px]">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {loanActiveAccount.length > 0 && (
                                      <SelectItem value="active">
                                        Active
                                      </SelectItem>
                                    )}
                                    {loanClosedAccount.length > 0 && (
                                      <SelectItem value="closed">
                                        Closed
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <ScrollArea className="w-full rounded-md border">
                          <div className="min-w-[850px]">
                            <Table>
                              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                  <TableHead className="whitespace-nowrap">
                                    Serial No.
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Account No.
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Product Name
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Repay Mode
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Balance
                                  </TableHead>
                                  <TableHead className="text-center whitespace-nowrap">
                                    Repay Within
                                  </TableHead>
                                  <TableHead className="text-right whitespace-nowrap">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(loanType === "active"
                                  ? loanActiveAccount
                                  : loanClosedAccount
                                ).map((data, index) => (
                                  <TableRow
                                    key={index}
                                    className="hover:bg-muted/40 transition-colors"
                                  >
                                    <TableCell className="font-medium">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Member_No}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Status}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Prod_Name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Repay_Mode}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Balance}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {data.Maturity_Date &&
                                        format(
                                          data.Maturity_Date,
                                          "dd-MM-yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end">
                                        <Button
                                          type="button"
                                          size="icon"
                                          onClick={() =>
                                            handleShowLedger(
                                              "LOAN",
                                              data.Full_Name,
                                            )
                                          }
                                          className="rounded-md"
                                        >
                                          <IoPrint />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>

      <ShareLedger
        showLedger={showShareLedger}
        setShowLedger={setShowShareLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={shareUserName}
        currentDate={shareCurrentDate}
        currentTime={shareCurrentTime}
        totalRefund={totalRefund}
        totalIssue={totalIssue}
        ledgerHeaderData={shareLedgerHeaderData}
        ledgerTableData={shareLedgerTableData}
        loading={getShareLedgerLoading}
      />

      <DepositLedger
        showLedgerDialog={showLedgerDialog}
        setShowLedgerDialog={setShowLedgerDialog}
        fromDate={fromDate}
        toDate={toDate}
        currentDate={depositCurrentDate}
        currentTime={depositCurrentTime}
        userName={depositUserName}
        totalWithdrawn={totalWithdrawn}
        totalDeposit={totalDeposit}
        totalInterest={totalInterest}
        ledgerHeaderData={depositLedgerHeaderData}
        ledgerTableData={depositLedgerTableData}
        loading={getDepositLedgerLoading}
      />

      <LoanLedger
        showLedger={showLoanLedger}
        setShowLedger={setShowLoanLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={loanUserName}
        currentDate={loanCurrentDate}
        currentTime={loanCurrentTime}
        totalDisburse={totalDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
        ledgerHeaderData={loanLedgerHeaderData}
        ledgerTableData={loanLedgerTableData}
        loading={getLoanLedgerLoading}
      />
    </div>
  );
};
export default MemberEnquiry;
