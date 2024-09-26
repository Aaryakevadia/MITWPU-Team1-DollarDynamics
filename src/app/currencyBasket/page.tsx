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

  const router = useRouter(); // For redirection

  // Add the entered currency and weight to the currencies array
  const addCurrency = () => {
    if (currency && weight) {
      setCurrencies([...currencies, { currency, weight }]);
      setCurrency("");
      setWeight("");
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
      const response = await axios.post("/api/currencyBasket", {
        basketName,
        currencies,
        baseCurrency,
      });

      // Assuming the API returns the basket value
      const basketValue = response.data.basketValue;

      // Add the new basket to the allBaskets array
      setAllBaskets([
        ...allBaskets,
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
    <div className="min-h-screen flex bg-gradient-to-r from-blue-600 to-violet-600 p-6">
      {/* Left side - Input Form */}
      <div className="w-1/2 bg-violet-200 p-6 shadow-md rounded-md space-y-4">
        <div>
          <label className="block text-black">Basket Name:</label>
          <input
            type="text"
            value={basketName}
            onChange={(e) => setBasketName(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-black"
            placeholder="Enter basket name"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-black border-black">Currency:</label>
            <CurrencyDropdown
              selectedCurrency={currency}
              setSelectedCurrency={setCurrency}
            />
          </div>
          <div className="flex-1">
            <label className="block text-black">Weight (%):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-400 rounded-md text-black"
              placeholder="Enter weight"
            />
          </div>
          <button
            className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-6"
            onClick={addCurrency}
          >
            Add Currency
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-black">Added Currencies:</h2>
          <ul className="space-y-2">
            {currencies.map((currencyObj, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
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

        <div className="mt-6">
          <label className="block text-black">Base Currency:</label>
          <CurrencyDropdown
            selectedCurrency={baseCurrency}
            setSelectedCurrency={setBaseCurrency}
          />
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 mt-6"
          onClick={handleSubmit}
        >
          Calculate Basket Value
        </button>
      </div>

      {/* Right side - Display of baskets */}
      <div className="w-1/2 bg-violet-200 p-6 ml-4 shadow-md rounded-md space-y-4">
        <h2 className="text-2xl font-semibold text-black">Your Currency Baskets:</h2>
        {allBaskets.map((basket, index) => (
          <div key={index} className="p-4 bg-blue-100 rounded-md">
            <h3 className="text-xl font-semibold text-blue-700">
              Basket Name: {basket.basketName}
            </h3>
            <p className="text-black">Base Currency: {basket.baseCurrency}</p>
            <ul className="space-y-2 mt-2">
              {basket.currencies.map((currencyObj, currencyIndex) => (
                <li key={currencyIndex} className="text-black">
                  {currencyObj.currency} - {currencyObj.weight}%
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-medium text-green-700 mt-4">
              Total Basket Value: {basket.basketValue}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
