import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

export const saveBudgetGoalAction = async ({ userId, goal }) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      monthlyBudgetGoal: goal,
      savingsGoal: goal,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
