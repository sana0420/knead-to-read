import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchAdminProducts, deleteProduct } from '../../redux/slices/adminProductSlice';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';

const AdminProductList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, loading, error } = useSelector((state) => state.adminProduct);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name || 'this product'}"?`)) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success('Product deleted successfully');
            } catch (err) {
                toast.error(`Delete failed: ${err}`);
            }
        }
    };

    const filteredProducts = products?.filter((product) => {
        if (activeTab === 'all') return true;
        return product.category?.trim().toLowerCase() === activeTab?.trim().toLowerCase();
    });

    if (loading) return (
        <div className="max-w-6xl mx-auto p-6 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-ktr-blue border-t-transparent mb-4"></div>
            <p className="text-ktr-blue font-medium">Loading inventory products...</p>
        </div>
    );
    
    if (error) return (
        <div className="max-w-6xl mx-auto p-6 text-center py-12">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200">
                <p className="font-semibold">Error loading products</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                    onClick={() => dispatch(fetchAdminProducts())}
                    className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 cursor-pointer"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-ktr-blue flex items-center gap-2">
                        <FaBoxOpen className="text-ktr-blue" />
                        <span>Inventory Management</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your books, bakery items, and curated pairing bundles.
                    </p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-ktr-blue text-ktr-skin rounded-lg font-medium hover:bg-ktr-blue/90 shadow-sm transition-all cursor-pointer"
                >
                    <FaPlus className="text-xs" />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 text-ktr-blue text-sm font-semibold mb-4">
                {[
                    { id: 'all', label: 'All Products' },
                    { id: 'library', label: 'Library (Books)' },
                    { id: 'oven', label: 'Oven (Pastries)' },
                    { id: 'pairing', label: 'Pairings (Bundles)' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`cursor-pointer rounded-lg px-4 py-2 transition-all ${
                            activeTab === tab.id
                                ? 'bg-ktr-blue text-ktr-skin shadow-sm'
                                : 'bg-ktr-pink/30 text-ktr-blue hover:bg-ktr-pink/50'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs opacity-80">
                            ({tab.id === 'all' 
                                ? products?.length || 0 
                                : products?.filter(p => p.category?.trim().toLowerCase() === tab.id).length || 0})
                        </span>
                    </button>
                ))}
            </div>

            {/* Table View */}
            <div className="overflow-x-auto rounded-xl border border-ktr-blue/30 bg-ktr-skin/30 backdrop-blur shadow-sm">
                <table className="min-w-full divide-y divide-ktr-blue/20 text-left text-sm">
                    <thead className="bg-ktr-blue/10 text-ktr-blue font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-5 py-3.5">Preview & Name</th>
                            <th className="px-5 py-3.5">Category</th>
                            <th className="px-5 py-3.5">Stock</th>
                            <th className="px-5 py-3.5">Pricing</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/60 bg-white/70 text-gray-800">
                        {filteredProducts?.length > 0 ? (
                            filteredProducts.map((product) => {
                                const mainImage = product.images?.[0]?.url || product.image || '/placeholder.png';
                                const hasDiscount = product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice > 0;
                                return (
                                    <tr key={product._id} className="hover:bg-ktr-skin/50 transition">
                                        <td className="px-5 py-3.5 flex items-center gap-3">
                                            <img
                                                src={mainImage}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-md border border-gray-200 bg-gray-50 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200';
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <div className="font-semibold text-gray-900 truncate max-w-xs sm:max-w-sm">
                                                    {product.name}
                                                </div>
                                                {product.tags && product.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {product.tags.slice(0, 3).map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {product.tags.length > 3 && (
                                                            <span className="text-[10px] text-gray-400">
                                                                +{product.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={`capitalize inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                    product.category === 'library'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : product.category === 'oven'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                            >
                                                {product.category}
                                                {product.category === 'pairing' && product.pairingItems?.length > 0 && (
                                                    <span className="ml-1 text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-full">
                                                        {product.pairingItems.length} items
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={`font-medium ${
                                                    (product.countInStock ?? 0) === 0
                                                        ? 'text-red-600 font-bold'
                                                        : (product.countInStock ?? 0) <= 5
                                                        ? 'text-amber-600'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {product.countInStock ?? 0}
                                                {(product.countInStock ?? 0) === 0 && (
                                                    <span className="block text-[10px] text-red-500 uppercase font-semibold">Out of Stock</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {hasDiscount ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-ktr-blue text-sm">
                                                        ${Number(product.discountPrice).toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ${Number(product.price).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-gray-900">
                                                    ${Number(product.price).toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                                            <Link
                                                to={`/admin/products/${product._id}/edit`}
                                                className="inline-flex items-center gap-1 text-ktr-blue hover:text-ktr-blue/80 bg-ktr-blue/10 hover:bg-ktr-blue/20 px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition"
                                            >
                                                <FaEdit />
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition"
                                            >
                                                <FaTrash />
                                                <span>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <FaBoxOpen className="text-gray-300 text-4xl mb-2" />
                                        <p className="font-medium">No products found in this category.</p>
                                        <Link
                                            to="/admin/products/new"
                                            className="mt-3 text-sm text-ktr-blue underline hover:text-ktr-blue/80"
                                        >
                                            Create the first one
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
