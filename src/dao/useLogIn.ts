import { useMutation } from "@tanstack/react-query";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const logIn = async (email: string, password: string) =>{
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);
    });
}

export const useLogIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => logIn(email, password),
    onSuccess: (data) => {
      console.log('User signed in successfully:', data);
    },
    onError: (error) => {
      console.error('Error signing in:', error);
    }
  });
};