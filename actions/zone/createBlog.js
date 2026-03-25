import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { logActivity } from "@/lib/services/firestore";
import axios from "axios";

export const createPostAction = async ({ post, profile }) => {
  try {
    let uploadedImageUrl = "";

    // Upload image (if exists)
    if (post.imageFile) {
      const formData = new FormData();
      formData.append("file", post.imageFile);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/media/upload`,
          formData
        );

        uploadedImageUrl = res.data?.url || "";

        // Optional logical check
        if (!uploadedImageUrl) {
          throw new Error("Image uploaded but URL missing");
        }

      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Image upload failed"
        );
      }
    }

    // ✅ Moved OUTSIDE if block (important)
    const postId = `post_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const postData = {
      title: post.title.trim(),
      content: post.content.trim(),
      category: post.category,
      imageUrl: uploadedImageUrl,
      author: profile?.name || "Anonymous",
      authorImage: profile?.avatarUrl || null,
      authorUid: profile?.uid,
      createdAt: Timestamp.now(),
      likes: 0,
    };

    await setDoc(doc(db, "blog_posts", postId), postData);
    await setDoc(doc(db, "blog_comments", postId), { comments: [] });

    await logActivity({
      userId: profile?.uid,
      action: "CREATE",
      entity: "BLOG",
      entityId: postId,
      metadata: { title: postData.title },
    });

    return { success: true, data: postId };

  } catch (error) {
    return { success: false, error: error.message };
  }
};