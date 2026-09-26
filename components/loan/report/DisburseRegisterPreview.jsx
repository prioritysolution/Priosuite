import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
const PAGE_ROWS = 13;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  rows.forEach((row) => {
    if (count === maxRows) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push(row);
    count++;
  });

  if (currentPage.length === maxRows) {
    // Last page is full, move total row to new page
    pages.push(currentPage);
    pages.push([]); // New page for total
  } else {
    pages.push(currentPage); // Last page has room for total
  }

  return pages;
};

const DisburseRegisterPreview = ({
  printRef,
  tableData,
  totalDisburseAmount,
  totalShareAmount,
  totalInsAmount,
  totalMisAmount,
  totalNetDisburse,
  fromDate,
  toDate,
}) => {
  const { t } = useTranslation();

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

  const pages = chunkPagesWithFooterLogic(tableData || []);

  let globalSerialNo = 1;

  return (
    <div className="w-[297mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          data-print-page="true"
          className="w-full h-[210mm] text-center py-2 px-1 flex flex-col justify-between bg-white"
        >
          {/* Org Header Only on First Page */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {t("loan.loanDisburseRegisterFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px]">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="!h-[40px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[4.2%]">{t("loan.print.slNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[7.7%]">{t("loan.print.date")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[14%]">{t("loan.print.customerName")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[12.6%]">{t("loan.print.guardianName")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[9.1%]">{t("loan.print.accountNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[7.7%]">{t("loan.print.refAcNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[8.4%]">{t("loan.print.disburse")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[7.7%]">{t("loan.print.share")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[7.7%]">{t("loan.print.insAmt")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[7.7%]">{t("loan.print.misAmt")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[13.0%]">{t("loan.print.netDisburse")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow key={index} className="bg-white !h-[40px]">
                    <TableCell className="border border-black p-0 text-center">
                      {globalSerialNo++}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Disb_Date && format(row?.Disb_Date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Full_Name}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Relation_Name}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Account_No}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Ref_Ac_No}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Disb_Amt}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Share_Amt}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Ins_Amt}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Mis_Amt}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Net_Disburse}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* Only show total on last page */}
              {pageIndex === pages.length - 1 && (
                <TableFooter>
                  <TableRow className="bg-white !h-[40px]">
                    <TableCell
                      colSpan={6}
                      className="border border-black p-0 text-center"
                    >{t("loan.total")}</TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalDisburseAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalShareAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalInsAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalMisAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalNetDisburse?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full mt-2 grid grid-cols-3 items-end gap-2 text-[10px]">
            <p className="text-left truncate">{t("loan.generatedByColon")} {userName}</p>
            <p className="text-center italic text-gray-600">{t("loan.reportGeneratedByPrioSuite")}</p>
            <p className="text-right whitespace-nowrap">
              {t("loan.generatedOnColon")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisburseRegisterPreview;
