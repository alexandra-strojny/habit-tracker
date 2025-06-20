
export const EmptyCircularButton = ({key}:{key:string}) => {
  return (
    <button
      key={key}
      type="button"
      className="border-2 border-accent-yellow text-white rounded-full text-center hover:bg-primary-blue-green-hover hover:border-primary-blue-green-hover cursor-pointer transition h-6 w-6"
    >
    </button>
  );
}