"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { formatDateForApi } from "@/utils/dateHelpers";
import {
  getSupportMessagesAPI,
  getSupportProjectAPI,
  getSupportTicketAPI,
  getSupportTicketListAPI,
  getSupportDomain,
  raiseSupportTicketAPI,
  sendSupportMessageAPI,
} from "./SupportApis";
import { useSupportLive } from "./SupportLiveProvider";
import {
  clearSupportToken,
  readLastSupportPhone,
  readSupportToken,
  saveSupportSession,
} from "./supportSession";

const MAX_IMAGES = 10;
const MAX_BYTES = 20 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i;

const isImageFile = (file) => {
  const type = String(file?.type || "").toLowerCase();
  if (IMAGE_TYPES.includes(type)) return true;
  return IMAGE_EXT.test(file?.name || "");
};

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CLOSED", label: "Closed" },
];

export const FILTER_PRIORITY_OPTIONS = [
  { value: "ALL", label: "All" },
  ...PRIORITY_OPTIONS,
];

const emptyMeta = { total: 0, page: 1, pageSize: 20, from: 0, to: 0 };

const STATUS_RANK = { OPEN: 0, IN_PROGRESS: 1, CLOSED: 2 };
const PRIORITY_RANK = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const sortTickets = (items) =>
  [...items].sort((left, right) => {
    const status = (STATUS_RANK[left.status] ?? 9) - (STATUS_RANK[right.status] ?? 9);
    if (status) return status;
    const priority = (PRIORITY_RANK[left.priority] ?? 9) - (PRIORITY_RANK[right.priority] ?? 9);
    if (priority) return priority;
    return String(left.createdAt || "").localeCompare(String(right.createdAt || ""));
  });

const formSchema = yup.object({
  customerName: yup
    .string()
    .trim()
    .required("Name is required")
    .max(150, "Name must be 150 characters or fewer"),
  customerPhone: yup
    .string()
    .trim()
    .required("Phone is required")
    .max(30, "Phone must be 30 characters or fewer")
    .matches(/^[0-9+\-()\s]+$/, "Enter a valid customer phone."),
  customerEmail: yup
    .string()
    .trim()
    .max(255, "Email must be 255 characters or fewer")
    .test("email", "Enter a valid email", (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),
  subject: yup
    .string()
    .trim()
    .required("Subject is required")
    .max(255, "Subject must be 255 characters or fewer"),
  issue: yup
    .string()
    .trim()
    .required("Issue is required")
    .max(4000, "Issue must be 4000 characters or fewer"),
  priority: yup.string().required("Priority is required"),
});

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read the image"));
    reader.readAsDataURL(file);
  });

const buildListQuery = (phone, filters, page) => {
  const params = new URLSearchParams({ phone, page: String(page), pageSize: "20" });
  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);
  if (filters.priority && filters.priority !== "ALL") {
    params.set("priority", filters.priority);
  }
  if (filters.status && filters.status !== "ALL") {
    params.set("status", filters.status);
  }
  const fromDate = formatDateForApi(filters.fromDate);
  const toDate = formatDateForApi(filters.toDate);
  if (fromDate) params.set("fromDate", fromDate);
  if (toDate) params.set("toDate", toDate);
  return params.toString();
};

const applyFieldErrors = (formApi, errors) => {
  if (!errors || typeof errors !== "object") return;
  const names = {
    customerName: "customerName",
    customerPhone: "customerPhone",
    customerEmail: "customerEmail",
    subject: "subject",
    description: "issue",
    priority: "priority",
    message: "message",
  };
  Object.entries(errors).forEach(([key, messages]) => {
    const name = names[key];
    const text = Array.isArray(messages) ? messages[0] : messages;
    if (name && text) formApi.setError(name, { type: "server", message: text });
  });
};

const cookiePhone = () => getCookieData("userMob") || getCookieData("userPhone") || "";
const cookieEmail = () => getCookieData("userMail") || "";

