import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerId, email } = body;

    const response = await fetch(
      "https://sandbox.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01"
        },
        body: JSON.stringify({
          order_amount: 159,
          order_currency: "INR",
          order_id: "order_" + Date.now(),
          order_note: "Pro Subscription Plan",
          customer_details: {
            customer_id: customerId || "customer_" + Date.now(),
            customer_email: email || "demo@email.com",
            customer_phone: "9999999999"
          }
        })
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}