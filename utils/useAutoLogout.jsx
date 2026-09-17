"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import getCookieData from "@/utils/getCookieData";
import { useLogout } from "@/container/navbar/Hooks";
import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";
import toast from "react-hot-toast";


const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes
const DIALOG_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export default function useAutoLogout() {
  const { postLogoutApiCall } = useLogout();
  const [showModal, setShowModal] = useState(false);
  const inactivityTimer = useRef(null);
  const modalTimer = useRef(null);

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
    if (showModal) {
      if (modalTimer.current) clearTimeout(modalTimer.current);
      modalTimer.current = setTimeout(() => {
        logout();
      }, DIALOG_TIMEOUT);
    } else {
      if (modalTimer.current) {
        clearTimeout(modalTimer.current);
        modalTimer.current = null;
      }
    }
    return () => {
      if (modalTimer.current) clearTimeout(modalTimer.current);
    };
  }, [showModal, logout]);

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    const resetAndTrack = () => {
      if (getCookieData("prioBankClientToken") && !showModal) {
        resetTimer();
      }
    };

    events.forEach((event) => window.addEventListener(event, resetAndTrack));
    resetTimer();

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetAndTrack),
      );
    };
  }, [resetTimer, showModal]);

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
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const id = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(id);
    }, []);

    const handleStayLoggedInWithPassword = async () => {
      if (!password.trim()) {
        setError("Please enter your password.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const valid = await verifyPassword(password);
        if (valid) {
          toast.success("Session extended. Welcome back!");
          setPassword("");
          setShowModal(false);
          resetTimer();
        } else {
          setError("Incorrect password. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Session Timeout
            </h3>
            <p className="text-xs text-gray-400 mb-3 tabular-nums">
              {currentTime.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              ·{" "}
              {currentTime.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Your session is about to expire due to inactivity. Enter your
              password to stay logged in.
            </p>

            <div className="w-full mb-1 text-left">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="one-time-code"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !isLoading &&
                    handleStayLoggedInWithPassword()
                  }
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoFocus
                  className={`w-full px-3 py-2.5 pr-10 text-sm rounded-lg border text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                    error ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="cursor-pointer w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg
                      className="cursor-pointer w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <p
                className={`mt-1.5 text-xs transition-all ${
                  error ? "text-red-500 opacity-100" : "opacity-0"
                }`}
              >
                {error || ""}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                onClick={handleStayLoggedInWithPassword}
                disabled={isLoading}
                className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Stay logged in"
                )}
              </button>
              <button
                onClick={logout}
                className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-lg transition-all"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return { SessionTimeoutModal };
}
