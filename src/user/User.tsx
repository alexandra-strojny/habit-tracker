import { PrimaryButton } from "../components/PrimaryButton";
import { useAuthUser } from "../dao/useAuthUser";
import { useLogOut } from "../dao/useLogOut";

export const User = () => {
  const user = useAuthUser();
  const logOutMutation = useLogOut();

  const getDisplayName = () => {
    if (!user) return "Guest";
    return user.displayName || user.email?.split('@')[0] || "User";
  };

  return (
    <div className="flex flex-col gap-2 mt-4 mb-4 px-6 h-screen">
      <h1 className="text-2xl mb-4">Hello, {getDisplayName()}</h1>
      <div>
        <PrimaryButton onClick={() => logOutMutation.mutate()}>
          Log out
        </PrimaryButton>
      </div>
    </div>
  );
}