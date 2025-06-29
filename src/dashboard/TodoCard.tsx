import { useQueryClient } from "@tanstack/react-query";
import { useAddOccurrence } from "../dao/useAddOccurrence";
import { useAuthUser } from "../dao/useAuthUser";
import { useQueryOccurrences } from "../dao/useQueryOccurrence";
import type { Habit } from "../types/types";
import { getCurrentWeekBounds, partition } from "../util/util";
import { ColoredCheckbox } from "../components/ColoredCheckbox";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useDeleteOccurrence } from "../dao/useDeleteOccurrence";

export const TodoCard = ({
  allHabits
}: {
  allHabits: Habit[]
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthUser();
  const userId = user?.uid;
  const { startTime, endTime } = getCurrentWeekBounds();
  const { data: allOccurrences } = useQueryOccurrences(userId, startTime, endTime);
  const addOccurrenceMutation = useAddOccurrence(queryClient, userId);
  const deleteOccurrenceMutation = useDeleteOccurrence(queryClient, userId);
  const [showCompleted, setShowCompleted] = useState(false);

  if (!allHabits || allHabits.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-md py-6 pl-6 pr-12">
        <p className="text-lg mb-4">No tasks for today</p>
      </div>
    );
  }

  const weeklyHabits = allHabits.filter((habit) => habit.frequency === 'weekly');
  const dailyHabits = allHabits.filter((habit) => habit.frequency === 'daily');

  const [dailyComplete, dailyIncomplete] = partition(dailyHabits, 
    (habit: Habit) => !allOccurrences?.some((occurrence) =>
      occurrence.habitId === habit.id &&
      new Date(occurrence.occurrenceTimestamp).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    )
  );

  const [weeklyComplete, weeklyIncomplete] = partition(weeklyHabits,
    (habit:Habit) => !allOccurrences?.some((occurrence) =>
      occurrence.habitId === habit.id
    )
  )

  const logOccurrence = async (habitId: string) => {
    const now = new Date()
    addOccurrenceMutation.mutate({ habitId, occurrenceTimestamp: now.getTime() });
  }

  const deleteOccurrence = async (habit:Habit) => {
    const startOfDay = new Date()
    const endOfDay = new Date()
    startOfDay.setHours(0,0,0,0)
    endOfDay.setHours(23,59,59,999)
    const startQuery = habit.id === 'weekly' ? startTime : startOfDay.getTime()
    const endQuery = habit.id === 'weekly' ? endTime : endOfDay.getTime()
    if (allOccurrences) {
      const entireWeekOccurrences = allOccurrences.filter(
        occurrence => occurrence.habitId === habit.id &&
        occurrence.occurrenceTimestamp >= startQuery &&
        occurrence.occurrenceTimestamp <= endQuery
      );
      entireWeekOccurrences.forEach(occurrence => deleteOccurrenceMutation.mutate({occurrenceId:occurrence.id, occurrenceTimestamp: occurrence.occurrenceTimestamp, habitId: habit.id}))
    }
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col justify-center space-y-6 gap-2">
        <div className="flex w-full">
          <p className="text-lg">Today's Tasks</p>
          <div className="flex justify-end items-center flex-1">
            <ToggleSwitch text={"Show Completed"} value={showCompleted} setValue={setShowCompleted}/>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...dailyComplete, ...weeklyComplete].length === 0 &&
            <div className="pb-2 mb-2">
              🎉
              Congrats, you've completed all tasks for today!
            </div>
          }
          {[...dailyComplete, ...weeklyComplete].map((habit) => (
              <div className="flex items-center bg-gray-100 p-2 rounded-lg mb-2" key={`today-${habit.id}`}>
                <ColoredCheckbox checked={false} toggleChecked={() => logOccurrence(habit.id)} />
                <button 
                  className="text-wrap text-sm text-right hover:text-primary-blue-green-hover hover:underline cursor-pointer ml-2"
                    onClick={()=> {
                    navigate(`/habits/${habit.id}`);
                  }}>{habit.name}
                </button>
              </div>
            ))
          }
      </div>
      {showCompleted && 
        <div className="w-full mt-2">
          <div className="text-muted text-sm mb-2">
            Completed
          </div>
          <div className="flex flex-wrap gap-2">
          {[...dailyIncomplete, ...weeklyIncomplete].map((habit) => (
                <div className="flex items-center bg-gray-100 p-2 rounded-lg mb-2">
                  <ColoredCheckbox checked={true} toggleChecked={() => deleteOccurrence(habit)} />
                  <button 
                    className="text-wrap text-muted text-sm text-right hover:text-primary-blue-green-hover hover:underline cursor-pointer ml-2"
                      onClick={()=> {
                      navigate(`/habits/${habit.id}`);
                    }}>{habit.name}
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      }
      </div>
    </div>);
}