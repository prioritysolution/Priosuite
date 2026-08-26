// "use client";
// import NavbarContainer from "../../container/navbar";
// import SidebarContainer from "../../container/sidebar";
// import FooterContainer from "../../container/footer";
// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import getCookieData from "../../utils/getCookieData";
// import useAutoLogout from "../../utils/useAutoLogout.jsx";
// import usePreventNumberScroll from "../../utils/usePreventNumberInput";
// import { useDispatch } from "react-redux";
// import { beg_date } from "../../container/auth/login/LoginReducer";

// const DashboardLayout = ({ children }) => {
//   const { SessionTimeoutModal } = useAutoLogout();
//   usePreventNumberScroll();

//   const token = getCookieData("prioBankClientToken");
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleResize = useCallback(() => {
//     if (window.innerWidth >= 1024) setSidebarOpen(false);
//   }, []);

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [handleResize]);

//   useEffect(() => {
//     const beg_date_from_cookie = getCookieData("beg_date");
//     if (beg_date_from_cookie) {
//       const begDateObj = new Date(beg_date_from_cookie);
//       const formattedDate = begDateObj.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//       dispatch(beg_date(formattedDate));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (!token) router.push("/login");
//   }, [token, router]);

//   return (
//     <div className="flex h-full w-full overflow-hidden bg-gray-100">
//       <SessionTimeoutModal />
//       {/* ── Mobile backdrop overlay ── */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* ── SIDEBAR ── full viewport height, fixed on mobile / relative on desktop ── */}
//       <aside
//         className={`
//           fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0
//           transform transition-transform duration-300 ease-in-out
//           lg:relative lg:translate-x-0 lg:flex lg:flex-col
//           ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         <SidebarContainer onClose={() => setSidebarOpen(false)} />
//       </aside>

//       {/* ── RIGHT COLUMN ── navbar + content + footer ── */}
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         {/* Navbar — fixed height, perfectly aligned with sidebar logo area */}
//         <NavbarContainer onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

//         {/* Scrollable main content */}
//         <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
//           {/* p-3 sm:p-4 lg:p-5 */}
//           <div className="w-full h-full  sm:p-4">{children}</div>
//         </main>

//         {/* Footer */}
//         <FooterContainer />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

"use client";
import NavbarContainer from "../../container/navbar";
import SidebarContainer from "../../container/sidebar";
import FooterContainer from "../../container/footer";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import getCookieData from "../../utils/getCookieData";
import useAutoLogout from "../../utils/useAutoLogout.jsx";
import usePreventNumberScroll from "../../utils/usePreventNumberInput";
import { useDispatch } from "react-redux";
import { beg_date } from "../../container/auth/login/LoginReducer";

const DashboardLayout = ({ children }) => {
  const { SessionTimeoutModal } = useAutoLogout();
  usePreventNumberScroll();

  const token = getCookieData("prioBankClientToken");
  const router = useRouter();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const beg_date_from_cookie = getCookieData("beg_date");
    if (beg_date_from_cookie) {
      const begDateObj = new Date(beg_date_from_cookie);
      const formattedDate = begDateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      dispatch(beg_date(formattedDate));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-100">
      <SessionTimeoutModal />

      {/* ── Mobile backdrop overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── full viewport height, fixed on mobile / relative on desktop ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SidebarContainer onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── RIGHT COLUMN ── navbar + content + footer ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Navbar — fixed height, perfectly aligned with sidebar logo area */}
        <NavbarContainer onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* Scrollable main content — ONLY this scrolls, not the page */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="w-full h-full min-h-0 p-2 sm:p-4">{children}</div>
        </main>

        {/* Footer */}
        <FooterContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;
