"use client";

import { collectDeviceInfo, fetchClientIp } from "@/utils/deviceId";
import { useEffect, useState } from "react";

const DeviceCheckingPage = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const snapshot = collectDeviceInfo();
    setInfo(snapshot);

    fetchClientIp()
      .then((ip) => {
        setInfo((current) => ({ ...(current || snapshot), user_ip: ip }));
      })
      .catch(() => {
        setInfo((current) => current || snapshot);
      });
  }, []);

  return (
    <pre className="h-full w-full overflow-auto bg-white p-4 text-left text-sm text-black">
      {info ? JSON.stringify(info, null, 2) : ""}
    </pre>
  );
};

export default DeviceCheckingPage;
