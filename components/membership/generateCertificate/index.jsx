"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoPrint } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";

const GenerateCertificate = (
  {
    // form,
    // handleSubmit,
  }
) => {
  const printRef = useRef(null);

  const form = useForm();
  const handleSubmit = () => {};
  const [openDialog, setOpenDialog] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrgName(getCookieData("userOrgName"));
      setAddress(getCookieData("userOrgAddress"));
      setRegNo(getCookieData("userOrgRegistration"));
    }
  }, []);

  const tableData = [
    {
      issueDate: "10-11-2024",
      issueAmount: "13000",
    },
    {
      issueDate: "11-11-2024",
      issueAmount: "17000",
    },
    {
      issueDate: "12-11-2024",
      issueAmount: "18000",
    },
    {
      issueDate: "13-11-2024",
      issueAmount: "8000",
    },
    {
      issueDate: "14-11-2024",
      issueAmount: "19000",
    },
  ];

  const generateCertificatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Share_Certificate",
  });

  // function generateCertificatePDF() {
  //   const doc = new jsPDF({
  //     format: [210, 148.5], // A4 width x Half A4 height
  //     unit: "mm",
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  //   const pageHeight = doc.internal.pageSize.getHeight(); // 148.5mm
  //   const marginX = 5;
  //   const marginY = 5;
  //   const padding = 2;
  //   const contentWidth = pageWidth - 2 * (marginX + padding);
  //   const lineHeight = 7;

  //   let y = marginY + padding; // Initial Y position

  //   const boldFont = { font: "helvetica", style: "bold" };
  //   const normalFont = { font: "helvetica", style: "normal" };

  //   // Draw Border Section (Half of A4 page)
  //   doc.setLineWidth(0.5);
  //   doc.rect(
  //     marginX,
  //     marginY,
  //     pageWidth - 2 * marginX,
  //     pageHeight - 2 * marginY
  //   );

  //   // Header Section (Organization Name in Blue)
  //   doc.setFont(boldFont.font, boldFont.style);
  //   doc.setFontSize(20);
  //   doc.setTextColor(37, 99, 235); // Blue color
  //   doc.text(orgName, pageWidth / 2, y + 6, { align: "center" });

  //   y += lineHeight * 2;
  //   doc.setFontSize(12);
  //   doc.setFont(normalFont.font, normalFont.style);
  //   doc.setTextColor(0, 0, 0); // Black
  //   doc.text(orgAddress, pageWidth / 2, y, { align: "center" });
  //   y += lineHeight;
  //   doc.text(orgReg, pageWidth / 2, y, { align: "center" });

  //   y += lineHeight * 2; // Move down for the dashed border

  //   // Set dashed line style
  //   doc.setLineDash([2, 1], 0); // Dashed line with 5mm on, 3mm off
  //   doc.setDrawColor(0, 0, 0); // Black color for the line

  //   // Draw the dashed line
  //   doc.line(5, y, pageWidth - 5, y); // Line from left to right with some margin

  //   // Reset line style to solid (if needed for further lines)
  //   doc.setLineDash([0], 0);

  //   // Certificate Info
  //   y += lineHeight * 2;
  //   doc.text("Share Certificate No.: 01", marginX + padding, y);
  //   doc.text("Members Copy", pageWidth - marginX - padding, y, {
  //     align: "right",
  //   });

  //   // Title Section
  //   y += lineHeight * 2;
  //   doc.setFontSize(18); // text-3xl
  //   doc.setTextColor(59, 130, 246); // blue-500
  //   doc.text("Share Certificate", pageWidth / 2, y, { align: "center" });

  //   y += lineHeight;
  //   doc.setFontSize(10);
  //   doc.setTextColor(0, 0, 0); // Black
  //   doc.text("Authorised Share Capital RS.160000/-", pageWidth / 2, y, {
  //     align: "center",
  //   });
  //   y += lineHeight;
  //   doc.text(
  //     "Dividend Into 3280 Equity Shares of RS.50/- Each",
  //     pageWidth / 2,
  //     y,
  //     { align: "center" }
  //   );

  //   // Certificate Content (Dynamic Sentence)
  //   y += lineHeight * 3;
  //   doc.setFontSize(12);

  //   const bodyParts = [
  //     { text: "This is to certify that ", color: [0, 0, 0], font: normalFont },
  //     { text: "Chandrakanta Waghair", color: [0, 0, 0], font: boldFont },
  //     { text: " is allotted Unit no. ", color: [0, 0, 0], font: normalFont },
  //     { text: "01", color: [0, 0, 0], font: boldFont },
  //     { text: " in building ", color: [0, 0, 0], font: normalFont },
  //     { text: "Basement", color: [0, 0, 0], font: boldFont },
  //     {
  //       text: " and is the registered holder of ",
  //       color: [0, 0, 0],
  //       font: normalFont,
  //     },
  //     { text: "10", color: [0, 0, 0], font: boldFont },
  //     { text: " fully paid up Shares of ", color: [0, 0, 0], font: normalFont },
  //     { text: "Rs.50", color: [0, 0, 0], font: boldFont },
  //     { text: " each numbered from ", color: [0, 0, 0], font: normalFont },
  //     { text: "1", color: [0, 0, 0], font: boldFont },
  //     { text: " to ", color: [0, 0, 0], font: normalFont },
  //     { text: "10", color: [0, 0, 0], font: boldFont },
  //     { text: " both inclusive in ", color: [0, 0, 0], font: normalFont },
  //     { text: orgName, color: [37, 99, 235], font: boldFont }, // Organization name in blue
  //     {
  //       text: " subject to the by-laws of the said society.",
  //       color: [0, 0, 0],
  //       font: normalFont,
  //     },
  //   ];

  //   let currentX = marginX + padding; // Start position on X-axis

  //   bodyParts.forEach((part) => {
  //     doc.setTextColor(...part.color);
  //     doc.setFont(part.font.font, part.font.style);

  //     part.text.split(" ").forEach((word) => {
  //       const wordWidth = doc.getTextWidth(word + " ");

  //       // If the word doesn't fit on the current line, move to the next line
  //       if (currentX + wordWidth > contentWidth) {
  //         currentX = marginX + padding;
  //         y += lineHeight;

  //         // If we exceed the half-page height, stop rendering (border limit)
  //         if (y + lineHeight > pageHeight - marginY) return;
  //       }

  //       // Render the word and move the cursor forward
  //       doc.text(word + " ", currentX, y);
  //       currentX += wordWidth;
  //     });
  //   });

  //   // Footer Section
  //   y += lineHeight * 3; // Move down for footer
  //   doc.setFontSize(12);
  //   doc.setTextColor(0, 0, 0); // Black color

  //   // Footer Text
  //   const footerText =
  //     "Given Under the Common Seal of the said Society on _________ this ______ day of ________ 20____";

  //   // Set the starting position considering the padding
  //   const startX = marginX + padding; // Starting from the left border with padding

  //   // Wrap the text and position it
  //   const wrappedFooterText = doc.splitTextToSize(
  //     footerText,
  //     contentWidth - 2 * padding
  //   ); // Split text if it exceeds width
  //   const footerY = y; // Keep y for footer text

  //   // Render each line of the wrapped text
  //   wrappedFooterText.forEach((line, index) => {
  //     doc.text(line, startX, footerY + lineHeight * index, {
  //       maxWidth: contentWidth,
  //     });
  //   });

  //   // Footer (Signatures and Seal)
  //   y += lineHeight * 4; // Move down for footer
  //   doc.setFontSize(10);

  //   const footerPartWidth = 20;

  //   // Define total gap between the texts
  //   const totalGap = 15; // You can adjust this value for desired spacing
  //   const totalWidth = footerPartWidth * 4 + 3 * totalGap;

  //   // Calculate starting X position for centering
  //   const footerStartX = (pageWidth - totalWidth) / 2; // Centered position

  //   // Render each part of the footer with the calculated positions
  //   doc.text("Seal", footerStartX, y);
  //   doc.text(
  //     "Authorized\nM.C. Member",
  //     footerStartX + footerPartWidth + totalGap,
  //     y,
  //     {
  //       align: "center",
  //     }
  //   );
  //   doc.text("Chairman", footerStartX + footerPartWidth * 2 + 2 * totalGap, y, {
  //     align: "center",
  //   });
  //   doc.text(
  //     "Secretary",
  //     footerStartX + footerPartWidth * 3 + 3 * totalGap,
  //     y,
  //     { align: "center" }
  //   );

  //   // Save the PDF
  //   doc.save("Share_Certificate.pdf");
  // }

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Generate Certificate</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col lg:flex-row items-center lg:items-end justify-center border border-primary rounded-lg p-5 gap-5">
                <InputField
                  control={form.control}
                  name="memberNo"
                  label="Member No."
                  placeholder="Enter member no."
                  className="flex-1 w-full"
                />
                <div className="flex-1 w-full flex">
                  <Button className="w-full lg:w-1/3 ">Generate</Button>
                </div>
              </div>
            </form>
          </Form>

          <div className="w-full h-full flex flex-col lg:flex-row items-center lg:items-end justify-center border border-primary rounded-lg p-5 gap-5 mt-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-center">
                    Serial No.
                  </TableHead>
                  <TableHead className="text-center">Issue Date</TableHead>
                  <TableHead className="text-center">Issue Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.issueDate}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.issueAmount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => setOpenDialog(true)}
                        className="w-fit text-xl"
                      >
                        <IoPrint />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[1000px] max-h-[min(90dvh,600px)] overflow-hidden p-4 flex justify-center">
          <ScrollArea className="sm:max-w-[1000px] sm:max-h-[600px] p-4">
            <div
              className="bg-primary px-8 py-3 text-white cursor-pointer w-fit rounded-md mb-5"
              onClick={generateCertificatePDF}
            >
              Print
            </div>
            <div className=" gap-4 w-[210mm] h-[149mm] p-1" ref={printRef}>
              <div className="h-full flex flex-col justify-between items-center w-full border border-black py-2">
                <div className="flex flex-col items-center justify-center text-center w-full border-b border-dashed border-black px-5 pb-4">
                  <h2 className="text-4xl font-semibold text-blue-600">
                    {orgName}
                  </h2>
                  <p>{address}</p>
                  <p>{regNo}</p>
                </div>
                <div className="px-5 w-full h-full flex flex-col">
                  <div className=" flex items-center justify-between w-full px-10 py-4">
                    <p>Share Certificate No. : 01</p>
                    <p className="font-semibold">Members Copy</p>
                  </div>
                  <div className="w-full text-center">
                    <h2 className="text-3xl font-semibold text-blue-500 mb-2">
                      Share Certificate
                    </h2>
                    <p className="text-sm capitalize">
                      Authorised Share Capital RS.160000/-
                    </p>
                    <p className="text-sm capitalize">
                      Dividend Into 3280 Equity Shares of RS.50/- Each
                    </p>
                    <p className="text-sm capitalize">
                      Authorised Share Capital RS. 160000 /-
                    </p>
                  </div>
                  <div className=" flex flex-col gap-10 flex-grow justify-center">
                    <p>
                      <span className="text-2xl">This is to certify that </span>{" "}
                      <span className="font-bold">Chandrakanta Waghair</span> is
                      alloted Unit no. <span className="font-bold">01</span> in
                      building <span className="font-bold">Basement</span> and
                      is the registered holder of{" "}
                      <span className="font-bold">10</span> fully paid up Shares
                      of <span className="font-bold">Rs.50</span> each numbered
                      from <span className="font-bold">1</span> to{" "}
                      <span className="font-bold">10</span> both inclusive in{" "}
                      <span className="font-bold text-blue-600">{orgName}</span>{" "}
                      subject to the by-laws of the said society.
                    </p>
                    <p>
                      Given Under the Common Seal of the said Society on
                      _________this______day of________20____
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-10 w-full text-center text-sm pb-5">
                  <p>Seal</p>
                  <p>
                    Authorized
                    <br />
                    M.C. Member
                  </p>
                  <p>Chairman</p>
                  <p>Secretary</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default GenerateCertificate;
