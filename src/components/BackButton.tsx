import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)}
      className={`bg-primary-blue-green text-white font-medium w-12 h-12 px-2 py-1 shadow rounded-full text-center hover:bg-primary-blue-green-hover transition cursor-pointer`}>
      <FiArrowLeft size={32} />
    </button>)
}