import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { connect } from "@/dbConnect/dbConnect";

// Named export for POST request
export async function POST(request: NextRequest) {
  const connection = await connect();

  try {
    const { currency1, currency2, dateFrom, dateTo, timeRange } =
      await request.json();

    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    const collection = connection.collection("currency_data");

    const documents = await collection
      .find({
        Date: {
          $gte: startOfDay(startDate),
          $lte: endOfDay(endDate),
        },
      })
      .toArray();

    // Array to store currency ratio values
    let groupedData: any[] = [];

    if (timeRange === "weekly") {
      groupedData = groupByTimeRange(documents, "week", currency1, currency2);
    } else if (timeRange === "monthly") {
      groupedData = groupByTimeRange(documents, "month", currency1, currency2);
    } else if (timeRange === "quarterly") {
      groupedData = groupByTimeRange(
        documents,
        "quarter",
        currency1,
        currency2
      );
    } else if (timeRange === "yearly") {
      groupedData = groupByTimeRange(documents, "year", currency1, currency2);
    }

    return NextResponse.json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching data",
    });
  }
}

function groupByTimeRange(
  documents: any[],
  range: string,
  currency1: string,
  currency2: string
) {
  const grouped: any = {};

  documents.forEach((doc: any) => {
    const dateKey = getTimeRangeKey(doc.Date, range);

    if (!grouped[dateKey]) {
      grouped[dateKey] = { totalRatio: 0, count: 0 };
    }

    const currency1Value = doc[currency1];
    const currency2Value = doc[currency2];

    if (
      typeof currency1Value === "number" &&
      typeof currency2Value === "number"
    ) {
      const ratio = currency2Value / currency1Value;
      grouped[dateKey].totalRatio += ratio;
      grouped[dateKey].count += 1;
    }
  });

  return Object.keys(grouped).map((key) => ({
    date: key,
    ratio: grouped[key].totalRatio / grouped[key].count,
  }));
}

function getTimeRangeKey(date: Date, range: string) {
  const d = new Date(date);
  switch (range) {
    case "week":
      return `${d.getFullYear()}-W${getWeekNumber(d)}`;
    case "month":
      return `${d.getFullYear()}-${d.getMonth() + 1}`;
    case "quarter":
      return `${d.getFullYear()}-Q${Math.floor((d.getMonth() + 3) / 3)}`;
    case "year":
      return `${d.getFullYear()}`;
    default:
      return "";
  }
}

function getWeekNumber(d: Date) {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
}
