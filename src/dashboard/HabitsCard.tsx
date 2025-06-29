import { CircularButton } from "../components/CircularButton";
import type { Frequency, Habit } from "../types/types";
import { useQueryOccurrences } from "../dao/useQueryOccurrence";
import { formatShortDate, formatShortDateAsWeek, getCurrentBiMonthlyBounds, getCurrentBiMonthlyDates, getCurrentWeekBounds, getCurrentWeekDates, getWeekBounds } from "../util/util";
import { useAddOccurrence } from "../dao/useAddOccurrence";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "../dao/useAuthUser";
import { useDeleteOccurrence } from "../dao/useDeleteOccurrence";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const HabitsCard = ({allHabits, frequency}: {allHabits: Habit[] | undefined, frequency: Frequency}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isDaily = frequency === 'daily';
  const user = useAuthUser();
  const userId = user?.uid;
  const addOccurrenceMutation = useAddOccurrence(queryClient, userId);
  const deleteOccurrenceMutation = useDeleteOccurrence(queryClient, userId);
  const [occurrenceKey, setOccurrenceKey] = useState<string>('');

  const dates = isDaily ? getCurrentWeekDates() : getCurrentBiMonthlyDates();

  const title = isDaily ? "Daily Streak" : "Weekly Streak";
  const frequencyHabits = allHabits?.filter((habit) => habit.frequency === frequency);

  const { startTime, endTime } = isDaily ? getCurrentWeekBounds() : getCurrentBiMonthlyBounds(dates);
  const { data: allOccurrences } = useQueryOccurrences(userId, startTime, endTime);

  const findWeeklyOccurrence = (habit: Habit, date: Date) => {
    const { startTime, endTime } = getWeekBounds(date)
    return allOccurrences?.find(
      (occ) =>
        occ.habitId === habit.id &&
        occ.occurrenceTimestamp >= startTime &&
        occ.occurrenceTimestamp <= endTime
    )
  }

  const logOccurrence = async (index: number, habitId: string, date: Date) => {
    setOccurrenceKey(`${habitId}-date-${index}`)
    const occurrenceTimestamp = date.getTime();
    addOccurrenceMutation.mutate({ habitId, occurrenceTimestamp });
  }

  const deleteOccurrence = async (index: number, occurrenceId: string, habit:Habit, date: Date) => {
    setOccurrenceKey(`${habit.id}-date-${index}`)
    if (allOccurrences && habit.frequency === 'weekly') {
      const { startTime, endTime } = getWeekBounds(date)
      const entireWeekOccurrences = allOccurrences.filter(
        occurrence => occurrence.habitId === habit.id &&
        occurrence.occurrenceTimestamp >= startTime &&
        occurrence.occurrenceTimestamp <= endTime
      );
      entireWeekOccurrences.forEach(occurrence => deleteOccurrenceMutation.mutate({occurrenceId:occurrence.id, occurrenceTimestamp: occurrence.occurrenceTimestamp, habitId:habit.id}))
    } else {
      deleteOccurrenceMutation.mutate({ occurrenceId, occurrenceTimestamp: date.getTime(), habitId:habit.id });
    }
  }

  const generateDateRow = () => {
    const today = new Date();
    const shouldHighlightToday = (date: Date) => {
      if (isDaily) {
        return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
      }
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return startOfWeek.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
    };
    return dates.map((date) => (
      <span
        key={date.toISOString()}
        className={`block text-wrap md:text-nowrap text-xs text-center text-muted-text -rotate-0 md:-rotate-45 pl-2 ${shouldHighlightToday(date) ? 'text-primary-blue-green font-bold' : ''}`}
      >
        {isDaily ? formatShortDate(date) : formatShortDateAsWeek(date)}
      </span>
    ));
  };

  const generateHabitRow = (habit: Habit) => {
    const gridClass = isDaily ? 'grid-cols-10 md:grid-cols-9' : 'grid-cols-8 md:grid-cols-7'
    return (
      <div key={habit.id} className={`grid ${gridClass} gap-4 mb-2 items-center`}>
        <div className="col-span-3 md:col-span-2 text-xs text-muted-text text-right">
          <button 
          className="text-wrap text-right hover:text-primary-blue-green-hover hover:underline cursor-pointer"
            onClick={()=> {
            navigate(`/habits/${habit.id}`);
          }}>{habit.name}</button>
        </div>
        {dates.map((date, index) => {
          const occurrence = isDaily ? allOccurrences?.find(
            (occ) =>
              occ.habitId === habit.id &&
              new Date(occ.occurrenceTimestamp).setHours(0, 0, 0, 0) === date.getTime()
          ) : findWeeklyOccurrence(habit, date)
          const key = `${habit.id}-date-${index}`
          return (
            <div
              key={key}
              className="col-span-1 flex justify-center"
            >
              {
                (deleteOccurrenceMutation.isPending || addOccurrenceMutation.isPending) && occurrenceKey === key ?
                  <CircularButton state={'loading'} onClick={() => {}} /> :
                  occurrence ? (
                    <CircularButton state={'filled'} onClick={() => deleteOccurrence(index, occurrence.id, habit, date)} />
                  ) : (
                    <CircularButton state={'empty'} onClick={() => logOccurrence(index, habit.id, date)} />
                  )
              }
            </div>
          );
        })}
      </div>
    );
  };

  return (<>
    <div className={`flex-1 bg-white rounded-xl shadow-md py-2 pl-2 pr-8 md:pl-2 md:pr-10 lg:pl-6 lg:pr-12`}>
      <div className="flex flex-col justify-center space-y-6 ">
        <p className={isDaily ? 'mb-4 md:mb-8 lg:mb-10' : 'mb-4 md:mb-14 lg:mb-16'}>{title}</p>
        {/* Dates row */}
        {!frequencyHabits || frequencyHabits.length === 0 ? (
          <div className="text-center text-muted-text">No habits found</div>
        ) : (
          <>
            <div className={`grid ${isDaily ? 'grid-cols-10 md:grid-cols-9' : 'grid-cols-8 md:grid-cols-7'} gap-4 items-end mb-2`}>
              <div className="col-span-3 md:col-span-2"></div> {/* Empty cell for alignment */}
              {generateDateRow()}
            </div>
            {frequencyHabits.map((habit) => generateHabitRow(habit))}
          </>
        )}
      </div>
    </div>
  </>);
};