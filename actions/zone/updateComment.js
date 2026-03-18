// actions/updateComment.js

import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const updateCommentAction = async ({ postId, commentId, text }) => {
  try {
    const ref = doc(db, "blog_comments", postId);  // ✅ matches your app's structure
    const snap = await getDoc(ref);

    if (!snap.exists()) return { success: false, error: "Comments doc not found" };

    const comments = snap.data().comments || [];
    const updated = comments.map((c) =>
      c.id === commentId
        ? { ...c, text, updatedAt: Timestamp.now() }
        : c
    );

    await updateDoc(ref, { comments: updated });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};