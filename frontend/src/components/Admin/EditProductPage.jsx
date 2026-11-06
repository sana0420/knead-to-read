import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import {
    fetchAdminProducts,
    fetchAdminProductById,
    createProduct,
    updateProduct,
    clearCurrentProduct,
} from '../../redux/slices/adminProductSlice';
import {
    FaBoxOpen,
    FaTags,
    FaDollarSign,
    FaImages,
    FaGift,
    FaSearch,
    FaTrash,
    FaGripVertical,
    FaArrowLeft,
    FaArrowRight,
    FaSave,
    FaCheck,
    FaExclamationTriangle,
    FaUpload,
    FaLink,
    FaBook,
    FaUtensils,
    FaGoogle,
    FaPlus,
    FaTimes,
    FaChevronDown,
    FaChevronUp,
    FaSpinner,
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SUGGESTED_TAGS = [
    'gothic',
    'bronte',
    'austen',
    'classic',
    'bundle',
    'comfort',
    'pastry',
    'scone',
    'canele',
    'croissant',
    'tea-time',
    'artisan',
    'romance',
    'vintage',
];

const SECTIONS = [
    { id: 'basic', label: 'Basic Info', icon: FaBoxOpen },
    { id: 'pricing', label: 'Pricing & Stock', icon: FaDollarSign },
    { id: 'media', label: 'Media Gallery', icon: FaImages },
    { id: 'pairing', label: 'Pairing Details', icon: FaGift, conditional: true },
    { id: 'seo', label: 'SEO & Metadata', icon: FaSearch },
];

const EditProductPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // Redux state
    const {
        products,
        currentProduct,
        loadingCurrentProduct,
        currentProductError,
        isSubmitting,
    } = useSelector((state) => state.adminProduct);

    // Local form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'library',
        description: '',
        tags: [],
        price: '',
        discountPrice: '',
        countInStock: 0,
        images: [], // [{ url, altText }]
        pairingItems: [], // array of product IDs
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
    });

    // UI state
    const [activeTab, setActiveTab] = useState('basic');
    const [viewMode, setViewMode] = useState('tabs'); // 'tabs' | 'accordion'
    const [accordionOpen, setAccordionOpen] = useState({
        basic: true,
        pricing: true,
        media: true,
        pairing: true,
        seo: true,
    });

    // Tag input state
    const [tagInput, setTagInput] = useState('');

    // URL image input state
    const [urlInput, setUrlInput] = useState('');
    const [altTextInput, setAltTextInput] = useState('');

    // Upload state
    const [isUploading, setIsUploading] = useState(false);

    // Drag-and-drop state for image reordering
    const [draggedImageIndex, setDraggedImageIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Pairing filter state
    const [pairingSearch, setPairingSearch] = useState('');

    // Load available products for pairing selection
    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(fetchAdminProducts());
        }
    }, [dispatch, products]);

    // Fetch product when in edit mode
    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchAdminProductById(id));
        } else {
            dispatch(clearCurrentProduct());
            setFormData({
                name: '',
                category: 'library',
                description: '',
                tags: ['classic'],
                price: '',
                discountPrice: '',
                countInStock: 10,
                images: [],
                pairingItems: [],
                metaTitle: '',
                metaDescription: '',
                metaKeywords: '',
            });
        }
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, id, isEditMode]);

    // Populate form when currentProduct is fetched
    useEffect(() => {
        if (isEditMode && currentProduct) {
            const pairingIds = Array.isArray(currentProduct.pairingItems)
                ? currentProduct.pairingItems.map((item) =>
                      typeof item === 'object' && item?._id ? item._id : item
                  )
                : [];

            let imgList = [];
            if (Array.isArray(currentProduct.images) && currentProduct.images.length > 0) {
                imgList = currentProduct.images.map((img) =>
                    typeof img === 'string'
                        ? { url: img, altText: currentProduct.name || 'Product Image' }
                        : { url: img.url, altText: img.altText || currentProduct.name || 'Product Image' }
                );
            } else if (currentProduct.image) {
                imgList = [{ url: currentProduct.image, altText: currentProduct.name || 'Product Image' }];
            }

            setFormData({
                name: currentProduct.name || '',
                category: currentProduct.category || 'library',
                description: currentProduct.description || '',
                tags: Array.isArray(currentProduct.tags) ? currentProduct.tags : [],
                price: currentProduct.price !== undefined ? currentProduct.price : '',
                discountPrice:
                    currentProduct.discountPrice !== undefined && currentProduct.discountPrice !== null
                        ? currentProduct.discountPrice
                        : '',
                countInStock: currentProduct.countInStock !== undefined ? currentProduct.countInStock : 0,
                images: imgList,
                pairingItems: pairingIds,
                metaTitle: currentProduct.metaTitle || '',
                metaDescription: currentProduct.metaDescription || '',
                metaKeywords: currentProduct.metaKeywords || '',
            });
        }
    }, [isEditMode, currentProduct]);

    // Form field changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    // Category change handler
    const handleCategoryChange = (category) => {
        setFormData((prev) => ({
            ...prev,
            category,
            pairingItems: category === 'pairing' ? prev.pairingItems : [],
        }));
    };

    // Tag management
    const handleAddTag = (rawTag) => {
        const tag = rawTag.trim().toLowerCase().replace(/^[#,]+/, '');
        if (tag && !formData.tags.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
        }
        setTagInput('');
    };

    const handleRemoveTag = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, idx) => idx !== indexToRemove),
        }));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag(tagInput);
        }
    };

    // --- Image Upload & Management ---
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        const token = localStorage.getItem('userToken') || localStorage.getItem('usertoken');
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            if (files.length > 1) {
                try {
                    const multiFormData = new FormData();
                    files.forEach((f) => multiFormData.append('images', f));
                    const res = await axios.post(`${API_URL}/api/upload/multiple`, multiFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            ...authHeader,
                        },
                    });

                    if (res.data?.imageUrls) {
                        const newImages = res.data.imageUrls.map((url, i) => ({
                            url,
                            altText: `${formData.name || 'Product'} view ${formData.images.length + i + 1}`,
                        }));
                        setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
                        toast.success(`Uploaded ${files.length} images successfully`);
                        setIsUploading(false);
                        return;
                    }
                } catch {
                    // Fall back to sequential uploads
                }
            }

            const uploadedUrls = [];
            for (let file of files) {
                const singleFormData = new FormData();
                singleFormData.append('image', file);
                const res = await axios.post(`${API_URL}/api/upload`, singleFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...authHeader,
                    },
                });
                if (res.data?.imageUrl) {
                    uploadedUrls.push(res.data.imageUrl);
                }
            }

            if (uploadedUrls.length > 0) {
                const newImages = uploadedUrls.map((url, i) => ({
                    url,
                    altText: `${formData.name || 'Product'} view ${formData.images.length + i + 1}`,
                }));
                setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
                toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            toast.error(err.response?.data?.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAddUrlImage = () => {
        if (!urlInput.trim()) return;
        const newImg = {
            url: urlInput.trim(),
            altText: altTextInput.trim() || formData.name || 'Product image',
        };
        setFormData((prev) => ({ ...prev, images: [...prev.images, newImg] }));
        setUrlInput('');
        setAltTextInput('');
        toast.success('Image added from URL');
    };

    const handleUpdateAltText = (index, altText) => {
        setFormData((prev) => {
            const updated = [...prev.images];
            updated[index] = { ...updated[index], altText };
            return { ...prev, images: updated };
        });
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove),
        }));
    };

    // Drag-and-drop image reordering handlers
    const handleDragStart = (e, index) => {
        setDraggedImageIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
            setDraggedImageIndex(null);
            setDragOverIndex(null);
            return;
        }

        setFormData((prev) => {
            const newImages = [...prev.images];
            const [movedItem] = newImages.splice(draggedImageIndex, 1);
            newImages.splice(targetIndex, 0, movedItem);
            return { ...prev, images: newImages };
        });

        setDraggedImageIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedImageIndex(null);
        setDragOverIndex(null);
    };

    const handleMoveImage = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= formData.images.length) return;
        setFormData((prev) => {
            const newImages = [...prev.images];
            const [movedItem] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, movedItem);
            return { ...prev, images: newImages };
        });
    };

    // --- Pairing Multi-select Management ---
    const handleTogglePairingProduct = (productId) => {
        setFormData((prev) => {
            const current = prev.pairingItems || [];
            if (current.includes(productId)) {
                return { ...prev, pairingItems: current.filter((id) => id !== productId) };
            } else {
                return { ...prev, pairingItems: [...current, productId] };
            }
        });
    };

    // Available books and pastries for pairing
    const availableBooks = (products || []).filter(
        (p) => p.category?.trim().toLowerCase() === 'library' && (!isEditMode || p._id !== id)
    );
    const availablePastries = (products || []).filter(
        (p) => p.category?.trim().toLowerCase() === 'oven' && (!isEditMode || p._id !== id)
    );

    const filteredBooks = availableBooks.filter((p) =>
        p.name?.toLowerCase().includes(pairingSearch.toLowerCase())
    );
    const filteredPastries = availablePastries.filter((p) =>
        p.name?.toLowerCase().includes(pairingSearch.toLowerCase())
    );

    const selectedPairingItemsList = (products || []).filter((p) =>
        formData.pairingItems?.includes(p._id)
    );
    const totalIndividualPrice = selectedPairingItemsList.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
    );

    // --- SEO Auto-Generators ---
    const handleGenerateMetaTitle = () => {
        if (!formData.name) {
            toast.error('Please enter a product name first');
            return;
        }
        let generated = `${formData.name} | Knead to Read`;
        if (generated.length < 50) {
            generated = `${formData.name} - Books & Artisan Bakery | Knead to Read`;
        }
        if (generated.length > 60) {
            generated = generated.slice(0, 57) + '...';
        }
        setFormData((prev) => ({ ...prev, metaTitle: generated }));
        toast.success('Generated SEO Meta Title');
    };

    const handleGenerateMetaDescription = () => {
        let base = formData.description || formData.name;
        if (!base) {
            toast.error('Please enter a product description or name first');
            return;
        }
        let generated = `${base} Delivered fresh from Knead to Read's artisanal book and pastry shop. Order your favorite literary treat today!`;
        if (generated.length > 160) {
            generated = generated.slice(0, 157) + '...';
        }
        setFormData((prev) => ({ ...prev, metaDescription: generated }));
        toast.success('Generated SEO Meta Description');
    };

    const handleSyncKeywordsFromTags = () => {
        if (!formData.tags || formData.tags.length === 0) {
            toast.error('No product tags found to sync');
            return;
        }
        const synced = [formData.name, ...formData.tags, formData.category, 'knead to read']
            .filter(Boolean)
            .join(', ');
        setFormData((prev) => ({ ...prev, metaKeywords: synced }));
        toast.success('Synced keywords from tags and product info');
    };

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Product Name is required');
            setActiveTab('basic');
            return;
        }
        if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
            toast.error('A valid Base Price is required');
            setActiveTab('pricing');
            return;
        }
        if (
            formData.discountPrice !== '' &&
            Number(formData.discountPrice) >= Number(formData.price)
        ) {
            toast.error('Discount price must be less than Base Price');
            setActiveTab('pricing');
            return;
        }

        const payload = {
            name: formData.name.trim(),
            category: formData.category,
            description: formData.description.trim() || formData.name.trim(),
            tags: formData.tags,
            price: Number(formData.price),
            discountPrice:
                formData.discountPrice !== '' && formData.discountPrice !== null
                    ? Number(formData.discountPrice)
                    : undefined,
            countInStock: Number(formData.countInStock) || 0,
            images: formData.images,
            pairingItems: formData.category === 'pairing' ? formData.pairingItems : [],
            metaTitle: formData.metaTitle.trim(),
            metaDescription: formData.metaDescription.trim(),
            metaKeywords: formData.metaKeywords.trim(),
        };

        try {
            if (isEditMode) {
                await dispatch(updateProduct({ id, productData: payload })).unwrap();
                toast.success('Product updated successfully!');
            } else {
                await dispatch(createProduct(payload)).unwrap();
                toast.success('Product created successfully!');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err || 'Failed to save product');
        }
    };

    if (isEditMode && loadingCurrentProduct) {
        return (
            <div className="max-w-5xl mx-auto p-8 text-center py-24">
                <FaSpinner className="inline-block animate-spin text-4xl text-ktr-blue mb-4" />
                <p className="text-ktr-blue font-bold text-lg">Loading product details...</p>
            </div>
        );
    }

    if (isEditMode && currentProductError) {
        return (
            <div className="max-w-3xl mx-auto p-6 mt-10">
                <div className="bg-ktr-skin/90 border-2 border-ktr-pink text-ktr-blue p-6 rounded-2xl text-center shadow-md">
                    <FaExclamationTriangle className="text-3xl text-ktr-pink mx-auto mb-2" />
                    <h3 className="text-lg font-bold">Error Loading Product</h3>
                    <p className="text-sm mt-1 opacity-80">{currentProductError}</p>
                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            onClick={() => dispatch(fetchAdminProductById(id))}
                            className="px-4 py-2 bg-ktr-blue text-ktr-skin rounded-lg text-sm font-semibold hover:bg-ktr-blue/90 cursor-pointer shadow-sm"
                        >
                            Retry
                        </button>
                        <Link
                            to="/admin/products"
                            className="px-4 py-2 bg-ktr-pink text-ktr-blue rounded-lg text-sm font-semibold hover:bg-ktr-pink/80 cursor-pointer shadow-sm"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const metaTitleLen = formData.metaTitle.length;
    const metaDescLen = formData.metaDescription.length;
    const discountPercent =
        formData.price && formData.discountPrice && Number(formData.price) > Number(formData.discountPrice)
            ? Math.round(((Number(formData.price) - Number(formData.discountPrice)) / Number(formData.price)) * 100)
            : 0;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-28">
            {/* Top Navigation & Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ktr-blue/30 mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/products"
                        className="p-2.5 rounded-xl border border-ktr-blue bg-ktr-skin text-ktr-blue hover:bg-ktr-blue hover:text-ktr-skin transition-colors cursor-pointer shadow-xs"
                        title="Back to Product List"
                    >
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-[11px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    isEditMode
                                        ? 'bg-ktr-pink/40 border-ktr-pink text-ktr-blue'
                                        : 'bg-ktr-green/20 border-ktr-green/40 text-ktr-green'
                                }`}
                            >
                                {isEditMode ? 'Edit Mode' : 'New Product'}
                            </span>
                            <span className="text-xs text-ktr-blue/70 font-medium">
                                {isEditMode ? `ID: ${id}` : 'Create a fresh catalog item'}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-ktr-blue mt-0.5">
                            {isEditMode ? (formData.name || 'Edit Product') : 'Create New Product'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-ktr-skin p-1 rounded-xl border border-ktr-blue/40 text-xs font-semibold shadow-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('tabs')}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                                viewMode === 'tabs'
                                    ? 'bg-ktr-blue text-ktr-skin shadow-sm'
                                    : 'text-ktr-blue hover:bg-ktr-pink/30'
                            }`}
                        >
                            Tabs View
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('accordion')}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                                viewMode === 'accordion'
                                    ? 'bg-ktr-blue text-ktr-skin shadow-sm'
                                    : 'text-ktr-blue hover:bg-ktr-pink/30'
                            }`}
                        >
                            Accordion View
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-ktr-blue text-ktr-skin rounded-xl font-bold hover:bg-ktr-blue/90 shadow-md transition cursor-pointer disabled:opacity-50 border border-ktr-blue"
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin text-sm" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FaSave className="text-sm" />
                                <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB NAVIGATION (Shown when in 'tabs' view) */}
            {viewMode === 'tabs' && (
                <div className="flex overflow-x-auto gap-2 p-2 bg-ktr-skin rounded-2xl border border-ktr-blue/40 mb-6 shadow-sm scrollbar-thin">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isPairing = section.id === 'pairing';
                        const isInactive = isPairing && formData.category !== 'pairing';

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => {
                                    if (isInactive) {
                                        toast.info("Pairing Details are active when category is 'pairing'");
                                    } else {
                                        setActiveTab(section.id);
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                                    activeTab === section.id
                                        ? 'bg-ktr-blue text-ktr-skin shadow-md'
                                        : isInactive
                                        ? 'opacity-40 text-ktr-blue/50 hover:opacity-60 bg-transparent'
                                        : 'text-ktr-blue bg-ktr-pink/30 hover:bg-ktr-pink/60 border border-ktr-pink/40'
                                }`}
                            >
                                <Icon className="text-base" />
                                <span>{section.label}</span>
                                {isPairing && (
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                                            formData.category === 'pairing'
                                                ? 'bg-ktr-skin text-ktr-blue border border-ktr-blue'
                                                : 'bg-ktr-pink/50 text-ktr-blue'
                                        }`}
                                    >
                                        {formData.category === 'pairing'
                                            ? `${formData.pairingItems?.length || 0}`
                                            : 'Conditional'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ============================================================== */}
                {/* 1. BASIC INFO SECTION */}
                {/* ============================================================== */}
                {(viewMode === 'accordion' || activeTab === 'basic') && (
                    <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md overflow-hidden">
                        <div
                            onClick={() =>
                                viewMode === 'accordion' &&
                                setAccordionOpen((prev) => ({ ...prev, basic: !prev.basic }))
                            }
                            className={`p-5 flex items-center justify-between bg-ktr-blue text-ktr-skin ${
                                viewMode === 'accordion' ? 'cursor-pointer hover:bg-ktr-blue/95' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-ktr-skin text-ktr-blue">
                                    <FaBoxOpen className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ktr-skin">Basic Information</h3>
                                    <p className="text-xs text-ktr-skin/80">
                                        Core product identifiers, collection category, and tags
                                    </p>
                                </div>
                            </div>
                            {viewMode === 'accordion' && (
                                <div className="text-ktr-skin text-lg">
                                    {accordionOpen.basic ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            )}
                        </div>

                        {(viewMode === 'tabs' || accordionOpen.basic) && (
                            <div className="p-6 space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1.5">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Frankenstein & French Canelé Pairing Box"
                                        className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue placeholder:text-ktr-blue/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ktr-blue focus:border-ktr-blue font-semibold shadow-2xs"
                                        required
                                    />
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            {
                                                id: 'library',
                                                title: 'Library (Books)',
                                                desc: 'Literary classics, modern fiction, hardcovers',
                                                icon: FaBook,
                                            },
                                            {
                                                id: 'oven',
                                                title: 'Oven (Pastries)',
                                                desc: 'Fresh artisan breads, cookies, croissants',
                                                icon: FaUtensils,
                                            },
                                            {
                                                id: 'pairing',
                                                title: 'Pairing (Combos)',
                                                desc: 'Curated gift boxes matching books with pastries',
                                                icon: FaGift,
                                            },
                                        ].map((cat) => {
                                            const CatIcon = cat.icon;
                                            const isSelected = formData.category === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => handleCategoryChange(cat.id)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'border-ktr-blue bg-ktr-blue text-ktr-skin shadow-md'
                                                            : 'border-ktr-blue/30 hover:border-ktr-blue bg-ktr-skin/50 text-ktr-blue hover:bg-ktr-pink/20'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div
                                                            className={`p-2 rounded-lg ${
                                                                isSelected
                                                                    ? 'bg-ktr-skin text-ktr-blue'
                                                                    : 'bg-ktr-pink/40 text-ktr-blue'
                                                            }`}
                                                        >
                                                            <CatIcon />
                                                        </div>
                                                        {isSelected && (
                                                            <span className="text-xs font-bold text-ktr-skin flex items-center gap-1">
                                                                <FaCheck className="text-[10px]" /> Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm ${isSelected ? 'text-ktr-skin' : 'text-ktr-blue'}`}>
                                                            {cat.title}
                                                        </p>
                                                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-ktr-skin/80' : 'text-ktr-blue/70'}`}>
                                                            {cat.desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {formData.category === 'pairing' && (
                                        <div className="mt-3 p-3 bg-ktr-pink/20 border border-ktr-pink rounded-xl text-xs text-ktr-blue flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FaGift className="text-ktr-blue text-base" />
                                                <span><strong>Pairing Category selected!</strong> You can link specific books and pastries in the <em>Pairing Details</em> tab.</span>
                                            </span>
                                            {viewMode === 'tabs' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('pairing')}
                                                    className="font-bold underline text-ktr-blue hover:opacity-80 cursor-pointer ml-2"
                                                >
                                                    Go to Pairing Details →
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1.5">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe the story, the flavor profile, pairing inspiration, and ingredients..."
                                        className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue placeholder:text-ktr-blue/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ktr-blue focus:border-ktr-blue font-medium shadow-2xs"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1.5">
                                        Tags <span className="text-ktr-blue/60 font-normal">(e.g., ["gothic", "bronte"])</span>
                                    </label>
                                    <div className="flex flex-wrap items-center gap-2 p-2 border border-ktr-blue/40 rounded-xl bg-white/90 min-h-[48px] focus-within:ring-2 focus-within:ring-ktr-blue">
                                        {formData.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ktr-pink/40 border border-ktr-pink text-ktr-blue text-xs font-bold shadow-2xs"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(idx)}
                                                    className="text-ktr-blue/70 hover:text-red-600 cursor-pointer"
                                                >
                                                    <FaTimes className="text-[10px]" />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            onBlur={() => {
                                                if (tagInput.trim()) handleAddTag(tagInput);
                                            }}
                                            placeholder={formData.tags.length === 0 ? "Type a tag and press Enter or ','" : "Add more..."}
                                            className="flex-1 min-w-[140px] text-xs outline-none bg-transparent p-1 text-ktr-blue font-semibold placeholder:text-ktr-blue/40"
                                        />
                                    </div>

                                    {/* Suggested Tags Quick-Add */}
                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[11px] text-ktr-blue font-bold">Suggested:</span>
                                        {SUGGESTED_TAGS.map((sug) => {
                                            const isSelected = formData.tags.includes(sug);
                                            return (
                                                <button
                                                    key={sug}
                                                    type="button"
                                                    onClick={() =>
                                                        isSelected
                                                            ? handleRemoveTag(formData.tags.indexOf(sug))
                                                            : handleAddTag(sug)
                                                    }
                                                    className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold transition cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-ktr-blue text-ktr-skin border-ktr-blue'
                                                            : 'bg-ktr-skin hover:bg-ktr-pink/30 text-ktr-blue border-ktr-blue/30'
                                                    }`}
                                                >
                                                    {isSelected ? `✓ ${sug}` : `+ ${sug}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* 2. PRICING & STOCK SECTION */}
                {/* ============================================================== */}
                {(viewMode === 'accordion' || activeTab === 'pricing') && (
                    <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md overflow-hidden">
                        <div
                            onClick={() =>
                                viewMode === 'accordion' &&
                                setAccordionOpen((prev) => ({ ...prev, pricing: !prev.pricing }))
                            }
                            className={`p-5 flex items-center justify-between bg-ktr-blue text-ktr-skin ${
                                viewMode === 'accordion' ? 'cursor-pointer hover:bg-ktr-blue/95' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-ktr-skin text-ktr-blue">
                                    <FaDollarSign className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ktr-skin">Pricing & Inventory Stock</h3>
                                    <p className="text-xs text-ktr-skin/80">
                                        Set retail base price, promotional discounts, and warehouse inventory
                                    </p>
                                </div>
                            </div>
                            {viewMode === 'accordion' && (
                                <div className="text-ktr-skin text-lg">
                                    {accordionOpen.pricing ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            )}
                        </div>

                        {(viewMode === 'tabs' || accordionOpen.pricing) && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Base Price */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1.5">
                                            Base Price ($) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-3 text-ktr-blue font-extrabold">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                step="0.01"
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="19.99"
                                                className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                                required
                                            />
                                        </div>
                                        <p className="text-[11px] text-ktr-blue/70 mt-1 font-medium">Standard catalog list price</p>
                                    </div>

                                    {/* Discount Price */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                                Discount Price ($)
                                            </label>
                                            {discountPercent > 0 && (
                                                <span className="text-xs bg-ktr-green text-ktr-skin font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                                    {discountPercent}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-3 text-ktr-blue font-extrabold">$</span>
                                            <input
                                                type="number"
                                                name="discountPrice"
                                                step="0.01"
                                                min="0"
                                                value={formData.discountPrice}
                                                onChange={handleChange}
                                                placeholder="Leave empty if none"
                                                className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                            />
                                        </div>
                                        <p className="text-[11px] text-ktr-blue/70 mt-1 font-medium">
                                            Promotional price shown on product page
                                        </p>
                                    </div>

                                    {/* Stock Count */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                                Stock Count (countInStock) <span className="text-red-500">*</span>
                                            </label>
                                            <span
                                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                                    Number(formData.countInStock) === 0
                                                        ? 'bg-red-100 text-red-700 border-red-300'
                                                        : Number(formData.countInStock) <= 5
                                                        ? 'bg-ktr-pink/50 text-ktr-blue border-ktr-pink'
                                                        : 'bg-ktr-green/20 text-ktr-green border-ktr-green/40'
                                                }`}
                                            >
                                                {Number(formData.countInStock) === 0
                                                    ? 'Out of Stock'
                                                    : Number(formData.countInStock) <= 5
                                                    ? 'Low Stock'
                                                    : 'In Stock'}
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            name="countInStock"
                                            min="0"
                                            value={formData.countInStock}
                                            onChange={handleChange}
                                            className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                            required
                                        />
                                        <p className="text-[11px] text-ktr-blue/70 mt-1 font-medium">
                                            Units currently available for fulfillment
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* 3. MEDIA GALLERY SECTION */}
                {/* ============================================================== */}
                {(viewMode === 'accordion' || activeTab === 'media') && (
                    <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md overflow-hidden">
                        <div
                            onClick={() =>
                                viewMode === 'accordion' &&
                                setAccordionOpen((prev) => ({ ...prev, media: !prev.media }))
                            }
                            className={`p-5 flex items-center justify-between bg-ktr-blue text-ktr-skin ${
                                viewMode === 'accordion' ? 'cursor-pointer hover:bg-ktr-blue/95' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-ktr-skin text-ktr-blue">
                                    <FaImages className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ktr-skin">Media Gallery</h3>
                                    <p className="text-xs text-ktr-skin/80">
                                        Mapped to `images: [{'{'} url, altText {'}'}]` with drag-and-drop reordering
                                    </p>
                                </div>
                            </div>
                            {viewMode === 'accordion' && (
                                <div className="text-ktr-skin text-lg">
                                    {accordionOpen.media ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            )}
                        </div>

                        {(viewMode === 'tabs' || accordionOpen.media) && (
                            <div className="p-6 space-y-6">
                                {/* Upload / Add Methods */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Method A: Upload Files */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-ktr-blue/60 bg-ktr-skin/50 rounded-2xl p-6 text-center hover:bg-ktr-pink/20 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        {isUploading ? (
                                            <>
                                                <FaSpinner className="animate-spin text-3xl text-ktr-blue mb-2" />
                                                <p className="text-sm font-bold text-ktr-blue">
                                                    Uploading images to Cloudinary...
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 rounded-full bg-ktr-blue text-ktr-skin mb-2">
                                                    <FaUpload className="text-xl" />
                                                </div>
                                                <p className="text-sm font-bold text-ktr-blue">
                                                    Click or Drag & Drop Images Here
                                                </p>
                                                <p className="text-xs text-ktr-blue/70 mt-1">
                                                    Supports PNG, JPG, WebP (up to 10MB each)
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Method B: Direct URL Input */}
                                    <div className="border border-ktr-blue/40 rounded-2xl p-5 bg-ktr-skin/40 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-ktr-blue mb-2 flex items-center gap-1.5">
                                                <FaLink /> Or Add via Direct Image URL
                                            </h4>
                                            <input
                                                type="url"
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="w-full bg-white/90 border border-ktr-blue/40 rounded-xl p-2.5 text-xs mb-2 text-ktr-blue placeholder:text-ktr-blue/40 focus:outline-none focus:ring-2 focus:ring-ktr-blue"
                                            />
                                            <input
                                                type="text"
                                                value={altTextInput}
                                                onChange={(e) => setAltTextInput(e.target.value)}
                                                placeholder="Alt text for SEO (e.g. Sourdough loaf golden crust)"
                                                className="w-full bg-white/90 border border-ktr-blue/40 rounded-xl p-2.5 text-xs text-ktr-blue placeholder:text-ktr-blue/40 focus:outline-none focus:ring-2 focus:ring-ktr-blue"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddUrlImage}
                                            className="mt-3 w-full py-2.5 bg-ktr-blue text-ktr-skin rounded-xl text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                                        >
                                            <FaPlus /> Add Image URL
                                        </button>
                                    </div>
                                </div>

                                {/* Image Gallery Cards with Drag-and-Drop */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                            Gallery Images ({formData.images.length})
                                        </h4>
                                        <span className="text-xs text-ktr-blue/80 font-medium">
                                            💡 Drag cards to reorder. 1st image is the primary cover.
                                        </span>
                                    </div>

                                    {formData.images.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-ktr-blue/30 rounded-2xl bg-ktr-skin/40 text-ktr-blue/60">
                                            <FaImages className="text-3xl mx-auto mb-2 opacity-50 text-ktr-blue" />
                                            <p className="text-sm font-semibold">No images added yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {formData.images.map((img, idx) => {
                                                const isCover = idx === 0;
                                                const isBeingDragged = draggedImageIndex === idx;
                                                const isDragOver = dragOverIndex === idx;

                                                return (
                                                    <div
                                                        key={idx}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, idx)}
                                                        onDragOver={(e) => handleDragOver(e, idx)}
                                                        onDrop={(e) => handleDrop(e, idx)}
                                                        onDragEnd={handleDragEnd}
                                                        className={`border-2 rounded-2xl p-3 bg-white/90 shadow-sm transition-all relative ${
                                                            isCover
                                                                ? 'border-ktr-blue ring-2 ring-ktr-blue/30'
                                                                : 'border-ktr-blue/20'
                                                        } ${isBeingDragged ? 'opacity-40 scale-95' : ''} ${
                                                            isDragOver ? 'border-dashed border-2 border-ktr-blue bg-ktr-pink/20' : ''
                                                        }`}
                                                    >
                                                        {/* Top Badges & Drag Handle */}
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <span
                                                                    className="cursor-grab active:cursor-grabbing text-ktr-blue/60 hover:text-ktr-blue p-1"
                                                                    title="Drag to reorder"
                                                                >
                                                                    <FaGripVertical />
                                                                </span>
                                                                {isCover ? (
                                                                    <span className="bg-ktr-blue text-ktr-skin text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                                                        ★ Primary Cover
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-ktr-blue px-2 py-0.5 bg-ktr-skin rounded-md border border-ktr-blue/30">
                                                                        #{idx + 1}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Controls */}
                                                            <div className="flex items-center gap-1">
                                                                {idx > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleMoveImage(idx, idx - 1)}
                                                                        title="Move earlier"
                                                                        className="p-1 text-ktr-blue hover:opacity-70 text-xs cursor-pointer font-bold"
                                                                    >
                                                                        ←
                                                                    </button>
                                                                )}
                                                                {idx < formData.images.length - 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleMoveImage(idx, idx + 1)}
                                                                        title="Move later"
                                                                        className="p-1 text-ktr-blue hover:opacity-70 text-xs cursor-pointer font-bold"
                                                                    >
                                                                        →
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(idx)}
                                                                    title="Delete image"
                                                                    className="p-1 text-red-500 hover:text-red-700 text-xs cursor-pointer ml-1"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Image Preview */}
                                                        <div className="relative aspect-video rounded-xl overflow-hidden bg-ktr-skin/40 mb-2 border border-ktr-blue/20">
                                                            <img
                                                                src={img.url}
                                                                alt={img.altText || 'Product preview'}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src =
                                                                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300';
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Alt Text Input */}
                                                        <div>
                                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-ktr-blue mb-0.5">
                                                                Alt Text (SEO & Accessibility)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={img.altText || ''}
                                                                onChange={(e) => handleUpdateAltText(idx, e.target.value)}
                                                                placeholder="Descriptive image alt text"
                                                                className="w-full text-xs bg-white border border-ktr-blue/30 rounded-lg p-2 text-ktr-blue placeholder:text-ktr-blue/40 focus:outline-none focus:ring-1 focus:ring-ktr-blue"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* 4. PAIRING DETAILS (CONDITIONAL) SECTION */}
                {/* ============================================================== */}
                {(viewMode === 'accordion' || activeTab === 'pairing') && (
                    <div
                        className={`bg-ktr-skin/90 rounded-2xl border-2 shadow-md overflow-hidden ${
                            formData.category === 'pairing'
                                ? 'border-ktr-pink ring-2 ring-ktr-pink/30'
                                : 'border-ktr-blue/20 opacity-60'
                        }`}
                    >
                        <div
                            onClick={() =>
                                viewMode === 'accordion' &&
                                setAccordionOpen((prev) => ({ ...prev, pairing: !prev.pairing }))
                            }
                            className={`p-5 flex items-center justify-between bg-ktr-blue text-ktr-skin ${
                                viewMode === 'accordion' ? 'cursor-pointer hover:bg-ktr-blue/95' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-ktr-pink text-ktr-blue">
                                    <FaGift className="text-xl" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-ktr-skin">Pairing Bundle Details</h3>
                                        <span className="text-[10px] bg-ktr-pink text-ktr-blue font-extrabold px-2 py-0.5 rounded-full uppercase">
                                            Conditional
                                        </span>
                                    </div>
                                    <p className="text-xs text-ktr-skin/80">
                                        Link specific books and pastries included in this bundle combo
                                    </p>
                                </div>
                            </div>
                            {viewMode === 'accordion' && (
                                <div className="text-ktr-skin text-lg">
                                    {accordionOpen.pairing ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            )}
                        </div>

                        {(viewMode === 'tabs' || accordionOpen.pairing) && (
                            <div className="p-6 space-y-6">
                                {formData.category !== 'pairing' ? (
                                    <div className="p-8 text-center bg-ktr-skin/50 rounded-2xl border-2 border-dashed border-ktr-blue/30">
                                        <FaGift className="text-3xl text-ktr-pink mx-auto mb-2" />
                                        <h4 className="font-bold text-ktr-blue">Pairing Details are Inactive</h4>
                                        <p className="text-xs text-ktr-blue/70 mt-1 max-w-md mx-auto">
                                            This section is only available when the product category is set to{' '}
                                            <strong>"pairing"</strong>. Change the category in the Basic Info section to
                                            enable bundling books and pastries.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleCategoryChange('pairing')}
                                            className="mt-4 px-4 py-2 bg-ktr-blue text-ktr-skin rounded-xl text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer shadow-xs"
                                        >
                                            Switch Category to Pairing
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Selected Items Summary Banner */}
                                        <div className="p-4 bg-ktr-skin rounded-2xl border-2 border-ktr-pink shadow-xs">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-extrabold text-ktr-blue uppercase tracking-wider">
                                                        Included In This Bundle ({formData.pairingItems?.length || 0} items)
                                                    </p>
                                                    <p className="text-xs text-ktr-blue/80 mt-0.5 font-medium">
                                                        Sum of individual items: <strong>${totalIndividualPrice.toFixed(2)}</strong>
                                                        {formData.price && (
                                                            <> | Bundle Base Price: <strong>${Number(formData.price).toFixed(2)}</strong></>
                                                        )}
                                                    </p>
                                                </div>

                                                {selectedPairingItemsList.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData((prev) => ({ ...prev, pairingItems: [] }))}
                                                        className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                                                    >
                                                        Clear all
                                                    </button>
                                                )}
                                            </div>

                                            {/* Pills of currently selected items */}
                                            {selectedPairingItemsList.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-ktr-pink/50">
                                                    {selectedPairingItemsList.map((item) => (
                                                        <span
                                                            key={item._id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-ktr-blue text-ktr-skin border border-ktr-blue rounded-full text-xs font-bold shadow-2xs"
                                                        >
                                                            <span>{item.category === 'library' ? '📚' : '🥐'}</span>
                                                            <span className="truncate max-w-[200px]">{item.name}</span>
                                                            <span className="text-ktr-pink font-extrabold">${item.price}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTogglePairingProduct(item._id)}
                                                                className="text-ktr-skin/70 hover:text-red-300 cursor-pointer"
                                                            >
                                                                <FaTimes className="text-[10px]" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-ktr-blue/70 mt-2 italic font-medium">
                                                    No books or pastries selected yet. Pick items below to construct your pairing box.
                                                </p>
                                            )}
                                        </div>

                                        {/* Filter Search */}
                                        <div className="relative">
                                            <FaSearch className="absolute left-3.5 top-3.5 text-ktr-blue/50 text-xs" />
                                            <input
                                                type="text"
                                                value={pairingSearch}
                                                onChange={(e) => setPairingSearch(e.target.value)}
                                                placeholder="Filter books and pastries by title..."
                                                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/90 border border-ktr-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-ktr-blue text-ktr-blue font-semibold placeholder:text-ktr-blue/40"
                                            />
                                        </div>

                                        {/* Multi-Select Dual Columns (Books & Pastries) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Column A: Books (library) */}
                                            <div className="border-2 border-ktr-blue/40 rounded-2xl p-4 bg-ktr-skin/50 shadow-xs">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-ktr-blue mb-3 flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        <FaBook className="text-ktr-blue" />
                                                        <span>Books (Library)</span>
                                                    </span>
                                                    <span className="text-[10px] bg-ktr-blue text-ktr-skin px-2.5 py-0.5 rounded-full font-bold">
                                                        {filteredBooks.length} available
                                                    </span>
                                                </h4>

                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                    {filteredBooks.length === 0 ? (
                                                        <p className="text-xs text-ktr-blue/60 py-4 text-center italic">
                                                            No books found.
                                                        </p>
                                                    ) : (
                                                        filteredBooks.map((book) => {
                                                            const isChecked = formData.pairingItems?.includes(book._id);
                                                            const img = book.images?.[0]?.url || book.image || '/placeholder.png';
                                                            return (
                                                                <label
                                                                    key={book._id}
                                                                    className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition cursor-pointer ${
                                                                        isChecked
                                                                            ? 'bg-ktr-blue/15 border-ktr-blue shadow-xs'
                                                                            : 'bg-white/80 border-ktr-blue/20 hover:bg-white'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleTogglePairingProduct(book._id)}
                                                                        className="rounded accent-ktr-blue h-4 w-4"
                                                                    />
                                                                    <img
                                                                        src={img}
                                                                        alt={book.name}
                                                                        className="w-10 h-10 object-cover rounded-lg border border-ktr-blue/30 flex-shrink-0"
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-bold text-ktr-blue truncate">
                                                                            {book.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-ktr-blue/70 font-semibold">
                                                                            ${book.price} | Stock: {book.countInStock ?? 0}
                                                                        </p>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>

                                            {/* Column B: Pastries (oven) */}
                                            <div className="border-2 border-ktr-pink rounded-2xl p-4 bg-ktr-skin/50 shadow-xs">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-ktr-blue mb-3 flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        <FaUtensils className="text-ktr-blue" />
                                                        <span>Pastries & Bakery (Oven)</span>
                                                    </span>
                                                    <span className="text-[10px] bg-ktr-pink text-ktr-blue px-2.5 py-0.5 rounded-full font-bold">
                                                        {filteredPastries.length} available
                                                    </span>
                                                </h4>

                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                    {filteredPastries.length === 0 ? (
                                                        <p className="text-xs text-ktr-blue/60 py-4 text-center italic">
                                                            No pastries found.
                                                        </p>
                                                    ) : (
                                                        filteredPastries.map((pastry) => {
                                                            const isChecked = formData.pairingItems?.includes(pastry._id);
                                                            const img =
                                                                pastry.images?.[0]?.url || pastry.image || '/placeholder.png';
                                                            return (
                                                                <label
                                                                    key={pastry._id}
                                                                    className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition cursor-pointer ${
                                                                        isChecked
                                                                            ? 'bg-ktr-pink/30 border-ktr-pink shadow-xs'
                                                                            : 'bg-white/80 border-ktr-blue/20 hover:bg-white'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleTogglePairingProduct(pastry._id)}
                                                                        className="rounded accent-ktr-blue h-4 w-4"
                                                                    />
                                                                    <img
                                                                        src={img}
                                                                        alt={pastry.name}
                                                                        className="w-10 h-10 object-cover rounded-lg border border-ktr-blue/30 flex-shrink-0"
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-bold text-ktr-blue truncate">
                                                                            {pastry.name}
                                                                        </p>
                                                                        <p className="text-[10px] text-ktr-blue/70 font-semibold">
                                                                            ${pastry.price} | Stock: {pastry.countInStock ?? 0}
                                                                        </p>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ============================================================== */}
                {/* 5. SEO & METADATA SECTION (CRUCIAL FOR SCHEMA) */}
                {/* ============================================================== */}
                {(viewMode === 'accordion' || activeTab === 'seo') && (
                    <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md overflow-hidden">
                        <div
                            onClick={() =>
                                viewMode === 'accordion' &&
                                setAccordionOpen((prev) => ({ ...prev, seo: !prev.seo }))
                            }
                            className={`p-5 flex items-center justify-between bg-ktr-blue text-ktr-skin ${
                                viewMode === 'accordion' ? 'cursor-pointer hover:bg-ktr-blue/95' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-ktr-skin text-ktr-blue">
                                    <FaSearch className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ktr-skin">SEO & Metadata Configuration</h3>
                                    <p className="text-xs text-ktr-skin/80">
                                        Schema fields: metaTitle, metaDescription, and metaKeywords with character counters
                                    </p>
                                </div>
                            </div>
                            {viewMode === 'accordion' && (
                                <div className="text-ktr-skin text-lg">
                                    {accordionOpen.seo ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            )}
                        </div>

                        {(viewMode === 'tabs' || accordionOpen.seo) && (
                            <div className="p-6 space-y-6">
                                {/* Meta Title */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                            Meta Title
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleGenerateMetaTitle}
                                                className="text-[11px] text-ktr-blue hover:underline font-bold cursor-pointer"
                                            >
                                                Auto-Generate
                                            </button>
                                            <span
                                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                                    metaTitleLen >= 50 && metaTitleLen <= 60
                                                        ? 'bg-ktr-green/20 text-ktr-green border-ktr-green/40'
                                                        : metaTitleLen > 60
                                                        ? 'bg-red-100 text-red-700 border-red-300'
                                                        : 'bg-ktr-pink/30 text-ktr-blue border-ktr-pink'
                                                }`}
                                            >
                                                {metaTitleLen} / 50–60 chars
                                                {metaTitleLen >= 50 && metaTitleLen <= 60 && ' (Optimal)'}
                                                {metaTitleLen > 60 && ' (Too long)'}
                                                {metaTitleLen > 0 && metaTitleLen < 50 && ' (Too short)'}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        placeholder="e.g. Frankenstein & French Canelé Pairing Box | Knead to Read"
                                        className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                    />
                                    <div className="w-full bg-ktr-blue/10 h-2 rounded-full mt-2 overflow-hidden border border-ktr-blue/20">
                                        <div
                                            className={`h-full transition-all ${
                                                metaTitleLen >= 50 && metaTitleLen <= 60
                                                    ? 'bg-ktr-green'
                                                    : metaTitleLen > 60
                                                    ? 'bg-red-500'
                                                    : 'bg-ktr-pink'
                                            }`}
                                            style={{ width: `${Math.min(100, (metaTitleLen / 60) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                            Meta Description
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleGenerateMetaDescription}
                                                className="text-[11px] text-ktr-blue hover:underline font-bold cursor-pointer"
                                            >
                                                Auto-Generate
                                            </button>
                                            <span
                                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                                    metaDescLen >= 150 && metaDescLen <= 160
                                                        ? 'bg-ktr-green/20 text-ktr-green border-ktr-green/40'
                                                        : metaDescLen > 160
                                                        ? 'bg-red-100 text-red-700 border-red-300'
                                                        : 'bg-ktr-pink/30 text-ktr-blue border-ktr-pink'
                                                }`}
                                            >
                                                {metaDescLen} / 150–160 chars
                                                {metaDescLen >= 150 && metaDescLen <= 160 && ' (Optimal)'}
                                                {metaDescLen > 160 && ' (Too long)'}
                                                {metaDescLen > 0 && metaDescLen < 150 && ' (Too short)'}
                                            </span>
                                        </div>
                                    </div>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Target 150–160 characters summary for Google search snippets..."
                                        className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                    />
                                    <div className="w-full bg-ktr-blue/10 h-2 rounded-full mt-2 overflow-hidden border border-ktr-blue/20">
                                        <div
                                            className={`h-full transition-all ${
                                                metaDescLen >= 150 && metaDescLen <= 160
                                                    ? 'bg-ktr-green'
                                                    : metaDescLen > 160
                                                    ? 'bg-red-500'
                                                    : 'bg-ktr-pink'
                                            }`}
                                            style={{ width: `${Math.min(100, (metaDescLen / 160) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Meta Keywords */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue">
                                            Meta Keywords (Comma-separated)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleSyncKeywordsFromTags}
                                            className="text-[11px] text-ktr-blue hover:underline font-bold cursor-pointer"
                                        >
                                            Sync from Product Tags
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        name="metaKeywords"
                                        value={formData.metaKeywords}
                                        onChange={handleChange}
                                        placeholder="e.g. frankenstein book box, canele pairing, gothic book gift"
                                        className="w-full bg-white/90 border border-ktr-blue/40 text-ktr-blue rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ktr-blue shadow-2xs"
                                    />

                                    {/* Keyword Pills Preview */}
                                    {formData.metaKeywords && (
                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                            {formData.metaKeywords
                                                .split(',')
                                                .map((kw) => kw.trim())
                                                .filter(Boolean)
                                                .map((kw, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[11px] bg-ktr-skin text-ktr-blue px-2.5 py-0.5 rounded-md border border-ktr-blue/30 font-semibold"
                                                    >
                                                        {kw}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {/* Live Google SERP Snippet Preview */}
                                <div className="border-2 border-ktr-blue/30 rounded-2xl p-4 bg-ktr-skin/60 shadow-xs">
                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-ktr-blue mb-2.5 flex items-center gap-1.5">
                                        <FaGoogle className="text-ktr-blue" /> Search Engine Snippet Preview
                                    </p>
                                    <div className="bg-white/95 p-4 rounded-xl border border-ktr-blue/30 shadow-xs font-sans max-w-xl">
                                        <div className="flex items-center gap-1.5 text-xs text-ktr-green mb-0.5 font-medium">
                                            <span>
                                                https://kneadtoread.com &gt; {formData.category} &gt;{' '}
                                                {formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : 'product'}
                                            </span>
                                        </div>
                                        <div className="text-ktr-blue text-lg hover:underline cursor-pointer font-bold leading-tight">
                                            {formData.metaTitle || formData.name || 'Product Title on Search'}
                                        </div>
                                        <div className="text-gray-700 text-xs mt-1.5 leading-snug line-clamp-2">
                                            {formData.metaDescription ||
                                                formData.description ||
                                                'Provide an engaging meta description to improve click-through rates from search engines.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* BOTTOM STICKY BAR FOR STEPS & ACTIONS */}
                <div className="sticky bottom-4 z-20 bg-ktr-skin/95 backdrop-blur-md border-2 border-ktr-blue/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {viewMode === 'tabs' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = SECTIONS.findIndex((s) => s.id === activeTab);
                                        if (currentIdx > 0) {
                                            const prev = SECTIONS[currentIdx - 1];
                                            if (prev.id === 'pairing' && formData.category !== 'pairing') {
                                                if (currentIdx - 2 >= 0) setActiveTab(SECTIONS[currentIdx - 2].id);
                                            } else {
                                                setActiveTab(prev.id);
                                            }
                                        }
                                    }}
                                    disabled={activeTab === 'basic'}
                                    className="px-4 py-2 border-2 border-ktr-blue/40 rounded-xl text-xs font-bold text-ktr-blue bg-ktr-skin hover:bg-ktr-pink/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                                >
                                    ← Previous Tab
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentIdx = SECTIONS.findIndex((s) => s.id === activeTab);
                                        if (currentIdx < SECTIONS.length - 1) {
                                            const next = SECTIONS[currentIdx + 1];
                                            if (next.id === 'pairing' && formData.category !== 'pairing') {
                                                if (currentIdx + 2 < SECTIONS.length) setActiveTab(SECTIONS[currentIdx + 2].id);
                                            } else {
                                                setActiveTab(next.id);
                                            }
                                        }
                                    }}
                                    disabled={activeTab === 'seo'}
                                    className="px-4 py-2 border-2 border-ktr-blue/40 rounded-xl text-xs font-bold text-ktr-blue bg-ktr-skin hover:bg-ktr-pink/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                                >
                                    Next Tab →
                                </button>
                            </>
                        )}
                        <span className="text-xs text-ktr-blue/80 font-bold hidden md:inline-block ml-2">
                            {formData.images.length} images | {formData.tags.length} tags
                            {formData.category === 'pairing' && ` | ${formData.pairingItems?.length || 0} bundle items`}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Link
                            to="/admin/products"
                            className="px-5 py-2.5 border-2 border-ktr-blue/40 rounded-xl text-xs font-bold text-ktr-blue hover:bg-ktr-pink/30 transition shadow-2xs"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-ktr-blue text-ktr-skin rounded-xl font-extrabold text-sm hover:bg-ktr-blue/90 shadow-md transition cursor-pointer disabled:opacity-50 border border-ktr-blue"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin text-sm" />
                                    <span>Saving Product...</span>
                                </>
                            ) : (
                                <>
                                    <FaCheck className="text-xs" />
                                    <span>{isEditMode ? 'Save & Update Product' : 'Publish Product'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
