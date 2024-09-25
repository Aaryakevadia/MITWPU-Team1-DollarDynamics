"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

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
  
      console.log('Graph data:', response.data);
  
      const ratios = response.data.data.map((item: CurrencyRatio) => item.ratio);
      const labels = response.data.data.map((item: CurrencyRatio) =>
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );
  
      // Detect volatile point and apply color logic
      const colors = ratios.map((ratio: number, index: number) => {
        if (index >= 10) {
          const prevTenAvg = ratios.slice(index - 10, index).reduce((acc:any, val:any) => acc + val, 0) / 10;
          const percentageChange = ((ratio - prevTenAvg) / prevTenAvg) * 100;
  
          if (Math.abs(percentageChange) > 2) {
            // This is the volatile point
            const volatileIndex = index;
  
            // Return red for this point
            return 'rgba(255, 99, 132, 0.6)';
          }
        }
        return 'rgba(75, 192, 192, 0.6)';
      });
  
      // Find the volatile points (where the colors are red)
      const volatileIndexes = colors
        .map((color:any, idx:any) => (color === 'rgba(255, 99, 132, 0.6)' ? idx : -1))
        .filter((idx:any) => idx !== -1);
  
      // Mark 7 points before and after each volatile point
      volatileIndexes.forEach((volatileIndex:any) => {
        for (let i = volatileIndex - 7; i <= volatileIndex + 7; i++) {
          if (i >= 0 && i < colors.length) {
            colors[i] = 'rgba(255, 99, 132, 0.6)'; // Marking these as red
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
                <option value="DZD">Algerian Dinar (DZD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="BWP">Botswana Pula (BWP)</option>
<option value="BRL">Brazilian Real (BRL)</option>
<option value="BND">Brunei Dollar (BND)</option>
<option value="CAD">Canadian Dollar (CAD)</option>
<option value="CLP">Chilean Peso (CLP)</option>
<option value="CNY">Chinese Yuan (CNY)</option>
<option value="COP">Colombian Peso (COP)</option>
<option value="CZK">Czech Koruna (CZK)</option>
<option value="DKK">Danish Krone (DKK)</option>
<option value="EUR">Euro (EUR)</option>
<option value="INR">Indian Rupee (INR)</option>
<option value="ILS">Israeli New Shekel (ILS)</option>
<option value="JPY">Japanese Yen (JPY)</option>
<option value="KRW">South Korean Won (KRW)</option>
<option value="KWD">Kuwaiti Dinar (KWD)</option>
<option value="MYR">Malaysian Ringgit (MYR)</option>
<option value="MUR">Mauritian Rupee (MUR)</option>
<option value="MXN">Mexican Peso (MXN)</option>
<option value="NZD">New Zealand Dollar (NZD)</option>
<option value="NOK">Norwegian Krone (NOK)</option>
<option value="OMR">Omani Rial (OMR)</option>
<option value="PEN">Peruvian Nuevo Sol (PEN)</option>
<option value="PHP">Philippine Peso (PHP)</option>
<option value="PLN">Polish Zloty (PLN)</option>
<option value="QAR">Qatari Rial (QAR)</option>
<option value="RUB">Russian Ruble (RUB)</option>
<option value="SAR">Saudi Riyal (SAR)</option>
<option value="SGD">Singapore Dollar (SGD)</option>
<option value="ZAR">South African Rand (ZAR)</option>
<option value="SEK">Swedish Krona (SEK)</option>
<option value="CHF">Swiss Franc (CHF)</option>
<option value="THB">Thai Baht (THB)</option>
<option value="TTD">Trinidad and Tobago Dollar (TTD)</option>
<option value="GBP">British Pound (GBP)</option>
<option value="AED">United Arab Emirates Dirham (AED)</option>
<option value="USD">United States Dollar (USD)</option>
<option value="UYU">Uruguayan Peso (UYU)</option>
<option value="BHD">Bahraini Dinar (BHD)</option>
<option value="VEF">Venezuelan Bolívar (VEF)</option>
<option value="HUF">Hungarian Forint (HUF)</option>
<option value="ISK">Icelandic Króna (ISK)</option>
<option value="IDR">Indonesian Rupiah (IDR)</option>
<option value="IRR">Iranian Rial (IRR)</option>
<option value="KZT">Kazakhstani Tenge (KZT)</option>
<option value="LYD">Libyan Dinar (LYD)</option>
<option value="NPR">Nepalese Rupee (NPR)</option>
<option value="PKR">Pakistani Rupee (PKR)</option>
<option value="LKR">Sri Lankan Rupee (LKR)</option>
                {/* Add other currency options here */}
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
                <option value="DZD">Algerian Dinar (DZD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
<option value="BWP">Botswana Pula (BWP)</option>
<option value="BRL">Brazilian Real (BRL)</option>
<option value="BND">Brunei Dollar (BND)</option>
<option value="CAD">Canadian Dollar (CAD)</option>
<option value="CLP">Chilean Peso (CLP)</option>
<option value="CNY">Chinese Yuan (CNY)</option>
<option value="COP">Colombian Peso (COP)</option>
<option value="CZK">Czech Koruna (CZK)</option>
<option value="DKK">Danish Krone (DKK)</option>
<option value="EUR">Euro (EUR)</option>
<option value="INR">Indian Rupee (INR)</option>
<option value="ILS">Israeli New Shekel (ILS)</option>
<option value="JPY">Japanese Yen (JPY)</option>
<option value="KRW">South Korean Won (KRW)</option>
<option value="KWD">Kuwaiti Dinar (KWD)</option>
<option value="MYR">Malaysian Ringgit (MYR)</option>
<option value="MUR">Mauritian Rupee (MUR)</option>
<option value="MXN">Mexican Peso (MXN)</option>
<option value="NZD">New Zealand Dollar (NZD)</option>
<option value="NOK">Norwegian Krone (NOK)</option>
<option value="OMR">Omani Rial (OMR)</option>
<option value="PEN">Peruvian Nuevo Sol (PEN)</option>
<option value="PHP">Philippine Peso (PHP)</option>
<option value="PLN">Polish Zloty (PLN)</option>
<option value="QAR">Qatari Rial (QAR)</option>
<option value="RUB">Russian Ruble (RUB)</option>
<option value="SAR">Saudi Riyal (SAR)</option>
<option value="SGD">Singapore Dollar (SGD)</option>
<option value="ZAR">South African Rand (ZAR)</option>
<option value="SEK">Swedish Krona (SEK)</option>
<option value="CHF">Swiss Franc (CHF)</option>
<option value="THB">Thai Baht (THB)</option>
<option value="TTD">Trinidad and Tobago Dollar (TTD)</option>
<option value="GBP">British Pound (GBP)</option>
<option value="AED">United Arab Emirates Dirham (AED)</option>
<option value="USD">United States Dollar (USD)</option>
<option value="UYU">Uruguayan Peso (UYU)</option>
<option value="BHD">Bahraini Dinar (BHD)</option>
<option value="VEF">Venezuelan Bolívar (VEF)</option>
<option value="HUF">Hungarian Forint (HUF)</option>
<option value="ISK">Icelandic Króna (ISK)</option>
<option value="IDR">Indonesian Rupiah (IDR)</option>
<option value="IRR">Iranian Rial (IRR)</option>
<option value="KZT">Kazakhstani Tenge (KZT)</option>
<option value="LYD">Libyan Dinar (LYD)</option>
<option value="NPR">Nepalese Rupee (NPR)</option>
<option value="PKR">Pakistani Rupee (PKR)</option>
<option value="LKR">Sri Lankan Rupee (LKR)</option>
                {/* Add other currency options here */}
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
          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSeeGraph}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              See Graph
            </button>
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
        {chartData && (
          <div className="mt-8">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `Currency Ratio (${currency1}/${currency2})`,
                  },
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
