import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetail from '../components/Products/ProductDetail'
import ProductGrid from '../components/Products/ProductGrid'
import FeatureCollection from '../components/Products/FeatureCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    //fetch product for a specifi collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    )

    //fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        )
        setBestSellerProduct(response.data);

      } catch (error) {
        console.error(error);
      }
    }
    fetchBestSeller();
  }, [dispatch]);
  return (
    <div className='bg-booksdos'>
      <Hero />
      <NewArrivals />
      <h2 className='font-bold text-3xl mb-4 text-center text-ktr-blue'>Best Seller</h2>
      {bestSellerProduct ? (<ProductDetail productId={bestSellerProduct._id} />) : (
        <p className='text-center text-gray-500'>Loading best seller product...</p>
      )}

    </div>
  )
}
export default Home

