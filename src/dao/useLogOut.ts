import { useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

const logout = async () => {
  const auth = getAuth();
  await auth.signOut()
    .then(() => {
      console.log('User signed out successfully');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
};

export const useLogOut = () => {
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      console.log('User logged out successfully');
    },
    onError: (error) => {
      console.error('Error logging out:', error);
    }
  });
}