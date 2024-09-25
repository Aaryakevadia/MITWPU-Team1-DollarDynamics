"use client";

import { useState } from 'react';
import axios from 'axios';

export default function CurrencyBasket() {
  const [basketName, setBasketName] = useState('');
  const [currency, setCurrency] = useState('');
  const [weight, setWeight] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [basketValue, setBasketValue] = useState(null);

  // Add the entered currency and weight to the currencies array
  const addCurrency = () => {
    if (currency && weight) {
      setCurrencies([...currencies, { currency, weight }]);
      setCurrency('');
      setWeight('');
    } else {
      alert("Please fill both fields before adding.");
    }
  };

  // Remove a currency and its weight from the array
  const removeCurrency = (index: number) => {
    setCurrencies(currencies.filter((_, i) => i !== index));
  };

  // Handle form submission to calculate the basket value
  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/currencyBasket', {
        basketName,
        currencies,
        baseCurrency,
      });
      setBasketValue(response.data.basketValue); // Assuming the API returns the basket value
    } catch (error) {
      console.error("Error calculating basket value", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-center mb-6 text-black">Create Your Custom Currency Basket</h1>

      {/* Basket Form */}
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md space-y-4">
        {/* Basket Name */}
        <div>
          <label className="block text-black">Basket Name:</label>
          <input
            type="text"
            value={basketName}
            onChange={(e) => setBasketName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter basket name"
          />
        </div>

        {/* Add Currency and Weight */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-black">Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
              {/* Add more currency options as needed */}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-black">Weight (%):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter weight"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-6"
            onClick={addCurrency}
          >
            Add Currency
          </button>
        </div>

        {/* Display Added Currencies */}
        <div className="mt-6">
          <h2 className="text-lg font-medium text-black">Added Currencies:</h2>
          <ul className="space-y-2">
            {currencies.map((currencyObj, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-black">
                  {currencyObj.currency} - {currencyObj.weight}%
                </span>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  onClick={() => removeCurrency(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Base Currency */}
        <div className="mt-6">
          <label className="block text-black">Base Currency:</label>
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose Base Currency</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            {/* Add more base currency options as needed */}
          </select>
        </div>

        {/* Submit Button */}
        <button
          className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600 mt-6"
          onClick={handleSubmit}
        >
          Calculate Basket Value
        </button>

        {/* Display Basket Value */}
        {basketValue !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-black">Basket Value in {baseCurrency}: {basketValue}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
