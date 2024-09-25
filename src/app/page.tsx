"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axios from 'axios';

export default function Home() {
  const [currency1, setCurrency1] = useState('');
  const [currency2, setCurrency2] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const router = useRouter(); // Initialize router

  const handleCurrency1Change = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrency1(e.target.value);
  const handleCurrency2Change = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrency2(e.target.value);
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value);
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value);
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value);

  const handleSeeGraph = async () => {
    try {
      const response = await axios.post('/api/graph', {
        currency1,
        currency2,
        dateFrom,
        dateTo,
        timeRange,
      });

      // Handle success response
      console.log('Graph data:', response.data);
      // You can navigate to the graph page or display the graph data here
    } catch (error) {
      // Handle error response
      console.error('Error fetching graph data:', error);
    }
  };

  // Function to navigate to the Currency Basket page
  const handleGoToCurrencyBasket = () => {
    router.push('/currencyBasket'); // Assuming the page is located at /currency-basket
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation bar */}
      <nav className="w-full bg-white shadow-md sticky top-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* Currency selectors */}
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700">Currency 1:</label>
              <select
                value={currency1}
                onChange={handleCurrency1Change}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Currency 2:</label>
              <select
                value={currency2}
                onChange={handleCurrency2Change}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose Currency</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          {/* Date selectors */}
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700">Date From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={handleDateFromChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Date To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={handleDateToChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Time Range selector */}
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Time Range</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* See Graph button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSeeGraph}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              See Graph
            </button>

            {/* Currency Basket button */}
            <button
              onClick={handleGoToCurrencyBasket}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
            >
              Currency Basket
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow p-8 sm:p-16">
        <h1 className="text-2xl font-semibold text-center mb-6">Currency Exchange Dashboard</h1>
      </main>
    </div>
  );
}
