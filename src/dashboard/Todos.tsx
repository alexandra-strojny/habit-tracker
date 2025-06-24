import { useQueryClient } from "@tanstack/react-query";
import { useAddOccurrence } from "../dao/useAddOccurrence";
import { useAuthUser } from "../dao/useAuthUser";
import { useQueryOccurrences } from "../dao/useQueryOccurrence";
import type { Habit } from "../types/types";
import { getCurrentWeekBounds } from "./util";
import { ColoredCheckbox } from "../components/ColoredCheckbox";
import { useNavigate } from "react-router-dom";

export const Todos = ({
  allHabits
}: {
  allHabits: Habit[]
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthUser();
  const userId = user?.uid;
  const { startTime, endTime } = getCurrentWeekBounds();
  const { data: occurrences } = useQueryOccurrences(userId, startTime, endTime);
  const addOccurrenceMutation = useAddOccurrence(userId);

  if (!allHabits || allHabits.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-md py-6 pl-6 pr-12">
        <p className="text-lg mb-4">No tasks for today</p>
      </div>
    );
  }

  const weeklyHabits = allHabits.filter((habit) => habit.frequency === 'weekly');
  const dailyHabits = allHabits.filter((habit) => habit.frequency === 'daily');

  const todaysDailyHabits = dailyHabits.filter((habit) => {
    return !occurrences?.some((occurrence) =>
      occurrence.habitId === habit.id &&
      new Date(occurrence.occurrenceTimestamp).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    );
  });

  const todaysWeeklyHabits = weeklyHabits.filter((habit) => {
    return !occurrences?.some((occurrence) =>
      occurrence.habitId === habit.id
    );
  });

  const logOccurrence = async (habitId: string, date: Date) => {
    const occurrenceTimestamp = date.getTime();
    addOccurrenceMutation.mutate({ habitId, occurrenceTimestamp });
    queryClient.invalidateQueries({queryKey:[userId, "occurrences"]});
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md py-6 pl-6 pr-12">
      <div className="flex flex-col justify-center space-y-6gap-4">
        <p className="text-lg mb-4">Today's Tasks</p>
        <div className="flex flex-wrap gap-2">
          {[...todaysDailyHabits, ...todaysWeeklyHabits].length === 0 &&
          <div className="pb-2 mb-2">
            🎉
            Congrats, you've completed all task for today!
          </div>}
      {[...todaysDailyHabits, ...todaysWeeklyHabits].map((habit) => (
          <div className="flex items-center bg-gray-100 p-2 rounded-lg mb-2">
            <ColoredCheckbox checked={false} toggleChecked={() => logOccurrence(habit.id, new Date())} />
            <button 
              className="text-wrap text-sm text-right hover:text-primary-blue-green-hover hover:underline cursor-pointer ml-2"
                onClick={()=> {
                navigate(`/habits/${habit.id}`);
              }}>{habit.name}
            </button>
          </div>
      ))}
      </div>
      </div>
    </div>);
}