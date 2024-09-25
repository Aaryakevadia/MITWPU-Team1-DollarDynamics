import { NextRequest, NextResponse } from "next/server";

interface Currency {
  currency: string;
  weight: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      basketName,
      currencies,
      baseCurrency,
    }: { basketName: string; currencies: Currency[]; baseCurrency: string } =
      await request.json();

    // Validate input
    if (
      !basketName ||
      !currencies ||
      currencies.length === 0 ||
      !baseCurrency
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Please provide a valid basket name, currencies, and base currency.",
      });
    }

    // Calculate total weight
    const totalWeight = currencies.reduce(
      (sum: number, { weight }: Currency) => sum + parseFloat(weight),
      0
    );

    // Check if total weight exceeds 100%
    if (totalWeight > 100) {
      return NextResponse.json({
        success: false,
        message: "Total weight of currencies exceeds 100%.",
      });
    }

    // Fetch the latest exchange rates from the API only if total weight is valid
    const exchangeRatesResponse = await fetch(
      `https://api.apilayer.com/exchangerates_data/latest?base=${baseCurrency}`,
      {
        method: "GET",
        headers: {
          apikey: "wwRLgfUH1bjiWUeaZWfYNuZpYUmQTqaV",
        },
      }
    );

    if (!exchangeRatesResponse.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const exchangeRatesData = await exchangeRatesResponse.json();
    const latestData = exchangeRatesData.rates; // Get the rates from the response

    const basketValue = calculateBasketValue(
      currencies,
      latestData,
      baseCurrency
    );

    const createdBasket = await createBasketCard(basketName, basketValue);

    // Return the created basket information
    return NextResponse.json({
      success: true,
      basketName,
      basketValue,
      createdBasket,
    });
  } catch (error) {
    console.error("Error calculating basket value:", error);
    return NextResponse.json({
      success: false,
      message: "Error calculating basket value",
    });
  }
}

// Function to calculate the total value of the basket based on the weights and latest exchange rates
function calculateBasketValue(
  currencies: Currency[],
  latestData: Record<string, number>,
  baseCurrency: string
) {
  let totalValue = 0;

  // Add the value of the base currency (100% of its value)
  const baseCurrencyValue = latestData[baseCurrency];

  if (baseCurrencyValue !== undefined) {
    totalValue += 1;
  }

  currencies.forEach(({ currency, weight }: Currency) => {
    const currencyValue = latestData[currency];
    const currencyWeight = parseFloat(weight) / 100;

    if (currencyValue !== undefined) {
      const valueFromCurrency =
        currencyWeight * (baseCurrencyValue / currencyValue);
      totalValue += valueFromCurrency;
    }
  });

  return totalValue;
}

async function createBasketCard(basketName: string, basketValue: number) {
  return { basketName, basketValue };
}
