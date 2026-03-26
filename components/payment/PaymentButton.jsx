"use client";

import { useState } from "react";

import { toast } from "sonner";
import clsx from "clsx";
import { doc, updateDoc } from "firebase/firestore";
import { load } from "@cashfreepayments/cashfree-js";

import { useAuth } from "@/context/useAuth";

import { db } from "@/lib/config/firebase";
import axios from "axios";

export default function PaymentButton({ children, className }) {
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useAuth();




  const handlePayment = async () => {
    setLoading(true);

    try {

      // 1️⃣ Create order
      const res = await axios.post("/api/payment/create-order", {
        customerId: profile?.uid,
        email: profile?.email,
      });

      const data = res.data;

      if (!data?.payment_session_id) {
        setLoading(false);
        return;
      }

      // 2️⃣ Load SDK
      const cashfree = await load({ mode: "sandbox" });

      console.log("1");

      // 3️⃣ Open checkout modal
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal"
      });

      console.log("2 modal closed");

      // 4️⃣ Verify payment from backend
      const verify = await axios.get(`/api/payment/verify?orderId=${data.order_id}`);
      const result = verify.data;

      if (result.status === "SUCCESS") {

        console.log("3 payment verified");

        await updateDoc(doc(db, "users", profile.uid), {
          subscription: "pro",
          subscriptionUpdatedAt: new Date()
        });

        setProfile((prev) => ({
          ...prev,
          subscription: "pro"
        }));

        console.log("4 firestore updated");

        toast.success("Payment successful! Pro unlocked.");
      } else {
        toast.error("Payment failed or cancelled.");
      }

    } catch (error) {
      console.error("Payment error:", error);
    }

    setLoading(false);
  };
  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={clsx(
        "p-1 text-white rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}