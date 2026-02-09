import { NextResponse } from "next/server";
import { AvailableDate } from "@/types";
import datesData from "@/data/dates.json";

export async function GET(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const tourDates = (datesData as AvailableDate[]).filter(
      (date) => date.tourId === params.tourId
    );

    // Фильтруем только будущие даты
    const now = new Date();
    const futureDates = tourDates.filter(
      (date) => new Date(date.startDate) >= now
    );

    return NextResponse.json(futureDates, { status: 200 });
  } catch (error) {
    console.error("Error fetching dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch dates" },
      { status: 500 }
    );
  }
}
