import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { getUserById } from '@/lib/utils'
import { setUser } from '@/redux/authSlice'

const canadaProvinces = {
    "All": "All",
    "ON": "Ontario",
    "BC": "British Columbia",
    "NS": "Nova Scotia",
    "AB": "Alberta",
    "MA": "Manitoba",
    "QB": "Quebec",
}

export const salaryRanges = (value = 0) => ({
    "$35k-$40k": (value >= 35000 && value <= 40000),
    "$42k-$100k": (value >= 42000 && value <= 100000),
    "$100k-$150k": (value >= 100000 && value <= 150000),
})

const savedJobFilter = {
    fitlerType: "View Saved Jobs",
    array: ["Saved Jobs"]
};

const filterData = [
    {
        fitlerType: "Location",
        array: ["All", "ON", "BC", "NS", "AB", "MA"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["$35k-$40k", "$42k-$100k", "$100k-$150k"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [filterDataList, setFilterDataList] = useState(filterData);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const changeHandler = async (value) => {
        if (value.toLowerCase() === 'saved jobs') {
            const userData = await getUserById(user?._id);
            dispatch(setUser(userData));
        }
        setSelectedValue(value);
        dispatch(setSearchedQuery(value));
    }

    useEffect(() => {
        if (user && user?.role === 'jobseeker' && user?.savedJobs?.length) {
            setFilterDataList([savedJobFilter, ...filterData]);
        }
    }, [user])

    return (
        <div className="top-15 fixed bg-white p-3 rounded-md w-[16%]">
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-1 mb-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterDataList.map((data, index) => (
                        <div key={data.fitlerType}>
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={item}>
                                            <RadioGroupItem value={item} id={itemId} className="cursor-pointer" />
                                            <Label htmlFor={itemId} className="cursor-pointer">
                                                {(data.fitlerType === 'Location') ? canadaProvinces[item] : item}
                                            </Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard