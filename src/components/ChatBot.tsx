import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Bot, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onQuickAction?: (action: string) => void;
}

export function ChatBot({ onQuickAction }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your BloodConnect assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { id: 1, text: '📱 What is BloodConnect?', icon: '📱' },
    { id: 2, text: '🏥 How do I donate blood?', icon: '🏥' },
    { id: 3, text: '🚨 What is LifePulse SOS?', icon: '🚨' },
    { id: 4, text: '🎯 What features are available?', icon: '🎯' },
    { id: 5, text: '🗺️ How to navigate the app?', icon: '🗺️' },
    { id: 6, text: '🏆 What are achievements?', icon: '🏆' },
    { id: 7, text: '💰 How do rewards work?', icon: '💰' },
    { id: 8, text: '⏰ What are donation requirements?', icon: '⏰' },
    { id: 9, text: '🩺 What happens during donation?', icon: '🩺' },
    { id: 10, text: '🌍 Can I donate if traveling?', icon: '🌍' },
    { id: 11, text: '📊 How to track my donations?', icon: '📊' },
    { id: 12, text: '🔔 How do notifications work?', icon: '🔔' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    // Remove emoji from the question text
    const cleanQuestion = question.replace(/^[^\s]+\s/, ''); // Remove first emoji and space
    setInputValue(cleanQuestion);
    setShowSuggestionsPanel(false); // Close the panel after selecting a question
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // App Information
    if (input.includes('what is bloodconnect') || input.includes('about app') || input.includes('app summary')) {
      return '🩸 BloodConnect is a comprehensive blood donation platform that connects donors with receivers!\n\n✨ Our mission: Connecting lives, one donation at a time.\n\nKey highlights:\n• Connect donors with those in need\n• Real-time blood bank inventory\n• Emergency SOS feature (LifePulse)\n• Gamification & rewards system\n• Multi-language support (English, Hindi, Marathi)\n• Health tracking & eligibility monitoring\n\nWe make blood donation simple, rewarding, and life-saving! 💝';
    }
    
    // Features
    else if (input.includes('features') || input.includes('what can') || input.includes('capabilities')) {
      return '🎯 BloodConnect Features:\n\n🩸 DONATION\n• Schedule appointments\n• Walk-in donations\n• Eligibility checker\n• Health dashboard\n\n🏥 BLOOD BANKS\n• Find nearby centers\n• Real-time inventory\n• Distance & directions\n• Operating hours\n\n🚨 EMERGENCY\n• LifePulse SOS alerts\n• Instant donor notifications\n• Priority requests\n\n🏆 REWARDS\n• Achievements & badges\n• Community points\n• Exclusive rewards\n• Challenges & streaks\n\n👥 COMMUNITY\n• Success stories\n• Discussion forums\n• Tips & support\n\nWhich feature would you like to explore?';
    }
    
    // Navigation Help
    else if (input.includes('navigate') || input.includes('how to use') || input.includes('sections') || input.includes('where')) {
      return '🗺️ App Navigation Guide:\n\n🏠 HOME TAB\n• Dashboard & quick actions\n• Donate & request blood\n• Emergency alerts\n\n📚 STORIES TAB\n• Success stories\n• Awareness articles\n• Community posts\n\n🏥 BANKS TAB\n• Blood bank directory\n• Live inventory status\n• Get directions\n\n👤 PROFILE TAB\n• Your donation stats\n• Achievements & rewards\n• Health metrics\n• Settings & language\n\n💡 Tip: Use the red floating button (me!) for quick help anytime!\n\nWhere would you like to go?';
    }
    
    // How to Donate
    else if (input.includes('how') && (input.includes('donate') || input.includes('donation'))) {
      return '🏥 How to Donate Blood:\n\n📅 OPTION 1: APPOINTMENT\n1. Tap "Donate Blood" on home\n2. Fill health questionnaire\n3. Select blood bank\n4. Choose date & time\n5. Confirm booking\n\n🚶 OPTION 2: WALK-IN\n1. Tap "Donate Blood"\n2. Choose "Walk-in"\n3. View nearby blood banks\n4. Visit directly with live inventory info\n\n✅ Before you go:\n• Eat well & stay hydrated\n• Get good sleep\n• Bring ID proof\n• Check eligibility\n\nReady to save lives? 💪';
    }
    
    // LifePulse SOS
    else if (input.includes('lifepulse') || input.includes('sos') || (input.includes('emergency') && input.includes('feature'))) {
      return '🚨 LifePulse SOS – Instant Blood Connect\n\nThis is our emergency feature for urgent blood needs!\n\n⚡ HOW IT WORKS:\n1. Tap the SOS button\n2. Enter patient & blood details\n3. System sends instant alerts\n4. All nearby donors notified\n5. Blood banks alerted\n6. Real-time responses tracked\n\n🎯 WHO GETS NOTIFIED:\n• Matching blood group donors within 5km\n• All partner blood banks\n• Emergency response team\n\n⏱️ Average response time: 5-10 minutes\n\n💡 Use only for genuine emergencies. Every second counts!\n\nNeed to activate emergency mode?';
    }
    
    // Achievements
    else if (input.includes('achievement') || input.includes('badge') || input.includes('reward') || input.includes('gamification')) {
      return '🏆 Achievements & Rewards System:\n\n🎖️ BADGES:\n• First Step Hero (1st donation)\n• Silver Donor (5 donations)\n• Gold Lifesaver (10 donations)\n• Platinum Hero (25 donations)\n• Consistent Saver (streaks)\n\n⭐ EARN POINTS BY:\n• Blood donations: 500-1000 pts\n• Daily check-ins: 10 pts\n• Community engagement: 50-200 pts\n• Completing challenges: 100-500 pts\n\n🎁 REDEEM POINTS FOR:\n• Free health checkups\n• Pharmacy discounts\n• Restaurant vouchers\n• Exclusive merchandise\n• Emergency blood vouchers\n\nCurrent points: Check Profile → Rewards\n\nKeep saving lives to unlock more! 🌟';
    }
    
    // Rewards System
    else if (input.includes('how do rewards work') || input.includes('rewards system')) {
      return '💰 Rewards System Explained:\n\n🎯 HOW IT WORKS:\nEvery action you take earns you community points!\n\n📈 POINT VALUES:\n• Blood donation: 1000 pts\n• Emergency response: 1500 pts\n• Profile completion: 100 pts\n• Daily app login: 10 pts\n• Share success story: 200 pts\n• Refer a friend: 300 pts\n\n🎁 REDEMPTION OPTIONS:\n• 500 pts = Rs. 50 pharmacy voucher\n• 1000 pts = Free health checkup\n• 2000 pts = Restaurant voucher\n• 5000 pts = BloodConnect merchandise\n• 10000 pts = Priority emergency service\n\n💎 VIP TIERS:\nGold (5 donations), Platinum (10), Diamond (25)\n\nStart earning today! 🌟';
    }
    
    // Donation Requirements
    else if (input.includes('donation requirements') || input.includes('requirements')) {
      return '⏰ Blood Donation Requirements:\n\n✅ BASIC ELIGIBILITY:\n• Age: 18-65 years\n• Weight: Minimum 50 kg\n• Hemoglobin: ≥12.5 g/dL\n• Blood pressure: Normal range\n• Pulse: 50-100 beats/min\n\n🚫 TEMPORARY DEFERRALS:\n• Cold/flu: Wait 2 weeks\n• Antibiotics: Wait 2 weeks after completion\n• Alcohol: 24 hours before\n• Tattoo/piercing: Wait 6 months\n• Travel to malaria zone: Wait 3 months\n\n⏱️ DONATION INTERVALS:\n• Whole blood: Every 3 months\n• Platelets: Every 2 weeks\n• Plasma: Every 4 weeks\n\n📋 WHAT TO BRING:\n• Valid photo ID\n• List of current medications\n• Previous donation card (if any)\n\nHave questions? Check Profile → Health Status!';
    }
    
    // What Happens During Donation
    else if (input.includes('what happens during') || input.includes('donation process')) {
      return '🩺 What Happens During Donation:\n\n📝 STEP 1: REGISTRATION (5 mins)\n• Fill registration form\n• Provide ID proof\n• Quick health questionnaire\n\n🩺 STEP 2: HEALTH SCREENING (10 mins)\n• Weight & vitals check\n• Hemoglobin test (finger prick)\n• Medical history review\n• Doctor consultation\n\n💉 STEP 3: DONATION (10-15 mins)\n• Comfortable reclining chair\n• Arm sanitization\n• Needle insertion (slight pinch)\n• Donate 350-450 ml blood\n• Watch video or relax\n\n🍪 STEP 4: REFRESHMENTS (15 mins)\n• Rest & observation\n• Snacks & beverages\n• Receive certificate\n• Schedule next donation\n\n⏱️ TOTAL TIME: 45-60 minutes\n\n💪 Post-donation tips:\n• Drink lots of fluids\n• Avoid heavy lifting (24 hrs)\n• Eat iron-rich foods\n• Keep bandage for 4 hours\n\nYou\'re a hero! 🌟';
    }
    
    // Traveling & Donation
    else if (input.includes('traveling') || input.includes('travel')) {
      return '🌍 Donation While Traveling:\n\n✅ WITHIN INDIA:\n• You can donate at any partner blood bank\n• Use the app to find nearby centers\n• Your donation history syncs automatically\n• Points & badges remain intact\n\n🚫 TRAVEL RESTRICTIONS:\n• Recent travel to malaria zones: 3-month wait\n• High-risk countries: 12-month wait\n• COVID-affected areas: Follow local guidelines\n\n🗺️ MALARIA ZONES IN INDIA:\n• Parts of Assam, Odisha, Jharkhand\n• Northeast states\n• Parts of Madhya Pradesh, Chhattisgarh\n\n✈️ INTERNATIONAL TRAVEL:\n• Update travel history in app\n• System will auto-calculate eligibility\n• Get cleared before donation\n\n💡 PRO TIP:\nUpdate your travel info in Profile → Health Status\n\nPlan to travel? Update us first! 🌏';
    }
    
    // Track Donations
    else if (input.includes('track') || input.includes('tracking')) {
      return '📊 Track Your Donations:\n\n📱 IN THE APP:\nGo to Profile Tab → Donation History\n\n📈 WHAT YOU\'LL SEE:\n• Total donations count\n• Donation dates & locations\n• Blood components donated\n• Lives potentially saved\n• Upcoming eligibility date\n• Donation certificates\n\n🏆 ACHIEVEMENTS:\n• Badges earned\n• Current streak\n• Milestone progress\n• Points accumulated\n• Tier level (Silver/Gold/Platinum)\n\n📅 CALENDAR VIEW:\n• Past donations marked\n• Next eligible date highlighted\n• Appointment reminders\n• Health checkup due dates\n\n📊 IMPACT STATS:\n• Total blood donated (ml)\n• Estimated lives saved\n• Community rank\n• Carbon footprint saved\n\n🔔 NOTIFICATIONS:\n• Eligibility reminders\n• Milestone celebrations\n• Emergency requests nearby\n\nView your journey: Profile → Stats! 📈';
    }
    
    // Notifications
    else if (input.includes('notification') || input.includes('alerts')) {
      return '🔔 How Notifications Work:\n\n⚙️ TYPES OF NOTIFICATIONS:\n\n🚨 EMERGENCY ALERTS:\n• LifePulse SOS activations\n• Matching blood group needed\n• Critical shortage alerts\n• Hospital urgent requests\n\n📅 REMINDERS:\n• Donation eligibility date\n• Scheduled appointments\n• Health checkup due\n• Streak about to break\n\n🏆 ACHIEVEMENTS:\n• New badges unlocked\n• Milestone reached\n• Points threshold crossed\n• Tier level upgrade\n\n📰 UPDATES:\n• Success stories\n• App feature updates\n• Community events\n• Health tips\n\n⚙️ CUSTOMIZE:\nGo to Profile → Settings → Notifications\n\n✅ You can control:\n• Emergency alerts (recommended: ON)\n• Reminder frequency\n• Achievement notifications\n• Community updates\n• Quiet hours (10 PM - 8 AM)\n\n💡 SMART FEATURES:\n• Location-based alerts\n• Priority for matching blood types\n• Snooze options\n• Do Not Disturb mode\n\nManage: Profile → Settings → Notifications! 🔔';
    }
    
    // Original responses
    else if (input.includes('eligib')) {
      return 'To check your eligibility for blood donation, you should:\n\n• Be 18-65 years old\n• Weigh at least 50 kg\n• Be in good health\n• Have normal blood pressure\n\nWould you like to check your eligibility now?';
    } else if (input.includes('appoint') || input.includes('book')) {
      return 'I can help you book an appointment for blood donation! Our available time slots are:\n\n• Morning: 9 AM - 12 PM\n• Afternoon: 2 PM - 5 PM\n\nWould you like to proceed with booking?';
    } else if (input.includes('blood bank') || input.includes('find')) {
      return 'I can help you find nearby blood banks! We have several partner blood banks in Pune:\n\n• Sassoon General Hospital (1.2 km)\n• Ruby Hall Clinic (2.5 km)\n• KEM Hospital (3.8 km)\n\nWould you like to see the full list with real-time inventory?';
    } else if (input.includes('emergency') || input.includes('urgent')) {
      return 'For emergency blood requirements, you can use our LifePulse SOS feature. This will immediately notify all nearby donors and blood banks.\n\nWould you like to activate an emergency alert?';
    } else if (input.includes('thank') || input.includes('thanks')) {
      return 'You\'re welcome! 😊 Is there anything else I can help you with?';
    } else {
      return 'I\'m here to help! You can ask me about:\n\n• Checking donation eligibility\n• Booking appointments\n• Finding blood banks\n• Emergency blood requests\n• General donation information\n\nWhat would you like to know?';
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      eligibility: 'Can you check my eligibility for blood donation?',
      appointment: 'I want to book an appointment for blood donation',
      bloodbank: 'Can you help me find a nearby blood bank?',
    };

    const message = actionMessages[action];
    if (message) {
      setInputValue(message);
      handleSend();
    }

    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 left-6 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-full max-w-md">
          <Card className="shadow-2xl border-2 border-red-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2">
                  <Bot className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">BloodConnect Assistant</h3>
                  <p className="text-xs text-red-100">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-700 rounded-full p-2 transition-colors bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-red-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-red-100' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Panel - Collapsible */}
            {showSuggestionsPanel && (
              <div className="p-4 bg-white border-t border-b border-gray-200 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-red-500" />
                    Suggested Questions
                  </p>
                  <button
                    onClick={() => setShowSuggestionsPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleSuggestedQuestion(question.text)}
                      className="text-left text-sm bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-lg px-3 py-2 transition-all duration-200"
                    >
                      <span className="text-gray-700">{question.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">Quick Actions:</p>
                <button
                  onClick={() => setShowSuggestionsPanel(!showSuggestionsPanel)}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Suggested Questions
                  {showSuggestionsPanel ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleQuickAction('eligibility')}
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  Check Eligibility
                </Button>
                <Button
                  onClick={() => handleQuickAction('appointment')}
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  Book Appointment
                </Button>
                <Button
                  onClick={() => handleQuickAction('bloodbank')}
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  Find Blood Bank
                </Button>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border-gray-300 focus:border-red-300 focus:ring-red-200"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-red-500 hover:bg-red-600 text-white shrink-0"
                  disabled={inputValue.trim() === ''}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-gray-100 shrink-0"
                  onClick={() => {
                    // Voice input placeholder
                    const botMessage: Message = {
                      id: Date.now().toString(),
                      text: 'Voice input feature coming soon! 🎤',
                      sender: 'bot',
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, botMessage]);
                  }}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}