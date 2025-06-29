import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Occurrence } from "../types/types";
import { useQuery } from "@tanstack/react-query";

const queryOccurrence = async (userId:string | undefined, startTime: number, endTime:number) => {
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

export const useQueryOccurrences = (userId: string | undefined, startTime: number, endTime: number) => {
  return useQuery({
    queryKey: [userId, 'habit', 'occurrences', startTime, endTime],
    queryFn: () => queryOccurrence(userId, startTime, endTime),
    enabled: !!userId
  });
};

const queryOccurrenceByHabit = async (userId:string | undefined, habitId: string | undefined, startTime: number, endTime:number) => {
  try {
    const occurrenceRef = collection(db, `users/${userId}/occurrences`);
    const querySnapshot = await getDocs(
      query(occurrenceRef, 
        where("habitId", "==", habitId),
        where("occurrenceTimestamp", ">=", startTime),
        where("occurrenceTimestamp", "<=", endTime)
      ));
    
    const occurrences: Occurrence[] = [];
    querySnapshot.forEach((doc) => {
      occurrences.push({ id: doc.id, ...doc.data() } as Occurrence);
    });

    return occurrences;
  } catch (error) {
    console.error('Error querying occurrences:', error);
  }
}

export const useQueryOccurrencesByHabit = (userId: string | undefined, habitId:string | undefined, startTime: number, endTime: number) => {
  return useQuery({
    queryKey: [userId, 'habit', habitId, 'occurrences'],
    queryFn: () => queryOccurrenceByHabit(userId, habitId, startTime, endTime),
    enabled: !!habitId && !!userId
  });
};