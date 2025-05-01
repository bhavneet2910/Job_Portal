import React, { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDispatch } from 'react-redux';
import { setSearchText } from '@/redux/jobSlice';
import { Button } from './ui/button';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Data Science", "FullStack Developer", "Nextjs Developer"]
    },
    {
        filterType: "Salary",
        array: ["0 - 40k", "42k to 1lakh", "1lakh to 5lakh"]
    },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const dispatch = useDispatch();

    const handleChange = (value) => {
        console.log('Selected filter value:', value); // Debug log
        setSelectedValue(value);
        // Find which type of filter was selected
        for (const filter of filterData) {
            if (filter.array.includes(value)) {
                console.log('Filter type:', filter.filterType); // Debug log
                setSelectedType(filter.filterType);
                break;
            }
        }
    };

    useEffect(() => {
        if (selectedValue) {
            console.log('Dispatching search with value:', selectedValue); // Debug log
            console.log('Filter type:', selectedType); // Debug log
            dispatch(setSearchText(selectedValue));
        }
    }, [selectedValue, dispatch]);

    const clearFilter = () => {
        setSelectedValue('');
        setSelectedType('');
        dispatch(setSearchText(''));
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className='flex items-center justify-between mb-3'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                {selectedValue && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilter}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Clear Filter
                    </Button>
                )}
            </div>
            <hr className='mb-3' />
            <RadioGroup value={selectedValue} onValueChange={handleChange}>
                {filterData.map((data, index) => (
                    <div key={index} className="mb-4">
                        <h1 className='font-medium text-lg mb-2'>{data.filterType}</h1>
                        {data.array.map((item, idx) => {
                            const itemId = `r${index}-${idx}`;
                            return (
                                <div key={idx} className="flex items-center space-x-2 my-2">
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </RadioGroup>
            {selectedValue && (
                <div className="mt-3 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                        Filtering by: <span className="font-medium">{selectedType}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Value: <span className="font-medium">{selectedValue}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default FilterCard;