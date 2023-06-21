
const Input = ({label, ...props}) => {

    return(
        <div className="flex flex-col items-start">
  <label for={props.id || ''} class="block text-xs font-medium text-gray-700">
    {label}
  </label>

  <input
  class=" p-2 mt-1 w-full border-2 rounded-md border-gray-200 sm:text-sm"
    {...props}
  />
</div>
    )
}

export default Input