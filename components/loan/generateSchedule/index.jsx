"use client";

import LoanAccountSearchForm from "@/common/forms/LoanAccountSearchForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRef } from "react";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
import GenerateSchedulePreview from "./GenerateSchedulePreview";

const GenerateSchedule = ({
  loading,
  handleLoanAccountFormSubmit,
  personalData,
  tableData,
  date,
}) => {
  const printRef = useRef(null);

  const handleGeneratePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `LoanRepaymentSchedule-${date && format(date, "dd-MM-yyyy")}`,
  });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-1 w-full gap-5 overflow-hidden">
        {/* <h3 className="text-2xl font-semibold ">Generate Schedule</h3> */}

        <ScrollArea className="w-full h-full px-1">
          <div className="w-full mb-10">
            <LoanAccountSearchForm
              handleSubmit={handleLoanAccountFormSubmit}
              buttonLabel={<PiFileMagnifyingGlassBold />}
              showPrintButton
              printButtonLabel={<HiMiniPrinter />}
              handlePrint={handleGeneratePDF}
              disablePrintButton={!personalData || !(tableData.length > 0)}
              formLabel="Generate Schedule"
            />
          </div>

          {(personalData || (tableData && tableData.length > 0)) && (
            <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:p-5 gap-5">
              <h3 className="w-full text-center text-xl font-semibold">
                Loan Repayment Schedule
              </h3>
              {personalData && (
                <div className="w-full flex flex-col gap-3 bg-[#D7E6F4] p-3 border border-black border-dashed">
                  <div className="w-full grid grid-cols-3 gap-5">
                    <p>
                      <span className="font-medium">Name : </span>
                      <span>{personalData.member_name}</span>
                    </p>
                    <p>
                      <span className="font-medium">Relation Name : </span>
                      <span>{personalData.relation_name}</span>
                    </p>
                    <p className="col-span-3">
                      <span className="font-medium">Address : </span>
                      <span>{personalData.address}</span>
                    </p>
                  </div>
                  <div className="w-full grid grid-cols-3 gap-5">
                    <p>
                      <span className="font-medium">Product Name : </span>
                      <span>{personalData.loan_product}</span>
                    </p>
                    <p>
                      <span className="font-medium">Account No. : </span>
                      <span>{personalData.account_no}</span>
                    </p>
                    <p>
                      <span className="font-medium">ROI : </span>
                      <span>{personalData.roi}</span>
                    </p>
                  </div>
                  <div className="w-full grid grid-cols-3 gap-5">
                    <p>
                      <span className="font-medium">Disburse Date : </span>
                      <span>
                        {personalData.disbursement_date &&
                          format(
                            new Date(personalData.disbursement_date),
                            "dd-MM-yyyy",
                          )}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Disburse Amount : </span>
                      <span>{personalData.disbursed_amount}</span>
                    </p>
                    <p>
                      <span className="font-medium">
                        Number Of Installment :{" "}
                      </span>
                      <span>{personalData.no_of_installment}</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="w-full border border-primary rounded-lg py-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] text-center">
                        Instalment No.
                      </TableHead>
                      <TableHead className="text-center">Due Date</TableHead>
                      <TableHead className="text-center">Principal</TableHead>
                      <TableHead className="text-center">Interest</TableHead>
                      <TableHead className="text-center">
                        Total Instalment Amount
                      </TableHead>
                      <TableHead className="text-center">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData ? (
                      tableData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {data.installment_no}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.due_date &&
                              format(new Date(data.due_date), "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.principal}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.interest}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.total_amount}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.balance}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      <div className="hidden">
        <GenerateSchedulePreview
          printRef={printRef}
          date={date}
          personalData={personalData}
          tableData={tableData}
        />
      </div>
    </div>
  );
};

export default GenerateSchedule;
