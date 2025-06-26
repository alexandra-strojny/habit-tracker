export const CircularButton = ({onClick}:{onClick:()=>void}) => {
  return (
    <button
      type="button"
      className="bg-primary-blue-green text-white rounded-full text-center hover:bg-primary-blue-green-hover cursor-pointer transition h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
      onClick={onClick}
    >
    </button>
  );
}