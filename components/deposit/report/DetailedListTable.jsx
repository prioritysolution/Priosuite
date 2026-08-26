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
  totalDeposit,
  totalWithdrawn,
  totalClosing,
  totalPaidIntt,
  totalDueIntt,
  handleShowLedger,
}) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">Sl No.</TableHead>
          <TableHead className="">Customer Name</TableHead>
          <TableHead className="">Gurdian Name</TableHead>
          <TableHead className="">Account No.</TableHead>
          <TableHead className="">Ref. Ac. No.</TableHead>
          <TableHead className="">L/F No.</TableHead>
          <TableHead className="">Opening Date</TableHead>
          <TableHead className="">ROI</TableHead>
          <TableHead className="">Maturity Date</TableHead>
          <TableHead className="">Opening</TableHead>
          <TableHead className="">Deposit</TableHead>
          <TableHead className="">Withdrawn</TableHead>
          <TableHead className="">Closing</TableHead>
          <TableHead className="">Paid Intt.</TableHead>
          <TableHead className="">Due Intt.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 15 }).map((_, index) => (
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
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell className="">{data?.Relation_Name}</TableCell>
                <TableCell className="">{data?.Account_No}</TableCell>
                <TableCell className="">{data?.Ref_Ac_No}</TableCell>
                <TableCell className="">{data?.Ledg_Folio}</TableCell>
                <TableCell className="">
                  {data.Opening_Date && format(data.Opening_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="">{data?.ROI}</TableCell>
                <TableCell className="">
                  {data.Maturity_Date &&
                    format(data.Maturity_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="">{data?.Opening}</TableCell>
                <TableCell className="">{data?.Deposit}</TableCell>
                <TableCell className="">{data?.Withdrwan}</TableCell>
                <TableCell className="">{data?.Closing}</TableCell>
                <TableCell className="">{data?.Paid_Intt}</TableCell>
                <TableCell className="">{data?.Due_Intt}</TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableCell colSpan={9}>Total</TableCell>
          <TableCell>{totalOpening?.toFixed(2)}</TableCell>
          <TableCell>{totalDeposit?.toFixed(2)}</TableCell>
          <TableCell>{totalWithdrawn?.toFixed(2)}</TableCell>
          <TableCell>{totalClosing?.toFixed(2)}</TableCell>
          <TableCell>{totalPaidIntt?.toFixed(2)}</TableCell>
          <TableCell>{totalDueIntt?.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
