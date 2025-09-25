import React, { useState, useEffect, useRef } from 'react';

interface StopwatchProps {
  onTimeUpdate: (time: number) => void;
  onComplete: (time: number) => void;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Stopwatch: React.FC<StopwatchProps> = ({ onTimeUpdate, onComplete }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  // FIX: Use ReturnType<typeof setInterval> for the ref type. This is a portable way to type interval IDs
  // that works in both browser and Node.js environments, resolving the NodeJS namespace error.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };
  
  const handleFinish = () => {
    setIsActive(false);
    onComplete(time);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black/30 p-4 rounded-md h-full">
      <p className="text-gray-400 text-sm uppercase font-semibold">Chronometer</p>
      <div className="text-5xl font-bold my-2 text-matrix-green">{formatTime(time)}</div>
      <div className="flex space-x-3 mt-2">
        <button
          onClick={handleToggle}
          className={`w-24 px-4 py-2 rounded-md font-semibold text-white transition-colors ${isActive ? 'bg-yellow-700 hover:bg-yellow-600' : 'bg-green-800 hover:bg-green-700'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={handleFinish}
          className="w-32 bg-matrix-green hover:bg-green-400 text-black font-bold py-2 px-4 rounded-md shadow-md transform hover:-translate-y-0.5 transition-all"
        >
          I'm Finished
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;