import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { useDeleteHabit } from "../dao/useDeleteHabit";
import type { Habit } from "../types/types";
import { useNavigate } from "react-router-dom";

export const DeleteWarningModal = ({
  showModal,
  setShowModal,
  habit
}: {
  showModal:boolean,
  setShowModal: (showModal:boolean) => void, 
  habit: Habit,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthUser();
  const userId = user?.uid;
  const deleteHabitMutation = useDeleteHabit(userId);

  return (<>
    {showModal && (<>
    <div className="fixed inset-0 bg-gray-500/30 z-40" onClick={() => setShowModal(false)} />
    <div className="fixed w-full max-w-md bg-white z-50 transition-transform duration-300 p-8">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Delete Habit</h3>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <p className="mb-4">Are you sure you want to delete this habit? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <PrimaryButton
                className="flex-1"
                onClick={() => {
                  deleteHabitMutation.mutate({habitId: habit.id});
                  queryClient.invalidateQueries({ queryKey: [userId, 'habits'] });
                  navigate(`/dashboard`);
                } }>
                Delete
              </PrimaryButton>
              <SecondaryButton 
                className="flex-1"
                onClick={() => setShowModal(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>)}</>
  );
}