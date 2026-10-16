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

const formatDateSafe = (dateVal, formatStr = "dd-MM-yyyy") => {
  if (!dateVal) return "";
  try {
    const parsedDate = new Date(dateVal);
    if (isNaN(parsedDate.getTime())) return "";
    return format(parsedDate, formatStr);
  } catch (error) {
    return "";
  }
};

const money = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toFixed(2);
};

const FIRST_PAGE_ROWS = 28;
const NEXT_PAGE_ROWS = 34;
const chunkPages = (rows = []) => {
  const pages = [];
  const first = rows.slice(0, FIRST_PAGE_ROWS);
  pages.push(first);

  let index = first.length;
  while (index < rows.length) {
    pages.push(rows.slice(index, index + NEXT_PAGE_ROWS));
    index += NEXT_PAGE_ROWS;
  }

  const last = pages[pages.length - 1];
  const limit = pages.length === 1 ? FIRST_PAGE_ROWS : NEXT_PAGE_ROWS;
  if (last.length >= limit) pages.push([]);

  return pages;
};

const Detail = ({ label, value, wide = false }) => (
  <div className={`min-w-0 flex gap-1 ${wide ? "col-span-3" : ""}`}>
    <p className="font-semibold shrink-0">{label}</p>
    <p className="break-words">{value || ""}</p>
  </div>
);

const DepositLedgerPreview = ({
  printRef,
  fromDate,
  toDate,
  totalWithdrawn,
  totalDeposit,
  totalInterest,
  ledgerHeaderData,
  ledgerTableData,
}) => {
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
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = String(hours % 12 || 12).padStart(2, "0");

    setCurrentDate(`${day}-${month}-${year}`);
    setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
  }, []);

  const pages = chunkPages(ledgerTableData || []);
  let serial = 1;
  const period = `Deposit Ledger From ${formatDateSafe(fromDate)} To ${formatDateSafe(toDate)}`;

  return (
    <div className="w-[210mm] bg-white text-black" ref={printRef}>
      {pages.map((pageRows, pageIndex) => {
        const isFirst = pageIndex === 0;
        const isLast = pageIndex === pages.length - 1;

        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className={`w-full h-[297mm] px-3 py-2 flex flex-col bg-white overflow-hidden ${
              isLast ? "" : "print:break-after-page"
            }`}
          >
            <div className="shrink-0 text-center uppercase text-[11px] leading-4">
              <p className="font-semibold">{orgName}</p>
              <p>{branchName}</p>
              <p className="normal-case">{address}</p>
              <p>{regNo}</p>
              <p className="text-xs font-semibold mt-0.5 normal-case">{period}</p>
            </div>

            {isFirst ? (
              <div className="shrink-0 mt-1 mb-1 border border-black px-2 py-1 grid grid-cols-3 gap-x-3 gap-y-0.5 text-[11px] text-left leading-4">
                <Detail label="Member Name :" value={ledgerHeaderData?.Mem_Name} />
                <Detail label="Guardian Name :" value={ledgerHeaderData?.Relation_Name} />
                <Detail wide label="Address :" value={ledgerHeaderData?.Address} />
                <Detail label="Product Name :" value={ledgerHeaderData?.Product_Name} />
                <Detail label="Account No. :" value={ledgerHeaderData?.Account_No} />
                <Detail label="Ref. Ac. No. :" value={ledgerHeaderData?.Ref_Ac_No} />
                <Detail label="Ledger Folio :" value={ledgerHeaderData?.Ledg_Folio} />
                <Detail
                  label="Opening Date :"
                  value={formatDateSafe(ledgerHeaderData?.Opening_Date)}
                />
                <Detail label="ROI :" value={ledgerHeaderData?.ROI} />
                <Detail label="Operation Mode :" value={ledgerHeaderData?.Oper_Mode} />
                <Detail label="Status :" value={ledgerHeaderData?.Status} />
                {ledgerHeaderData?.Installment_Amount ? (
                  <Detail
                    label="Installment Amount :"
                    value={money(ledgerHeaderData.Installment_Amount)}
                  />
                ) : null}
                {ledgerHeaderData?.Maturity_Date ? (
                  <Detail
                    label="Maturity Date :"
                    value={formatDateSafe(ledgerHeaderData.Maturity_Date)}
                  />
                ) : null}
                {ledgerHeaderData?.Maturity_Amount ? (
                  <Detail
                    label="Maturity Amount :"
                    value={money(ledgerHeaderData.Maturity_Amount)}
                  />
                ) : null}
              </div>
            ) : (
              <p className="shrink-0 text-left text-[11px] font-semibold py-1">
                {ledgerHeaderData?.Mem_Name || ""}{" "}
                {ledgerHeaderData?.Account_No
                  ? `· A/c ${ledgerHeaderData.Account_No}`
                  : ""}
              </p>
            )}

            <div className="flex-1 min-h-0 w-full">
              <Table className="w-full border-collapse border border-black text-[11px]">
                <TableHeader>
                  <TableRow className="h-[8mm] border-black">
                    <TableHead className="text-black p-0 border-black text-center w-[36px]">
                      SL. NO.
                    </TableHead>
                    <TableHead className="text-black p-0 border-l border-black text-center w-[78px]">
                      DATE
                    </TableHead>
                    <TableHead className="text-black p-0 pl-1 border-l border-black text-left">
                      PARTICULAR
                    </TableHead>
                    <TableHead className="text-black p-0 border-l border-black text-center w-[88px]">
                      WITHDRAWN
                    </TableHead>
                    <TableHead className="text-black p-0 border-l border-black text-center w-[88px]">
                      DEPOSIT
                    </TableHead>
                    <TableHead className="text-black p-0 border-l border-black text-center w-[88px]">
                      INTEREST
                    </TableHead>
                    <TableHead className="text-black p-0 border-l border-black text-center w-[96px]">
                      BALANCE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&_td]:h-[7.2mm]">
                  {pageRows.map((row, index) => (
                    <TableRow key={`${pageIndex}-${index}`} className="h-[7.2mm] bg-white">
                      <TableCell className="border border-black p-0 text-center">
                        {serial++}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center whitespace-nowrap">
                        {formatDateSafe(row?.Trans_Date)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pl-1 pr-1 text-left break-words">
                        {row?.Particular || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right">
                        {money(row?.Withdrawn)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right">
                        {money(row?.Deposit)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right">
                        {money(row?.Interest)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right">
                        {money(row?.Balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {isLast && (
                  <TableFooter>
                    <TableRow className="h-[7.2mm] bg-white">
                      <TableCell
                        colSpan={3}
                        className="border border-black p-0 pl-1 text-left font-semibold"
                      >
                        Total
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right font-semibold">
                        {money(totalWithdrawn)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right font-semibold">
                        {money(totalDeposit)}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-1 text-right font-semibold">
                        {money(totalInterest)}
                      </TableCell>
                      <TableCell className="border border-black p-0" />
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>

            <div className="shrink-0 h-8 mt-1 flex items-end justify-between text-[10px] relative">
              <p className="whitespace-nowrap">Generated By: {userName}</p>
              <p className="absolute left-1/2 -translate-x-1/2 italic text-gray-600 whitespace-nowrap">
                This report is generated by PrioSuite.
              </p>
              <p className="whitespace-nowrap">
                Generated On: {currentDate} {currentTime}
                <span className="ml-3">
                  Page {pageIndex + 1} of {pages.length}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DepositLedgerPreview;
