import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useMutation } from '@tanstack/react-query';

const addOccurrence = async (
  user: string | undefined,
  habitId: string,
  occurrenceTimestamp: number
) => {
    await addDoc(collection(db, `users/${user}/occurrences`), {
      habitId: habitId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      occurrenceTimestamp,
    });
}

export const useAddOccurrence = (user: string | undefined) => {
  return useMutation({
    mutationFn: ({habitId, occurrenceTimestamp}: {habitId: string, occurrenceTimestamp: number}) => addOccurrence(user, habitId, occurrenceTimestamp),
    onSuccess: () => {
      console.log('Occurrence added successfully');
    },
    onError: (error) => {
      console.error('Error adding occurrence:', error);
    },
  });
};