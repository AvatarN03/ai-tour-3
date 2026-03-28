import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/config/firebase";

export const getCommentsAction = async ({ postId }) => {
  try {
    const snap = await getDoc(doc(db, "blog_comments", postId));

    if (!snap.exists()) {
      return { success: true, data: [] };
    }

    const comments = (snap.data().comments || []).map((c) => ({
      ...c,
      createdAt: c.createdAt?.toDate?.() || new Date(c.createdAt),
    }));

    return { success: true, data: comments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};