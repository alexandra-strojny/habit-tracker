import { Loader2 } from 'lucide-react';

interface DayCircleButtonProps {
  onClick: () => void;
  state: 'empty' | 'filled' | 'loading';
  key:string,
  text?: string | number;
}

export const DayCircleButton = ({ onClick, state, key, text }: DayCircleButtonProps) => {
  let className = "flex items-center justify-center rounded-full text-center transition-all duration-300 h-7 w-7 text-sm"
  if (state === 'filled') {
    className += ' bg-primary-blue-green text-white hover:bg-primary-blue-green-hover cursor-pointer'
  } else if (state === 'empty') {
    className += ' border-2 border-accent-yellow text-accent-yellow hover:bg-primary-blue-green-hover hover:border-primary-blue-green-hover hover:text-white cursor-pointer'
  } else {
    className += ' bg-gray-200 text-gray-500 animate-pulse cursor-not-allowed'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'loading'}
      className={className}
      key={key}
    >
      {state === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        text
      )}
    </button>
  );
};
