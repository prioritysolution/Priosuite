


"use client";

import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ImagePlus,
  Inbox,
  LifeBuoy,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  X,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import DropdownField from "@/common/formFields/DropdownField";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { formatDateForDisplay } from "@/utils/dateHelpers";

const priorityClass = {
  Low: "bg-slate-100 text-slate-700 ring-slate-200",
  Medium: "bg-amber-50 text-amber-800 ring-amber-200",
  High: "bg-orange-50 text-orange-800 ring-orange-200",
  Urgent: "bg-red-50 text-red-700 ring-red-200",
};

const priorityDot = {
  Low: "bg-slate-400",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Urgent: "bg-red-500",
};

const statusClass = {
  Open: "bg-sky-50 text-sky-800 ring-sky-200",
  "In Progress": "bg-amber-50 text-amber-800 ring-amber-200",
  Closed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

const statusDot = {
  Open: "bg-sky-500",
  "In Progress": "bg-amber-500",
  Closed: "bg-emerald-500",
};

const PRIORITY_LABEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const STATUS_LABEL = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};

const formatSupportDate = (value) => {
  if (!value) return "";
  const [datePart, timePart] = String(value).split(" ");
  const date = formatDateForDisplay(datePart);
  if (!date) return String(value);
  return timePart ? `${date} ${timePart}` : date;
};

