import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const getAuthorPostsAction = async ({ authorId }) => {
  try {
    const q = query(collection(db, "blog_posts"), where("authorUid", "==", authorId));
    const postsSnap = await getDocs(q);

    const posts = postsSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt:
            data.updatedAt?.toDate?.() ||
            (data.updatedAt ? new Date(data.updatedAt) : null),
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    const commentsSnap = await getDocs(collection(db, "blog_comments"));
    const commentsMap = {};
    commentsSnap.docs.forEach((d) => {
      commentsMap[d.id] = (d.data().comments || []).length;
    });

    const authorName = posts.length > 0 ? posts[0].author : "";
    const authorImage = posts.length > 0 ? posts[0].authorImage : null;

    return { success: true, data: { posts, commentsMap, authorName, authorImage } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
