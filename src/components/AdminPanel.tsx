import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Package, FileText, Building2, AlertCircle, 
  BarChart3, Settings, LogOut, Search, Bell, User, Menu, X, Edit, 
  Trash2, Filter, MapPin, Calendar, Clock, Phone, Mail, CheckCircle,
  TrendingUp, Activity, AlertTriangle, Plus, Download, Upload, MessageSquare, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type AdminScreen = 'dashboard' | 'donors' | 'inventory' | 'requests' | 'hospitals' | 'emergencyNews' | 'reports' | 'settings' | 'notifications' | 'profile' | 'communication';

interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  location: string;
  bloodGroup: string;
  unitsNeeded: number;
  dateTime: string;
  status: 'active' | 'resolved' | 'pending';
  priority: 'critical' | 'high' | 'medium';
}

interface AdminDonor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  lastDonation: string;
  totalDonations: number;
  status: 'active' | 'inactive' | 'suspended';
  location: string;
}

interface BloodInventory {
  bloodGroup: string;
  unitsAvailable: number;
  unitsReserved: number;
  status: 'critical' | 'low' | 'good' | 'optimal';
  lastUpdated: string;
}

interface AdminRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  requestDate: string;
  urgency: 'critical' | 'high' | 'medium';
  status: 'pending' | 'fulfilled' | 'cancelled';
  contactPhone: string;
}

interface AdminHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  currentStock: number;
  status: 'active' | 'inactive';
  verified: boolean;
}

interface AdminPanelProps {
  onLogout: () => void;
}

interface AdminNotification {
  id: string;
  type: 'emergency' | 'donor' | 'inventory' | 'request' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionScreen?: AdminScreen;
}

