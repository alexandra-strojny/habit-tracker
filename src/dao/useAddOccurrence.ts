import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { queryHabit } from './useQueryHabit';
import type { Frequency, Streak } from '../types/types';
import { roundToStartOfDay } from '../util/roundToStartOfDay';

const insertStreak = (streaks: Streak[], timestamp: number): Streak[] =>{
  const newStreak: Streak = { startDate: timestamp, endDate: timestamp };
  const result = [...streaks];

  // Insert while maintaining order
  let inserted = false;
  for (let i = 0; i < result.length; i++) {
    if (timestamp < result[i].startDate) {
      result.splice(i, 0, newStreak);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    result.push(newStreak);
  }

  return result;
}

const mergeStreaks = (streaks: Streak[], frequency: Frequency): Streak[] => {
  if (streaks.length === 0) return [];

  const buffer = frequency === 'weekly' ? 7 * 86400000 : 86400000;

  const merged: Streak[] = [];
  let current = { ...streaks[0] };

  for (let i = 1; i < streaks.length; i++) {
    const next = streaks[i];
    const gap = next.startDate - current.endDate;

    if (gap <= buffer) {
      current.endDate = Math.max(current.endDate, next.endDate);
    } else {
      merged.push(current);
      current = { ...next };
    }
  }

  merged.push(current);
  return merged;
}


const addOccurrence = async (
  user: string | undefined,
  habitId: string,
  occurrenceTimestamp: number
) => {
    const habit = await queryHabit(user, habitId)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const normalized = roundToStartOfDay(occurrenceTimestamp);
    const withNew = insertStreak(habit.streaks, normalized);
    const newStreaks = mergeStreaks(withNew, habit.frequency);
    await addDoc(collection(db, `users/${user}/occurrences`), {
      habitId,
      timezone,
      occurrenceTimestamp
    });
    await updateDoc(doc(db, `users/${user}/habits/${habitId}`), {
      ...habit,
      updatedAt: serverTimestamp(),
      streaks: newStreaks
    });
    return habitId 
}

export const useAddOccurrence = (queryClient: QueryClient, user: string | undefined) => {
  return useMutation({
    mutationFn: ({habitId, occurrenceTimestamp}: {habitId: string, occurrenceTimestamp: number}) => addOccurrence(user, habitId, occurrenceTimestamp),
    onSuccess: (habitId) => {
      console.log('Occurrence added successfully', habitId);
      queryClient.invalidateQueries({queryKey:[user, 'habit']});
    },
    onError: (error) => {
      console.error('Error adding occurrence:', error);
    },
  });
};