import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "./dao/useAuthUser";

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthUser();

  const selectedClass = "py-2 px-1 mx-3 border-b-2 border-primary-blue-green-hover hover:border-primary-blue-green-hover hover:text-primary-blue-green-hover cursor-pointer";
  const unselectedClass = "py-2 px-1 mx-3 border-b-2 border-background-light hover:border-primary-blue-green-hover hover:text-primary-blue-green-hover cursor-pointer";

  return (
    <div className="flex w-full p-8">
      <h2 className="text-4xl">My Habits</h2>
      {user && user.uid && (
      <div className="flex justify-end items-center flex-1">
        <button 
          className={location.pathname === '/dashboard' ? selectedClass : unselectedClass}
          onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
        <button 
          className={location.pathname === '/all-habits' ? selectedClass : unselectedClass}
          onClick={() => navigate('/all-habits')}>
          All Habits
        </button>
        <button 
          className={location.pathname === '/user' ? selectedClass : unselectedClass}
          onClick={() => navigate('/user')}>
          User
        </button>
      </div>)}
    </div>
  );
}