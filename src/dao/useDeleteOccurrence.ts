import { useMutation } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const deleteOccurrence = async (userId:string | undefined, occurrenceId: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userId}/occurrences/${occurrenceId}`));
}

export const useDeleteOccurrence = (userId:string | undefined) => {
  return useMutation({
    mutationFn: ({occurrenceId}: {occurrenceId: string}) => deleteOccurrence(userId, occurrenceId),
    onSuccess: () => {
      console.log('Occurrence deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting occurrence:', error);
    },
  });
}