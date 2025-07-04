import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, MessageSquare, Image, Bot, Sparkles, Star, Home, Car, Bike, Smartphone, Laptop, Sofa, CheckCircle, Copy, Send, Upload, Eye, TrendingDown, ExternalLink, MapPin, Clock, Mic, MicOff, Camera, Paperclip } from "lucide-react";
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';

export interface NegotiationTab {
  id: string;
  title: string;
  category: string;
  platform: string;
  originalPrice: number;
  currentOffer?: number;
  status: 'active' | 'completed' | 'closed';
  createdAt: Date;
  messages: Array<{
    id: string;
    type: 'user' | 'ai' | 'seller';
    content: string;
    timestamp: Date;
    isVoice?: boolean;
    isImage?: boolean;
    imageUrl?: string;
  }>;
  tone?: string;
  budget?: number;
}

export interface CompletedDeal {
  id: string;
  title: string;
  category: string;
  platform: string;
  originalPrice: number;
  finalPrice: number;
  savings: number;
  savingsPercentage: number;
  completedAt: Date;
  dealClosed: boolean;
}

const categories = [
  { id: 'real-estate', name: 'Real Estate', icon: Home, color: 'from-blue-500 to-blue-600' },
  { id: 'cars', name: 'Cars', icon: Car, color: 'from-red-500 to-red-600' },
  { id: 'motorcycles', name: 'Motorcycles', icon: Bike, color: 'from-orange-500 to-orange-600' },
  { id: 'gadgets', name: 'Gadgets', icon: Smartphone, color: 'from-purple-500 to-purple-600' },
  { id: 'electronics', name: 'Electronics', icon: Laptop, color: 'from-green-500 to-green-600' },
  { id: 'furniture', name: 'Furniture', icon: Sofa, color: 'from-indigo-500 to-indigo-600' }
];

