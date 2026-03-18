import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/lib/config/firebase";
import { logActivity } from "@/lib/services/logActivity";

export const deletePostAction = async ({ postId, profile }) => {
  try {
    await deleteDoc(doc(db, "blog_posts", postId));
    await deleteDoc(doc(db, "blog_comments", postId));

    await logActivity({
      userId: profile?.uid,
      action: "DELETE",
      entity: "BLOG",
      entityId: postId,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};