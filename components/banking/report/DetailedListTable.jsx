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
import { Fragment } from "react";

const DetailedListTable = ({ loading, tableData, handleShowLedger }) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">Sl No.</TableHead>
          <TableHead className="">Bank Name</TableHead>
          <TableHead className="">Account No.</TableHead>
          <TableHead className="">Account Type</TableHead>
          <TableHead className="">Opening</TableHead>
          <TableHead className="">Deposit</TableHead>
          <TableHead className="">Withdrawn</TableHead>
          <TableHead className="">Closing</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((_, index) => (
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
                    <TableCell colSpan={9} className="font-medium text-center">
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
                        <TableCell
                          className="cursor-pointer text-blue-500"
                          onClick={() => handleShowLedger(data.Id)}
                        >
                          {data.Bank_Name}
                        </TableCell>
                        <TableCell>{data.Account_No}</TableCell>
                        <TableCell>{data.Acct_Type}</TableCell>
                        <TableCell>{data.Opening}</TableCell>
                        <TableCell>{data.Deposit}</TableCell>
                        <TableCell>{data.Withdrawn}</TableCell>
                        <TableCell>{data.Closing}</TableCell>
                      </TableRow>
                    ))}
                  {/* Subtotal Row */}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={4} className="text-right">
                      Subtotal
                    </TableCell>
                    <TableCell>{group.subtotalOpening.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalDeposit.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalWithdrawn.toFixed(2)}</TableCell>
                    <TableCell>{group.subtotalClosing.toFixed(2)}</TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {tableData.some((group) => group.isGrandTotal) && (
          <TableRow className="bg-gray-100">
            <TableCell colSpan={4} className="font-medium text-right">
              Grand Total
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalOpening.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalDeposit.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalWithdrawn.toFixed(2)}
            </TableCell>
            <TableCell className="font-medium">
              {tableData
                .find((group) => group.isGrandTotal)
                .grandTotalClosing.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
