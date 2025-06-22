import { AddHabitCard } from "./AddHabitCard";
import { HabitsCard } from "./HabitsCard";

export const Dashboard = () => {
  return (
    <div className='bg-background-light w-full h-screen p-8'>
      <h2 className="text-4xl">My Habits</h2>
      <div className="flex flex-col md:flex-row items-start gap-2 mt-4 mb-4">
        <HabitsCard frequency="daily"/>
        <HabitsCard frequency="weekly" />
      </div>
      <AddHabitCard />
    </div>
  );
}