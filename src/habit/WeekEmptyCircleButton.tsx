
export const WeekEmptyCircleButton = ({key, text}:{key:string, text?:string|number}) => {
  return (
    <span
      key={key}
      className="border-2 border-accent-yellow text-accent-yellow rounded-full text-center transition h-7 w-7"
    >
      {text}
    </span>
  );
}