import { useTranslation } from "react-i18next";
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

const PAGE_ROWS = 40;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  rows?.forEach((row) => {
    if (count === maxRows) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push(row);
    count++;
  });

  pages.push(currentPage); // Last page has room for total

  return pages;
};

const GenerateSchedulePreview = ({
  printRef,
  date,
  personalData,
  tableData,
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

  const pages = chunkPagesWithFooterLogic(tableData);

  return (
    <div className="w-[210mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full h-[297mm] text-center py-2 px-1 flex flex-col justify-between scale-[.97]"
        >
          {/* Org Header Only on First Page */}
          <div className="text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              Loan Repament Schedule As On {date && format(date, "dd-MM-yyyy")}
            </p>
          </div>

          <div className="h-[100px] w-full border border-black my-1 px-2 py-1 grid grid-cols-3 gap-1 text-xs text-start">
            <div className="col-span-3 flex justify-around items-start w-full gap-1">
              <div className="w-full flex gap-1">
                <p className="font-semibold text-nowrap">{t("loan.memberNameColon")}</p>
                <p>{personalData?.member_name || ""}</p>
              </div>
              <div className="w-full flex gap-1 items-start justify-start">
                <p className="font-semibold text-nowrap">{t("loan.guardianNameColon")}</p>
                <p>{personalData?.relation_name || ""}</p>
              </div>
            </div>
            <div className="w-full flex gap-1 col-span-3">
              <p className="font-semibold text-nowrap">{t("loan.address")}</p>
              <p>{personalData?.address || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.productNameColon")}</p>
              <p>{personalData?.loan_product || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.accountNoColon")}</p>
              <p>{personalData?.account_no || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.roiColon")}</p>
              <p>{personalData?.roi || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.disburseDateColon")}</p>
              <p>
                {personalData?.disbursement_date
                  ? format(new Date(personalData?.disbursement_date), "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">
                {t("loan.disbursementAmountColon")}
              </p>
              <p>{personalData?.disbursed_amount || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.noOfInstallmentColon")}</p>
              <p>{personalData?.no_of_installment || ""}</p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[50px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[80px]">{t("loan.print.instalmentNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.dueDate")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[150px]">{t("loan.print.principal")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[150px]">{t("loan.print.interest")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[150px]">{t("loan.print.totalInstalmentAmount")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">{t("loan.print.balance")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow key={index} className="bg-white h-[20px]">
                    <TableCell className="border border-black p-0 text-center">
                      {row?.installment_no}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.due_date && format(new Date(row?.due_date), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.principal}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.interest}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.total_amount}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">{t("loan.generatedByColon")} {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">{t("loan.reportGeneratedByPrioSuite")}</p>
            <p className="text-nowrap">
              {t("loan.generatedOnColon")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenerateSchedulePreview;
