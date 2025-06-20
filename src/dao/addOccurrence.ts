import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const MOCK_USER_ID = 'mockUser123'; // 🔐 Normally comes from Firebase Auth

export async function addOccurrence(
  habitId: string
) {
  try {
    const occurrenceRef = collection(db, `users/${MOCK_USER_ID}/occurrences`);
    const now = new Date();
    const occurrenceTimestamp = now.getTime();
    const doc = await addDoc(occurrenceRef, {
      habitId: habitId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      occurrenceTimestamp: occurrenceTimestamp,
    });

    console.log('Habit logged with occurrence ID:', doc.id);
  } catch (error) {
    console.error('Error adding occurrence:', error);
  }
}