export const useSupport = () => {
  const live = useSupportLive();
  const domainRef = useRef("");
  const [projectName, setProjectName] = useState("");
  const [pageError, setPageError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [listMeta, setListMeta] = useState(emptyMeta);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const attachmentsRef = useRef([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successText, setSuccessText] = useState("Ticket raised successfully");
  const [activePhone, setActivePhone] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyFiles, setReplyFiles] = useState([]);
  const replyFilesRef = useRef([]);
  const [replySubmitting, setReplySubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      subject: "",
      issue: "",
      priority: "MEDIUM",
    },
  });

  const filterForm = useForm({
    defaultValues: {
      search: "",
      priority: "ALL",
      status: "ALL",
      fromDate: null,
      toDate: null,
    },
  });

  const replyForm = useForm({
    defaultValues: { message: "" },
  });

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    replyFilesRef.current = replyFiles;
  }, [replyFiles]);

  const releaseFiles = (items) => {
    items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
  };

  const tokenFor = (phone) => readSupportToken(domainRef.current, phone);

  const listPageRef = useRef(1);

  const loadTickets = async ({ phone, token, page, filters } = {}) => {
    const nextPage = page || listPageRef.current || 1;
    const nextPhone = phone || activePhone;
    const nextToken = token || tokenFor(nextPhone);
    if (!nextPhone || !nextToken) {
      setTickets([]);
      setListMeta(emptyMeta);
      return;
    }

    const currentFilters = filters || filterForm.getValues();
    listPageRef.current = nextPage;
    setListLoading(true);
    try {
      const res = await getSupportTicketListAPI(
        buildListQuery(nextPhone, currentFilters, nextPage),
        nextToken,
      );
      if (res.status === 401) {
        clearSupportToken();
        setTickets([]);
        setListMeta(emptyMeta);
        toast.error("Your support session expired. Raise a ticket again for this phone number.");
        return;
      }
      if (!res.success) {
        toast.error(res.message || "Unable to load tickets");
        return;
      }
      const data = res.data || {};
      setTickets(sortTickets(Array.isArray(data.items) ? data.items : []));
      setListMeta({
        total: Number(data.total) || 0,
        page: Number(data.page) || nextPage,
        pageSize: Number(data.pageSize) || 20,
        from: Number(data.from) || 0,
        to: Number(data.to) || 0,
      });
      setActivePhone(nextPhone);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const start = async () => {
      domainRef.current = getSupportDomain();

      const project = await getSupportProjectAPI();
      if (!active) return;
      if (!project.success) {
        setPageError(project.message || "Unable to load support");
        setLoading(false);
        return;
      }

      setProjectName(project.data?.name || "");
      const accountPhone = cookiePhone();
      const accountEmail = cookieEmail();
      if (accountPhone) form.setValue("customerPhone", accountPhone);
      if (accountEmail) form.setValue("customerEmail", accountEmail);
      const phone = readLastSupportPhone(domainRef.current) || accountPhone;
      const token = readSupportToken(domainRef.current, phone);
      if (phone && token) {
        setActivePhone(phone);
        await loadTickets({ phone, token, page: 1, filters: filterForm.getValues() });
      }
      if (active) setLoading(false);
    };

    const name = getCookieData("userName");
    if (name) form.setValue("customerName", name);
    start();

    return () => {
      active = false;
      releaseFiles(attachmentsRef.current);
      releaseFiles(replyFilesRef.current);
    };
    // Load the project and any saved phone session once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeImages = (fileList, current) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return current;

    const images = [];
    incoming.forEach((file) => {
      if (!isImageFile(file)) {
        toast.error("Use a PNG, JPG, WEBP, or GIF image");
        return;
      }
      if (file.size > MAX_BYTES) {
        toast.error("Each screenshot must be 20 MB or smaller.");
        return;
      }
      images.push(file);
    });
    if (!images.length) return current;

    const room = MAX_IMAGES - current.length;
    if (room <= 0) {
        toast.error("Attach up to 10 screenshots.");
      return current;
    }
    if (images.length > room) {
        toast.error("Attach up to 10 screenshots.");
    }

    const accepted = images.slice(0, room).map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
      name: file.name,
      file,
      url: URL.createObjectURL(file),
    }));
    return [...current, ...accepted];
  };

  const addAttachments = (fileList) => {
    setAttachments((current) => takeImages(fileList, current));
  };

  const removeAttachment = (id) => {
    setAttachments((current) => {
      const found = current.find((item) => item.id === id);
      if (found?.url) URL.revokeObjectURL(found.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const addReplyFiles = (fileList) => {
    setReplyFiles((current) => takeImages(fileList, current));
  };

  const removeReplyFile = (id) => {
    setReplyFiles((current) => {
      const found = current.find((item) => item.id === id);
      if (found?.url) URL.revokeObjectURL(found.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const resetTicketForm = () => {
    form.reset({
      customerName: getCookieData("userName") || "",
      customerPhone: cookiePhone() || activePhone || "",
      customerEmail: cookieEmail(),
      subject: "",
      issue: "",
      priority: "MEDIUM",
    });
    setAttachments((current) => {
      releaseFiles(current);
      return [];
    });
  };

  const handleOpenDialog = () => {
    resetTicketForm();
    setDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);
    if (!open) resetTicketForm();
  };

  const screenshotsFrom = async (items) =>
    Promise.all(
      items.map(async (item) => ({
        name: item.name,
        data: await fileToDataUrl(item.file),
      })),
    );

  const handleRaiseTicket = async (values) => {
    setSubmitting(true);
    try {
      const screenshots = await screenshotsFrom(attachments);
      const res = await raiseSupportTicketAPI({
        customerName: values.customerName.trim(),
        customerPhone: values.customerPhone.trim(),
        customerEmail: values.customerEmail.trim() || undefined,
        subject: values.subject.trim(),
        description: values.issue.trim(),
        priority: values.priority,
        screenshots: screenshots.length ? screenshots : undefined,
      });
      if (!res.success) {
        applyFieldErrors(form, res.errors);
        toast.error(res.message || "Unable to raise the ticket");
        return;
      }

      const phone = values.customerPhone.trim();
      if (res.data?.accessToken) {
        saveSupportSession({
          domain: domainRef.current || getSupportDomain(),
          phone,
          token: res.data.accessToken,
        });
      }
      setActivePhone(phone);
      setDialogOpen(false);
      resetTicketForm();
      setSuccessText(
        res.data?.number
          ? `Ticket ${res.data.number} raised successfully`
          : "Ticket raised successfully",
      );
      setShowSuccessMessage(true);
      const token = res.data?.accessToken || tokenFor(phone);
      if (token) {
        filterForm.reset({
          search: "",
          priority: "ALL",
          status: "ALL",
          fromDate: null,
          toDate: null,
        });
        await loadTickets({
          phone,
          token,
          page: 1,
          filters: {
            search: "",
            priority: "ALL",
            status: "ALL",
            fromDate: null,
            toDate: null,
          },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (values) => {
    const fromDate = formatDateForApi(values.fromDate);
    const toDate = formatDateForApi(values.toDate);
    if (fromDate && toDate && fromDate > toDate) {
      toast.error("From date cannot be after to date");
      return;
    }
    const phone = activePhone || form.getValues("customerPhone");
    const token = tokenFor(phone);
    if (!phone || !token) {
      toast.error("Raise a ticket with this phone number before searching tickets");
      return;
    }
    loadTickets({ phone, token, page: 1, filters: values });
  };

  const handleResetFilters = () => {
    const cleared = {
      search: "",
      priority: "ALL",
      status: "ALL",
      fromDate: null,
      toDate: null,
    };
    filterForm.reset(cleared);
    const token = tokenFor(activePhone);
    if (!activePhone || !token) return;
    loadTickets({ phone: activePhone, token, page: 1, filters: cleared });
  };

  const handlePageChange = (page) => {
    const token = tokenFor(activePhone);
    if (!activePhone || !token || page < 1) return;
    loadTickets({ phone: activePhone, token, page, filters: filterForm.getValues() });
  };

  const loadRef = useRef(loadTickets);
  loadRef.current = loadTickets;
  const activePhoneRef = useRef(activePhone);
  activePhoneRef.current = activePhone;
  const selectedRef = useRef(selectedTicket);
  selectedRef.current = selectedTicket;

  useEffect(() => {
    return live.subscribe(async (payload) => {
      const refresh = payload.refresh || [];
      const phone = activePhoneRef.current;
      const token = tokenFor(phone);
      if (!phone || !token) return;
      if (refresh.includes("tickets")) {
        await loadRef.current({ phone, token, page: listPageRef.current });
      }
      const open = selectedRef.current?.number;
      if (!open || payload.number !== open) return;
      if (refresh.includes("ticket")) {
        const detail = await getSupportTicketAPI(open, phone, token);
        if (detail.success) setSelectedTicket(detail.data);
      }
      if (refresh.includes("messages")) {
        const thread = await getSupportMessagesAPI(open, phone, token);
        if (thread.success && Array.isArray(thread.data)) setMessages(thread.data);
      }
    });
  }, [live]);

  const handleOpenTicket = async (ticket) => {
    if (!ticket?.number) return;
    live.clearTicket(ticket.number);
    live.setOpenNumber(ticket.number);
    window.dispatchEvent(
      new CustomEvent("support-join-ticket", { detail: ticket.number }),
    );

    const phone = activePhone || readLastSupportPhone(domainRef.current);
    const token = tokenFor(phone);
    if (!phone || !token) return;

    setDetailOpen(true);
    setDetailLoading(true);
    setSelectedTicket(null);
    setMessages([]);
    replyForm.reset({ message: "" });
    setReplyFiles((current) => {
      releaseFiles(current);
      return [];
    });

    try {
      const [detail, thread] = await Promise.all([
        getSupportTicketAPI(ticket.number, phone, token),
        getSupportMessagesAPI(ticket.number, phone, token),
      ]);
      if (detail.status === 401 || thread.status === 401) {
        clearSupportToken();
        setDetailOpen(false);
        toast.error("Your support session expired. Raise a ticket again for this phone number.");
        return;
      }
      if (!detail.success) {
        toast.error(detail.message || "Unable to open the ticket");
        setDetailOpen(false);
        return;
      }
      setSelectedTicket(detail.data);
      setMessages(thread.success && Array.isArray(thread.data) ? thread.data : []);
      if (!thread.success && thread.message) toast.error(thread.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSendReply = async (values) => {
    const message = String(values.message || "").trim();
    if (!message && !replyFiles.length) {
      toast.error("Write a message or attach an image");
      return;
    }
    if (!selectedTicket?.number) return;
    const phone = activePhone;
    const token = tokenFor(phone);
    if (!phone || !token) return;

    setReplySubmitting(true);
    try {
      const screenshots = await screenshotsFrom(replyFiles);
      const res = await sendSupportMessageAPI(selectedTicket.number, phone, token, {
        message: message || undefined,
        screenshots: screenshots.length ? screenshots : undefined,
      });
      if (!res.success) {
        applyFieldErrors(replyForm, res.errors);
        toast.error(res.message || "Unable to send the message");
        return;
      }
      replyForm.reset({ message: "" });
      setReplyFiles((current) => {
        releaseFiles(current);
        return [];
      });
      const thread = await getSupportMessagesAPI(selectedTicket.number, phone, token);
      if (thread.success && Array.isArray(thread.data)) setMessages(thread.data);
      toast.success("Message sent");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDetailChange = (open) => {
    setDetailOpen(open);
    if (!open) {
      live.setOpenNumber("");
      window.dispatchEvent(new CustomEvent("support-join-ticket", { detail: "" }));
    }
  };

  useEffect(() => {
    if (loading) return undefined;
    const openFromOutside = (number) => {
      if (!number) return;
      const phone = activePhone || readLastSupportPhone(domainRef.current);
      if (!phone || !tokenFor(phone)) return;
      sessionStorage.removeItem("supportOpenTicket");
      handleOpenTicket({ number });
    };
    const pending = sessionStorage.getItem("supportOpenTicket");
    if (pending) openFromOutside(pending);
    const onEvent = (event) => openFromOutside(event.detail);
    window.addEventListener("support-open-ticket", onEvent);
    return () => window.removeEventListener("support-open-ticket", onEvent);
    // Open a ticket requested by the header bell or a notification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activePhone]);

  const pageCount = Math.max(1, Math.ceil((listMeta.total || 0) / (listMeta.pageSize || 20)));

  return {
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
    priorityOptions: PRIORITY_OPTIONS,
    statusOptions: STATUS_OPTIONS,
    filterPriorityOptions: FILTER_PRIORITY_OPTIONS,
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
    updatedNumbers: live.unread,
    handleCloseSuccessMessage: () => setShowSuccessMessage(false),
  };
};
