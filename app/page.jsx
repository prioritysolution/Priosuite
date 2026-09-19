"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";
import getCookieData from "@/utils/getCookieData";
import CentralLoader from "@/common/loader/CentralLoader";

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

  return <CentralLoader fullScreen />;
}

export default function Home() {
  return (
    <Suspense fallback={<CentralLoader fullScreen />}>
      <HomeInner />
    </Suspense>
  );
}
