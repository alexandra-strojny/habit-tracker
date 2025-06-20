import { AddHabitCard } from "./AddHabitCard";
import { HabitsCard } from "./HabitsCard";


export const Dashboard = () => {
  return (
    <>
      <h2 className="text-4xl">My Habits</h2>
      <div className="flex flex-col md:flex-row gap-2">
        <HabitsCard frequency="daily" />
        <HabitsCard frequency="weekly" />
        <AddHabitCard />
      </div>
    </>
  );
}