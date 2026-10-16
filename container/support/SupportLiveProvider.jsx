"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSupportRealtimeAPI, supportApiKey } from "./SupportApis";
import {
  SUPPORT_KEYS,
  readJsonList,
  readSupportSession,
} from "./supportSession";

const SupportLiveContext = createContext(null);

const noticeText = (value, max) => {
  if (typeof value !== "string") return "";
  const text = value.replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim();
  if (!text || /data:image|\/storage\//i.test(text)) return "";
  return text.slice(0, max);
};

const playChime = () => {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.value = 0.04;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.24);
  } catch {
    /* sound is optional */
  }
};

export const SupportLiveProvider = ({ children }) => {
  const router = useRouter();
  const [unread, setUnread] = useState([]);
  const [notices, setNotices] = useState([]);
  const [ready, setReady] = useState(false);
  const openNumberRef = useRef("");
  const unreadRef = useRef([]);
  const noticesRef = useRef([]);
  const listenersRef = useRef(new Set());
  const echoRef = useRef(null);
  const ticketChannelRef = useRef("");
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);
  const waitingRef = useRef(new Set());
  const timerRef = useRef(0);
  const pendingNumberRef = useRef("");

  const persist = useCallback((nextUnread, nextNotices) => {
    localStorage.setItem(SUPPORT_KEYS.unread, JSON.stringify(nextUnread));
    localStorage.setItem(SUPPORT_KEYS.notices, JSON.stringify(nextNotices.slice(0, 20)));
  }, []);

  const remember = useCallback(
    (nextUnread, nextNotices) => {
      unreadRef.current = nextUnread;
      noticesRef.current = nextNotices;
      setUnread(nextUnread);
      setNotices(nextNotices);
      persist(nextUnread, nextNotices);
    },
    [persist],
  );

  const clearTicket = useCallback(
    (number) => {
      if (!number) return;
      remember(
        unreadRef.current.filter((item) => item !== number),
        noticesRef.current.filter((item) => item.number !== number),
      );
    },
    [remember],
  );

  const markAllRead = useCallback(() => {
    remember(
      [],
      noticesRef.current.map((item) => ({ ...item, unread: false })),
    );
  }, [remember]);

  const setOpenNumber = useCallback((number) => {
    openNumberRef.current = number || "";
  }, []);

  const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const openTicket = useCallback(
    (number) => {
      if (!number) return;
      clearTicket(number);
      setOpenNumber(number);
      sessionStorage.setItem("supportOpenTicket", number);
      router.push("/support");
      window.dispatchEvent(new CustomEvent("support-open-ticket", { detail: number }));
    },
    [clearTicket, router, setOpenNumber],
  );

  const showInAppToast = useCallback(
    (title, body, number) => {
      toast.custom(
        (item) => (
          <div className="max-w-sm rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-left">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            {body ? <p className="mt-1 text-xs text-slate-600">{body}</p> : null}
            <button
              type="button"
              className="mt-2 text-xs font-semibold text-[#00264D]"
              onClick={() => {
                toast.dismiss(item.id);
                openTicket(number);
              }}
            >
              Open ticket
            </button>
          </div>
        ),
        { duration: 6000 },
      );
    },
    [openTicket],
  );

  useEffect(() => {
    const savedUnread = readJsonList(SUPPORT_KEYS.unread, []);
    const savedNotices = readJsonList(SUPPORT_KEYS.notices, []);
    unreadRef.current = savedUnread;
    noticesRef.current = savedNotices;
    setUnread(savedUnread);
    setNotices(savedNotices);
    setReady(true);
  }, []);

  useEffect(() => {
    const unlock = () => {
      unlockedRef.current = true;
      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      }
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    return () => document.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let customerChannel = "";

    const disconnect = () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
      ticketChannelRef.current = "";
    };

    const emitRefresh = () => {
      const sections = [...waitingRef.current];
      const number = pendingNumberRef.current;
      waitingRef.current.clear();
      const payload = { refresh: sections, number };
      listenersRef.current.forEach((listener) => listener(payload));
    };

    const recentCountRef = new Map();

    const onSignal = (event) => {
      const number = event?.number ? String(event.number) : "";
      const shouldCount = event?.sound === true || event?.sound === "true" || event?.sound === 1;
      for (const section of event?.refresh || []) waitingRef.current.add(section);
      if (number) pendingNumberRef.current = number;
      if (shouldCount && number) waitingRef.current.add("tickets");

      const lookingAtIt = Boolean(number) && number === String(openNumberRef.current || "");
      const now = Date.now();
      const lastCounted = recentCountRef.get(number) || 0;
      const fresh = !number || now - lastCounted > 400;
      if (shouldCount && number && !lookingAtIt && fresh) {
        recentCountRef.set(number, now);
        const title = noticeText(event.title, 120);
        const body = noticeText(event.body, 240);
        const row = {
          id: number,
          number,
          title,
          body,
          at: Date.now(),
          unread: true,
        };
        const nextUnread = [...unreadRef.current, number];
        const nextNotices = [row, ...noticesRef.current.filter((item) => item.id !== row.id)].slice(0, 20);
        remember(nextUnread, nextNotices);

        const hidden = document.visibilityState === "hidden";
        const canNotify =
          hidden && typeof Notification !== "undefined" && Notification.permission === "granted";
        if (canNotify) {
          const popup = new Notification(title || "Support update", {
            body: body || undefined,
            tag: number,
            renotify: true,
            silent: false,
          });
          popup.onclick = () => {
            window.focus();
            popup.close();
            openTicket(number);
          };
        } else {
          if (unlockedRef.current && audioRef.current) {
            audioRef.current.play().catch(() => playChime());
          } else if (unlockedRef.current) {
            playChime();
          }
          showInAppToast(title || "Support update", body, number);
        }
      }
      if (lookingAtIt) clearTicket(number);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(emitRefresh, 300);
    };

    const connect = async () => {
      disconnect();
      const session = readSupportSession();
      if (!session.token || !session.phone || !supportApiKey()) return;
      const realtime = await getSupportRealtimeAPI(session.phone, session.token);
      if (cancelled || !realtime.success || !realtime.data) return;

      const data = realtime.data;
      audioRef.current = data.soundUrl ? new Audio(data.soundUrl) : null;
      const echoModule = await import("laravel-echo");
      const pusherModule = await import("pusher-js");
      if (cancelled) return;
      const Echo = echoModule.default || echoModule;
      const Pusher = pusherModule.default || pusherModule;
      window.Pusher = Pusher;

      const echo = new Echo({
        broadcaster: data.broadcaster || "reverb",
        key: data.key,
        wsHost: data.host,
        wsPort: Number(data.port),
        wssPort: Number(data.port),
        forceTLS: data.scheme === "https",
        enabledTransports: data.scheme === "https" ? ["wss"] : ["ws"],
        disableStats: true,
        authorizer: (channel) => ({
          authorize: (socketId, callback) => {
            const current = readSupportSession();
            fetch(data.authEndpoint, {
              method: "POST",
              credentials: "omit",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Api-Key": supportApiKey(),
                "X-Client-Token": current.token,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
                phone: current.phone,
              }),
            })
              .then((response) => response.json())
              .then((auth) => callback(null, auth))
              .catch((error) => callback(error));
          },
        }),
      });

      echoRef.current = echo;
      customerChannel = data.customerChannel;
      if (customerChannel) {
        echo.private(customerChannel).listen(".signal", onSignal);
      }
    };

    const joinTicket = async (number) => {
      const echo = echoRef.current;
      const session = readSupportSession();
      if (!echo || !number || !session.token) return;
      if (ticketChannelRef.current) {
        echo.leave(ticketChannelRef.current);
        ticketChannelRef.current = "";
      }
      const realtime = await getSupportRealtimeAPI(session.phone, session.token, number);
      if (cancelled || !realtime.success || !realtime.data?.ticketChannel) return;
      ticketChannelRef.current = realtime.data.ticketChannel;
      echo.private(realtime.data.ticketChannel).listen(".signal", onSignal);
    };

    const onOpenTicket = (event) => {
      const number = event?.detail || "";
      if (!number) {
        if (echoRef.current && ticketChannelRef.current) {
          echoRef.current.leave(ticketChannelRef.current);
          ticketChannelRef.current = "";
        }
        return;
      }
      joinTicket(number);
    };
    const onSession = () => {
      connect();
    };
    const onSignOut = () => {
      disconnect();
      unreadRef.current = [];
      noticesRef.current = [];
      setUnread([]);
      setNotices([]);
    };

    connect();
    window.addEventListener("support-session-saved", onSession);
    window.addEventListener("support-signout", onSignOut);
    window.addEventListener("support-open-ticket", onOpenTicket);
    window.addEventListener("support-join-ticket", onOpenTicket);

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      window.removeEventListener("support-session-saved", onSession);
      window.removeEventListener("support-signout", onSignOut);
      window.removeEventListener("support-open-ticket", onOpenTicket);
      window.removeEventListener("support-join-ticket", onOpenTicket);
      disconnect();
    };
  }, [clearTicket, openTicket, remember, showInAppToast]);

  const value = useMemo(
    () => ({
      ready,
      unread,
      notices,
      unreadCount: unread.length,
      clearTicket,
      markAllRead,
      setOpenNumber,
      subscribe,
      openTicket,
    }),
    [ready, unread, notices, clearTicket, markAllRead, setOpenNumber, subscribe, openTicket],
  );

  return (
    <SupportLiveContext.Provider value={value}>{children}</SupportLiveContext.Provider>
  );
};

export const useSupportLive = () => {
  const context = useContext(SupportLiveContext);
  if (context) return context;
  return {
    ready: false,
    unread: [],
    notices: [],
    unreadCount: 0,
    clearTicket: () => {},
    markAllRead: () => {},
    setOpenNumber: () => {},
    subscribe: () => () => {},
    openTicket: () => {},
  };
};
