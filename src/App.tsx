import React, { useState, useEffect } from 'react';
import {
  Recycle, ArrowRight, ArrowLeft, Check, CheckCircle, AlertCircle, MapPin, TrendingUp,
  Coins, BarChart2, Settings, LogOut, User, Plus, Search, Filter, Clock, ChevronRight,
  Download, Building, UploadCloud, ShieldCheck, Layers, Activity, Grid, Map, Sparkles,
  Cpu, Phone, Mail, FileText, Sliders, Bell, Globe, RefreshCw, Zap, Award, Navigation,
  Truck, FileSpreadsheet, Database
} from 'lucide-react';

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface WasteListing {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  frequency: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  seller: string;
  sellerIndustry: string;
  sellerRating: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  co2Saved: number;
  imageColor: string; // Tailwind bg color representing visual material
}

interface BuyerRecommendation {
  id: string;
  name: string;
  industry: string;
  distance: number;
  compatibility: number;
  rating: number;
  expectedPrice: number;
  matchScore: number;
  transportCost: number;
}

// ==========================================
// CONSTANT DATA SETS
// ==========================================
const INITIAL_LISTINGS: WasteListing[] = [
  {
    id: 'w-1',
    name: 'Industrial Fly Ash (Grade A)',
    category: 'Mineral Ash',
    quantity: 50,
    unit: 'Tons',
    expectedPrice: 1200,
    frequency: 'Monthly',
    description: 'Fine pulverised fuel ash from electrostatic precipitators. Highly siliceous and perfect for Portland Cement or brick manufacturing.',
    location: 'Mundra Industrial Area, Gujarat',
    lat: 22.84,
    lng: 69.72,
    seller: 'Kutch Thermal Power Ltd',
    sellerIndustry: 'Energy & Power',
    sellerRating: 4.8,
    status: 'pending',
    co2Saved: 24.5,
    imageColor: 'bg-zinc-400'
  },
  {
    id: 'w-2',
    name: 'Blast Furnace Slag',
    category: 'Metallurgical Slag',
    quantity: 120,
    unit: 'Tons',
    expectedPrice: 850,
    frequency: 'Bi-Weekly',
    description: 'Non-metallic byproduct consisting essentially of silicates and aluminosilicates of calcium. Ideal for concrete aggregates and road bases.',
    location: 'Jamshedpur Metallurgy Corridor, Jharkhand',
    lat: 22.80,
    lng: 86.20,
    seller: 'Eastern Steel Alloys',
    sellerIndustry: 'Metallurgy',
    sellerRating: 4.9,
    status: 'accepted',
    co2Saved: 58.2,
    imageColor: 'bg-slate-500'
  },
  {
    id: 'w-3',
    name: 'Spent Platinum Catalyst Sludge',
    category: 'Precious Metals',
    quantity: 3.5,
    unit: 'Tons',
    expectedPrice: 140000,
    frequency: 'Quarterly',
    description: 'Deactivated platinum-on-alumina catalytic particulate from petrochemical reforming units. High metal content awaiting recovery.',
    location: 'Ankleshwar Chemical Belt, Gujarat',
    lat: 21.62,
    lng: 73.01,
    seller: 'Gujarat Petrochem Refining',
    sellerIndustry: 'Petrochemicals',
    sellerRating: 4.6,
    status: 'completed',
    co2Saved: 14.7,
    imageColor: 'bg-amber-700'
  },
  {
    id: 'w-4',
    name: 'Post-Industrial PET Flakes',
    category: 'Polymers',
    quantity: 15,
    unit: 'Tons',
    expectedPrice: 22000,
    frequency: 'Weekly',
    description: 'Clean, transparent PET plastic flakes from thermoforming scrap. Low moisture content (<0.5%), washed and ready for extruder spinning.',
    location: 'Oragadam Manufacturing Park, Tamil Nadu',
    lat: 12.83,
    lng: 79.95,
    seller: 'Vertex Packaging Solutions',
    sellerIndustry: 'Packaging & Synthetics',
    sellerRating: 4.7,
    status: 'pending',
    co2Saved: 30.1,
    imageColor: 'bg-blue-300'
  }
];

const INITIAL_BUYERS: BuyerRecommendation[] = [
  {
    id: 'b-1',
    name: 'Ultratech Cement Grinding Unit',
    industry: 'Infrastructure & Cement',
    distance: 12.4,
    compatibility: 98,
    rating: 4.9,
    expectedPrice: 1250,
    matchScore: 98,
    transportCost: 350
  },
  {
    id: 'b-2',
    name: 'Vajra Brick Materials',
    industry: 'Masonry & Bricks',
    distance: 18.1,
    compatibility: 91,
    rating: 4.5,
    expectedPrice: 1100,
    matchScore: 93,
    transportCost: 480
  },
  {
    id: 'b-3',
    name: 'Jindal Concrete Castings',
    industry: 'Building Materials',
    distance: 35.0,
    compatibility: 87,
    rating: 4.7,
    expectedPrice: 1300,
    matchScore: 89,
    transportCost: 920
  }
];

const PRESET_UPLOADS = [
  {
    name: 'Spent Catalyst Pellets',
    category: 'Chemical Sludge',
    quantity: 12,
    unit: 'Tons',
    expectedPrice: 85000,
    description: 'Spent hydroprocessing alumina catalyst with rich molybdenum and nickel deposit matrices.',
    color: 'bg-amber-900',
    aiMaterial: 'Mo-Ni Hydroprocessing Catalyst',
    confidence: 96.4,
    co2Saved: 38.4,
    boxLabel: 'Spent Catalysts (Mo-Ni Matrix)',
    suggestedCategories: ['Chemical Residues', 'Heavy Metal Waste', 'Precious Metal Slags']
  },
  {
    name: 'Scrap Copper Armatures',
    category: 'Non-Ferrous Scrap',
    quantity: 4.2,
    unit: 'Tons',
    expectedPrice: 480000,
    description: 'Shredded clean electric motor armature coils, pure red-copper strands, zero heavy sheathing.',
    color: 'bg-orange-600',
    aiMaterial: 'Millberry Copper Wire Scrap',
    confidence: 98.7,
    co2Saved: 19.8,
    boxLabel: 'Clean Copper Strands (Grade A)',
    suggestedCategories: ['Non-Ferrous Alloys', 'Electrical Waste', 'Precious Metals']
  }
];

