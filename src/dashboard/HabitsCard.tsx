import { CircularButton } from "../components/CircularButton";
import type { Frequency, Habit } from "../types/types";
import { useQueryHabits } from "../dao/useQueryHabits";
import { useQueryOccurrences } from "../dao/useQueryOccurrence";
import { formatShortDate, formatShortDateAsWeek, getCurrentBiMonthlyBounds, getCurrentBiMonthlyDates, getCurrentWeekBounds, getCurrentWeekDates } from "./util";
import { EmptyCircularButton } from "../components/EmptyCircularButton";
import { useAddOccurrence } from "../dao/useAddOccurrence";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";

export const HabitsCard = ({frequency}: {frequency: Frequency}) => {
  const queryClient = useQueryClient();
  const isDaily = frequency === 'daily';
  const { user } = useAuthUser();
  const userId = user?.uid;
  const addOccurrenceMutation = useAddOccurrence(user?.uid);

  const dates = isDaily ? getCurrentWeekDates() : getCurrentBiMonthlyDates();

  const title = isDaily ? "Daily Habits" : "Weekly Habits";
  const { data: allHabits, isError, isLoading } = useQueryHabits(
    userId,
    frequency
  );

  const { startTime, endTime } = isDaily ? getCurrentWeekBounds() : getCurrentBiMonthlyBounds(dates);
  const { data: allOccurrences } = useQueryOccurrences(userId, startTime, endTime);

  const logOccurrence = async (habitId: string, date: Date) => {
    const occurrenceTimestamp = date.getTime();
    addOccurrenceMutation.mutate({ habitId, occurrenceTimestamp });
    queryClient.invalidateQueries({queryKey:[userId, "occurrences", startTime, endTime]});
  }

  const generateDateRow = () => {
    return dates.map((date) => (
      <span
        key={date.toISOString()}
        className="block text-nowrap text-xs text-center text-muted-text -rotate-45 pl-2"
      >
        {isDaily ? formatShortDate(date) : formatShortDateAsWeek(date)}
      </span>
    ));
  };

  const generateHabitRow = (habit: Habit) => {
    return (
      <div key={habit.id} className="grid grid-cols-9 gap-4 mb-2 items-end">
        <div className="col-span-2 text-xs text-muted-text truncate">
          {habit.name}
        </div>
        {dates.map((date, index) => {
          const occurrence = allOccurrences?.find(
            (occ) =>
              occ.habitId === habit.id &&
              new Date(occ.occurrenceTimestamp).setHours(0, 0, 0, 0) === date.getTime()
          );

          return (
            <div
              key={`${habit.id}-date-${index}`}
              className="col-span-1 flex justify-center"
            >
              {occurrence ? (
                <CircularButton onClick={() => console.log("here")} />
              ) : (
                <EmptyCircularButton onClick={() => logOccurrence(habit.id, date)} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading habits</div>;
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md py-6 pl-6 pr-12">
      <div className="flex flex-col justify-center space-y-6 ">
        <p className={isDaily ? 'mb-6' : 'mb-12'}>{title}</p>
        {/* Dates row */}
        <div className="grid grid-cols-9 gap-4 items-end mb-4">
          <div className="col-span-2"></div> {/* Empty cell for alignment */}
          {generateDateRow()}
        </div>
        {!allHabits || allHabits.length === 0 ? (
          <div className="text-center text-muted-text">No habits found</div>
        ) : (
          allHabits.map((habit) => generateHabitRow(habit))
        )}
      </div>
    </div>
  );
};