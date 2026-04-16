import React, { useState, useEffect, createContext, useContext } from 'react';
import { Heart, Home, Users, Award, MapPin, ArrowRight, Phone, Navigation, Shield, Clock, UserCheck, Mail, Lock, Eye, EyeOff, Globe, Check, AlertTriangle, Zap, Bell, Moon, Sun, Calendar, TrendingUp, MessageCircle, Star, ExternalLink, Gift, Volume2, VolumeX } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ChatBot } from './components/ChatBot';
import { AdminPanel } from './components/AdminPanel';

type Screen = 'landing' | 'splash' | 'language' | 'login' | 'userType' | 'home' | 'donate' | 
              'donateForm' | 'healthReport' | 'selectBloodBank' | 'bloodBankConfirmation' | 'donateSuccess' |
              'request' | 'requestForm' | 'requestResults' | 'awareness' | 'bloodbanks' | 'profile' | 'emergency' | 'emergencyForm' | 'emergencyActive' | 
              'notifications' | 'appointment' | 'appointmentSuccess' | 'gamification' | 'community' | 'healthDashboard' | 'achievements' | 'challenges' | 'rewards' | 
              'adminLogin' | 'admin' | 'adminDonors' | 'adminInventory' | 'adminRequests' | 'adminHospitals' | 'adminEmergencyNews' | 'adminReports' | 'adminSettings';

interface DonorData {
  name: string;
  age: string;
  bloodGroup: string;
  phone: string;
  address: string;
}

interface RequestData {
  patientName: string;
  bloodGroup: string;
  urgency: string;
  hospital: string;
  contactPhone: string;
  unitsNeeded: string;
}

interface HealthData {
  hemoglobin: string;
  bloodPressure: string;
  bloodSugar: string;
}

interface BloodBank {
  name: string;
  address: string;
  phone: string;
  distance: string;
  googleMapsQuery: string;
  timings: string;
  inventory: {
    [key: string]: {
      available: number;
      status: 'critical' | 'low' | 'good';
    };
  };
}

interface EmergencyRequest {
  patientName: string;
  bloodGroup: string;
  hospital: string;
  contactPhone: string;
  unitsNeeded: string;
  location: string;
  emergencyType: 'accident' | 'surgery' | 'medical' | 'other';
}

interface Notification {
  id: string;
  type: 'emergency' | 'reminder' | 'achievement' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionScreen?: Screen;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  type: 'donation' | 'health-checkup';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'donation' | 'community' | 'health' | 'milestone';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  icon: string;
  reward: string;
  progress: number;
  maxProgress: number;
  endDate: string;
  active: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  authorType: 'donor' | 'receiver' | 'medical';
  title: string;
  content: string;
  category: 'success-story' | 'question' | 'tip' | 'announcement';
  timestamp: string;
  likes: number;
  replies: number;
  liked: boolean;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'health' | 'shopping' | 'exclusive' | 'partner';
  image: string;
  icon: string;
  available: boolean;
  redeemed: boolean;
  partnerName?: string;
  validUntil?: string;
  termsUrl?: string;
}

interface HealthMetrics {
  date: string;
  hemoglobin: number;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  weight: number;
  eligibilityScore: number;
}

// Admin Panel Interfaces
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

// Language Context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// 🔊 TEXT TO SPEECH FUNCTION (moved to component for state access)

