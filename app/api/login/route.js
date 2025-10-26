import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const res = await signInWithEmailAndPassword(auth, email, password);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Sign In :", error);
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
