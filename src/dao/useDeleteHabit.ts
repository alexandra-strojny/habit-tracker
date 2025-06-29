import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { QueryClient, useMutation } from "@tanstack/react-query";

const deleteHabit = async (userId:string | undefined, habitId: string): Promise<void> => {
  const habitDoc = doc(db, `users/${userId}/habits/${habitId}`);
  await deleteDoc(habitDoc);
}

export const useDeleteHabit = (queryClient: QueryClient, userId:string | undefined) => {
  return useMutation({
    mutationFn: ({habitId}: {habitId: string}) => deleteHabit(userId, habitId),
    onSuccess: () => {
      console.log('Habit deleted successfully');
      queryClient.invalidateQueries({queryKey:[userId, 'habits']});
    },
    onError: (error) => {
      console.error('Error deleting habit:', error);
    },
  });
}