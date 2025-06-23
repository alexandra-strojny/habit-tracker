import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const useAuthUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  return currentUser
};

export const getDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  if (user.displayName) return user.displayName;
  if (user.email) return user.email.split('@')[0];
  return 'User';
}