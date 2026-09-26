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
import { format } from "date-fns";
import { useEffect, useState } from "react";

const PreviewModal = ({
  printRef,
  ledgerTableExpenditureData,
  ledgerTableIncomeData,
  netData,
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

  const PAGE_ROWS = 23; // Global row limit

  const paginateBody = (groupedData) => {
    const pages = [];
    let currentPage = [];

    (groupedData || []).forEach((group) => {
      const rows = [
        { type: "group", data: group },
        ...(group.transactions || []).map((txn) => ({ type: "txn", data: txn })),
      ];
      rows.forEach((row) => {
        if (currentPage.length >= PAGE_ROWS) {
          pages.push(currentPage);
          currentPage = [];
        }
        currentPage.push(row);
      });
    });

    if (currentPage.length > 0 || pages.length === 0) pages.push(currentPage);
    return pages;
  };

  const leftNet = netData?.find((d) => d.Position === "L");
  const rightNet = netData?.find((d) => d.Position === "R");
  const leftSub = ledgerTableExpenditureData?.grandTotals?.grandTotalAmount || 0;
  const rightSub = ledgerTableIncomeData?.grandTotals?.grandTotalAmount || 0;
  const footerCount = leftNet || rightNet ? 3 : 2;

  const leftTablePages = paginateBody(ledgerTableExpenditureData?.groupedData);
  const rightTablePages = paginateBody(ledgerTableIncomeData?.groupedData);
  const pageCount = Math.max(leftTablePages.length, rightTablePages.length, 1);
  while (leftTablePages.length < pageCount) leftTablePages.push([]);
  while (rightTablePages.length < pageCount) rightTablePages.push([]);

  const lastIndex = leftTablePages.length - 1;
  if (
    leftTablePages[lastIndex].length + footerCount > PAGE_ROWS ||
    rightTablePages[lastIndex].length + footerCount > PAGE_ROWS
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

  const appendFooter = (pages, subAmount, netRow) => {
    const page = pages[pages.length - 1];
    page.push({ type: "subtotal", amount: subAmount });
    if (leftNet || rightNet) {
      page.push(netRow ? { type: "net", data: netRow } : { type: "blank" });
    }
    page.push({
      type: "grandTotal",
      amount: parseFloat(subAmount || 0) + parseFloat(netRow?.Amount || 0),
    });
  };
  appendFooter(leftTablePages, leftSub, leftNet);
  appendFooter(rightTablePages, rightSub, rightNet);

  return (
    <div className="w-[210mm] h-full" ref={printRef}>
      {Array.from({
        length: Math.max(leftTablePages.length, rightTablePages.length, 1),
      }).map((_, pageIndex) => {
        const leftPageData = leftTablePages[pageIndex] || [];
        const rightPageData = rightTablePages[pageIndex] || [];

        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className="w-full h-[297mm] flex flex-col text-center py-2 px-1 bg-white overflow-hidden print:break-after-page"
          >
            <div className="shrink-0 text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">
                {t("report.profitLoss.profitLossFromTo", {
                  fromDate:
                    fromDate && format(fromDate, "dd-MM-yyyy"),
                  toDate,
                })}
              </p>
            </div>

            <div className="flex-1 flex w-full border border-black">
              {[leftPageData, rightPageData].map((pageData, tableIndex) => {
                const isLeft = tableIndex === 0;
                return (
                  <div key={tableIndex} className="w-1/2">
                    <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
                      {(pageIndex === 0 || pageData.length > 0) && (
                        <TableHeader>
                          <TableRow className="h-[40px]">
                            <TableHead className="text-black p-0 text-center border-black h-[40px]">
                              {isLeft
                              ? t("report.profitLoss.expenditure")
                              : t("report.profitLoss.income")}
                            </TableHead>
                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              {t("common.breakUp")}
                            </TableHead>
                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              {t("common.amount")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        {pageData.map((row, index) => {
                          switch (row.type) {
                            case "group":
                              return (
                                <TableRow
                                  key={`group-${index}`}
                                  className="h-[40px]"
                                >
                                  <TableCell className="font-semibold border p-0 text-left pl-3 text-xs border-black">
                                    {row.data.headName}
                                  </TableCell>
                                  <TableCell className="font-semibold border p-0 text-right border-black pr-1" />
                                  <TableCell className="font-semibold border p-0 text-right border-black pr-1">
                                    {row.data.subtotalAmount?.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            case "txn":
                              return (
                                <TableRow
                                  key={`txn-${index}`}
                                  className="h-[40px]"
                                >
                                  <TableCell className="border border-black p-0 text-left pl-3 pr-1">
                                    {row.data.Ledger_Name}
                                  </TableCell>
                                  <TableCell className="border border-black p-0 text-right pr-1">
                                    {parseFloat(row.data.Amount).toFixed(2)}
                                  </TableCell>
                                  <TableCell className="border border-black p-0 text-right pr-1">
                                    {row.data.Debit
                                      ? parseFloat(row.data.Debit)?.toFixed(2)
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              );
                            case "subtotal":
                              return (
                                <TableRow
                                  key={`subtotal-${index}`}
                                  className="h-[40px] bg-white"
                                >
                                  <TableCell
                                    colSpan={2}
                                    className="font-semibold border border-black p-0 text-left pl-3"
                                  >
                                    {t("common.subTotal")}
                                  </TableCell>
                                  <TableCell className="font-semibold border border-black p-0 text-right pr-1">
                                    {parseFloat(row.amount).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            case "net":
                              return (
                                <TableRow
                                  key={`net-${index}`}
                                  className="h-[40px] bg-white"
                                >
                                  <TableCell
                                    colSpan={2}
                                    className="font-semibold border border-black p-0 text-left pl-3"
                                  >
                                    {row.data.Head_Name}
                                  </TableCell>
                                  <TableCell className="font-semibold border border-black p-0 text-right pr-1">
                                    {parseFloat(row.data.Amount).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            case "grandTotal":
                              return (
                                <TableRow
                                  key={`grandTotal-${index}`}
                                  className="h-[40px]"
                                >
                                  <TableCell
                                    colSpan={2}
                                    className="font-semibold bg-white border border-black p-0 text-left pl-3"
                                  >
                                    {t("common.grandTotal")}
                                  </TableCell>
                                  <TableCell className="font-semibold border border-black p-0 text-right pr-1">
                                    {parseFloat(row.amount).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              );
                            case "blank":
                              return (
                                <TableRow key={`blank-${index}`} className="h-[40px]">
                                  <TableCell className="border border-black p-0" />
                                  <TableCell className="border border-black p-0" />
                                  <TableCell className="border border-black p-0" />
                                </TableRow>
                              );
                            default:
                              return null;
                          }
                        })}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>

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
