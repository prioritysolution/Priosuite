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

const DividendListTable = ({
  tableData,
  totalBalance,
  handleShowLedger,
  loading,
}) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">Sl No.</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="">Member Type</TableHead>
          <TableHead className="">Customer Name</TableHead>
          <TableHead className="">Gurdian Name</TableHead>
          <TableHead className="">Village</TableHead>
          <TableHead className="">L/F No.</TableHead>
          <TableHead className="">Balance</TableHead>
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
          : tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="">
                  {data.Adm_Date && format(data.Adm_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="">{data?.Member_Type}</TableCell>
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell className="">{data?.Relation_Name}</TableCell>
                <TableCell className="">{data?.Village}</TableCell>
                <TableCell className="">{data?.Ledg_Folio}</TableCell>
                <TableCell className="">{data?.Balance}</TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Skeleton className="w-32 h-5 bg-secondary" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
          </TableRow>
        ) : (
          <TableRow className="bg-gray-100">
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell>{totalBalance?.toFixed(2)}</TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
};
export default DividendListTable;
