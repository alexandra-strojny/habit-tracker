export const ToggleSwitch = ({
  text,
  value,
  setValue,
}:{
  text:string
  value: boolean
  setValue:(newValue:boolean) => void
}) => {
  return (
    <label className="inline-flex cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" checked={value} onChange={(e) => setValue(e.target.checked)} />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary-blue-green-hover rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue-green"></div>
      <span className="ms-3 text-sm">{text}</span>
    </label>
  )
}