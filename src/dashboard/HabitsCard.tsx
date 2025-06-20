import { CircularButton } from "../components/CircularButton";
import type { Frequency, Habit } from "../types/types";
import { useQueryHabits } from "../dao/queryHabits";

export const HabitsCard = ({frequency}:{frequency:Frequency}) => {
  const title = frequency === 'daily' ? 'Daily Habits' : 'Weekly Habits';
  const {data:allHabits, isError, isLoading} = useQueryHabits('mockUser123', frequency);

  const generateDateRow = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    return dates.map((date) => (
      <span
        key={date}
        className="block text-xs text-center text-muted-text -rotate-45"
      >
        {date}
      </span>
    ))
  }

  const generateHabitRow = (habit:Habit) => {
    return (
      <div key={habit.id} className="grid grid-cols-8 gap-6 mb-2 items-end">
        <div className="text-xs text-muted-text">{habit.name}</div>
        {Array.from({ length: 7 }, (_, i) => (
          <CircularButton key={`${habit.id}-button-${i}`} />
        ))}
      </div> 
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading habits</div>;
  }

  return (
    <div className="basis-2/5 flex flex-col items-center justify-center space-y-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 space-y-4">
        <p>{title}</p>
        {/* Dates row */}
        <div className="grid grid-cols-8 gap-6 mb-2 items-end">
          <div></div> {/* Empty cell for alignment */}
          {generateDateRow()}
        </div>
        {!allHabits || allHabits.length === 0 ? (
          <div className="text-center text-muted-text">No habits found</div>
        ) : (
          allHabits.map((habit) => (generateHabitRow(habit)))
        )}
      </div>
    </div>
  );
}