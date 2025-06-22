import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useMutation } from '@tanstack/react-query';

const addHabit = async (userId: string | undefined, habit: {
  name: string;
  frequency: 'daily' | 'weekly';
}) =>{
  await addDoc(collection(db, `users/${userId}/habits`), {
    name: habit.name,
    frequency: habit.frequency,
    createdAt: serverTimestamp(),
  });
}

export const useAddHabit = (userId: string | undefined) => {
  return useMutation({
    mutationFn: (habit: { name: string; frequency: 'daily' | 'weekly' }) => addHabit(userId, habit),
    onSuccess: () => {
      console.log('Habit added successfully');
    },
    onError: (error) => {
      console.error('Error adding habit:', error);
    },
  })
}