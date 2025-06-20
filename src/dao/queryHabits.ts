import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Frequency, Habit } from "../types/types";
import { useQuery } from "@tanstack/react-query";

export const queryHabits = async ({userId, frequency}: {userId:string, frequency:Frequency}) => {
  try {
    const habitRef = collection(db, `users/${userId}/habits`);
    const querySnapshot = await getDocs(
      query(habitRef, where("frequency", "==", frequency))
    );

    const habits: Habit[] = [];
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() } as Habit);
    });

    return habits;
  } catch (error) {
    console.error('Error querying habits:', error);
  }
}

export const useQueryHabits = (userId: string, frequency: Frequency) => {
  return useQuery({
    queryKey: ['habits', frequency],
    queryFn: () => queryHabits({ userId, frequency }),
  });
};