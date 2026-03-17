"use client";

import { useAuth } from "@/providers/useAuth";
import { load } from "@cashfreepayments/cashfree-js";
import clsx from "clsx";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { toast } from "sonner";

export default function PaymentButton({ children, className }) {
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useAuth();

  // const handlePayment = async () => {
  //   setLoading(true);

  //   try {

  //     // 1️⃣ Create order from backend
  //     const res = await fetch("/api/payment/create-order", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         customerId: profile?.uid,
  //         email: profile?.email
  //       })
  //     });

  //     const data = await res.json();
  //     console.log("Order API response:", data);

  //     if (!data?.payment_session_id) {
  //       console.error("Payment session id missing");
  //       setLoading(false);
  //       return;
  //     }

  //     // 2️⃣ Load Cashfree SDK
  //     const cashfree = await load({
  //       mode: "sandbox"
  //     });
  //     console.log("1")

  //     // 3️⃣ Open payment modal
  //     await cashfree.checkout({
  //       paymentSessionId: data.payment_session_id,
  //       redirectTarget: "_modal",

  //       // 4️⃣ Payment success
  //       onSuccess: async () => {
  //         console.log("2")

  //         console.log("Payment Successful");

  //         // update Firestore
  //         await updateDoc(doc(db, "users", profile.uid), {
  //           subscription: "pro",
  //           subscriptionUpdatedAt: new Date()
  //         });
  //         console.log("3")

  //         // update local profile state
  //         setProfile((prev) => ({
  //           ...prev,
  //           subscription: "pro"
  //         }));
  //         console.log("4")

  //         alert("Payment successful! Pro unlocked.");
  //       },

  //       // 5️⃣ Payment failure
  //       onFailure: (err) => {
  //         console.log("Payment failed", err);
  //         console.log("5")
  //         alert("Payment failed or cancelled.");
  //       }
  //     });
  //     console.log("6")

  //   } catch (error) {
  //     console.error("Payment error:", error);
  //   }

  //   setLoading(false);
  // };


  const handlePayment = async () => {
    setLoading(true);

    try {

      // 1️⃣ Create order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: profile?.uid,
          email: profile?.email
        })
      });

      const data = await res.json();

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
      const verify = await fetch(`/api/payment/verify?orderId=${data.order_id}`);
      const result = await verify.json();

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