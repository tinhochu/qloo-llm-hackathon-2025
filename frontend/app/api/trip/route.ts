import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("data", { data });

    return NextResponse.json({
      status: "success",
      message: "Trip created successfully",
      tripId: `trip_${Date.now()}`,
      destination: data.destination,
      duration: data.duration,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
