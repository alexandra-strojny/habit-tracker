import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Habit } from "../types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";

const editHabit = async (userId: string | undefined, habitId: string, habitData: Habit) => {
  await updateDoc(doc(db, `users/${userId}/habits/${habitId}`), {
    name: habitData.name,
    frequency: habitData.frequency,
    updatedAt: serverTimestamp(),
    streaks: habitData.streaks || []
  });
  return habitId
}

export const useEditHabit = (queryClient: QueryClient, userId: string | undefined, habitId: string) => {
  return useMutation({
    mutationFn: (habitData: Habit) => editHabit(userId, habitId, habitData),
    onSuccess: (habitId) => {
      console.log('Habit edited successfully');
      queryClient.invalidateQueries({queryKey: [userId, 'habits']})
      queryClient.invalidateQueries({queryKey: [userId, 'habit', habitId]})
    },
    onError: (error) => {
      console.error('Error editing habit:', error);
    },
  });
}