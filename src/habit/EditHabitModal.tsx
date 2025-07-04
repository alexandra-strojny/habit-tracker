import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import type { Habit } from "../types/types";
import { useEditHabit } from "../dao/useEditHabit";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";

export const EditHabitModal = ({
  showModal,
  setShowModal,
  defaultHabit
}: {
  showModal:boolean,
  setShowModal: (showModal:boolean) => void, 
  defaultHabit: Habit,
}) => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const userId = user?.uid;
  const [habit, setHabit] = useState<Habit>(defaultHabit || { id: '', name: '', frequency: 'daily' });
  const editHabitMutation = useEditHabit(queryClient, userId, habit?.id || '');

  const setHabitName = (name: string) => {
    setHabit({ ...habit, name });
  };
  const setFrequency = (frequency: 'daily' | 'weekly') => {
    setHabit({ ...habit, frequency });
  };

  return (<>
    {showModal && (<>
    <div className="fixed inset-0 bg-gray-500/30 z-40" onClick={() => setShowModal(false)} />
    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transition-transform duration-300 p-8">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Habit</h3>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Habit Name"
              className="w-full p-2 border border-gray-300 rounded"
              value={habit.name}
              onChange={(e) => setHabitName(e.target.value)}
              required />
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={habit.frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="text-xs text-muted-text">
              <AiFillWarning className="inline mr-1" />
              Changing the frequency may not accurately capture your previously logged occurrences.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <PrimaryButton
                className="flex-1"
                onClick={() => {
                  editHabitMutation.mutate({ ...habit, name: habit.name, frequency: habit.frequency });
                  setShowModal(false);
                } }>
                Submit
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