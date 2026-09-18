"use client";

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
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DetailedListPreview = ({ printRef, tableData, fromDate, toDate }) => {
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

  const PAGE_ROWS = 23;

  const paginateGroupedDataWithFooter = (groupedData) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;
    let serial = 1;

    const allRows = [];

    groupedData.forEach((group) => {
      if (!group.isGrandTotal) {
        allRows.push({ type: "gl", ledger: group.transactions[0].Ledger_Name });
        serial = 1;
        group?.transactions?.forEach((txn) => {
          allRows.push({
            type: "txn",
            data: txn,
            serial: serial++, // 👈 assign global serial here
          });
        });

        allRows.push({
          type: "subTotal",
          subTotalOpening: group.subtotalOpening,
          subTotalDeposit: group.subtotalDeposit,
          subTotalWithdrawn: group.subtotalWithdrawn,
          subTotalClosing: group.subtotalClosing,
        });
      }
    });

    let grandTotalRow = null;

    if (groupedData.some((group) => group.isGrandTotal)) {
      grandTotalRow = {
        type: "grandTotal",
        grandTotalOpening: groupedData.find((group) => group.isGrandTotal)
          ?.grandTotalOpening,
        grandTotalDeposit: groupedData.find((group) => group.isGrandTotal)
          ?.grandTotalDeposit,
        grandTotalWithdrawn: groupedData.find((group) => group.isGrandTotal)
          ?.grandTotalWithdrawn,
        grandTotalClosing: groupedData.find((group) => group.isGrandTotal)
          ?.grandTotalClose,
      };
    }

    allRows.forEach((row) => {
      if (currentRowCount >= PAGE_ROWS) {
        pages.push(currentPage);
        currentPage = [];
        currentRowCount = 0;
      }

      currentPage.push(row);
      currentRowCount++;
    });

    if (grandTotalRow) {
      if (currentRowCount >= PAGE_ROWS) {
        pages.push(currentPage);
        currentPage = [grandTotalRow];
      } else {
        currentPage.push(grandTotalRow);
      }
    }

    if (currentPage.length > 0) pages.push(currentPage);

    return pages;
  };

  const pages = paginateGroupedDataWithFooter(tableData);

  const renderTable = (pageData) => {
    return (
      <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
        {pageData.length > 0 && (
          <TableHeader>
            <TableRow className="h-[40px]">
              <TableHead className="text-black p-0 border-black text-center w-[40px]">
                {t("bank.print.slNo")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center">
                {t("bank.print.bankName")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                {t("bank.print.accountNo")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                {t("bank.print.accountType")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                {t("bank.print.opening")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                {t("bank.print.deposit")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                {t("bank.print.withdrawn")}
              </TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                {t("bank.print.closing")}
              </TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {pageData.map((row, index) => {
            switch (row?.type) {
              case "gl":
                return (
                  <TableRow
                    key={`ledger-${index}`}
                    className="h-[40px] border border-black"
                  >
                    <TableCell
                      colSpan={8}
                      className="font-semibold text-sm border p-0 border-black text-center"
                    >
                      {row?.ledger}
                    </TableCell>
                  </TableRow>
                );
              case "txn":
                return (
                  <Fragment key={`txn-${index}`}>
                    <TableRow className="h-[40px] border border-black">
                      <TableCell className="p-0 border border-black text-center">
                        {row.serial}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Bank_Name}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Account_No}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Acct_Type}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Opening
                          ? Number(row?.data?.Opening)?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Deposit
                          ? Number(row?.data?.Deposit)?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Withdrwan
                          ? Number(row?.data?.Withdrwan)?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Closing
                          ? Number(row?.data?.Closing)?.toFixed(2)
                          : ""}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              case "subTotal":
                return (
                  <TableRow className="h-[40px] border border-black">
                    <TableCell
                      colSpan={4}
                      className="border border-black text-right p-0 pr-5 "
                    >
                      {t("bank.subTotal")}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalOpening
                        ? row.subTotalOpening.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalDeposit
                        ? row.subTotalDeposit.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalWithdrawn
                        ? row.subTotalWithdrawn.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalClosing
                        ? row.subTotalClosing.toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                );
              case "grandTotal":
                return (
                  <TableRow
                    key={`grandTotal-${index}`}
                    className="h-[40px] bg-white border-black"
                  >
                    <TableCell
                      colSpan={4}
                      className="font-semibold p-0 pr-5 border border-black text-right"
                    >
                      {t("bank.grandTotal")}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalOpening
                        ? Number(row?.grandTotalOpening)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalDeposit
                        ? Number(row?.grandTotalDeposit)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalWithdrawn
                        ? Number(row?.grandTotalWithdrawn)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalClosing
                        ? Number(row?.grandTotalClosing)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                );
              default:
                return null;
            }
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div
      ref={printRef}
      className="w-[210mm] print:max-w-none print:w-full print:text-black"
    >
      {/* Liabilities Pages */}
      {pages.map((page, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="w-full h-[297mm] flex flex-col text-center py-2 px-1 print:break-after-page scale-[.97]"
        >
          {/* HEADER - SHOW ON EVERY PAGE */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {t("bank.detailedListFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} {t("bank.to")}{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1">{renderTable(page)}</div>

          {/* FOOTER */}
          <div className="w-full h-[40px] flex items-end justify-between text-xs relative">
            <p>
              {t("bank.generatedBy")} {userName}
            </p>
            <p className="italic text-gray-600 text-center w-full absolute  left-1/2 -translate-x-1/2">
              {t("bank.reportGeneratedByPrioSuite")}
            </p>
            <p>
              {t("bank.generatedOn")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedListPreview;