interface AdminCommunicationPost {
  id: string;
  author: string;
  organization: string;
  organizationType: 'blood-bank' | 'hospital';
  title: string;
  content: string;
  category: 'inventory-update' | 'urgent-need' | 'surplus' | 'general';
  bloodGroup?: string;
  unitsAvailable?: number;
  unitsNeeded?: number;
  timestamp: string;
  likes: number;
  replies: number;
  liked: boolean;
  priority: 'normal' | 'high' | 'critical';
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeScreen, setActiveScreen] = useState<AdminScreen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    donorRegistration: true,
    lowInventory: true,
    newRequests: true,
    systemUpdates: true
  });

  // Mock Data
  const emergencyAlerts: EmergencyAlert[] = [
    {
      id: '1',
      title: 'Urgent O- Blood Required in Mumbai',
      description: 'Critical accident case requires immediate O- blood donation. Patient in critical condition at Lilavati Hospital.',
      location: 'Mumbai, Maharashtra',
      bloodGroup: 'O-',
      unitsNeeded: 4,
      dateTime: '2025-03-31 14:30',
      status: 'active',
      priority: 'critical'
    },
    {
      id: '2',
      title: 'A+ Blood Needed for Surgery',
      description: 'Scheduled surgery requires A+ blood units. Patient awaiting operation at Sahyadri Hospital.',
      location: 'Pune, Maharashtra',
      bloodGroup: 'A+',
      unitsNeeded: 2,
      dateTime: '2025-03-31 10:15',
      status: 'active',
      priority: 'high'
    },
    {
      id: '3',
      title: 'B+ Blood Required for Thalassemia Patient',
      description: 'Regular transfusion needed for thalassemia patient. Immediate requirement at Ruby Hall Clinic.',
      location: 'Pune, Maharashtra',
      bloodGroup: 'B+',
      unitsNeeded: 3,
      dateTime: '2025-03-31 08:00',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '4',
      title: 'AB- Blood Emergency in Nagpur',
      description: 'Rare blood group needed urgently for emergency surgery. Contact GMCH immediately.',
      location: 'Nagpur, Maharashtra',
      bloodGroup: 'AB-',
      unitsNeeded: 2,
      dateTime: '2025-03-30 22:45',
      status: 'active',
      priority: 'critical'
    }
  ];

  // Emergency images for alerts
  const emergencyImages = [
    'https://images.unsplash.com/photo-1771946309002-80d0d41affa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwbWVkaWNhbCUyMGVtZXJnZW5jeXxlbnwxfHx8fDE3NzQ5NDY4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1721114989769-0423619f03d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGVtZXJnZW5jeSUyMGNhcmUlMjBwYXRpZW50fGVufDF8fHx8MTc3NDk0Njg3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1551601651-05a4836d25c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3VyZ2VyeSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzc0OTQ2ODc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1605714007165-c15eac9c647b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwdm9sdW50ZWVyJTIwaGVscGluZ3xlbnwxfHx8fDE3NzQ5NDY4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const donors: AdminDonor[] = [
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 98765 43210', bloodGroup: 'O+', lastDonation: '2025-02-15', totalDonations: 12, status: 'active', location: 'Pune' },
    { id: '2', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43211', bloodGroup: 'A+', lastDonation: '2025-03-10', totalDonations: 8, status: 'active', location: 'Mumbai' },
    { id: '3', name: 'Amit Patel', email: 'amit@email.com', phone: '+91 98765 43212', bloodGroup: 'B+', lastDonation: '2025-01-20', totalDonations: 15, status: 'active', location: 'Pune' },
    { id: '4', name: 'Sneha Desai', email: 'sneha@email.com', phone: '+91 98765 43213', bloodGroup: 'O-', lastDonation: '2025-03-05', totalDonations: 6, status: 'active', location: 'Mumbai' }
  ];

  const inventory: BloodInventory[] = [
    { bloodGroup: 'O+', unitsAvailable: 45, unitsReserved: 8, status: 'good', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'O-', unitsAvailable: 8, unitsReserved: 3, status: 'critical', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'A+', unitsAvailable: 32, unitsReserved: 5, status: 'good', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'A-', unitsAvailable: 12, unitsReserved: 2, status: 'low', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'B+', unitsAvailable: 28, unitsReserved: 4, status: 'good', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'B-', unitsAvailable: 15, unitsReserved: 1, status: 'low', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'AB+', unitsAvailable: 18, unitsReserved: 2, status: 'good', lastUpdated: '2025-03-31 09:00' },
    { bloodGroup: 'AB-', unitsAvailable: 6, unitsReserved: 1, status: 'critical', lastUpdated: '2025-03-31 09:00' }
  ];

  const requests: AdminRequest[] = [
    { id: '1', patientName: 'Arjun Mehta', bloodGroup: 'O+', unitsNeeded: 2, hospital: 'Ruby Hall Clinic', requestDate: '2025-03-31', urgency: 'high', status: 'pending', contactPhone: '+91 98765 11111' },
    { id: '2', patientName: 'Kavita Singh', bloodGroup: 'A-', unitsNeeded: 3, hospital: 'Sahyadri Hospital', requestDate: '2025-03-31', urgency: 'critical', status: 'pending', contactPhone: '+91 98765 22222' },
    { id: '3', patientName: 'Ramesh Gupta', bloodGroup: 'B+', unitsNeeded: 1, hospital: 'Deenanath Mangeshkar', requestDate: '2025-03-30', urgency: 'medium', status: 'fulfilled', contactPhone: '+91 98765 33333' }
  ];

  const hospitals: AdminHospital[] = [
    { id: '1', name: 'Ruby Hall Clinic', address: 'Grant Road, Pune', phone: '+91 20 2611 1111', email: 'contact@rubyhall.com', capacity: 150, currentStock: 120, status: 'active', verified: true },
    { id: '2', name: 'Sahyadri Hospital', address: 'Nagar Road, Pune', phone: '+91 20 6792 2222', email: 'info@sahyadrihospitals.com', capacity: 200, currentStock: 180, status: 'active', verified: true },
    { id: '3', name: 'KEM Hospital', address: 'Rasta Peth, Pune', phone: '+91 20 2612 3333', email: 'kem@hospital.com', capacity: 180, currentStock: 90, status: 'active', verified: true }
  ];

  // Mock Notifications
  const notifications: AdminNotification[] = [
    { id: '1', type: 'emergency', title: 'Critical Emergency Alert', message: 'Urgent O- blood required in Mumbai - Lilavati Hospital. Patient in critical condition.', timestamp: '5 mins ago', read: false, actionText: 'View Alert', actionScreen: 'emergencyNews' },
    { id: '2', type: 'inventory', title: 'Low Inventory Warning', message: 'AB- blood units critically low. Only 6 units remaining in stock.', timestamp: '15 mins ago', read: false, actionText: 'Check Inventory', actionScreen: 'inventory' },
    { id: '3', type: 'request', title: 'New Blood Request', message: 'Kavita Singh requested 3 units of A- blood at Sahyadri Hospital - Critical priority.', timestamp: '1 hour ago', read: false, actionText: 'View Request', actionScreen: 'requests' },
    { id: '4', type: 'donor', title: 'New Donor Registration', message: 'Priya Sharma (A+) has registered as a new donor from Mumbai.', timestamp: '2 hours ago', read: true, actionText: 'View Donor', actionScreen: 'donors' },
    { id: '5', type: 'inventory', title: 'Low Inventory Warning', message: 'O- blood units at critical level. Only 8 units remaining.', timestamp: '3 hours ago', read: true, actionText: 'Check Inventory', actionScreen: 'inventory' },
    { id: '6', type: 'request', title: 'Request Fulfilled', message: 'Blood request for Ramesh Gupta has been successfully fulfilled.', timestamp: '5 hours ago', read: true, actionText: 'View Request', actionScreen: 'requests' },
    { id: '7', type: 'system', title: 'System Update', message: 'BloodConnect Admin system has been updated to version 1.0.0.', timestamp: '1 day ago', read: true },
    { id: '8', type: 'donor', title: 'Donor Milestone', message: 'Amit Patel completed his 15th blood donation. Send congratulations!', timestamp: '1 day ago', read: true, actionText: 'View Donor', actionScreen: 'donors' }
  ];

  // Filter notifications based on settings
  const filteredNotifications = notifications.filter(notif => {
    if (notif.type === 'emergency' && !notificationSettings.emergencyAlerts) return false;
    if (notif.type === 'donor' && !notificationSettings.donorRegistration) return false;
    if (notif.type === 'inventory' && !notificationSettings.lowInventory) return false;
    if (notif.type === 'request' && !notificationSettings.newRequests) return false;
    if (notif.type === 'system' && !notificationSettings.systemUpdates) return false;
    return true;
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  // Admin Profile Data
  const adminProfile = {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@rubyhall.com',
    phone: '+91 20 2611 1234',
    organization: 'Ruby Hall Clinic Blood Bank',
    organizationType: 'blood-bank' as const,
    location: 'Pune, Maharashtra',
    designation: 'Blood Bank Manager',
    joinedDate: 'January 2020',
    verified: true,
    totalInventoryManaged: 2500,
    successfulRequests: 450,
    emergenciesHandled: 85
  };

  // Admin Communication Posts
  const [communicationPosts, setCommunicationPosts] = useState<AdminCommunicationPost[]>([
    {
      id: '1',
      author: 'Dr. Anjali Mehta',
      organization: 'Lilavati Hospital Blood Bank',
      organizationType: 'hospital',
      title: 'Urgent: O- Blood Critical Shortage',
      content: 'We are facing critical shortage of O- blood units. Only 5 units remaining. Multiple surgeries scheduled for tomorrow. Any blood banks in Mumbai area that can help?',
      category: 'urgent-need',
      bloodGroup: 'O-',
      unitsNeeded: 15,
      timestamp: '30 mins ago',
      likes: 8,
      replies: 5,
      liked: false,
      priority: 'critical'
    },
    {
      id: '2',
      author: 'Suresh Patil',
      organization: 'Pune City Blood Bank',
      organizationType: 'blood-bank',
      title: 'Surplus A+ and B+ Available',
      content: 'We have surplus inventory of A+ (25 units) and B+ (20 units) blood available. Valid for next 2 weeks. Nearby hospitals can coordinate for pickup.',
      category: 'surplus',
      bloodGroup: 'A+, B+',
      unitsAvailable: 45,
      timestamp: '2 hours ago',
      likes: 12,
      replies: 3,
      liked: true,
      priority: 'normal'
    },
    {
      id: '3',
      author: 'Dr. Priya Sharma',
      organization: 'Sahyadri Hospital',
      organizationType: 'hospital',
      title: 'AB- Required for Thalassemia Camp',
      content: 'Planning a thalassemia blood transfusion camp next week. Need approximately 8-10 units of AB- blood. Can any blood banks in Pune help with this requirement?',
      category: 'inventory-update',
      bloodGroup: 'AB-',
      unitsNeeded: 10,
      timestamp: '5 hours ago',
      likes: 6,
      replies: 2,
      liked: false,
      priority: 'high'
    },
    {
      id: '4',
      author: 'Manoj Deshmukh',
      organization: 'Mumbai Central Blood Center',
      organizationType: 'blood-bank',
      title: 'Monthly Inventory Report - March',
      content: 'Sharing our March inventory summary. Total collections: 450 units. High demand for O+ and A+ this month. Recommend coordinated donation drives.',
      category: 'general',
      timestamp: '1 day ago',
      likes: 15,
      replies: 7,
      liked: false,
      priority: 'normal'
    },
    {
      id: '5',
      author: 'Dr. Kavita Singh',
      organization: 'KEM Hospital Blood Bank',
      organizationType: 'hospital',
      title: 'Emergency Stock Coordination',
      content: 'Setting up emergency blood stock coordination for upcoming festival season. Looking for partner blood banks to join the network for rapid response.',
      category: 'general',
      timestamp: '2 days ago',
      likes: 20,
      replies: 10,
      liked: true,
      priority: 'normal'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 text-red-700 border border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'resolved': return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'fulfilled': return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      case 'critical': return 'bg-red-50 text-red-700 border border-red-200';
      case 'low': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'good': return 'bg-green-50 text-green-700 border border-green-200';
      case 'optimal': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'donors', icon: Users, label: 'Donor Management' },
    { id: 'inventory', icon: Package, label: 'Blood Inventory' },
    { id: 'requests', icon: FileText, label: 'Requests Management' },
    { id: 'hospitals', icon: Building2, label: 'Hospitals / Blood Banks' },
    { id: 'emergencyNews', icon: AlertCircle, label: 'Emergency News' },
    { id: 'communication', icon: MessageSquare, label: 'Admin Communication' },
    { id: 'reports', icon: BarChart3, label: 'Reports & Analytics' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const filteredAlerts = locationFilter === 'all' 
    ? emergencyAlerts 
    : emergencyAlerts.filter(alert => alert.location.toLowerCase().includes(locationFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 rounded-full p-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">BloodConnect Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search donors, requests, alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setActiveScreen('notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      setActiveScreen('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id as AdminScreen);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <div className="p-6">
          {/* Dashboard View */}
          {activeScreen === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Donors</p>
                        <p className="text-3xl font-bold text-gray-900">1,247</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">+12% this month</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Available Blood Units</p>
                        <p className="text-3xl font-bold text-gray-900">164</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">+8% this week</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-gray-900">23</p>
                        <p className="text-xs text-orange-600 font-semibold mt-1">5 critical</p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Active Emergency Alerts</p>
                        <p className="text-3xl font-bold text-gray-900">4</p>
                        <p className="text-xs text-red-600 font-semibold mt-1">2 critical</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Alerts Preview */}
              <Card className="border-l-4 border-l-red-500 bg-white">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Latest Emergency Alerts
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveScreen('emergencyNews')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emergencyAlerts.filter(a => a.status === 'active').slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Badge className={getPriorityColor(alert.priority) + ' text-xs'}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 truncate">{alert.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{alert.location}</span>
                              <span>•</span>
                              <span className="font-semibold text-red-600">{alert.bloodGroup}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity & Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'New donor registered', user: 'Priya Sharma', time: '5 mins ago', type: 'success' },
                        { action: 'Blood request fulfilled', user: 'Ruby Hall Clinic', time: '15 mins ago', type: 'success' },
                        { action: 'Emergency alert created', user: 'Sahyadri Hospital', time: '1 hour ago', type: 'alert' },
                        { action: 'Inventory updated', user: 'KEM Hospital', time: '2 hours ago', type: 'info' }
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'success' ? 'bg-green-500' : 
                            activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                      Blood Group Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {inventory.map((item) => (
                        <div key={item.bloodGroup}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-800">{item.bloodGroup}</span>
                            <span className="text-gray-600">{item.unitsAvailable} units</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.status === 'critical' ? 'bg-red-500' :
                                item.status === 'low' ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.unitsAvailable / 50) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Emergency News View */}
          {activeScreen === 'emergencyNews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Emergency Blood Alerts</h2>
              </div>

              {/* Filters */}
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Filter by Location:</span>
                    </div>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Locations</option>
                      <option value="pune">Pune</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="nagpur">Nagpur</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Alerts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAlerts.map((alert, index) => (
                  <Card key={alert.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {/* Alert Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={emergencyImages[index % emergencyImages.length]} 
                        alt={alert.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <Badge className={getPriorityColor(alert.priority) + ' backdrop-blur-sm'}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status) + ' backdrop-blur-sm'}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span>{alert.dateTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="font-semibold text-red-600">Blood Group: {alert.bloodGroup}</div>
                          <div className="text-gray-600">• {alert.unitsNeeded} units</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Donor Management View */}
          {activeScreen === 'donors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Donor Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Donor
                  </Button>
                </div>
              </div>

              <Card className="bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Name</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Blood Group</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Contact</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Location</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Last Donation</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Total Donations</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Status</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {donors.map((donor) => (
                          <tr key={donor.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="p-3 text-sm font-medium text-gray-900">{donor.name}</td>
                            <td className="p-3 text-sm">
                              <Badge className="bg-red-50 text-red-700 border border-red-200">{donor.bloodGroup}</Badge>
                            </td>
                            <td className="p-3 text-sm text-gray-800">
                              <div className="font-medium text-gray-900">{donor.phone}</div>
                              <div className="text-xs text-gray-600">{donor.email}</div>
                            </td>
                            <td className="p-3 text-sm text-gray-800">{donor.location}</td>
                            <td className="p-3 text-sm text-gray-800">{donor.lastDonation}</td>
                            <td className="p-3 text-sm font-semibold text-gray-900">{donor.totalDonations}</td>
                            <td className="p-3 text-sm">
                              <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Blood Inventory View */}
          {activeScreen === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Blood Inventory</h2>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Update Inventory
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <Card key={item.bloodGroup} className="border-l-4 border-l-red-500 bg-white shadow-sm">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-red-600 mb-2">{item.bloodGroup}</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{item.unitsAvailable}</div>
                        <div className="text-sm text-gray-600 font-medium mb-3">units available</div>
                        <Badge className={getStatusColor(item.status) + ' mb-3'}>
                          {item.status.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-gray-600 font-medium mt-2">
                          Reserved: {item.unitsReserved} units
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Updated: {item.lastUpdated}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Requests Management View */}
          {activeScreen === 'requests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Requests Management</h2>
                <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export Requests
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {requests.map((request) => (
                  <Card key={request.id} className="bg-white shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <h3 className="font-semibold text-lg text-gray-900">{request.patientName}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-red-50 text-red-700 border border-red-200 text-lg">{request.bloodGroup}</Badge>
                            <Badge className={getPriorityColor(request.urgency)}>{request.urgency}</Badge>
                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-[200px]">
                          <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-800">{request.hospital}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-800">{request.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-800">{request.requestDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">{request.unitsNeeded}</div>
                          <div className="text-sm text-gray-600 font-medium">units needed</div>
                        </div>

                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <Button className="bg-green-500 hover:bg-green-600 text-white">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Fulfill
                            </Button>
                          )}
                          <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hospitals View */}
          {activeScreen === 'hospitals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Hospitals / Blood Banks</h2>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map((hospital) => (
                  <Card key={hospital.id} className="bg-white shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-gray-900">{hospital.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(hospital.status)}>{hospital.status}</Badge>
                          {hospital.verified && (
                            <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm text-gray-800">
                          <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                          <span className="font-medium">{hospital.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{hospital.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{hospital.email}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600 font-medium">Stock Capacity</span>
                            <span className="text-sm font-semibold text-gray-900">{hospital.currentStock} / {hospital.capacity}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(hospital.currentStock / hospital.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" className="flex-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reports & Analytics View */}
          {activeScreen === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Donation Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Monthly donation trends chart</p>
                      <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Blood Group Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Blood inventory pie chart</p>
                      <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      Donor Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Age and location demographics</p>
                      <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Emergency Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Average response time analysis</p>
                      <p className="text-xs text-gray-400 mt-2">Coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeScreen === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm text-gray-600">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>System Name</span>
                        <span className="font-medium">BloodConnect Admin</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Version</span>
                        <span className="font-medium">v1.0.0</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>Last Updated</span>
                        <span className="font-medium">Mar 31, 2025</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between py-2 cursor-pointer">
                        <span className="text-sm text-gray-700">Emergency Alerts</span>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.emergencyAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emergencyAlerts: e.target.checked})}
                          className="rounded" 
                        />
                      </label>
                      <label className="flex items-center justify-between py-2 cursor-pointer">
                        <span className="text-sm text-gray-700">New Donor Registration</span>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.donorRegistration}
                          onChange={(e) => setNotificationSettings({...notificationSettings, donorRegistration: e.target.checked})}
                          className="rounded" 
                        />
                      </label>
                      <label className="flex items-center justify-between py-2 cursor-pointer">
                        <span className="text-sm text-gray-700">Low Inventory Warnings</span>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.lowInventory}
                          onChange={(e) => setNotificationSettings({...notificationSettings, lowInventory: e.target.checked})}
                          className="rounded" 
                        />
                      </label>
                      <label className="flex items-center justify-between py-2 cursor-pointer">
                        <span className="text-sm text-gray-700">New Requests</span>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.newRequests}
                          onChange={(e) => setNotificationSettings({...notificationSettings, newRequests: e.target.checked})}
                          className="rounded" 
                        />
                      </label>
                      <label className="flex items-center justify-between py-2 cursor-pointer">
                        <span className="text-sm text-gray-700">System Updates</span>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.systemUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemUpdates: e.target.checked})}
                          className="rounded" 
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Configure system-wide settings and preferences.</p>
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Notifications View */}
          {activeScreen === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No notifications to show</p>
                      <p className="text-sm text-gray-400 mt-2">Check your notification settings to enable alerts</p>
                      <Button 
                        onClick={() => setActiveScreen('settings')}  
                        variant="outline"
                        className="mt-4"
                      >
                        Go to Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notif) => {
                    const getNotificationIcon = () => {
                      switch (notif.type) {
                        case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-500" />;
                        case 'inventory': return <Package className="h-5 w-5 text-orange-500" />;
                        case 'request': return <FileText className="h-5 w-5 text-blue-500" />;
                        case 'donor': return <Users className="h-5 w-5 text-green-500" />;
                        case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
                        default: return <Bell className="h-5 w-5 text-gray-500" />;
                      }
                    };

                    const getNotificationBg = () => {
                      if (!notif.read) return 'bg-blue-50 border-blue-200';
                      return 'bg-white';
                    };

                    return (
                      <Card key={notif.id} className={`${getNotificationBg()} hover:shadow-md transition-shadow`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${
                              notif.type === 'emergency' ? 'bg-red-100' :
                              notif.type === 'inventory' ? 'bg-orange-100' :
                              notif.type === 'request' ? 'bg-blue-100' :
                              notif.type === 'donor' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {getNotificationIcon()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-base">{notif.title}</h3>
                                {!notif.read && (
                                  <Badge className="bg-blue-500 text-white border-0 flex-shrink-0">New</Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{notif.message}</p>
                              
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-xs text-gray-500">{notif.timestamp}</span>
                                
                                {notif.actionText && notif.actionScreen && (
                                  <Button 
                                    onClick={() => setActiveScreen(notif.actionScreen!)}
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    {notif.actionText}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Profile View */}
          {activeScreen === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{adminProfile.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{adminProfile.designation}</p>
                      <Badge className="bg-green-500 text-white border-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Admin
                      </Badge>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{adminProfile.organization}</p>
                          <p className="text-xs text-gray-500 capitalize">{adminProfile.organizationType.replace('-', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-700">{adminProfile.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-700">{adminProfile.phone}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-700">{adminProfile.location}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Joined</p>
                          <p className="text-gray-700">{adminProfile.joinedDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Performance Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-red-500" />
                        Performance Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-700">{adminProfile.totalInventoryManaged}</p>
                          <p className="text-sm text-blue-600">Units Managed</p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-700">{adminProfile.successfulRequests}</p>
                          <p className="text-sm text-green-600">Successful Requests</p>
                        </div>
                        
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-red-700">{adminProfile.emergenciesHandled}</p>
                          <p className="text-sm text-red-600">Emergencies Handled</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-red-500" />
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add extra security to your account</p>
                        </div>
                        <Button size="sm" variant="outline">Enable</Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-800">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-800">Change Password</p>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                        <Button size="sm" variant="outline">Change</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-red-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { action: 'Updated blood inventory', time: '10 minutes ago', icon: Package },
                          { action: 'Approved blood request #4521', time: '1 hour ago', icon: CheckCircle },
                          { action: 'Created emergency alert', time: '3 hours ago', icon: AlertCircle },
                          { action: 'Verified new donor registration', time: '5 hours ago', icon: Users }
                        ].map((activity, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                            <activity.icon className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Admin Communication View */}
          {activeScreen === 'communication' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Admin Communication Hub</h2>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>

              {/* Filter Tabs */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="border-red-500 text-red-600">All Posts</Button>
                    <Button variant="outline">Urgent Needs</Button>
                    <Button variant="outline">Surplus</Button>
                    <Button variant="outline">Inventory Updates</Button>
                    <Button variant="outline">General</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Posts */}
              <div className="space-y-4">
                {communicationPosts.map((post) => (
                  <Card key={post.id} className={`${
                    post.priority === 'critical' ? 'border-l-4 border-l-red-500' :
                    post.priority === 'high' ? 'border-l-4 border-l-orange-500' :
                    'border-l-4 border-l-gray-300'
                  }`}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Post Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                  {post.organizationType === 'blood-bank' ? 'Blood Bank' : 'Hospital'}
                                </Badge>
                                {post.priority === 'critical' && (
                                  <Badge className="bg-red-500 text-white border-0">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Critical
                                  </Badge>
                                )}
                                {post.priority === 'high' && (
                                  <Badge className="bg-orange-500 text-white border-0">High Priority</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{post.organization}</p>
                              <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
                            </div>
                          </div>
                          
                          <Badge className={`${
                            post.category === 'urgent-need' ? 'bg-red-100 text-red-700 border-red-300' :
                            post.category === 'surplus' ? 'bg-green-100 text-green-700 border-green-300' :
                            post.category === 'inventory-update' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          }`}>
                            {post.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                        </div>

                        {/* Post Title */}
                        <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>

                        {/* Blood Group Info */}
                        {post.bloodGroup && (
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                              <Package className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">Blood Group: {post.bloodGroup}</span>
                            </div>
                            {post.unitsNeeded && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-700">Need: {post.unitsNeeded} units</span>
                              </div>
                            )}
                            {post.unitsAvailable && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Available: {post.unitsAvailable} units</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Post Content */}
                        <p className="text-gray-700 leading-relaxed">{post.content}</p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                          <button 
                            className={`flex items-center gap-2 text-sm transition-colors ${
                              post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                            onClick={() => {
                              setCommunicationPosts(prev => prev.map(p => 
                                p.id === post.id 
                                  ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                                  : p
                              ));
                            }}
                          >
                            <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          
                          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageSquare className="h-5 w-5" />
                            <span className="font-medium">{post.replies}</span>
                          </button>

                          <Button size="sm" className="ml-auto bg-red-500 hover:bg-red-600 text-white">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Communication Stats (This Month)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-600">42</p>
                      <p className="text-sm text-gray-600">Total Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600">18</p>
                      <p className="text-sm text-gray-600">Urgent Requests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">35</p>
                      <p className="text-sm text-gray-600">Successful Connections</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">Units Coordinated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}