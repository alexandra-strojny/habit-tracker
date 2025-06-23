export const SecondaryButton = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button 
      type="button"
      className={`bg-accent-yellow text-white font-medium px-4 py-2 rounded-md text-center hover:bg-accent-yellow-hover transition cursor-pointer ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
}