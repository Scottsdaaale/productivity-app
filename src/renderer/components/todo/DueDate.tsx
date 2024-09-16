import React, { useState } from 'react';

const DueDate: React.FC<{ onSelectDate: (date: Date) => void }> = ({ onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const setToday = () => {
        const today = new Date();
        setCurrentDate(today);
        onSelectDate(today);
    };

    const setTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCurrentDate(tomorrow);
        onSelectDate(tomorrow);
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg shadow-lg">
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={setToday}
                    className="flex-1 p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                    Today
                </button>
                <button
                    onClick={setTomorrow}
                    className="flex-1 p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                    Tomorrow
                </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-1 text-xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">&#9664;</button>
                <h2 className="text-xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={nextMonth} className="p-1 text-xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">&#9654;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`weekday-${index}`} className="font-bold text-gray-600 dark:text-gray-400">{day}</div>
                ))}
                {[...Array(firstDayOfMonth)].map((_, index) => (
                    <div key={`empty-${currentDate.getFullYear()}-${currentDate.getMonth()}-${index}`} />
                ))}
                {[...Array(daysInMonth)].map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                        <button
                            key={`day-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
                            onClick={() => onSelectDate(date)}
                            className={`p-2 rounded-full 
                                ${isToday ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} 
                                ${isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DueDate;