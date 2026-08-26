import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Fragment } from "react";
import { HiMiniPrinter } from "react-icons/hi2";

const RepayRegisterTable = ({
  loading,
  tableData,
  handleShowLedger,
  handleGenerateCollectionReceipt,
}) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">Sl No.</TableHead>
          <TableHead className="">Customer Name</TableHead>
          <TableHead className="">Gurdian Name</TableHead>
          <TableHead className="">Account No.</TableHead>
          <TableHead className="">Ref. Ac. No.</TableHead>
          <TableHead className="">Trans. Mode</TableHead>
          <TableHead className="">Principal</TableHead>
          <TableHead className="">Interest</TableHead>
          <TableHead className="">Amount</TableHead>
          <TableHead className="">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : tableData.map((group, groupIndex) => {
              // Skip the last group (groupIndex === tableData.length)
              if (groupIndex === tableData.length - 1) {
                return null;
              }

              return (
                <Fragment key={groupIndex}>
                  {/* Subheader for Date */}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={10} className="font-medium text-center">
                      Date - {group.date && format(group.date, "dd-MM-yyyy")}
                    </TableCell>
                  </TableRow>
                  {/* Rows for Transactions */}
                  {group.transactions &&
                    group.transactions.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-center">
                          {index + 1 + groupIndex} {/* Global serial */}
                        </TableCell>
                        <TableCell
                          className="cursor-pointer text-blue-500"
                          onClick={() => handleShowLedger(data.Id)}
                        >
                          {data?.Full_Name}
                        </TableCell>
                        <TableCell className="">
                          {data?.Relation_Name}
                        </TableCell>
                        <TableCell className="">{data?.Account_No}</TableCell>
                        <TableCell className="">{data?.Ref_Ac_No}</TableCell>
                        <TableCell className="">{data?.Trans_Type}</TableCell>
                        <TableCell className="">{data?.Paid_Prn}</TableCell>
                        <TableCell className="">{data?.Paid_Intt}</TableCell>
                        <TableCell className="">{data?.Tot_Amt}</TableCell>
                        <TableCell className="">
                          <Button
                            onClick={() =>
                              handleGenerateCollectionReceipt(data?.Trans_Id)
                            }
                            className="text-xl"
                          >
                            <HiMiniPrinter />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {/* Subtotal Row */}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={6} className="text-right">
                      Subtotal
                    </TableCell>
                    <TableCell>
                      {group.subtotalPrincipal &&
                        group.subtotalPrincipal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {group.subtotalInterest &&
                        group.subtotalInterest.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {group.subtotalAmount && group.subtotalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </Fragment>
              );
            })}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {tableData.some((group) => group.isGrandTotal) && (
          <TableRow className="bg-gray-100">
            <TableCell colSpan={6} className="font-medium text-right">
              Grand Total
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalPrincipal.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalInterest.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalAmount.toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
};
export default RepayRegisterTable;
