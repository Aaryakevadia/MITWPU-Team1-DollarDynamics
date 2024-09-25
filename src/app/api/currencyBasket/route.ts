import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConnect/dbConnect"; // Import your db connection function

// Named export for POST request
export async function POST(request: NextRequest) {
  const connection = await connect(); // Connect to the MongoDB database and get the connection object

  try {
    // Get user input from request body
    const { basketName, currencies, baseCurrency } = await request.json();

    // Validate input
    if (!basketName || !currencies || currencies.length === 0 || !baseCurrency) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid basket name, currencies, and base currency.'
      });
    }

    // Access the database collection
    const collection = connection.collection('currency_data'); // Replace with your collection name

    // Find the most recent document for the given base currency
    const latestDocument = await collection.find({}).sort({ Date: -1 }).limit(1).toArray();
    
    if (latestDocument.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No currency data found.'
      });
    }

    const latestData = latestDocument[0]; // Get the latest document

    // Calculate the total value of the basket
    const basketValue = calculateBasketValue(currencies, latestData, baseCurrency);

    // Return the calculated basket value
    return NextResponse.json({
      success: true,
      basketName,
      basketValue,
    });

  } catch (error) {
    console.error('Error calculating basket value:', error);
    return NextResponse.json({
      success: false,
      message: 'Error calculating basket value',
    });
  }
}

// Function to calculate the total value of the basket based on the weights and latest exchange rates
function calculateBasketValue(currencies: { currency: string; weight: string }[], latestData: any, baseCurrency: string) {
  let totalValue = 0;

  currencies.forEach(({ currency, weight }) => {
    const currencyValue = latestData[currency];
    const currencyWeight = parseFloat(weight) / 100; // Convert percentage to decimal

    // Check if the currency exists in the latest data
    if (currencyValue !== undefined) {
      const valueInBaseCurrency = currencyValue; // Assuming the latestData already has base currency values
      totalValue += valueInBaseCurrency * currencyWeight; // Calculate total value
    }
  });

  return totalValue;
}
