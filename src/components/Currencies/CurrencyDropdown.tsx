import React from "react";


interface CurrencyDropdownProps {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const currencies = [
    { code: "DZD", name: "Algerian Dinar (DZD)" },
    { code: "AUD", name: "Australian Dollar (AUD)" },
    { code: "BWP", name: "Botswana Pula (BWP)" },
    { code: "BRL", name: "Brazilian Real (BRL)" },
    { code: "BND", name: "Brunei Dollar (BND)" },
    { code: "CAD", name: "Canadian Dollar (CAD)" },
    { code: "CLP", name: "Chilean Peso (CLP)" },
    { code: "CNY", name: "Chinese Yuan (CNY)" },
    { code: "COP", name: "Colombian Peso (COP)" },
    { code: "CZK", name: "Czech Koruna (CZK)" },
    { code: "DKK", name: "Danish Krone (DKK)" },
    { code: "EUR", name: "Euro (EUR)" },
    { code: "INR", name: "Indian Rupee (INR)" },
    { code: "ILS", name: "Israeli New Shekel (ILS)" },
    { code: "JPY", name: "Japanese Yen (JPY)" },
    { code: "KRW", name: "South Korean Won (KRW)" },
    { code: "KWD", name: "Kuwaiti Dinar (KWD)" },
    { code: "MYR", name: "Malaysian Ringgit (MYR)" },
    { code: "MUR", name: "Mauritian Rupee (MUR)" },
    { code: "MXN", name: "Mexican Peso (MXN)" },
    { code: "NZD", name: "New Zealand Dollar (NZD)" },
    { code: "NOK", name: "Norwegian Krone (NOK)" },
    { code: "OMR", name: "Omani Rial (OMR)" },
    { code: "PEN", name: "Peruvian Nuevo Sol (PEN)" },
    { code: "PHP", name: "Philippine Peso (PHP)" },
    { code: "PLN", name: "Polish Zloty (PLN)" },
    { code: "QAR", name: "Qatari Rial (QAR)" },
    { code: "RUB", name: "Russian Ruble (RUB)" },
    { code: "SAR", name: "Saudi Riyal (SAR)" },
    { code: "SGD", name: "Singapore Dollar (SGD)" },
    { code: "ZAR", name: "South African Rand (ZAR)" },
    { code: "SEK", name: "Swedish Krona (SEK)" },
    { code: "CHF", name: "Swiss Franc (CHF)" },
    { code: "THB", name: "Thai Baht (THB)" },
    { code: "TTD", name: "Trinidad and Tobago Dollar (TTD)" },
    { code: "GBP", name: "British Pound (GBP)" },
    { code: "AED", name: "United Arab Emirates Dirham (AED)" },
    { code: "USD", name: "United States Dollar (USD)" },
    { code: "UYU", name: "Uruguayan Peso (UYU)" },
    { code: "BHD", name: "Bahraini Dinar (BHD)" },
    { code: "VEF", name: "Venezuelan Bolívar (VEF)" },
    { code: "HUF", name: "Hungarian Forint (HUF)" },
    { code: "ISK", name: "Icelandic Króna (ISK)" },
    { code: "IDR", name: "Indonesian Rupiah (IDR)" },
    { code: "IRR", name: "Iranian Rial (IRR)" },
    { code: "KZT", name: "Kazakhstani Tenge (KZT)" },
    { code: "LYD", name: "Libyan Dinar (LYD)" },
    { code: "NPR", name: "Nepalese Rupee (NPR)" },
    { code: "PKR", name: "Pakistani Rupee (PKR)" },
    { code: "LKR", name: "Sri Lankan Rupee (LKR)" },
  ];

  return (
    <select
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      className="w-full px-3 py-2 border-2 border-gray-400 rounded-md bg-violet-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Choose Currency</option>
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.name}
        </option>
      ))}
    </select>
  );
};

export default CurrencyDropdown;
