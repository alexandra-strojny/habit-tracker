import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Habit } from "../types/types";
import { useMutation } from "@tanstack/react-query";

const editHabit = async (userId: string | undefined, habitId: string, habitData: Habit) => {
  await updateDoc(doc(db, `users/${userId}/habits/${habitId}`), {
    name: habitData.name,
    frequency: habitData.frequency,
    updatedAt: serverTimestamp(),
  });
}

export const useEditHabit = (userId: string | undefined, habitId: string) => {
  return useMutation({
    mutationFn: (habitData: Habit) => editHabit(userId, habitId, habitData),
    onSuccess: () => {
      console.log('Habit edited successfully');
    },
    onError: (error) => {
      console.error('Error editing habit:', error);
    },
  });
}