import { NextResponse } from "next/server";
import { Tour } from "@/types";
import toursData from "@/data/tours.json";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = (toursData as Tour[]).find(
      (t) => t.id === params.id || t.slug === params.id
    );

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    if (!tour.isActive) {
      return NextResponse.json(
        { error: "Tour is not active" },
        { status: 404 }
      );
    }

    return NextResponse.json(tour, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}
