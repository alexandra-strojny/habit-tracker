import { useState } from "react";
import { AddHabitModal } from "./AddHabitModal";
import { HabitsCard } from "./HabitsCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { TodoCard } from "./TodoCard";
import { useQueryAllHabits } from "../dao/useQueryAllHabits";
import { useAuthUser } from "../dao/useAuthUser";

export const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthUser();
  const userId = user?.uid;
  const { data: allHabits, isError, isLoading } = useQueryAllHabits(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !allHabits) {
    return <div>Error loading habits</div>;
  }

  return (
    <>
      <div className="flex justify-end pt-4 pr-6">
        <PrimaryButton
          className="px-4 py-2 rounded shadow"
          onClick={() => setShowModal(true)}
        >
          Add Habit
        </PrimaryButton>
      </div>
      <div className="mt-4 mb-4 px-6">
        <TodoCard allHabits={allHabits} />
      </div>
      <div className="flex flex-col md:flex-row items-stretch gap-2 mt-4 mb-4 px-6">
        <HabitsCard frequency="daily" allHabits={allHabits} />
        <HabitsCard frequency="weekly" allHabits={allHabits} />
      </div>
      <AddHabitModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};