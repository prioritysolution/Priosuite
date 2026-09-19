"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CentralLoader from "./CentralLoader";

function PageLoadWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);
  const isFirstRoute = useRef(true);
  const hideTimer = useRef(null);

  const showLoader = (ms = 500) => {
    setVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), ms);
  };

  // Full page first paint
  useEffect(() => {
    showLoader(400);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Show on every route / query change
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    showLoader(550);
  }, [pathname, searchParams]);

  // Immediate feedback when user clicks an internal link
  useEffect(() => {
    const onClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (anchor.target === "_blank" || event.metaKey || event.ctrlKey) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }
        showLoader(800);
      } catch {
        // ignore invalid urls
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!visible) return null;

  return <CentralLoader fullScreen />;
}

const PageLoadProvider = ({ children }) => {
  return (
    <>
      <Suspense fallback={<CentralLoader fullScreen />}>
        <PageLoadWatcher />
      </Suspense>
      {children}
    </>
  );
};

export default PageLoadProvider;
