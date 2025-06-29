import { doc, getDoc } from "firebase/firestore";
import type { Habit } from "../types/types";
import { db } from "../firebase";
import { useQuery } from "@tanstack/react-query";

export const queryHabit = async (userId: string | undefined, habitId: string | undefined) => {
  const habit = await getDoc(doc(db, `users/${userId}/habits/${habitId}`));
  if (habit.exists()) {
    return { id: habit.id, ...habit.data() } as Habit;
  }
  throw new Error('Habit not found');
};

export const useQueryHabit = (userId: string | undefined, habitId: string | undefined) => {
  return useQuery({
    queryKey: [userId, 'habit', habitId],
    queryFn: () => queryHabit(userId, habitId),
    enabled: !!habitId || !!userId,
  });
}