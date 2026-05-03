import React, { useState, useEffect } from 'react';
import { 
  Car, Key, MapPin, Clock, ShieldCheck, CheckCircle2, 
  ChevronRight, Camera, Bell, Star, LayoutDashboard, 
  User, Settings, Plus, Menu, ArrowLeft, MoreHorizontal,
  Navigation, Check, X, AlertCircle, TrendingUp, DollarSign,
  Package, Smartphone, HelpCircle, FileText, CameraIcon, Video,
  Send, MessageSquare, Phone, PhoneOff, Filter, Zap, Award,
  Image, Heart, MapIcon, Flame, Truck, Info, Share2, Phone as PhoneIcon,
  MessageCircle, Sliders
} from 'lucide-react';

// --- CÁC THÀNH PHẦN GIAO DIỆN DÙNG CHUNG ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95',
    secondary: 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 active:scale-95',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-indigo-200 active:scale-95'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 ${onClick ? 'cursor-pointer active:scale-[0.98] hover:border-indigo-200 transition-all' : ''} ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, status = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-50 text-amber-600 border border-amber-100',
    active: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    error: 'bg-rose-50 text-rose-600 border border-rose-100'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${styles[status]}`}>
      {children}
    </span>
  );
};

// --- MOCK DATA FOR MARKETPLACE ---

const MOCK_SHOPS = [
  {
    id: 'shop-1',
    name: 'Master Shine Premium',
    rating: 4.9,
    reviews: 248,
    distance: 0.8,
    price: 25,
    priceRange: '$25-$85',
    availableSlots: 4,
    totalSlots: 12,
    services: [
      { name: 'Eco Wash', price: 25, duration: '45m' },
      { name: 'Standard Wash', price: 35, duration: '60m' },
      { name: 'Premium Detail', price: 85, duration: '2h 30m' }
    ],
    images: ['🌟', '✨', '🚗'],
    featured: true,
    badge: 'Recommended'
  },
  {
    id: 'shop-2',
    name: 'Quick Clean Express',
    rating: 4.6,
    reviews: 156,
    distance: 1.2,
    price: 20,
    priceRange: '$20-$60',
    availableSlots: 8,
    totalSlots: 10,
    services: [
      { name: 'Quick Wash', price: 20, duration: '30m' },
      { name: 'Standard Wash', price: 35, duration: '60m' },
      { name: 'Full Detail', price: 60, duration: '2h' }
    ],
    images: ['⚡', '🚗', '💨'],
    featured: false,
    badge: null
  },
  {
    id: 'shop-3',
    name: 'Luxury Auto Care',
    rating: 4.8,
    reviews: 312,
    distance: 2.1,
    price: 45,
    priceRange: '$45-$150',
    availableSlots: 2,
    totalSlots: 8,
    services: [
      { name: 'Premium Wash', price: 45, duration: '90m' },
      { name: 'Luxury Detail', price: 120, duration: '3h' },
      { name: 'Ceramic Coat', price: 150, duration: '4h' }
    ],
    images: ['👑', '✨', '🌟'],
    featured: false,
    badge: null
  },
  {
    id: 'shop-4',
    name: 'Eco Green Carwash',
    rating: 4.7,
    reviews: 89,
    distance: 0.5,
    price: 22,
    priceRange: '$22-$70',
    availableSlots: 6,
    totalSlots: 10,
    services: [
      { name: 'Eco Wash', price: 22, duration: '45m' },
      { name: 'Eco Detail', price: 50, duration: '1h 30m' }
    ],
    images: ['🌿', '♻️', '🌍'],
    featured: false,
    badge: 'Eco-friendly'
  }
];

const MOCK_VALETS = [
  {
    id: 'valet-1',
    name: 'Michael Chen',
    rating: 4.9,
    reviews: 342,
    phone: '+1 (555) 123-4567',
    avatar: 'MC',
    status: 'available',
    completedTrips: 452
  },
  {
    id: 'valet-2',
    name: 'Sarah Johnson',
    rating: 4.8,
    reviews: 267,
    phone: '+1 (555) 234-5678',
    avatar: 'SJ',
    status: 'available',
    completedTrips: 328
  },
  {
    id: 'valet-3',
    name: 'David Martinez',
    rating: 4.7,
    reviews: 198,
    phone: '+1 (555) 345-6789',
    avatar: 'DM',
    status: 'available',
    completedTrips: 241
  }
];

// --- ỨNG DỤNG CHÍNH ---

export default function App() {
  // === STATE MANAGEMENT ===
  const [role, setRole] = useState('user'); // user | owner | valet
  const [appStep, setAppStep] = useState('home'); // home | shop_discovery | shop_detail | booking | tracking | rating | task_detail
  const [activeOrder, setActiveOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Marketplace states
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [assignedValet, setAssignedValet] = useState(null);
  
  // Filter & Sort states
  const [shopFilters, setShopFilters] = useState({
    priceMax: 150,
    minRating: 0,
    maxDistance: 5,
    sortBy: 'recommended' // recommended | cheapest | nearest | bestRated
  });
  
  // Orders with marketplace data
  const [systemOrders, setSystemOrders] = useState([
    {
      id: 'WB-9921',
      customer: 'Jonathan Wick',
      car: 'Tesla Model 3',
      plate: '52-A 888.88',
      status: 'pending', // pending | picking_up | washing | returning | completed | rated
      service: 'Eco Wash',
      price: '$25.00',
      time: '09:00 AM',
      location: 'Building B, Basement 2',
      shop: MOCK_SHOPS[0],
      valet: null,
      photos: [],
      shopRating: 0,
      valetRating: 0,
      valetETA: '8 min'
    }
  ]);

  // Hiển thị thông báo tạm thời
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Chuyển đổi vai trò
  const switchRole = (newRole) => {
    setRole(newRole);
    setAppStep('home');
    setSelectedShop(null);
  };

  // Helper: Get filtered & sorted shops
  const getFilteredShops = () => {
    let filtered = MOCK_SHOPS.filter(shop => 
      shop.price <= shopFilters.priceMax &&
      shop.rating >= shopFilters.minRating &&
      shop.distance <= shopFilters.maxDistance
    );

    // Sort
    switch (shopFilters.sortBy) {
      case 'cheapest':
        return filtered.sort((a, b) => a.price - b.price);
      case 'nearest':
        return filtered.sort((a, b) => a.distance - b.distance);
      case 'bestRated':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'recommended':
      default:
        return filtered.sort((a, b) => b.featured ? 1 : -1).sort((a, b) => b.rating - a.rating);
    }
  };

  // Helper: Get random valet
  const getRandomValet = () => {
    return MOCK_VALETS[Math.floor(Math.random() * MOCK_VALETS.length)];
  };

  // --- COMPONENT: SHOP CARD ---
  const ShopCard = ({ shop, onClick }) => (
    <Card onClick={onClick} className="space-y-3 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          {shop.badge && <Badge status="active">{shop.badge}</Badge>}
          <h3 className="font-bold mt-1 text-sm">{shop.name}</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm">{shop.rating}</span>
            <span className="text-xs text-slate-400">({shop.reviews})</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <MapPin size={12} /> {shop.distance} km
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} /> {shop.priceRange}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t">
        <div className="text-xs">
          <span className="font-bold text-indigo-600">{shop.availableSlots}</span>
          <span className="text-slate-400"> of {shop.totalSlots} slots</span>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </div>
    </Card>
  );

  // --- COMPONENT: VALET INFO CARD ---
  const ValetInfoCard = ({ valet, onCall, onChat }) => (
    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            {valet.avatar}
          </div>
          <div>
            <p className="font-bold text-sm">{valet.name}</p>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold">{valet.rating}</span>
              <span className="text-xs text-slate-500">({valet.reviews})</span>
            </div>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-indigo-600">ETA</p>
          <p className="font-black">{assignedValet?.eta || '8 min'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          className="flex-1 py-2 text-xs h-10 gap-1" 
          onClick={onCall}
        >
          <Phone size={14} /> Call
        </Button>
        <Button 
          className="flex-1 py-2 text-xs h-10 gap-1" 
          onClick={onChat}
        >
          <MessageSquare size={14} /> Chat
        </Button>
      </div>
    </Card>
  );

  // --- COMPONENT: SHOP FILTER MODAL ---
  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
        <div className="bg-white w-full rounded-t-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Filter Shops</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600">Max Price: ${shopFilters.priceMax}</label>
              <input 
                type="range" 
                min="0" 
                max="150" 
                value={shopFilters.priceMax}
                onChange={(e) => setShopFilters({...shopFilters, priceMax: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Min Rating: {shopFilters.minRating.toFixed(1)}</label>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1"
                value={shopFilters.minRating}
                onChange={(e) => setShopFilters({...shopFilters, minRating: parseFloat(e.target.value)})}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600">Max Distance: {shopFilters.maxDistance} km</label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={shopFilters.maxDistance}
                onChange={(e) => setShopFilters({...shopFilters, maxDistance: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 block mb-2">Sort By</label>
              <div className="grid grid-cols-2 gap-2">
                {['recommended', 'cheapest', 'nearest', 'bestRated'].map(sort => (
                  <button
                    key={sort}
                    onClick={() => setShopFilters({...shopFilters, sortBy: sort})}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      shopFilters.sortBy === sort 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sort.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={onClose}>Apply Filters</Button>
        </div>
      </div>
    );
  };

  // --- LUỒNG NGƯỜI DÙNG (CUSTOMER) - MARKETPLACE VERSION ---
  const UserFlow = () => {
    const [bookingPhase, setBookingPhase] = useState(0); // 0: select shop, 1: select service, 2: confirm, 3: pay
    const [showFilters, setShowFilters] = useState(false);
    const myActiveOrder = systemOrders.find(o => o.status !== 'completed' && o.status !== 'rated');
    const filteredShops = getFilteredShops();

    // Shop Discovery Screen
    if (appStep === 'shop_discovery') {
      return (
        <div className="animate-in fade-in duration-300 pb-20">
          <header className="p-4 flex items-center gap-3 sticky top-0 bg-slate-50 z-10 border-b">
            <button 
              onClick={() => { setAppStep('home'); setSelectedShop(null); }} 
              className="p-2 rounded-full bg-white shadow-sm border hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Select Car Wash Shop</h1>
              <p className="text-xs text-slate-500">{filteredShops.length} shops found</p>
            </div>
            <button 
              onClick={() => setShowFilters(true)}
              className="p-2 rounded-full bg-white shadow-sm border hover:bg-slate-50"
            >
              <Sliders size={20} />
            </button>
          </header>

          <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />

          <div className="px-4 space-y-3 pt-4">
            {filteredShops.map(shop => (
              <ShopCard 
                key={shop.id} 
                shop={shop}
                onClick={() => {
                  setSelectedShop(shop);
                  setAppStep('shop_detail');
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Shop Detail Screen
    if (appStep === 'shop_detail' && selectedShop) {
      return (
        <div className="animate-in fade-in duration-300 pb-20">
          <header className="p-4 flex items-center gap-3 sticky top-0 bg-slate-50 z-10 border-b">
            <button 
              onClick={() => setAppStep('shop_discovery')} 
              className="p-2 rounded-full bg-white shadow-sm border hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold">Shop Details</h1>
          </header>

          <div className="px-4 space-y-6 pt-4">
            {/* Shop Header */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  {selectedShop.badge && <Badge status="active">{selectedShop.badge}</Badge>}
                  <h2 className="text-xl font-bold mt-2">{selectedShop.name}</h2>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <Heart size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-600 font-bold">RATING</p>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < Math.floor(selectedShop.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                        />
                      ))}
                    </div>
                    <span className="font-bold">{selectedShop.rating}</span>
                    <span className="text-xs text-slate-400">({selectedShop.reviews})</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 font-bold">DISTANCE</p>
                  <p className="text-lg font-bold text-indigo-600">{selectedShop.distance} km</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 font-bold">AVAILABILITY</p>
                  <p className="text-lg font-bold">{selectedShop.availableSlots}/{selectedShop.totalSlots}</p>
                </div>
              </div>
            </Card>

            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-3">Services</h3>
              {selectedShop.services.map((service, idx) => (
                <Card 
                  key={idx}
                  onClick={() => {
                    setSelectedService(service);
                    setAppStep('booking');
                    setBookingPhase(0);
                  }}
                  className="mb-3 flex justify-between items-center group"
                >
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {service.duration}
                    </p>
                  </div>
                  <p className="font-black text-indigo-600 text-lg">${service.price}</p>
                </Card>
              ))}
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-bold text-lg mb-3">Recent Reviews</h3>
              <Card className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">Great service!</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">2 days ago</p>
                </div>
                <p className="text-xs text-slate-600">Very professional team, my car looks amazing!</p>
              </Card>
            </div>

            <Button 
              className="w-full mb-4"
              onClick={() => {
                setSelectedService(null);
                setAppStep('booking');
                setBookingPhase(0);
              }}
            >
              Book This Shop
            </Button>
          </div>
        </div>
      );
    }

    // Updated Booking Flow
    if (appStep === 'booking') {
      return (
        <div className="animate-in fade-in duration-300 pb-20">
          <header className="p-4 flex items-center gap-4 sticky top-0 bg-slate-50 z-10 border-b">
            <button 
              onClick={() => { setAppStep('home'); setSelectedShop(null); }} 
              className="p-2 rounded-full bg-white shadow-sm border"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold">Booking Details</h1>
          </header>

          <div className="px-4 space-y-6 pt-4">
            {/* Step Indicator */}
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${bookingPhase >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              ))}
            </div>

            {bookingPhase === 0 && (
              <div className="space-y-4">
                {!selectedService ? (
                  // Show service selection if not yet selected
                  <>
                    <h2 className="font-bold text-lg">Select Service</h2>
                    <div className="space-y-3">
                      {selectedShop?.services.map((service, idx) => (
                        <Card 
                          key={idx}
                          onClick={() => setSelectedService(service)}
                          className="mb-3 flex justify-between items-center group cursor-pointer hover:border-indigo-400 transition-all"
                        >
                          <div>
                            <p className="font-bold">{service.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {service.duration}
                            </p>
                          </div>
                          <p className="font-black text-indigo-600 text-lg">${service.price}</p>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  // Show vehicle confirmation if service selected
                  <>
                    <h2 className="font-bold text-lg">Confirm Vehicle</h2>
                    <Card className="space-y-4 border-l-4 border-l-indigo-600">
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          <Car size={20}/>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-bold uppercase">Your Vehicle</p>
                          <p className="font-bold">Tesla Model 3 • White</p>
                        </div>
                        <Badge>52-A 888.88</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          <MapPin size={20}/>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-bold uppercase">Pickup Location</p>
                          <p className="font-bold">Building B, Basement 2</p>
                        </div>
                        <button className="text-xs font-bold text-indigo-600">Change</button>
                      </div>
                    </Card>

                    <Card className="bg-indigo-50 border-indigo-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <Info size={16} className="text-indigo-600"/>
                        <p className="text-xs font-bold text-indigo-900">Selected Service</p>
                      </div>
                      <p className="font-bold text-sm">{selectedService?.name}</p>
                      <p className="text-xs text-slate-600">${selectedService?.price} • {selectedService?.duration}</p>
                    </Card>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedService(null)}>Change Service</Button>
                      <Button className="flex-1" onClick={() => setBookingPhase(1)}>Select Time</Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {bookingPhase === 1 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">Choose Pickup & Dropoff Time</h2>
                <Card className="space-y-3">
                  <div>
                    <label className="text-sm font-bold text-slate-600">Pickup Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
                      defaultValue="2024-01-15T09:00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600">Estimated Return Time</label>
                    <div className="mt-2 px-3 py-2 border rounded-lg text-sm bg-slate-50 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400"/>
                      <span className="font-medium">Approx. {selectedService?.duration}</span>
                    </div>
                  </div>
                </Card>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={20}/>
                  <p className="text-xs text-amber-700 leading-relaxed">You'll need to leave your key in <b>Smart Locker #42</b> after confirming the booking.</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setBookingPhase(0)}>Back</Button>
                  <Button className="flex-1" onClick={() => setBookingPhase(2)}>Review Order</Button>
                </div>
              </div>
            )}

            {bookingPhase === 2 && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Order Summary</h2>
                
                {/* Service Highlight Card */}
                <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 space-y-3 border-none">
                  <div>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wide">Service Selected</p>
                    <p className="text-2xl font-black mt-1">{selectedService?.name}</p>
                  </div>
                </Card>

                {/* Price Summary Card */}
                <Card className="bg-slate-50 border-2 border-indigo-200 p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b-2 border-indigo-200">
                      <span className="text-slate-600 font-bold">Service Duration</span>
                      <span className="text-lg font-black text-indigo-600">{selectedService?.duration}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b-2 border-indigo-200">
                      <span className="text-slate-600 font-bold">Shop Name</span>
                      <span className="text-base font-black text-slate-900">{selectedShop?.name}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-slate-700 font-bold text-lg">Total Amount</span>
                      <div className="text-right">
                        <p className="text-4xl font-black text-indigo-600">${selectedService?.price}</p>
                        <p className="text-xs text-slate-500">USD</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Details Card */}
                <Card className="bg-indigo-50 border-indigo-200 p-4 space-y-3">
                  <div className="flex gap-3 pb-3 border-b border-indigo-200">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Car size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-bold uppercase">Vehicle</p>
                      <p className="font-bold text-slate-900">Tesla Model 3 • White • 52-A 888.88</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-bold uppercase">Pickup Location</p>
                      <p className="font-bold text-slate-900">Building B, Basement 2</p>
                    </div>
                  </div>
                </Card>

                {/* Insurance & Security Info */}
                <Card className="bg-emerald-50 border-emerald-200 p-4 space-y-2">
                  <div className="flex gap-2 items-start">
                    <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5"/>
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">Vehicle Insurance & Security</p>
                      <p className="text-xs text-emerald-700 mt-1">Full coverage up to $5,000. Smart locker key security. Professional valet service.</p>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setBookingPhase(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      const newOrder = {
                        id: 'WB-' + Math.floor(Math.random() * 9000 + 1000),
                        customer: 'Jonathan Wick',
                        car: 'Tesla Model 3',
                        plate: '52-A 888.88',
                        status: 'pending',
                        service: selectedService?.name,
                        price: `$${selectedService?.price}`,
                        time: '09:00 AM',
                        location: 'Building B, Basement 2',
                        shop: selectedShop,
                        valet: null,
                        photos: [],
                        shopRating: 0,
                        valetRating: 0
                      };
                      setSystemOrders([...systemOrders, newOrder]);
                      setAppStep('home');
                      setSelectedShop(null);
                      setSelectedService(null);
                      showToast("Booking successful! Valet will arrive soon.");
                    }}
                  >
                    Confirm & Pay ${selectedService?.price}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Tracking Screen with Valet Info
    if (appStep === 'tracking' || myActiveOrder?.status !== 'completed') {
      const trackingOrder = myActiveOrder;

      if (!trackingOrder) {
        return (
          <div className="animate-in fade-in duration-300">
            <header className="p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-indigo-900">Washbox24</h1>
                <p className="text-slate-500 text-sm">Hi Jonathan! 👋</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center relative">
                <Bell size={20}/>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </header>

            <div className="px-4 space-y-6">
              <Card className="bg-indigo-600 text-white p-6 relative overflow-hidden border-none cursor-pointer hover:bg-indigo-700" onClick={() => setAppStep('shop_discovery')}>
                <div className="relative z-10 space-y-4">
                  <h2 className="text-xl font-bold leading-tight">Dirty car? We got<br/>you covered!</h2>
                  <p className="text-indigo-100 text-sm opacity-80">Pickup • Professional wash • Delivery</p>
                  <Button variant="secondary" className="px-6">Book Now</Button>
                </div>
                <Car size={140} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
              </Card>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Garage', icon: <Car/> },
                  { label: 'History', icon: <Clock/> },
                  { label: 'Wallet', icon: <DollarSign/> },
                  { label: 'Support', icon: <HelpCircle/> }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">{item.icon}</div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Active Order Tracking
      return (
        <div className="animate-in fade-in duration-300 pb-20">
          <header className="p-4 flex items-center gap-3 sticky top-0 bg-slate-50 z-10 border-b">
            <h1 className="text-lg font-bold">Order Tracking</h1>
            <Badge status="active">{trackingOrder.status.replace(/_/g, ' ').toUpperCase()}</Badge>
          </header>

          <div className="px-4 space-y-6 pt-4">
            {/* Valet Info Card - NEW */}
            {(trackingOrder.status === 'picking_up' || trackingOrder.status === 'returning') && trackingOrder.valet && (
              <ValetInfoCard 
                valet={trackingOrder.valet}
                onCall={() => showToast(`Calling ${trackingOrder.valet.name}...`)}
                onChat={() => showToast(`Opening chat with ${trackingOrder.valet.name}...`)}
              />
            )}

            {/* Order Summary */}
            <Card className="border-l-4 border-l-indigo-600 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Service</p>
                <p className="font-bold text-lg">{trackingOrder.service}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Shop</p>
                  <p className="font-bold">{trackingOrder.shop?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Price</p>
                  <p className="font-bold text-indigo-600">{trackingOrder.price}</p>
                </div>
              </div>
            </Card>

            {/* Timeline Progress */}
            <div>
              <h3 className="font-bold mb-4">Timeline</h3>
              <div className="space-y-4">
                {[
                  { icon: <Key size={16}/>, label: 'Waiting for Valet', status: trackingOrder.status === 'pending' },
                  { icon: <Truck size={16}/>, label: 'Valet Assigned', status: ['picking_up', 'washing', 'returning', 'completed'].includes(trackingOrder.status) },
                  { icon: <Car size={16}/>, label: 'Picking up Car', status: trackingOrder.status === 'picking_up' },
                  { icon: <Zap size={16}/>, label: 'At Shop (Washing)', status: trackingOrder.status === 'washing' },
                  { icon: <MapPin size={16}/>, label: 'Returning Car', status: trackingOrder.status === 'returning' },
                  { icon: <CheckCircle2 size={16}/>, label: 'Completed', status: trackingOrder.status === 'completed' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all z-10 ${
                      step.status 
                        ? 'bg-indigo-600 border-indigo-100 text-white scale-110' 
                        : 'bg-white border-slate-100 text-slate-300'
                    }`}>
                      {step.status ? <Check size={14}/> : step.icon}
                    </div>
                    <div className="flex-1 pb-4 border-b">
                      <p className={`font-bold text-sm ${step.status ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                      {step.status && step.label === 'Valet Assigned' && trackingOrder.valet && (
                        <p className="text-xs text-slate-500 mt-1">{trackingOrder.valet.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Valet Button - Always Available */}
            {['picking_up', 'washing', 'returning'].includes(trackingOrder.status) && trackingOrder.valet && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => showToast(`Calling ${trackingOrder.valet.name}...`)}
                >
                  <Phone size={16}/> Call Valet
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => showToast(`Chat with ${trackingOrder.valet.name}...`)}
                >
                  <MessageSquare size={16}/> Message
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return <div />;
  };

  // --- LUỒNG TÀI XẾ (VALET) - MARKETPLACE VERSION ---
  const ValetFlow = () => {
    const availableTasks = systemOrders.filter(o => o.status === 'pending');
    const myCurrentTask = systemOrders.find(o => o.status === 'picking_up' || o.status === 'returning');

    const updateStatus = (id, newStatus) => {
      setSystemOrders(systemOrders.map(o => {
        if (o.id === id) {
          const updatedOrder = { ...o, status: newStatus };
          // Assign valet when accepted
          if (newStatus === 'picking_up' && !updatedOrder.valet) {
            updatedOrder.valet = getRandomValet();
          }
          return updatedOrder;
        }
        return o;
      }));
      showToast(`Status updated: ${newStatus}`);
    };

    if (myCurrentTask) {
      return (
        <div className="animate-in slide-in-from-right duration-300 pb-20">
          <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <h1 className="font-bold">Active Task</h1>
            <Badge status="active">IN PROGRESS</Badge>
          </header>

          <div className="p-4 space-y-6">
            {/* Customer Info */}
            <Card className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Customer</p>
                  <h4 className="text-lg font-bold">{myCurrentTask.customer}</h4>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">License Plate</p>
                  <Badge>{myCurrentTask.plate}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={14}/>
                <span>{myCurrentTask.location}</span>
              </div>
              {myCurrentTask.shop && (
                <div className="flex items-center gap-2 text-sm text-indigo-600 border-t pt-3">
                  <Award size={14}/>
                  <span className="font-bold">Destination: {myCurrentTask.shop.name}</span>
                </div>
              )}
            </Card>

            {/* Handoff Checklist */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800">Pre-Pickup Checklist</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check size={18}/>
                  </div>
                  <div className="flex-1 border-b pb-4">
                    <p className="font-bold text-sm">Get Key from Smart Locker</p>
                    <p className="text-xs text-slate-400">OTP Code: 8217</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">2</div>
                  <div className="flex-1 border-b pb-4">
                    <p className="font-bold text-sm text-slate-400">Vehicle Inspection & Photos (4 angles)</p>
                    <Button variant="outline" className="mt-2 py-1 h-8 text-xs gap-1">
                      <Camera size={14}/> Take Photos
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">3</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-400">Confirm with Customer & Drive to Shop</p>
                  </div>
                </div>
              </div>
            </div>

            {myCurrentTask.status === 'picking_up' && (
              <Button 
                className="w-full bg-indigo-600"
                onClick={() => updateStatus(myCurrentTask.id, 'washing')}
              >
                Delivered to Shop
              </Button>
            )}
            {myCurrentTask.status === 'returning' && (
              <Button 
                className="w-full bg-emerald-600"
                onClick={() => updateStatus(myCurrentTask.id, 'completed')}
              >
                Completed & Returned
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-300 p-4 space-y-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-indigo-100 flex items-center justify-center font-bold">
              MC
            </div>
            <div>
              <p className="font-bold text-slate-800">Michael (Valet)</p>
              <Badge status="success">ONLINE</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400">TODAY'S EARNINGS</p>
            <p className="text-xl font-black text-indigo-600">$142.0</p>
          </div>
        </header>

        <div className="space-y-4">
          <h2 className="font-bold text-lg">Available Orders ({availableTasks.length})</h2>
          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <Card key={task.id} className="space-y-4 border-l-4 border-l-amber-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{task.id}</p>
                    <h4 className="font-bold">{task.car}</h4>
                    <p className="text-xs text-slate-500 mt-1">{task.service}</p>
                  </div>
                  <p className="font-black text-indigo-600">{task.price}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14}/>
                  <span>{task.location}</span>
                </div>
                {task.shop && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                    <Award size={12}/>
                    <span className="font-bold">Destination: {task.shop.name}</span>
                  </div>
                )}
                <Button 
                  className="w-full h-10 py-0"
                  onClick={() => updateStatus(task.id, 'picking_up')}
                >
                  Accept Order
                </Button>
              </Card>
            ))
          ) : (
            <div className="p-12 text-center text-slate-300">
              <Car size={48} className="mx-auto mb-4 opacity-20"/>
              <p className="text-sm font-medium">No orders available right now...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- LUỒNG CHỦ TIỆM (OWNER) - MARKETPLACE VERSION ---
  const OwnerFlow = () => {
    const washingOrders = systemOrders.filter(o => o.status === 'washing');
    const pendingOrders = systemOrders.filter(o => o.status === 'pending');
    
    const updateStatus = (id, newStatus) => {
      setSystemOrders(systemOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      showToast("Valet notified to return vehicle");
    };

    return (
      <div className="animate-in fade-in duration-300 p-4 space-y-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black text-indigo-900 uppercase">Master Shine Shop</h1>
            <p className="text-xs text-slate-500">Capacity: 8/12 available</p>
          </div>
          <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
            <Settings size={20}/>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-indigo-600 text-white border-none">
            <p className="text-[10px] font-bold opacity-70">REVENUE</p>
            <h3 className="text-2xl font-black">$2,105</h3>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-200">
              <TrendingUp size={12}/> +12% vs yesterday
            </div>
          </Card>
          <Card>
            <p className="text-[10px] font-bold text-slate-400">RATING</p>
            <h3 className="text-2xl font-black text-slate-800">4.9</h3>
            <div className="mt-2 flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400"/>)}
            </div>
          </Card>
        </div>

        {/* Marketplace Notifications */}
        {pendingOrders.length > 0 && (
          <Card className="bg-amber-50 border-amber-200 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600"/>
              <p className="text-xs font-bold text-amber-900">{pendingOrders.length} New Orders in Marketplace</p>
            </div>
            <p className="text-xs text-amber-700">Accept orders to start serving customers</p>
          </Card>
        )}

        {/* Currently Washing */}
        <div className="space-y-4">
          <h3 className="font-bold">Currently Washing ({washingOrders.length})</h3>
          {washingOrders.map(o => (
            <Card key={o.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center flex-1">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    {o.car.substring(0, 1)}
                  </div>
                  <div>
                    <p className="font-bold">{o.car}</p>
                    <p className="text-xs text-slate-400">{o.plate}</p>
                    {o.customer && (
                      <p className="text-xs text-slate-500">Customer: {o.customer}</p>
                    )}
                  </div>
                </div>
                <Badge status="active">WASHING</Badge>
              </div>

              {o.service && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <p className="font-bold">{o.service}</p>
                </div>
              )}

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-indigo-500 animate-pulse"></div>
              </div>

              <Button 
                variant="secondary" 
                className="w-full h-10 py-0 text-sm"
                onClick={() => {
                  // Move to returning when washing is complete
                  setSystemOrders(systemOrders.map(order => {
                    if (order.id === o.id) {
                      return { ...order, status: 'returning' };
                    }
                    return order;
                  }));
                  showToast("Valet notified - Returning vehicle");
                }}
              >
                Wash Complete (Call Valet)
              </Button>
            </Card>
          ))}
          {washingOrders.length === 0 && (
            <p className="text-center text-slate-400 py-8 text-sm">No vehicles currently washing...</p>
          )}
        </div>

        {/* Recent Orders */}
        {systemOrders.filter(o => o.status === 'completed').length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold">Recent Completed Orders</h3>
            {systemOrders.filter(o => o.status === 'completed').slice(0, 3).map(o => (
              <Card key={o.id} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-sm">{o.car}</p>
                    <p className="text-xs text-slate-500">{o.service}</p>
                  </div>
                  <p className="font-black text-indigo-600">{o.price}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200 p-0 sm:p-4 font-sans text-slate-900">
      
      {/* Role Switcher - For Demo to experience 3 roles */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-2 mb-4 rounded-3xl shadow-xl flex gap-2 border border-white sticky top-4 z-[100]">
        <button 
          onClick={() => switchRole('user')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'user' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          User
        </button>
        <button 
          onClick={() => switchRole('valet')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'valet' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Valet
        </button>
        <button 
          onClick={() => switchRole('owner')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'owner' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Owner
        </button>
      </div>

      {/* Main Mobile Screen */}
      <div className="relative w-full max-w-md h-[844px] bg-slate-50 rounded-[54px] border-[12px] border-slate-900 shadow-2xl overflow-hidden overflow-y-auto no-scrollbar scroll-smooth">
        {/* Notch / Status Bar */}
        <div className="sticky top-0 z-50 h-10 w-full bg-inherit/90 backdrop-blur flex items-center justify-between px-10 pointer-events-none">
          <div className="text-[11px] font-bold">9:41</div>
          <div className="w-24 h-6 bg-slate-900 rounded-b-3xl absolute left-1/2 -translate-x-1/2"></div>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-2.5 bg-slate-900 rounded-full flex items-center justify-center opacity-10"></div>
            <div className="w-5 h-2.5 border border-slate-900 rounded-sm"></div>
          </div>
        </div>

        {/* Content Flow */}
        <div className="relative">
          {role === 'user' && <UserFlow />}
          {role === 'valet' && <ValetFlow />}
          {role === 'owner' && <OwnerFlow />}
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom duration-300 text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={18}/>
            {notification}
          </div>
        )}

        {/* Bottom Navigation */}
        {(appStep === 'home' || !appStep) && role === 'user' && (
          <nav className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t px-8 py-4 flex justify-between items-center">
            <button 
              onClick={() => setAppStep('home')}
              className="text-indigo-600 flex flex-col items-center gap-1"
            >
              <LayoutDashboard size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
            </button>
            <button 
              onClick={() => setAppStep('shop_discovery')}
              className="text-slate-300 flex flex-col items-center gap-1 hover:text-indigo-600"
            >
              <MapIcon size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Book</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
              <Package size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Orders</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
              <User size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
            </button>
          </nav>
        )}
      </div>

      {/* Mockup Notes */}
      <div className="mt-8 text-center space-y-2 opacity-50 px-6 max-w-sm">
        <p className="text-xs font-bold uppercase tracking-widest">Multi-role Marketplace Demo</p>
        <p className="text-[11px] leading-relaxed">Try: Book a car wash as <b>User</b>, accept order as <b>Valet</b>, manage shop as <b>Owner</b>. Click "Book Now" to discover shops! 🚗</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}