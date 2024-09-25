"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define the type for currency objects
interface Currency {
  currency: string;
  weight: string;
}

export default function CurrencyBasket() {
  const [basketName, setBasketName] = useState("");
  const [currency, setCurrency] = useState("");
  const [weight, setWeight] = useState("");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [basketValue, setBasketValue] = useState<number | null>(null);

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
      setBasketValue(response.data.basketValue); // Assuming the API returns the basket value
    } catch (error) {
      console.error("Error calculating basket value", error);
      setBasketValue(null); // Reset basket value in case of an error
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Topbar/Navbar */}
      <div className="w-full bg-white fixed top-0 left-0 shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between p-4">
          <h1 className="text-3xl font-semibold text-black">Currency Basket</h1>
          {/* Button to redirect to homepage */}
          <button
            onClick={() => router.push("/")} // Redirect to homepage
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Go to Homepage
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-20 max-w-3xl mx-auto bg-white p-6 shadow-md rounded-md space-y-4">
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

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-black">Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose Currency</option>
              {/* Currency options omitted for brevity */}
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
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose Base Currency</option>
            {/* Same currency options can be used here */}
          </select>
        </div>

        <button
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-6"
          onClick={handleSubmit}
        >
          Calculate Basket Value
        </button>

        {basketValue !== null && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <h3 className="text-xl font-medium text-green-700">
              Basket Value: {basketValue}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
