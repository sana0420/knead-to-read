import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
const SideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    frequency: "",
    bookGenre: "",
  });
  const bookGenre = ["Cozy Mystery", "Romance", "Fantasy", "Fiction"]
  const [priceRange, setPriceRange] = useState([0, 100]);
  const frequency = ["Monthly", "Weekly", "Bi-weekly", "Quaterly"]
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      frequency: params.frequency || "",
      bookGenre: params.bookGenre || "",
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    })
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFilters((prevFilters) => {
      // 1. Safely ensure currentVal is an array if type is checkbox
      const currentVal = prevFilters[name];
      let updatedValues;

      if (type === "checkbox") {
        // Force currentVal to be an array, ignoring non-array initial states
        const currentArray = Array.isArray(currentVal) ? currentVal : [];

        if (checked) {
          // Prevent duplicate string entries
          updatedValues = currentArray.includes(value)
            ? currentArray
            : [...currentArray, value];
        } else {
          // Filter out unchecked item
          updatedValues = currentArray.filter((item) => item !== value);
        }
      } else {
        // Single inputs (select, radio, text) set direct string value
        updatedValues = value;
      }

      const newFilters = {
        ...prevFilters,
        [name]: updatedValues,
      };

      // 2. Trigger URL sync with the calculated new object
      updateURLParams(newFilters);

      return newFilters;
    });
  };
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","))
      } else if (newFilters[key]) {
        params.append(key, newFilters[key])
      }
      setSearchParams(params)
      navigate(`?${params.toString()}`) //?category=Bottom+Wear&size=XS%2C
    })
  }
  const handlePriceChange = (e) => {
    // 1. Extract the VALUE as a number, not the DOM element
    const newPrice = Number(e.target.value);

    // 2. Update price range state
    setPriceRange([0, newPrice]);

    // 3. Construct new filters object cleanly
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        minPrice: 0,
        maxPrice: newPrice
      };

      // 4. Pass the UPDATED filters object to the URL updater
      updateURLParams(newFilters);

      return newFilters;
    });
  };
  return (
    <div className='p-4'>
      <h3 className='text-xl fond-medium text-gray-800 mb-4'>Filter</h3>
      {/* FREQUENCY Filter */}
      <div className=' mb-6'>
        <label className="block text-gray-600 fond-medium mb-2">Frequency</label>
        {frequency.map((freq) => (
          <div key={freq} className='flex items-center mb-1'>
            <input
              type="radio"
              name="frequency"
              value={freq}
              checked={filters.frequency === freq}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
            <span className='text-gray-700'>{freq}</span>
          </div>
        ))
        }
      </div>
      {/* BOOK GENRE filter */}
      <div className='mb-6'>
        <label className="block text-gray-600 fond-medium mb-2">Book Genre</label>
        {bookGenre.map((genre) => (
          <div key={genre} className='flex items-center mb-1'>
            <input
              type="checkbox"
              name="bookGenre"
              value={genre}
              checked={filters.bookGenre?.includes(genre)}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
            <span className='text-gray-700'>{genre}</span>
          </div>
        ))
        }
      </div>

      {/*Price range filter */}
      <div className='mb-8'>
        <label className='block text-gray-600 font-medium mb-2'>
          Price Range
        </label>
        <input type="range" name='priceRange' onChange={handlePriceChange} value={priceRange[1]} min={0} max={100}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer' />
        <div className='flex justify-between text-gray-600 mt-2'>
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}

export default SideBar