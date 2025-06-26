
export const EmptyCircularButton = ({onClick}:{onClick:()=>void}) => {
  return (
    <button
      type="button"
      className="border-2 border-accent-yellow text-white rounded-full text-center hover:bg-primary-blue-green-hover hover:border-primary-blue-green-hover cursor-pointer transition h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
      onClick={onClick}
    >
    </button>
  );
}