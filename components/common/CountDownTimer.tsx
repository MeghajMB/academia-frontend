"use client";

import Countdown from "react-countdown";

interface CountdownProps {
  targetDate: string;
}

const CountDownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const targetTime = new Date(targetDate).getTime();

  return (
    <Countdown
      date={targetTime}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
          return <span className="text-red-500 font-semibold">Expired</span>;
        }

        if (days > 0) return <span>{days}d {hours}h</span>;
        if (hours > 0) return <span>{hours}h {minutes}m</span>;
        if (minutes > 0) return <span>{minutes}m</span>;
        return <span>{seconds}s</span>;
      }}
    />
  );
};

export default CountDownTimer;
