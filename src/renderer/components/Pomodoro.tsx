import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

const Pomodoro: React.FC = () => {
  const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(workTime);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const startTimer = () => {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    };

    const stopTimer = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };

    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }

    return stopTimer;
  }, [isRunning]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsWorking(!isWorking);
      setTimeRemaining(isWorking ? breakTime : workTime);
    }
  }, [timeRemaining, isWorking, workTime, breakTime]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="">
      <h1>{isWorking ? 'Work Time' : 'Break Time'}</h1>
      <div className="timer">{formatTime(timeRemaining)}</div>
      <div className="controls">
        <button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
      </div>
    </div>
  );
};

export default Pomodoro;