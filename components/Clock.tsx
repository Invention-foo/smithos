import React, { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <ClockIcon className="w-5 h-5" />
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
}