export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [role, setRole] = useState<'guest' | 'producer' | 'buyer' | 'recycler' | 'admin'>('guest');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Dynamic lists with localStorage backup
  const [listings, setListings] = useState<WasteListing[]>(() => {
    const saved = localStorage.getItem('eco_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('eco_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'tx-101', buyer: 'Ultratech Cement Grinding Unit', seller: 'Kutch Thermal Power Ltd', item: 'Industrial Fly Ash', quantity: '50 Tons', price: '₹60,000', status: 'pending', date: '2026-07-18' },
      { id: 'tx-102', buyer: 'Eastern Steel Alloys', seller: 'Tata Power Corp', item: 'Blast Furnace Slag', quantity: '120 Tons', price: '₹1,02,000', status: 'accepted', date: '2026-07-15' },
      { id: 'tx-103', buyer: 'Hindalco Recycling', seller: 'Gujarat Petrochem Refining', item: 'Spent Platinum Catalyst', quantity: '3.5 Tons', price: '₹4,90,000', status: 'completed', date: '2026-07-10' }
    ];
  });

  // State for forms & interactions
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    category: 'Mineral Ash',
    quantity: 0,
    unit: 'Tons',
    expectedPrice: 0,
    frequency: 'One-off',
    description: ''
  });
  const [uploadedPreview, setUploadedPreview] = useState<typeof PRESET_UPLOADS[0] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [selectedListingForDetails, setSelectedListingForDetails] = useState<WasteListing | null>(null);

  // Maps Routing simulation state
  const [selectedBuyerForRoute, setSelectedBuyerForRoute] = useState<BuyerRecommendation>(INITIAL_BUYERS[0]);

  // Marketplace filter
  const [marketSearch, setMarketSearch] = useState('');
  const [marketCategory, setMarketCategory] = useState('All');
  const [maxDistance, setMaxDistance] = useState(100);

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'producer' | 'buyer' | 'recycler' | 'admin'>('producer');
  const [registerStep, setRegisterStep] = useState(1);
  const [regCompany, setRegCompany] = useState({
    name: '',
    email: '',
    phone: '',
    industry: 'Manufacturing',
    address: 'Vatva GIDC Phase II, Ahmedabad',
    lat: 22.95,
    lng: 72.63,
    regId: '',
    materialsGenerated: '',
    bio: ''
  });

  // Save state helpers
  useEffect(() => {
    localStorage.setItem('eco_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('eco_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Show auto-dismiss notifications
  const triggerNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch Role Helper
  const switchRole = (newRole: 'guest' | 'producer' | 'buyer' | 'recycler' | 'admin', targetView = 'dashboard') => {
    setRole(newRole);
    setCurrentView(newRole === 'guest' ? 'landing' : targetView);
    triggerNotification(`Switched to ${newRole.toUpperCase()} environment`, 'success');
  };

  // Handler for custom Mock File Upload
  const handleUploadSimulate = (presetIdx: number) => {
    setIsScanning(true);
    setScanStep(0);
    const selectedPreset = PRESET_UPLOADS[presetIdx];

    // Simulated scanner tick-rate
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsScanning(false);
          setUploadedPreview(selectedPreset);
          setUploadFormData({
            name: selectedPreset.name,
            category: selectedPreset.category,
            quantity: selectedPreset.quantity,
            unit: selectedPreset.unit,
            expectedPrice: selectedPreset.expectedPrice,
            frequency: 'Monthly',
            description: selectedPreset.description
          });
          triggerNotification('AI Analysis Complete: Highly Recyclable Content Detected!', 'success');
          return 4;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Submit new Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.name) return;

    const newListing: WasteListing = {
      id: `w-${Date.now()}`,
      name: uploadFormData.name,
      category: uploadFormData.category,
      quantity: Number(uploadFormData.quantity),
      unit: uploadFormData.unit,
      expectedPrice: Number(uploadFormData.expectedPrice),
      frequency: uploadFormData.frequency,
      description: uploadFormData.description,
      location: regCompany.address || 'Ankleshwar GIDC, Gujarat',
      lat: regCompany.lat,
      lng: regCompany.lng,
      seller: regCompany.name || 'Core Industries Ltd',
      sellerIndustry: regCompany.industry,
      sellerRating: 4.8,
      status: 'pending',
      co2Saved: uploadedPreview ? uploadedPreview.co2Saved : Math.round(Number(uploadFormData.quantity) * 0.8),
      imageColor: uploadedPreview ? uploadedPreview.color : 'bg-green-600'
    };

    setListings([newListing, ...listings]);
    triggerNotification('New industrial waste resource listed successfully!', 'success');
    setUploadedPreview(null);
    setUploadFormData({ name: '', category: 'Mineral Ash', quantity: 0, unit: 'Tons', expectedPrice: 0, frequency: 'One-off', description: '' });
    setCurrentView('listings');
  };

  // Send request from buyer
  const handleSendRequest = (item: WasteListing) => {
    const isExist = transactions.some(t => t.item === item.name && t.status === 'pending');
    if (isExist) {
      triggerNotification('A procurement request for this material is already active!', 'warning');
      return;
    }

    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      buyer: regCompany.name || 'Pragati Polymer Recyclers Ltd',
      seller: item.seller,
      item: item.name,
      quantity: `${item.quantity} ${item.unit}`,
      price: `₹${item.expectedPrice.toLocaleString()}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    triggerNotification(`Procurement request for ${item.name} sent to seller!`, 'success');
  };

  return (
    <div id="eco-exchange-root" className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* GLOBAL NOTIFICATION SYSTEM */}
      {notification && (
        <div id="global-notification" className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-bounce bg-white text-slate-800 border-green-200">
          <div className="p-1 rounded-full bg-green-50 text-green-500">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* DEMO HARNESS / PERSISTENT CONTROLLER FOR SIH / EVALUATORS */}
      <div id="demo-controller-bar" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center flex-wrap gap-2 px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200/50 backdrop-blur-md max-w-[95vw] overflow-x-auto text-xs font-semibold">
        <span className="text-slate-400 select-none mr-2">Demo Console:</span>
        <button id="nav-landing" onClick={() => { switchRole('guest'); setCurrentView('landing'); }} className={`px-2.5 py-1.5 rounded-lg border transition ${role === 'guest' && currentView === 'landing' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-transparent text-slate-500 border-slate-100 hover:bg-slate-50'}`}>
          Landing
        </button>
        <button id="nav-login" onClick={() => { switchRole('guest'); setCurrentView('login'); }} className={`px-2.5 py-1.5 rounded-lg border transition ${role === 'guest' && currentView === 'login' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-transparent text-slate-500 border-slate-100 hover:bg-slate-50'}`}>
          Auth Page
        </button>
        <div className="h-4 w-[1px] bg-slate-200" />
        <button id="role-producer" onClick={() => switchRole('producer', 'dashboard')} className={`px-2.5 py-1.5 rounded-lg transition text-white ${role === 'producer' ? 'bg-green-600' : 'bg-green-600/10 text-green-700 hover:bg-green-600/20'}`}>
          Producer Hub
        </button>
        <button id="role-buyer" onClick={() => switchRole('buyer', 'dashboard')} className={`px-2.5 py-1.5 rounded-lg transition text-white ${role === 'buyer' ? 'bg-blue-600' : 'bg-blue-600/10 text-blue-700 hover:bg-blue-600/20'}`}>
          Buyer Hub
        </button>
        <button id="role-recycler" onClick={() => switchRole('recycler', 'dashboard')} className={`px-2.5 py-1.5 rounded-lg transition text-white ${role === 'recycler' ? 'bg-orange-600' : 'bg-orange-600/10 text-orange-700 hover:bg-orange-600/20'}`}>
          Recycler Hub
        </button>
        <button id="role-admin" onClick={() => switchRole('admin', 'dashboard')} className={`px-2.5 py-1.5 rounded-lg transition text-white ${role === 'admin' ? 'bg-slate-800' : 'bg-slate-800/10 text-slate-700 hover:bg-slate-800/20'}`}>
          Admin Panel
        </button>
        <button 
          id="btn-toggle-theme" 
          onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ml-2"
          title="Toggle Visual Theme"
        >
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
        </button>
      </div>

      {/* ==========================================
          HEADER/NAVBAR FOR PUBLIC VIEWS (GUEST)
         ========================================== */}
      {role === 'guest' && (
        <header id="public-header" className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div id="logo-block" className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="p-2 bg-green-500 text-white rounded-xl shadow-md shadow-green-500/20">
                <Recycle className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoExchange AI
                </span>
                <span className="block text-[10px] text-slate-400 font-mono tracking-widest -mt-1 uppercase">CIRCULAR CLUSTER</span>
              </div>
            </div>

            <nav id="public-nav" className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-green-600 transition">Solutions</a>
              <a href="#how-it-works" className="hover:text-green-600 transition">How It Works</a>
              <a href="#ai-scanner" className="hover:text-green-600 transition">AI Classification</a>
              <a href="#marketplace-preview" className="hover:text-green-600 transition">Marketplace</a>
            </nav>

            <div className="flex items-center gap-3">
              <button id="nav-btn-login" onClick={() => setCurrentView('login')} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 transition">
                Sign In
              </button>
              <button id="nav-btn-register" onClick={() => { setCurrentView('register'); setRegisterStep(1); }} className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg shadow-green-500/10 hover:opacity-95 transition">
                Register Company
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ==========================================
          MAIN AREA DISPATCHER
         ========================================== */}
      <main className="pb-24">
        
        {/* LANDING PAGE SCREEN */}
        {role === 'guest' && currentView === 'landing' && (
          <div id="landing-screen" className="animate-fade-in">
            {/* HERO */}
            <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-100 dark:border-slate-900 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                    <Sparkles className="w-3.5 h-3.5" /> Empowering India Industrial Circular Economy
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Transform Industrial <br />
                    <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                      Waste into Resources
                    </span>
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
                    Connect waste producers, recyclers, and buyers using Artificial Intelligence. List discarded materials, predict molecular properties automatically, and optimize secure local transportation networks.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button id="hero-btn-getstarted" onClick={() => setCurrentView('register')} className="px-7 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                    <button id="hero-btn-demo" onClick={() => switchRole('producer', 'dashboard')} className="px-7 py-3.5 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                      View Demo Dashboard
                    </button>
                  </div>

                  {/* Trust Indicators / Stats Row */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 dark:border-slate-800">
                    <div>
                      <span className="block text-2xl font-black text-slate-900 dark:text-white">45,200+</span>
                      <span className="text-xs text-slate-500">Tons Waste Re-routed</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-black text-slate-900 dark:text-white">₹14.8 Cr</span>
                      <span className="text-xs text-slate-500">Industry Savings</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-black text-slate-900 dark:text-white">12,400+</span>
                      <span className="text-xs text-slate-500">CO₂ Tons Saved</span>
                    </div>
                  </div>
                </div>

                {/* GRAPHICAL ILLUSTRATION: CIRCULAR ECOSYSTEM */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-sm aspect-square p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-radial-at-tr from-green-500/10 via-transparent to-transparent opacity-70" />
                    
                    <div className="flex justify-between items-center z-10">
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase">Eco Circular Hub</span>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-pulse" /> Live Node Mapping
                      </span>
                    </div>

                    {/* Circular Interactive Nodes Visualization */}
                    <div className="my-8 relative h-48 flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full border border-dashed border-green-500/30 animate-spin-slow flex items-center justify-center">
                        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                          <Recycle className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Surrounding Nodes */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
                        <Building className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-bold">1. Waste Producer</span>
                      </div>

                      <div className="absolute bottom-1 right-2 flex flex-col items-center gap-1 z-10 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span className="text-[9px] font-bold">2. AI Classified Recycler</span>
                      </div>

                      <div className="absolute bottom-1 left-2 flex flex-col items-center gap-1 z-10 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
                        <User className="w-4 h-4 text-amber-500" />
                        <span className="text-[9px] font-bold">3. Core Resource Buyer</span>
                      </div>

                      {/* Glowing Route Arrows */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
                        <path d="M 100 30 Q 150 100 140 140" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                        <path d="M 140 140 Q 100 170 50 140" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                        <path d="M 50 140 Q 50 80 100 30" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
                      </svg>
                    </div>

                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl z-10">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        AI identifies metallurgical compositions automatically & matches immediate buyers in 15km radius.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTIONS: FEATURES, HOW IT WORKS */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 mb-16">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Smart Solutions for Industrial Symbiosis</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Connecting three key players to achieve perfect circular resource recovery.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800 space-y-4 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black">01</div>
                  <h3 className="text-xl font-bold">Waste Producers</h3>
                  <p className="text-sm text-slate-500">
                    Industrial power plants, chemical refineries, or mills can list byproducts instantly. Use our computer vision agent to classify materials accurately and eliminate expensive landfill disposal.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800 space-y-4 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">02</div>
                  <h3 className="text-xl font-bold">Waste Buyers</h3>
                  <p className="text-sm text-slate-500">
                    Infrastructure builders, manufacturers, and smelting units can source sustainable secondary raw materials cheaply. Save up to 45% in input material procurement costs.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800 space-y-4 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">03</div>
                  <h3 className="text-xl font-bold">Authorized Recyclers</h3>
                  <p className="text-sm text-slate-500">
                    Process or filter complex industrial sludge, plastics, or ash to meet strict safety guidelines. Provide verified compliance certifications directly through the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* INTERACTIVE AI SCANNED SECTION */}
            <section id="ai-scanner" className="py-16 bg-slate-100 dark:bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-6 space-y-5">
                  <span className="text-xs font-bold text-green-600 tracking-wider uppercase">Try Live AI Sandbox</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI-Powered Automatic Material Detection</h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    Our machine learning pipeline uses multi-spectral object classification to detect materials, estimate clean recycling value, and measure the exact CO₂ savings on the spot.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-500">Select an Industrial waste sample below to test AI detection:</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_UPLOADS.map((preset, idx) => (
                        <button key={idx} onClick={() => handleUploadSimulate(idx)} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-green-500 transition flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-green-500" /> {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6">
                  {/* AI Scanner Mock Device */}
                  <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
                      <span className="text-xs font-bold font-mono text-slate-400">SPECTROSCOPY ANALYSIS FEED</span>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                    </div>

                    {isScanning ? (
                      <div className="h-64 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-bounce" />
                        <RefreshCw className="w-10 h-10 animate-spin text-green-400" />
                        <div className="text-center">
                          <p className="text-sm font-bold tracking-wide">
                            {scanStep === 0 && 'Connecting spectroscope scanner...'}
                            {scanStep === 1 && 'Acquiring density matrices...'}
                            {scanStep === 2 && 'Querying circular taxonomy dataset...'}
                            {scanStep === 3 && 'Awaiting confidence estimation...'}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">Running Local Tensor Pipeline</span>
                        </div>
                      </div>
                    ) : uploadedPreview ? (
                      <div className="space-y-4">
                        <div className="relative h-44 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900">
                          {/* Simulated image canvas representation */}
                          <div className={`w-32 h-32 rounded-xl ${uploadedPreview.color} opacity-80 flex items-center justify-center text-white font-mono text-xs text-center p-2`}>
                            {uploadedPreview.name}
                          </div>
                          
                          {/* AI Bounding Box overlay */}
                          <div className="absolute inset-x-8 inset-y-6 border-2 border-green-500 rounded-lg animate-pulse">
                            <span className="absolute -top-6 left-0 bg-green-600 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                              {uploadedPreview.boxLabel} ({uploadedPreview.confidence}%)
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <span className="block text-[10px] text-slate-400 uppercase font-mono">Core Composition</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{uploadedPreview.aiMaterial}</span>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <span className="block text-[10px] text-slate-400 uppercase font-mono">Carbon Savings (CO₂)</span>
                            <span className="text-sm font-bold text-green-600">~{uploadedPreview.co2Saved} Tons Offset</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="block text-xs font-semibold text-slate-500 mb-1.5">Suggested Waste Taxonomies:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {uploadedPreview.suggestedCategories.map((c, i) => (
                              <span key={i} className="px-2 py-1 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 text-[10px] font-mono rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button onClick={() => switchRole('producer', 'recommendations')} className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:opacity-95 text-white text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2">
                          View Matched Buyers Nearby <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-64 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 cursor-pointer" onClick={() => handleUploadSimulate(0)}>
                        <UploadCloud className="w-12 h-12 mb-3 text-slate-300" />
                        <span className="text-sm font-bold">Upload industrial scrap picture</span>
                        <span className="text-xs mt-1">or click on the sample presets above</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* GEOGRAPHIC ROUTING SIMULATOR PREVIEW */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                  <div className="absolute top-6 left-6 z-10 bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl shadow-md border border-slate-100 max-w-xs text-[11px]">
                    <span className="font-bold text-slate-400 uppercase font-mono block mb-1">Optimized Logistics</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Route configured from Ankleshwar Chemicals to Vajra Building Materials.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400">Distance</span>
                        <p className="font-bold text-green-600">18.1 km</p>
                      </div>
                      <div>
                        <span className="text-slate-400">CO₂ Saved</span>
                        <p className="font-bold text-blue-600">220 kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive SVG Map Mockup */}
                  <svg className="w-full h-80 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40" viewBox="0 0 400 300">
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    {/* Simulated GIDC Grid Roads */}
                    <line x1="20" y1="50" x2="380" y2="50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    <line x1="20" y1="150" x2="380" y2="150" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    <line x1="20" y1="250" x2="380" y2="250" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    <line x1="100" y1="20" x2="100" y2="280" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                    <line x1="280" y1="20" x2="280" y2="280" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

                    {/* Industrial Zones (shaded circles) */}
                    <circle cx="100" cy="150" r="35" fill="#22c55e" fillOpacity="0.08" />
                    <circle cx="280" cy="110" r="45" fill="#2563eb" fillOpacity="0.08" />

                    {/* Route Connector */}
                    <path d="M 100 150 Q 190 60 280 110" fill="none" stroke="url(#routeGrad)" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
                    
                    {/* Producer Pin */}
                    <circle cx="100" cy="150" r="8" fill="#22c55e" stroke="white" strokeWidth="2" />
                    <text x="100" y="135" textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300">Producer Hub</text>

                    {/* Buyer Pin */}
                    <circle cx="280" cy="110" r="8" fill="#2563eb" stroke="white" strokeWidth="2" />
                    <text x="280" y="95" textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300">Vajra Materials</text>
                  </svg>
                </div>

                <div className="space-y-6">
                  <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Geographic Logistics Engine</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Route Optimization & Fuel Estimation</h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    Avoid expensive logistics. EcoExchange calculates optimal dispatch routes, evaluates commercial fuel expenditures, and computes total carbon reduction indices, giving your board verified environmental report parameters.
                  </p>
                  <ul className="space-y-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Micro-distance industrial clustering (radius matching)</li>
                    <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Integrated transit cost budgeting and billing</li>
                    <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Pre-computed green toll credits for electric fleets</li>
                  </ul>
                  <button onClick={() => switchRole('producer', 'map')} className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition">
                    View Interactive Route Maps <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* PUBLIC FOOTER */}
            <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <Recycle className="w-6 h-6 text-green-400" />
                    <span className="font-black">EcoExchange AI</span>
                  </div>
                  <p className="text-xs">Connecting industrial waste producers with specialized buyers using high-end AI.</p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-3">Roles</h4>
                  <ul className="space-y-2 text-xs">
                    <li><button onClick={() => switchRole('producer')} className="hover:text-white transition">Waste Producer Hub</button></li>
                    <li><button onClick={() => switchRole('buyer')} className="hover:text-white transition">Waste Buyer Platform</button></li>
                    <li><button onClick={() => switchRole('recycler')} className="hover:text-white transition">Recycler Network</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-3">Security</h4>
                  <ul className="space-y-2 text-xs">
                    <li><a href="#" className="hover:text-white transition">Material Auditing</a></li>
                    <li><a href="#" className="hover:text-white transition">Regulatory Compliance</a></li>
                    <li><a href="#" className="hover:text-white transition">ISO 14001 Standards</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-3">Initiative</h4>
                  <p className="text-xs">Smart India Hackathon 2026 Sandbox. Designed for structural circular cluster deployment.</p>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-slate-800 text-center text-xs">
                © 2026 EcoExchange AI Circular Networks. All rights reserved.
              </div>
            </footer>
          </div>
        )}

        {/* AUTHENTICATION: LOGIN VIEW */}
        {role === 'guest' && currentView === 'login' && (
          <div id="login-screen" className="max-w-md mx-auto mt-20 px-4 animate-fade-in">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold">Welcome Back</h2>
                <p className="text-xs text-slate-400">Log in to manage industrial resource distribution</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {(['producer', 'buyer', 'recycler'] as const).map(r => (
                  <button key={r} onClick={() => setLoginRole(r)} className={`py-1.5 rounded-lg text-xs font-bold transition capitalize ${loginRole === r ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
                    {r}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); switchRole(loginRole, 'dashboard'); }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company Email</label>
                  <input type="email" placeholder="email@company.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-green-500 transition" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                    <a href="#" className="text-[10px] text-green-600 font-bold hover:underline">Forgot?</a>
                  </div>
                  <input type="password" placeholder="••••••••" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-green-500 transition" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                    Remember Me
                  </label>
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition">
                  Access Secure Hub
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase font-mono">Or connect with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => switchRole('producer', 'dashboard')} className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Google Workspace
                </button>
                <button onClick={() => switchRole('producer', 'dashboard')} className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  National Portals
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">New company? </span>
                <button onClick={() => { setCurrentView('register'); setRegisterStep(1); }} className="text-xs text-green-600 font-extrabold hover:underline">Register Multi-Step</button>
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION: REGISTER MULTI-STEP PAGE */}
        {role === 'guest' && currentView === 'register' && (
          <div id="register-screen" className="max-w-2xl mx-auto mt-14 px-4 animate-fade-in">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
              
              {/* Registration Stepper Header */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold">Register Industrial Node</h2>
                  <p className="text-xs text-slate-400">Join the smart cluster exchange network in four simple steps</p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  {[
                    { s: 1, label: 'Company' },
                    { s: 2, label: 'GPS Location' },
                    { s: 3, label: 'Industrial Profile' },
                    { s: 4, label: 'Validate & Review' }
                  ].map(step => (
                    <div key={step.s} className="space-y-1.5">
                      <div className={`h-1.5 rounded-full transition ${registerStep >= step.s ? 'bg-green-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                      <span className={registerStep === step.s ? 'text-green-600' : 'text-slate-400'}>
                        {step.s}. {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: COMPANY DATA */}
              {registerStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                      <input type="text" placeholder="Tata Chemicals Ltd" required value={regCompany.name} onChange={e => setRegCompany({ ...regCompany, name: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Corporate Identification ID</label>
                      <input type="text" placeholder="L24110GJ1939PLC000748" required value={regCompany.regId} onChange={e => setRegCompany({ ...regCompany, regId: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Primary Contact Email</label>
                      <input type="email" placeholder="contact@tatachemicals.com" required value={regCompany.email} onChange={e => setRegCompany({ ...regCompany, email: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Authorized Phone</label>
                      <input type="text" placeholder="+91 98765 43210" required value={regCompany.phone} onChange={e => setRegCompany({ ...regCompany, phone: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                    </div>
                  </div>
                  <button onClick={() => setRegisterStep(2)} disabled={!regCompany.name || !regCompany.email} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 disabled:opacity-50 transition">
                    Continue to GPS Location
                  </button>
                </div>
              )}

              {/* STEP 2: LOCATION MAP PICKER MOCK */}
              {registerStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">Interactive GIS Pinpoint Required</p>
                      <p className="mt-0.5">Click directly on the industrial estate cluster map below to automatically synchronize corporate latitude and longitude coordinates.</p>
                    </div>
                  </div>

                  {/* Interactive Map Picker Canvas */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-lg shadow-md border text-[11px] font-mono">
                      <span>Lat: {regCompany.lat.toFixed(4)}</span> | <span>Lng: {regCompany.lng.toFixed(4)}</span>
                    </div>

                    <svg 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const computedLat = 20.0 + (y / 300) * 5;
                        const computedLng = 70.0 + (x / 500) * 10;
                        setRegCompany({ ...regCompany, lat: computedLat, lng: computedLng });
                        triggerNotification('GIS Location coordinates updated!', 'info');
                      }}
                      className="w-full h-64 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 cursor-crosshair"
                      viewBox="0 0 500 300"
                    >
                      {/* Grid background */}
                      <path d="M 0 100 L 500 100 M 0 200 L 500 200 M 100 0 L 100 300 M 250 0 L 250 300 M 400 0 L 400 300" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
                      
                      {/* Industrial Estates */}
                      <rect x="80" y="60" width="120" height="80" rx="10" fill="#22c55e" fillOpacity="0.05" stroke="#22c55e" strokeDasharray="3,3" />
                      <text x="140" y="105" textAnchor="middle" className="text-[10px] fill-green-700/60 font-bold">Vatva Industrial GIDC</text>

                      <rect x="300" y="130" width="140" height="90" rx="10" fill="#2563eb" fillOpacity="0.05" stroke="#2563eb" strokeDasharray="3,3" />
                      <text x="370" y="180" textAnchor="middle" className="text-[10px] fill-blue-700/60 font-bold">Sanand Logistics Hub</text>

                      {/* Map Interactive Marker Pin */}
                      <circle cx={(regCompany.lng - 70.0) * 50} cy={(regCompany.lat - 20.0) * 60} r="18" fill="#ef4444" fillOpacity="0.15" className="animate-ping" />
                      <circle cx={(regCompany.lng - 70.0) * 50} cy={(regCompany.lat - 20.0) * 60} r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
                      <path d={`M ${(regCompany.lng - 70.0) * 50} ${(regCompany.lat - 20.0) * 60} L ${(regCompany.lng - 70.0) * 50} ${(regCompany.lat - 20.0) * 60 - 20}`} stroke="#ef4444" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Visual Postal Address</label>
                    <input type="text" placeholder="Plot No. 402, GIDC Chemical Zone, Vatva, Gujarat" value={regCompany.address} onChange={e => setRegCompany({ ...regCompany, address: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setRegisterStep(1)} className="w-1/3 py-3 border border-slate-200 rounded-xl text-xs font-bold">Back</button>
                    <button onClick={() => setRegisterStep(3)} className="w-2/3 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800">Continue to Industrial Profile</button>
                  </div>
                </div>
              )}

              {/* STEP 3: INDUSTRY DETAILS */}
              {registerStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Sector Category</label>
                      <select value={regCompany.industry} onChange={e => setRegCompany({ ...regCompany, industry: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm">
                        <option>Petrochemical Refining</option>
                        <option>Cement & Construction</option>
                        <option>Heavy Metallurgy</option>
                        <option>Polymer Formulations</option>
                        <option>Pharma Ingredients</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Frequent Byproducts Generated/Needed</label>
                      <input type="text" placeholder="Sulfur sludge, Fly Ash, solvents" value={regCompany.materialsGenerated} onChange={e => setRegCompany({ ...regCompany, materialsGenerated: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Company Overview Brief</label>
                    <textarea rows={3} placeholder="Leading chemical synthesis plant focused on agricultural compounds..." value={regCompany.bio} onChange={e => setRegCompany({ ...regCompany, bio: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setRegisterStep(2)} className="w-1/3 py-3 border border-slate-200 rounded-xl text-xs font-bold">Back</button>
                    <button onClick={() => setRegisterStep(4)} className="w-2/3 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800">Review & Validate</button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {registerStep === 4 && (
                <div className="space-y-4 animate-fade-in text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-3">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 border-b pb-2">Industrial node overview:</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <span className="text-slate-400">Company Name:</span>
                      <span className="font-bold">{regCompany.name}</span>

                      <span className="text-slate-400">Email Contact:</span>
                      <span className="font-bold">{regCompany.email}</span>

                      <span className="text-slate-400">Sector category:</span>
                      <span className="font-bold">{regCompany.industry}</span>

                      <span className="text-slate-400">GIS Coordinates:</span>
                      <span className="font-mono font-bold text-green-600">{regCompany.lat.toFixed(4)}, {regCompany.lng.toFixed(4)}</span>

                      <span className="text-slate-400">Visual Address:</span>
                      <span className="font-bold">{regCompany.address}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-400 rounded-xl text-xs flex gap-2 items-center">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Company validation credentials conform to Ministry criteria automatically.</span>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setRegisterStep(3)} className="w-1/3 py-3 border border-slate-200 rounded-xl text-xs font-bold">Back</button>
                    <button onClick={() => { switchRole('producer', 'dashboard'); triggerNotification('Company registered and node verified!', 'success'); }} className="w-2/3 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl text-xs hover:shadow-lg">
                      Confirm & Open Producer Hub
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button onClick={() => setCurrentView('login')} className="text-xs text-slate-400 hover:text-slate-800 font-semibold">Already registered? Log in instead</button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LOGGED IN SHELL: PRODUCER, BUYER, RECYCLER, ADMIN DASHBOARDS
           ========================================================================= */}
        {role !== 'guest' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* SIDEBAR NAVIGATION - RESPONSIVE & COLLAPSED MOBILE RAIL */}
              <aside id="dashboard-sidebar" className="lg:w-64 flex-shrink-0">
                <div className="sticky top-20 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 space-y-6">
                  
                  {/* Sidebar Header: Selected Role Card */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Building className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs capitalize leading-none">{role} Console</h4>
                      <span className="text-[10px] text-slate-400 font-mono">NODE-0043-VERIFIED</span>
                    </div>
                  </div>

                  {/* NAV ITEMS DISPATCHED BY ROLE */}
                  <nav className="space-y-1 text-xs font-bold">
                    {role === 'producer' && (
                      <>
                        {[
                          { id: 'dashboard', label: 'Overview', icon: Grid },
                          { id: 'listings', label: 'Waste Listings', icon: Layers },
                          { id: 'upload', label: 'Upload Waste', icon: UploadCloud },
                          { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
                          { id: 'map', label: 'GIS Logistics Map', icon: Map },
                          { id: 'marketplace', label: 'Resource Market', icon: Globe },
                          { id: 'transactions', label: 'Transactions', icon: Coins },
                          { id: 'profile', label: 'Profile', icon: User },
                          { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${currentView === item.id ? 'bg-green-500 text-white shadow-xs shadow-green-500/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}>
                              <Icon className="w-4 h-4" /> {item.label}
                            </button>
                          );
                        })}
                      </>
                    )}

                    {role === 'buyer' && (
                      <>
                        {[
                          { id: 'dashboard', label: 'Overview Dashboard', icon: Grid },
                          { id: 'marketplace', label: 'Exchange Marketplace', icon: Globe },
                          { id: 'transactions', label: 'Procurements', icon: Coins },
                          { id: 'profile', label: 'Profile Settings', icon: User },
                          { id: 'settings', label: 'Global Settings', icon: Settings }
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${currentView === item.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}>
                              <Icon className="w-4 h-4" /> {item.label}
                            </button>
                          );
                        })}
                      </>
                    )}

                    {role === 'recycler' && (
                      <>
                        {[
                          { id: 'dashboard', label: 'Recycling Hub', icon: Recycle },
                          { id: 'marketplace', label: 'Resource Marketplace', icon: Globe },
                          { id: 'transactions', label: 'Fulfillments', icon: Coins },
                          { id: 'settings', label: 'System Settings', icon: Settings }
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${currentView === item.id ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}>
                              <Icon className="w-4 h-4" /> {item.label}
                            </button>
                          );
                        })}
                      </>
                    )}

                    {role === 'admin' && (
                      <>
                        {[
                          { id: 'dashboard', label: 'Global Overview', icon: Database },
                          { id: 'marketplace', label: 'Audit Exchange', icon: Globe },
                          { id: 'transactions', label: 'Clearance logs', icon: FileText },
                          { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${currentView === item.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}>
                              <Icon className="w-4 h-4" /> {item.label}
                            </button>
                          );
                        })}
                      </>
                    )}
                  </nav>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => switchRole('guest', 'landing')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs font-bold transition">
                      <LogOut className="w-4 h-4" /> Sign Out Session
                    </button>
                  </div>
                </div>
              </aside>

              {/* MAIN CONTENT AREA */}
              <div id="dashboard-content" className="flex-1 min-w-0 space-y-6">
                
                {/* =====================================================
                    ROLE: PRODUCER - VIEW: DASHBOARD
                   ===================================================== */}
                {role === 'producer' && currentView === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Top Stat Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Listed', val: '188.5 Tons', diff: '+12%', desc: 'Industrial waste listed', icon: Layers, color: 'text-green-600' },
                        { label: 'Revenue Generated', val: '₹4,85,000', diff: '+24%', desc: 'Through resource sale', icon: Coins, color: 'text-blue-600' },
                        { label: 'Active Listings', val: listings.length, diff: 'Pending bids', desc: 'Awaiting recycling match', icon: Activity, color: 'text-amber-500' },
                        { label: 'CO₂ Emissions Saved', val: '127.5 Tons', diff: 'Equivalent verified', desc: 'Primary material savings', icon: Recycle, color: 'text-emerald-500' }
                      ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                          <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{card.label}</span>
                              <Icon className={`w-4.5 h-4.5 ${card.color}`} />
                            </div>
                            <div>
                              <p className="text-xl font-black">{card.val}</p>
                              <div className="flex justify-between items-center text-[10px] mt-1">
                                <span className="text-green-600 font-bold">{card.diff}</span>
                                <span className="text-slate-400">{card.desc}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* TWO COLUMN CHART GRID - HIGH FIDELITY SVG CHARTS */}
                    <div className="grid md:grid-cols-12 gap-6">
                      
                      {/* Left: Monthly Revenue Curve Line Graph */}
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-sm">Industrial Sales Revenue Timeline</h3>
                            <p className="text-xs text-slate-400">Monthly breakdown of resource matching transactions</p>
                          </div>
                          <span className="px-2 py-1 rounded bg-green-50 text-[10px] text-green-700 font-bold">FY 2026</span>
                        </div>

                        {/* HIGH FIDELITY SVG GRAPH */}
                        <div className="relative">
                          <svg className="w-full h-48" viewBox="0 0 500 150">
                            <defs>
                              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Grid Y Lines */}
                            <line x1="50" y1="20" x2="480" y2="20" stroke="#f1f5f9" />
                            <line x1="50" y1="70" x2="480" y2="70" stroke="#f1f5f9" />
                            <line x1="50" y1="120" x2="480" y2="120" stroke="#e2e8f0" />

                            {/* Line Curve Path */}
                            <path 
                              d="M 50 110 Q 120 70 200 80 T 320 40 T 450 30" 
                              fill="none" 
                              stroke="#22c55e" 
                              strokeWidth="3.5" 
                              strokeLinecap="round" 
                            />
                            {/* Area Gradient Path */}
                            <path 
                              d="M 50 110 Q 120 70 200 80 T 320 40 T 450 30 L 450 120 L 50 120 Z" 
                              fill="url(#chartGrad)" 
                            />

                            {/* Node markers on graph */}
                            <circle cx="200" cy="80" r="5" fill="#22c55e" stroke="white" strokeWidth="2" className="cursor-pointer" />
                            <circle cx="320" cy="40" r="5" fill="#22c55e" stroke="white" strokeWidth="2" className="cursor-pointer" />
                            <circle cx="450" cy="30" r="5" fill="#22c55e" stroke="white" strokeWidth="2" className="cursor-pointer" />

                            {/* X Axis label coordinates */}
                            <text x="50" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Jan</text>
                            <text x="130" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Mar</text>
                            <text x="210" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">May</text>
                            <text x="290" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Jul</text>
                            <text x="370" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Sep</text>
                            <text x="450" y="135" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Nov</text>
                          </svg>
                        </div>
                      </div>

                      {/* Right: Waste Category Distribution Pie Representation */}
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-4 space-y-4">
                        <h3 className="font-bold text-sm">Resource Categorization</h3>
                        
                        {/* Segmented Concentric Progress Ring */}
                        <div className="flex items-center justify-center py-2">
                          <svg className="w-28 h-28" viewBox="0 0 100 100">
                            {/* Slags ring */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="8" strokeDasharray="188 251" />
                            {/* Polymers ring */}
                            <circle cx="50" cy="50" r="30" fill="transparent" stroke="#2563eb" strokeWidth="8" strokeDasharray="120 188" />
                            {/* Sludge ring */}
                            <circle cx="50" cy="50" r="20" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray="60 125" />
                          </svg>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-500">
                          <div className="text-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1" />
                            Slags (52%)
                          </div>
                          <div className="text-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-1" />
                            Polymers (31%)
                          </div>
                          <div className="text-center">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" />
                            Sludge (17%)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TRANSACTIONS TABLE */}
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm">Recent Circular Exchanges</h3>
                        <span className="text-xs text-green-600 font-extrabold hover:underline cursor-pointer" onClick={() => setCurrentView('transactions')}>View all logs</span>
                      </div>

                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase font-mono">
                              <th className="pb-2">Transaction ID</th>
                              <th className="pb-2">Procurement Buyer</th>
                              <th className="pb-2">Resource Material</th>
                              <th className="pb-2">Exchange Volume</th>
                              <th className="pb-2">Commercial Value</th>
                              <th className="pb-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((tx: any) => (
                              <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800/50 py-3">
                                <td className="py-3 font-mono font-bold text-slate-400">{tx.id}</td>
                                <td className="py-3 font-bold">{tx.buyer}</td>
                                <td className="py-3">{tx.item}</td>
                                <td className="py-3 font-bold text-slate-500">{tx.quantity}</td>
                                <td className="py-3 font-bold">{tx.price}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold capitalize ${tx.status === 'completed' ? 'bg-green-50 text-green-700' : tx.status === 'accepted' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    ROLE: PRODUCER - VIEW: WASTE LISTINGS
                   ===================================================== */}
                {role === 'producer' && currentView === 'listings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-black">Industrial Waste Inventory</h2>
                        <p className="text-xs text-slate-400">Overview of listed byproducts awaiting exchange matches</p>
                      </div>
                      <button onClick={() => setCurrentView('upload')} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-green-500 transition shadow-sm">
                        <Plus className="w-4.5 h-4.5" /> List New Waste
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {listings.map(item => (
                        <div key={item.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                                {item.category}
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                {item.status}
                              </span>
                            </div>

                            <div>
                              <h3 className="font-extrabold text-base">{item.name}</h3>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 dark:border-slate-800/50 text-[10px] font-semibold text-slate-400">
                              <div>
                                <span>Quantity</span>
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.quantity} {item.unit}</p>
                              </div>
                              <div>
                                <span>Expected Price</span>
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">₹{item.expectedPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span>Offset CO₂</span>
                                <p className="font-bold text-green-600 text-sm">~{item.co2Saved} Tons</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button onClick={() => { setSelectedListingForDetails(item); setCurrentView('recommendations'); }} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition">
                              Match Recommendations
                            </button>
                            <button onClick={() => { setSelectedListingForDetails(item); setCurrentView('map'); }} className="p-2 border border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl transition" title="Logistics Routing">
                              <Map className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* =====================================================
                    ROLE: PRODUCER - VIEW: UPLOAD WASTE (AI PREDICTIONS)
                   ===================================================== */}
                {role === 'producer' && currentView === 'upload' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-black">Register Waste Composition</h2>
                      <p className="text-xs text-slate-400">Upload material photographs to run automated chemical class estimation</p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                      {/* Left: Standard Registration Form */}
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-7 space-y-4">
                        <form onSubmit={handleCreateListing} className="space-y-3.5 text-xs font-bold">
                          
                          <div className="space-y-1">
                            <label className="text-slate-500 uppercase">Material/Waste Name</label>
                            <input type="text" required placeholder="Fly Ash Grade C" value={uploadFormData.name} onChange={e => setUploadFormData({ ...uploadFormData, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-slate-500 uppercase">Category</label>
                              <select value={uploadFormData.category} onChange={e => setUploadFormData({ ...uploadFormData, category: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs">
                                <option>Mineral Ash</option>
                                <option>Metallurgical Slag</option>
                                <option>Precious Metals</option>
                                <option>Polymers</option>
                                <option>Chemical Residues</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-500 uppercase">Listing Frequency</label>
                              <select value={uploadFormData.frequency} onChange={e => setUploadFormData({ ...uploadFormData, frequency: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs">
                                <option>One-off</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Quarterly</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1 col-span-1">
                              <label className="text-slate-500 uppercase">Volume/Qty</label>
                              <input type="number" required placeholder="50" value={uploadFormData.quantity || ''} onChange={e => setUploadFormData({ ...uploadFormData, quantity: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs" />
                            </div>
                            <div className="space-y-1 col-span-1">
                              <label className="text-slate-500 uppercase">Unit</label>
                              <select value={uploadFormData.unit} onChange={e => setUploadFormData({ ...uploadFormData, unit: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs">
                                <option>Tons</option>
                                <option>Liters</option>
                                <option>Kilograms</option>
                              </select>
                            </div>
                            <div className="space-y-1 col-span-1">
                              <label className="text-slate-500 uppercase">Expected Price</label>
                              <input type="number" required placeholder="₹ / Unit" value={uploadFormData.expectedPrice || ''} onChange={e => setUploadFormData({ ...uploadFormData, expectedPrice: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-500 uppercase">Material Composition details</label>
                            <textarea rows={3} placeholder="Provide moisture parameters, heavy metal residue fractions..." value={uploadFormData.description} onChange={e => setUploadFormData({ ...uploadFormData, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-transparent text-xs" />
                          </div>

                          <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:shadow-md">
                            Publish to Circular Marketplace
                          </button>
                        </form>
                      </div>

                      {/* Right: Computer Vision Scanner Simulator */}
                      <div className="md:col-span-5 space-y-4">
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                          <h3 className="font-bold text-xs uppercase text-slate-400 font-mono">Simulate Computer Vision Agent</h3>
                          
                          {isScanning ? (
                            <div className="h-56 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white space-y-3 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500 animate-bounce" />
                              <RefreshCw className="w-8 h-8 animate-spin text-green-400" />
                              <span className="text-[10px] font-mono tracking-wider">Acquiring composition profile...</span>
                            </div>
                          ) : uploadedPreview ? (
                            <div className="space-y-3 text-xs">
                              <div className="relative h-40 rounded-xl overflow-hidden flex items-center justify-center bg-slate-950">
                                <div className={`w-28 h-28 rounded-2xl ${uploadedPreview.color} flex items-center justify-center text-white font-black text-center p-1`}>
                                  {uploadedPreview.name}
                                </div>
                                <div className="absolute inset-4 border-2 border-green-500 rounded animate-pulse">
                                  <span className="absolute -top-6 left-1 bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                    {uploadedPreview.aiMaterial} ({uploadedPreview.confidence}%)
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                <p className="font-black text-slate-700">AI Estimation Confidence: <span className="text-green-600">{uploadedPreview.confidence}%</span></p>
                                <p className="text-[10px] text-slate-400">Our deep net successfully matched secondary structures with Metallurgical Slags catalog index ISO-14022.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-8 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                                <UploadCloud className="w-10 h-10 mb-2 text-slate-300" />
                                <span className="font-bold">No Material Scanned</span>
                                <p className="text-[10px] text-slate-400 mt-1">Select one of our preset templates below to simulate automated classification:</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {PRESET_UPLOADS.map((preset, idx) => (
                                  <button key={idx} onClick={() => handleUploadSimulate(idx)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold border border-slate-100 text-slate-600 text-left">
                                    + {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    ROLE: PRODUCER - VIEW: RECOMMENDATIONS
                   ===================================================== */}
                {role === 'producer' && currentView === 'recommendations' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-black">AI Match Recommendations</h2>
                        <p className="text-xs text-slate-400">Instantly matches nearby metallurgical, construction, and recovery buyers</p>
                      </div>

                      {/* Sorters */}
                      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 text-[10px] font-bold">
                        {['AI Match', 'Distance', 'Price', 'Rating'].map(sort => (
                          <button key={sort} className={`px-3 py-1 rounded-lg transition ${sort === 'AI Match' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}>
                            {sort}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {INITIAL_BUYERS.map(buyer => (
                        <div key={buyer.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                          
                          {/* Buyer Specs */}
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">
                                {buyer.industry}
                              </div>
                              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                ⭐ {buyer.rating}
                              </span>
                            </div>

                            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{buyer.name}</h3>
                            
                            <div className="grid grid-cols-4 gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                              <div>
                                <span>Transit Distance</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{buyer.distance} km</p>
                              </div>
                              <div>
                                <span>Compatibility</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{buyer.compatibility}%</p>
                              </div>
                              <div>
                                <span>Transport Levy</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">₹{buyer.transportCost}</p>
                              </div>
                              <div>
                                <span>Expected price</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">₹{buyer.expectedPrice}/Ton</p>
                              </div>
                            </div>
                          </div>

                          {/* AI Score Badge & Action */}
                          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[130px]">
                            <div className="text-center">
                              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Match Match</span>
                              <p className="text-2xl font-black text-green-600">{buyer.matchScore}%</p>
                            </div>

                            <button 
                              onClick={() => {
                                setSelectedBuyerForRoute(buyer);
                                setCurrentView('map');
                                triggerNotification(`Plotting optimal transit route to ${buyer.name}!`, 'info');
                              }} 
                              className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-md transition w-full"
                            >
                              Dispatch Route
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* =====================================================
                    ROLE: PRODUCER - VIEW: MAP ROUTING PAGE
                   ===================================================== */}
                {role === 'producer' && currentView === 'map' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-black">GIS Logistics Planner</h2>
                      <p className="text-xs text-slate-400">Plot optimized shipping route to active buyers, reducing diesel overheads</p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                      
                      {/* Left: Map Plotter */}
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs md:col-span-8 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2 text-xs font-bold">
                          <span className="text-slate-400 uppercase font-mono">Active Transit Channel</span>
                          <span className="text-green-600">Route Verified By GIDC API</span>
                        </div>

                        {/* HIGH FIDELITY ROUTE SVG MAP */}
                        <div className="relative">
                          <svg className="w-full h-80 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50" viewBox="0 0 400 300">
                            {/* Grid Lines */}
                            <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
                            <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
                            <line x1="150" y1="0" x2="150" y2="300" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
                            <line x1="300" y1="0" x2="300" y2="300" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />

                            {/* Anchor Shading */}
                            <circle cx="80" cy="180" r="40" fill="#22c55e" fillOpacity="0.06" />
                            <circle cx="300" cy="120" r="50" fill="#2563eb" fillOpacity="0.06" />

                            {/* Pulsing Animated Route Connection */}
                            <path 
                              d={`M 80 180 Q ${120 + selectedBuyerForRoute.distance * 2} ${150 - selectedBuyerForRoute.distance} 300 120`} 
                              fill="none" 
                              stroke="url(#routeGrad)" 
                              strokeWidth="5" 
                              strokeLinecap="round" 
                              strokeDasharray="8,8"
                              className="animate-pulse"
                            />

                            {/* Producer Pin */}
                            <g transform="translate(80, 180)">
                              <circle r="12" fill="#22c55e" fillOpacity="0.2" className="animate-ping" />
                              <circle r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
                              <text y="-14" textAnchor="middle" className="text-[9px] font-bold fill-slate-500">My Industry Node</text>
                            </g>

                            {/* Selected Buyer Pin */}
                            <g transform="translate(300, 120)">
                              <circle r="12" fill="#2563eb" fillOpacity="0.2" className="animate-ping" />
                              <circle r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
                              <text y="-14" textAnchor="middle" className="text-[9px] font-bold fill-slate-700 dark:fill-slate-300">
                                {selectedBuyerForRoute.name.slice(0, 18)}...
                              </text>
                            </g>
                          </svg>
                        </div>
                      </div>

                      {/* Right: Route Cost Calculations */}
                      <div className="md:col-span-4 space-y-4">
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 text-xs font-bold">
                          <h3 className="text-slate-400 uppercase font-mono">Commercial Estimates</h3>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                              <span className="text-slate-400">Buyer Entity</span>
                              <span className="text-right">{selectedBuyerForRoute.name}</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                              <span className="text-slate-400">Total Distance</span>
                              <span>{selectedBuyerForRoute.distance} km</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                              <span className="text-slate-400">Est. Fuel Overhead</span>
                              <span className="text-blue-600">₹{(selectedBuyerForRoute.transportCost * 5).toLocaleString()}</span>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                              <span className="text-slate-400">Net CO₂ Reduction</span>
                              <span className="text-green-600 font-black">~{(selectedBuyerForRoute.compatibility * 0.4).toFixed(1)} Tons Saved</span>
                            </div>
                          </div>

                          <button onClick={() => triggerNotification('Shipping manifests scheduled for dispatch!', 'success')} className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-center">
                            Lock Shipping Channel
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* =====================================================
                    GENERAL VIEW: CIRCULAR EXCHANGE RESOURCE MARKETPLACE
                   ===================================================== */}
                {currentView === 'marketplace' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-black">Exchange Marketplace</h2>
                        <p className="text-xs text-slate-400">Secure listing index for recycled aggregate and metals</p>
                      </div>

                      {/* Filters & Search Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input 
                            type="text" 
                            placeholder="Search ash, slag..." 
                            value={marketSearch}
                            onChange={e => setMarketSearch(e.target.value)}
                            className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-green-500" 
                          />
                        </div>

                        <select 
                          value={marketCategory}
                          onChange={e => setMarketCategory(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none"
                        >
                          <option>All</option>
                          <option>Mineral Ash</option>
                          <option>Metallurgical Slag</option>
                          <option>Precious Metals</option>
                          <option>Polymers</option>
                        </select>
                      </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="grid md:grid-cols-3 gap-5">
                      {listings
                        .filter(item => {
                          if (marketCategory !== 'All' && item.category !== marketCategory) return false;
                          if (marketSearch && !item.name.toLowerCase().includes(marketSearch.toLowerCase())) return false;
                          return true;
                        })
                        .map(item => (
                          <div key={item.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                                  {item.category}
                                </span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                  ⭐ {item.sellerRating}
                                </span>
                              </div>

                              <div>
                                <h3 className="font-extrabold text-sm">{item.name}</h3>
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                              </div>

                              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl grid grid-cols-2 gap-2 text-[10px]">
                                <div>
                                  <span className="text-slate-400">Supply Volume:</span>
                                  <p className="font-bold text-slate-700 dark:text-slate-200">{item.quantity} {item.unit}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Expected Value:</span>
                                  <p className="font-bold text-slate-700 dark:text-slate-200">₹{item.expectedPrice.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between gap-2">
                              <div className="text-[9px] text-slate-400">
                                <span className="block">Offered by:</span>
                                <span className="font-bold text-slate-600 dark:text-slate-300">{item.seller}</span>
                              </div>
                              <button 
                                onClick={() => handleSendRequest(item)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold"
                              >
                                Procure Resource
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* =====================================================
                    GENERAL VIEW: TRANSACTIONS TIMELINE & LOGS
                   ===================================================== */}
                {currentView === 'transactions' && (
                  <div className="space-y-6 animate-fade-in text-xs">
                    <div>
                      <h2 className="text-xl font-black">Procurement & Settlement Logs</h2>
                      <p className="text-xs text-slate-400">Continuous audit ledger of circular waste commercial settlements</p>
                    </div>

                    <div className="space-y-4">
                      {transactions.map((tx: any) => (
                        <div key={tx.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-slate-400 uppercase">{tx.id}</span>
                              <span className="text-slate-400 font-semibold">{tx.date}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize ${tx.status === 'completed' ? 'bg-green-50 text-green-700' : tx.status === 'accepted' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                              Status: {tx.status}
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                              <span className="text-slate-400">Transacting Seller</span>
                              <p className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{tx.seller}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Procurement Buyer</span>
                              <p className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{tx.buyer}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Material Commodity</span>
                              <p className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{tx.item} ({tx.quantity})</p>
                            </div>
                          </div>

                          {/* Interactive Transaction Timeline */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-2">
                              <span>1. COMMITTED</span>
                              <span>2. COMPLIANCE CHECK</span>
                              <span>3. ROUTE SCHEDULED</span>
                              <span>4. DISPATCHED</span>
                            </div>
                            <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full bg-green-500 transition-all ${tx.status === 'completed' ? 'w-full' : tx.status === 'accepted' ? 'w-2/3' : 'w-1/3'}`} />
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <span className="font-black text-sm text-slate-800 dark:text-slate-100">Settled Value: {tx.price}</span>
                            <button onClick={() => triggerNotification('Invoice download initialized!', 'success')} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg font-bold flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> Download invoice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* =====================================================
                    ROLE: BUYER / RECYCLER / ADMIN OVERVIEW FALLBACKS
                   ===================================================== */}
                {(role === 'buyer' || role === 'recycler') && currentView === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Processed volume</span>
                        <p className="text-xl font-black">240.5 Tons</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Procurement Savings</span>
                        <p className="text-xl font-black text-green-600">₹1,84,000</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Matched Suppliers</span>
                        <p className="text-xl font-black text-blue-600">8 Units</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Clearance compliance</span>
                        <p className="text-xl font-black text-emerald-500">100% Green</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
                      <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Recycle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h3 className="font-extrabold text-sm">Industrial Sourcing & Clearance System</h3>
                        <p className="text-xs text-slate-400">Search high-grade fly ash, polymer flakes, or chemical solvents inside the general market grid below.</p>
                      </div>
                      <button onClick={() => setCurrentView('marketplace')} className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-xs">
                        Open Resource Marketplace
                      </button>
                    </div>
                  </div>
                )}

                {role === 'admin' && currentView === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
                        <span>Total Users</span>
                        <p className="text-xl font-black mt-1">452 Nodes</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
                        <span>Registered Companies</span>
                        <p className="text-xl font-black mt-1">118 Industries</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
                        <span>Total Listed Value</span>
                        <p className="text-xl font-black mt-1 text-green-600">₹14.8 Cr</p>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
                        <span>System Transactions</span>
                        <p className="text-xl font-black mt-1 text-blue-600">1,842 trades</p>
                      </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 space-y-3.5">
                      <h3 className="font-extrabold text-xs uppercase text-slate-400 font-mono">Recent National Circular Event Streams</h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between">
                          <span>Verified fly ash density matrix (Kutch Power plant)</span>
                          <span className="text-[10px] font-mono text-slate-400">12 mins ago</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between">
                          <span>Cleared plat catalyst logistics channel Ankleshwar GIDC</span>
                          <span className="text-[10px] font-mono text-slate-400">35 mins ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    GENERAL SHELL: PROFILE CONFIGURATION PAGE
                   ===================================================== */}
                {currentView === 'profile' && (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 animate-fade-in text-xs font-bold">
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-lg">
                        {regCompany.name.slice(0, 2) || 'CI'}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold">{regCompany.name || 'Core Industries Ltd'}</h3>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">{regCompany.industry}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-slate-400">Company Email</span>
                        <input type="text" readOnly value={regCompany.email || 'info@company.com'} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Registered Phone</span>
                        <input type="text" readOnly value={regCompany.phone || '+91 98765 43210'} className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400">GIS Shipping Base</span>
                      <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">{regCompany.address} ({regCompany.lat.toFixed(4)}, {regCompany.lng.toFixed(4)})</p>
                    </div>

                    <button onClick={() => triggerNotification('Profile parameters saved!', 'success')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl">
                      Update Profile Info
                    </button>
                  </div>
                )}

                {/* =====================================================
                    GENERAL SHELL: SETTINGS CONFIGURATION PAGE
                   ===================================================== */}
                {currentView === 'settings' && (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 animate-fade-in text-xs font-bold">
                    <h3 className="text-base font-extrabold">System Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold">Dark mode visual interface</p>
                          <p className="text-[10px] text-slate-400">Toggle dark styling</p>
                        </div>
                        <button 
                          onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                          className="px-4 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px]"
                        >
                          {theme.toUpperCase()}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                          <p className="font-bold">WhatsApp/SMS Match Notifications</p>
                          <p className="text-[10px] text-slate-400">Notify upon new nearby buyer match</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded text-green-600" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-red-100">
                      <button onClick={() => triggerNotification('Circular node deactivated.', 'warning')} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl">
                        Deactivate Corporate Node
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
