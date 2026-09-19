"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CentralLoader from "./CentralLoader";

function PageLoadWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);
  const isFirstRoute = useRef(true);

  // Full page first paint
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  // Client route / query changes
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

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
