import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
}

const Dashboard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const fetchWeather = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location,
        )}&count=1&language=en&format=json`,
      );
      const geoData = await geoResponse.json();

      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );
        const weatherData = await weatherResponse.json();

        setWeather({
          temperature: celsiusToFahrenheit(
            weatherData.current_weather.temperature,
          ),
          weatherCode: weatherData.current_weather.weathercode,
          windSpeed: Math.round(weatherData.current_weather.windspeed),
        });
      } else {
        console.error('Location not found');
        setWeather(null);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherDescription = (code: number): string => {
    if (code <= 3) return 'Clear';
    if (code <= 48) return 'Cloudy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    return 'Stormy';
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <p className="text-7xl font-bold text-gray-800 mb-2 dark:text-white">
            {formatTime(currentDateTime)}
          </p>
          <p className="text-xl mb-4 text-gray-600 dark:text-gray-300">
            {formatDate(currentDateTime)}
          </p>
          <form onSubmit={handleSubmit} className="mb-4 w-full">
            <div className="flex">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or address"
                className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Get Weather
              </button>
            </div>
          </form>
          {loading && (
            <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
          )}
          {weather && (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
                {weather.temperature}°F
              </p>
              <p className="text-xl capitalize text-gray-600 mb-2 dark:text-gray-300">
                {getWeatherDescription(weather.weatherCode)}
              </p>
              <p className="text-lg text-gray-600 mb-2 dark:text-gray-300">
                Wind Speed: {weather.windSpeed} km/h
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
