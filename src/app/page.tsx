"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ClipLoader from 'react-spinners/ClipLoader'; // Import spinner for loading states

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CurrencyRatio {
  date: string;
  ratio: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function Home() {
  const [currency1, setCurrency1] = useState('');
  const [currency2, setCurrency2] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleCurrency1Change = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrency1(e.target.value);
  const handleCurrency2Change = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrency2(e.target.value);
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value);
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value);
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value);

  const handleSeeGraph = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.post('/api/graph', {
        currency1,
        currency2,
        dateFrom,
        dateTo,
        timeRange,
      });

      const labels = response.data.data.map((item: CurrencyRatio) =>
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );
      const ratios = response.data.data.map((item: CurrencyRatio) => item.ratio);

      setChartData({
        labels,
        datasets: [
          {
            label: `Currency Ratio (${currency1}/${currency2})`,
            data: ratios,
            backgroundColor: ratios.map((ratio) =>
              ratio > 1 ? 'rgba(255, 99, 132, 0.7)' : 'rgba(75, 192, 192, 0.7)'
            ),
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false); // Hide spinner after data is loaded
    }
  };

  const handleGoToCurrencyBasket = () => {
    router.push('/currencyBasket');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-indigo-100">
      {/* Navigation bar */}
      <nav className="w-full bg-white shadow-md sticky top-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Currency 1:</label>
              <select
                value={currency1}
                onChange={handleCurrency1Change}
                className="px-3 py-2 border border-gray-300 rounded-md transition-all focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose Currency</option>
                <option value="USD">United States Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                {/* Add more options here */}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Currency 2:</label>
              <select
                value={currency2}
                onChange={handleCurrency2Change}
                className="px-3 py-2 border border-gray-300 rounded-md transition-all focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose Currency</option>
                <option value="USD">United States Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                {/* Add more options here */}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Date From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={handleDateFromChange}
                className="px-3 py-2 border border-gray-300 rounded-md transition-all focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Date To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={handleDateToChange}
                className="px-3 py-2 border border-gray-300 rounded-md transition-all focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Time Range:</label>
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-md transition-all focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Time Range</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSeeGraph}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-md hover:shadow-lg transition-all"
            >
              See Graph
            </button>
            <button
              onClick={handleGoToCurrencyBasket}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:shadow-lg transition-all"
            >
              Currency Basket
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-8 sm:p-16">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-8">
          Currency Exchange Dashboard
        </h1>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center">
            <ClipLoader size={50} color={"#4A90E2"} />
          </div>
        )}

        {/* Render the chart if data is available */}
        {chartData && !loading && (
          <div className="mt-12">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `Currency Ratio (${currency1}/${currency2})`,
                    font: { size: 18, weight: 'bold' },
                  },
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `Ratio: ${context.raw}`,
                    },
                  },
                },
                animation: {
                  duration: 1000, // Animation duration
                },
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
