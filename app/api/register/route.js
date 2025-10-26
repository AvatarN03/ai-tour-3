import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {    
    const { name, email, password,  preferences } = await req.json();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email: res.user.email,
      name,
      avatarUrl : "",
      preferences,
      createdAt: new Date(),
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Signup : ", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
