import { useMutation } from "@tanstack/react-query";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const createUser = async (email: string, password: string) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error creating user:', errorCode, errorMessage);
    });
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => createUser(email, password),
    onSuccess: (data) => {
      console.log('User created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    }
  })
}