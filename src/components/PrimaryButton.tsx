export const PrimaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="bg-primary-blue-green text-white font-medium px-4 py-2 rounded-md text-center hover:bg-primary-blue-green-hover transition">
      {children}
    </button>)
}