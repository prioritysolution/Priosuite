"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipLoader } from "react-spinners";
import { useLedgerSearch } from "@/container/voucher/voucherEntry/Hooks";
import DropdownField from "@/common/formFields/DropdownField";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const LedgerSearchForm = ({ form, fieldName = "ledgerCode" }) => {
  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [acctType, setAcctType] = useState("");
  const [mainHead, setMainHead] = useState("");
  const [subHead, setSubHead] = useState("");
  const [keyword, setKeyword] = useState("");

  const {
    acctTypeOptions,
    mainHeadOptions,
    subHeadOptions,
    searchResults,
    searchLoading,
    fetchAcctTypes,
    fetchMainHeads,
    fetchSubHeads,
    searchLedgers,
    currentLedgerPage,
    lastLedgerPage,
    goToLedgerPage,
  } = useLedgerSearch();

  console.log("acctTypeOptions=", acctTypeOptions);

  // Load account types on component mount
  useEffect(() => {
    console.log("Component mounted, fetching account types");
    fetchAcctTypes();
  }, [fetchAcctTypes]);

  // Load main heads when account type changes
  useEffect(() => {
    console.log("Account type changed to:", acctType);
    fetchMainHeads(acctType);
    setMainHead("");
    setSubHead("");
  }, [acctType, fetchMainHeads]);

  // Load sub heads when main head changes
  useEffect(() => {
    console.log("Main head changed to:", mainHead);
    fetchSubHeads(mainHead);
    setSubHead("");
  }, [mainHead, fetchSubHeads]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!dialougeOpen) {
      setAcctType("");
      setMainHead("");
      setSubHead("");
      setKeyword("");
    }
  }, [dialougeOpen]);

  const handleSelectClick = (item) => {
    form.setValue(fieldName, item.Ledger_Code);
    setDialougeOpen(false);
  };

  const handleSearch = () => {
    console.log("Search button clicked with params:", {
      acctType,
      mainHead,
      subHead,
      keyword,
    });
    searchLedgers(acctType, mainHead, subHead, keyword, 1);
  };

  // Dynamic pagination range logic (5 pages at a time)
  const visiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentLedgerPage - Math.floor(visiblePages / 2),
      lastLedgerPage - visiblePages + 1,
    ),
  );
  const endPage = Math.min(startPage + visiblePages - 1, lastLedgerPage);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <Dialog open={dialougeOpen} onOpenChange={setDialougeOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer text-lg">
          <DialogTrigger asChild>
            <div className="cursor-pointer text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </DialogTrigger>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-[1000px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
        <DialogHeader className="shrink-0 pr-8 text-left">
          <DialogTitle className="text-base sm:text-lg">
            Search Ledger
          </DialogTitle>
        </DialogHeader>

        <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Dropdowns and Keyword Input */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {/* Select Type */}
            <DropdownField
              label="Select Type"
              value={acctType}
              onChange={setAcctType}
              options={acctTypeOptions}
              optionLabelKey="Cat_Name"
              placeholder="Select type"
              searchPlaceholder="Search type..."
              fixedDropdownWidth
            />

            {/* Select Main Head */}
            <DropdownField
              label="Select Main Head"
              value={mainHead}
              onChange={setMainHead}
              options={mainHeadOptions}
              optionLabelKey="Head_Name"
              placeholder="Select main head"
              searchPlaceholder="Search main head..."
              fixedDropdownWidth
            />

            {/* Select Sub Head */}
            <DropdownField
              label="Select Sub Head"
              value={subHead}
              onChange={setSubHead}
              options={subHeadOptions}
              optionLabelKey="Head_Name"
              placeholder="Select sub head"
              searchPlaceholder="Search sub head..."
              fixedDropdownWidth
            />

            {/* Keyword Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Keyword</label>
              <Input
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 shrink-0">
            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              className="w-full sm:w-auto"
            >
              {searchLoading ? (
                <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Results Table */}
          {searchResults.length > 0 && (
            <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center sm:items-end">
              <ScrollArea className="rounded-md border w-[350px] sm:w-full h-full">
                <ScrollArea className="w-[350px] sm:w-full h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Sl</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Main Head</TableHead>
                        <TableHead>Sub Head</TableHead>
                        <TableHead>Ledger Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((item, index) => (
                        <TableRow
                          key={item.Id}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleSelectClick(item)}
                        >
                          <TableCell className="font-medium">
                            {(currentLedgerPage - 1) * 50 + index + 1}
                          </TableCell>
                          <TableCell>{item.Cat_Name}</TableCell>
                          <TableCell>{item.Main_Hd_Name}</TableCell>
                          <TableCell>{item.Sub_Hd_Name}</TableCell>
                          <TableCell>{item.Ledger}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </ScrollArea>

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination className="space-x-2">
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToLedgerPage(currentLedgerPage - 1)}
                        disabled={currentLedgerPage === 1}
                      >
                        Previous
                      </Button>
                    </PaginationItem>

                    {/* First Page + Ellipsis */}
                    {startPage > 1 && (
                      <>
                        <PaginationItem onClick={() => goToLedgerPage(1)}>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        {startPage > 2 && (
                          <PaginationItem>
                            <PaginationLink href="#">...</PaginationLink>
                          </PaginationItem>
                        )}
                      </>
                    )}

                    {/* Dynamic Page Range */}
                    {pages.map((page) => (
                      <PaginationItem
                        key={page}
                        onClick={() => goToLedgerPage(page)}
                      >
                        <PaginationLink
                          href="#"
                          isActive={page === currentLedgerPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Last Page + Ellipsis */}
                    {endPage < lastLedgerPage && (
                      <>
                        {endPage < lastLedgerPage - 1 && (
                          <PaginationItem>
                            <PaginationLink href="#">...</PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationItem
                          onClick={() => goToLedgerPage(lastLedgerPage)}
                        >
                          <PaginationLink href="#">{lastLedgerPage}</PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToLedgerPage(currentLedgerPage + 1)}
                        disabled={currentLedgerPage === lastLedgerPage}
                      >
                        Next
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LedgerSearchForm;
