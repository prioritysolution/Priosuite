import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { formatDateForDisplay } from "@/utils/dateHelpers";

const PAGE_ROWS = 11;

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
    pages.push(currentPage);
    pages.push([]);
  } else {
    pages.push(currentPage);
  }

  return pages;
};

const formatAmount = (value) => {
  if (value == null || value === "") return "";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric.toFixed(2);
};

const cell = {
  border: "1px solid #000",
  padding: "4px 3px",
  fontSize: "10px",
  color: "#000",
  background: "#fff",
  verticalAlign: "middle",
  wordBreak: "break-word",
};

const headCell = {
  ...cell,
  fontWeight: 600,
  textAlign: "center",
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
          className="box-border flex h-[210mm] w-full flex-col bg-white px-2 py-2"
        >
          <div className="mb-2 flex flex-col gap-0.5 text-center text-xs uppercase">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm normal-case">
              {t("loan.loanDetailedListFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              tableLayout: "fixed",
              background: "#fff",
            }}
          >
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
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
                <th rowSpan={2} style={headCell}>{t("loan.slUpper")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.print.customerName")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.print.guardianName")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.accountNoShort")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.loanDate")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.opening")}</th>
                <th rowSpan={2} style={headCell}>{t("loan.print.disburse")}</th>
                <th colSpan={2} style={headCell}>{t("loan.repayment")}</th>
                <th colSpan={2} style={headCell}>{t("loan.outstanding")}</th>
                <th colSpan={2} style={headCell}>{t("loan.outsInterest")}</th>
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
                <tr key={row?.Acct_Id || index}>
                  <td style={{ ...cell, textAlign: "center" }}>
                    {globalSerialNo++}
                  </td>
                  <td style={{ ...cell, textAlign: "left" }}>
                    {row?.Full_Name}
                  </td>
                  <td style={{ ...cell, textAlign: "left" }}>
                    {row?.Guardian_Name || row?.Relation_Name}
                  </td>
                  <td style={{ ...cell, textAlign: "center" }}>
                    {row?.Account_No}
                  </td>
                  <td style={{ ...cell, textAlign: "center" }}>
                    {formatDateForDisplay(row?.Disb_Date)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Opening_Balance ?? row?.Opening)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Disb_Amt ?? row?.Disb)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Principal_Paid ?? row?.Paid_Prn)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Interest_Paid ?? row?.Paid_Intt)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Current_Principal ?? row?.Curr_Outs)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Overdue_Principal ?? row?.OD_Outs)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Current_Interest ?? row?.Curr_Intt)}
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    {formatAmount(row?.Overdue_Interest ?? row?.OD_Intt)}
                  </td>
                </tr>
              ))}
            </tbody>
            {pageIndex === pages.length - 1 && (
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ ...headCell, textAlign: "center" }}>
                    Total
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalOpening?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalDisburse?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalPrn?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalIntt?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalCurrOuts?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalOdOuts?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalCurrIntt?.toFixed(2)}
                  </td>
                  <td style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                    {totalOdIntt?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          <div className="mt-auto grid w-full grid-cols-3 items-end gap-2 pt-2 text-[10px]">
            <p className="truncate text-left">{t("loan.generatedByColon")} {userName}</p>
            <p className="text-center italic text-gray-600">{t("loan.reportGeneratedByPrioSuite")}</p>
            <p className="whitespace-nowrap text-right">
              {t("loan.generatedOnColon")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedListPreview;
