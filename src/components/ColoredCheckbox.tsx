import { FiX } from "react-icons/fi"

export const ColoredCheckbox = (props:{
  checked: boolean
  toggleChecked: () => void
}) => {
  const {checked, toggleChecked} = props
  return <div className="border-2 border-primary-blue-green text-primary-blue-green w-4 h-4 flex items-center justify-center"><button
    type='button'
    onClick={()=>toggleChecked()}
    className="cursor-pointer">
    {checked ? <FiX size={24} /> : <div className="w-6 h-6" />}
  </button></div>
}