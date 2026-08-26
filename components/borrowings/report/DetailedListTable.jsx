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

const DetailedListTable = ({ loading, tableData, handleShowLedger }) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">Sl No.</TableHead>
          <TableHead className="">Opening Date</TableHead>
          <TableHead className="">Product Name</TableHead>
          <TableHead className="">Bank Name</TableHead>
          <TableHead className="">Account No.</TableHead>
          <TableHead className="">Disburse</TableHead>
          <TableHead className="">Prn. Refund</TableHead>
          <TableHead className="">Intt. Refund</TableHead>
          <TableHead className="">Outs. Bal</TableHead>
          <TableHead className="">Provision Intt.</TableHead>
          <TableHead className="">Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 11 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : tableData.map((group, groupIndex) => {
              // Check to skip rendering the last group for the table body (the one that contains the grand total)
              if (groupIndex === tableData.length - 1) return null;

              return (
                <Fragment key={groupIndex}>
                  {/* Subheader for Group */}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={11} className="font-medium text-center">
                      GL - {group.transactions[0].Ledger_Name}
                    </TableCell>
                  </TableRow>
                  {/* Rows for Transactions */}
                  {group.transactions &&
                    group.transactions.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {data.Disb_Date &&
                            format(data.Disb_Date, "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>{data.Product_Name}</TableCell>
                        <TableCell
                          className="cursor-pointer text-blue-500"
                          onClick={() => handleShowLedger(data.Id)}
                        >
                          {data.Bank_Name}
                        </TableCell>
                        <TableCell>{data.Account_No}</TableCell>
                        <TableCell>{data.Disburse}</TableCell>
                        <TableCell>{data.Prn_Refund}</TableCell>
                        <TableCell>{data.Intt_Refund}</TableCell>
                        <TableCell>{data.Outs_Bal}</TableCell>
                        <TableCell>{data.Provision_Intt}</TableCell>
                        <TableCell>
                          {data.Due_Date && format(data.Due_Date, "dd-MM-yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  {/* Subtotal Row */}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={5} className="text-right">
                      Subtotal
                    </TableCell>
                    <TableCell>{group.subtotalDisburse.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalPrnRefund.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalInttRefund.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalOutsBal.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {tableData.some((group) => group.isGrandTotal) && (
          <TableRow className="bg-gray-100">
            <TableCell colSpan={5} className="font-medium text-right">
              Grand Total
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalDisburse.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalPrnRefund.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalInttRefund.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalOutsBal.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium"></TableCell>
            <TableCell className="font-medium"></TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
