import { useLocation } from "react-router-dom";
import { useAuthUser } from "../dao/useAuthUser";
import { useQueryHabit } from "../dao/useQueryHabit";
import { PrimaryButton } from "../components/PrimaryButton";
import { useState } from "react";
import { EditHabitModal } from "./EditHabitModal";
import { SecondaryButton } from "../components/SecondaryButton";
import { DeleteWarningModal } from "./DeleteWarningModal";

export const DetailedHabit = () => {
  const location = useLocation();
  const user = useAuthUser();
  const userId = user?.uid;
  const habitId = location.pathname.split('/').pop();
  const { data: habit, isLoading, isError } = useQueryHabit(userId, habitId || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  if (isError || !habit) {
    return <div className="text-center text-red-500">Error loading habit details.</div>;
  }
  
  return (
    <>
      <div className="flex justify-end pt-4 pr-6">
        <PrimaryButton
          className="px-4 py-2 rounded shadow"
          onClick={() => setShowEditModal(true)}
        >
          Edit Habit
        </PrimaryButton>
        <SecondaryButton
          className="px-4 py-2 rounded shadow ml-2"
          onClick={() => setShowDeleteWarning(true)}
        >
          Delete
        </SecondaryButton>
      </div>
      <div className="flex flex-col items-center m-4">
        <div className="bg-white rounded-xl shadow-md py-6 pl-6 pr-12">
          <h1 className="text-2xl font-bold mb-4">{habit?.name}</h1>
          <p className="text-gray-600 mb-6">This is where you can view and manage your habit details.</p>
        </div>
        <EditHabitModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          defaultHabit={habit} />
        <DeleteWarningModal
          showModal={showDeleteWarning}
          setShowModal={setShowDeleteWarning}
          habit={habit}
        />
      </div>
    </>
  );
}