import { useAuthUser } from "./dao/useAuthUser";
import { useLogOut } from "./dao/useLogOut";

export const Menu = () => {
  const user = useAuthUser();
  const logOutMutation = useLogOut();

  return (
    <div className="flex w-full px-8 py-8 shadow-sm bg-white">
      <h2 className="text-4xl">My Habits</h2>
      {user && user.uid && (
      <div className="flex justify-end items-center flex-1">
        <button 
          className='py-2 px-1 mx-3 text-primary-blue-green cursor-pointer'
          onClick={() => logOutMutation.mutate()}>
          Log out
        </button>
      </div>)}
    </div>
  );
}