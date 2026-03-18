import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const updatePostAction = async ({ id, post, newImageFile }) => {
  try {
    let finalImageUrl = post.imageUrl || "";

    // Upload image if changed
    if (newImageFile) {
      const formData = new FormData();
      formData.append("file", newImageFile);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
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