import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useMutation } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/query-core';

const addHabit = async (userId: string | undefined, habit: {
  name: string;
  frequency: 'daily' | 'weekly';
}) =>{
  await addDoc(collection(db, `users/${userId}/habits`), {
    name: habit.name,
    frequency: habit.frequency,
    createdAt: serverTimestamp(),
    streaks: []
  });
}

export const useAddHabit = (queryClient: QueryClient, userId: string | undefined) => {
  return useMutation({
    mutationFn: (habit: { name: string; frequency: 'daily' | 'weekly' }) => addHabit(userId, habit),
    onSuccess: () => {
      console.log('Habit added successfully');
      queryClient.invalidateQueries({ queryKey: [userId, 'habits'] });
    },
    onError: (error) => {
      console.error('Error adding habit:', error);
    },
  })
}