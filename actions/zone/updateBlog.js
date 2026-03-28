import { doc, updateDoc, Timestamp } from "firebase/firestore";
import axios from "axios";

import { db } from "@/lib/config/firebase";

export const updatePostAction = async ({ id, post, newImageFile }) => {
  try {
    let finalImageUrl = post.imageUrl || "";

    // Upload image if changed
    if (newImageFile) {
      const formData = new FormData();
      formData.append("file", newImageFile);

      const res = await axios.post("/api/media/upload", formData);

      const data = res.data;
      finalImageUrl = data?.url || "";
    }

    await updateDoc(doc(db, "blog_posts", id), {
      title: post.title.trim(),
      content: post.content.trim(),
      category: post.category,
      imageUrl: finalImageUrl,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};