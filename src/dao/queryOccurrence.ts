import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Occurrence } from "../types/types";
import { useQuery } from "@tanstack/react-query";

export const queryOccurrence = async (userId:string, startTime: number, endTime:number) => {
  try {
    const occurrenceRef = collection(db, `users/${userId}/occurrences`);
    const querySnapshot = await getDocs(query(occurrenceRef, where("occurrenceTimestamp", ">=", startTime), where("occurrenceTimestamp", "<=", endTime)));
    
    const occurrences: Occurrence[] = [];
    querySnapshot.forEach((doc) => {
      occurrences.push({ id: doc.id, ...doc.data() } as Occurrence);
    });

    return occurrences;
  } catch (error) {
    console.error('Error querying occurrences:', error);
  }
}

export const useQueryOccurrence = (userId: string, startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['occurrences', startTime, endTime],
    queryFn: () => queryOccurrence(userId, startTime, endTime),
  });
};
