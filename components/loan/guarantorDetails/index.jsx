"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import GuarantorDetailsPreview from "./GuarantorDetailsPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IoSearch } from "react-icons/io5";
import MemberSearchTable from "@/common/tables/MemberSearchTable";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GuarantorDetails = ({
  loading,
  getMemberListDataLoading,
  form,
  handleSubmit,
  personalData,
  ownTableData,
  guarantorTableData,
  date,
  dialougeOpen,
  setDialougeOpen,
  handleSearchMember,
  handleSelectClick,
  currentMemberPage,
  setCurrentMemberPage,
  lastMemberPage,
  totalOwnIssueAmount,
  totalOwnCurrentBalance,
  totalOwnCurrentInterest,
  totalOwnOdBalance,
  totalOwnOdInterest,
  totalGuarantorIssueAmount,
  totalGuarantorCurrentBalance,
  totalGuarantorCurrentInterest,
  totalGuarantorOdBalance,
  totalGuarantorOdInterest,
}) => {
  const [showForm, setShowForm] = useState(true);

  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  );

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `GuarantorDetails-${date ? format(date, "dd-MM-yyyy") : ""}`,
  });

  const maxLoanAccount = ownTableData.reduce((max, item) => {
    const currentLoan = parseFloat(item?.Loan_Amount || 0);
    const maxLoan = parseFloat(max?.Loan_Amount || 0);
    return currentLoan > maxLoan ? item : max;
  }, null);

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden px-2 sm:px-10 2xl:px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5  bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">Guarantor Details</h3>
                <div
                  onClick={() => setShowForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 px-5",
                  showForm
                    ? "max-h-[1000px] py-5"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="date"
                  label="Date"
                  startYear={2000}
                  endYear={2050}
                />

                <Dialog open={dialougeOpen} onOpenChange={setDialougeOpen}>
                  <FormField
                    control={form.control}
                    name="memberNo"
                    render={({ field }) => (
                      <FormItem className=" flex flex-col items-start justify-center">
                        <FormLabel>Member No.</FormLabel>
                        <FormControl>
                          <div className="flex flex-col lg:flex-row items-center gap-x-10 gap-2 w-full">
                            <div className=" w-full relative ">
                              <Input
                                placeholder="Enter member no."
                                className="w-full"
                                type="number"
                                onInput={(e) => {
                                  if (e.target.value.length > 5) {
                                    e.target.value = e.target.value.slice(0, 5);
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
                            <FormMessage />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px] max-h-[min(90dvh,600px)] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Search Members</DialogTitle>
                    </DialogHeader>
                    <div className="w-full ">
                      <div className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 ">
                        <InputField
                          control={form.control}
                          name="dialougeMemberName"
                          label="Member Name"
                          placeholder="Search by enter member name"
                          autoComplete="off"
                        />
                        <div
                          className="w-full sm:w-auto px-10 py-2 text-white bg-primary rounded-md cursor-pointer text-center"
                          onClick={handleSearchMember}
                        >
                          Search
                        </div>
                      </div>
                      <div className="w-full ">
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

                <div className="w-full flex items-center gap-5 self-end">
                  <Button className="w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center">
                    {loading ? (
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
                    onClick={() => {
                      if (
                        ownTableData?.length > 0 ||
                        guarantorTableData?.length > 0
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ownTableData?.length > 0 ||
                          guarantorTableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
        {personalData ||
        ownTableData.length > 0 ||
        guarantorTableData.length > 0 ? (
          <div className="w-full border border-primary overflow-hidden rounded-lg px-5">
            <div className="w-full h-full flex flex-col overflow-x-scroll">
              <div className=" w-full border border-black border-dashed my-1 px-2 py-1 text-xs text-start bg-blue-100">
                <div className="flex justify-between items-start mb-2 w-full h-fit">
                  <div className="w-full"></div>
                  <div className="w-full flex gap-1 items-start justify-start">
                    <p className="font-semibold text-nowrap">Max Loan : </p>
                    <p>{personalData?.Max_Loan || ""}</p>
                  </div>
                </div>
                <div className="flex justify-between gap-1">
                  <div className="h-full grid grid-cols-2 gap-1 gap-y-2">
                    <p className="font-semibold text-nowrap">
                      Customer Code :{" "}
                    </p>
                    <p>{personalData?.CIf_No || ""}</p>
                    <p className="font-semibold text-nowrap">
                      Customer Name :{" "}
                    </p>
                    <p>{personalData?.Member_Name || ""}</p>
                    <p className="font-semibold text-nowrap">
                      Guardian Name :{" "}
                    </p>
                    <p>{personalData?.Gurdain_Name || ""}</p>
                    <p className="font-semibold text-nowrap">Member No : </p>
                    <p>{personalData?.Member_No || ""}</p>
                    <p className="font-semibold text-nowrap">
                      Admission Date :{" "}
                    </p>
                    <p>
                      {personalData?.Admission_Date
                        ? format(personalData?.Admission_Date, "dd-MM-yyyy")
                        : ""}
                    </p>
                  </div>
                  <div className="h-full grid grid-cols-2 gap-1  gap-y-2">
                    <p className="font-semibold text-nowrap">
                      Share Balance :{" "}
                    </p>
                    <p>{personalData?.Share_Balance || ""}</p>
                    <p className="font-semibold text-nowrap">TF Paid : </p>
                    <p>
                      {" "}
                      {personalData?.Tf_Paid
                        ? format(personalData?.Tf_Paid, "dd-MM-yyyy")
                        : ""}
                    </p>
                    <p className="font-semibold text-nowrap">
                      GF Account No. :{" "}
                    </p>
                    <p>{personalData?.Gf_Acct_No || ""}</p>
                    <p className="font-semibold text-nowrap">GF Balance : </p>
                    <p>{personalData?.gf_Balance || ""}</p>
                    <p className="font-semibold text-nowrap">
                      Savings Account No. :{" "}
                    </p>
                    <p>{personalData?.Sb_Acct_No || ""}</p>
                  </div>
                  <div className="h-full grid grid-cols-2 gap-1  gap-y-2">
                    <p className="font-semibold text-nowrap">Account No. : </p>
                    <p>{maxLoanAccount?.Account_No || ""}</p>
                    <p className="font-semibold text-nowrap">Scheme Name : </p>
                    <p>{maxLoanAccount?.Product_Name || ""}</p>
                    <p className="font-semibold text-nowrap">Issue Date : </p>
                    <p>
                      {maxLoanAccount?.Issue_Date
                        ? format(maxLoanAccount?.Issue_Date, "dd-MM-yyyy")
                        : "30-03-2022"}
                    </p>
                    <p className="font-semibold text-nowrap">Issue Amount : </p>
                    <p>{maxLoanAccount?.Loan_Amount || ""}</p>
                    <p className="font-semibold text-nowrap">Outs. Bal. : </p>
                    <p>{maxLoanAccount?.Outs_Bal || ""}</p>
                  </div>
                  <div className="h-full grid grid-cols-2 gap-1  gap-y-2">
                    <p className="font-semibold text-nowrap">CP Bal : </p>
                    <p>{maxLoanAccount?.Curr_Balance || ""}</p>
                    <p className="font-semibold text-nowrap">CI Bal : </p>
                    <p>{maxLoanAccount?.Curr_Intt || ""}</p>
                    <p className="font-semibold text-nowrap">OP Bal : </p>
                    <p>{maxLoanAccount?.Od_Balance || ""}</p>
                    <p className="font-semibold text-nowrap">OI Bal : </p>
                    <p>{maxLoanAccount?.Od_Intt || "0"}</p>
                  </div>
                </div>
              </div>
              <Table className="w-full border-collapse border  overflow-hidden">
                {/* Main Header Every Page */}
                <TableHeader>
                  <TableRow>
                    <TableHead>ACCOUNT NO.</TableHead>
                    <TableHead>SCHEME NAME</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>MEMBER NO.</TableHead>
                    <TableHead>ISSUE DATE</TableHead>
                    <TableHead>ISSUE AMOUNT</TableHead>
                    <TableHead>OUTSTANDING BALANCE</TableHead>
                    <TableHead>CP BAL</TableHead>
                    <TableHead>CI BAL</TableHead>
                    <TableHead>OP BAL</TableHead>
                    <TableHead>OI BAL</TableHead>
                    <TableHead>INST. DUE</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12}>Loan Type - Guarantor</TableCell>
                  </TableRow>
                  {guarantorTableData.map((guarantor, i) => (
                    <TableRow
                      key={`guarantor-${i}`}
                      className={cn("", {
                        "text-red-500": Number(guarantor?.Due_Inst || "0") > 0,
                      })}
                    >
                      <TableCell>{guarantor?.Account_No || ""}</TableCell>
                      <TableCell>{guarantor?.Product_Name || ""}</TableCell>
                      <TableCell>{guarantor?.Member_Name || ""}</TableCell>
                      <TableCell>{guarantor?.Member_No || ""}</TableCell>
                      <TableCell>
                        {guarantor?.Issue_Date
                          ? format(guarantor?.Issue_Date, "dd-MM-yyyy")
                          : ""}
                      </TableCell>
                      <TableCell>{guarantor?.Loan_Amount || ""}</TableCell>
                      <TableCell>{guarantor?.Outs_Bal || ""}</TableCell>
                      <TableCell>{guarantor?.Curr_Balance || ""}</TableCell>
                      <TableCell>{guarantor?.Curr_Intt || ""}</TableCell>
                      <TableCell>{guarantor?.Od_Balance || ""}</TableCell>
                      <TableCell>{guarantor?.Od_Intt || ""}</TableCell>
                      <TableCell>{guarantor?.Due_Inst || ""}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right">
                      Total
                    </TableCell>
                    <TableCell>{totalGuarantorIssueAmount || ""}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{totalGuarantorCurrentBalance || ""}</TableCell>
                    <TableCell>{totalGuarantorCurrentInterest || ""}</TableCell>
                    <TableCell>{totalGuarantorOdBalance || ""}</TableCell>
                    <TableCell>{totalGuarantorOdInterest || ""}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={12}>Loan Type - Own</TableCell>
                  </TableRow>
                  {ownTableData.map((own, i) => (
                    <TableRow
                      key={`own-${i}`}
                      className={cn("", {
                        "text-red-500": Number(own?.Due_Inst || "0") > 0,
                      })}
                    >
                      <TableCell>{own?.Account_No || ""}</TableCell>
                      <TableCell>{own?.Product_Name || ""}</TableCell>
                      <TableCell>{own?.Member_Name || ""}</TableCell>
                      <TableCell>{own?.Member_No || ""}</TableCell>
                      <TableCell>
                        {own?.Issue_Date
                          ? format(own?.Issue_Date, "dd-MM-yyyy")
                          : ""}
                      </TableCell>
                      <TableCell>{own?.Loan_Amount || ""}</TableCell>
                      <TableCell>{own?.Outs_Bal || ""}</TableCell>
                      <TableCell>{own?.Curr_Balance || ""}</TableCell>
                      <TableCell>{own?.Curr_Intt || ""}</TableCell>
                      <TableCell>{own?.Od_Balance || ""}</TableCell>
                      <TableCell>{own?.Od_Intt || ""}</TableCell>
                      <TableCell>{own?.Due_Inst || ""}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right">
                      Total
                    </TableCell>
                    <TableCell>{totalOwnIssueAmount || ""}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{totalOwnCurrentBalance || ""}</TableCell>
                    <TableCell>{totalOwnCurrentInterest || ""}</TableCell>
                    <TableCell>{totalOwnOdBalance || ""}</TableCell>
                    <TableCell>{totalOwnOdInterest || ""}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} className="text-right">
                      Total Outstanding
                    </TableCell>
                    <TableCell>
                      {totalOwnIssueAmount + totalGuarantorIssueAmount || ""}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {totalOwnCurrentBalance + totalGuarantorCurrentBalance ||
                        ""}
                    </TableCell>
                    <TableCell>
                      {totalOwnCurrentInterest +
                        totalGuarantorCurrentInterest || ""}
                    </TableCell>
                    <TableCell>
                      {totalOwnOdBalance + totalGuarantorOdBalance || ""}
                    </TableCell>
                    <TableCell>
                      {totalOwnOdInterest + totalGuarantorOdInterest || ""}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden">
        <GuarantorDetailsPreview
          printRef={printRef}
          date={date}
          personalData={personalData}
          ownTableData={ownTableData}
          guarantorTableData={guarantorTableData}
          maxLoanAccount={maxLoanAccount}
          totalOwnIssueAmount={totalOwnIssueAmount}
          totalOwnCurrentBalance={totalOwnCurrentBalance}
          totalOwnCurrentInterest={totalOwnCurrentInterest}
          totalOwnOdBalance={totalOwnOdBalance}
          totalOwnOdInterest={totalOwnOdInterest}
          totalGuarantorIssueAmount={totalGuarantorIssueAmount}
          totalGuarantorCurrentBalance={totalGuarantorCurrentBalance}
          totalGuarantorCurrentInterest={totalGuarantorCurrentInterest}
          totalGuarantorOdBalance={totalGuarantorOdBalance}
          totalGuarantorOdInterest={totalGuarantorOdInterest}
        />
      </div>
    </div>
  );
};
export default GuarantorDetails;
