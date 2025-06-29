import { useLocation } from "react-router-dom";
import { useAuthUser } from "../dao/useAuthUser";
import { useQueryHabit } from "../dao/useQueryHabit";
import { PrimaryButton } from "../components/PrimaryButton";
import { useState } from "react";
import { EditHabitModal } from "./EditHabitModal";
import { SecondaryButton } from "../components/SecondaryButton";
import { DeleteWarningModal } from "./DeleteWarningModal";
import { BackButton } from "../components/BackButton";
import { analyzeStreaks, getTimeSpan } from "../util/util1";
import { useQueryOccurrencesByHabit } from "../dao/useQueryOccurrence";
import { useAddOccurrence } from "../dao/useAddOccurrence";
import { useQueryClient } from "@tanstack/react-query";
import { DayCircleButton } from "./DayCircleButton";
import { WeekCircleButton } from "./WeekCircleButton";
import { getCurrentBiMonthlyDates, getWeekBounds } from "../util/util";
import { useDeleteOccurrence } from "../dao/useDeleteOccurrence";
import { Loader2 } from "lucide-react";

export const DetailedHabit = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const user = useAuthUser();
  const userId = user?.uid;
  const habitId = location.pathname.split('/').pop();
  const addOccurrenceMutation = useAddOccurrence(queryClient, userId);
  const deleteOccurrenceMutation = useDeleteOccurrence(queryClient, userId);
  const { data: habit, isLoading: habitLoading, isError: habitError } = useQueryHabit(userId, habitId || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [occurrenceKey, setOccurrenceKey] = useState<string>('');
  const { startTime, endTime } = getTimeSpan()
  const { data: allOccurrences, isLoading: occurrenceLoading, isError: occurrenceError } = useQueryOccurrencesByHabit(userId, habitId, startTime, endTime)

  if (habitLoading || occurrenceLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  if (habitError || !habit || occurrenceError || !allOccurrences) {
    return <div className="text-center text-red-500">Error loading habit details.</div>;
  }

  const occurrenceDates = allOccurrences.map(occurrence => new Date(occurrence.occurrenceTimestamp))
  const today = new Date()
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1)
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth()-1, 1)
  const nextMonthDate = new Date(today.getFullYear(), today.getMonth()+1, 1)

  const logOccurrence = async (key: string, date: Date) => {
    setOccurrenceKey(key)
    const occurrenceTimestamp = date.getTime();
    addOccurrenceMutation.mutate({ habitId: habit.id, occurrenceTimestamp });
  }

  const deleteOccurrence = async (key: string, date: Date) => {
    setOccurrenceKey(key)
    const occurrenceTimestamp = date.getTime()
    const occurrence = allOccurrences.find(currentOccurrence => currentOccurrence.occurrenceTimestamp === occurrenceTimestamp)
    if (allOccurrences && habit.frequency === 'weekly') {
      const { startTime, endTime } = getWeekBounds(date)
      const entireWeekOccurrences = allOccurrences.filter(
        occurrence => occurrence.habitId === habit.id &&
        occurrence.occurrenceTimestamp >= startTime &&
        occurrence.occurrenceTimestamp <= endTime
      );
      entireWeekOccurrences.forEach(occurrence => deleteOccurrenceMutation.mutate({occurrenceId:occurrence.id, occurrenceTimestamp: occurrence.occurrenceTimestamp, habitId:habit.id}))
    } else if (occurrence) {
      deleteOccurrenceMutation.mutate({ occurrenceId: occurrence.id, occurrenceTimestamp: occurrence.occurrenceTimestamp, habitId: habit.id });
    }
  }

  const generateMonthView = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()
    const fullMonthName = date.toLocaleString('default', { month: 'long' });
    const daysOffset = new Date(date.getFullYear(), date.getMonth(), 0).getDay()
    return <div className="border-1 border-gray-300 rounded-2xl p-4" key={`monthView-${fullMonthName}`}>
      {fullMonthName}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map((dayOfWeek)=>
          <span key={`${dayOfWeek}-${fullMonthName}`} className="text-gray-500 text-sm text-center">
            {dayOfWeek}
          </span>)}
          {
            [...Array(daysOffset + 1).keys()].map((value)=>
              <div key={`offset-${value}`}></div>
            )
          }
        {
          [...Array(daysInMonth).keys()].map((value) => {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), value+1)
            const occurrenceLogged = occurrenceDates.find(occurrenceDate => 
            new Date(occurrenceDate).setHours(0, 0, 0, 0) === currentDate.getTime()
          )
          const key = `circle-${fullMonthName}-${value}`
          const isLoading = (addOccurrenceMutation.isPending || deleteOccurrenceMutation.isPending) && occurrenceKey === key
          {
            return isLoading ?
              <DayCircleButton key={key} state={'loading'} onClick={() => {}} /> :
              occurrenceLogged ? (
                <DayCircleButton key={key} state={'filled'} onClick={()=>deleteOccurrence(key, occurrenceLogged)} text={value+1} />
              ) : (
                <DayCircleButton key={key} state={'empty'} onClick={()=>logOccurrence(key, currentDate)} text={value+1} />
              )
          }
          })
        }
      </div>
    </div>
  }

  const findWeeklyOccurrence = (date: Date) => {
    const { startTime, endTime } = getWeekBounds(date)
    return allOccurrences?.find(
      (occ) =>
        occ.habitId === habit.id &&
        occ.occurrenceTimestamp >= startTime &&
        occ.occurrenceTimestamp <= endTime
    )
  }

  const generateWeeklyMonthView = () => {
    const sundays = getCurrentBiMonthlyDates(6)
    const monthNamesSet = new Set(sundays.map(sunday => {
      const monthDate = new Date(sunday.getFullYear(), sunday.getMonth(), 1)
      return monthDate.toLocaleString('default', { month: 'long' });
    }))
    const monthNames = [...monthNamesSet]
    sundays.pop()
    return <div className="flex flex-row md:flex-col justify-items-stretch p-4">
    <div className="flex flex-col md:flex-row justify-between m-2">
      <span>{`${monthNames[0]}-${monthNames[1]}`}</span>
      <span>{`${monthNames[1]}-${monthNames[2]}`}</span>
      <span>{`${monthNames[2]}-${monthNames[3]}`}</span>
    </div>
    <div className="grid grid-rows-12 md:grid-rows-4 grid-flow-col gap-1 lg:gap-3">
      {sundays.map(sunday => {
          const occurrence = findWeeklyOccurrence(sunday)
          const key=`sunday-${sunday.getTime()}`
          const isLoading = (addOccurrenceMutation.isPending || deleteOccurrenceMutation.isPending) && occurrenceKey === key
          return (
            <WeekCircleButton 
              state={isLoading ? 'loading' : occurrence ? 'filled' : 'empty'} 
              key={key} 
              onClick={()=>{
                if (occurrence) {
                  deleteOccurrence(key, sunday)
                } else {
                  logOccurrence(key, sunday)
                }
              }}>
              {!isLoading ? 
                <div className="flex justify-between">
                  {[...Array(7).keys()].map((value) => {
                    const dayToShow = new Date(sunday)
                    dayToShow.setDate(sunday.getDate()+value)
                    return <span className="text-center px-1">{dayToShow.getDate()}</span>
                  })}
                </div> :
               <Loader2 className="h-4 w-24 animate-spin" /> 
              }
          </WeekCircleButton>
          )
        }     
      )}
    </div>
    </div>
  }

  const {totalDays, totalWeeks, longestStreak, currentStreak} = analyzeStreaks(habit.streaks, habit.frequency)
  
  return (
    <>
    <div className="flex w-full">
        <div className="flex pt-4 pl-6">
          <BackButton />
        </div>
        <div className="flex justify-end pt-4 pr-6 flex-1">
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
      </div>
      <h1 className="text-4xl font-bold my-8 text-center">{habit?.name}</h1>
      <div className="flex flex-col items-center gap-2 bg-white rounded-xl shadow-md py-6 p-6 m-4">
        <div className="w-full py-10 px-20 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-lg mb-4 text-center">Best streak</h1>
            <h1 className="text-2xl mb-4 text-center">{longestStreak}</h1>
          </div>
          <div className="border-0 md:border-l-1 border-gray-500"></div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-lg mb-4 text-center">Current streak</h1>
            <h1 className="text-2xl  mb-4 text-center">{currentStreak}</h1>
          </div>
          <div className="border-0 md:border-l-1 border-gray-500"></div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-lg mb-4 text-center">Completed {habit.frequency==='daily'?'Days': 'Weeks'}</h1>
            <h1 className="text-2xl mb-4 text-center">{habit.frequency==='daily' ? totalDays : totalWeeks}</h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          {habit.frequency === 'daily' ? 
            [prevMonthDate, currentMonthDate, nextMonthDate].map(monthDate => generateMonthView(monthDate)) :
            generateWeeklyMonthView()
          } 
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