const AppPage = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [activeSubTab, setActiveSubTab] = useState('form');
  const [currentNegotiationId, setCurrentNegotiationId] = useState<string | null>(null);
  const [negotiationTabs, setNegotiationTabs] = useState<NegotiationTab[]>([]);
  const [completedDeals, setCompletedDeals] = useState<CompletedDeal[]>([
    {
      id: '1',
      title: '2019 Honda Civic',
      category: 'cars',
      platform: 'Facebook Marketplace',
      originalPrice: 18000,
      finalPrice: 15500,
      savings: 2500,
      savingsPercentage: 14,
      completedAt: new Date('2024-01-15'),
      dealClosed: true
    },
    {
      id: '2',
      title: 'MacBook Pro 13"',
      category: 'electronics',
      platform: 'Craigslist',
      originalPrice: 1200,
      finalPrice: 950,
      savings: 250,
      savingsPercentage: 21,
      completedAt: new Date('2024-01-10'),
      dealClosed: true
    }
  ]);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [budget, setBudget] = useState('');
  const [generatedOffer, setGeneratedOffer] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // AI Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string, 
    type: 'user' | 'ai', 
    content: string, 
    timestamp: Date,
    isVoice?: boolean,
    isImage?: boolean,
    imageUrl?: string
  }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Image Analyzer states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessages, setAnalysisMessages] = useState<Array<{
    id: string, 
    type: 'user' | 'ai', 
    content: string, 
    timestamp: Date
  }>>([]);
  const [analysisInput, setAnalysisInput] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // Dialog states
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [closingTabId, setClosingTabId] = useState('');
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const getCurrentNegotiation = () => {
    return negotiationTabs.find(tab => tab.id === currentNegotiationId);
  };

  const updateCurrentNegotiation = (updates: Partial<NegotiationTab>) => {
    if (!currentNegotiationId) return;
    
    setNegotiationTabs(prev => prev.map(tab => 
      tab.id === currentNegotiationId ? { ...tab, ...updates } : tab
    ));
  };

  const startNewNegotiation = () => {
    const newTab: NegotiationTab = {
      id: Date.now().toString(),
      title: '',
      category: '',
      platform: '',
      originalPrice: 0,
      status: 'active',
      createdAt: new Date(),
      messages: []
    };
    
    setNegotiationTabs(prev => [...prev, newTab]);
    setCurrentNegotiationId(newTab.id);
    
    // Reset form
    setSelectedCategory('');
    setListingTitle('');
    setListingPrice('');
    setPlatform('');
    setExtraNotes('');
    setSelectedTone('');
    setBudget('');
    setGeneratedOffer('');
    setGeneratedMessage('');
    setChatMessages([]);
    
    toast({
      title: "New Negotiation Started",
      description: "You can now work on multiple negotiations simultaneously.",
    });
  };

  const selectNegotiation = (tabId: string) => {
    const tab = negotiationTabs.find(t => t.id === tabId);
    if (!tab) return;

    setCurrentNegotiationId(tabId);
    setActiveTab('new');
    
    // Load negotiation data
    setSelectedCategory(tab.category);
    setListingTitle(tab.title);
    setListingPrice(tab.originalPrice.toString());
    setPlatform(tab.platform);
    setSelectedTone(tab.tone || '');
    setBudget(tab.budget?.toString() || '');
    setChatMessages(tab.messages || []);
    
    if (tab.currentOffer) {
      setGeneratedOffer(tab.currentOffer.toString());
    }
    
    toast({
      title: "Negotiation Loaded",
      description: `Switched to: ${tab.title || 'Untitled negotiation'}`,
    });
  };

  const closeNegotiationTab = (tabId: string) => {
    setClosingTabId(tabId);
    setShowDealDialog(true);
  };

  const handleDealCompletion = () => {
    const tab = negotiationTabs.find(t => t.id === closingTabId);
    if (!tab) return;

    if (dealClosed && finalPrice) {
      const finalPriceNum = parseFloat(finalPrice);
      if (finalPriceNum && finalPriceNum < tab.originalPrice) {
        const savings = tab.originalPrice - finalPriceNum;
        const savingsPercentage = Math.round((savings / tab.originalPrice) * 100);
        
        const completedDeal: CompletedDeal = {
          id: closingTabId,
          title: tab.title,
          category: tab.category,
          platform: tab.platform,
          originalPrice: tab.originalPrice,
          finalPrice: finalPriceNum,
          savings,
          savingsPercentage,
          completedAt: new Date(),
          dealClosed: true
        };
        
        setCompletedDeals(prev => [completedDeal, ...prev]);
        
        toast({
          title: "Deal Completed! 🎉",
          description: `You saved $${savings} (${savingsPercentage}% off)!`,
        });
      }
    }
    
    setNegotiationTabs(prev => prev.filter(t => t.id !== closingTabId));
    
    if (currentNegotiationId === closingTabId) {
      setCurrentNegotiationId(null);
    }
    
    setShowDealDialog(false);
    setClosingTabId('');
    setDealClosed(false);
    setFinalPrice('');
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform || !selectedCategory || !selectedTone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including tone selection.",
        variant: "destructive"
      });
      return;
    }

    const budgetNum = budget ? parseFloat(budget) : undefined;
    const priceNum = parseFloat(listingPrice);
    
    if (budgetNum && priceNum > budgetNum) {
      toast({
        title: "Budget Exceeded",
        description: "The listing price exceeds your budget. Consider looking for alternatives.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedOffer = calculateCounterOffer(priceNum, platform, selectedCategory);
      const finalOffer = budgetNum ? Math.min(calculatedOffer, budgetNum) : calculatedOffer;
      
      const message = await generateNegotiationMessage(
        listingTitle, 
        priceNum, 
        finalOffer, 
        platform, 
        extraNotes,
        selectedCategory
      );
      
      setGeneratedOffer(finalOffer.toString());
      setGeneratedMessage(message);
      
      // Update current negotiation
      if (currentNegotiationId) {
        updateCurrentNegotiation({
          title: listingTitle,
          category: selectedCategory,
          platform: platform,
          originalPrice: priceNum,
          currentOffer: finalOffer,
          tone: selectedTone,
          budget: budgetNum
        });
      }
      
      toast({
        title: "Offer Generated!",
        description: "Your negotiation strategy is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    // Update current negotiation
    if (currentNegotiationId) {
      updateCurrentNegotiation({ messages: newMessages });
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "I understand your concern about the negotiation. Based on your tone preference and the market data, I'd suggest emphasizing the quick transaction benefit. Would you like me to adjust the message to be more assertive about your timeline?",
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, aiResponse];
      setChatMessages(updatedMessages);
      
      if (currentNegotiationId) {
        updateCurrentNegotiation({ messages: updatedMessages });
      }
      
      toast({
        title: "AI Response Generated!",
        description: "Continue the conversation for more insights.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response.",
        variant: "destructive"
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice message
      const voiceMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: "Voice message: How should I respond if they counter with a higher price?",
        timestamp: new Date(),
        isVoice: true
      };
      setChatMessages(prev => [...prev, voiceMessage]);
      
      toast({
        title: "Voice Message Sent",
        description: "Your voice message has been processed.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak your message now...",
      });
    }
  };

  const handleChatImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const imageMessage = {
          id: Date.now().toString(),
          type: 'user' as const,
          content: "Shared an image",
          timestamp: new Date(),
          isImage: true,
          imageUrl: imageUrl
        };
        setChatMessages(prev => [...prev, imageMessage]);
        
        toast({
          title: "Image Shared",
          description: "Your image has been added to the conversation.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast({
          title: "Image Uploaded",
          description: "Ready to analyze the conversation.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage || !selectedCategory) {
      toast({
        title: "Requirements Missing",
        description: "Please upload an image and select a category.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const analysisResult = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: `Analysis Complete! I can see this is a ${selectedCategory} negotiation. The conversation shows the seller is motivated and mentions "need to sell quickly." Key insights: 1) Price flexibility appears high, 2) Seller seems genuine, 3) Good opportunity for 15-20% discount. What specific aspect would you like me to elaborate on?`,
        timestamp: new Date()
      };
      
      setAnalysisMessages([analysisResult]);
      
      toast({
        title: "Analysis Complete!",
        description: "You can now chat with AI about the results.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysisChat = async () => {
    if (!analysisInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: analysisInput,
      timestamp: new Date()
    };

    const newMessages = [...analysisMessages, userMessage];
    setAnalysisMessages(newMessages);
    setAnalysisInput('');
    setIsAnalysisLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "Based on the conversation analysis, I'd recommend starting with a 18% discount from their asking price. The seller's language suggests urgency, which gives you negotiating power. Would you like me to craft a specific message for this situation?",
        timestamp: new Date()
      };

      setAnalysisMessages([...newMessages, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response.",
        variant: "destructive"
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 1000;

  const currentNegotiation = getCurrentNegotiation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Lowbal</h1>
          <p className="text-lg text-slate-300 font-medium">AI-Powered Negotiation Assistant</p>
        </div>
        <Link to="/account">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl shadow-lg text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Account
          </button>
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-2xl shadow-xl">
          <p className="text-emerald-100 font-medium">Total Saved</p>
          <h2 className="text-3xl font-bold text-white">${totalSavings.toLocaleString()}</h2>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl shadow-xl">
          <p className="text-blue-100 font-medium">Deals Closed</p>
          <h2 className="text-3xl font-bold text-white">{totalDeals}</h2>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-2xl shadow-xl">
          <p className="text-purple-100 font-medium">Avg. Savings</p>
          <h2 className="text-3xl font-bold text-white">${averageSavings}</h2>
        </div>
      </section>

      <section className="mb-8 flex items-center gap-6 flex-wrap">
        <button 
          onClick={() => setActiveTab('new')}
          className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            activeTab === 'new' 
              ? 'bg-white text-slate-900' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          New Negotiation
        </button>
        <button 
          onClick={() => setActiveTab('negotiate')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'negotiate' 
              ? 'bg-white text-slate-900' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Active Negotiations ({negotiationTabs.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'history' 
              ? 'bg-white text-slate-900' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'analytics' 
              ? 'bg-white text-slate-900' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Analytics
        </button>
        <button 
          onClick={startNewNegotiation}
          className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Start New
        </button>
      </section>

      {activeTab === 'new' && (
        <section className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
          {currentNegotiation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900">Working on: {currentNegotiation.title || 'Untitled Negotiation'}</h4>
                  <p className="text-blue-700">Category: {currentNegotiation.category || 'Not selected'}</p>
                </div>
                <Badge className="bg-blue-600 text-white">Active</Badge>
              </div>
            </div>
          )}

          {!selectedCategory ? (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Category</h3>
                <p className="text-slate-600 text-lg">Select the type of item you're negotiating for</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white border-2 border-slate-200 hover:border-slate-300"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">{category.name}</h4>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-600 text-white font-bold text-lg px-4 py-2">
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                </div>
                <Button
                  onClick={() => setSelectedCategory('')}
                  variant="outline"
                  className="text-slate-600 border-slate-300"
                >
                  Change Category
                </Button>
              </div>

              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 rounded-2xl p-2 h-16">
                  <TabsTrigger value="form" className="text-lg font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-lg font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg">
                    <Bot className="w-5 h-5 mr-2" />
                    AI Strategy Chat
                  </TabsTrigger>
                  <TabsTrigger value="image" className="text-lg font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg">
                    <Image className="w-5 h-5 mr-2" />
                    Image Analyzer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Panel - Listing Input */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900">Listing Details</h3>
                      
                      <div className="space-y-4">
                        <input 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors" 
                          placeholder="Listing Title"
                          value={listingTitle}
                          onChange={(e) => setListingTitle(e.target.value)}
                        />
                        <input 
                          type="number" 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors" 
                          placeholder="Listing Price ($)"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(e.target.value)}
                        />
                        <select 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors"
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                        >
                          <option value="">Select Platform</option>
                          <option value="Facebook Marketplace">Facebook Marketplace</option>
                          <option value="Craigslist">Craigslist</option>
                          <option value="Zillow">Zillow</option>
                          <option value="eBay">eBay</option>
                          <option value="OfferUp">OfferUp</option>
                        </select>
                        
                        <select 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors"
                          value={selectedTone}
                          onChange={(e) => setSelectedTone(e.target.value)}
                        >
                          <option value="">Select Negotiation Tone</option>
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="casual">Casual</option>
                          <option value="assertive">Assertive</option>
                          <option value="polite">Polite</option>
                        </select>
                        
                        <input 
                          type="number" 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors" 
                          placeholder="Your Budget (Optional)"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                        
                        <textarea 
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors" 
                          rows={4} 
                          placeholder="Extra Notes or Seller Info (Optional)"
                          value={extraNotes}
                          onChange={(e) => setExtraNotes(e.target.value)}
                        />
                        
                        <button 
                          onClick={handleGenerateOffer}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all text-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                              Generating Strategy...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 mr-3 inline" />
                              Generate Offer & Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right Panel - Generated Strategy */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900">Generated Strategy</h3>
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 min-h-[400px]">
                        {generatedOffer && generatedMessage ? (
                          <div className="space-y-6">
                            <div className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200">
                              <h4 className="font-bold text-emerald-800 mb-3 text-lg">Suggested Offer:</h4>
                              <div className="text-4xl font-bold text-emerald-600">${generatedOffer}</div>
                              {listingPrice && (
                                <div className="text-emerald-700 mt-2 font-medium">
                                  Save ${(parseFloat(listingPrice) - parseFloat(generatedOffer)).toLocaleString()} 
                                  ({Math.round(((parseFloat(listingPrice) - parseFloat(generatedOffer)) / parseFloat(listingPrice)) * 100)}% off)
                                </div>
                              )}
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                              <h4 className="font-bold text-blue-800 mb-3 text-lg">Negotiation Message:</h4>
                              <p className="text-blue-700 leading-relaxed text-lg">{generatedMessage}</p>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedMessage);
                                  toast({
                                    title: "Copied!",
                                    description: "Message copied to clipboard.",
                                  });
                                }}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Copy className="w-4 h-4 mr-2 inline" />
                                Copy Message
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-500 text-center">
                            <div>
                              <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                              <p className="text-xl font-medium">Fill in the listing details to see your personalized negotiation strategy.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">AI Strategy Chat</h3>
                    <div className="bg-slate-50 rounded-2xl p-6 h-96 overflow-y-auto border-2 border-slate-200">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                          <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-slate-700 mb-2">AI Strategy Assistant</h4>
                          <p className="text-lg">Ask me anything about your negotiation strategy, market insights, or how to improve your approach.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'ai' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-emerald-600 text-white'
                              }`}>
                                {message.type === 'ai' ? <Bot className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                              </div>
                              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                                  message.type === 'ai'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                }`}>
                                  {message.isVoice && (
                                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                                      <Mic className="w-4 h-4" />
                                      Voice Message
                                    </div>
                                  )}
                                  {message.isImage && message.imageUrl && (
                                    <div className="mb-2">
                                      <img src={message.imageUrl} alt="Shared" className="max-w-48 rounded-lg" />
                                    </div>
                                  )}
                                  <p className="text-lg leading-relaxed">{message.content}</p>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                              </div>
                              <div className="bg-blue-100 p-4 rounded-2xl border border-blue-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <textarea
                          placeholder="Ask about negotiation strategies, market insights, or get advice..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-blue-500 transition-colors resize-none"
                          rows={3}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendChatMessage();
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleVoiceRecord}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            isRecording 
                              ? 'bg-red-600 text-white animate-pulse' 
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleChatImageUpload}
                          className="hidden"
                          ref={chatFileInputRef}
                        />
                        <button
                          onClick={() => chatFileInputRef.current?.click()}
                          className="p-3 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                        >
                          <Paperclip className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleSendChatMessage}
                          disabled={!chatInput.trim()}
                          className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Send className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900">Image Analyzer</h3>
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                        {uploadedImage ? (
                          <div className="space-y-4">
                            <img src={uploadedImage} alt="Uploaded" className="max-w-full h-64 mx-auto rounded-xl shadow-lg" />
                            <p className="text-emerald-600 font-bold text-lg">Image uploaded successfully!</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <Upload className="w-16 h-16 text-slate-400 mx-auto" />
                            <div>
                              <p className="text-slate-600 text-xl font-medium mb-2">Upload a conversation screenshot</p>
                              <p className="text-slate-500">Drag and drop or click to browse</p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-6 bg-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                        >
                          Choose Image
                        </button>
                      </div>
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing || !uploadedImage}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-xl disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 mr-3 inline" />
                            Analyze Conversation
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900">Analysis & Chat</h3>
                      <div className="bg-slate-50 rounded-2xl p-6 h-80 overflow-y-auto border-2 border-slate-200">
                        {analysisMessages.length === 0 ? (
                          <div className="text-center py-16 text-slate-500">
                            <Eye className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg">Upload and analyze an image to start chatting about the results</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {analysisMessages.map((message) => (
                              <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.type === 'ai' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-emerald-600 text-white'
                                }`}>
                                  {message.type === 'ai' ? <Bot className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                </div>
                                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                  <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                                    message.type === 'ai'
                                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                  }`}>
                                    <p className="text-lg leading-relaxed">{message.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {isAnalysisLoading && (
                              <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                  <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-purple-100 p-4 rounded-2xl border border-purple-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {analysisMessages.length > 0 && (
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="Ask about the analysis results..."
                            value={analysisInput}
                            onChange={(e) => setAnalysisInput(e.target.value)}
                            className="flex-1 p-4 rounded-xl border-2 border-slate-300 text-slate-900 text-lg focus:border-purple-500 transition-colors"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAnalysisChat();
                              }
                            }}
                          />
                          <button
                            onClick={handleAnalysisChat}
                            disabled={!analysisInput.trim()}
                            className="p-4 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            <Send className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </section>
      )}

      {activeTab === 'negotiate' && (
        <section className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-slate-900">Active Negotiations</h3>
            <button
              onClick={startNewNegotiation}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-cyan-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Start New
            </button>
          </div>
          
          {negotiationTabs.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-slate-700 mb-4">No Active Negotiations</h4>
              <p className="text-slate-500 mb-8 text-lg">Start your first negotiation to begin saving money</p>
              <button
                onClick={startNewNegotiation}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-cyan-700 transition-colors text-lg"
              >
                Start New Negotiation
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {negotiationTabs.map((tab) => (
                <div key={tab.id} className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-slate-900 mb-2">{tab.title || 'Untitled Negotiation'}</h4>
                      <div className="flex items-center gap-6 text-slate-600">
                        <span>Category: {tab.category || 'Not selected'}</span>
                        <span>Platform: {tab.platform || 'Not selected'}</span>
                        {tab.originalPrice > 0 && <span>Price: ${tab.originalPrice.toLocaleString()}</span>}
                        <span>Started: {tab.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-emerald-600 text-white font-bold">Active</Badge>
                      <button
                        onClick={() => selectNegotiation(tab.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => closeNegotiationTab(tab.id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-3xl font-bold mb-8">Negotiation History</h3>
          <div className="space-y-6">
            {completedDeals.map((deal) => (
              <div key={deal.id} className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-xl">{deal.title}</h4>
                  <Badge className="bg-emerald-600 text-white font-bold">Completed</Badge>
                </div>
                <p className="text-slate-600 mb-4 text-lg">{deal.platform} • Completed {deal.completedAt.toLocaleDateString()}</p>
                <div className="flex gap-8 text-lg">
                  <span>Original: <span className="line-through">${deal.originalPrice.toLocaleString()}</span></span>
                  <span>Final: <span className="text-emerald-600 font-bold">${deal.finalPrice.toLocaleString()}</span></span>
                  <span className="text-emerald-600 font-bold">Saved ${deal.savings.toLocaleString()} ({deal.savingsPercentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'analytics' && (
        <section className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-3xl font-bold mb-8">Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-2xl font-bold">Savings by Category</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-lg">🚗 Cars</span>
                  <span className="font-bold text-emerald-600 text-xl">$2,500</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-lg">💻 Electronics</span>
                  <span className="font-bold text-emerald-600 text-xl">$250</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold">Success Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-lg">Success Rate</span>
                  <span className="font-bold text-blue-600 text-xl">78%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-bold text-lg">Avg. Response Time</span>
                  <span className="font-bold text-blue-600 text-xl">2.3 hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Deal Completion Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="bg-white text-slate-900 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-slate-900">
              Deal Completion
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-lg">
              Did you successfully close this deal?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 pt-6">
            <div className="flex gap-4">
              <Button
                onClick={() => setDealClosed(true)}
                className={`flex-1 h-14 font-bold transition-all duration-300 text-lg ${
                  dealClosed 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Yes, Deal Closed! 🎉
              </Button>
              <Button
                onClick={() => setDealClosed(false)}
                className={`flex-1 h-14 font-bold transition-all duration-300 text-lg ${
                  !dealClosed 
                    ? 'bg-slate-600 text-white hover:bg-slate-700' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                No, Just Closing
              </Button>
            </div>

            {dealClosed && (
              <div className="space-y-4 p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <Label htmlFor="finalPrice" className="text-xl font-bold text-emerald-800">
                  What was the final price?
                </Label>
                <Input
                  id="finalPrice"
                  type="number"
                  placeholder="Enter final price"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="h-14 text-xl border-2 border-emerald-300 focus:border-emerald-500 bg-white text-slate-900"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setShowDealDialog(false)}
                variant="outline"
                className="flex-1 h-14 font-bold border-2 border-slate-300 text-slate-700 text-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDealCompletion}
                className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AppPage;