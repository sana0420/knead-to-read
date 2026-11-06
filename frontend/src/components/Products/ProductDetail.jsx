import React, { useEffect } from 'react'
import { toast } from 'sonner'
import ProductGrid from './ProductGrid'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice'
import { addToCart } from '../../redux/slices/cartSlice'

const ProductDetail = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, similarProducts, loading, error } = useSelector((state) => state.product);
    const { user, guestId } = useSelector((state) => state.auth);
    const [activeImage, setActiveImage] = React.useState(0)
    const [quantity, setQuantity] = React.useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

    const productFetchId = productId || id;

    useEffect(() => {
        dispatch(fetchProductDetails(productFetchId))
        dispatch(fetchSimilarProducts({ id: productFetchId }))
        // Reset active image index back to 0 whenever the product changes
        setActiveImage(0);
    }, [dispatch, productFetchId])

    const handleQuantityChange = (change) => {
        setQuantity((prev) => {
            const newQuantity = prev + change;
            return newQuantity < 1 ? 1 : newQuantity;
        });
    }

    const handleAddToCart = () => {
        setIsButtonDisabled(true);
        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                guestId,
                userId: user?._id,
            })
        ).then(() =>
            toast.success("Product added to cart!",
                {
                    duration: 1000,
                })
        ).finally(() => {
            setIsButtonDisabled(false)
        })
    }

    if (loading) {
        return <p className="text-center py-10 text-gray-500">Loading...</p>
    }
    if (error) {
        return <p className="text-center py-10 text-red-500">Error: {error}</p>
    }

    const product = selectedProduct

    return (
        <div className='p-6 bg-booksdos'>
            {product && (
                <div className='max-w-6xl mx-auto p-8 rounded-lg ' >
                    <div className='flex flex-col md:flex-row '>

                        {/* Desktop Left Thumbnails */}
                        <div className='hidden md:flex flex-col space-y-4 mr-6'>
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index + 1}`}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border transition-all ${activeImage === index
                                        ? 'border-black ring-2 ring-black/10 scale-[1.02]'
                                        : 'border-gray-300 hover:border-gray-500'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Main Image View Panel */}
                        <div className='md:w-1/2'>
                            <div className='mb-4 h-[450px] w-full overflow-hidden rounded-lg bg-stone-100'>
                                <img
                                    src={product.images?.[activeImage]?.url || product.images?.[0]?.url || ''}
                                    alt={product.images?.[activeImage]?.altText || 'Main Product Visual'}
                                    className='w-full h-full object-cover transition-all duration-300'
                                />
                            </div>
                        </div>

                        {/* Mobile Thumbnail Images Row */}
                        <div className='md:hidden flex space-x-4 overflow-x-auto mb-4 pb-2 scrollbar-hide'>
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index + 1}`}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border ${activeImage === index ? 'border-black ring-2 ring-black/10' : 'border-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Right Content Details Panel */}
                        <div className='md:w-1/2 md:ml-10'>
                            <h1 className='text-2xl md:text-3xl font-semibold text-ktr-green mb-2'>
                                {product.name}
                            </h1>
                            <p className='text-lg text-gray-600 mb-1 text-ktr-blue line-through'>
                                {product.originalPrice && `$${product.originalPrice} `}
                            </p>
                            <p className='text-xl text-ktr-blue mb-2'>
                                ${product.price}
                            </p>
                            <p className='mb-4 text-ktr-blue'>
                                {product.description}
                            </p>



                            {/* Quantity Control Selector */}
                            <div className='mb-6'>
                                <p className='text-ktr-green font-medium'>Quantity:</p>
                                <div className='flex items-center space-x-4 mt-2'>
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-lg font-medium transition-colors'>
                                        -
                                    </button>
                                    <span className='text-lg font-semibold w-6 text-center'>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(+1)}
                                        className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-lg font-medium transition-colors'>
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Cart Submission CTA Action */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`w-full bg-ktr-pink text-ktr-blue px-6 py-3 rounded font-semibold tracking-wide transition-all ${isButtonDisabled
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:text-ktr-skin active:scale-[0.99]'
                                    }`}
                            >
                                {isButtonDisabled ? "Adding..." : "Add to Cart"}
                            </button>


                        </div>
                    </div>

                    {/* Similar Cross-Sells Section Footer Grid */}
                    <div className='mt-20'>
                        <h2 className='text-2xl font-semibold text-center mb-6'>
                            You May Also Like
                        </h2>
                        <ProductGrid products={similarProducts} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetail