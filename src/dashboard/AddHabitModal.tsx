import { useState } from "react";
import { useAddHabit } from "../dao/useAddHabit";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";
import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";

export const AddHabitModal = ({showModal, setShowModal}: {showModal:boolean, setShowModal: (showModal:boolean)=>void}) => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily'|'weekly'>('daily');
  const userId = user?.uid;
  const addHabitMutation = useAddHabit(userId);
  
  return (<>
    {showModal && (<><div
      className="fixed inset-0 bg-gray-500/30 z-40"
      onClick={() => setShowModal(false)} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transition-transform duration-300 p-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Habit</h3>
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
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required />
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <PrimaryButton
                className="flex-1"
                onClick={() => {
                  addHabitMutation.mutate({ name: habitName, frequency });
                  setHabitName('');
                  queryClient.invalidateQueries({ queryKey: [userId, 'habits', frequency] });
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
      </div></>)}</>
  );
}