import React, { useState, useEffect, useRef } from 'react';

const Pomodoro: React.FC = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(workTime);
  const intervalRef = useRef<number | null>(null);
  const workAudioRef = useRef<HTMLAudioElement>(null);
  const breakAudioRef = useRef<HTMLAudioElement>(null);

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
      const newIsWorking = !isWorking;
      setIsWorking(newIsWorking);
      setTimeRemaining(newIsWorking ? workTime : breakTime);
      if (newIsWorking && breakAudioRef.current) {
        breakAudioRef.current.play();
      } else if (!newIsWorking && workAudioRef.current) {
        workAudioRef.current.play();
      }
    }
  }, [timeRemaining, isWorking, workTime, breakTime]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center transition-colors duration-200">
      <h1
        className={`text-3xl font-bold mb-4 ${
          isWorking
            ? 'text-red-600 dark:text-red-400'
            : 'text-green-600 dark:text-green-400'
        }`}
      >
        {isWorking ? 'Work Time' : 'Break Time'}
      </h1>
      <div className="timer text-6xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {formatTime(timeRemaining)}
      </div>
      <div className="controls">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400'
              : 'bg-green-500 hover:bg-green-600 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-400'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
      <audio ref={workAudioRef}>
        <source src="/path/to/work-end-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={breakAudioRef}>
        <source src="/path/to/break-end-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Pomodoro;
