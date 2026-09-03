'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string; // ISO date string
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    function calculateTimeLeft(): TimeLeft {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="w-full py-6 flex justify-center items-center">
        <div className="h-20 w-full max-w-xs bg-white/40 animate-pulse rounded-2xl" />
      </div>
    );
  }

  const timeBlocks = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <section className="w-full max-w-md mx-auto my-6 px-4">
      <div className="text-center mb-3">
        <p className="text-xs uppercase tracking-[0.25em] text-lavender-700 font-medium">
          Cuenta Regresiva
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-glass">
        {timeBlocks.map((block, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl bg-gradient-to-b from-white/90 to-lavender-50/80 border border-gold/20 shadow-sm"
          >
            <span className="font-heading text-2xl sm:text-3xl font-semibold text-plum tracking-tight">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-light text-plum/70 uppercase tracking-widest mt-0.5">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
