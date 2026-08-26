"use client";
import Image from "next/image";
import getCookieData from "../utils/getCookieData";
// import getCookieData from "@/utils/getCookieData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

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
    // <main className="min-h-screen w-full flex items-center justify-center bg-secondary">
    //   <ClipLoader color="#00264d" size={100} speedMultiplier={0.7} />
    // </main>
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
