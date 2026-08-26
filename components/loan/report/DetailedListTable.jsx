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

const DetailedListTable = ({
  loading,
  tableData,
  totalOpening,
  totalDisburse,
  totalPrn,
  totalIntt,
  totalCurrOuts,
  totalOdOuts,
  totalCurrIntt,
  totalOdIntt,
  handleShowLedger,
}) => {
  return (
    <Table className="border">
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="border bg-gray-100">
          <TableHead rowSpan={2} className=" text-center">
            Sl No.
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Date
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Customer Name
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Gurdian Name
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Account No.
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Ref. Ac. No.
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Opening
          </TableHead>
          <TableHead rowSpan={2} className="border">
            Disburse
          </TableHead>
          <TableHead colSpan={2} className="border">
            Repayment
          </TableHead>
          <TableHead colSpan={2} className="border">
            Outstanding
          </TableHead>
          <TableHead colSpan={2} className="">
            Due Interest
          </TableHead>
        </TableRow>
        <TableRow className="border bg-gray-100">
          <TableHead className="border">Principal</TableHead>
          <TableHead className="border">Interest</TableHead>
          <TableHead className="border">Curr. Outs.</TableHead>
          <TableHead className="border">OD Outs.</TableHead>
          <TableHead className="border">Curr. Intt.</TableHead>
          <TableHead className="">OD Intt.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 14 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="">
                  {data.Disb_Date && format(data.Disb_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell className="">{data?.Relation_Name}</TableCell>
                <TableCell className="">{data?.Account_No}</TableCell>
                <TableCell className="">{data?.Ref_Ac_No}</TableCell>
                <TableCell className="">{data?.Opening}</TableCell>
                <TableCell className="">{data?.Disb}</TableCell>
                <TableCell className="">{data?.Paid_Prn}</TableCell>
                <TableCell className="">{data?.Paid_Intt}</TableCell>
                <TableCell className="">{data?.Curr_Outs}</TableCell>
                <TableCell className="">{data?.OD_Outs}</TableCell>
                <TableCell className="">{data?.Curr_Intt}</TableCell>
                <TableCell className="">{data?.OD_Intt}</TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableCell colSpan={6}>Total</TableCell>
          <TableCell>{totalOpening?.toFixed(2)}</TableCell>
          <TableCell>{totalDisburse?.toFixed(2)}</TableCell>
          <TableCell>{totalPrn?.toFixed(2)}</TableCell>
          <TableCell>{totalIntt?.toFixed(2)}</TableCell>
          <TableCell>{totalCurrOuts?.toFixed(2)}</TableCell>
          <TableCell>{totalOdOuts?.toFixed(2)}</TableCell>
          <TableCell>{totalCurrIntt?.toFixed(2)}</TableCell>
          <TableCell>{totalOdIntt?.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
