
export const EmptyCircularButton = ({onClick, text}:{onClick:()=>void, text?:string|number}) => {
  return (
    <button
      type="button"
      className="border-2 border-accent-yellow text-accent-yellow rounded-full text-center hover:bg-primary-blue-green-hover hover:border-primary-blue-green-hover hover:text-white cursor-pointer transition h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
      onClick={onClick}
    >
      {text}
    </button>
  );
}