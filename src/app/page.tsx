"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import CurrencyDropdown from "@/components/Currencies/CurrencyDropdown"; // Corrected path

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

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
  const router = useRouter();

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

      const ratios = response.data.data.map((item: CurrencyRatio) => item.ratio);
      const labels = response.data.data.map((item: CurrencyRatio) =>
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );

      const colors = ratios.map((ratio: number, index: number) => {
        if (index >= 10) {
          const prevTenAvg = ratios.slice(index - 10, index).reduce((acc:any, val:any) => acc + val, 0) / 10;
          const percentageChange = ((ratio - prevTenAvg) / prevTenAvg) * 100;

          if (Math.abs(percentageChange) > 2) {
            return 'rgba(255, 99, 132, 0.6)';
          }
        }
        return 'rgba(75, 192, 192, 0.6)';
      });

      const volatileIndexes = colors
        .map((color:any, idx:any) => (color === 'rgba(255, 99, 132, 0.6)' ? idx : -1))
        .filter((idx:any) => idx !== -1);

      volatileIndexes.forEach((volatileIndex:any) => {
        for (let i = volatileIndex - 7; i <= volatileIndex + 7; i++) {
          if (i >= 0 && i < colors.length) {
            colors[i] = 'rgba(255, 99, 132, 0.6)';
          }
        }
      });

      setChartData({
        labels,
        datasets: [
          {
            label: `Currency Ratio (${currency1}/${currency2})`,
            data: ratios,
            backgroundColor: colors,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const handleGoToCurrencyBasket = () => {
    router.push('/currencyBasket');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-purple-100 to-pink-100">
      {/* Navigation bar */}
      <nav className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white">Currency Exchange Dashboard</h1>
          <div className="flex gap-4">
            <div className="w-48">
              <label className="block text-white text-sm mb-2">Currency 1</label>
             
                <CurrencyDropdown
              selectedCurrency={currency1}
              setSelectedCurrency={setCurrency1}
            />

            </div>

            <div className="w-48">
              <label className="block text-white text-sm mb-2">Currency 2</label>
              
                <CurrencyDropdown
              selectedCurrency={currency2}
              setSelectedCurrency={setCurrency2}
            />
                
            </div>

            <div className="w-40">
              <label className="block text-white text-sm mb-2">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={handleDateFromChange}
                className="w-full px-4 py-2 border border-indigo-300 text-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="w-40">
              <label className="block text-white text-sm mb-2">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={handleDateToChange}
                className="w-full px-4 py-2 border border-indigo-300 text-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="w-40">
              <label className="block text-white text-sm mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Time Range</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSeeGraph}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-lg transition"
            >
              See Graph
            </button>
            <button
              onClick={handleGoToCurrencyBasket}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg transition"
            >
              Currency Basket
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow p-8 sm:p-16">
        {chartData ? (
          <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `Currency Ratio (${currency1}/${currency2})`,
                    font: {
                      size: 20,
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-700">Select currencies and dates to view the chart.</p>
        )}
      </main>

      <footer className="bg-gradient-to-r from-pink-500 to-purple-500 py-6 mt-auto">
        <p className="text-center text-white text-sm">&copy; 2024 Team1 Currency Exchange Dashboard</p>
      </footer>
    </div>
  );
}
