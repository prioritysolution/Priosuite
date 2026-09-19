// import { Open_Sans } from "next/font/google";
// import "./globals.css";
// import { ModalProvider } from "../utils/ContextProvider";
// import { ReduxProvider } from "../redux/ReduxProvider";
// import ToasterProvider from "../common/ToasterProvider";
// import DevToolsProtection from "./DevToolsProtection";

// const style = Open_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800"],
// });

// export const metadata = {
//   title: "PrioSuite",
//   description: "PrioSuite, Smart Banking for Co-operatives",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={style.className} suppressHydrationWarning>
//         <ToasterProvider>
//           <main className="h-full w-full overflow-hidden">
//             {/* <DevToolsProtection /> */}
//             <ReduxProvider>
//               <ModalProvider>{children}</ModalProvider>
//             </ReduxProvider>
//           </main>
//         </ToasterProvider>
//       </body>
//     </html>
//   );
// }

import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "../utils/ContextProvider";
import { ReduxProvider } from "../redux/ReduxProvider";
import ToasterProvider from "../common/ToasterProvider";
import I18nProvider from "../common/I18nProvider";
import PageLoadProvider from "../common/loader/PageLoadProvider";
import DevToolsProtection from "./DevToolsProtection";

const style = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "PrioSuite",
  description: "PrioSuite, Smart Banking for Co-operatives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
      <body
        className={`${style.className} h-full overflow-hidden`}
        suppressHydrationWarning
      >
        <ToasterProvider>
          <main className="h-screen w-full overflow-hidden">
            {/* <DevToolsProtection /> */}
            <I18nProvider>
              <ReduxProvider>
                <PageLoadProvider>
                  <ModalProvider>{children}</ModalProvider>
                </PageLoadProvider>
              </ReduxProvider>
            </I18nProvider>
          </main>
        </ToasterProvider>
      </body>
    </html>
  );
}
