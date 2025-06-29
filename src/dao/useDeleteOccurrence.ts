import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Frequency, Streak } from "../types/types";
import { queryHabit } from "./useQueryHabit";
import { roundToStartOfDay } from "../util/roundToStartOfDay";

const removeDateFromStreaks = (
  streaks: Streak[],
  timestamp: number,
  frequency: Frequency,
): Streak[] => {
  const buffer = frequency === 'weekly' ? 7 * 86400000 : 86400000;

  return streaks.flatMap(streak => {
    if (timestamp < streak.startDate || timestamp > streak.endDate) return [streak];

    const isSingle = streak.startDate === streak.endDate;
    if (isSingle && timestamp === streak.startDate) return [];

    if (timestamp === streak.startDate) {
      return [{ startDate: streak.startDate + buffer, endDate: streak.endDate }];
    }

    if (timestamp === streak.endDate) {
      return [{ startDate: streak.startDate, endDate: streak.endDate - buffer }];
    }

    return [
      { startDate: streak.startDate, endDate: timestamp - buffer },
      { startDate: timestamp + buffer, endDate: streak.endDate },
    ];
  });
}


const deleteOccurrence = async (userId:string | undefined, occurrenceId: string, occurrenceTimestamp:number, habitId: string | undefined): Promise<string | undefined> => {
  const habit = await queryHabit(userId, habitId)
  const normalized = roundToStartOfDay(occurrenceTimestamp);
  const newStreaks = removeDateFromStreaks(habit.streaks, normalized, habit.frequency)
  await deleteDoc(doc(db, `users/${userId}/occurrences/${occurrenceId}`));
  await updateDoc(doc(db, `users/${userId}/habits/${habitId}`), {
    ...habit,
    updatedAt: serverTimestamp(),
    streaks: newStreaks
  }); 
  return habitId
}

export const useDeleteOccurrence = (queryClient: QueryClient, userId:string | undefined) => {
  return useMutation({
    mutationFn: ({occurrenceId, occurrenceTimestamp, habitId}: {occurrenceId: string, occurrenceTimestamp:number, habitId: string | undefined}) => 
      deleteOccurrence(userId, occurrenceId, occurrenceTimestamp, habitId),
    onSuccess: () => {
      console.log('Occurrence deleted successfully');
      queryClient.invalidateQueries({queryKey:[userId, 'habit']});
    },
    onError: (error) => {
      console.error('Error deleting occurrence:', error);
    },
  });
}