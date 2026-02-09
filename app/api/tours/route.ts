import { NextResponse } from "next/server";
import { Tour } from "@/lib/types";
import toursData from "@/data/tours.json";

export async function GET() {
  try {
    // Возвращаем только активные туры
    const activeTours = (toursData as Tour[]).filter(tour => tour.isActive);
    
    return NextResponse.json(activeTours, { status: 200 });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
