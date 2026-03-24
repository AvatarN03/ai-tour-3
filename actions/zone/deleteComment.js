import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { logActivity } from "@/lib/services/firestore";

export const deleteCommentAction = async ({
  postId,
  comments,
  commentId,
  profile,
}) => {
  try {
    const updated = comments.filter((c) => c.id !== commentId);

    await setDoc(doc(db, "blog_comments", postId), {
      comments: updated,
    });

    await logActivity({
      userId: profile?.uid,
      action: "DELETE",
      entity: "COMMENT",
      entityId: postId,
      metadata: { commentId },
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: error.message };
  }
};