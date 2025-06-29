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
  const msPerDay = 86400000;
  const buffer = frequency === 'daily' ? msPerDay : 7 * msPerDay;

  return streaks.flatMap(streak => {
    // If the date is outside this streak, leave it untouched
    if (timestamp < streak.startDate || timestamp > streak.endDate) {
      return [streak];
    }

    const isSingleDay = streak.startDate === streak.endDate;

    // If this is a single-day streak and we’re removing it → remove it
    if (isSingleDay && streak.startDate === timestamp) {
      return [];
    }

    // If the timestamp is exactly the start
    if (timestamp === streak.startDate) {
      return [
        {
          startDate: streak.startDate + buffer,
          endDate: streak.endDate,
        },
      ];
    }

    // If the timestamp is exactly the end
    if (timestamp === streak.endDate) {
      return [
        {
          startDate: streak.startDate,
          endDate: streak.endDate - buffer,
        },
      ];
    }

    // Otherwise, split into two streaks
    return [
      {
        startDate: streak.startDate,
        endDate: timestamp - buffer,
      },
      {
        startDate: timestamp + buffer,
        endDate: streak.endDate,
      },
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