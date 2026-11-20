"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import getCookieData from "@/utils/getCookieData";
import { useLogout } from "@/container/navbar/Hooks";
import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Clock, LogOut, ShieldAlert } from "lucide-react";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes of inactivity before warning
const DIALOG_TIMEOUT_SECONDS = 5 * 60; // 5 minutes countdown in warning dialog

export default function useAutoLogout() {
  const { postLogoutApiCall } = useLogout();
  const [showModal, setShowModal] = useState(false);
  const inactivityTimer = useRef(null);
  const showModalRef = useRef(false);

  // Keep ref in sync to access in event listeners without re-subscribing
  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);

  const logout = useCallback(() => {
    setShowModal(false);
    postLogoutApiCall();
  }, [postLogoutApiCall]);

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setShowModal(true);
    }, INACTIVITY_LIMIT);
  }, []);

  useEffect(() => {
    // Capture phase event listeners ensure user activity is tracked across all elements,
    // even when another modal or portal is open.
    const events = [
      "mousemove",
      "keydown",
      "click",
      "mousedown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    const resetAndTrack = () => {
      if (getCookieData("prioBankClientToken") && !showModalRef.current) {
        resetTimer();
      }
    };

    events.forEach((event) =>
      window.addEventListener(event, resetAndTrack, { capture: true, passive: true }),
    );
    resetTimer();

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetAndTrack, { capture: true }),
      );
    };
  }, [resetTimer]);

  const verifyPassword = async (password) => {
    try {
      const res = await doPostApiCall({
        url: endPoints.ProcessCheckPassword,
        bodyData: { password },
      });
      if (
        res?.message === "Success" ||
        res?.status === 200 ||
        res?.message === "Data Found"
      ) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const SessionTimeoutModal = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DIALOG_TIMEOUT_SECONDS);
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Countdown timer while warning modal is open
    useEffect(() => {
      if (!showModal) {
        setSecondsLeft(DIALOG_TIMEOUT_SECONDS);
        return;
      }

      setSecondsLeft(DIALOG_TIMEOUT_SECONDS);
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Robust focus restoration: ensures the password input receives focus
      // even when an underlying dialog's focus trap tries to reclaim it.
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => {
        clearInterval(interval);
        clearTimeout(focusTimer);
      };
    }, [showModal]);

    // Safety guard: While the session timeout modal is open, prevent any other
    // background element from stealing focus away from this critical dialog.
    useEffect(() => {
      if (!showModal) return;

      const handleFocusIn = (e) => {
        const dialogEl = document.getElementById("session-timeout-dialog");
        if (dialogEl && !dialogEl.contains(e.target)) {
          e.stopImmediatePropagation();
          inputRef.current?.focus();
        }
      };

      // Ensure body pointer events remain enabled while this modal is active
      const originalPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = "auto";

      document.addEventListener("focusin", handleFocusIn, { capture: true });

      return () => {
        document.removeEventListener("focusin", handleFocusIn, { capture: true });
        document.body.style.pointerEvents = originalPointerEvents;
      };
    }, [showModal]);

    const handleStayLoggedInWithPassword = async () => {
      if (!password.trim()) {
        setError("Please enter your password to continue.");
        inputRef.current?.focus();
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const valid = await verifyPassword(password);
        if (valid) {
          toast.success("Session extended. Welcome back!");
          setPassword("");
          setError("");
          setShowModal(false);
          resetTimer();
        } else {
          setError("Incorrect password. Please verify and try again.");
          inputRef.current?.focus();
        }
      } catch {
        setError("Unable to verify password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!showModal || !mounted) return null;

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return (
      <RadixDialog.Root open={showModal} onOpenChange={() => {}}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay
            className="fixed inset-0 z-[9999999] bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
            style={{ pointerEvents: "auto" }}
          />
          <RadixDialog.Content
            id="session-timeout-dialog"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999999] w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-none"
            style={{ pointerEvents: "auto" }}
          >
            {/* Subtle decorative top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-primary to-amber-500" />

            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              {/* Shield Alert Icon */}
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4 text-amber-600 shadow-sm">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <RadixDialog.Title className="text-xl font-bold text-slate-900 tracking-tight">
                Session Timeout Warning
              </RadixDialog.Title>

              {/* Countdown Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Auto logout in{" "}
                  <span className="font-bold tabular-nums">{formattedCountdown}</span>
                </span>
              </div>

              <RadixDialog.Description className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
                Your session is about to expire due to inactivity. Enter your
                password to extend your session safely.
              </RadixDialog.Description>

              {/* Password Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isLoading) handleStayLoggedInWithPassword();
                }}
                className="w-full mt-6 text-left"
                autoComplete="off"
              >
                <label
                  htmlFor="session-timeout-password-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    ref={inputRef}
                    id="session-timeout-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your login password"
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white disabled:opacity-50 ${
                      error
                        ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/30"
                        : "border-slate-300 focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                    <span>•</span>
                    <span>{error}</span>
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying…</span>
                      </>
                    ) : (
                      "Stay Logged In"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </form>
            </div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  };

  return { SessionTimeoutModal };
}
