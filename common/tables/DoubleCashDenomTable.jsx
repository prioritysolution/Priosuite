import { Input } from "@/components/ui/input";

const DoubleCashDenomTable = ({
  notes,
  inDenominators,
  outDenominators,
  totalInAmount,
  totalOutAmount,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  primaryInput = "in", // Default to "in" if not provided
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full grid grid-cols-7 gap-2 text-sm font-semibold mb-3">
        <p className=" text-center">Note</p>
        <p className="col-span-2 text-center">
          {primaryInput === "in" ? "In" : "Out"}
        </p>
        <p className="col-span-2 text-center">
          {primaryInput === "out" ? "In" : "Out"}
        </p>
        <p className="col-span-2 text-center">Total</p>
      </div>
      {notes &&
        notes.length > 0 &&
        notes.map((data, idx) => (
          <div
            key={data.Id}
            className="w-full grid grid-cols-7 items-center gap-2"
          >
            <p align="center" className="text-xs text-center">
              {data.Note_Value}
            </p>
            <Input
              type={`number`}
              placeholder={primaryInput === "in" ? "In" : "Out"}
              className="w-full col-span-2"
              value={(inDenominators && inDenominators[idx]) || ""}
              onChange={(e) => handleInDenominatorChange(e, idx)}
            />
            <Input
              type={`number`}
              placeholder={primaryInput === "out" ? "In" : "Out"}
              className="w-full col-span-2"
              value={(outDenominators && outDenominators[idx]) || ""}
              onChange={(e) => handleOutDenominatorChange(e, idx)}
            />
            <p className="text-xs text-center col-span-2" align="center">
              {((totalInAmount && totalInAmount[idx]) || 0) -
                ((totalOutAmount && totalOutAmount[idx]) || 0)}
            </p>
          </div>
        ))}

      <p className="text-lg text-red-400 font-semibold">
        Grand total:-{" "}
        {cashInTransactionGrandTotal - cashOutTransactionGrandTotal}
      </p>
    </div>
  );
};
export default DoubleCashDenomTable;
