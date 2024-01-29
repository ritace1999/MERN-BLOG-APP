import AsyncSelect from "react-select/async";

const MultiSelectDropDown = ({ defaultValue = [], loadOptions, onChange }) => {
  return (
    <AsyncSelect
      defaultValue={defaultValue}
      defaultOptions={true}
      isMulti={true}
      loadOptions={loadOptions}
      className="relative z-20 text-lg"
      onChange={onChange}
    />
  );
};

export default MultiSelectDropDown;
