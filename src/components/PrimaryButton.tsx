export const PrimaryButton = ({
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
      onClick={onClick}
      className={`bg-primary-blue-green text-white font-medium px-4 py-2 rounded-md text-center hover:bg-primary-blue-green-hover transition cursor-pointer ${className}`}>
      {children}
    </button>)
}