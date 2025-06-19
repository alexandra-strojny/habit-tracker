import { PrimaryButton } from "./components/PrimaryButton";
import { addHabit } from "./dao/addHabit";


export const Dashboard = () => {
  return (
    <>
      <h2 className="text-4xl">My Habits</h2>
      <div className="min-h-screentext-primary flex flex-col items-center justify-center p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 space-y-4">
          <p className="text-muted-text">This is your dashboard.</p>

          <div className="space-y-2">
            <PrimaryButton onClick={() => addHabit({"frequency": "daily", "name": "Study React"})}>
              Add Habit
            </PrimaryButton>

            <button className="bg-accent-yellow text-primary-text font-medium px-4 py-2 rounded-md text-center hover:bg-accent-yellow-hover transition">
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </>
  );
}