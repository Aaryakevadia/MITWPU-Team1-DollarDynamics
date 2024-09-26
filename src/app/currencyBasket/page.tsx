"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CurrencyDropdown from "@/components/Currencies/CurrencyDropdown"; // Corrected path

// Define the type for currency objects
interface Currency {
  currency: string;
  weight: string;
}

interface BasketDetails {
  basketName: string;
  baseCurrency: string;
  currencies: Currency[];
  basketValue: number;
}

export default function CurrencyBasket() {
  const [basketName, setBasketName] = useState("");
  const [currency, setCurrency] = useState("");
  const [weight, setWeight] = useState("");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [allBaskets, setAllBaskets] = useState<BasketDetails[]>([]); // Store all baskets
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter(); // For redirection

  // Add the entered currency and weight to the currencies array
  const addCurrency = () => {
    if (!currency || !weight) {
      setErrorMessage("Please fill both currency and weight fields.");
      return;
    }
    setErrorMessage(""); // Clear error message
    setCurrencies([...currencies, { currency, weight }]);
    setCurrency("");
    setWeight("");
  };

  // Remove a currency and its weight from the array
  const removeCurrency = (index: number) => {
    setCurrencies(currencies.filter((_, i) => i !== index));
  };

  // Handle form submission to calculate the basket value
  const handleSubmit = async () => {
    if (!basketName || currencies.length === 0 || !baseCurrency) {
      setErrorMessage("Please fill all required fields: Basket Name, Added Currencies, and Base Currency.");
      return;
    }
    setErrorMessage(""); // Clear error message

    try {
      const response = await axios.post("/api/currencyBasket", {
        basketName,
        currencies,
        baseCurrency,
      });

      // Assuming the API returns the basket value
      const basketValue = response.data.basketValue;

      // Add the new basket to the allBaskets array
      setAllBaskets((prevBaskets) => [
        ...prevBaskets,
        { basketName, baseCurrency, currencies, basketValue },
      ]);

      // Reset form fields and currencies after submission
      setBasketName("");
      setBaseCurrency("");
      setCurrencies([]);
    } catch (error) {
      console.error("Error calculating basket value", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-violet-500 p-6 font-roboto">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white bg-opacity-80 p-4 rounded-md mb-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">Currency Basket</h1>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 text-white px-4 py-2 rounded-md transition duration-200"
          onClick={() => router.push("/")} // Redirect to homepage
        >
          Home
        </button>
      </nav>

      <div className="flex justify-between space-x-4 flex-grow">
        {/* Left side - Input Form */}
        <div className="w-1/2 bg-white bg-opacity-90 p-8 shadow-lg rounded-md space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Create Basket</h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>} {/* Error Message */}
          <div className="flex flex-col items-center">
            {/* Basket Name Input */}
            <div className="w-full mb-4">
              <label className="block text-gray-700 mb-2">
                Basket Name:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basketName}
                onChange={(e) => setBasketName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter basket name"
              />
            </div>

            {/* Currency and Weight Input */}
            <div className="flex gap-4 mb-4 w-full">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">
                  Currency:<span className="text-red-500">*</span>
                </label>
                <CurrencyDropdown
                  selectedCurrency={currency}
                  setSelectedCurrency={setCurrency}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">
                  Weight (%):<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Weight"
                />
              </div>
            </div>

            {/* Add Currency Button */}
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-300 text-white px-4 py-2 rounded-md transition duration-200 mb-4"
              onClick={addCurrency}
            >
              Add Currency
            </button>

            {/* Display Added Currencies */}
            <div className="mt-4 w-full">
              <h2 className="text-lg font-medium text-gray-800">Added Currencies:</h2>
              <ul className="space-y-2">
                {currencies.map((currencyObj, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 bg-opacity-70 p-3 rounded-md"
                  >
                    <span className="text-gray-700">
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

            {/* Base Currency Selection */}
            <div className="mt-6 w-full">
              <label className="block text-gray-700 mb-2">
                Base Currency:<span className="text-red-500">*</span>
              </label>
              <CurrencyDropdown
                selectedCurrency={baseCurrency}
                setSelectedCurrency={setBaseCurrency}
              />
            </div>

            {/* Calculate Basket Value Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 text-white px-4 py-2 rounded-md mt-4"
              onClick={handleSubmit}
            >
              Calculate Basket Value
            </button>
          </div>
        </div>

        {/* Right side - Display of baskets */}
        <div className="w-1/2 bg-white bg-opacity-90 p-8 shadow-lg rounded-md space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Your Currency Baskets:</h2>
          {allBaskets.length === 0 ? (
            <p className="text-center text-gray-600">No baskets created yet.</p>
          ) : (
            allBaskets.map((basket, index) => (
              <div key={index} className="p-4 bg-blue-100 bg-opacity-80 rounded-md shadow-md">
                <h3 className="text-xl font-semibold text-blue-700">
                  Basket Name: {basket.basketName}
                </h3>
                <p className="text-gray-700">Base Currency: {basket.baseCurrency}</p>
                <ul className="space-y-2 mt-2">
                  {basket.currencies.map((currencyObj, currencyIndex) => (
                    <li key={currencyIndex} className="text-gray-700">
                      {currencyObj.currency} - {currencyObj.weight}%
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-medium text-green-700 mt-4">
                  Total Basket Value: {basket.basketValue}
                </h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
