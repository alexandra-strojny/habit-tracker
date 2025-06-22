export const CircularButton = ({onClick}:{onClick:()=>void}) => {
  return (
    <button
      type="button"
      className="bg-primary-blue-green text-white rounded-full text-center hover:bg-primary-blue-green-hover cursor-pointer transition h-6 w-6"
      onClick={onClick}
    >
    </button>
  );
}