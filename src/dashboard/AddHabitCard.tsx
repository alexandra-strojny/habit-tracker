import { useState } from "react";
import { useAddHabit } from "../dao/useAddHabit";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";

export const AddHabitCard = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily'|'weekly'>('daily');
  const userId = user?.uid;
  const addHabitMutation = useAddHabit(userId);
  
  return (
    <div className="basis-1/5 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Add Habit</h3>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Habit Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          required
        />
        <select 
          className="w-full p-2 border border-gray-300 rounded"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
          required
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          type="submit"
          className="w-full bg-primary-blue-green text-white py-2 rounded hover:bg-primary-blue-green-hover transition"
          onClick={(e) => {
            addHabitMutation.mutate({ name: habitName, frequency });
            setHabitName('');
            e.preventDefault();
            queryClient.invalidateQueries({ queryKey: [userId, 'habits', frequency] });
          }}
        >
          Add Habit
        </button>
      </form>
    </div>
  );
}