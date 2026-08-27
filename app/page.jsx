


"use client";

import Image from "next/image";
import getCookieData from "../utils/getCookieData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const token = getCookieData("prioBankClientToken");
  const isMainDash = Number(getCookieData("Is_Main_Dash"));

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [token, isMainDash, router]);

  return (
    <main className="min-h-dvh w-full flex items-center justify-center relative overflow-hidden bg-[#eef2f6] px-4 sm:px-6">
      {/* Soft brand wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#1769c2]/10 blur-3xl animate-wash-drift" />
        <div
          className="absolute -bottom-28 -right-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-[#1a3a5c]/10 blur-3xl animate-wash-drift"
          style={{ animationDelay: "1.4s", animationDirection: "reverse" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[320px] sm:max-w-[380px] flex flex-col items-center text-center animate-splash-in">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
          <div className="relative">
            <Image
              src="/pristlogo.png"
              alt="PrioSuite"
              width={64}
              height={64}
              className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative z-10 animate-logo-breathe"
              priority
            />
            {/* Soft glow pulse behind logo */}
            <div className="absolute inset-0 rounded-full bg-[#1769c2]/20 blur-md animate-logo-glow" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#1a3a5c] leading-none">
              Prio<span className="text-[#1769c2]">Suite</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="block h-[1.5px] w-5 sm:w-7 bg-[#1769c2] animate-tag-line" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[3px] text-[#1769c2]">
                CBS
              </span>
              <span
                className="block h-[1.5px] w-5 sm:w-7 bg-[#1769c2] animate-tag-line"
                style={{ animationDelay: "0.15s" }}
              />
            </div>
          </div>
        </div>

        <div className="relative mb-6 sm:mb-8">
          <Image
            src="/lodingImg.png"
            alt="Loading"
            width={280}
            height={280}
            className="object-contain w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] drop-shadow-sm animate-float"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-3.5">
          <p className="text-[#1a2e44] text-sm sm:text-base font-semibold tracking-wide animate-text-shimmer">
            Getting things ready
          </p>

          {/* Butter-smooth progress bar with shimmer */}
          <div className="relative w-40 sm:w-52 h-1.5 rounded-full bg-[#d7e3f0] overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#1769c2]/15 to-transparent animate-track-shimmer" />
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#1769c2] via-[#3b8dde] to-[#1769c2] bg-[length:200%_100%] animate-splash-progress" />
          </div>

          {/* Dot pulse */}
          <div className="flex items-center gap-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#1769c2] animate-splash-dot"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splash-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wash-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12px, -10px) scale(1.06); }
        }
        @keyframes logo-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes logo-glow {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes tag-line {
          0%, 100% { opacity: 0.5; transform: scaleX(0.85); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes text-shimmer {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @keyframes track-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splash-progress {
          0% { transform: translateX(-110%); background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { transform: translateX(310%); background-position: 0% 0%; }
        }
        @keyframes splash-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.7) translateY(0); }
          40% { opacity: 1; transform: scale(1.15) translateY(-2px); }
        }

        .animate-splash-in {
          animation: splash-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-wash-drift {
          animation: wash-drift 6s ease-in-out infinite;
        }
        .animate-logo-breathe {
          animation: logo-breathe 2.4s ease-in-out infinite;
        }
        .animate-logo-glow {
          animation: logo-glow 2.4s ease-in-out infinite;
        }
        .animate-tag-line {
          animation: tag-line 2.2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-text-shimmer {
          animation: text-shimmer 1.8s ease-in-out infinite;
        }
        .animate-track-shimmer {
          animation: track-shimmer 2s ease-in-out infinite;
        }
        .animate-splash-progress {
          animation: splash-progress 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-splash-dot {
          animation: splash-dot 1.1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-splash-in,
          .animate-wash-drift,
          .animate-logo-breathe,
          .animate-logo-glow,
          .animate-tag-line,
          .animate-float,
          .animate-text-shimmer,
          .animate-track-shimmer,
          .animate-splash-progress,
          .animate-splash-dot {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}