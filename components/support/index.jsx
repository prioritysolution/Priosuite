"use client";

import { useRef } from "react";
import { ClipLoader } from "react-spinners";
import { Eye, ImagePlus, Send, X } from "lucide-react";
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
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Urgent: "bg-red-100 text-red-700",
};

const statusClass = {
  Open: "bg-sky-100 text-sky-800",
  "In Progress": "bg-amber-100 text-amber-800",
  Closed: "bg-emerald-100 text-emerald-800",
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

const Badge = ({ value, map }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
      map[value] || "bg-slate-100 text-slate-700"
    }`}
  >
    {value || "—"}
  </span>
);

const ImageGrid = ({ files, onRemove }) => {
  if (!files?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {files.map((file) => (
        <div
          key={file.id || file.url || file.name}
          className="relative overflow-hidden rounded-md border border-primary/30 bg-white"
        >
          <img src={file.url} alt={file.name} className="h-20 w-full object-cover" />
          {onRemove ? (
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-slate-700 shadow"
              onClick={() => onRemove(file.id)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <p className="truncate px-1 py-1 text-[10px]">{file.name}</p>
        </div>
      ))}
    </div>
  );
};

const readPickedFiles = (event, onPick) => {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (files.length) onPick(files);
};

const UploadBox = ({ onPick }) => (
  <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-primary/50 bg-slate-50 px-3 py-4 text-center hover:bg-slate-100">
    <ImagePlus className="h-5 w-5 text-primary" />
    <span className="text-sm font-medium text-primary">Upload images</span>
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
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold">Support</h3>
        {projectName ? (
          <p className="text-sm text-muted-foreground -mt-2">{projectName}</p>
        ) : null}
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col gap-3">
          {pageError ? (
            <p className="text-sm text-center text-red-600">{pageError}</p>
          ) : (
            <div className="border border-primary rounded-lg p-3 sm:p-5 flex flex-col gap-4">
              <h4 className="text-center text-lg sm:text-xl font-semibold">Find Tickets</h4>
              <Form {...filterForm}>
                <form
                  autoComplete="off"
                  className="flex flex-col gap-3"
                  onSubmit={filterForm.handleSubmit(handleSearch)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
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
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <Button type="button" variant="outline" className="w-full sm:w-1/5" onClick={handleResetFilters}>
                      Reset
                    </Button>
                    <Button type="submit" className="w-full sm:w-1/5">
                      Search
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          <div className="border border-primary rounded-lg p-3 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="sm:flex-1">
                <h4 className="text-center text-lg sm:text-xl font-semibold">Previous Tickets</h4>
                {activePhone ? (
                  <p className="text-center text-xs text-muted-foreground">Phone {activePhone}</p>
                ) : null}
              </div>
              <Button
                type="button"
                className="w-full sm:w-1/5"
                disabled={Boolean(pageError)}
                onClick={handleOpenDialog}
              >
                Raise Ticket
              </Button>
            </div>

            {loading || listLoading ? (
              <div className="flex justify-center py-16">
                <ClipLoader color="#00264d" size={48} />
              </div>
            ) : (
              <div className="w-full overflow-x-auto border border-primary rounded-lg">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Ticket No</TableHead>
                      <TableHead className="text-left">Raised On</TableHead>
                      <TableHead className="text-left">Subject</TableHead>
                      <TableHead className="text-left">Priority</TableHead>
                      <TableHead className="text-left">Status</TableHead>
                      <TableHead className="text-left">Remark</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length ? (
                      tickets.map((ticket) => (
                        <TableRow
                          key={ticket.number}
                          className={
                            updatedNumbers.includes(ticket.number) ? "support-row-updated" : ""
                          }
                        >
                          <TableCell className="font-medium whitespace-nowrap">
                            <span className="inline-flex items-center gap-2">
                              {ticket.number}
                              {updatedNumbers.includes(ticket.number) ? (
                                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                                  New reply
                                </span>
                              ) : null}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatSupportDate(ticket.createdAt)}
                          </TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>
                            <Badge
                              value={PRIORITY_LABEL[ticket.priority] || ticket.priority}
                              map={priorityClass}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              value={STATUS_LABEL[ticket.status] || ticket.status}
                              map={statusClass}
                            />
                          </TableCell>
                          <TableCell className="max-w-[220px]">
                            <p className="line-clamp-2">{ticket.remark || "—"}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
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
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No tickets yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && !pageError ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing {listMeta.from} to {listMeta.to} of {listMeta.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canPageBack}
                    onClick={() => handlePageChange(listMeta.page - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {listMeta.page} of {pageCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canPageNext}
                    onClick={() => handlePageChange(listMeta.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-xl flex flex-col max-h-[min(92dvh,760px)] overflow-hidden p-4 sm:p-5 gap-3">
          <DialogHeader className="shrink-0">
            <DialogTitle>Raise Ticket</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto max-h-[calc(92dvh-7rem)] pr-1">
            <Form {...form}>
              <form
                autoComplete="off"
                className="flex flex-col gap-3 pr-3"
                onSubmit={form.handleSubmit(handleRaiseTicket)}
              >
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
                  <p className="text-sm font-medium">Attach Files</p>
                  <UploadBox onPick={addAttachments} />
                  <ImageGrid files={attachments} onRemove={removeAttachment} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full sm:w-1/5 self-end">
                  {submitting ? <ClipLoader color="#d7e6f4" size={18} /> : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={handleDetailChange}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-2xl lg:max-w-3xl flex flex-col max-h-[min(92dvh,820px)] overflow-hidden p-4 sm:p-6 gap-4">
          <DialogHeader className="shrink-0 pr-8 text-left">
            <DialogTitle className="break-all text-lg sm:text-xl">
              Ticket {selectedTicket?.number || ""}
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto max-h-[calc(92dvh-10rem)] pr-1">
            {detailLoading ? (
              <div className="flex justify-center py-16">
                <ClipLoader color="#00264d" size={48} />
              </div>
            ) : selectedTicket ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium">Priority</p>
                    <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {selectedTicket.priority || "MEDIUM"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium">Status</p>
                    <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {STATUS_LABEL[selectedTicket.status] || selectedTicket.status || "Open"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Remark</p>
                  <p className="text-sm whitespace-pre-wrap break-words text-muted-foreground">
                    {selectedTicket.remark || "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium">Screenshots</p>
                  {selectedTicket.screenshots?.length ? (
                    <ImageGrid files={selectedTicket.screenshots} />
                  ) : (
                    <p className="text-sm text-muted-foreground">No screenshots</p>
                  )}
                </div>

                {selectedTicket.subject || selectedTicket.description ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold break-words">{selectedTicket.subject}</p>
                    {selectedTicket.description ? (
                      <p className="text-sm whitespace-pre-wrap break-words text-muted-foreground">
                        {selectedTicket.description}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
                  <p className="text-sm font-semibold">Messages</p>
                  {messages.length ? (
                    messages.map((item) => {
                      const fromStaff = item.side === "staff";
                      return (
                        <div
                          key={item.id}
                          className={`w-fit max-w-[92%] sm:max-w-[75%] rounded-xl border px-3 py-2 text-sm ${
                            fromStaff
                              ? "self-start border-transparent bg-slate-100"
                              : "self-end border-slate-200 bg-white"
                          }`}
                        >
                          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-semibold break-words">
                              {item.authorName || (fromStaff ? "Staff" : "You")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatSupportDate(item.createdAt)}
                            </span>
                          </p>
                          {item.message ? (
                            <p className="mt-0.5 whitespace-pre-wrap break-words">{item.message}</p>
                          ) : null}
                          <div className="mt-2">
                            <ImageGrid files={item.screenshots || []} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No messages</p>
                  )}
                </div>

                {selectedTicket.status === "CLOSED" ? (
                  <p className="text-sm text-muted-foreground">
                    This ticket is closed. You can still read it.
                  </p>
                ) : (
                  <Form {...replyForm}>
                    <form
                      autoComplete="off"
                      className="flex flex-col gap-2"
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
                      <p className="text-xs text-muted-foreground">
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
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => replyInputRef.current?.click()}
                        >
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Add screenshots
                        </Button>
                        <Button type="submit" disabled={replySubmitting} className="w-full sm:w-auto">
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
          <DialogFooter className="shrink-0 flex-row justify-end border-t pt-3">
            <Button type="button" variant="outline" onClick={() => handleDetailChange(false)}>
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
