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
import InputField from "@/common/formFields/InputField";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const LedgerSearchForm = ({ form, fieldName = "ledgerCode" }) => {
  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchForm = useForm({
    defaultValues: {
      acctType: "",
      mainHead: "",
      subHead: "",
      keyword: "",
    },
  });

  const acctType = useWatch({ control: searchForm.control, name: "acctType" });
  const mainHead = useWatch({ control: searchForm.control, name: "mainHead" });
  const subHead = useWatch({ control: searchForm.control, name: "subHead" });

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

  useEffect(() => {
    if (dialougeOpen) {
      fetchAcctTypes();
    }
  }, [dialougeOpen, fetchAcctTypes]);

  // Account type → load main heads
  useEffect(() => {
    searchForm.setValue("mainHead", "");
    searchForm.setValue("subHead", "");
    fetchMainHeads(acctType);
    fetchSubHeads("");
  }, [acctType, fetchMainHeads, fetchSubHeads, searchForm]);

  // Main head → load sub heads
  useEffect(() => {
    searchForm.setValue("subHead", "");
    fetchSubHeads(mainHead);
  }, [mainHead, fetchSubHeads, searchForm]);

  useEffect(() => {
    if (!dialougeOpen) {
      searchForm.reset({
        acctType: "",
        mainHead: "",
        subHead: "",
        keyword: "",
      });
      setHasSearched(false);
    }
  }, [dialougeOpen, searchForm]);

  const handleSelectClick = (item) => {
    form.setValue(fieldName, item.Ledger_Code);
    setDialougeOpen(false);
  };

  const handleSearch = () => {
    setHasSearched(true);
    searchLedgers(
      acctType,
      mainHead,
      subHead,
      searchForm.getValues("keyword") || "",
      1,
    );
  };

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
        <button
          type="button"
          className="cursor-pointer text-lg p-0 bg-transparent border-0"
          aria-label="Search ledger"
        >
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
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-1rem)] max-w-[1100px] h-[min(92dvh,720px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg"
        onPointerDownOutside={(e) => {
          const target = e.target;
          if (
            target instanceof Element &&
            target.closest("[data-radix-popper-content-wrapper]")
          ) {
            e.preventDefault();
          }
        }}
        onFocusOutside={(e) => {
          const target = e.target;
          if (
            target instanceof Element &&
            target.closest("[data-radix-popper-content-wrapper]")
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          const target = e.target;
          if (
            target instanceof Element &&
            target.closest("[data-radix-popper-content-wrapper]")
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="shrink-0 pr-8 text-left">
          <DialogTitle className="text-base sm:text-lg">
            Search Ledger
          </DialogTitle>
        </DialogHeader>

        <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
          <Form {...searchForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch();
              }}
              className="w-full shrink-0"
            >
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end">
                <DropdownField
                  control={searchForm.control}
                  name="acctType"
                  label="Select Type"
                  options={acctTypeOptions}
                  optionLabelKey="Cat_Name"
                  placeholder="Select type"
                  searchPlaceholder="Search type..."
                />

                <DropdownField
                  control={searchForm.control}
                  name="mainHead"
                  label="Select Main Head"
                  options={mainHeadOptions}
                  optionLabelKey="Head_Name"
                  placeholder="Select main head"
                  searchPlaceholder="Search main head..."
                  disabled={!acctType}
                />

                <DropdownField
                  control={searchForm.control}
                  name="subHead"
                  label="Select Sub Head"
                  options={subHeadOptions}
                  optionLabelKey="Sub_Head"
                  placeholder="Select sub head"
                  searchPlaceholder="Search sub head..."
                  disabled={!mainHead}
                />

                <InputField
                  control={searchForm.control}
                  name="keyword"
                  label="Keyword"
                  placeholder="Enter keyword"
                />

                <Button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full lg:w-auto h-10 px-6"
                >
                  {searchLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {hasSearched && (
            <div className="w-full min-h-0 flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="rounded-md border w-full min-h-0 flex-1">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] whitespace-nowrap">
                        Sl
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Category Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Main Head
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Sub Head
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Ledger Name
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <ClipLoader
                            color="#00264D"
                            size={22}
                            speedMultiplier={0.7}
                          />
                        </TableCell>
                      </TableRow>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item, index) => (
                        <TableRow
                          key={item.Id ?? `${item.Ledger_Code}-${index}`}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleSelectClick(item)}
                        >
                          <TableCell className="font-medium whitespace-nowrap">
                            {(currentLedgerPage - 1) * 50 + index + 1}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.Cat_Name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.Main_Hd_Name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.Sub_Hd_Name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.Ledger}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {lastLedgerPage > 1 && (
                <div className="flex items-center justify-center sm:justify-end py-3 shrink-0 overflow-x-auto">
                  <Pagination className="w-auto mx-0">
                    <PaginationContent className="flex-wrap gap-1">
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => goToLedgerPage(currentLedgerPage - 1)}
                          disabled={currentLedgerPage === 1}
                        >
                          Previous
                        </Button>
                      </PaginationItem>

                      {startPage > 1 && (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                goToLedgerPage(1);
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {startPage > 2 && (
                            <PaginationItem>
                              <span className="px-2 text-sm">...</span>
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {pages.map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentLedgerPage}
                            onClick={(e) => {
                              e.preventDefault();
                              goToLedgerPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {endPage < lastLedgerPage && (
                        <>
                          {endPage < lastLedgerPage - 1 && (
                            <PaginationItem>
                              <span className="px-2 text-sm">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                goToLedgerPage(lastLedgerPage);
                              }}
                            >
                              {lastLedgerPage}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => goToLedgerPage(currentLedgerPage + 1)}
                          disabled={currentLedgerPage === lastLedgerPage}
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LedgerSearchForm;
