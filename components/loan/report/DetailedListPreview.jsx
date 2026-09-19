"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { formatDateForDisplay } from "@/utils/dateHelpers";

/** Rows per landscape page — fills full page height */
const PAGE_ROWS = 25;

const chunkPages = (rows) => {
  const pages = [];
  let currentPage = [];

  (rows || []).forEach((row) => {
    if (currentPage.length === PAGE_ROWS) {
      pages.push(currentPage);
      currentPage = [];
    }
    currentPage.push(row);
  });

  if (currentPage.length > 0) pages.push(currentPage);
  return pages.length > 0 ? pages : [[]];
};

const formatAmount = (value) => {
  if (value == null || value === "") return "";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric.toFixed(2);
};

const cell = {
  border: "1px solid #000",
  padding: "1px 2px",
  fontSize: "8px",
  lineHeight: 1.1,
  color: "#000",
  background: "#fff",
  verticalAlign: "middle",
};

const headCell = {
  ...cell,
  fontWeight: 700,
  textAlign: "center",
  fontSize: "7.5px",
  background: "#f3f4f6",
};

const DetailedListPreview = ({
  printRef,
  tableData,
  totalOpening,
  totalDisburse,
  totalPrn,
  totalIntt,
  totalCurrOuts,
  totalOdOuts,
  totalCurrIntt,
  totalOdIntt,
  fromDate,
  toDate,
}) => {
  const { t } = useTranslation();

  const [userName, setUserName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [regNo, setRegNo] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(getCookieData("userName"));
      setOrgName(getCookieData("userOrgName"));
      setBranchName(getCookieData("userBranchName"));
      setAddress(getCookieData("userOrgAddress"));
      setRegNo(getCookieData("userOrgRegistration"));
    }
  }, []);

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

  const pages = chunkPages(tableData || []);
  let globalSerialNo = 1;

  return (
    <div className="w-[297mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        const bodyRowCount = pageRows.length + (isLastPage ? 1 : 0);
        const rowHeight =
          bodyRowCount > 0 ? `${(100 / bodyRowCount).toFixed(4)}%` : "auto";

        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className="box-border flex h-[210mm] w-full flex-col bg-white px-2 py-1"
          >
            <div className="mb-0.5 flex shrink-0 flex-col gap-0 text-center text-[9px] uppercase leading-tight">
              <p className="font-semibold">{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-[10px] font-semibold normal-case">
                {t("loan.loanDetailedListFrom")}{" "}
                {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
                {toDate && format(toDate, "dd-MM-yyyy")}
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <table
                style={{
                  width: "100%",
                  height: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  background: "#fff",
                }}
              >
                <colgroup>
                  <col style={{ width: "3.5%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "7.5%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.slUpper")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.print.customerName")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.print.guardianName")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.accountNoShort")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.loanDate")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.opening")}
                    </th>
                    <th rowSpan={2} style={headCell}>
                      {t("loan.print.disburse")}
                    </th>
                    <th colSpan={2} style={headCell}>
                      {t("loan.repayment")}
                    </th>
                    <th colSpan={2} style={headCell}>
                      {t("loan.outstanding")}
                    </th>
                    <th colSpan={2} style={headCell}>
                      {t("loan.outsInterest")}
                    </th>
                  </tr>
                  <tr>
                    <th style={headCell}>{t("loan.print.principal")}</th>
                    <th style={headCell}>{t("loan.print.interest")}</th>
                    <th style={headCell}>{t("loan.current")}</th>
                    <th style={headCell}>{t("loan.overdue")}</th>
                    <th style={headCell}>{t("loan.current")}</th>
                    <th style={headCell}>{t("loan.overdue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, index) => (
                    <tr key={row?.Acct_Id || index} style={{ height: rowHeight }}>
                      <td style={{ ...cell, textAlign: "center" }}>
                        {globalSerialNo++}
                      </td>
                      <td style={{ ...cell, textAlign: "left" }}>
                        {row?.Full_Name}
                      </td>
                      <td style={{ ...cell, textAlign: "left" }}>
                        {row?.Guardian_Name || row?.Relation_Name}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row?.Account_No}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDateForDisplay(row?.Disb_Date)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Opening_Balance ?? row?.Opening)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Disb_Amt ?? row?.Disb)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Principal_Paid ?? row?.Paid_Prn)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Interest_Paid ?? row?.Paid_Intt)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(
                          row?.Current_Principal ?? row?.Curr_Outs,
                        )}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Overdue_Principal ?? row?.OD_Outs)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Current_Interest ?? row?.Curr_Intt)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAmount(row?.Overdue_Interest ?? row?.OD_Intt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {isLastPage && (
                  <tfoot>
                    <tr style={{ height: rowHeight }}>
                      <td
                        colSpan={5}
                        style={{ ...headCell, textAlign: "center" }}
                      >
                        Total
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalOpening?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalDisburse?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalPrn?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalIntt?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalCurrOuts?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalOdOuts?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalCurrIntt?.toFixed(2)}
                      </td>
                      <td
                        style={{
                          ...cell,
                          textAlign: "right",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {totalOdIntt?.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="mt-0.5 grid w-full shrink-0 grid-cols-3 items-end gap-2 pt-0.5 text-[8px]">
              <p className="truncate text-left">
                {t("loan.generatedByColon")} {userName}
              </p>
              <p className="text-center italic text-gray-600">
                {t("loan.reportGeneratedByPrioSuite")}
              </p>
              <p className="whitespace-nowrap text-right">
                {t("loan.generatedOnColon")} {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailedListPreview;