const startListening = async () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  // Request microphone permission first
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission is granted
  } catch (error) {
    alert("Microphone access denied. Please allow microphone access to use voice commands.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN"; // Indian English
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("Listening...");
    alert("Listening... Please speak now!");
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("User said:", transcript);
    alert(`You said: "${transcript}"`);

    // Example Voice Commands
    if (transcript.includes("register")) {
      setCurrentScreen("register");
    }

    if (transcript.includes("find donor")) {
      setCurrentScreen("findDonor");
    }

    if (transcript.includes("home")) {
      setCurrentScreen("home");
    }
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error", event.error);
    if (event.error === "not-allowed") {
      alert("Microphone access denied. Please allow microphone access in your browser settings to use voice commands.");
    } else if (event.error === "no-speech") {
      alert("No speech detected. Please try again.");
    } else {
      alert(`Speech recognition error: ${event.error}`);
    }
  };

  recognition.start();
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Landing & App Name
    appName: 'BloodConnect',
    tagline: 'Connecting lives, one donation at a time',
    
    // Language Selection
    selectLanguage: 'Select Your Language',
    choosePreferredLanguage: 'Choose your preferred language to continue',
    continue: 'Continue',
    
    // Login
    welcomeBack: 'Welcome Back',
    signInToContinue: 'Sign in to continue saving lives',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    orContinueWithEmail: 'Or continue with email',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    
    // User Type Selection
    howToHelp: 'How would you like to help?',
    chooseRole: 'Choose your role in our community',
    wantToDonate: 'I want to Donate Blood',
    needBlood: 'I need Blood',
    
    // Home
    helloLifesaver: 'Hello, Lifesaver! 👋',
    readyToMakeDifference: 'Ready to make a difference today?',
    remember: 'Remember',
    oneDonationThreeLives: '1 donation = 3 lives saved',
    donateBlood: 'Donate Blood',
    saveLivesToday: 'Save lives today',
    requestBlood: 'Request Blood',
    findDonorsNearby: 'Find donors nearby',
    bloodBanks: 'Blood Banks',
    findNearbyCenters: 'Find nearby centers',
    awareness: 'Awareness',
    learnAndInspire: 'Learn & inspire',
    
    // Navigation
    home: 'Home',
    stories: 'Stories',
    banks: 'Banks',
    profile: 'Profile',
    
    // Profile
    myProfile: 'My Profile',
    language: 'Language',
    changeLanguage: 'Change Language',
    
    // Common
    back: 'Back',
    next: 'Next',
    save: 'Save',
    cancel: 'Cancel',
    settings: 'Settings',
    
    // Emergency
    emergency: 'Emergency',
    emergencySOS: 'LifePulse SOS – Instant Blood Connect',
    emergencyBloodNeeded: 'Emergency Blood Needed!',
    sendEmergencyAlert: 'Send Emergency Alert',
    emergencyActive: 'Emergency Alert Active',
    notifyAllDonors: 'Notify All Donors',
    urgentHelp: 'Urgent Help Needed',
    
    // Notifications
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all read',
    
    // Dark Mode
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemTheme: 'System Theme',
    
    // Appointment
    scheduleAppointment: 'Schedule Appointment',
    appointmentBooked: 'Appointment Booked!',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    selectLocation: 'Select Location',
    appointmentConfirmed: 'Your appointment has been confirmed',
    
    // Gamification
    dailyCheckIn: 'Daily Check-in',
    streak: 'Streak',
    achievements: 'Achievements',
    challenges: 'Challenges',
    checkInReward: 'Check-in Reward',
    communityPoints: 'Community Points',
    yourImpact: 'Your Impact',
    
    // Community
    community: 'Community',
    successStories: 'Success Stories',
    askQuestion: 'Ask Question',
    shareExperience: 'Share Experience',
    joinDiscussion: 'Join Discussion',
    
    // Health Dashboard
    healthDashboard: 'Health Dashboard',
    healthTrends: 'Health Trends',
    eligibilityTracker: 'Eligibility Tracker',
    recoveryProgress: 'Recovery Progress',
    
    // Stories
    readMore: 'Read More',
    viewFullStory: 'View Full Story & Source',
    storyVerification: 'For verification and complete story'
  },
  hi: {
    // Landing & App Name
    appName: 'ब्लडकनेक्ट',
    tagline: 'एक दान से जुड़ी जिंदगियां',
    
    // Language Selection
    selectLanguage: '���पनी भाषा चुनें',
    choosePreferredLanguage: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
    continue: 'जारी रखें',
    
    // Login
    welcomeBack: 'वापस स्वागत है',
    signInToContinue: 'जीवन बचाना जारी रखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    continueWithGoogle: 'Google के साथ जारी रखें',
    continueWithApple: 'Apple के साथ जारी रखें',
    orContinueWithEmail: 'या ईमेल के साथ जारी रखें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    
    // User Type Selection
    howToHelp: 'आप कैसे मदद करना चाहते हैं?',
    chooseRole: 'हमारे समुदाय में अपनी भूमिका चुनें',
    wantToDonate: 'मैं रक्तदान करना चाहता हूं',
    needBlood: 'मुझे रक्त की जरूरत है',
    
    // Home
    helloLifesaver: 'नमस्ते, जीवनदाता! 👋',
    readyToMakeDifference: 'आज बदलाव लाने के लिए तैयार हैं?',
    remember: 'याद रखें',
    oneDonationThreeLives: '1 दान = 3 जिंदगियां बचीं',
    donateBlood: 'रक्तदान करें',
    saveLivesToday: 'आज जीवन बचाएं',
    requestBlood: 'रक्त की मांग करें',
    findDonorsNearby: 'पास के दाताओं को खोजें',
    bloodBanks: 'रक्त बैंक',
    findNearbyCenters: 'पास के केंद्र खोजें',
    awareness: 'जागरूकता',
    learnAndInspire: 'सीखें और प्रेरणा लें',
    
    // Navigation
    home: 'घर',
    stories: 'कहानियां',
    banks: 'बैंक',
    profile: 'प्रोफ़ाइल',
    
    // Profile
    myProfile: 'मेरी प्रोफ़ाइल',
    language: 'भाषा',
    changeLanguage: 'भाषा बदलें',
    
    // Common
    back: 'वापस',
    next: 'अगला',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    settings: 'सेटिंग्स',
    
    // Emergency
    emergency: 'आपातकाल',
    emergencySOS: 'लाइफपल्स SOS – तत्काल रक्त कनेक्शन',
    emergencyBloodNeeded: 'आपातकालीन रक्त की आवश्यकता!',
    sendEmergencyAlert: 'आपातकालीन अलर्ट भेजें',
    emergencyActive: 'आपातकालीन अलर्ट सक्रिय',
    notifyAllDonors: 'सभी दाताओं को सूचित करें',
    urgentHelp: 'तत्काल सहायता चाहिए',
    
    // Notifications
    notifications: 'सूचनाएं',
    noNotifications: 'कोई सूचना नहीं',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    
    // Dark Mode
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    systemTheme: 'सिस्टम थीम',
    
    // Appointment
    scheduleAppointment: 'अपॉइंटमेंट शेड्यूल करें',
    appointmentBooked: 'अपॉइंटमेंट बुक हो गया!',
    selectDate: 'तारीख चुनें',
    selectTime: 'समय चुनें',
    selectLocation: 'स्थान चुनें',
    appointmentConfirmed: 'आपका अपॉइंटमेंट कन्फर्म हो गया है',
    
    // Gamification
    dailyCheckIn: 'दैनिक चेक-इन',
    streak: 'सिलसिला',
    achievements: 'उपलब्धियां',
    challenges: 'चुनौतियां',
    checkInReward: 'चेक-इन इनाम',
    communityPoints: 'सामुदायिक अंक',
    yourImpact: 'आपका प्रभाव',
    
    // Community
    community: 'समुदाय',
    successStories: 'सफलता की कहानियां',
    askQuestion: 'प्रश्न पूछें',
    shareExperience: 'अनुभव साझा करें',
    joinDiscussion: 'चर्चा में शामिल हों',
    
    // Health Dashboard
    healthDashboard: 'स्वास्थ्य डैशबोर्ड',
    healthTrends: 'स्वास्थ्य रुझान',
    eligibilityTracker: 'योग्यता ट्रैकर',
    recoveryProgress: 'रिकवरी प्रगति',

    // Stories
    readMore: 'और पढ़ें',
    viewFullStory: 'पूरी कहानी और स्रोत देखें',
    storyVerification: 'सत्यापन और पूरी कहानी के लिए'
  },
  mr: {
    // Landing & App Name
    appName: 'ब्लडकनेक��ट',
    tagline: 'एक दानाने जोडलेल्या जीवना',
    
    // Language Selection
    selectLanguage: 'तुमची भाषा निवडा',
    choosePreferredLanguage: 'पुढे जाण्यासाठी तुमची आवडती भाषा निवडा',
    continue: 'पुढे चला',
    
    // Login
    welcomeBack: 'पुन्हा स्वागत',
    signInToContinue: 'जीव वाचवणे सुरू ठेवण्यासाठी साइन इन करा',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    continueWithGoogle: 'Google सह पुढे चला',
    continueWithApple: 'Apple सह पुढे चला',
    orContinueWithEmail: 'किंवा ईमेलसह प��ढे चला',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड विसरलात?',
    
    // User Type Selection
    howToHelp: 'तुम्ही कशी मदत करू इच्छिता?',
    chooseRole: 'आमच्या समुदायातील तुमची भूमिका निवडा',
    wantToDonate: 'मला रक्तदान करायचे आहे',
    needBlood: 'मला रक्ताची गरज आहे',
    
    // Home
    helloLifesaver: 'नमस्कार, जीवनदाता! 👋',
    readyToMakeDifference: 'आज बदल घडवण्यास तयार आहात?',
    remember: 'लक्षात ठेवा',
    oneDonationThreeLives: '१ दान = ३ जीव वाचले',
    donateBlood: 'रक्तदान करा',
    saveLivesToday: 'आज जीव वाचवा',
    requestBlood: 'रक्ताची विनंती करा',
    findDonorsNearby: 'जवळचे दाते शोधा',
    bloodBanks: 'रक्त बँक',
    findNearbyCenters: 'जवळची केंद्रे शोधा',
    awareness: 'जागरूकता',
    learnAndInspire: 'शिका आणि प्रेरणा घ्या',
    
    // Navigation
    home: 'घर',
    stories: 'कथा',
    banks: 'बँक',
    profile: 'प्रोफाइल',
    
    // Profile
    myProfile: 'माझे प्रोफाइल',
    language: 'भाषा',
    changeLanguage: 'भाषा बदला',
    
    // Common
    back: 'मागे',
    next: 'पुढे',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    settings: 'सेटिंग्स',
    
    // Emergency
    emergency: 'आणीबाणी',
    emergencySOS: 'लाइफपल्स SOS – तात्काळ रक्त कनेक्शन',
    emergencyBloodNeeded: 'आणीबाणी रक्ताची गरज!',
    sendEmergencyAlert: 'आणीबाणी सूचना पाठवा',
    emergencyActive: 'आणीबाणी सूचना सक्रिय',
    notifyAllDonors: 'सर्व रक्तदात्यांना कळवा',
    urgentHelp: 'तातडीची मदत हवी',
    
    // Notifications
    notifications: 'सूचना',
    noNotifications: 'कोणत्या सूचना नाहीत',
    markAllRead: 'सर्व वाचले म्हणून चिन्हांकि करा',
    
    // Dark Mode
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    systemTheme: 'सिस्टम थीम',
    
    // Appointment
    scheduleAppointment: 'भेटीचे वेळापत्रक करा',
    appointmentBooked: 'भेटीचे वेळ निश्चित झाले!',
    selectDate: 'तारीख निवडा',
    selectTime: 'वेळ निवडा',
    selectLocation: 'ठिकाण निवडा',
    appointmentConfirmed: 'तुमची भेट निश्चित झाली आहे',
    
    // Gamification
    dailyCheckIn: 'दैनिक चेक-इन',
    streak: 'सातत्य',
    achievements: 'कामयाब्या',
    challenges: 'आव्हाने',
    checkInReward: 'चेक-इन बक्षीस',
    communityPoints: 'समुदायिक गुण',
    yourImpact: 'तुमचा प्रभाव',
    
    // Community
    community: 'समुदाय',
    successStories: 'यशाच्या गोष्टी',
    askQuestion: 'प्रश्न विचारा',
    shareExperience: 'अनुभव सामायिक करा',
    joinDiscussion: 'चर्चेत सामील व्हा',
    
    // Health Dashboard
    healthDashboard: 'आरोग्य डैशबोर्ड',
    healthTrends: 'आरोग्य ट्रेंड',
    eligibilityTracker: 'पात्रता ट्रॅकर',
    recoveryProgress: 'बरे होण्याची प्रगती',

    // Stories
    readMore: 'अधिक वाचा',
    viewFullStory: 'संपूर्ण कथा आणि स्रोत पहा',
    storyVerification: 'पडताळणी आणि संपूर्ण कथेसाठी'
  }
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userType, setUserType] = useState<'donor' | 'receiver' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [donorData, setDonorData] = useState<DonorData>({
    name: '', age: '', bloodGroup: '', phone: '', address: ''
  });
  const [requestData, setRequestData] = useState<RequestData>({
    patientName: '', bloodGroup: '', urgency: '', hospital: '', contactPhone: '', unitsNeeded: ''
  });
  const [emergencyData, setEmergencyData] = useState<EmergencyRequest>({
    patientName: '', bloodGroup: '', hospital: '', contactPhone: '', unitsNeeded: '', location: '', emergencyType: 'accident'
  });
  const [healthData, setHealthData] = useState<HealthData>({
    hemoglobin: '14.2', bloodPressure: '120/80', bloodSugar: '95'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [selectedBloodBank, setSelectedBloodBank] = useState<BloodBank | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Donation Reminder',
      message: "It's been 3 months since your last donation. You're eligible to donate again!",
      timestamp: '2 hours ago',
      read: false,
      actionText: 'Schedule Donation',
      actionScreen: 'donate'
    },
    {
      id: '2',
      type: 'emergency',
      title: 'Emergency Request Nearby',
      message: 'O+ blood urgently needed at Ruby Hall Clinic - 1.2 km away',
      timestamp: '5 hours ago',
      read: false,
      actionText: 'Help Now',
      actionScreen: 'emergency'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Milestone Reached!',
      message: 'Congratulations! You have saved 15 lives with your donations.',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  // Gamification State
  const [dailyCheckInStreak, setDailyCheckInStreak] = useState(7);
  const [communityPoints, setCommunityPoints] = useState(1250);
  const [lastCheckIn, setLastCheckIn] = useState('2025-01-15');
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Step Hero',
      description: 'Completed your first blood donation',
      icon: '🩸',
      category: 'donation',
      unlocked: true,
      unlockedDate: '2024-10-15',
      progress: 1,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'Consistent Saver',
      description: 'Maintain a 7-day check-in streak',
      icon: '🔥',
      category: 'milestone',
      unlocked: true,
      unlockedDate: '2025-01-15',
      progress: 7,
      maxProgress: 7
    },
    {
      id: '3',
      title: 'Community Champion',
      description: 'Earn 1000 community points',
      icon: '🏆',
      category: 'community',
      unlocked: true,
      unlockedDate: '2025-01-10',
      progress: 1250,
      maxProgress: 1000
    },
    {
      id: '4',
      title: 'Silver Donor',
      description: 'Complete 5 blood donations',
      icon: '🥈',
      category: 'donation',
      unlocked: true,
      unlockedDate: '2024-12-20',
      progress: 5,
      maxProgress: 5
    },
    {
      id: '5',
      title: 'Golden Lifesaver',
      description: 'Complete 10 blood donations',
      icon: '🥇',
      category: 'donation',
      unlocked: false,
      progress: 5,
      maxProgress: 10
    },
    {
      id: '6',
      title: 'Health Guardian',
      description: 'Complete 30 health check-ins',
      icon: '❤️',
      category: 'health',
      unlocked: false,
      progress: 22,
      maxProgress: 30
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'January Hero Challenge',
      description: 'Complete 2 donations this month',
      type: 'monthly',
      icon: '🎯',
      reward: '500 points + Special Badge',
      progress: 1,
      maxProgress: 2,
      endDate: '2025-01-31',
      active: true
    },
    {
      id: '2',
      title: 'Weekly Check-in Champion',
      description: 'Check in every day this week',
      type: 'weekly',
      icon: '📅',
      reward: '100 points',
      progress: 6,
      maxProgress: 7,
      endDate: '2025-01-19',
      active: true
    },
    {
      id: '3',
      title: 'Community Connector',
      description: 'Help 3 people in the community forum',
      type: 'weekly',
      icon: '🤝',
      reward: '200 points',
      progress: 1,
      maxProgress: 3,
      endDate: '2025-01-19',
      active: true
    }
  ]);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Dr. Sarah Johnson',
      authorType: 'medical',
      title: 'Tips for First-Time Donors',
      content: 'Donating blood for the first time? Here are some essential tips to make your experience smooth and comfortable...',
      category: 'tip',
      timestamp: '2 hours ago',
      likes: 24,
      replies: 8,
      liked: false
    },
    {
      id: '2',
      author: 'Rahul Sharma',
      authorType: 'donor',
      title: 'My Journey: From Fear to Hero',
      content: 'I used to be terrified of needles, but becoming a blood donor changed my life. Here\'s my story...',
      category: 'success-story',
      timestamp: '5 hours ago',
      likes: 43,
      replies: 15,
      liked: true
    },
    {
      id: '3',
      author: 'Priya Patel',
      authorType: 'receiver',
      title: 'Thank You to All Donors',
      content: 'My daughter received life-saving blood transfusions last month. I want to thank every single donor...',
      category: 'success-story',
      timestamp: '1 day ago',
      likes: 67,
      replies: 22,
      liked: true
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics[]>([
    { date: '2025-01-15', hemoglobin: 14.2, bloodPressure: { systolic: 120, diastolic: 80 }, heartRate: 72, weight: 68, eligibilityScore: 95 },
    { date: '2025-01-10', hemoglobin: 14.0, bloodPressure: { systolic: 118, diastolic: 78 }, heartRate: 74, weight: 68.2, eligibilityScore: 92 },
    { date: '2025-01-05', hemoglobin: 13.8, bloodPressure: { systolic: 122, diastolic: 82 }, heartRate: 76, weight: 68.5, eligibilityScore: 88 },
    { date: '2024-12-30', hemoglobin: 13.5, bloodPressure: { systolic: 125, diastolic: 85 }, heartRate: 78, weight: 69, eligibilityScore: 85 }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Free Health Check-up',
      description: 'Complete health screening including blood tests, vitals check, and consultation with healthcare professional',
      pointsCost: 500,
      category: 'health',
      image: "https://images.unsplash.com/photo-1619708034522-7d1ddb943599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwa2l0JTIwaGVhbHRoJTIwY2hlY2t1cHxlbnwxfHx8fDE3NTY4OTUzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '🏥',
      available: true,
      redeemed: false,
      partnerName: 'Ruby Hall Clinic',
      validUntil: '2025-12-31',
      termsUrl: '#'
    },
    {
      id: '2',
      title: '20% Discount Voucher',
      description: 'Get 20% off on medicines, health supplements, and wellness products at partner pharmacies',
      pointsCost: 300,
      category: 'shopping',
      image: "https://images.unsplash.com/photo-1594968973184-9040a5a79963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHZvdWNoZXIlMjBzaG9wcGluZyUyMGNvdXBvbnxlbnwxfHx8fDE3NTY4OTU0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '💰',
      available: true,
      redeemed: false,
      partnerName: 'Apollo Pharmacy',
      validUntil: '2025-06-30',
      termsUrl: '#'
    },
    {
      id: '3',
      title: 'Free Blood Bag Voucher',
      description: 'Emergency blood bag voucher for you or your family members during medical emergencies',
      pointsCost: 1000,
      category: 'exclusive',
      image: "https://images.unsplash.com/photo-1602398120050-8a1d12d9cbce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwY2VydGlmaWNhdGUlMjBiYWRnZXxlbnwxfHx8fDE3NTY4OTU0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '🩸',
      available: true,
      redeemed: false,
      partnerName: 'BloodConnect Network',
      validUntil: '2026-01-15',
      termsUrl: '#'
    },
    {
      id: '4',
      title: 'Restaurant Dining Voucher',
      description: 'Enjoy a complimentary meal for two at selected partner restaurants as a thank you for your donation',
      pointsCost: 400,
      category: 'partner',
      image: "https://images.unsplash.com/photo-1509024102370-fd7802f4a7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwaGVhbHRoY2FyZSUyMHJld2FyZHN8ZW58MXx8fHwxNzU2ODk1Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '🍽️',
      available: true,
      redeemed: false,
      partnerName: 'Local Restaurant Partners',
      validUntil: '2025-03-31',
      termsUrl: '#'
    },
    {
      id: '5',
      title: 'Exclusive BloodConnect Merchandise',
      description: 'Limited edition t-shirt, water bottle, and certificate recognizing your contribution to saving lives',
      pointsCost: 200,
      category: 'exclusive',
      image: "https://images.unsplash.com/photo-1509024102370-fd7802f4a7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwaGVhbHRoY2FyZSUyMHJld2FyZHN8ZW58MXx8fHwxNzU2ODk1Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '🎁',
      available: true,
      redeemed: true,
      partnerName: 'BloodConnect',
      validUntil: 'No expiry',
      termsUrl: '#'
    },
    {
      id: '6',
      title: 'Gym Membership Discount',
      description: 'Get 3 months of discounted gym membership to stay fit and healthy for future donations',
      pointsCost: 800,
      category: 'health',
      image: "https://images.unsplash.com/photo-1619708034522-7d1ddb943599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwa2l0JTIwaGVhbHRoJTIwY2hlY2t1cHxlbnwxfHx8fDE3NTY4OTUzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: '💪',
      available: false,
      redeemed: false,
      partnerName: 'Fitness First',
      validUntil: '2025-08-31',
      termsUrl: '#'
    }
  ]);

  // Splash screen timer
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Landing page auto-transition timer
  useEffect(() => {
    if (currentScreen === 'landing') {
      const timer = setTimeout(() => setCurrentScreen('language'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Translation function
  const t = (key: string): string => {
    return translations[selectedLanguage as keyof typeof translations]?.[key as keyof typeof translations['en']] || 
           translations['en'][key as keyof typeof translations['en']] || 
           key;
  };

  const languageContextValue: LanguageContextType = {
    language: selectedLanguage,
    setLanguage: setSelectedLanguage,
    t
  };

  // Text-to-Speech toggle function
  const toggleTextToSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech not supported in this browser.");
      return;
    }

    // If currently speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Otherwise, start speaking
    const pageText = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(pageText);

    // Accessibility settings
    utterance.rate = 1;     // Speed (0.5 - 2)
    utterance.pitch = 1;    // Voice tone
    utterance.volume = 1;   // Volume (0 - 1)

    // Event listeners to track speech state
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Mock data
  const donorStats = {
    totalDonations: 5,
    livesSaved: 15,
    badge: 'Silver',
    lastDonation: '3 months ago'
  };

  const availableDonors = [
    { name: 'John Doe', bloodGroup: 'O+', distance: '2.3 km', phone: '+1234567890', available: true },
    { name: 'Sarah Smith', bloodGroup: 'O+', distance: '3.1 km', phone: '+1234567891', available: true },
    { name: 'Mike Johnson', bloodGroup: 'O+', distance: '4.5 km', phone: '+1234567892', available: false },
  ];

  const bloodBanks: BloodBank[] = [
    { 
      name: 'Sassoon General Hospital Blood Bank', 
      address: 'Near Pune Railway Station, Ganj Peth, Pune, Maharashtra 411001', 
      phone: '+91 20 2612 1071', 
      distance: '1.2 km',
      googleMapsQuery: 'Sassoon General Hospital Blood Bank Pune Maharashtra',
      timings: 'Open 24/7 • Emergency donations accepted anytime',
      inventory: {
        'A+': { available: 15, status: 'good' },
        'A-': { available: 3, status: 'low' },
        'B+': { available: 8, status: 'good' },
        'B-': { available: 1, status: 'critical' },
        'AB+': { available: 5, status: 'good' },
        'AB-': { available: 2, status: 'low' },
        'O+': { available: 12, status: 'good' },
        'O-': { available: 1, status: 'critical' }
      }
    },
    { 
      name: 'Ruby Hall Clinic Blood Bank', 
      address: '40, Sassoon Road, Near Race Course, Pune, Maharashtra 411001', 
      phone: '+91 20 2612 1088', 
      distance: '2.8 km',
      googleMapsQuery: 'Ruby Hall Clinic Blood Bank Sassoon Road Pune Maharashtra',
      timings: 'Mon-Sun: 8:00 AM - 8:00 PM • Emergency: 24/7',
      inventory: {
        'A+': { available: 20, status: 'good' },
        'A-': { available: 6, status: 'good' },
        'B+': { available: 4, status: 'low' },
        'B-': { available: 3, status: 'low' },
        'AB+': { available: 8, status: 'good' },
        'AB-': { available: 1, status: 'critical' },
        'O+': { available: 18, status: 'good' },
        'O-': { available: 4, status: 'low' }
      }
    },
    { 
      name: 'KEM Hospital Blood Bank', 
      address: 'Rasta Peth, Pune, Maharashtra 411011', 
      phone: '+91 20 2612 5174', 
      distance: '3.5 km',
      googleMapsQuery: 'KEM Hospital Blood Bank Rasta Peth Pune Maharashtra',
      timings: 'Mon-Fri: 9:00 AM - 5:00 PM • Sat: 9:00 AM - 1:00 PM',
      inventory: {
        'A+': { available: 10, status: 'good' },
        'A-': { available: 2, status: 'low' },
        'B+': { available: 6, status: 'good' },
        'B-': { available: 0, status: 'critical' },
        'AB+': { available: 3, status: 'low' },
        'AB-': { available: 1, status: 'critical' },
        'O+': { available: 8, status: 'good' },
        'O-': { available: 2, status: 'low' }
      }
    },
    { 
      name: 'Sahyadri Hospital Blood Bank', 
      address: '30-C, Erandwane, Near Karve Statue, Pune, Maharashtra 411004', 
      phone: '+91 20 6701 1000', 
      distance: '4.2 km',
      googleMapsQuery: 'Sahyadri Hospital Blood Bank Erandwane Pune Maharashtra',
      timings: 'Daily: 7:00 AM - 10:00 PM • Walk-ins welcome',
      inventory: {
        'A+': { available: 22, status: 'good' },
        'A-': { available: 8, status: 'good' },
        'B+': { available: 12, status: 'good' },
        'B-': { available: 4, status: 'low' },
        'AB+': { available: 6, status: 'good' },
        'AB-': { available: 2, status: 'low' },
        'O+': { available: 25, status: 'good' },
        'O-': { available: 6, status: 'good' }
      }
    },
    { 
      name: 'Pune Municipal Corporation Blood Bank', 
      address: 'Naidu Hospital Campus, Central Avenue Road, Pune, Maharashtra 411001', 
      phone: '+91 20 2634 5677', 
      distance: '2.1 km',
      googleMapsQuery: 'PMC Blood Bank Naidu Hospital Pune Maharashtra',
      timings: 'Mon-Sat: 10:00 AM - 6:00 PM • Closed Sundays',
      inventory: {
        'A+': { available: 7, status: 'good' },
        'A-': { available: 1, status: 'critical' },
        'B+': { available: 5, status: 'good' },
        'B-': { available: 2, status: 'low' },
        'AB+': { available: 4, status: 'low' },
        'AB-': { available: 0, status: 'critical' },
        'O+': { available: 9, status: 'good' },
        'O-': { available: 3, status: 'low' }
      }
    },
    { 
      name: 'Bharati Vidyapeeth Medical College Blood Bank', 
      address: 'Dhankawadi, Pune, Maharashtra 411043', 
      phone: '+91 20 2437 2181', 
      distance: '5.6 km',
      googleMapsQuery: 'Bharati Vidyapeeth Medical College Blood Bank Dhankawadi Pune',
      timings: 'Mon-Fri: 8:00 AM - 6:00 PM • Sat: 8:00 AM - 2:00 PM',
      inventory: {
        'A+': { available: 16, status: 'good' },
        'A-': { available: 4, status: 'low' },
        'B+': { available: 11, status: 'good' },
        'B-': { available: 3, status: 'low' },
        'AB+': { available: 7, status: 'good' },
        'AB-': { available: 3, status: 'low' },
        'O+': { available: 14, status: 'good' },
        'O-': { available: 5, status: 'good' }
      }
    }
  ];

  const stories = [
    {
      title: "Six Friends, Thousands of Lives Saved",
      content: "In Kurnool, India, six childhood friends made a pact that would save thousands of lives. What started as a simple decision to donate blood together has grown into a community movement. Over the years, these friends have organized blood donation camps, educated their community about the importance of giving blood, and directly contributed to saving thousands of lives through their tireless efforts and dedication.",
      impact: "The six friends helped save over 3,000 lives through their initiatives",
      image: "https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZyaWVuZHMlMjBoZWxwaW5nJTIwY29tbXVuaXR5JTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NTY4OTQ1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ageNow: "Community blood donation leaders",
      quote: "Friendship isn't just about being there for each other - it's about being there for everyone who needs help.",
      sourceUrl: "https://www.newindianexpress.com/good-news/2024/Mar/03/blood-donation-six-kurnool-friends-leave-lasting-imprint-as-life-savers"
    },
    {
      title: "Henry's 29-Gallon Legacy",
      content: "Henry Bickoff has given something truly extraordinary - nearly 29 gallons of his blood over decades of regular donations. This incredible New York resident has made blood donation a central part of his life, understanding that his regular contributions help ensure that hospitals have the blood supply they need for emergencies, surgeries, and treatments. His dedication represents the very best of human generosity.",
      impact: "Henry donated nearly 29 gallons of blood over several decades",
      image: "https://images.unsplash.com/photo-1620128329124-0d65cfa83141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwYmxvb2QlMjBkb25vcnxlbnwxfHx8fDE3NTY4OTQ1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ageNow: "Lifelong blood donor",
      quote: "Giving blood is one of the easiest ways to help save lives. It's a small inconvenience that can make a huge difference.",
      sourceUrl: "https://nypost.com/2024/06/08/long-islander-donated-nearly-29-gallons-of-blood-since-1975"
    },
    {
      title: "Against All Odds: A Champion's Determination",
      content: "Despite being physically disabled with one leg, this inspiring blood donation champion refuses to let challenges stop him from helping others. His unwavering determination to continue donating blood, despite his own physical limitations, serves as a powerful reminder that the spirit of giving knows no boundaries. His story has inspired countless others to become donors and shows that everyone can contribute to saving lives.",
      impact: "Over 50 successful blood donations despite physical challenges",
      image: "https://images.unsplash.com/photo-1551723376-45a0739bd029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBkaXNhYmlsaXR5JTIwb3ZlcmNvbWluZyUyMGNoYWxsZW5nZXN8ZW58MXx8fHwxNzU2ODk0NTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ageNow: "Disability rights advocate and donor",
      quote: "My disability doesn't define what I can give to others. If I can save lives, I will.",
      sourceUrl: "https://timesofindia.indiatimes.com/city/surat/against-all-odds-one-legged-man-becomes-blood-donation-champion/articleshow/121835851.cms"
    },
    {
      title: "A Mother's Gratitude Story",
      content: "When Maria's newborn needed an emergency blood transfusion just hours after birth, she had no idea how many anonymous heroes would come together to save her baby's life. The medical team at UCLA Health worked tirelessly, and thanks to the blood donors whose generous gifts were readily available, her child survived and thrived. Today, Maria volunteers to share her story and encourage others to become donors, knowing firsthand how blood donation saves lives every day.",
      impact: "Emergency transfusion saved newborn's life in critical first hours",
      image: "https://images.unsplash.com/photo-1701557773660-287ecb565006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3RoZXIlMjBjaGlsZCUyMGhvc3BpdGFsJTIwZ3JhdGl0dWRlfGVufDF8fHx8MTc1Njg5NDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ageNow: "Grateful mother and donor advocate",
      quote: "I will never forget the strangers who saved my baby. Their gift gave my child a future.",
      sourceUrl: "https://www.uclahealth.org/programs/gotblood/about-us/lives-you-save-patient-stories"
    }
  ];

  // Function to get badge color based on badge type
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Bronze':
        return 'bg-orange-500';
      case 'Silver':
        return 'bg-gray-400';
      case 'Gold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Function to open Google Maps with blood bank location
  const openGoogleMaps = (googleMapsQuery: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}`;
    window.open(mapsUrl, '_blank');
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  // Emergency SOS functionality
  const sendEmergencyAlert = () => {
    // In a real app, this would send notifications to all nearby donors
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'emergency',
      title: 'Emergency Alert Sent',
      message: `Emergency request for ${emergencyData.bloodGroup} blood has been sent to all nearby donors.`,
      timestamp: 'Just now',
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setCurrentScreen('emergencyActive');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInventoryColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'low': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'good': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getInventoryIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🚨';
      case 'low': return '⚠️';
      case 'good': return '✅';
      default: return '❓';
    }
  };

  // Gamification functions
  const performDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (lastCheckIn === today) {
      return; // Already checked in today
    }
    
    let newStreak = dailyCheckInStreak;
    if (lastCheckIn === yesterday) {
      newStreak += 1; // Continue streak
    } else {
      newStreak = 1; // Reset streak
    }
    
    setDailyCheckInStreak(newStreak);
    setLastCheckIn(today);
    setCommunityPoints(prev => prev + 10 + (newStreak * 2)); // Bonus for streak
    
    // Add check-in notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'achievement',
      title: 'Daily Check-in Complete!',
      message: `Earned ${10 + (newStreak * 2)} points! Current streak: ${newStreak} days`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Check for streak achievements
    if (newStreak === 30 && !achievements.find(a => a.id === 'streak30')?.unlocked) {
      const streakAchievement: Achievement = {
        id: 'streak30',
        title: 'Dedication Master',
        description: 'Maintain a 30-day check-in streak',
        icon: '🔥',
        category: 'milestone',
        unlocked: true,
        unlockedDate: today,
        progress: 30,
        maxProgress: 30
      };
      setAchievements(prev => [...prev, streakAchievement]);
    }
  };

  const canCheckInToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return lastCheckIn !== today;
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      {currentScreen === 'landing' && (
        <div className="h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="bg-white rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl mb-2">{t('appName')}</h1>
            <p className="text-red-100">{t('tagline')}</p>
          </div>
        </div>
      )}

      {currentScreen === 'language' && (
        <div className="h-screen bg-gray-50 p-6 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="bg-red-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl mb-2">{t('selectLanguage')}</h1>
            <p className="text-gray-600">{t('choosePreferredLanguage')}</p>
          </div>
          
          <div className="space-y-3 mb-8">
            {languages.map((lang) => (
              <Card 
                key={lang.code}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLanguage === lang.code ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">{lang.nativeName}</h3>
                    <p className="text-gray-600 text-sm">{lang.name}</p>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="bg-red-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
            onClick={() => setCurrentScreen('login')}
          >
            {t('continue')}
          </Button>
        </div>
      )}

      {currentScreen === 'splash' && (
        <div className="h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="bg-white rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl mb-2">{t('appName')}</h1>
            <p className="text-red-100">{t('tagline')}</p>
          </div>
        </div>
      )}

      {currentScreen === 'login' && (
        <div className="h-screen bg-white p-6 flex flex-col">
          {/* Header */}
          <div className="text-center mt-12 mb-8">
            <div className="bg-red-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl mb-2">{t('welcomeBack')}</h1>
            <p className="text-gray-600">{t('signInToContinue')}</p>
          </div>

          {/* Auth Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">{t('signIn')}</TabsTrigger>
                <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full py-6 rounded-xl border-gray-300 text-gray-700"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    <ImageWithFallback 
                      src="https://developers.google.com/identity/images/g-logo.png" 
                      alt="Google" 
                      className="w-5 h-5 mr-3" 
                    />
                    {t('continueWithGoogle')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-6 rounded-xl border-gray-300 text-gray-700"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {t('continueWithApple')}
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t('orContinueWithEmail')}</span>
                  </div>
                </div>

                {/* Email/Password Login */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="Enter your email"
                        className="pl-10 py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 py-3 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="text-red-500 text-sm">{t('forgotPassword')}</button>
                  </div>

                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl mt-6"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    {t('signIn')}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                {/* Social Signup Buttons */}
                <div className="space-y-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full py-6 rounded-xl border-gray-300 text-gray-700"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    <ImageWithFallback 
                      src="https://developers.google.com/identity/images/g-logo.png" 
                      alt="Google" 
                      className="w-5 h-5 mr-3" 
                    />
                    Sign up with Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-6 rounded-xl border-gray-300 text-gray-700"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    Sign up with Apple
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                  </div>
                </div>

                {/* Email/Password Signup */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupName">Full Name</Label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="signupName"
                        type="text"
                        value={loginData.name}
                        onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                        placeholder="Enter your full name"
                        className="pl-10 py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="signupEmail"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="Enter your email"
                        className="pl-10 py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="Create a password"
                        className="pl-10 pr-10 py-3 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={loginData.confirmPassword}
                        onChange={(e) => setLoginData({...loginData, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        className="pl-10 py-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl mt-6"
                    onClick={() => setCurrentScreen('userType')}
                  >
                    Create Account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <p className="text-center text-gray-500 mt-4 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Admin Access Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentScreen('adminLogin')}
              className="text-red-600 hover:text-red-700 text-sm font-medium underline flex items-center justify-center gap-2 mx-auto"
            >
              <Shield className="h-4 w-4" />
              Admin Panel Access
            </button>
            <p className="text-xs text-gray-400 mt-1">For administrators only</p>
          </div>
        </div>
      )}

      {currentScreen === 'userType' && (
        <div className="h-screen bg-gray-50 p-6 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="bg-red-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl mb-2">{t('howToHelp')}</h1>
            <p className="text-gray-600">{t('chooseRole')}</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-xl"
              onClick={() => {
                setUserType('donor');
                setCurrentScreen('home');
              }}
            >
              <Heart className="h-5 w-5 mr-2" />
              {t('wantToDonate')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-xl"
              onClick={() => {
                setUserType('receiver');
                setCurrentScreen('home');
              }}
            >
              <Users className="h-5 w-5 mr-2" />
              {t('needBlood')}
            </Button>
          </div>
          
          <p className="text-center text-gray-500 mt-8 text-sm">
            You can always change this later in your profile
          </p>
        </div>
      )}

      {/* Admin Login Screen */}
      {currentScreen === 'adminLogin' && (
        <div className="h-screen bg-gradient-to-br from-red-50 to-white p-6 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Back Button */}
            <button 
              onClick={() => setCurrentScreen('login')} 
              className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
              Back to Login
            </button>

            {/* Admin Icon */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-5 mb-4 mx-auto w-20 h-20 flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Access the BloodConnect Admin Panel</p>
            </div>

            {/* Admin Login Form */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="text-gray-700 font-medium">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@bloodconnect.com"
                      className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-12 text-base font-semibold shadow-md"
                  onClick={() => setCurrentScreen('admin')}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Sign In to Admin Panel
                </Button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Security Notice</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This area is restricted to authorized administrators only. All access attempts are logged and monitored.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Need help? Contact{' '}
                <span className="text-red-600 font-medium">
                  support@bloodconnect.com
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {(currentScreen === 'home' || currentScreen === 'donate' || currentScreen === 'donateForm' || currentScreen === 'healthReport' || 
        currentScreen === 'selectBloodBank' || currentScreen === 'bloodBankConfirmation' || currentScreen === 'donateSuccess' ||
        currentScreen === 'request' || 
        currentScreen === 'requestForm' || currentScreen === 'requestResults' || currentScreen === 'awareness' || 
        currentScreen === 'bloodbanks' || currentScreen === 'profile' || currentScreen === 'healthDashboard' ||
        currentScreen === 'emergency' || currentScreen === 'emergencyForm' || currentScreen === 'emergencyActive' || 
        currentScreen === 'notifications' || currentScreen === 'appointment' || currentScreen === 'appointmentSuccess' ||
        currentScreen === 'achievements' || currentScreen === 'challenges' || currentScreen === 'community' || currentScreen === 'rewards') && (
        <>
          {currentScreen === 'healthDashboard' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">{t('healthDashboard')}</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                {/* Current Health Status */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-green-700 dark:text-green-300 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Current Health Status
                      </h3>
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Excellent
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl text-green-600 dark:text-green-400">
                          {healthMetrics[0]?.eligibilityScore}%
                        </div>
                        <div className="text-sm text-green-500">Eligibility Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl text-green-600 dark:text-green-400">
                          {healthMetrics[0]?.hemoglobin}
                        </div>
                        <div className="text-sm text-green-500">Hemoglobin g/dL</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Metrics Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</span>
                        <span className="text-green-600 text-xs">Normal</span>
                      </div>
                      <div className="text-lg">
                        {healthMetrics[0]?.bloodPressure.systolic}/{healthMetrics[0]?.bloodPressure.diastolic}
                      </div>
                      <div className="text-xs text-gray-500">mmHg</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</span>
                        <span className="text-green-600 text-xs">Good</span>
                      </div>
                      <div className="text-lg">{healthMetrics[0]?.heartRate}</div>
                      <div className="text-xs text-gray-500">bpm</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Trends Chart */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {t('healthTrends')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Eligibility Score Trend</span>
                          <span className="text-green-600 text-xs">↗ Improving</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Dec</span>
                          <span>Jan</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Hemoglobin Levels</span>
                          <span className="text-green-600 text-xs">↗ Stable</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>13.5</span>
                          <span>14.2</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recovery Progress */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {t('recoveryProgress')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-blue-700 dark:text-blue-300">Time since last donation</span>
                          <span className="text-blue-600 dark:text-blue-400 text-sm">90 days</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          ✅ Ready to donate again
                        </div>
                      </div>
                      
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-green-500 rounded-full p-1 mr-2">
                            <Heart className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-green-700 dark:text-green-300">Recovery Complete</span>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Your body has fully recovered from the last donation. You're eligible to help save lives again!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Recommendations */}
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Health Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Maintain iron-rich diet</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">Include spinach, beans, and lean meats</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Stay hydrated</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">Drink plenty of water before and after donation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-500 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Regular exercise</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">Light cardio helps maintain healthy circulation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => setCurrentScreen('donate')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Schedule Donation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                    onClick={() => {
                      const newMetric: HealthMetrics = {
                        date: new Date().toISOString().split('T')[0],
                        hemoglobin: 14.3,
                        bloodPressure: { systolic: 118, diastolic: 76 },
                        heartRate: 70,
                        weight: 67.8,
                        eligibilityScore: 97
                      };
                      setHealthMetrics(prev => [newMetric, ...prev]);
                      
                      const notification: Notification = {
                        id: Date.now().toString(),
                        type: 'general',
                        title: 'Health Check Completed',
                        message: 'Your health metrics have been updated. Great vitals!',
                        timestamp: 'Just now',
                        read: false
                      };
                      setNotifications(prev => [notification, ...prev]);
                    }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Log Health Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
            <div className="flex justify-around">
              <button
                onClick={() => setCurrentScreen('home')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${currentScreen === 'home' ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">{t('home')}</span>
              </button>
              <button
                onClick={() => setCurrentScreen('awareness')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${currentScreen === 'awareness' ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className="h-5 w-5" />
                <span className="text-xs mt-1">{t('stories')}</span>
              </button>
              <button
                onClick={() => setCurrentScreen('bloodbanks')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${currentScreen === 'bloodbanks' ? 'text-red-500' : 'text-gray-400'}`}
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs mt-1">{t('banks')}</span>
              </button>
              <button
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${currentScreen === 'profile' ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Award className="h-5 w-5" />
                <span className="text-xs mt-1">{t('profile')}</span>
              </button>
            </div>
          </div>

          {currentScreen === 'home' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20 overflow-y-auto">
              <div className="bg-red-500 text-white p-6 rounded-b-3xl relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-xl mb-2">{t('helloLifesaver')}</h1>
                    <p className="text-red-100">{t('readyToMakeDifference')}</p>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('notifications')}
                    className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                </div>
                
                {/* Emergency SOS Button */}
                <button
                  onClick={() => setCurrentScreen('emergency')}
                  className="w-full bg-red-700 hover:bg-red-800 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-3 pulse-animation transition-all transform hover:scale-105 min-h-[56px]"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-lg">{t('emergencySOS')}</span>
                  <Zap className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-6 mb-8">
                {/* Daily Check-in & Gamification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-blue-500 rounded-full p-2 mr-2 shadow-md">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{t('dailyCheckIn')}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">{dailyCheckInStreak} day streak</p>
                        </div>
                      </div>
                      {canCheckInToday() ? (
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-xl min-h-[44px]"
                          onClick={performDailyCheckIn}
                        >
                          Check In (+{10 + (dailyCheckInStreak + 1) * 2} pts)
                        </Button>
                      ) : (
                        <div className="text-green-600 dark:text-green-400 text-xs py-3">✓ Checked in today!</div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 rounded-2xl shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-purple-500 rounded-full p-2 mr-2 shadow-md">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-700 dark:text-purple-300">{t('communityPoints')}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">{communityPoints.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400 text-xs rounded-xl min-h-[44px]"
                        onClick={() => setCurrentScreen('achievements')}
                      >
                        View Rewards
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Challenges Preview */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 rounded-2xl shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-orange-700 dark:text-orange-300 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Active Challenge
                      </h3>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-orange-600 dark:text-orange-400 text-xs min-h-[32px]"
                        onClick={() => setCurrentScreen('challenges')}
                      >
                        View All
                      </Button>
                    </div>
                    {challenges.find(c => c.active) && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-orange-800 dark:text-orange-300">{challenges.find(c => c.active)?.title}</p>
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            {challenges.find(c => c.active)?.progress}/{challenges.find(c => c.active)?.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(challenges.find(c => c.active)?.progress || 0) / (challenges.find(c => c.active)?.maxProgress || 1) * 100} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          🎁 {challenges.find(c => c.active)?.reward}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Motivational Banner */}
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800 rounded-2xl shadow-sm">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-red-600 dark:text-red-400 mb-1">{t('remember')}</h3>
                    <p className="text-red-800 dark:text-red-300">{t('oneDonationThreeLives')}</p>
                  </CardContent>
                </Card>

                {/* Main Actions - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-0"
                    onClick={() => setCurrentScreen('donate')}
                  >
                    <CardContent className="p-5 text-center min-h-[120px] flex flex-col justify-center">
                      <div className="bg-red-500 rounded-2xl p-3 mb-3 mx-auto w-14 h-14 flex items-center justify-center shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 text-sm">{t('donateBlood')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{t('saveLivesToday')}</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-0"
                    onClick={() => setCurrentScreen('request')}
                  >
                    <CardContent className="p-5 text-center min-h-[120px] flex flex-col justify-center">
                      <div className="bg-blue-500 rounded-2xl p-3 mb-3 mx-auto w-14 h-14 flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 text-sm">{t('requestBlood')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{t('findDonorsNearby')}</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-0"
                    onClick={() => setCurrentScreen('bloodbanks')}
                  >
                    <CardContent className="p-5 text-center min-h-[120px] flex flex-col justify-center">
                      <div className="bg-green-500 rounded-2xl p-3 mb-3 mx-auto w-14 h-14 flex items-center justify-center shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 text-sm">{t('bloodBanks')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{t('findNearbyCenters')}</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-0"
                    onClick={() => setCurrentScreen('awareness')}
                  >
                    <CardContent className="p-5 text-center min-h-[120px] flex flex-col justify-center">
                      <div className="bg-purple-500 rounded-2xl p-3 mb-3 mx-auto w-14 h-14 flex items-center justify-center shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 text-sm">{t('awareness')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{t('learnAndInspire')}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Row - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setCurrentScreen('notifications')}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border-0 min-h-[80px] flex flex-col items-center justify-center"
                  >
                    <div className="relative mb-2">
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-2 shadow-sm">
                        <Bell className="h-5 w-5 text-blue-500" />
                      </div>
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Updates</p>
                  </button>
                  
                  <button
                    onClick={() => setCurrentScreen('community')}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border-0 min-h-[80px] flex flex-col items-center justify-center"
                  >
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-2 shadow-sm mb-2">
                      <MessageCircle className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Community</p>
                  </button>
                  
                  <button
                    onClick={() => setCurrentScreen('healthDashboard')}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border-0 min-h-[80px] flex flex-col items-center justify-center"
                  >
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-2 shadow-sm mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Health</p>
                  </button>
                  
                  <button
                    onClick={() => setCurrentScreen('rewards')}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border-0 min-h-[80px] flex flex-col items-center justify-center"
                  >
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-2 shadow-sm mb-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rewards</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'profile' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-purple-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">{t('myProfile')}</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                {/* Enhanced Profile Header */}
                <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <CardContent className="p-6 text-center">
                    <div className={`${getBadgeColor(donorStats.badge)} rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center`}>
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl mb-2">{donorStats.badge} Donor</h2>
                    <div className="flex justify-center space-x-6 mb-4">
                      <div>
                        <div className="text-2xl">{communityPoints.toLocaleString()}</div>
                        <div className="text-purple-100 text-sm">Points</div>
                      </div>
                      <div>
                        <div className="text-2xl">{dailyCheckInStreak}</div>
                        <div className="text-purple-100 text-sm">Day Streak</div>
                      </div>
                      <div>
                        <div className="text-2xl">{achievements.filter(a => a.unlocked).length}</div>
                        <div className="text-purple-100 text-sm">Achievements</div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to Gold Badge</span>
                        <span>{donorStats.totalDonations}/10</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all" 
                          style={{width: `${(donorStats.totalDonations / 10) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      {t('yourImpact')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl text-red-600 dark:text-red-400 mb-1">{donorStats.livesSaved}</div>
                        <div className="text-sm text-red-500">Lives Potentially Saved</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl text-blue-600 dark:text-blue-400 mb-1">{donorStats.totalDonations * 450}</div>
                        <div className="text-sm text-blue-500">mL Total Donated</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Community Rank</span>
                        <span className="text-green-600 dark:text-green-400">#47 in Pune</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Global Impact</span>
                        <span className="text-blue-600 dark:text-blue-400">Top 15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Carbon Footprint Saved</span>
                        <span className="text-green-600 dark:text-green-400">2.3 kg CO₂</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 dark:bg-green-800/30 rounded-full p-2">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Daily check-in completed</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">+12 pts</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-100 dark:bg-yellow-800/30 rounded-full p-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Achievement unlocked: Consistent Saver</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">+100 pts</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 dark:bg-red-800/30 rounded-full p-2">
                          <Heart className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Blood donation completed</p>
                          <p className="text-xs text-gray-500">3 months ago</p>
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-400">+500 pts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <button
                      onClick={() => setCurrentScreen('language')}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                        <div className="text-left">
                          <p className="text-sm">{t('language')}</p>
                          <p className="text-xs text-gray-500">
                            {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        {isDarkMode ? (
                          <Moon className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Sun className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                        )}
                        <div className="text-left">
                          <p className="text-sm">{isDarkMode ? t('darkMode') : t('lightMode')}</p>
                          <p className="text-xs text-gray-500">Tap to toggle theme</p>
                        </div>
                      </div>
                      <div className={`w-10 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="w-full flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                    >
                      <div className="flex items-center">
                        <ArrowRight className="h-5 w-5 mr-3 rotate-180" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Log Out</p>
                          <p className="text-xs text-red-500 dark:text-red-400">Return to login screen</p>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>

                {/* Reminder - Moved higher for better visibility */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="text-blue-600 mb-2">🔔 Reminder</h3>
                    <p className="text-blue-800 text-sm">
                      It's been 3 months since your last donation. You're eligible to donate again!
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3 bg-blue-500 hover:bg-blue-600"
                      onClick={() => setCurrentScreen('donate')}
                    >
                      Schedule Donation
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setCurrentScreen('rewards')}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Rewards
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400"
                    onClick={() => setCurrentScreen('healthDashboard')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Health Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Keep all other existing screens here - they will work with the context */}
          {currentScreen === 'donate' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-red-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Donate Blood</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="bg-red-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl mb-2">Thank You for Choosing to Donate!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Your donation can save up to 3 lives. Choose how you'd like to proceed.</p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4"
                        onClick={() => setCurrentScreen('appointment')}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t('scheduleAppointment')}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 py-4"
                        onClick={() => setCurrentScreen('bloodbanks')}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Walk-in Donation
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-500" />
                      Quick Health Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Age requirement:</span>
                        <span className="text-green-600">18-65 years ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight requirement:</span>
                        <span className="text-green-600">Above 50kg ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last donation:</span>
                        <span className="text-green-600">3+ months ago ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health status:</span>
                        <span className="text-green-600">Good ✓</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h3 className="text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Your Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400">Lives you could save:</p>
                        <p className="text-2xl text-blue-800 dark:text-blue-300">3</p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-400">Community rank:</p>
                        <p className="text-2xl text-blue-800 dark:text-blue-300">#47</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'donateForm' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-red-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('donate')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Donor Information</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="donorName">Full Name</Label>
                  <Input
                    id="donorName"
                    value={donorData.name}
                    onChange={(e) => setDonorData({...donorData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donorAge">Age</Label>
                    <Input
                      id="donorAge"
                      value={donorData.age}
                      onChange={(e) => setDonorData({...donorData, age: e.target.value})}
                      placeholder="Your age"
                      type="number"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donorBloodGroup">Blood Group</Label>
                    <Select value={donorData.bloodGroup} onValueChange={(value) => setDonorData({...donorData, bloodGroup: value})}>
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorPhone">Phone Number</Label>
                  <Input
                    id="donorPhone"
                    value={donorData.phone}
                    onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                    placeholder="Enter phone number"
                    type="tel"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorAddress">Address</Label>
                  <Textarea
                    id="donorAddress"
                    value={donorData.address}
                    onChange={(e) => setDonorData({...donorData, address: e.target.value})}
                    placeholder="Enter your address"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h3 className="text-blue-800 dark:text-blue-300 mb-2">💡 Important</h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      Please ensure all information is accurate. This will be used for your donation record and emergency contact.
                    </p>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white mt-6"
                  onClick={() => setCurrentScreen('healthReport')}
                  disabled={!donorData.name || !donorData.age || !donorData.bloodGroup || !donorData.phone}
                >
                  Next: Health Check
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'healthReport' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-green-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('donateForm')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Health Vitals</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-green-800 dark:text-green-300 mb-2">Health Assessment Required</h3>
                    <p className="text-green-700 dark:text-green-400 text-sm">
                      Please provide your current health vitals. These will be verified by medical staff before donation.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
                    <Input
                      id="hemoglobin"
                      value={healthData.hemoglobin}
                      onChange={(e) => setHealthData({...healthData, hemoglobin: e.target.value})}
                      placeholder="e.g., 14.2"
                      type="number"
                      step="0.1"
                      className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">Normal range: 12.0-16.0 g/dL</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input
                      id="bloodPressure"
                      value={healthData.bloodPressure}
                      onChange={(e) => setHealthData({...healthData, bloodPressure: e.target.value})}
                      placeholder="e.g., 120/80"
                      className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">Normal range: 90/60 - 140/90 mmHg</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodSugar">Blood Sugar Level (mg/dL)</Label>
                    <Input
                      id="bloodSugar"
                      value={healthData.bloodSugar}
                      onChange={(e) => setHealthData({...healthData, bloodSugar: e.target.value})}
                      placeholder="e.g., 95"
                      type="number"
                      className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">Normal range: 70-140 mg/dL</p>
                  </div>
                </div>

                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <h3 className="text-yellow-800 dark:text-yellow-300 mb-2">Health Checklist</h3>
                    <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        <span>I feel healthy and well today</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        <span>I have had adequate sleep (6+ hours)</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        <span>I have eaten within the last 4 hours</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        <span>I am well hydrated</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setCurrentScreen('selectBloodBank')}
                  disabled={!healthData.hemoglobin || !healthData.bloodPressure || !healthData.bloodSugar}
                >
                  Next: Select Location
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'selectBloodBank' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-blue-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('healthReport')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Select Donation Center</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-blue-800 dark:text-blue-300">Choose your preferred donation center from the list below</p>
                  </CardContent>
                </Card>

                {/* Confirm Button at Top - Visible when selection is made */}
                {selectedBloodBank && (
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 sticky top-4 z-10 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-800 dark:text-green-300 text-sm">✅ Selected: {selectedBloodBank.name}</p>
                          <p className="text-green-600 dark:text-green-400 text-xs">{selectedBloodBank.distance} away</p>
                        </div>
                        <Button 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => setCurrentScreen('bloodBankConfirmation')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm Selection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {bloodBanks.map((bank, index) => (
                  <Card 
                    key={index} 
                    className={`transition-all hover:shadow-md ${
                      selectedBloodBank?.name === bank.name 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* Hospital Header with Selection */}
                      <div 
                        className="flex items-start justify-between cursor-pointer mb-4"
                        onClick={() => setSelectedBloodBank(bank)}
                      >
                        <div className="flex-1">
                          <h3 className="mb-1">{bank.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{bank.address}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{bank.distance} away</span>
                          </div>
                          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{bank.timings}</span>
                          </div>
                        </div>
                        {selectedBloodBank?.name === bank.name && (
                          <div className="bg-blue-500 rounded-full p-2">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Live Blood Inventory */}
                      <div className="mb-4">
                        <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Live Blood Inventory</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(bank.inventory).map(([bloodType, data]) => (
                            <div key={bloodType} className={`p-2 rounded-lg text-center ${getInventoryColor(data.status)}`}>
                              <div className="text-xs mb-1">{getInventoryIcon(data.status)}</div>
                              <div className="text-sm">{bloodType}</div>
                              <div className="text-xs">{data.available} units</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Updated: 10 minutes ago • Legend: ✅ Available ⚠️ Low 🚨 Critical
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Call functionality - in real app would open phone dialer
                            window.open(`tel:${bank.phone}`, '_self');
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMaps(bank.googleMapsQuery);
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentScreen === 'bloodBankConfirmation' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-purple-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('selectBloodBank')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Confirm Donation</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-6 text-center">
                    <div className="bg-purple-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl mb-2 text-purple-800 dark:text-purple-300">Ready to Save Lives!</h2>
                    <p className="text-purple-700 dark:text-purple-400">Please review your information before proceeding to the donation center.</p>
                  </CardContent>
                </Card>

                {/* Donor Information Summary */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCheck className="h-5 w-5 mr-2" />
                      Donor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="text-purple-600 dark:text-purple-400">{donorData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Age:</span>
                        <span className="text-purple-600 dark:text-purple-400">{donorData.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blood Group:</span>
                        <span className="text-purple-600 dark:text-purple-400">{donorData.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="text-purple-600 dark:text-purple-400">{donorData.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Blood Bank */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Donation Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3>{selectedBloodBank?.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedBloodBank?.address}</p>
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="text-blue-600 dark:text-blue-400">{selectedBloodBank?.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timings:</span>
                        <span className="text-green-600 dark:text-green-400">{selectedBloodBank?.timings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Vitals */}
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Health Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hemoglobin:</span>
                        <span className="text-green-600 dark:text-green-400">{healthData.hemoglobin} g/dL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blood Pressure:</span>
                        <span className="text-green-600 dark:text-green-400">{healthData.bloodPressure} mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blood Sugar:</span>
                        <span className="text-green-600 dark:text-green-400">{healthData.bloodSugar} mg/dL</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={() => setCurrentScreen('donateSuccess')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Proceed to Donation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400"
                    onClick={() => {
                      if (selectedBloodBank) {
                        openGoogleMaps(selectedBloodBank.googleMapsQuery);
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'donateSuccess' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex flex-col justify-center">
              <div className="p-6 text-center mb-8">
                <div className="bg-green-500 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center animate-pulse">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-2xl mb-4 text-green-600">Donation Successful! 🎉</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Thank you for your life-saving donation!</p>
                
                <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <h3 className="text-green-800 dark:text-green-300 mb-4">Your Impact Today</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl text-green-600 dark:text-green-400 mb-1">3</div>
                        <div className="text-sm text-green-500">Lives Potentially Saved</div>
                      </div>
                      <div>
                        <div className="text-3xl text-green-600 dark:text-green-400 mb-1">450ml</div>
                        <div className="text-sm text-green-500">Blood Donated</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        🏆 <strong>+500 Community Points Earned!</strong>
                      </p>
                      <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                        📅 Next eligible donation: {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="mb-4">Post-Donation Care</h3>
                    <div className="space-y-3 text-left text-sm">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 mr-3">
                          <Check className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Rest for 10-15 minutes before leaving</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 mr-3">
                          <Check className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Drink plenty of fluids (avoid alcohol for 24 hours)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 mr-3">
                          <Check className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Eat iron-rich foods to help replenish your blood</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 mr-3">
                          <Check className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Avoid heavy lifting or vigorous exercise for 24 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      // Update donor stats
                      setCommunityPoints(prev => prev + 500);
                      
                      // Add achievement notification with hospital details
                      const newNotification: Notification = {
                        id: Date.now().toString(),
                        type: 'achievement',
                        title: 'Donation Complete!',
                        message: `Thank you for donating ${donorData.bloodGroup} blood at ${selectedBloodBank?.name}! You've earned 500 points and potentially saved 3 lives.

🏥 Hospital Details:
📍 Address: ${selectedBloodBank?.address}
📞 Contact: ${selectedBloodBank?.phone}
🕒 Timings: ${selectedBloodBank?.timings}

Your next donation will be eligible in 90 days. Thank you for being a lifesaver!`,
                        timestamp: 'Just now',
                        read: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                      
                      // Reset forms
                      setDonorData({name: '', age: '', bloodGroup: '', phone: '', address: ''});
                      setHealthData({hemoglobin: '', bloodPressure: '', bloodSugar: ''});
                      setSelectedBloodBank(null);
                      
                      setCurrentScreen('home');
                    }}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
                    onClick={() => setCurrentScreen('community')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'appointment' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              {/* Header */}
              <div className="bg-red-500 text-white p-4 flex items-center">
                <button onClick={() => setCurrentScreen('donate')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">{t('scheduleAppointment')}</h1>
              </div>

              {/* Content with integrated button */}
              <div className="p-4 space-y-4 mb-8">
                {/* Compact Date Selection */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl">
                  <h3 className="text-sm mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t('selectDate')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23'].map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedAppointment({...selectedAppointment, date})}
                        className={`p-2 rounded-lg border text-xs transition-all min-h-[40px] ${
                          selectedAppointment.date === date
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Time Selection */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl">
                  <h3 className="text-sm mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {t('selectTime')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedAppointment({...selectedAppointment, time})}
                        className={`p-2 rounded-lg border text-xs transition-all min-h-[40px] ${
                          selectedAppointment.time === time
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Location Selection */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl">
                  <h3 className="text-sm mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {t('selectLocation')}
                  </h3>
                  <div className="space-y-2">
                    {bloodBanks.slice(0, 3).map((bank, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAppointment({...selectedAppointment, location: bank.name})}
                        className={`w-full p-2 rounded-lg border text-left transition-all min-h-[44px] flex items-center ${
                          selectedAppointment.location === bank.name
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-xs">{bank.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{bank.distance} away</p>
                        </div>
                        {selectedAppointment.location === bank.name && (
                          <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Summary */}
                {(selectedAppointment.date || selectedAppointment.time || selectedAppointment.location) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-sm mb-2 text-blue-800 dark:text-blue-300">Selection Summary</h3>
                    <div className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                      {selectedAppointment.date && <p>Date: {selectedAppointment.date}</p>}
                      {selectedAppointment.time && <p>Time: {selectedAppointment.time}</p>}
                      {selectedAppointment.location && <p>Location: {selectedAppointment.location}</p>}
                    </div>
                  </div>
                )}

                {/* Moved Confirm Button - Now in content area */}
                <div className="pt-4">
                  <Button 
                    className={`w-full py-4 text-base min-h-[56px] shadow-lg transition-all transform hover:scale-[1.02] ${
                      selectedAppointment.date && selectedAppointment.time && selectedAppointment.location
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    onClick={() => setCurrentScreen('appointmentSuccess')}
                    disabled={!selectedAppointment.date || !selectedAppointment.time || !selectedAppointment.location}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    {selectedAppointment.date && selectedAppointment.time && selectedAppointment.location
                      ? 'Confirm Appointment ✓'
                      : `Complete Selection (${3 - [selectedAppointment.date, selectedAppointment.time, selectedAppointment.location].filter(Boolean).length} remaining)`
                    }
                  </Button>
                </div>

                {/* Help text */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs text-center">
                    💡 Select all three options above to confirm your appointment
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'appointmentSuccess' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex flex-col justify-center">
              <div className="p-6 text-center mb-8">
                <div className="bg-green-500 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-2xl mb-4 text-green-600">{t('appointmentBooked')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{t('appointmentConfirmed')}</p>
                
                <Card className="mb-6 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="mb-4">Appointment Details</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="text-red-500">{selectedAppointment.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-red-500">{selectedAppointment.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-red-500 text-right text-sm">{selectedAppointment.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmation ID:</span>
                        <span className="text-gray-600 dark:text-gray-400">#BD{Date.now().toString().slice(-6)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => {
                      // Add reminder notification
                      const newNotification: Notification = {
                        id: Date.now().toString(),
                        type: 'reminder',
                        title: 'Upcoming Appointment',
                        message: `Donation appointment scheduled for ${selectedAppointment.date} at ${selectedAppointment.time}`,
                        timestamp: 'Just now',
                        read: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                      setCurrentScreen('home');
                    }}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Set Reminder & Go Home
                  </Button>
                </div>
              </div>
            </div>
          )}











          {currentScreen === 'request' && (
            <div className="h-screen bg-gray-50 pb-20">
              <div className="bg-blue-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Request Blood</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-500 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl mb-2">Find Blood Donors</h2>
                    <p className="text-gray-600 mb-6">Connect with generous donors in your area who can help save a life.</p>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => setCurrentScreen('requestForm')}
                    >
                      Start Blood Request
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Emergency?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-800 mb-4">For immediate medical emergencies, please contact emergency services or visit the nearest hospital.</p>
                    <Button variant="outline" className="w-full border-red-500 text-red-500">
                      <Phone className="h-4 w-4 mr-2" />
                      Emergency: 911
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'requestForm' && (
            <div className="h-screen bg-gray-50 pb-20">
              <div className="bg-blue-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('request')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Blood Request Details</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={requestData.patientName}
                    onChange={(e) => setRequestData({...requestData, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroupRequest">Blood Group Needed</Label>
                    <Select value={requestData.bloodGroup} onValueChange={(value) => setRequestData({...requestData, bloodGroup: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select value={requestData.urgency} onValueChange={(value) => setRequestData({...requestData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="urgent">Urgent (24hrs)</SelectItem>
                        <SelectItem value="soon">Soon (3 days)</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Medical Center</Label>
                  <Input
                    id="hospital"
                    value={requestData.hospital}
                    onChange={(e) => setRequestData({...requestData, hospital: e.target.value})}
                    placeholder="Enter hospital name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={requestData.contactPhone}
                      onChange={(e) => setRequestData({...requestData, contactPhone: e.target.value})}
                      placeholder="Phone number"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitsNeeded">Units Needed</Label>
                    <Input
                      id="unitsNeeded"
                      value={requestData.unitsNeeded}
                      onChange={(e) => setRequestData({...requestData, unitsNeeded: e.target.value})}
                      placeholder="e.g., 2"
                      type="number"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6"
                  onClick={() => setCurrentScreen('requestResults')}
                >
                  Find Donors
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'requestResults' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-blue-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('requestForm')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Blood Availability</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-green-800 dark:text-green-300">Good News!</h3>
                    </div>
                    <p className="text-green-700 dark:text-green-400">
                      {requestData.bloodGroup} blood is available at {bloodBanks.filter(bank => 
                        bank.inventory[requestData.bloodGroup]?.available > 0
                      ).length} nearby hospitals
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h3 className="text-blue-800 dark:text-blue-300 mb-2">🛡️ Privacy Protected</h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      For privacy and security, we show hospital availability instead of individual donor details. Please contact hospitals directly.
                    </p>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-lg mb-4">Hospitals with {requestData.bloodGroup} Blood</h2>
                  {bloodBanks
                    .filter(bank => bank.inventory[requestData.bloodGroup]?.available > 0)
                    .map((bank, index) => (
                      <Card key={index} className="mb-4 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="mb-1">{bank.name}</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{bank.address}</p>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{bank.distance} away</span>
                              </div>
                              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{bank.timings}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-500 text-white mb-1">
                                Available
                              </Badge>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {bank.inventory[requestData.bloodGroup]?.available} units
                              </div>
                            </div>
                          </div>

                          {/* Blood Type Availability */}
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-2 mr-3">
                                  <span className="text-lg">{requestData.bloodGroup}</span>
                                </div>
                                <div>
                                  <p className="text-sm">Requested Blood Type</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Status: {getInventoryIcon(bank.inventory[requestData.bloodGroup]?.status)} {bank.inventory[requestData.bloodGroup]?.status}
                                  </p>
                                </div>
                              </div>
                              <div className="text-green-600 dark:text-green-400">
                                ✓ In Stock
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-500 hover:bg-green-600"
                              onClick={() => window.open(`tel:${bank.phone}`, '_self')}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call Hospital
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
                              onClick={() => openGoogleMaps(bank.googleMapsQuery)}
                            >
                              <Navigation className="h-4 w-4 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {bloodBanks.filter(bank => bank.inventory[requestData.bloodGroup]?.available > 0).length === 0 && (
                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <h3 className="text-yellow-800 dark:text-yellow-300 mb-2">Limited Availability</h3>
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-4">
                        {requestData.bloodGroup} blood is currently not available at nearby blood banks.
                      </p>
                      <Button 
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => setCurrentScreen('emergency')}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Send Emergency Alert
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4">
                    <h3 className="mb-2">💡 Next Steps</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>• Call the hospital to confirm blood availability</p>
                      <p>• Provide patient details and required units</p>
                      <p>• Follow hospital procedures for blood requisition</p>
                      <p>• For emergencies, use the Emergency SOS feature</p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                  onClick={() => setCurrentScreen('bloodbanks')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View All Blood Banks
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'awareness' && (
            <div className="h-screen bg-gray-50 pb-20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Stories of Hope</h1>
              </div>

              <div className="p-6 space-y-8 mb-8">
                {/* Inspirational Header */}
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-red-600 mb-2">Every drop counts</h3>
                    <p className="text-red-800">Behind every donation is a life saved, a family reunited, a future restored.</p>
                  </CardContent>
                </Card>

                {/* Real-life Stories with Images */}
                <div>
                  <h2 className="text-lg mb-4 text-center">Stories that Touch Hearts ❤️</h2>
                  {stories.map((story, index) => (
                    <Card key={index} className="mb-6 overflow-hidden shadow-lg">
                      {/* Story Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg mb-1">{story.title}</h3>
                          <p className="text-white/90 text-sm">{story.ageNow}</p>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        {/* Personal Quote */}
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg mb-4 border-l-4 border-red-500">
                          <p className="text-red-800 italic">"{story.quote}"</p>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{story.content}</p>
                        
                        {/* Impact Stats */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="flex items-center mb-2">
                            <Heart className="h-4 w-4 text-red-500 mr-2" />
                            <p className="text-red-600 text-sm">{story.impact}</p>
                          </div>
                          <div className="text-xs text-red-500">
                            💝 Made possible by donors like you
                          </div>
                        </div>
                        
                        {/* Read More Reference */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={() => window.open(story.sourceUrl, '_blank', 'noopener,noreferrer')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('readMore')} - {t('storyVerification')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Call to Action Banner */}
                <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white overflow-hidden">
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute top-0 right-0 opacity-20">
                      <Heart className="h-20 w-20" />
                    </div>
                    <h3 className="text-xl mb-2 relative z-10">Be Someone's Hero Today</h3>
                    <p className="mb-4 relative z-10">Your story could be the next one that inspires others.</p>
                    <Button 
                      variant="secondary"
                      className="bg-white text-red-500 hover:bg-gray-100 relative z-10"
                      onClick={() => setCurrentScreen('donate')}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Start Your Journey
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'bloodbanks' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-green-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Blood Banks in Pune</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-blue-800 dark:text-blue-300">Found {bloodBanks.length} blood banks in Pune • Live inventory</p>
                  </CardContent>
                </Card>

                {bloodBanks.map((bank, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1">{bank.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{bank.address}</p>
                          <p className="text-gray-500 text-sm mb-1">Distance: {bank.distance}</p>
                          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{bank.timings}</span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Blood Inventory */}
                      <div className="mb-4">
                        <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Live Blood Inventory</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(bank.inventory).map(([bloodType, data]) => (
                            <div key={bloodType} className={`p-2 rounded-lg text-center ${getInventoryColor(data.status)}`}>
                              <div className="text-xs mb-1">{getInventoryIcon(data.status)}</div>
                              <div className="text-sm">{bloodType}</div>
                              <div className="text-xs">{data.available} units</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Updated: 10 minutes ago • Legend: ✅ Available ⚠️ Low 🚨 Critical
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
                          onClick={() => openGoogleMaps(bank.googleMapsQuery)}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h3 className="text-yellow-800 mb-2">💡 Pro Tip</h3>
                    <p className="text-yellow-700 text-sm">
                      Call ahead to check blood availability and donation center hours before visiting.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'emergency' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-red-600 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">{t('emergency')}</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardContent className="p-6 text-center">
                    <div className="bg-red-600 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center animate-pulse">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl mb-2 text-red-800 dark:text-red-300">{t('emergencyBloodNeeded')}</h2>
                    <p className="text-red-700 dark:text-red-400 mb-6">This will immediately alert all nearby donors of your urgent blood requirement.</p>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setCurrentScreen('emergencyForm')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {t('sendEmergencyAlert')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Important Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-orange-700 dark:text-orange-400 text-sm">
                      <p>• This feature should only be used for genuine medical emergencies</p>
                      <p>• All nearby eligible donors will be immediately notified</p>
                      <p>• Emergency services should be contacted first for life-threatening situations</p>
                      <p>• Misuse of this feature may result in account suspension</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h3 className="text-blue-800 dark:text-blue-300 mb-2">Need immediate help?</h3>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency: 102
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'emergencyForm' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-red-600 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('emergency')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Emergency Details</h1>
              </div>

              <div className="p-6 space-y-4 mb-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-red-800 dark:text-red-300 text-sm">⚡ This will send immediate alerts to all donors in your area</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPatientName">Patient Name *</Label>
                  <Input
                    id="emergencyPatientName"
                    value={emergencyData.patientName}
                    onChange={(e) => setEmergencyData({...emergencyData, patientName: e.target.value})}
                    placeholder="Enter patient name"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyBloodGroup">Blood Group Needed *</Label>
                    <Select value={emergencyData.bloodGroup} onValueChange={(value) => setEmergencyData({...emergencyData, bloodGroup: value})}>
                      <SelectTrigger className="bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyUnits">Units Needed *</Label>
                    <Input
                      id="emergencyUnits"
                      value={emergencyData.unitsNeeded}
                      onChange={(e) => setEmergencyData({...emergencyData, unitsNeeded: e.target.value})}
                      placeholder="e.g., 2"
                      type="number"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyHospital">Hospital/Medical Center *</Label>
                  <Input
                    id="emergencyHospital"
                    value={emergencyData.hospital}
                    onChange={(e) => setEmergencyData({...emergencyData, hospital: e.target.value})}
                    placeholder="Enter hospital name"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyLocation">Location/Address *</Label>
                  <Input
                    id="emergencyLocation"
                    value={emergencyData.location}
                    onChange={(e) => setEmergencyData({...emergencyData, location: e.target.value})}
                    placeholder="Enter location"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    value={emergencyData.contactPhone}
                    onChange={(e) => setEmergencyData({...emergencyData, contactPhone: e.target.value})}
                    placeholder="Enter contact number"
                    type="tel"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyType">Emergency Type</Label>
                  <Select value={emergencyData.emergencyType} onValueChange={(value: any) => setEmergencyData({...emergencyData, emergencyType: value})}>
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Road/Vehicle Accident</SelectItem>
                      <SelectItem value="surgery">Emergency Surgery</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white mt-6 py-6"
                  onClick={sendEmergencyAlert}
                  disabled={!emergencyData.patientName || !emergencyData.bloodGroup || !emergencyData.hospital}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t('sendEmergencyAlert')}
                </Button>
              </div>
            </div>
          )}

          {currentScreen === 'emergencyActive' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex flex-col justify-center">
              <div className="p-6 text-center mb-8">
                <div className="bg-green-500 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center animate-pulse">
                  <Zap className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-2xl mb-4 text-green-600">{t('emergencyActive')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Emergency alert has been sent to all nearby donors</p>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="mb-4">Alert Details</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span>Patient:</span>
                        <span className="text-red-500">{emergencyData.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blood Group:</span>
                        <span className="text-red-500">{emergencyData.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Units Needed:</span>
                        <span className="text-red-500">{emergencyData.unitsNeeded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hospital:</span>
                        <span className="text-red-500">{emergencyData.hospital}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => setCurrentScreen('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Check Responses
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentScreen('home')}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'notifications' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-blue-500 text-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <button onClick={() => setCurrentScreen('home')} className="mr-4">
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <h1 className="text-xl">{t('notifications')}</h1>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-sm text-blue-100 hover:text-white"
                  >
                    {t('markAllRead')}
                  </button>
                )}
              </div>

              <div className="p-6 space-y-4 mb-8">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">{t('noNotifications')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`cursor-pointer transition-all ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                      }`}
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        if (notification.actionScreen) {
                          setCurrentScreen(notification.actionScreen);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`rounded-full p-2 ${
                            notification.type === 'emergency' ? 'bg-red-100 dark:bg-red-900/30' :
                            notification.type === 'reminder' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            notification.type === 'achievement' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {notification.type === 'emergency' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {notification.type === 'reminder' && <Clock className="h-4 w-4 text-blue-600" />}
                            {notification.type === 'achievement' && <Star className="h-4 w-4 text-green-600" />}
                            {notification.type === 'general' && <Bell className="h-4 w-4 text-gray-600" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{notification.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            {notification.actionText && (
                              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">{notification.actionText} →</p>
                            )}
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {currentScreen === 'achievements' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <button onClick={() => setCurrentScreen('home')} className="mr-4">
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <h1 className="text-xl">{t('achievements')}</h1>
                </div>
                <Button size="sm" variant="ghost" className="text-white" onClick={() => setCurrentScreen('rewards')}>
                  <Gift className="h-4 w-4 mr-2" />
                  Rewards
                </Button>
              </div>

              <div className="p-6 space-y-6 mb-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">{communityPoints.toLocaleString()}</div>
                      <div className="text-blue-100 text-sm">Total Points</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">{achievements.filter(a => a.unlocked).length}</div>
                      <div className="text-green-100 text-sm">Unlocked</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">{dailyCheckInStreak}</div>
                      <div className="text-orange-100 text-sm">Day Streak</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievement Categories */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="donation" className="text-xs">Donation</TabsTrigger>
                    <TabsTrigger value="community" className="text-xs">Community</TabsTrigger>
                    <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {achievements.map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={`${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 opacity-70'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`text-3xl p-3 rounded-full ${achievement.unlocked ? 'bg-green-100 dark:bg-green-800/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className={`${achievement.unlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {achievement.title}
                                </h3>
                                {achievement.unlocked && (
                                  <Badge className="bg-green-500 text-white">Unlocked</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex-1 mr-4">
                                  <Progress 
                                    value={(achievement.progress / achievement.maxProgress) * 100} 
                                    className="h-2" 
                                  />
                                </div>
                                <span className="text-sm text-gray-500">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              {achievement.unlocked && achievement.unlockedDate && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                  Unlocked on {achievement.unlockedDate}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="donation" className="space-y-4">
                    {achievements.filter(a => a.category === 'donation').map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={`${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 opacity-70'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl p-3 rounded-full bg-red-100 dark:bg-red-800/30">
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`${achievement.unlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center">
                                <div className="flex-1 mr-4">
                                  <Progress 
                                    value={(achievement.progress / achievement.maxProgress) * 100} 
                                    className="h-2" 
                                  />
                                </div>
                                <span className="text-sm text-gray-500">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="community" className="space-y-4">
                    {achievements.filter(a => a.category === 'community').map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={`${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 opacity-70'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl p-3 rounded-full bg-purple-100 dark:bg-purple-800/30">
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`${achievement.unlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center">
                                <div className="flex-1 mr-4">
                                  <Progress 
                                    value={(achievement.progress / achievement.maxProgress) * 100} 
                                    className="h-2" 
                                  />
                                </div>
                                <span className="text-sm text-gray-500">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4">
                    {achievements.filter(a => a.category === 'health').map((achievement) => (
                      <Card 
                        key={achievement.id} 
                        className={`${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 opacity-70'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl p-3 rounded-full bg-green-100 dark:bg-green-800/30">
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`${achievement.unlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {achievement.description}
                              </p>
                              <div className="flex items-center">
                                <div className="flex-1 mr-4">
                                  <Progress 
                                    value={(achievement.progress / achievement.maxProgress) * 100} 
                                    className="h-2" 
                                  />
                                </div>
                                <span className="text-sm text-gray-500">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {currentScreen === 'challenges' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">{t('challenges')}</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                {/* Active Challenges */}
                <div>
                  <h2 className="text-lg mb-4">🔥 Active Challenges</h2>
                  {challenges.filter(c => c.active).map((challenge) => (
                    <Card key={challenge.id} className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl p-3 rounded-full bg-orange-100 dark:bg-orange-800/30">
                            {challenge.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-orange-700 dark:text-orange-300">{challenge.title}</h3>
                              <Badge variant="outline" className="border-orange-500 text-orange-500">
                                {challenge.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">
                              {challenge.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1 mr-4">
                                <Progress 
                                  value={(challenge.progress / challenge.maxProgress) * 100} 
                                  className="h-3" 
                                />
                              </div>
                              <span className="text-sm text-orange-600 dark:text-orange-400">
                                {challenge.progress}/{challenge.maxProgress}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-orange-600 dark:text-orange-400">
                                🎁 {challenge.reward}
                              </p>
                              <p className="text-xs text-orange-500">
                                Ends {challenge.endDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upcoming Challenges Preview */}
                <Card className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-gray-600 dark:text-gray-400 mb-2">🚀 More Challenges Coming Soon!</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Complete current challenges to unlock new ones and earn exclusive rewards.
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400"
                    >
                      View Challenge Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentScreen === 'community' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <button onClick={() => setCurrentScreen('home')} className="mr-4">
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <h1 className="text-xl">{t('community')}</h1>
                </div>
                <Button size="sm" variant="ghost" className="text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>

              <div className="p-6 space-y-4 mb-8">
                {/* Community Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg text-blue-600 dark:text-blue-400">2.4k</div>
                      <div className="text-xs text-blue-500">Active Members</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg text-green-600 dark:text-green-400">186</div>
                      <div className="text-xs text-green-500">Stories Shared</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg text-purple-600 dark:text-purple-400">92</div>
                      <div className="text-xs text-purple-500">Lives Saved</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Tabs */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="success-story" className="text-xs">Stories</TabsTrigger>
                    <TabsTrigger value="question" className="text-xs">Q&A</TabsTrigger>
                    <TabsTrigger value="tip" className="text-xs">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {communityPosts.map((post) => (
                      <Card key={post.id} className="bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`rounded-full p-2 ${
                              post.authorType === 'medical' ? 'bg-blue-100 dark:bg-blue-900/30' :
                              post.authorType === 'donor' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-green-100 dark:bg-green-900/30'
                            }`}>
                              {post.authorType === 'medical' && <Shield className="h-4 w-4 text-blue-600" />}
                              {post.authorType === 'donor' && <Heart className="h-4 w-4 text-red-600" />}
                              {post.authorType === 'receiver' && <Users className="h-4 w-4 text-green-600" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h3 className="text-sm">{post.author}</h3>
                                  <p className="text-xs text-gray-500">
                                    {post.authorType} • {post.timestamp}
                                  </p>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    post.category === 'success-story' ? 'border-green-500 text-green-500' :
                                    post.category === 'tip' ? 'border-blue-500 text-blue-500' :
                                    post.category === 'question' ? 'border-orange-500 text-orange-500' :
                                    'border-gray-500 text-gray-500'
                                  }`}
                                >
                                  {post.category}
                                </Badge>
                              </div>
                              
                              <h4 className="mb-2">{post.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}
                              </p>
                              
                              <div className="flex items-center space-x-4">
                                <button 
                                  className={`flex items-center space-x-1 text-sm ${
                                    post.liked ? 'text-red-500' : 'text-gray-500'
                                  }`}
                                  onClick={() => {
                                    setCommunityPosts(prev => prev.map(p => 
                                      p.id === post.id 
                                        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                                        : p
                                    ));
                                  }}
                                >
                                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                                  <span>{post.likes}</span>
                                </button>
                                
                                <button className="flex items-center space-x-1 text-sm text-gray-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.replies}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="success-story" className="space-y-4">
                    {communityPosts.filter(p => p.category === 'success-story').map((post) => (
                      <Card key={post.id} className="bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30">
                              <Heart className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h3 className="text-sm">{post.author}</h3>
                                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                                </div>
                              </div>
                              <h4 className="mb-2">{post.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.content}</p>
                              <div className="flex items-center space-x-4">
                                <button className={`flex items-center space-x-1 text-sm ${post.liked ? 'text-red-500' : 'text-gray-500'}`}>
                                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm text-gray-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.replies}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="question" className="space-y-4">
                    <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                      <CardContent className="p-4 text-center">
                        <p className="text-orange-700 dark:text-orange-300 mb-2">Have a question about blood donation?</p>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          Ask the Community
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tip" className="space-y-4">
                    {communityPosts.filter(p => p.category === 'tip').map((post) => (
                      <Card key={post.id} className="bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h3 className="text-sm">{post.author}</h3>
                                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                                </div>
                              </div>
                              <h4 className="mb-2">{post.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.content}</p>
                              <div className="flex items-center space-x-4">
                                <button className={`flex items-center space-x-1 text-sm ${post.liked ? 'text-red-500' : 'text-gray-500'}`}>
                                  <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm text-gray-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.replies}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {currentScreen === 'rewards' && (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-20">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 flex items-center">
                <button onClick={() => setCurrentScreen('home')} className="mr-4">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <h1 className="text-xl">Rewards & Benefits</h1>
              </div>

              <div className="p-6 space-y-6 mb-8">
                {/* Points Overview */}
                <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{communityPoints.toLocaleString()}</div>
                    <div className="text-red-100 mb-4">Available Points</div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to next reward</span>
                        <span>{communityPoints}/{Math.max(...rewards.filter(r => r.available && !r.redeemed).map(r => r.pointsCost))}</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all" 
                          style={{width: `${Math.min((communityPoints / Math.max(...rewards.filter(r => r.available && !r.redeemed).map(r => r.pointsCost))) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reward Categories */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
                    <TabsTrigger value="shopping" className="text-xs">Shopping</TabsTrigger>
                    <TabsTrigger value="exclusive" className="text-xs">Exclusive</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {rewards.map((reward) => (
                      <Card 
                        key={reward.id} 
                        className={`bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-lg ${
                          reward.redeemed ? 'opacity-75' : reward.available && communityPoints >= reward.pointsCost ? 'border-red-200 shadow-md' : ''
                        }`}
                      >
                        <div className="flex">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <ImageWithFallback 
                              src={reward.image} 
                              alt={reward.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 text-xl bg-white/80 rounded-full w-8 h-8 flex items-center justify-center">
                              {reward.icon}
                            </div>
                            {reward.redeemed && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-sm mb-1">{reward.title}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs mb-2 ${
                                    reward.category === 'health' ? 'border-green-500 text-green-500' :
                                    reward.category === 'shopping' ? 'border-blue-500 text-blue-500' :
                                    reward.category === 'exclusive' ? 'border-purple-500 text-purple-500' :
                                    'border-orange-500 text-orange-500'
                                  }`}
                                >
                                  {reward.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg text-red-500">{reward.pointsCost}</div>
                                <div className="text-xs text-gray-500">points</div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {reward.description}
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                              <span>Partner: {reward.partnerName}</span>
                              <span>Valid until: {reward.validUntil}</span>
                            </div>

                            <Button 
                              size="sm" 
                              className={`w-full ${
                                reward.redeemed 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : reward.available && communityPoints >= reward.pointsCost
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                              disabled={reward.redeemed || !reward.available || communityPoints < reward.pointsCost}
                              onClick={() => {
                                if (!reward.redeemed && reward.available && communityPoints >= reward.pointsCost) {
                                  setRewards(prev => prev.map(r => 
                                    r.id === reward.id ? { ...r, redeemed: true } : r
                                  ));
                                  setCommunityPoints(prev => prev - reward.pointsCost);
                                  
                                  const notification: Notification = {
                                    id: Date.now().toString(),
                                    type: 'achievement',
                                    title: 'Reward Redeemed!',
                                    message: `You've successfully redeemed: ${reward.title}`,
                                    timestamp: 'Just now',
                                    read: false
                                  };
                                  setNotifications(prev => [notification, ...prev]);
                                }
                              }}
                            >
                              {reward.redeemed 
                                ? '✓ Redeemed' 
                                : reward.available && communityPoints >= reward.pointsCost
                                ? `Redeem (${reward.pointsCost} pts)`
                                : `Need ${reward.pointsCost - communityPoints} more pts`
                              }
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4">
                    {rewards.filter(r => r.category === 'health').map((reward) => (
                      <Card 
                        key={reward.id} 
                        className={`bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-lg ${
                          reward.redeemed ? 'opacity-75' : reward.available && communityPoints >= reward.pointsCost ? 'border-green-200 shadow-md' : ''
                        }`}
                      >
                        <div className="flex">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <ImageWithFallback 
                              src={reward.image} 
                              alt={reward.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 text-xl bg-white/80 rounded-full w-8 h-8 flex items-center justify-center">
                              {reward.icon}
                            </div>
                            {reward.redeemed && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-sm mb-1">{reward.title}</h3>
                                <Badge variant="outline" className="text-xs mb-2 border-green-500 text-green-500">
                                  {reward.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg text-green-500">{reward.pointsCost}</div>
                                <div className="text-xs text-gray-500">points</div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {reward.description}
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                              <span>Partner: {reward.partnerName}</span>
                              <span>Valid until: {reward.validUntil}</span>
                            </div>

                            <Button 
                              size="sm" 
                              className={`w-full ${
                                reward.redeemed 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : reward.available && communityPoints >= reward.pointsCost
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                              disabled={reward.redeemed || !reward.available || communityPoints < reward.pointsCost}
                              onClick={() => {
                                if (!reward.redeemed && reward.available && communityPoints >= reward.pointsCost) {
                                  setRewards(prev => prev.map(r => 
                                    r.id === reward.id ? { ...r, redeemed: true } : r
                                  ));
                                  setCommunityPoints(prev => prev - reward.pointsCost);
                                  
                                  const notification: Notification = {
                                    id: Date.now().toString(),
                                    type: 'achievement',
                                    title: 'Health Reward Redeemed!',
                                    message: `You've redeemed: ${reward.title}`,
                                    timestamp: 'Just now',
                                    read: false
                                  };
                                  setNotifications(prev => [notification, ...prev]);
                                }
                              }}
                            >
                              {reward.redeemed 
                                ? '✓ Redeemed' 
                                : reward.available && communityPoints >= reward.pointsCost
                                ? `Redeem (${reward.pointsCost} pts)`
                                : `Need ${reward.pointsCost - communityPoints} more pts`
                              }
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="shopping" className="space-y-4">
                    {rewards.filter(r => r.category === 'shopping').map((reward) => (
                      <Card 
                        key={reward.id} 
                        className={`bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-lg ${
                          reward.redeemed ? 'opacity-75' : reward.available && communityPoints >= reward.pointsCost ? 'border-blue-200 shadow-md' : ''
                        }`}
                      >
                        <div className="flex">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <ImageWithFallback 
                              src={reward.image} 
                              alt={reward.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 text-xl bg-white/80 rounded-full w-8 h-8 flex items-center justify-center">
                              {reward.icon}
                            </div>
                            {reward.redeemed && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-sm mb-1">{reward.title}</h3>
                                <Badge variant="outline" className="text-xs mb-2 border-blue-500 text-blue-500">
                                  {reward.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg text-blue-500">{reward.pointsCost}</div>
                                <div className="text-xs text-gray-500">points</div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {reward.description}
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                              <span>Partner: {reward.partnerName}</span>
                              <span>Valid until: {reward.validUntil}</span>
                            </div>

                            <Button 
                              size="sm" 
                              className={`w-full ${
                                reward.redeemed 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : reward.available && communityPoints >= reward.pointsCost
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                              disabled={reward.redeemed || !reward.available || communityPoints < reward.pointsCost}
                            >
                              {reward.redeemed 
                                ? '✓ Redeemed' 
                                : reward.available && communityPoints >= reward.pointsCost
                                ? `Redeem (${reward.pointsCost} pts)`
                                : `Need ${reward.pointsCost - communityPoints} more pts`
                              }
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="exclusive" className="space-y-4">
                    {rewards.filter(r => r.category === 'exclusive').map((reward) => (
                      <Card 
                        key={reward.id} 
                        className={`bg-white dark:bg-gray-800 overflow-hidden transition-all hover:shadow-lg ${
                          reward.redeemed ? 'opacity-75' : reward.available && communityPoints >= reward.pointsCost ? 'border-purple-200 shadow-md' : ''
                        }`}
                      >
                        <div className="flex">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <ImageWithFallback 
                              src={reward.image} 
                              alt={reward.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 text-xl bg-white/80 rounded-full w-8 h-8 flex items-center justify-center">
                              {reward.icon}
                            </div>
                            {reward.redeemed && (
                              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-sm mb-1">{reward.title}</h3>
                                <Badge variant="outline" className="text-xs mb-2 border-purple-500 text-purple-500">
                                  {reward.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg text-purple-500">{reward.pointsCost}</div>
                                <div className="text-xs text-gray-500">points</div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {reward.description}
                            </p>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                              <span>Partner: {reward.partnerName}</span>
                              <span>Valid until: {reward.validUntil}</span>
                            </div>

                            <Button 
                              size="sm" 
                              className={`w-full ${
                                reward.redeemed 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : reward.available && communityPoints >= reward.pointsCost
                                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                              disabled={reward.redeemed || !reward.available || communityPoints < reward.pointsCost}
                            >
                              {reward.redeemed 
                                ? '✓ Redeemed' 
                                : reward.available && communityPoints >= reward.pointsCost
                                ? `Redeem (${reward.pointsCost} pts)`
                                : `Need ${reward.pointsCost - communityPoints} more pts`
                              }
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* How to Earn Points */}
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center text-sm">
                      <Star className="h-4 w-4 mr-2" />
                      How to Earn More Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="bg-red-500 rounded-full p-1">
                          <Heart className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-yellow-700 dark:text-yellow-300">Blood Donation: +500 pts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Calendar className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-yellow-700 dark:text-yellow-300">Daily Check-in: +10-20 pts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-500 rounded-full p-1">
                          <Users className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-yellow-700 dark:text-yellow-300">Community Help: +50 pts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-purple-500 rounded-full p-1">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-yellow-700 dark:text-yellow-300">Achievements: +100-500 pts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin Panel */}
      {currentScreen === 'admin' && (
        <AdminPanel onLogout={() => setCurrentScreen('login')} />
      )}

      {/* Floating Buttons - Hide on Admin Panel */}
      {currentScreen !== 'admin' && currentScreen !== 'adminLogin' && (
        <>
          {/* 🔊 TEXT TO SPEECH BUTTON */}
          <button
            onClick={toggleTextToSpeech}
            className={`fixed bottom-24 right-6 z-50 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 ${
              isSpeaking 
                ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300 animate-pulse' 
                : 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
            }`}
            aria-label={isSpeaking ? "Stop Speech" : "Text to Speech"}
          >
            {isSpeaking ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </button>
          
          {/* ChatBot Component */}
          <ChatBot 
            onQuickAction={(action) => {
              // Handle quick actions
              if (action === 'eligibility') {
                setCurrentScreen('donate');
              } else if (action === 'appointment') {
                setCurrentScreen('appointment');
              } else if (action === 'bloodbank') {
                setCurrentScreen('bloodbanks');
              }
            }}
          />
        </>
      )}
    </LanguageContext.Provider>
  );
}