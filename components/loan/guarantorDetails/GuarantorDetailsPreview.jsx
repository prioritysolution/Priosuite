import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const PAGE_ROWS = 11;

const GuarantorDetailsPreview = ({
  printRef,
  date,
  personalData,
  ownTableData,
  guarantorTableData,
  maxLoanAccount,
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
  const [userName, setUserName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(getCookieData("userName"));
      setOrgName(getCookieData("userOrgName"));
      setBranchName(getCookieData("userBranchName"));
      setAddress(getCookieData("userOrgAddress"));
      setRegNo(getCookieData("userOrgRegistration"));
    }
  }, []);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    setCurrentDate(`${day}-${month}-${year}`);
    setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
  }, []);

  // const pages = chunkPagesWithFooterLogic(guarantorTableData);

  const paginateDataWithFooter = (guarantorTableData, ownTableData) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;

    const allRows = [];

    allRows.push({ type: "heading", headName: "Loan Type - Guaranter" });

    guarantorTableData.map((guarantor) => {
      allRows.push({ type: "loanData", data: guarantor });
    });

    allRows.push({
      type: "total",
      data: {
        totalIssueAmount: totalGuarantorIssueAmount,
        totalCurrentBalance: totalGuarantorCurrentBalance,
        totalCurrentInterest: totalGuarantorCurrentInterest,
        totalOdBalance: totalGuarantorOdBalance,
        totalOdInterest: totalGuarantorOdInterest,
      },
    });

    allRows.push({ type: "heading", headName: "Loan Type - Own" });

    ownTableData.map((own) => {
      allRows.push({ type: "loanData", data: own });
    });
    allRows.push({
      type: "total",
      data: {
        totalIssueAmount: totalOwnIssueAmount,
        totalCurrentBalance: totalOwnCurrentBalance,
        totalCurrentInterest: totalOwnCurrentInterest,
        totalOdBalance: totalOwnOdBalance,
        totalOdInterest: totalOwnOdInterest,
      },
    });

    allRows.push({
      type: "grandTotal",
      data: {
        grandTotalIssueAmount: totalOwnIssueAmount + totalGuarantorIssueAmount,
        grandTotalCurrentBalance:
          totalOwnCurrentBalance + totalGuarantorCurrentBalance,
        grandTotalCurrentInterest:
          totalOwnCurrentInterest + totalGuarantorCurrentInterest,
        grandTotalOdBalance: totalOwnOdBalance + totalGuarantorOdBalance,
        grandTotalOdInterest: totalOwnOdInterest + totalGuarantorOdInterest,
      },
    });

    // Iterate through allRows and distribute across pages
    allRows.forEach((row) => {
      if (currentRowCount >= PAGE_ROWS) {
        pages.push(currentPage);
        currentPage = [];
        currentRowCount = 0;
      }

      currentPage.push(row);
      currentRowCount++;
    });

    pages.push(currentPage); // Final push for the last page

    return pages;
  };

  const pages = paginateDataWithFooter(guarantorTableData, ownTableData);

  return (
    <div className="w-[297mm]" ref={printRef}>
      {pages.map((pageData, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full h-[210mm] text-center py-2 px-1 flex flex-col justify-between scale-[.97]"
        >
          {/* Org Header Only on First Page */}
          <div className="text-xs flex flex-col gap-1 uppercase mb-1 relative">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              Guarantor Details As On {date && format(date, "dd-MM-yyyy")}
            </p>
            <p className="text-sm absolute right-5 bottom-2">
              Page - {pageIndex + 1} of {pages.length}
            </p>
          </div>

          <div className="h-[140px] w-full border border-black my-1 px-2 py-1 grid grid-cols-4 gap-1 text-xs text-start">
            <div className="col-span-4 flex justify-around items-start w-full h-fit">
              <div className="w-full"></div>
              <div className="w-full flex gap-1 items-start justify-start">
                <p className="font-semibold text-nowrap">Max Loan : </p>
                <p>{personalData?.Max_Loan || ""}</p>
              </div>
            </div>
            <div className="h-full grid grid-cols-2 gap-1">
              <p className="font-semibold text-nowrap">Customer Code : </p>
              <p>{personalData?.CIf_No || ""}</p>
              <p className="font-semibold text-nowrap">Customer Name : </p>
              <p>{personalData?.Member_Name || ""}</p>
              <p className="font-semibold text-nowrap">Guardian Name : </p>
              <p>{personalData?.Gurdain_Name || ""}</p>
              <p className="font-semibold text-nowrap">Member No : </p>
              <p>{personalData?.Member_No || ""}</p>
              <p className="font-semibold text-nowrap">Admission Date : </p>
              <p>
                {personalData?.Admission_Date
                  ? format(personalData?.Admission_Date, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="h-full grid grid-cols-2 gap-1">
              <p className="font-semibold text-nowrap">Share Balance : </p>
              <p>{personalData?.Share_Balance || ""}</p>
              <p className="font-semibold text-nowrap">TF Paid : </p>
              <p>
                {personalData?.Tf_Paid
                  ? format(personalData?.Tf_Paid, "dd-MM-yyyy")
                  : ""}
              </p>
              <p className="font-semibold text-nowrap">GF Account No. : </p>
              <p>{personalData?.Gf_Acct_No || ""}</p>
              <p className="font-semibold text-nowrap">GF Balance : </p>
              <p>{personalData?.gf_Balance || ""}</p>
              <p className="font-semibold text-nowrap">
                Savings Account No. :{" "}
              </p>
              <p>{personalData?.Sb_Acct_No || ""}</p>
            </div>
            <div className="h-full grid grid-cols-2 gap-1">
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
            <div className="h-full grid grid-cols-2 gap-1">
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

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[40px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[60px]">
                    ACCOUNT NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    SCHEME
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[150px]">
                    NAME
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[60px]">
                    MEMBER NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    ISSUE DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    ISSUE AMOUNT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    OUTS. BAL.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    CP BAL.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    CI BAL.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    OP BAL.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    OI BAL.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[40px]">
                    INST. DUE
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageData.map((row, index) => {
                  switch (row.type) {
                    case "heading":
                      return (
                        <TableRow
                          key={`heading-${index}`}
                          className="h-[40px] w-full border border-black"
                        >
                          <TableCell
                            colSpan={12}
                            className="font-semibold text-sm border p-0 border-black w-full pl-5 text-start "
                          >
                            {row.headName}
                          </TableCell>
                        </TableRow>
                      );
                    case "loanData":
                      return (
                        <Fragment key={`loanData-${index}`}>
                          <TableRow
                            className={cn("h-[40px] border border-black", {
                              "font-semibold":
                                Number(row.data?.Due_Inst || "0") > 0,
                            })}
                          >
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Account_No || ""}
                            </TableCell>
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Product_Name || ""}
                            </TableCell>
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Member_Name || ""}
                            </TableCell>
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Member_No || ""}
                            </TableCell>
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Issue_Date
                                ? format(row.data?.Issue_Date, "dd-MM-yyyy")
                                : ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Loan_Amount || ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Outs_Bal || ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Curr_Balance || ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Curr_Intt || ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Od_Balance || ""}
                            </TableCell>
                            <TableCell className="p-0 pr-[2px] border border-black text-right">
                              {row.data?.Od_Intt || ""}
                            </TableCell>
                            <TableCell className="p-0 border border-black text-center">
                              {row.data?.Due_Inst !== null
                                ? row.data?.Due_Inst
                                : ""}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    case "total":
                      return (
                        <TableRow className="h-[40px] border border-black">
                          <TableCell
                            colSpan={5}
                            className="border border-black p-0 pr-1 text-right"
                          >
                            Total
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.totalIssueAmount?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black"></TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.totalCurrentBalance?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.totalCurrentInterest?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.totalOdBalance?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.totalOdInterest?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black"></TableCell>
                        </TableRow>
                      );
                    case "grandTotal":
                      return (
                        <TableRow className="h-[40px] border-t-2 border-dashed border-black">
                          <TableCell
                            colSpan={5}
                            className="border border-black p-0 pr-1 text-right"
                          >
                            Total Outstanding
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.grandTotalIssueAmount?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black"></TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.grandTotalCurrentBalance?.toFixed(2) ||
                              ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.grandTotalCurrentInterest?.toFixed(2) ||
                              ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.grandTotalOdBalance?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black text-right">
                            {row.data?.grandTotalOdInterest?.toFixed(2) || ""}
                          </TableCell>
                          <TableCell className="border p-0 pr-[2px] border-black"></TableCell>
                        </TableRow>
                      );
                    default:
                      return null;
                  }
                })}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">Generated By: {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              This report is generated by PrioSuite.
            </p>
            <p className="text-nowrap">
              Generated On: {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuarantorDetailsPreview;
