import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MOCK_USER_ID = 'mockUser123'; // 🔐 Normally comes from Firebase Auth

export async function addHabit(habit: {
  name: string;
  frequency: 'daily' | 'weekly';
}) {
  try {
    const habitRef = collection(db, `users/${MOCK_USER_ID}/habits`);
    const doc = await addDoc(habitRef, {
      name: habit.name,
      frequency: habit.frequency,
      createdAt: serverTimestamp(),
    });

    console.log('Habit created with ID:', doc.id);
  } catch (error) {
    console.error('Error adding habit:', error);
  }
}

export async function testSimpleWrite() {
  try {
    const ref = collection(db, 'testCollection');
    const doc = await addDoc(ref, {
      test: 'hello world',
    });
    console.log('Simple write succeeded with ID:', doc.id);
  } catch (error) {
    console.error('Simple write error:', error);
  }
}