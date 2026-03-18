import { NextResponse } from "next/server";

import { revalidate12 } from "@/lib/utils/constant";

export const revalidate = 43200;

export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR", {
      next: { revalidate: revalidate12 }, 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch rates");
    }

    const data = await res.json();

    const topCurrencies = [
      "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY",
      "INR", "BRL", "MXN", "ZAR", "KRW", "RUB", "SGD",
    ];

    const filteredRates = Object.fromEntries(
      Object.entries(data.rates).filter(([currency]) =>
        topCurrencies.includes(currency)
      )
    );

    filteredRates["EUR"] = 1;

    return NextResponse.json(filteredRates);
  } catch (error) {
    console.error("Error fetching rates:", error);
    return NextResponse.json(
      { error: "Unable to fetch rates" },
      { status: 500 }
    );
  }
}
