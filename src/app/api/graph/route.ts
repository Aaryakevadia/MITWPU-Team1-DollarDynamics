import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from 'date-fns';
import { connect } from "@/dbConnect/dbConnect"; // Import your db connection function

// Named export for POST request
export async function POST(request: NextRequest) {
  const connection = await connect(); // Connect to the MongoDB database and get the connection object

  try {
    // Get user input from request body
    const { currency1, currency2, dateFrom, dateTo } = await request.json();

    // Convert date strings to Date objects
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    // Access the database collection
    const collection = connection.collection('currency_data'); // Replace with your collection name

    // Find documents that fall within the date range
    const documents = await collection.find({
      Date: {
        $gte: startOfDay(startDate),
        $lte: endOfDay(endDate),
      }
    }).toArray();

    // Array to store currency ratio values
    const currencyRatios = documents.map((doc: any) => {
      if (doc[currency1] && doc[currency2]) {
        const ratio = doc[currency2] / doc[currency1];
        return {
          date: doc.Date,
          ratio,
        };
      }
      return null; // Return null for invalid cases
    }).filter(Boolean); // Filter out null values

    // Return response with currency ratios
    return NextResponse.json({
      success: true,
      data: currencyRatios,
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching data',
    });
  }
}
