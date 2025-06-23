export const AllHabits = () => {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-2 mt-4 mb-4 px-6 h-screen">
      <div className="flex-1">
        <h2 className="text-4xl mb-4">All Habits</h2>
        <p className="text-muted-text mb-6">Here you can view and manage all your habits.</p>
        {/* Placeholder for future AllHabits content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-center text-muted-text">No habits found. Start by adding a new habit!</p>
        </div>
      </div>
    </div>
  );
}