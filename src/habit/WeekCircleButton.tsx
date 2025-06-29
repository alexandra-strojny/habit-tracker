interface WeekCircleButtonButtonProps {
  onClick: () => void;
  key:string;
  state: 'empty' | 'filled' | 'loading';
  children: React.ReactNode;
}

export const WeekCircleButton = ({onClick, key, state, children}: WeekCircleButtonButtonProps) => {
  
  let className = "border-2 rounded-full text-center transition-all duration-300 px-2 py-1"
  if (state === 'filled') {
    className += " bg-primary-blue-green text-white hover:bg-primary-blue-green-hover cursor-pointer"
  } else if (state === 'empty') {
    className += ' border-2 border-accent-yellow text-accent-yellow hover:bg-primary-blue-green-hover hover:border-primary-blue-green-hover hover:text-white cursor-pointer'
  } else {
    className += ' flex justify-center items-center bg-gray-200 text-gray-500 animate-pulse cursor-not-allowed'
  }
  return (
    <button
      type="button"
      key={key}
      disabled={state === 'loading'}
      className={className}
      onClick={onClick}
    > 
      {children}
    </button>
  );
}