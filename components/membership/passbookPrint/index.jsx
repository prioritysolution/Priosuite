"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import RadioField from "@/common/formFields/RadioField";
import MemberPassbookSearchForm from "@/common/forms/MemberPassbookSearchForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";

const PassbookPrint = ({
  loading,
  form,
  handleSubmit,
  handleSelectMember,
  dialougeOpen,
  setDialougeOpen,
  pageParameter,
  pageData,
  showPage,
  showLine,
  handleUpdateTrans,
}) => {
  const firstPageRef = useRef(null);
  const transPageRef = useRef(null);

  const [showPrintSuccess, setShowPrintSuccess] = useState(false);

  const generateFirstPagePDF = useReactToPrint({
    contentRef: firstPageRef,
    documentTitle: "Front Page",
  });

  const generateTransPagePDF = useReactToPrint({
    contentRef: transPageRef,
    documentTitle: "Tansaction Page",
    onAfterPrint: () => setShowPrintSuccess(true),
  });

  const totalLinesPerPage =
    (pageParameter?.Line_No_Fst_Page || 0) +
    (pageParameter?.Line_No_Scnd_Page || 0);
  const blankLinesCount = Math.max(Number(showLine) - 1, 0); // Convert gap into pixels

  const skipDataLength =
    blankLinesCount >= totalLinesPerPage
      ? Math.floor(blankLinesCount / totalLinesPerPage)
      : 0;
  // const lineGapPx = pageParameter?.Mid_Gap * 16;

  const emptyRows = Array.from({ length: blankLinesCount }, () => ({
    Id: null,
    Acct_Id: null,
    Balance: null,
    Deposit: null,
    Withdrwan: null,
    Particular: null,
    Trans_Date: null,
  }));

  const totalPageData = [...emptyRows, ...pageData];

  const transPrintData = totalPageData
    ?.reduce((acc, _, i) => {
      if (i % totalLinesPerPage === 0)
        acc.push(totalPageData?.slice(i, i + totalLinesPerPage));
      return acc;
    }, [])
    ?.slice(skipDataLength);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Passbook Print</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-6 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-wrap items-end gap-5">
                <div className="w-full sm:w-72">
                  <MemberPassbookSearchForm
                    form={form}
                    handleSelectClick={handleSelectMember}
                    dialougeOpen={dialougeOpen}
                    setDialougeOpen={setDialougeOpen}
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <FormField
                    control={form.control}
                    name="printType"
                    render={({ field }) => (
                      <RadioField
                        onChange={field.onChange}
                        value={field.value}
                        options={[
                          {
                            value: "1",
                            label: "Front Page",
                          },
                          {
                            value: "2",
                            label: "Transaction Page",
                          },
                        ]}
                        className="border border-default-200 rounded-md px-3 h-10 flex items-center"
                      />
                    )}
                  />
                </div>

                {form.watch().printType === "2" && (
                  <>
                    <div className="w-full sm:w-48">
                      <DatePickerField
                        control={form.control}
                        name="date"
                        label="Date"
                      />
                    </div>

                    <div className="w-full sm:w-32">
                      <InputField
                        control={form.control}
                        name="line"
                        label="Line"
                        placeholder="Enter line"
                        type="number"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 ml-auto w-full sm:w-auto justify-end">
                  <Button type="submit" className="w-32 h-10">
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      "Next"
                    )}
                  </Button>
                  <div
                    className={cn(
                      "w-32 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                      {
                        "pointer-events-none opacity-50":
                          !pageData || pageData?.length < 1,
                      },
                    )}
                    onClick={() => {
                      if (pageData) {
                        if (showPage === "FIRST") generateFirstPagePDF();
                        else if (showPage === "TRANS") {
                          generateTransPagePDF();
                          handleUpdateTrans(
                            transPrintData[transPrintData?.length - 1].length,
                          );
                        }
                      }
                    }}
                  >
                    Print
                  </div>
                </div>
              </div>

              {showPage === "FIRST" && pageData?.length > 0 ? (
                <div
                  // style={{
                  //   fontSize: `calc(${
                  //     (pageParameter?.Page_Height /
                  //       (pageParameter?.Fst_Page_Top + pageData?.length + 5)) *
                  //     16
                  //   }px)`,
                  // }}
                  className="w-full h-full flex justify-center border border-primary rounded-lg p-5 gap-5 text-[11px] leading-[16px]"
                >
                  <div
                    style={{
                      width: `${pageParameter?.Page_Width}mm`,
                      height: `${pageParameter?.Page_Height}mm`,
                    }}
                    className=" p-2 flex flex-col"
                    ref={firstPageRef}
                  >
                    <div
                      style={{
                        height: `calc(${pageParameter?.Fst_Page_Top}*16px)`,
                      }}
                      className="w-full"
                    />
                    {pageData?.map((value, i) => (
                      <>
                        <p
                          className={cn(
                            "",
                            {
                              "text-center font-semibold": i <= 1,
                            },
                            {
                              "grid grid-cols-[2fr_4fr]":
                                value && value.includes(":"),
                            },
                          )}
                          key={i}
                        >
                          <span
                            className={cn("font-semibold text-nowrap", {
                              "flex justify-between": i > 1,
                            })}
                          >
                            {value.split(":")[0]}
                            {!!value.includes(":") && (
                              <span className="font-bold">:</span>
                            )}{" "}
                          </span>
                          <span className="pl-2">
                            {value?.split(":")[1]?.replace(/,/g, ", ")}
                          </span>
                        </p>
                        {i === 1 ? <div className="w-full h-[16px]" /> : <></>}
                      </>
                    ))}
                    <div className="w-full h-[32px]" />
                    <div className="w-[200px] h-[30px] self-end border-t-2 border-black text-center flex items-center justify-center font-semibold">
                      <span>MANAGER</span>
                    </div>
                  </div>
                </div>
              ) : showPage === "TRANS" && pageData?.length > 0 ? (
                <div className="w-full h-full flex justify-center border border-primary rounded-lg p-5 gap-5 text-[11px] leading-[16px]">
                  <div
                    style={{
                      width: `${pageParameter?.Page_Width}mm`,
                    }}
                    className="h-full"
                    ref={transPageRef}
                  >
                    {transPrintData.map((printData, index) => (
                      <div
                        style={{
                          height: `${pageParameter?.Page_Height}mm`,
                        }}
                        className={cn(" p-2 flex flex-col w-full border")}
                        key={index}
                      >
                        <div
                          className={cn(
                            "w-full grid grid-cols-[1fr_3fr_2fr_2fr_2fr]",
                            {
                              "opacity-0":
                                index == 0 &&
                                0 <
                                  blankLinesCount -
                                    skipDataLength * totalLinesPerPage,
                            },
                          )}
                        >
                          <p className="border-x-2 border-black font-medium text-center">
                            Sl.
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Date
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Issue
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Release
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Balance
                          </p>
                        </div>
                        {printData.map((data, i) => (
                          <div key={`table-${i}`} className="flex flex-col">
                            <div
                              className={cn(
                                "w-full grid grid-cols-[1fr_3fr_2fr_2fr_2fr]",
                                {
                                  "opacity-0":
                                    index == 0 &&
                                    i <
                                      blankLinesCount -
                                        skipDataLength * totalLinesPerPage,
                                },
                              )}
                            >
                              <p className="border-x-2 border-black font-medium text-center">
                                {i + 1}
                              </p>
                              <p className="border-r-2 border-black font-medium text-center">
                                {data?.Trans_Date
                                  ? format(data?.Trans_Date, "dd-MM-yyyy")
                                  : ""}
                              </p>
                              <p className="border-r-2 border-black font-medium text-center">
                                {data?.Issue === null ? "" : data?.Issue}
                              </p>
                              <p className="border-r-2 border-black font-medium text-center">
                                {data?.Release === null ? "" : data?.Release}
                              </p>
                              <p className="border-r-2 border-black font-medium text-center">
                                {data?.Balance === null ? "" : data?.Balance}
                              </p>
                            </div>
                            <div
                              className={cn("w-full hidden", {
                                block:
                                  i === pageParameter?.Line_No_Fst_Page - 1,
                              })}
                              style={{
                                height: `calc(${pageParameter?.Mid_Gap}*16px)`,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
      <Dialog open={showPrintSuccess} onOpenChange={setShowPrintSuccess}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <div className="text-center text-2xl font-medium">
            <p>Did you print successfully ?</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowPrintSuccess(false)}
              className="bg-secondary text-black w-full sm:w-32"
            >
              No
            </Button>
            <Button
              onClick={() => {
                setShowPrintSuccess(false);
                handleUpdateTrans(
                  transPrintData[transPrintData?.length - 1].length,
                );
              }}
              className="w-full sm:w-32"
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PassbookPrint;
