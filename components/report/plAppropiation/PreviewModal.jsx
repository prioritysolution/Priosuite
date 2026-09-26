"use client";

import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import { useEffect, useState } from "react";

const PreviewModal = ({
  printRef,
  ledgerTableExpenditureData,
  ledgerTableIncomeData,
  totalExpenditure,
  totalIncome,
  asOnDate,
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

  const PAGE_ROWS = 22;

  const toRows = (data) => {
    const rows = [];
    (data || []).forEach((item) => {
      if (item?.Heading_Name) rows.push({ type: "heading", data: item });
      if (item?.Ledger_Name) rows.push({ type: "ledger", data: item });
    });
    return rows;
  };

  const paginateRows = (rows) => {
    const pages = [];
    let currentPage = [];
    rows.forEach((row) => {
      if (currentPage.length >= PAGE_ROWS) {
        pages.push(currentPage);
        currentPage = [];
      }
      currentPage.push(row);
    });
    if (currentPage.length > 0 || pages.length === 0) pages.push(currentPage);
    return pages;
  };

  const leftTablePages = paginateRows(toRows(ledgerTableExpenditureData));
  const rightTablePages = paginateRows(toRows(ledgerTableIncomeData));
  const pageCount = Math.max(leftTablePages.length, rightTablePages.length, 1);
  while (leftTablePages.length < pageCount) leftTablePages.push([]);
  while (rightTablePages.length < pageCount) rightTablePages.push([]);

  const lastIndex = leftTablePages.length - 1;
  if (
    leftTablePages[lastIndex].length + 1 > PAGE_ROWS ||
    rightTablePages[lastIndex].length + 1 > PAGE_ROWS
  ) {
    leftTablePages.push([]);
    rightTablePages.push([]);
  }

  const finalIndex = leftTablePages.length - 1;
  const bodyLength = Math.max(
    leftTablePages[finalIndex].length,
    rightTablePages[finalIndex].length,
  );
  while (leftTablePages[finalIndex].length < bodyLength) {
    leftTablePages[finalIndex].push({ type: "blank" });
  }
  while (rightTablePages[finalIndex].length < bodyLength) {
    rightTablePages[finalIndex].push({ type: "blank" });
  }
  leftTablePages[finalIndex].push({
    type: "grandTotal",
    amount: totalExpenditure,
  });
  rightTablePages[finalIndex].push({
    type: "grandTotal",
    amount: totalIncome,
  });

  const totalPages = leftTablePages.length;

  return (
    <div className="w-[210mm] h-full" ref={printRef}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const leftPageData = leftTablePages[pageIndex] || [];
        const rightPageData = rightTablePages[pageIndex] || [];

        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className="w-full h-[297mm] flex flex-col text-center py-2 px-1 bg-white overflow-hidden print:break-after-page"
          >
            {/* Header */}
            <div className="shrink-0 text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">
                {t("report.plAppropiation.plAppropiationAsOn")} {asOnDate}
              </p>
            </div>

            {/* Two tables side by side */}
            <div className="flex-1 flex w-full border border-black">
              {[leftPageData, rightPageData].map((tableData, tableIndex) => {
                const isLeft = tableIndex === 0;

                return (
                  <div key={tableIndex} className="w-1/2">
                    <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
                      {(pageIndex === 0 || tableData.length > 0) && (
                        <TableHeader>
                          <TableRow className="h-[40px]">
                            <TableHead className="text-black border-black p-0 text-center h-[40px]">
                              {isLeft
                                ? t("report.plAppropiation.expenditure")
                                : t("report.plAppropiation.income")}
                            </TableHead>
                            <TableHead className="text-black border-black p-0 border-l text-center w-[120px] h-[40px]">
                              {t("common.amount")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        {tableData.map((row, index) => {
                          if (row.type === "blank") {
                            return (
                              <TableRow key={`blank-${index}`} className="h-[40px]">
                                <TableCell className="border border-black p-0" />
                                <TableCell className="border border-black p-0" />
                              </TableRow>
                            );
                          }
                          if (row.type === "grandTotal") {
                            return (
                              <TableRow key={`grand-${index}`} className="h-[40px] bg-white">
                                <TableCell className="font-medium border border-black text-center p-0">
                                  {t("common.grandTotal")}
                                </TableCell>
                                <TableCell className="border border-black text-right p-0 pr-[2px]">
                                  {Number(row.amount || 0).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          }
                          const data = row.data;
                          return (
                            <TableRow key={index} className="h-[40px]">
                              <TableCell
                                className={
                                  row.type === "heading"
                                    ? "font-semibold border border-black text-start p-0 pl-1"
                                    : "border border-black text-start p-0 pl-5"
                                }
                              >
                                {row.type === "heading" ? data?.Heading_Name : data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-black text-right p-0 pr-[2px]">
                                {data?.Amount}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>

            {/* Footer: generated by info */}
            <div className="shrink-0 w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
              <p className="text-nowrap">
                {t("common.generatedBy")} : {userName}
              </p>
              <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                {t("common.thisReportIsGeneratedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("common.generatedOn")} : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreviewModal;
