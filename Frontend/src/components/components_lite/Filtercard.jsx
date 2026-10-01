import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { MapPin, Building2, Briefcase, DollarSign } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Addis Ababa",
      "Adama",
      "Hawassa",
      "Dire Dawa",
      "Jimma",
      "Bahir Dar",
      "Mekelle",
      "Gondar",
      "Remote",
    ],
  },
  {
    filterType: "Industry",
    array: [
      "Technology",
      "Construction",
      "Art and MultiMedia",
      "Finance",
      "Management and Admnistration",
      "Education",
      "Healthcare",
      "Hospitality and Tourism",
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  const getIcon = (filterType) => {
    switch (filterType) {
      case "Location":
        return <MapPin className="h-4 w-4" />;
      case "Industry":
        return <Building2 className="h-4 w-4" />;
      case "Experience":
        return <Briefcase className="h-4 w-4" />;
      case "Salary":
        return <DollarSign className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h1 className="font-bold text-xl sm:text-2xl mb-2 text-gray-800">Filter Jobs</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>
      
      <RadioGroup value={selectedValue} onValueChange={handleChange} className="space-y-6">
        {filterData.map((data, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                {getIcon(data.filterType)}
              </div>
              <h2 className="font-semibold text-base sm:text-lg text-gray-800">
                {data.filterType}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {data.array.map((item, indx) => {
                const itemId = `Id${index}-${indx}`;
                const isSelected = selectedValue === item;
                return (
                  <label
                    key={itemId}
                    htmlFor={itemId}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation border ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    <RadioGroupItem 
                      value={item} 
                      id={itemId}
                      className={`${isSelected ? 'border-white' : 'border-gray-400'}`}
                    />
                    <span className={`text-xs sm:text-sm font-medium select-none flex-1 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {item}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Filter;