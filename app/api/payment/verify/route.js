import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01"
        }
      }
    );

    const data = response.data;

    // payments array
    const payment = data?.[0];

    if (payment?.payment_status === "SUCCESS") {
      return NextResponse.json({ status: "SUCCESS" });
    }

    return NextResponse.json({ status: "FAILED" });

  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}