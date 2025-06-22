import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Frequency, Habit } from "../types/types";
import { useQuery } from "@tanstack/react-query";

const queryHabits = async ({userId, frequency}: {userId:string | undefined, frequency:Frequency}) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, `users/${userId}/habits`), where("frequency", "==", frequency))
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

export const useQueryHabits = (userId: string | undefined, frequency: Frequency) => {
  return useQuery({
    queryKey: [userId, 'habits', frequency],
    queryFn: () => queryHabits({ userId, frequency }),
    enabled: userId !== undefined && frequency !== undefined,
  });
};