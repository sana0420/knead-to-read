import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, updateProfile } from '../redux/slices/authSlice';
import MyOrdersPage from './MyOrdersPage';
import { toast } from 'sonner';
import {
  HiOutlineShoppingBag,
  HiOutlineBookmark,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineCake
} from 'react-icons/hi2';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("DEBUG USER OBJECT IN PROFILE:", user);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'subscription' | 'settings'

  // Form states for profile editing
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = { name, email };
      if (password.trim() !== '') {
        updateData.password = password;
      }

      await dispatch(updateProfile(updateData)).unwrap();
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const memberSince = user?.createdAt ?
    new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Member';

  const isAdmin = user?.role === 'admin';
  const hasActiveSubscription = user?.subscription?.status === 'active';

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN USER PROFILE VIEW (Only Admin Card, cohesive with KTR palette)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className='min-h-screen bg-booksdos py-16 px-4 flex flex-col items-center justify-center text-ktr-blue'>
        <div className='w-full max-w-sm bg-[#FFFDEB]/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-ktr-pink/35 flex flex-col items-center text-center'>
          {/* Avatar with warm brand styling */}
          <div className='w-22 h-22 rounded-full bg-ktr-green text-ktr-skin ring-4 ring-ktr-pink/40 shadow-md flex items-center justify-center text-4xl font-cookie mb-4'>
            {userInitial}
          </div>

          <h2 className='text-2xl font-bold text-ktr-blue tracking-tight font-lora'>
            {user?.name || 'Admin User'}
          </h2>
          <p className='text-xs sm:text-sm text-ktr-blue/70 mb-4 flex items-center gap-1.5 justify-center'>
            <HiOutlineEnvelope className='w-4 h-4 text-ktr-green' />
            {user?.email || 'admin@example.com'}
          </p>

          {/* Role Badge */}
          <div className='mb-5'>
            <span className='inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-ktr-pink/25 text-ktr-blue border border-ktr-pink/50 tracking-wide'>
              <HiOutlineShieldCheck className='w-4 h-4 text-ktr-green' /> Store Admin
            </span>
          </div>

          <div className='w-full border-t border-ktr-pink/25 pt-4 text-left space-y-3 text-xs sm:text-sm text-ktr-blue/80'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-ktr-blue/70'>
                <HiOutlineCalendar className='w-4 h-4 text-ktr-green' /> Member Since
              </span>
              <span className='font-semibold text-ktr-green'>{memberSince}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-ktr-blue/70'>
                <HiOutlineBookmark className='w-4 h-4 text-ktr-green' /> Subscription
              </span>
              <span className='font-semibold text-ktr-blue/50'>None</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className='mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-ktr-pink/60 text-ktr-blue hover:bg-ktr-pink/20 hover:text-red-700 transition text-sm font-medium cursor-pointer shadow-xs'
          >
            <HiOutlineArrowRightOnRectangle className='w-4 h-4 text-ktr-pink' />
            <span>Sign Out</span>
          </button>

          <div className='mt-4 pt-4 border-t border-ktr-pink/20 w-full'>
            <Link
              to='/admin'
              className='w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-ktr-green text-ktr-skin text-xs font-semibold hover:bg-ktr-blue transition shadow-md tracking-wider uppercase'
            >
              Open Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CUSTOMER PROFILE VIEW (Cohesive Warm Bakery & Bookstore Aesthetic)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-booksdos py-10 px-4 sm:px-6 lg:px-8 text-ktr-blue'>
      <div className='max-w-7xl mx-auto'>
        {/* Greeting & Header Banner */}
        <div className='mb-8 text-center sm:text-left'>
          <span className='text-xs uppercase tracking-[0.25em] text-ktr-green font-semibold mb-1 block'>
            Reader &amp; Pastry Member Hub
          </span>
          <h1 className='text-4xl sm:text-6xl font-cookie text-ktr-green leading-tight'>
            Welcome back, {user?.name || 'Reader'}!
          </h1>
          <p className='text-sm sm:text-base text-ktr-blue/80 font-lora italic mt-1'>
            Your cozy corner for artisanal deliveries, book club subscriptions, and account preferences.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Column: Customer Profile Card & Nav Tabs */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Member Card */}
            <div className='bg-[#FFFDEB]/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-lg border border-ktr-pink/35 flex flex-col items-center text-center'>
              {/* Avatar */}
              <div className='w-22 h-22 rounded-full bg-ktr-green text-ktr-skin ring-4 ring-ktr-pink/40 shadow-inner flex items-center justify-center text-3xl font-cookie mb-3'>
                {userInitial}
              </div>

              <h2 className='text-xl font-bold text-ktr-blue font-lora tracking-tight'>
                {user?.name || 'Customer'}
              </h2>
              <p className='text-xs text-ktr-blue/70 mb-3 flex items-center gap-1.5 justify-center'>
                <HiOutlineEnvelope className='w-3.5 h-3.5 text-ktr-green' />
                {user?.email}
              </p>

              {/* Badge */}
              <div className='mb-4'>
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ktr-pink/25 text-ktr-blue border border-ktr-pink/40 font-lora'>
                  <HiOutlineSparkles className='w-3.5 h-3.5 text-ktr-green' /> Literary Member
                </span>
              </div>

              <div className='w-full border-t border-ktr-pink/20 pt-4 mt-1 text-left space-y-2.5 text-xs text-ktr-blue/80'>
                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-1.5 text-ktr-blue/70'>
                    <HiOutlineCalendar className='w-4 h-4 text-ktr-green' /> Member Since
                  </span>
                  <span className='font-semibold text-ktr-green'>{memberSince}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-1.5 text-ktr-blue/70'>
                    <HiOutlineBookmark className='w-4 h-4 text-ktr-green' /> Subscription
                  </span>
                  <span
                    className={`font-bold capitalize ${hasActiveSubscription ? 'text-emerald-700' : 'text-ktr-blue/50'
                      }`}
                  >
                    {user?.subscription?.status || 'None'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className='mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-ktr-pink/60 text-ktr-blue hover:bg-ktr-pink/20 hover:text-red-700 transition text-xs sm:text-sm font-medium cursor-pointer shadow-xs'
              >
                <HiOutlineArrowRightOnRectangle className='w-4 h-4 text-ktr-pink' />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className='bg-[#FFFDEB]/95 backdrop-blur-md rounded-2xl p-2 shadow-md border border-ktr-pink/30 flex flex-row lg:flex-col gap-1.5 overflow-x-auto scrollbar-none'>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer text-left w-full whitespace-nowrap ${activeTab === 'orders'
                  ? 'bg-ktr-green text-ktr-skin shadow-md'
                  : 'text-ktr-blue hover:bg-ktr-skin/60 hover:text-ktr-green'
                  }`}
              >
                <HiOutlineShoppingBag className='w-5 h-5 flex-shrink-0' />
                <span>My Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer text-left w-full whitespace-nowrap ${activeTab === 'subscription'
                  ? 'bg-ktr-green text-ktr-skin shadow-md'
                  : 'text-ktr-blue hover:bg-ktr-skin/60 hover:text-ktr-green'
                  }`}
              >
                <HiOutlineBookmark className='w-5 h-5 flex-shrink-0' />
                <span>Subscription &amp; Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer text-left w-full whitespace-nowrap ${activeTab === 'settings'
                  ? 'bg-ktr-green text-ktr-skin shadow-md'
                  : 'text-ktr-blue hover:bg-ktr-skin/60 hover:text-ktr-green'
                  }`}
              >
                <HiOutlineCog6Tooth className='w-5 h-5 flex-shrink-0' />
                <span>Account Settings</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tab Panels */}
          <div className='lg:col-span-3'>
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className='bg-[#FFFDEB]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg border border-ktr-pink/35 space-y-6'>
                <div className='border-b border-ktr-pink/20 pb-4 flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold text-ktr-blue font-lora'>Order History</h2>
                    <p className='text-xs sm:text-sm text-ktr-blue/70 italic mt-0.5'>
                      Review your pastry batches, pairings, and delivered packages.
                    </p>
                  </div>
                  <Link
                    to='/pairing'
                    className='text-xs sm:text-sm font-semibold text-ktr-green hover:text-ktr-blue underline decoration-ktr-pink underline-offset-4 transition'
                  >
                    Browse Shop →
                  </Link>
                </div>
                <MyOrdersPage isEmbedded={true} />
              </div>
            )}

            {/* TAB 2: SUBSCRIPTION & PREFERENCES */}
            {activeTab === 'subscription' && (
              <div className='bg-[#FFFDEB]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg border border-ktr-pink/35 space-y-8'>
                <div className='border-b border-ktr-pink/20 pb-4'>
                  <h2 className='text-2xl font-bold text-ktr-blue font-lora'>
                    Subscription &amp; Palate Notes
                  </h2>
                  <p className='text-xs sm:text-sm text-ktr-blue/70 italic mt-0.5'>
                    Manage your recurring book + bakery pairings and customize your monthly surprise box.
                  </p>
                </div>

                {hasActiveSubscription ? (
                  <div className='p-6 rounded-2xl bg-gradient-to-br from-ktr-skin via-[#FFFDEB] to-ktr-pink/25 border border-ktr-pink/40 shadow-sm'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                      <div>
                        <span className='px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-200'>
                          Active Plan
                        </span>
                        <h3 className='text-xl font-bold text-ktr-blue font-lora mt-2'>
                          {user?.subscription?.planId || 'The Literary Feast Box'}
                        </h3>
                        <p className='text-xs sm:text-sm text-ktr-blue/80 mt-1 capitalize font-medium'>
                          Delivery Rhythm: {user?.subscription?.interval || 'Monthly'}
                        </p>
                        {user?.subscription?.currentPeriodEnd && (
                          <p className='text-xs text-ktr-blue/60 mt-1'>
                            Next Box Dispatched:{' '}
                            {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link
                        to='/pairing/plans'
                        className='inline-flex items-center justify-center px-5 py-2.5 bg-ktr-green text-ktr-skin rounded-xl text-xs font-semibold hover:bg-ktr-blue transition shadow-md'
                      >
                        Manage Plan
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='p-8 rounded-2xl bg-ktr-skin/40 border-2 border-dashed border-ktr-pink/50 text-center space-y-4'>
                    <div className='w-16 h-16 mx-auto rounded-full bg-ktr-pink/30 flex items-center justify-center text-ktr-green text-3xl shadow-xs'>
                      📖
                    </div>
                    <h3 className='text-2xl font-bold text-ktr-blue font-lora'>
                      No Active Subscription Yet
                    </h3>
                    <p className='text-xs sm:text-sm text-ktr-blue/80 max-w-md mx-auto leading-relaxed'>
                      Have artisanal pastries delivered warm alongside classic novels every
                      week, fortnight, or month. Curated by our head baker and bibliophile.
                    </p>
                    <Link
                      to='/pairing/plans'
                      className='inline-flex items-center gap-2 px-6 py-3 bg-ktr-green text-ktr-skin rounded-full font-medium text-xs sm:text-sm hover:bg-ktr-blue transition shadow-md'
                    >
                      <HiOutlineSparkles className='w-4 h-4' />
                      <span>Explore Subscription Plans</span>
                    </Link>
                  </div>
                )}

                {/* Reading & Pastry Preferences */}
                <div className='pt-2'>
                  <h3 className='text-xl font-bold text-ktr-blue font-lora mb-1'>
                    Your Literary &amp; Pastry Palette
                  </h3>
                  <p className='text-xs text-ktr-blue/70 italic mb-5'>
                    Our head baker and curator match your preferences to each seasonal box release.
                  </p>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='p-5 rounded-2xl border border-ktr-pink/35 bg-[#FDFBF0] shadow-xs'>
                      <div className='flex items-center gap-2 text-ktr-green font-bold text-sm mb-3'>
                        <HiOutlineBookOpen className='w-4 h-4 text-ktr-pink' />
                        <span className='font-lora'>Preferred Literary Genres</span>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Victorian Gothic
                        </span>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Classic Mystery
                        </span>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Magical Realism
                        </span>
                      </div>
                    </div>

                    <div className='p-5 rounded-2xl border border-ktr-pink/35 bg-[#FDFBF0] shadow-xs'>
                      <div className='flex items-center gap-2 text-ktr-green font-bold text-sm mb-3'>
                        <HiOutlineCake className='w-4 h-4 text-ktr-pink' />
                        <span className='font-lora'>Oven Pastry Favorites</span>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Artisanal Brioche
                        </span>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Almond Croissant
                        </span>
                        <span className='px-3 py-1.5 bg-[#FFFDEB] rounded-full border border-ktr-pink/40 text-xs font-lora text-ktr-blue shadow-2xs'>
                          Cardamom Bun
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div className='bg-[#FFFDEB]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg border border-ktr-pink/35'>
                <div className='border-b border-ktr-pink/20 pb-4 mb-6'>
                  <h2 className='text-2xl font-bold text-ktr-blue font-lora'>Account Settings</h2>
                  <p className='text-xs sm:text-sm text-ktr-blue/70 italic mt-0.5'>
                    Update your personal reader details, email address, or update your password.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className='space-y-6 max-w-xl'>
                  <div>
                    <label className='block text-xs font-bold uppercase tracking-wider text-ktr-green mb-2'>
                      Full Name
                    </label>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ktr-blue/50'>
                        <HiOutlineUser className='w-5 h-5' />
                      </span>
                      <input
                        type='text'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full pl-11 pr-4 py-3 rounded-xl border border-ktr-pink/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-ktr-green/20 focus:border-ktr-green text-sm text-ktr-blue shadow-2xs'
                        placeholder='Your Full Name'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold uppercase tracking-wider text-ktr-green mb-2'>
                      Email Address
                    </label>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ktr-blue/50'>
                        <HiOutlineEnvelope className='w-5 h-5' />
                      </span>
                      <input
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full pl-11 pr-4 py-3 rounded-xl border border-ktr-pink/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-ktr-green/20 focus:border-ktr-green text-sm text-ktr-blue shadow-2xs'
                        placeholder='your.email@example.com'
                      />
                    </div>
                  </div>

                  <div className='pt-4 border-t border-ktr-pink/20'>
                    <h3 className='text-lg font-bold text-ktr-blue font-lora mb-1'>Change Password</h3>
                    <p className='text-xs text-ktr-blue/60 italic mb-4'>
                      Leave blank if you wish to keep your existing password.
                    </p>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-xs font-bold text-ktr-green mb-1.5'>
                          New Password
                        </label>
                        <input
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='w-full p-3 rounded-xl border border-ktr-pink/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-ktr-green/20 focus:border-ktr-green text-sm text-ktr-blue shadow-2xs'
                          placeholder='At least 6 characters'
                        />
                      </div>

                      <div>
                        <label className='block text-xs font-bold text-ktr-green mb-1.5'>
                          Confirm New Password
                        </label>
                        <input
                          type='password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className='w-full p-3 rounded-xl border border-ktr-pink/40 bg-white/90 focus:outline-none focus:ring-2 focus:ring-ktr-green/20 focus:border-ktr-green text-sm text-ktr-blue shadow-2xs'
                          placeholder='Repeat new password'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='pt-3'>
                    <button
                      type='submit'
                      disabled={isUpdating}
                      className='px-7 py-3 rounded-xl bg-ktr-green text-ktr-skin hover:bg-ktr-blue transition font-semibold text-xs tracking-wider uppercase shadow-md cursor-pointer disabled:opacity-50'
                    >
                      {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
