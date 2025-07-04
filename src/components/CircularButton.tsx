import { Loader2 } from 'lucide-react';

interface CircularButtonProps {
  onClick: () => void;
  state: 'empty' | 'filled' | 'loading';
  text?: string | number;
}

export const CircularButton = ({ onClick, state, text }: CircularButtonProps) => {

  let className = "flex items-center justify-center rounded-full text-center transition h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
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
    >
      {state === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        text
      )}
    </button>
  );
};