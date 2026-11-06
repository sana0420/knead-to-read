import { useState, useEffect, useRef } from 'react'
import { FaFilter } from 'react-icons/fa'
import SideBar from '../components/Products/SideBar.jsx'
import SortOptions from '../components/Products/SortOptions.jsx'
import ProductGrid from '../components/Products/ProductGrid.jsx'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import { useSearchParams, useLocation } from 'react-router-dom' // Using useLocation to read the exact URL path string
import { useDispatch, useSelector } from 'react-redux'

const CollectionPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product)
    const queryParams = Object.fromEntries([...searchParams])

    // Extract the very last segment of the URL path
    // e.g., "/pairing/oven" becomes "oven"
    // e.g., "/pairing" becomes "pairing"
    // e.g., "/library" becomes "library"
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentCategory = pathSegments[pathSegments.length - 1] || 'pairing';

    useEffect(() => {
        console.log("Fetching DB category for:", currentCategory);
        dispatch(fetchProductsByFilters({ collection: currentCategory, ...queryParams }))
    }, [dispatch, currentCategory, searchParams])

    const sidebarRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    }

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isFilterOpen) {
            setIsFilterOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFilterOpen]);

    return (
        <div className='flex flex-col lg:flex-row bg-booksdos'>
            <button onClick={toggleFilter} className='lg:hidden border p-2 flex justify-center items-center'>
                <FaFilter className='mr-2' /> Filters
            </button>

            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-auto lg:shadow-none`}>
                <SideBar />
            </div>

            <div className='flex-grow p-4 '>
                <SortOptions />
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default CollectionPage;