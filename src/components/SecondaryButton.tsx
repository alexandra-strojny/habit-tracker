export const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button 
      className="bg-accent-yellow text-primary-text font-medium px-4 py-2 rounded-md text-center hover:bg-accent-yellow-hover transition"
      onClick={onClick}>
      {children}
    </button>
  );
}