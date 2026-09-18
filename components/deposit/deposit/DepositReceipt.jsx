import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import { Divider } from "@/components/ui/divider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdContentCut } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

const DepositReceipt = ({ isOpen, setIsOpen, depositReceiptData }) => {
  const { t } = useTranslation();

  const [orgName, setOrgName] = useState(null);
  const [orgBranch, setOrgBranch] = useState(null);
  const [orgAddress, setOrgAddress] = useState(null);
  const [orgReg, setOrgReg] = useState(null);
  const [orgLogo, setOrgLogo] = useState("");

  const printRef = useRef(null);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Deposit Receipt",
    pageStyle: `
    body {
      display:flex;
      justify-content:flex-end;
    }
  `,
  });

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

  useEffect(() => {
    if (typeof window !== null) {
      setOrgName(getCookieData("userOrgName"));
      setOrgBranch(getCookieData("userBranchName"));
      setOrgAddress(getCookieData("userOrgAddress"));
      setOrgReg(getCookieData("userOrgRegistration"));
      setOrgLogo(getCookieData("userOrgLogo") || "");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader className="justify-center text-2xl font-medium">
          Deposit Receipt
        </DialogHeader>
        <Divider />
        <div className="w-full flex items-center justify-center py-4 overflow-y-auto">
          <div
            ref={printRef}
            className="w-[148mm] h-[210mm] flex items-center justify-center p-1 text-sm"
          >
            <div className=" flex flex-col gap-4 justify-between w-full  h-ful scale-[.97] text-[11px]">
              <div className="w-full flex flex-col  relative h-1/2 border-2 border-black px-1">
                {orgLogo && (
                  <div className="w-full h-full absolute opacity-15 grayscale flex items-center justify-center">
                    <Image src={orgLogo} alt="" height={300} width={300} />
                  </div>
                )}
                <div className="flex flex-col justify-center w-full text-center">
                  <h3 className="font-semibold text-lg font-mono tracking-tight [word-spacing:-.5rem] uppercase">
                    {orgName || ""}
                  </h3>
                  <p className="uppercase">
                    Branch - {orgBranch} | Address - {orgAddress || ""}
                  </p>
                  <p className="">{orgReg || ""}</p>
                  <p className="underline text-sm">Deposit Receipt</p>
                  <p>Scheme - {depositReceiptData?.Product_Name}</p>
                </div>
                <div className="w-full  flex justify-between gap-1 pb-1">
                  <div className=" flex-1">
                    <p>
                      <span className="relative">
                        Name
                        {Array.from({ length: 36 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-12 bottom-[.1px]">
                          {depositReceiptData?.Member_Name}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        Receipt Date
                        {Array.from({ length: 17 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20  text-nowrap bottom-[.1px]">
                          {depositReceiptData?.Trans_Date &&
                            format(
                              depositReceiptData?.Trans_Date,
                              "dd-MM-yyyy",
                            )}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        Add.
                        {Array.from({ length: 65 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-8 bottom-[.1px] text-nowrap">
                          {depositReceiptData?.Address}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        Account No.
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {depositReceiptData?.Account_No}
                        </span>
                      </span>
                      <span className="relative">
                        Ref. Ac. No.
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {depositReceiptData?.Ref_Ac_No}
                        </span>
                      </span>
                      <span className="relative">
                        Balance
                        {Array.from({ length: 19 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-16 bottom-[.1px]">
                          {depositReceiptData?.Balance}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="h-[70px] w-[80px] border-2 border-black rounded-lg text-sm ">
                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      Receipt No
                    </p>
                    <div className="flex flex-col items-center justify-center w-full h-1/2">
                      <span>{depositReceiptData?.Rec_No}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[100px] border-2 border-black rounded-lg grid grid-cols-[2fr_1fr]">
                  {/* First Child */}
                  <div className="text-center border-r-2 border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      Particulars
                    </p>
                    <div className="flex flex-col justify-between w-full h-full">
                      <div className="w-full flex flex-col items-end gap-[2px]  px-3 pt-[2px]">
                        <p className="">Amount</p>
                        {depositReceiptData?.Fine_Amount &&
                        depositReceiptData?.Fine_Amount > 0 ? (
                          <p className="">Fine Amount</p>
                        ) : (
                          <></>
                        )}
                        {depositReceiptData?.Paid_Upto ? (
                          <p className="">
                            (Paid Upto -{" "}
                            {format(
                              depositReceiptData?.Paid_Upto,
                              "dd-MM-yyyy",
                            )}
                            )
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="w-full flex flex-col items-end gap-2 flex-shrink-0 px-3 pb-[2px] font-medium">
                        <p>
                          <span className="font-normal">
                            (Rupees{" "}
                            {convertToWords(
                              (depositReceiptData?.Amount || 0) +
                                (depositReceiptData?.Fine_Amount || 0),
                            )}{" "}
                            Only)
                          </span>{" "}
                          Total Rs.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Second Child with Specific Width */}
                  <div className="text-center border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      AMOUNT
                    </p>
                    <div className=" w-full h-full relative flex flex-col items-end">
                      <div className="w-full h-full flex flex-col items-end gap-[2px] pt-[2px] pr-14 relative">
                        <p>
                          {depositReceiptData?.Amount?.toFixed(2).split(".")[0]}
                        </p>
                        <p className="absolute right-5">
                          {depositReceiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                        {depositReceiptData?.Fine_Amount &&
                        depositReceiptData?.Fine_Amount > 0 ? (
                          <>
                            {" "}
                            <p>
                              {
                                depositReceiptData?.Fine_Amount?.toFixed(
                                  2,
                                ).split(".")[0]
                              }
                            </p>
                            <p className="absolute right-5 top-6">
                              {
                                depositReceiptData?.Fine_Amount?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="h-7 w-full border-t-2 border-black flex text-sm items-end justify-end pr-14 relative">
                        <p>
                          {
                            (
                              (depositReceiptData?.Amount || 0) +
                              (depositReceiptData?.Fine_Amount || 0)
                            )
                              .toFixed(2)
                              .split(".")[0]
                          }
                        </p>
                        <p className="absolute right-[18px]">
                          {
                            (
                              (depositReceiptData?.Amount || 0) +
                              (depositReceiptData?.Fine_Amount || 0)
                            )
                              .toFixed(2)
                              .split(".")[1]
                          }
                        </p>
                      </div>
                      <div className="h-full w-[2px] bg-black absolute top-0 right-12" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-2">
                  <div className=" flex-1 flex flex-col justify-between">
                    <div className="w-full grid grid-cols-2 pt-2">
                      <p>Received Mode : {depositReceiptData?.Mode}</p>
                      <p>Received By : {depositReceiptData?.Received_By}</p>
                    </div>
                    <p className="text-nowrap">
                      Printed On : {currentDate} {currentTime}
                    </p>
                  </div>
                  <div className="w-1/3 self-end">
                    <p className="w-full text-center">E. & O.E.</p>
                    <div className="w-full border-2 border-black rounded-xl h-[60px]">
                      <p className="bg-black text-center text-sm text-white font-medium rounded-b-md w-fit px-5 pb-1 mx-auto">
                        Cashier
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black border-dotted relative text-lg z-20">
                <MdContentCut className="absolute right-10 -top-[10px] rotate-180 " />
                <MdContentCut className="absolute left-10 -top-[10px]" />
              </div>

              <div className="w-full flex flex-col relative h-1/2 border-2 border-black px-1">
                <div className="w-full h-full absolute opacity-15 grayscale flex items-center justify-center">
                  <Image src={orgLogo} alt="" height={300} width={300} />
                </div>
                <div className="flex flex-col justify-center w-full text-center">
                  <h3 className="font-semibold text-lg font-mono tracking-tight [word-spacing:-.5rem] uppercase">
                    {orgName || ""}
                  </h3>
                  <p className="uppercase">
                    Branch - {orgBranch} | Address - {orgAddress || ""}
                  </p>
                  <p className="">{orgReg || ""}</p>
                  <p className="underline text-sm">Deposit Receipt</p>
                  <p>Scheme - {depositReceiptData?.Product_Name}</p>
                </div>
                <div className="w-full  flex justify-between gap-1 pb-1">
                  <div className=" flex-1">
                    <p>
                      <span className="relative">
                        Name
                        {Array.from({ length: 36 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-12 bottom-[.1px]">
                          {depositReceiptData?.Member_Name}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        Receipt Date
                        {Array.from({ length: 17 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20  text-nowrap bottom-[.1px]">
                          {depositReceiptData?.Trans_Date &&
                            format(
                              depositReceiptData?.Trans_Date,
                              "dd-MM-yyyy",
                            )}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        Add.
                        {Array.from({ length: 65 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-8 bottom-[.1px] text-nowrap">
                          {depositReceiptData?.Address}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        Account No.
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {depositReceiptData?.Account_No}
                        </span>
                      </span>
                      <span className="relative">
                        Ref. Ac. No.
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {depositReceiptData?.Ref_Ac_No}
                        </span>
                      </span>
                      <span className="relative">
                        Balance
                        {Array.from({ length: 19 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-16 bottom-[.1px]">
                          {depositReceiptData?.Balance}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="h-[70px] w-[80px] border-2 border-black rounded-lg text-sm ">
                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      Receipt No
                    </p>
                    <div className="flex flex-col items-center justify-center w-full h-1/2">
                      <span>{depositReceiptData?.Rec_No}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[100px] border-2 border-black rounded-lg grid grid-cols-[2fr_1fr]">
                  {/* First Child */}
                  <div className="text-center border-r-2 border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      Particulars
                    </p>
                    <div className="flex flex-col justify-between w-full h-full">
                      <div className="w-full flex flex-col items-end gap-[2px]  px-3 pt-[2px]">
                        <p className="">Amount</p>
                        {depositReceiptData?.Fine_Amount &&
                        depositReceiptData?.Fine_Amount > 0 ? (
                          <p className="">Fine Amount</p>
                        ) : (
                          <></>
                        )}
                        {depositReceiptData?.Paid_Upto ? (
                          <p className="">
                            (Paid Upto -{" "}
                            {format(
                              depositReceiptData?.Paid_Upto,
                              "dd-MM-yyyy",
                            )}
                            )
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="w-full flex flex-col items-end gap-2 flex-shrink-0 px-3 pb-[2px] font-medium">
                        <p>
                          <span className="font-normal">
                            (Rupees{" "}
                            {convertToWords(
                              (depositReceiptData?.Amount || 0) +
                                (depositReceiptData?.Fine_Amount || 0),
                            )}{" "}
                            Only)
                          </span>{" "}
                          Total Rs.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Second Child with Specific Width */}
                  <div className="text-center border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      AMOUNT
                    </p>
                    <div className=" w-full h-full relative flex flex-col items-end">
                      <div className="w-full h-full flex flex-col items-end gap-[2px] pt-[2px] pr-14 relative">
                        <p>
                          {depositReceiptData?.Amount?.toFixed(2).split(".")[0]}
                        </p>
                        <p className="absolute right-5">
                          {depositReceiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                        {depositReceiptData?.Fine_Amount &&
                        depositReceiptData?.Fine_Amount > 0 ? (
                          <>
                            {" "}
                            <p>
                              {
                                depositReceiptData?.Fine_Amount?.toFixed(
                                  2,
                                ).split(".")[0]
                              }
                            </p>
                            <p className="absolute right-5 top-6">
                              {
                                depositReceiptData?.Fine_Amount?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="h-7 w-full border-t-2 border-black flex text-sm items-end justify-end pr-14 relative">
                        <p>
                          {
                            (
                              (depositReceiptData?.Amount || 0) +
                              (depositReceiptData?.Fine_Amount || 0)
                            )
                              .toFixed(2)
                              .split(".")[0]
                          }
                        </p>
                        <p className="absolute right-[18px]">
                          {
                            (
                              (depositReceiptData?.Amount || 0) +
                              (depositReceiptData?.Fine_Amount || 0)
                            )
                              .toFixed(2)
                              .split(".")[1]
                          }
                        </p>
                      </div>
                      <div className="h-full w-[2px] bg-black absolute top-0 right-12" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-2">
                  <div className=" flex-1 flex flex-col justify-between">
                    <div className="w-full grid grid-cols-2 pt-2">
                      <p>Received Mode : {depositReceiptData?.Mode}</p>
                      <p>Received By : {depositReceiptData?.Received_By}</p>
                    </div>
                    <p className="text-nowrap">
                      Printed On : {currentDate} {currentTime}
                    </p>
                  </div>
                  <div className="w-1/3 self-end">
                    <p className="w-full text-center">E. & O.E.</p>
                    <div className="w-full border-2 border-black rounded-xl h-[60px]">
                      <p className="bg-black text-center text-sm text-white font-medium rounded-b-md w-fit px-5 pb-1 mx-auto">
                        Cashier
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            size="lg"
            className="w-32"
          >
            Cancel
          </Button>
          <Button size="lg" className="w-32" onClick={() => generatePDF()}>
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositReceipt;
