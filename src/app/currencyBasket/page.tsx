"use client";

import { useState } from 'react';
import axios from 'axios';

// Define the type for currency objects
interface Currency {
  currency: string;
  weight: string;
}

export default function CurrencyBasket() {
  const [basketName, setBasketName] = useState('');
  const [currency, setCurrency] = useState('');
  const [weight, setWeight] = useState('');
  // Specify the type for currencies state
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [basketValue, setBasketValue] = useState<number | null>(null);

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
