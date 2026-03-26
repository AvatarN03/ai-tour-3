import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerId, email } = body;

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_amount: 159,
        order_currency: "INR",
        order_id: "order_" + Date.now(),
        order_note: "Pro Subscription Plan",
        customer_details: {
          customer_id: customerId || "customer_" + Date.now(),
          customer_email: email || "demo@email.com",
          customer_phone: "9999999999"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01"
        }
      }
    );

    const data = response.data;

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}