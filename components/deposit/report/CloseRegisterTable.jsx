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

const CloseRegisterTable = ({ loading, tableData, handleShowLedger }) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">Sl No.</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="">Customer Name</TableHead>
          <TableHead className="">Gurdian Name</TableHead>
          <TableHead className="">Account No.</TableHead>
          <TableHead className="">Ref. Ac. No.</TableHead>
          <TableHead className="">L/F No.</TableHead>
          <TableHead className="">Operation Mode</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 10 }).map((_, index) => (
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
                  {data.Closing_Date && format(data.Closing_Date, "dd-MM-yyyy")}
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
                <TableCell className="">{data?.Operation_Mode}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};
export default CloseRegisterTable;
