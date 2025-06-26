import { useLocation } from "react-router-dom";
import { useAuthUser } from "../dao/useAuthUser";
import { useQueryHabit } from "../dao/useQueryHabit";
import { PrimaryButton } from "../components/PrimaryButton";
import { useState } from "react";
import { EditHabitModal } from "./EditHabitModal";
import { SecondaryButton } from "../components/SecondaryButton";
import { DeleteWarningModal } from "./DeleteWarningModal";
import { BackButton } from "../components/BackButton";
import { getTimespan } from "./util";
import { useQueryOccurrencesByHabit } from "../dao/useQueryOccurrence";
import { CircularButton } from "../components/CircularButton";
import { EmptyCircularButton } from "../components/EmptyCircularButton";

export const DetailedHabit = () => {
  const location = useLocation();
  const user = useAuthUser();
  const userId = user?.uid;
  const habitId = location.pathname.split('/').pop();
  const { data: habit, isLoading: habitLoading, isError: habitError } = useQueryHabit(userId, habitId || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { startTime, endTime } = getTimespan()
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

  const generateMonthView = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    const fullMonthName = date.toLocaleString('default', { month: 'long' });
    return <div className="border-1 border-gray-300 rounded-2xl p-4">
      {fullMonthName}
      <div className="grid grid-cols-7 gap-1 mt-4">
        {
          [...Array(daysInMonth).keys()].map((value) => {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), value)
            const occurrenceLogged = occurrenceDates.some(occurrenceDate => 
            new Date(occurrenceDate).setHours(0, 0, 0, 0) === currentDate.getTime()
          )
            return occurrenceLogged ? <CircularButton onClick={()=>console.log()} />:
            <EmptyCircularButton onClick={()=>console.log()} />
          })
        }
      </div>
    </div>
  }
  
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
      <div className="flex flex-col items-center m-4">
        <div className="bg-white rounded-xl shadow-md py-6 p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">{habit?.name}</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            {[prevMonthDate, currentMonthDate, nextMonthDate].map(monthDate => 
              generateMonthView(monthDate)
            )} 
          </div>
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