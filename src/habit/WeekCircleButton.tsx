export const WeekCircleButton = ({key, text}:{key:string, text?:string|number}) => {
  return (
    <span
      key={key}
      className="border-2 border-primary-blue-green text-primary-blue-green rounded-full text-center transition h-7 w-7"
    >
      {text}
    </span>
  );
}