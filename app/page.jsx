"use client";

import { useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";
import getCookieData from "@/utils/getCookieData";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: "Strict",
  path: "/",
};

function applyAuthCookiesFromSearchParams(searchParams) {
  searchParams.forEach((value, key) => {
    if (!value || !key) return;
    const cookieKey = key.replace(/^priosuite_[^_]+_/i, "");
    Cookies.set(cookieKey, value, COOKIE_OPTIONS);
  });
}

function LoadingScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-gray-100">
      <Image
        src="/lodingImg.png"
        alt="Logo"
        width={300}
        height={300}
        className="object-contain"
        priority
      />
      <div className="flex items-center gap-4">
        <p className="text-gray-700 text-lg font-medium tracking-wide">
          Loading
        </p>
        <div className="flex items-center gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#1769c2] inline-block"
              style={{
                animation: "bounce-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasQuery = searchParams.toString().length > 0;

    if (hasQuery) {
      applyAuthCookiesFromSearchParams(searchParams);
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.pathname);
    }

    const token = getCookieData("prioBankClientToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    router.replace("/dashboard");
  }, [router, searchParams]);

  return <LoadingScreen />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeInner />
    </Suspense>
  );
}
