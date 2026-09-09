import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GoogleDriveManager } from '../components/common/GoogleDriveManager';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  HardDrive,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    user,
    login,
    logout,
    orders,
    wishlist,
    products,
    setActivePage,
    navigateToProduct,
    isAdminAuthenticated,
    adminLogin,
  } = useStore();

  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('shikhuverma2804@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>(
    'profile'
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const isOwnerAttempt =
      cleanInput === 'doctormakhana@gmail.com' ||
      cleanInput === 'admin@doctormakhana.com' ||
      cleanInput === 'admin' ||
      cleanInput === 'owner' ||
      cleanInput === 'doctormakhana';

    if (isOwnerAttempt) {
      const result = await adminLogin(cleanInput, password);
      setIsSubmitting(false);
      if (result.success) {
        setActivePage('admin');
      } else {
        setLoginError(result.error || 'Invalid admin credentials');
      }
      return;
    }

    login(emailOrPhone, 'customer');
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(regEmail || regPhone || 'user@doctormakhana.com', 'customer');
  };

  // Filter user orders
  const myOrders = orders.filter(
    (ord) =>
      user &&
      (ord.email === user.email ||
        ord.phone.includes(user.phone) ||
        isAdminAuthenticated)
  );

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (!user) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-teal-100 text-teal-800 font-bold rounded-2xl flex items-center justify-center mx-auto text-lg shadow-sm">
              DM
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {isRegisterMode ? 'Create Account' : 'Customer Login'}
            </h1>
            <p className="text-xs text-slate-500">
              Access your orders, track shipments & saved addresses
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {loginError}
            </div>
          )}

          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="shikhuverma2804@gmail.com or 89892 14183"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => alert('Demo reset link sent to ' + emailOrPhone)}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-xl text-xs shadow transition-all"
              >
                Sign In
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-xs text-slate-600 hover:text-teal-700 font-bold"
                >
                  Don't have an account? <span className="text-teal-700 underline">Register</span>
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Shikhu Verma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="shikhuverma2804@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="89892 14183"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 rounded-xl text-xs shadow transition-all"
              >
                Create Account
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-xs text-slate-600 hover:text-teal-700 font-bold"
                >
                  Already have an account? <span className="text-teal-700 underline">Login</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Logged In Customer Dashboard
  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Welcome Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-teal-950 font-black text-2xl flex items-center justify-center border-2 border-white shadow">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{user.fullName}</h1>
                {isAdminAuthenticated && (
                  <span className="bg-amber-400 text-teal-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-200">{user.email} • {user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={() => setActivePage('admin')}
                className="bg-amber-400 hover:bg-amber-300 text-teal-950 font-black px-4 py-2.5 rounded-xl text-xs shadow"
              >
                Go to Admin Dashboard
              </button>
            )}
            <button
              onClick={logout}
              className="bg-teal-950 hover:bg-teal-900 text-teal-100 font-bold px-4 py-2.5 rounded-xl text-xs border border-teal-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" /> My Profile
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                activeTab === 'orders'
                  ? 'bg-teal-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" /> My Orders
              </div>
              <span className="bg-amber-400 text-teal-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                {myOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-teal-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" /> My Wishlist
              </div>
              <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                {wishlist.length}
              </span>
            </button>

            {/* Google Drive Integration Button */}
            <button
              onClick={() => setIsDriveOpen(true)}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all border border-emerald-100/80 bg-emerald-50/30 mt-2"
            >
              <div className="flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-emerald-600" /> Google Drive Cloud Storage
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
                Connected
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'addresses'
                  ? 'bg-teal-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses
            </button>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Account Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold mb-1">Full Name</span>
                    <strong className="text-slate-900 text-sm">{user.fullName}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold mb-1">Email</span>
                    <strong className="text-slate-900 text-sm">{user.email}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold mb-1">Mobile Phone</span>
                    <strong className="text-slate-900 text-sm">{user.phone}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold mb-1">Account Role</span>
                    <strong className="text-slate-900 text-sm capitalize">{user.role}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  My Orders History
                </h2>
                {myOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm block">
                              Order ID: {ord.id}
                            </span>
                            <span className="text-slate-400">
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-teal-900 text-sm block">
                              ₹{ord.totalAmount}
                            </span>
                            <span className="bg-teal-100 text-teal-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                          <span className="text-slate-600">
                            {ord.items.length} Product(s)
                          </span>
                          <button
                            onClick={() => setActivePage('track-order')}
                            className="bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track Shipment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Saved Wishlist Items
                </h2>
                {wishlistedProducts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => navigateToProduct(prod.id)}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-teal-300"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white border overflow-hidden shrink-0">
                          <img
                            src="/makhana-pack.png"
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center font-bold text-teal-900 text-xs">
                            DM
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                            {prod.name}
                          </h4>
                          <span className="font-black text-teal-900 text-xs block">
                            ₹{prod.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Saved Shipping Addresses
                </h2>
                {user.savedAddresses.map((addr, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-900 block text-sm">
                      {addr.fullName}
                    </span>
                    <p className="text-slate-600">{addr.addressLine}</p>
                    <p className="text-slate-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-slate-500 font-semibold pt-1">
                      Phone: {addr.mobileNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <GoogleDriveManager isOpen={isDriveOpen} onClose={() => setIsDriveOpen(false)} />
    </div>
  );
};
