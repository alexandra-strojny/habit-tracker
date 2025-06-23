import { AddHabitCard } from "./AddHabitCard";
import { HabitsCard } from "./HabitsCard";

export const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch gap-2 mt-4 mb-4 px-6">
        <HabitsCard frequency="daily"/>
        <HabitsCard frequency="weekly" />
      </div>
      <AddHabitCard />
    </>
  );
}