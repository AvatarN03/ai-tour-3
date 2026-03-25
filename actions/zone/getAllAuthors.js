import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const getAllAuthorsAction = async () => {
  try {
    const postsSnap = await getDocs(collection(db, "blog_posts"));

    const authorMap = {};
    postsSnap.docs.forEach((d) => {
      const data = d.data();
      const uid = data.authorUid;
      if (!uid) return;

      if (!authorMap[uid]) {
        authorMap[uid] = {
          uid,
          name: data.author || "Anonymous",
          avatarImage: data.authorImage || null,
          postCount: 0,
        };
      }
      authorMap[uid].postCount += 1;
    });

    const authors = Object.values(authorMap).sort((a, b) => b.postCount - a.postCount);

    return { success: true, data: authors };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
