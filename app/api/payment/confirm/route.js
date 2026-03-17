import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  const { userId } = await req.json();

  await updateDoc(doc(db, "users", userId), {
    subscription: "pro"
  });

  revalidatePath("/dashboard");

  return NextResponse.json({ success: true });
}