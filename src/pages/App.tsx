import React, { useState } from 'react';
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
import { X, Plus, MessageSquare, Link as LinkIcon, Image, Bot, Sparkles, Star, Home, Car, Bike, Smartphone, Laptop, Sofa, CheckCircle, Copy, Send, Upload, Eye, TrendingDown, ExternalLink, MapPin, Clock, DollarSign, Zap, Target } from "lucide-react";
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
  const [negotiationTabs, setNegotiationTabs] = useState<NegotiationTab[]>([]);
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(null);
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
  const [userBudget, setUserBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL Parser states
  const [url, setUrl] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);
  const [urlParsedData, setUrlParsedData] = useState<any>(null);
  const [urlBetterDeals, setUrlBetterDeals] = useState<any[]>([]);

  // AI Chat states
  const [aiChatMessages, setAiChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);

  // Image Analyzer states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any>(null);
  const [imageBetterDeals, setImageBetterDeals] = useState<any[]>([]);

  // Dialog states
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [closingTabId, setClosingTabId] = useState('');
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  const { toast } = useToast();

  const startNewNegotiation = () => {
    const newTab: NegotiationTab = {
      id: Date.now().toString(),
      title: 'New Negotiation',
      category: '',
      platform: '',
      originalPrice: 0,
      status: 'active',
      createdAt: new Date(),
      messages: []
    };
    
    setNegotiationTabs(prev => [...prev, newTab]);
    setActiveNegotiationId(newTab.id);
    setActiveTab('negotiate');
    
    toast({
      title: "New Negotiation Started",
      description: "A new negotiation has been created.",
    });
  };

  const openNegotiation = (tabId: string) => {
    setActiveNegotiationId(tabId);
    setActiveTab('negotiate');
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
    setShowDealDialog(false);
    setClosingTabId('');
    setDealClosed(false);
    setFinalPrice('');
    setActiveNegotiationId(null);
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform || !selectedCategory || !selectedTone || !userBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including tone and budget.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const price = parseFloat(listingPrice);
      const budget = parseFloat(userBudget);
      
      if (budget >= price) {
        toast({
          title: "Budget Too High",
          description: "Your budget should be lower than the listing price for negotiation.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const calculatedOffer = Math.min(calculateCounterOffer(price, platform, selectedCategory), budget);
      const message = await generateNegotiationMessage(
        listingTitle, 
        price, 
        calculatedOffer, 
        platform, 
        extraNotes,
        selectedCategory
      );
      
      // Update the current negotiation
      if (activeNegotiationId) {
        setNegotiationTabs(prev => prev.map(tab => 
          tab.id === activeNegotiationId 
            ? {
                ...tab,
                title: listingTitle,
                category: selectedCategory,
                platform: platform,
                originalPrice: price,
                currentOffer: calculatedOffer,
                tone: selectedTone,
                budget: budget,
                messages: [
                  ...tab.messages,
                  {
                    id: Date.now().toString(),
                    type: 'ai',
                    content: message,
                    timestamp: new Date()
                  }
                ]
              }
            : tab
        ));
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

  const handleParseUrl = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a listing URL to parse.",
        variant: "destructive"
      });
      return;
    }

    setIsParsingUrl(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed data
      const parsedData = {
        title: "MacBook Pro 13\" M2 - Like New",
        price: "1200",
        platform: "Facebook Marketplace",
        notes: "Barely used, original packaging included"
      };
      
      setUrlParsedData(parsedData);
      
      // Generate better deals
      const betterDeals = [
        { title: "MacBook Pro 13\" M2", savings: "$90", platform: "Facebook Marketplace", location: "San Francisco, CA" },
        { title: "MacBook Pro 13\" M1", savings: "$150", platform: "Craigslist", location: "Oakland, CA" },
        { title: "MacBook Air M2", savings: "$200", platform: "eBay", location: "San Jose, CA" }
      ];
      setUrlBetterDeals(betterDeals);
      
      toast({
        title: "URL Parsed Successfully!",
        description: "Listing information has been extracted and better deals found.",
      });
      
      setUrl('');
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Unable to parse the listing URL.",
        variant: "destructive"
      });
    } finally {
      setIsParsingUrl(false);
    }
  };

  const handleAiChatSend = async () => {
    if (!aiChatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: aiChatInput,
      timestamp: new Date()
    };

    setAiChatMessages(prev => [...prev, userMessage]);
    setAiChatInput('');
    setIsAiChatLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "I understand your negotiation strategy. Based on what you've shared, I recommend starting with a 15-20% lower offer than the asking price. Would you like me to help craft a specific message for this seller?",
        timestamp: new Date()
      };

      setAiChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response.",
        variant: "destructive"
      });
    } finally {
      setIsAiChatLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
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
        sentiment: 'positive',
        priceFlexibility: 'high',
        urgency: 'medium',
        suggestedOffer: '$850',
        confidence: '87%'
      };
      
      setImageAnalysisResult(analysisResult);
      
      // Generate better deals for image analysis
      const betterDeals = [
        { title: "Similar iPhone 14 Pro", savings: "$120", platform: "eBay", location: "Los Angeles, CA" },
        { title: "iPhone 14 Pro Max", savings: "$80", platform: "Facebook Marketplace", location: "San Diego, CA" },
        { title: "iPhone 13 Pro", savings: "$200", platform: "Craigslist", location: "Sacramento, CA" }
      ];
      setImageBetterDeals(betterDeals);
      
      toast({
        title: "Analysis Complete!",
        description: "Conversation analyzed with AI insights and better deals found.",
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

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 1000;

  const currentNegotiation = activeNegotiationId ? negotiationTabs.find(t => t.id === activeNegotiationId) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🧠 Lowbal</h1>
          <p className="text-sm text-gray-300">AI-Powered Negotiation Assistant</p>
        </div>
        <Link to="/account">
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg shadow-md text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            Account
          </button>
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-600 p-4 rounded-xl shadow-md">
          <p className="text-sm text-white/80">Total Saved</p>
          <h2 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h2>
        </div>
        <div className="bg-green-500 p-4 rounded-xl shadow-md">
          <p className="text-sm text-white/80">Deals Closed</p>
          <h2 className="text-2xl font-bold">{totalDeals}</h2>
        </div>
        <div className="bg-green-400 p-4 rounded-xl shadow-md">
          <p className="text-sm text-white/80">Avg. Savings</p>
          <h2 className="text-2xl font-bold">${averageSavings}</h2>
        </div>
      </section>

      <section className="mb-6 flex items-center gap-4 flex-wrap">
        <button 
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-300 ${
            activeTab === 'new' 
              ? 'bg-white text-black' 
              : 'bg-gray-800 text-white/70 hover:bg-gray-700'
          }`}
        >
          📦 New Negotiation
        </button>
        <button 
          onClick={() => setActiveTab('negotiate')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'negotiate' 
              ? 'bg-white text-black' 
              : 'bg-gray-800 text-white/70 hover:bg-gray-700'
          }`}
        >
          💬 Active Negotiations ({negotiationTabs.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'history' 
              ? 'bg-white text-black' 
              : 'bg-gray-800 text-white/70 hover:bg-gray-700'
          }`}
        >
          🔁 History
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'analytics' 
              ? 'bg-white text-black' 
              : 'bg-gray-800 text-white/70 hover:bg-gray-700'
          }`}
        >
          📊 Analytics
        </button>
      </section>

      {activeTab === 'new' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-emerald-500/30">
              <MessageSquare className="w-16 h-16 text-emerald-400" />
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-8">Start Your First Negotiation</h3>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Create a new negotiation to begin saving money with AI-powered strategies. 
              Use our advanced tools to parse listings, analyze conversations, and get perfect responses.
            </p>
            <button 
              onClick={startNewNegotiation}
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border-0"
            >
              <Plus className="w-8 h-8 mr-4 inline" />
              Start New Negotiation
            </button>
          </div>
        </section>
      )}

      {activeTab === 'negotiate' && !currentNegotiation && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">💬 Active Negotiations</h3>
            <button
              onClick={startNewNegotiation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              New Negotiation
            </button>
          </div>
          
          {negotiationTabs.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-700 mb-2">No Active Negotiations</h4>
              <p className="text-gray-500 mb-6">Start your first negotiation to begin saving money</p>
              <button
                onClick={startNewNegotiation}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                Create New Negotiation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {negotiationTabs.map((tab) => (
                <div key={tab.id} className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => openNegotiation(tab.id)}>
                  <div>
                    <h4 className="font-bold text-lg">{tab.title || 'New Negotiation'}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Category: {tab.category || 'Not selected'}</span>
                      <span>Platform: {tab.platform || 'Not selected'}</span>
                      {tab.originalPrice > 0 && <span>Price: ${tab.originalPrice.toLocaleString()}</span>}
                      {tab.currentOffer && <span>Offer: ${tab.currentOffer.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeNegotiationTab(tab.id);
                      }}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'negotiate' && currentNegotiation && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveNegotiationId(null)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Negotiations
              </button>
              <h3 className="text-2xl font-bold">{currentNegotiation.title || 'New Negotiation'}</h3>
              {currentNegotiation.category && (
                <Badge className="bg-blue-100 text-blue-700 font-bold">
                  {categories.find(c => c.id === currentNegotiation.category)?.name}
                </Badge>
              )}
            </div>
            <button
              onClick={() => closeNegotiationTab(currentNegotiation.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Close Negotiation
            </button>
          </div>

          {!currentNegotiation.category ? (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-center">Choose Your Category</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gray-50 border border-gray-200 hover:border-gray-300 p-6 text-center rounded-xl"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setNegotiationTabs(prev => prev.map(tab => 
                          tab.id === currentNegotiation.id 
                            ? { ...tab, category: category.id }
                            : tab
                        ));
                      }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{category.name}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 rounded-xl p-1 h-12">
                <TabsTrigger value="form" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="url" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL Parser
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="image" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">
                  <Image className="w-4 h-4 mr-2" />
                  Image Analyzer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Panel - Listing Input */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">📝 Listing Details</h3>
                    <input 
                      className="w-full p-3 rounded-md border border-gray-300 text-black" 
                      placeholder="Listing Title"
                      value={listingTitle}
                      onChange={(e) => setListingTitle(e.target.value)}
                    />
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-md border border-gray-300 text-black" 
                      placeholder="Listing Price ($)"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                    />
                    <select 
                      className="w-full p-3 rounded-md border border-gray-300 text-black"
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
                    
                    {/* AI Tone Selection */}
                    <select 
                      className="w-full p-3 rounded-md border border-gray-300 text-black"
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                    >
                      <option value="">Select AI Tone</option>
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="assertive">Assertive</option>
                      <option value="polite">Polite</option>
                    </select>
                    
                    {/* Budget Input */}
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-md border border-gray-300 text-black" 
                      placeholder="Your Budget ($)"
                      value={userBudget}
                      onChange={(e) => setUserBudget(e.target.value)}
                    />
                    
                    <textarea 
                      className="w-full p-3 rounded-md border border-gray-300 text-black" 
                      rows={3} 
                      placeholder="Extra Notes or Seller Info (Optional)"
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                    />
                    <button 
                      onClick={handleGenerateOffer}
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:scale-105 transition-all text-lg font-bold shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        '🚀 Generate Offer & Message'
                      )}
                    </button>
                  </div>

                  {/* Right Panel - AI Conversation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🤖 AI Strategy Conversation</h3>
                    <div className="border border-gray-300 rounded-lg h-[400px] flex flex-col">
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {aiChatMessages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Start a conversation with the AI about your negotiation strategy</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {aiChatMessages.map((message) => (
                              <div key={message.id} className={`p-3 rounded-lg ${
                                message.type === 'ai' 
                                  ? 'bg-blue-100 text-blue-900 ml-4' 
                                  : 'bg-gray-200 text-gray-900 mr-4'
                              }`}>
                                <div className="font-bold text-xs mb-1">
                                  {message.type === 'ai' ? '🤖 AI Assistant' : '👤 You'}
                                </div>
                                <p className="text-sm">{message.content}</p>
                                {message.type === 'ai' && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(message.content);
                                      toast({ title: "Copied!", description: "Message copied to clipboard." });
                                    }}
                                    className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                  >
                                    <Copy className="w-3 h-3 mr-1 inline" />
                                    Copy
                                  </button>
                                )}
                              </div>
                            ))}
                            {isAiChatLoading && (
                              <div className="p-3 rounded-lg bg-blue-100 text-blue-900 ml-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                  <span className="text-sm">AI is thinking...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-300 bg-white">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask the AI about your negotiation strategy..."
                            value={aiChatInput}
                            onChange={(e) => setAiChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAiChatSend()}
                            className="flex-1 p-2 border border-gray-300 rounded text-black"
                          />
                          <button
                            onClick={handleAiChatSend}
                            disabled={!aiChatInput.trim() || isAiChatLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url">
                <div className="space-y-6">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <h3 className="text-xl font-bold text-center">Smart URL Parser</h3>
                    <input
                      type="url"
                      placeholder="https://facebook.com/marketplace/item/... or any listing URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-4 rounded-lg border border-gray-300 text-black text-lg"
                    />
                    <button
                      onClick={handleParseUrl}
                      disabled={isParsingUrl || !url}
                      className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-bold disabled:opacity-50"
                    >
                      {isParsingUrl ? (
                        <>
                          <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Parsing URL...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 inline" />
                          Parse Listing Information
                        </>
                      )}
                    </button>
                  </div>

                  {urlParsedData && (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-bold mb-4">📋 Parsed Information</h4>
                        <div className="space-y-3">
                          <div><strong>Title:</strong> {urlParsedData.title}</div>
                          <div><strong>Price:</strong> ${urlParsedData.price}</div>
                          <div><strong>Platform:</strong> {urlParsedData.platform}</div>
                          <div><strong>Notes:</strong> {urlParsedData.notes}</div>
                        </div>
                        <button
                          onClick={() => {
                            setListingTitle(urlParsedData.title);
                            setListingPrice(urlParsedData.price);
                            setPlatform(urlParsedData.platform);
                            setExtraNotes(urlParsedData.notes);
                            setActiveSubTab('form');
                          }}
                          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                          Use This Information
                        </button>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-bold mb-4">💡 Better Deals Found</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {urlBetterDeals.map((deal, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm border">
                              <p className="font-semibold text-gray-900">{deal.title}</p>
                              <p className="text-sm text-green-600 font-medium">Save {deal.savings} • {deal.platform}</p>
                              <p className="text-xs text-gray-500">{deal.location}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="chat">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl font-bold text-center mb-6">AI Chat Assistant</h3>
                  <div className="border border-gray-300 rounded-lg h-[500px] flex flex-col bg-white">
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                      {aiChatMessages.length === 0 ? (
                        <div className="text-center text-gray-500 py-16">
                          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h4 className="text-xl font-bold text-gray-700 mb-2">Chat with AI Assistant</h4>
                          <p className="text-gray-500">Ask questions about negotiation strategies, get advice, or discuss your approach</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {aiChatMessages.map((message) => (
                            <div key={message.id} className={`flex gap-4 ${
                              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'ai' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-500 text-white'
                              }`}>
                                {message.type === 'ai' ? '🤖' : '👤'}
                              </div>
                              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-4 rounded-lg max-w-[80%] ${
                                  message.type === 'ai'
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-gray-200 text-gray-900'
                                }`}>
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  {message.type === 'ai' && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(message.content);
                                        toast({ title: "Copied!", description: "Message copied to clipboard." });
                                      }}
                                      className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                      <Copy className="w-3 h-3 mr-1 inline" />
                                      Copy
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isAiChatLoading && (
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                🤖
                              </div>
                              <div className="flex-1">
                                <div className="inline-block p-4 rounded-lg bg-blue-100 text-blue-900">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                    <span className="text-sm">AI is thinking...</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-300 bg-white">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Ask the AI about negotiation strategies, tips, or specific situations..."
                          value={aiChatInput}
                          onChange={(e) => setAiChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAiChatSend()}
                          className="flex-1 p-3 border border-gray-300 rounded-lg text-black text-base"
                        />
                        <button
                          onClick={handleAiChatSend}
                          disabled={!aiChatInput.trim() || isAiChatLoading}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Image Analyzer</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {uploadedImage ? (
                          <div className="space-y-4">
                            <img src={uploadedImage} alt="Uploaded" className="max-w-full h-48 mx-auto rounded-lg" />
                            <p className="text-green-600 font-medium">Image uploaded successfully!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-600">Upload a conversation screenshot</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                          Choose Image
                        </label>
                      </div>
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing || !uploadedImage}
                        className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-all font-bold disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2 inline" />
                            Analyze Conversation
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Analysis Results</h3>
                      <div className="bg-gray-50 rounded-lg p-4 h-64">
                        {imageAnalysisResult ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Sentiment</div>
                                <div className="font-bold text-green-600 capitalize">{imageAnalysisResult.sentiment}</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Price Flexibility</div>
                                <div className="font-bold text-blue-600 capitalize">{imageAnalysisResult.priceFlexibility}</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Suggested Offer</div>
                                <div className="font-bold text-purple-600">{imageAnalysisResult.suggestedOffer}</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Confidence</div>
                                <div className="font-bold text-orange-600">{imageAnalysisResult.confidence}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            Upload and analyze an image to see AI insights
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {imageBetterDeals.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-4">💡 Better Deals Found</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {imageBetterDeals.map((deal, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                            <p className="font-semibold text-gray-900">{deal.title}</p>
                            <p className="text-sm text-green-600 font-medium">Save {deal.savings} • {deal.platform}</p>
                            <p className="text-xs text-gray-500">{deal.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <h3 className="text-2xl font-bold mb-6">🔁 Negotiation History</h3>
          <div className="space-y-4">
            {completedDeals.map((deal) => (
              <div key={deal.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{deal.title}</h4>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">Completed</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{deal.platform} • Completed {deal.completedAt.toLocaleDateString()}</p>
                <div className="flex gap-4 text-sm">
                  <span>Original: <span className="line-through">${deal.originalPrice.toLocaleString()}</span></span>
                  <span>Final: <span className="text-green-600 font-bold">${deal.finalPrice.toLocaleString()}</span></span>
                  <span className="text-green-600 font-bold">Saved ${deal.savings.toLocaleString()} ({deal.savingsPercentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'analytics' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <h3 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Savings by Category</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">🚗 Cars</span>
                  <span className="font-bold text-green-600">$2,500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">💻 Electronics</span>
                  <span className="font-bold text-green-600">$250</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Success Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Success Rate</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Avg. Response Time</span>
                  <span className="font-bold text-blue-600">2.3 hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Deal Completion Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="bg-white text-black max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Deal Completion
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Did you successfully close this deal?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setDealClosed(true)}
                className={`flex-1 h-12 font-bold transition-all duration-300 ${
                  dealClosed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Yes, Deal Closed! 🎉
              </Button>
              <Button
                onClick={() => setDealClosed(false)}
                className={`flex-1 h-12 font-bold transition-all duration-300 ${
                  !dealClosed 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                No, Just Closing
              </Button>
            </div>

            {dealClosed && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <Label htmlFor="finalPrice" className="text-lg font-bold text-green-800">
                  What was the final price?
                </Label>
                <Input
                  id="finalPrice"
                  type="number"
                  placeholder="Enter final price"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="h-12 text-lg border-2 border-green-300 focus:border-green-500 bg-white text-gray-900"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setShowDealDialog(false)}
                variant="outline"
                className="flex-1 h-12 font-bold border-2 border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDealCompletion}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
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