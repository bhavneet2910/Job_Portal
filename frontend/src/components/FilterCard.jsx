import React from "react";
import { data } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useDispatch } from "react-redux";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Banglore", "Hyderabad", "Pune,Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["FrontEnd Developer", "BackEnd Developer", "Full Stack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "41-1lakh", "1 Lakh - 5 Lakh"],
  },
];
const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  const changeHandler = (value) => {
      setSelectedValue(value);
  }
  useEffect(()=>{
      dispatch(setSearchedQuery(selectedValue));
  },[selectedValue]);
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div>
            <h1 className="font-bold text-lg">{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`
              return (
                <div className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