const Badge = ({ value, map, dotMap }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
      map[value] || "bg-slate-100 text-slate-700 ring-slate-200"
    }`}
  >
    {dotMap ? (
      <span className={`h-1.5 w-1.5 rounded-full ${dotMap[value] || "bg-slate-400"}`} />
    ) : null}
    {value || "—"}
  </span>
);

const SectionCard = ({ children, className = "" }) => (
  <section
    className={`rounded-xl border border-primary/20 bg-white p-3 shadow-sm sm:p-5 ${className}`}
  >
    {children}
  </section>
);

const ImageGrid = ({ files, onRemove, preview = false }) => {
  const [active, setActive] = useState(null);
  if (!files?.length) return null;
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => (
          <div
            key={file.id || file.url || file.name}
            className="group relative overflow-hidden rounded-md border border-slate-200 bg-white"
          >
            {preview ? (
              <button
                type="button"
                className="group/preview relative block w-full cursor-pointer"
                onClick={() => setActive(file)}
                aria-label={`View ${file.name || "image"}`}
              >
                <img
                  src={file.url}
                  alt={file.name || "Screenshot"}
                  className="h-20 w-full object-cover sm:h-24"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover/preview:opacity-100">
                  <Eye className="h-5 w-5 text-white" />
                </span>
              </button>
            ) : (
              <img
                src={file.url}
                alt={file.name || "Screenshot"}
                className="h-20 w-full object-cover sm:h-24"
              />
            )}
            {onRemove ? (
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="absolute right-1 top-1 rounded-full bg-white/95 p-1 text-slate-700 shadow hover:bg-red-50 hover:text-red-600"
                onClick={() => onRemove(file.id)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <p className="truncate bg-slate-50 px-2 py-1 text-[10px] text-slate-600">
              {file.name}
            </p>
          </div>
        ))}
      </div>
      {preview ? (
        <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
          <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-3 overflow-hidden border-primary/30 bg-white p-3 shadow-none sm:max-w-4xl sm:p-5 lg:max-w-5xl">
            <DialogHeader className="shrink-0 pr-8 text-left">
              <DialogTitle className="truncate text-base sm:text-lg">
                {active?.name || "Screenshot"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex min-h-[40dvh] items-center justify-center overflow-auto bg-slate-50 p-2 sm:min-h-[50dvh] sm:p-4">
              {active?.url ? (
                <img
                  src={active.url}
                  alt={active.name || "Screenshot"}
                  className="max-h-[70dvh] w-auto max-w-full object-contain"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

const readPickedFiles = (event, onPick) => {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (files.length) onPick(files);
};

const UploadBox = ({ onPick }) => (
  <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-primary/40 px-3 py-4 text-center hover:bg-slate-50">
    <ImagePlus className="h-5 w-5 text-primary" />
    <span className="text-sm font-semibold text-primary">Upload images</span>
    <span className="text-xs text-muted-foreground">
      PNG, JPG, WEBP, or GIF. Up to 10 images, 20 MB each.
    </span>
    <input
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
      multiple
      className="hidden"
      onChange={(event) => readPickedFiles(event, onPick)}
    />
  </label>
);

const Fact = ({ label, children, className = "" }) => (
  <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
    <p className="text-sm text-slate-500">{label}</p>
    <div className="min-w-0 break-words text-sm text-slate-900">{children}</div>
  </div>
);

const Support = ({
  projectName,
  pageError,
  form,
  filterForm,
  replyForm,
  tickets,
  listMeta,
  pageCount,
  loading,
  listLoading,
  submitting,
  dialogOpen,
  attachments,
  showSuccessMessage,
  successText,
  activePhone,
  detailOpen,
  detailLoading,
  selectedTicket,
  messages,
  replyFiles,
  replySubmitting,
  priorityOptions,
  statusOptions,
  filterPriorityOptions,
  handleOpenDialog,
  handleDialogChange,
  addAttachments,
  removeAttachment,
  addReplyFiles,
  removeReplyFile,
  handleRaiseTicket,
  handleSearch,
  handleResetFilters,
  handlePageChange,
  handleOpenTicket,
  handleSendReply,
  handleDetailChange,
  updatedNumbers = [],
  handleCloseSuccessMessage,
}) => {
  const replyInputRef = useRef(null);
  const canPageBack = listMeta.page > 1;
  const canPageNext = listMeta.to < listMeta.total;

  return (
    <div className="flex h-full w-full justify-between rounded-lg bg-[#fefefe] p-1">
      <div className="flex h-full w-full flex-col items-stretch gap-3 overflow-hidden rounded-lg border-[2px] border-primary p-2 sm:p-3 lg:p-5">
        {/* Page header */}
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-white shadow-sm sm:px-5 sm:py-4">
          <span className="rounded-lg bg-white/15 p-2">
            <LifeBuoy className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-semibold leading-tight sm:text-2xl">Support</h3>
            {projectName ? (
              <p className="truncate text-xs text-white/80 sm:text-sm">{projectName}</p>
            ) : (
              <p className="text-xs text-white/80 sm:text-sm">
                Track your tickets and talk to our team
              </p>
            )}
          </div>
        </div>

        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-4 pb-2">
            {pageError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
                {pageError}
              </div>
            ) : (
              <SectionCard className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <h4 className="text-center text-lg font-semibold sm:text-xl">
                    Find Tickets
                  </h4>
                </div>
                <Form {...filterForm}>
                  <form
                    autoComplete="off"
                    className="flex flex-col gap-4"
                    onSubmit={filterForm.handleSubmit(handleSearch)}
                  >
                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                      <InputField
                        control={filterForm.control}
                        name="search"
                        label="Search"
                        placeholder="Ticket number or subject"
                      />
                      <DropdownField
                        control={filterForm.control}
                        name="priority"
                        label="Priority"
                        options={filterPriorityOptions}
                        optionLabelKey="label"
                        optionValueKey="value"
                      />
                      <DropdownField
                        control={filterForm.control}
                        name="status"
                        label="Status"
                        options={statusOptions}
                        optionLabelKey="label"
                        optionValueKey="value"
                      />
                      <DatePickerField
                        control={filterForm.control}
                        name="fromDate"
                        label="From Date"
                      />
                      <DatePickerField
                        control={filterForm.control}
                        name="toDate"
                        label="To Date"
                      />
                    </div>
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto sm:min-w-[120px]"
                        onClick={handleResetFilters}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button type="submit" className="w-full sm:w-auto sm:min-w-[120px]">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>
                  </form>
                </Form>
              </SectionCard>
            )}

            <SectionCard className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center sm:text-left">
                  <h4 className="text-lg font-semibold sm:text-xl">Previous Tickets</h4>
                  {activePhone ? (
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      Phone {activePhone}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  className="w-full shadow-sm sm:w-auto sm:min-w-[150px]"
                  disabled={Boolean(pageError)}
                  onClick={handleOpenDialog}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Raise Ticket
                </Button>
              </div>

              {loading || listLoading ? (
                <div className="flex justify-center py-16">
                  <ClipLoader color="#00264d" size={48} />
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="flex flex-col gap-3 md:hidden">
                    {tickets.length ? (
                      tickets.map((ticket) => {
                        const isUpdated = updatedNumbers.includes(ticket.number);
                        const priorityText =
                          PRIORITY_LABEL[ticket.priority] || ticket.priority;
                        const statusText = STATUS_LABEL[ticket.status] || ticket.status;
                        return (
                          <div
                            key={ticket.number}
                            className={`flex flex-col gap-3 rounded-xl border border-primary/20 bg-white p-3 shadow-sm ${
                              isUpdated ? "support-row-updated" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">
                                  {ticket.number}
                                  {isUpdated ? (
                                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                                      New reply
                                    </span>
                                  ) : null}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatSupportDate(ticket.createdAt)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-9 w-9 shrink-0 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 hover:text-primary"
                                onClick={() => handleOpenTicket(ticket)}
                                aria-label={`View ${ticket.number}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="break-words text-sm font-medium">
                              {ticket.subject}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                value={priorityText}
                                map={priorityClass}
                                dotMap={priorityDot}
                              />
                              <Badge
                                value={statusText}
                                map={statusClass}
                                dotMap={statusDot}
                              />
                            </div>
                            {ticket.remark ? (
                              <p className="line-clamp-2 rounded-md bg-slate-50 px-2 py-1.5 text-xs text-muted-foreground">
                                {ticket.remark}
                              </p>
                            ) : null}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-primary/30 py-10 text-muted-foreground">
                        <Inbox className="h-8 w-8" />
                        <p className="text-sm">No tickets yet</p>
                      </div>
                    )}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden w-full overflow-x-auto rounded-xl border border-primary/20 md:block">
                    <Table className="min-w-[760px]">
                      <TableHeader>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                          <TableHead className="text-left font-semibold text-primary">
                            Ticket No
                          </TableHead>
                          <TableHead className="text-left font-semibold text-primary">
                            Raised On
                          </TableHead>
                          <TableHead className="text-left font-semibold text-primary">
                            Subject
                          </TableHead>
                          <TableHead className="text-left font-semibold text-primary">
                            Priority
                          </TableHead>
                          <TableHead className="text-left font-semibold text-primary">
                            Status
                          </TableHead>
                          <TableHead className="text-left font-semibold text-primary">
                            Remark
                          </TableHead>
                          <TableHead className="text-right font-semibold text-primary">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.length ? (
                          tickets.map((ticket) => (
                            <TableRow
                              key={ticket.number}
                              className={`transition-colors hover:bg-primary/5 ${
                                updatedNumbers.includes(ticket.number)
                                  ? "support-row-updated"
                                  : ""
                              }`}
                            >
                              <TableCell className="whitespace-nowrap font-medium">
                                <span className="inline-flex items-center gap-2">
                                  {ticket.number}
                                  {updatedNumbers.includes(ticket.number) ? (
                                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                                      New reply
                                    </span>
                                  ) : null}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-muted-foreground">
                                {formatSupportDate(ticket.createdAt)}
                              </TableCell>
                              <TableCell className="max-w-[240px] font-medium">
                                <p className="line-clamp-2 break-words">{ticket.subject}</p>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  value={PRIORITY_LABEL[ticket.priority] || ticket.priority}
                                  map={priorityClass}
                                  dotMap={priorityDot}
                                />
                              </TableCell>
                              <TableCell>
                                <Badge
                                  value={STATUS_LABEL[ticket.status] || ticket.status}
                                  map={statusClass}
                                  dotMap={statusDot}
                                />
                              </TableCell>
                              <TableCell className="max-w-[220px] text-muted-foreground">
                                <p className="line-clamp-2">{ticket.remark || "—"}</p>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full p-0 text-primary hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleOpenTicket(ticket)}
                                  aria-label={`View ${ticket.number}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="py-12 text-center text-muted-foreground"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Inbox className="h-8 w-8" />
                                <span>No tickets yet</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {!loading && !pageError ? (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-muted-foreground sm:text-left">
                    Showing {listMeta.from} to {listMeta.to} of {listMeta.total}
                  </p>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canPageBack}
                      onClick={() => handlePageChange(listMeta.page - 1)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="whitespace-nowrap rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:text-sm">
                      Page {listMeta.page} of {pageCount}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canPageNext}
                      onClick={() => handlePageChange(listMeta.page + 1)}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </div>
        </ScrollArea>
      </div>

      {/* Raise Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-3 overflow-hidden border-primary/30 p-3 shadow-none sm:max-w-3xl sm:p-5 lg:max-w-4xl">
          <DialogHeader className="shrink-0 border-b border-slate-200 pb-3">
            <DialogTitle className="text-left text-lg sm:text-xl">Raise Ticket</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(92dvh-5.5rem)] min-h-0 overflow-y-auto">
            <Form {...form}>
              <form
                autoComplete="off"
                className="flex flex-col gap-3 pr-1"
                onSubmit={form.handleSubmit(handleRaiseTicket)}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField
                    control={form.control}
                    name="customerName"
                    label="Name"
                    placeholder="Your name"
                    maxLength={150}
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="customerPhone"
                    label="Phone"
                    placeholder="Phone number"
                    maxLength={30}
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="customerEmail"
                    label="Email"
                    placeholder="Email address"
                    maxLength={255}
                  />
                </div>
                <InputField
                  control={form.control}
                  name="subject"
                  label="Subject"
                  placeholder="Short summary of the problem"
                  maxLength={255}
                  isRequired
                />
                <TextareaField
                  control={form.control}
                  name="issue"
                  label="Issue"
                  placeholder="Describe what happened"
                  rows={4}
                  isRequired
                />
                <DropdownField
                  control={form.control}
                  name="priority"
                  label="Priority"
                  searchPlaceholder="Select priority"
                  options={priorityOptions}
                  optionLabelKey="label"
                  optionValueKey="value"
                  isRequired
                />
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Attach Files
                  </p>
                  <UploadBox onPick={addAttachments} />
                  <ImageGrid files={attachments} onRemove={removeAttachment} />
                </div>
                <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white pt-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-1/5"
                  >
                    {submitting ? <ClipLoader color="#d7e6f4" size={18} /> : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={handleDetailChange}>
        <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-0.75rem)] max-w-[calc(100vw-0.75rem)] flex-col gap-3 overflow-hidden border-primary/30 p-3 shadow-none sm:max-w-4xl sm:p-5 lg:max-w-5xl xl:max-w-6xl">
          <DialogHeader className="shrink-0 border-b border-slate-200 pb-3 pr-8 text-left">
            <DialogTitle className="break-all text-left text-lg sm:text-xl">
              Ticket {selectedTicket?.number || ""}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(92dvh-8.5rem)] min-h-0 overflow-y-auto pr-1">
            {detailLoading ? (
              <div className="flex justify-center py-16">
                <ClipLoader color="#00264d" size={48} />
              </div>
            ) : selectedTicket ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Fact label="Number">{selectedTicket.number || "—"}</Fact>
                  <Fact label="Raised on">
                    {formatSupportDate(selectedTicket.createdAt) || "—"}
                  </Fact>
                  <Fact label="Updated" className="sm:col-span-2">
                    {formatSupportDate(
                      selectedTicket.updatedAt ||
                        selectedTicket.updated_at ||
                        selectedTicket.modifiedAt,
                    ) || "—"}
                  </Fact>
                  <Fact label="Subject" className="sm:col-span-2">
                    {selectedTicket.subject || "—"}
                  </Fact>
                  <Fact label="Description" className="sm:col-span-2">
                    <p className="whitespace-pre-wrap">
                      {selectedTicket.description || "—"}
                    </p>
                  </Fact>
                  <Fact label="Priority">
                    <Badge
                      value={
                        PRIORITY_LABEL[selectedTicket.priority] ||
                        selectedTicket.priority ||
                        "Medium"
                      }
                      map={priorityClass}
                      dotMap={priorityDot}
                    />
                  </Fact>
                  <Fact label="Status">
                    <Badge
                      value={
                        STATUS_LABEL[selectedTicket.status] ||
                        selectedTicket.status ||
                        "Open"
                      }
                      map={statusClass}
                      dotMap={statusDot}
                    />
                  </Fact>
                  <Fact label="Remark" className="sm:col-span-2">
                    <p className="whitespace-pre-wrap">{selectedTicket.remark || "—"}</p>
                  </Fact>
                  {/* <Fact label="Screenshots" className="sm:col-span-2">
                    {selectedTicket.screenshots?.length ? (
                      <ImageGrid files={selectedTicket.screenshots} preview />
                    ) : (
                      <p className="text-slate-500">No screenshots</p>
                    )}
                  </Fact> */}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Messages
                  </p>
                  {messages.length ? (
                    <div className="flex flex-col gap-2">
                      {messages.map((item) => {
                        const fromStaff = item.side === "staff";
                        const name = item.authorName || (fromStaff ? "Staff" : "You");
                        return (
                          <div
                            key={item.id}
                            className={`flex w-full items-end gap-2 ${
                              fromStaff ? "justify-start" : "justify-end"
                            }`}
                          >
                            {fromStaff ? (
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold uppercase text-white">
                                {String(name).charAt(0)}
                              </span>
                            ) : null}
                            <div
                              className={`w-fit max-w-[92%] rounded-md border px-3 py-2 text-sm sm:max-w-[70%] ${
                                fromStaff
                                  ? "self-start border-slate-200 bg-slate-50"
                                  : "self-end border-primary/20 bg-white"
                              }`}
                            >
                              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="break-words font-semibold">{name}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {formatSupportDate(item.createdAt)}
                                </span>
                              </p>
                              {item.message ? (
                                <p className="mt-0.5 whitespace-pre-wrap break-words">
                                  {item.message}
                                </p>
                              ) : null}
                              <div className="mt-2">
                                <ImageGrid files={item.screenshots || []} preview />
                              </div>
                            </div>
                            {!fromStaff ? (
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[11px] font-semibold uppercase text-slate-700">
                                {String(name).charAt(0)}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-muted-foreground">
                      No messages
                    </p>
                  )}
                </div>

                {selectedTicket.status === "CLOSED" ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    This ticket is closed. You can still read it.
                  </p>
                ) : (
                  <Form {...replyForm}>
                    <form
                      autoComplete="off"
                      className="flex flex-col gap-2 border-t border-slate-200 pt-3"
                      onSubmit={replyForm.handleSubmit(handleSendReply)}
                    >
                      <TextareaField
                        control={replyForm.control}
                        name="message"
                        label="Reply"
                        placeholder="Write a reply"
                        rows={4}
                        maxLength={4000}
                      />
                      <p className="text-right text-xs text-muted-foreground">
                        {(replyForm.watch("message") || "").length}/4000 characters
                      </p>
                      <ImageGrid files={replyFiles} onRemove={removeReplyFile} />
                      <input
                        ref={replyInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                        multiple
                        className="hidden"
                        onChange={(event) => readPickedFiles(event, addReplyFiles)}
                      />
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => replyInputRef.current?.click()}
                        >
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Add screenshots
                        </Button>
                        <Button
                          type="submit"
                          disabled={replySubmitting}
                          className="w-full sm:w-auto sm:min-w-[130px]"
                        >
                          {replySubmitting ? (
                            <ClipLoader color="#d7e6f4" size={18} />
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send reply
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            ) : null}
          </div>
          <DialogFooter className="shrink-0 flex-row justify-end border-t border-slate-200 pt-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleDetailChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SuccessMessage
        successMessage={successText}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};

export default Support;