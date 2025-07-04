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
import { X, Plus, MessageSquare, Link as LinkIcon, Image, Bot, Sparkles, Star, Home, Car, Bike, Smartphone, Laptop, Sofa, CheckCircle, Copy, Send, Upload, Eye, TrendingDown, ExternalLink, MapPin, Clock } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState('negotiate');
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

  // Current negotiation states
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

  // URL Parser states
  const [url, setUrl] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  // AI Chat states
  const [sellerMessage, setSellerMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Image Analyzer states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Dialog states
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [closingTabId, setClosingTabId] = useState('');
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  const { toast } = useToast();

  // Auto-save current negotiation to active negotiations
  const saveCurrentNegotiation = () => {
    if (!selectedCategory) return;

    const negotiationData = {
      id: currentNegotiationId || Date.now().toString(),
      title: listingTitle || 'New Negotiation',
      category: selectedCategory,
      platform: platform,
      originalPrice: parseFloat(listingPrice) || 0,
      currentOffer: parseFloat(generatedOffer) || undefined,
      status: 'active' as const,
      createdAt: new Date(),
      messages: chatMessages,
      tone: selectedTone,
      budget: parseFloat(budget) || undefined
    };

    setNegotiationTabs(prev => {
      const existing = prev.find(tab => tab.id === negotiationData.id);
      if (existing) {
        return prev.map(tab => tab.id === negotiationData.id ? negotiationData : tab);
      } else {
        setCurrentNegotiationId(negotiationData.id);
        return [...prev, negotiationData];
      }
    });
  };

  // Auto-save whenever important data changes
  React.useEffect(() => {
    if (selectedCategory || listingTitle || listingPrice || platform) {
      saveCurrentNegotiation();
    }
  }, [selectedCategory, listingTitle, listingPrice, platform, generatedOffer, chatMessages, selectedTone, budget]);

  const openActiveNegotiation = (negotiation: NegotiationTab) => {
    setCurrentNegotiationId(negotiation.id);
    setSelectedCategory(negotiation.category);
    setListingTitle(negotiation.title);
    setListingPrice(negotiation.originalPrice.toString());
    setPlatform(negotiation.platform);
    setGeneratedOffer(negotiation.currentOffer?.toString() || '');
    setChatMessages(negotiation.messages);
    setSelectedTone(negotiation.tone || '');
    setBudget(negotiation.budget?.toString() || '');
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
          title: "Deal Completed Successfully",
          description: `You saved $${savings} (${savingsPercentage}% off)`,
        });
      }
    }
    
    setNegotiationTabs(prev => prev.filter(t => t.id !== closingTabId));
    
    // Clear current negotiation if it's the one being closed
    if (currentNegotiationId === closingTabId) {
      setCurrentNegotiationId(null);
      setSelectedCategory('');
      setListingTitle('');
      setListingPrice('');
      setPlatform('');
      setGeneratedOffer('');
      setChatMessages([]);
      setSelectedTone('');
      setBudget('');
    }
    
    setShowDealDialog(false);
    setClosingTabId('');
    setDealClosed(false);
    setFinalPrice('');
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform || !selectedCategory || !selectedTone || !budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including tone and budget.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(listingPrice);
    const maxBudget = parseFloat(budget);

    if (maxBudget >= price) {
      toast({
        title: "Invalid Budget",
        description: "Your budget must be lower than the listing price.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedOffer = Math.min(
        calculateCounterOffer(price, platform, selectedCategory),
        maxBudget
      );
      
      const message = await generateNegotiationMessage(
        listingTitle, 
        price, 
        calculatedOffer, 
        platform, 
        extraNotes,
        selectedCategory
      );
      
      setGeneratedOffer(calculatedOffer.toString());
      setGeneratedMessage(message);
      
      // Add to chat
      const aiMessage = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: message,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Offer Generated Successfully",
        description: "Your negotiation strategy is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
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
      
      const mockData = {
        title: "MacBook Pro 13\" M2 - Like New",
        price: "1200",
        platform: "Facebook Marketplace",
        description: "Barely used, original packaging included"
      };
      
      setParsedData(mockData);
      
      toast({
        title: "URL Parsed Successfully",
        description: "Listing information has been extracted.",
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

  const handleSendChatMessage = async () => {
    if (!sellerMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message.",
        variant: "destructive"
      });
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: sellerMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setSellerMessage('');
    setIsChatLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "Thank you for your interest! I understand you're looking for the right deal. Based on current market conditions and the item's condition, would you consider $850? I'm ready to complete the purchase today if we can agree on this price.",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "AI Response Generated",
        description: "Your personalized response is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI response.",
        variant: "destructive"
      });
    } finally {
      setIsChatLoading(false);
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
      
      setAnalysisResult({
        sentiment: 'positive',
        priceFlexibility: 'high',
        urgency: 'medium',
        suggestedResponse: 'Based on the conversation analysis, the seller seems motivated to sell quickly. I recommend offering 15-20% below asking price.'
      });
      
      toast({
        title: "Analysis Complete",
        description: "Conversation analyzed with AI insights.",
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

  const betterDeals = [
    { title: "MacBook Pro 13\" M2", savings: "$90", platform: "Facebook Marketplace", location: "San Francisco, CA", timeLeft: "2h left" },
    { title: "iPad Pro 12.9\"", savings: "$50", platform: "Craigslist", location: "Los Angeles, CA", timeLeft: "1 day left" },
    { title: "Galaxy Z Fold Used", savings: "$130", platform: "eBay", location: "New York, NY", timeLeft: "3h left" }
  ];

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 1000;

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'assertive', label: 'Assertive' },
    { value: 'polite', label: 'Polite' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Lowbal</h1>
              <p className="text-sm text-gray-300 font-medium">AI-Powered Negotiation Assistant</p>
            </div>
            <Link to="/account">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300">
                Account
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-xl shadow-lg">
            <p className="text-sm text-emerald-100 font-medium">Total Saved</p>
            <h2 className="text-3xl font-bold text-white">${totalSavings.toLocaleString()}</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
            <p className="text-sm text-blue-100 font-medium">Deals Closed</p>
            <h2 className="text-3xl font-bold text-white">{totalDeals}</h2>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg">
            <p className="text-sm text-purple-100 font-medium">Avg. Savings</p>
            <h2 className="text-3xl font-bold text-white">${averageSavings}</h2>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={() => setActiveTab('negotiate')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'negotiate' 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              New Negotiation
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'active' 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Active Negotiations ({negotiationTabs.length})
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'history' 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'analytics' 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>
        </section>

        {/* Main Content */}
        {activeTab === 'negotiate' && (
          <section className="bg-white text-gray-900 rounded-xl shadow-xl">
            {!selectedCategory ? (
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Category</h3>
                  <p className="text-gray-600">Select the type of item you're negotiating for</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Card
                        key={category.id}
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border border-gray-200 hover:border-gray-300"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{category.name}</h4>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1">
                      Category: {categories.find(c => c.id === selectedCategory)?.name}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setSelectedCategory('')}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300"
                  >
                    Change Category
                  </Button>
                </div>

                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 rounded-xl p-1 h-14">
                    <TabsTrigger value="form" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger value="url" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-700">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      URL Parser
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-700">
                      <Bot className="w-4 h-4 mr-2" />
                      AI Chat
                    </TabsTrigger>
                    <TabsTrigger value="image" className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-700">
                      <Image className="w-4 h-4 mr-2" />
                      Image Analyzer
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="form">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Panel - Input Form */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Listing Details</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Listing Title</Label>
                            <Input 
                              placeholder="Enter listing title"
                              value={listingTitle}
                              onChange={(e) => setListingTitle(e.target.value)}
                              className="mt-1 h-11 border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Listing Price ($)</Label>
                            <Input 
                              type="number" 
                              placeholder="Enter listing price"
                              value={listingPrice}
                              onChange={(e) => setListingPrice(e.target.value)}
                              className="mt-1 h-11 border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                              <SelectTrigger className="mt-1 h-11 border-gray-300">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Facebook Marketplace">Facebook Marketplace</SelectItem>
                                <SelectItem value="Craigslist">Craigslist</SelectItem>
                                <SelectItem value="Zillow">Zillow</SelectItem>
                                <SelectItem value="eBay">eBay</SelectItem>
                                <SelectItem value="OfferUp">OfferUp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">AI Tone</Label>
                              <Select value={selectedTone} onValueChange={setSelectedTone}>
                                <SelectTrigger className="mt-1 h-11 border-gray-300">
                                  <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                  {toneOptions.map(tone => (
                                    <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Max Budget ($)</Label>
                              <Input 
                                type="number" 
                                placeholder="Your max budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="mt-1 h-11 border-gray-300"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Extra Notes (Optional)</Label>
                            <Textarea 
                              placeholder="Additional context about the item or seller"
                              value={extraNotes}
                              onChange={(e) => setExtraNotes(e.target.value)}
                              className="mt-1 border-gray-300"
                              rows={3}
                            />
                          </div>
                          
                          <Button 
                            onClick={handleGenerateOffer}
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold disabled:opacity-50"
                          >
                            {isLoading ? (
                              <>
                                <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Generating Strategy...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Offer & Strategy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Right Panel - AI Chat */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">AI Strategy Chat</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto border">
                          {chatMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-sm">Generate an offer to start chatting with AI about your strategy</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {chatMessages.map((message) => (
                                <div key={message.id} className={`p-3 rounded-lg ${
                                  message.type === 'ai' 
                                    ? 'bg-blue-100 text-blue-900 ml-4' 
                                    : 'bg-gray-200 text-gray-900 mr-4'
                                }`}>
                                  <div className="font-semibold text-xs mb-1">
                                    {message.type === 'ai' ? 'AI Assistant' : 'You'}
                                  </div>
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  {message.type === 'ai' && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(message.content);
                                        toast({ title: "Copied to clipboard" });
                                      }}
                                      className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                    >
                                      <Copy className="w-3 h-3 mr-1 inline" />
                                      Copy
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Ask AI about your negotiation strategy..."
                            value={sellerMessage}
                            onChange={(e) => setSellerMessage(e.target.value)}
                            className="flex-1 h-11 border-gray-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !isChatLoading) {
                                handleSendChatMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendChatMessage}
                            disabled={isChatLoading || !sellerMessage.trim()}
                            className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isChatLoading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="url">
                    <div className="space-y-6">
                      <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-xl font-bold text-center text-gray-900">Smart URL Parser</h3>
                        <div className="space-y-4">
                          <Input
                            type="url"
                            placeholder="https://facebook.com/marketplace/item/... or any listing URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="h-12 text-base border-gray-300"
                          />
                          <Button
                            onClick={handleParseUrl}
                            disabled={isParsingUrl || !url}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                          >
                            {isParsingUrl ? (
                              <>
                                <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Parsing URL...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Parse Listing Information
                              </>
                            )}
                          </Button>
                        </div>

                        {parsedData && (
                          <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-bold text-green-800 mb-2">Parsed Successfully!</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Title:</strong> {parsedData.title}</p>
                                <p><strong>Price:</strong> ${parsedData.price}</p>
                                <p><strong>Platform:</strong> {parsedData.platform}</p>
                                <p><strong>Description:</strong> {parsedData.description}</p>
                              </div>
                              <Button
                                onClick={() => {
                                  setListingTitle(parsedData.title);
                                  setListingPrice(parsedData.price);
                                  setPlatform(parsedData.platform);
                                  setExtraNotes(parsedData.description);
                                  setActiveSubTab('form');
                                }}
                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                Use This Data
                              </Button>
                            </div>

                            {/* Better Deals for URL Parser */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h4 className="font-bold text-gray-900 mb-3">Better Deals Found</h4>
                              <div className="space-y-3">
                                {betterDeals.map((deal, index) => (
                                  <div key={index} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-gray-900">{deal.title}</p>
                                      <p className="text-sm text-gray-600">{deal.platform} • {deal.location}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-green-600 font-semibold">Save {deal.savings}</p>
                                      <p className="text-xs text-red-600">{deal.timeLeft}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chat">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <h3 className="text-xl font-bold text-center text-gray-900">AI Conversation Assistant</h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700">Seller's Message</Label>
                          <Textarea
                            placeholder="Paste the seller's message here..."
                            value={sellerMessage}
                            onChange={(e) => setSellerMessage(e.target.value)}
                            className="h-32 border-gray-300"
                          />
                          <Button
                            onClick={handleSendChatMessage}
                            disabled={isChatLoading || !sellerMessage.trim()}
                            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50"
                          >
                            {isChatLoading ? (
                              <>
                                <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Generating Response...
                              </>
                            ) : (
                              <>
                                <Bot className="w-4 h-4 mr-2" />
                                Get AI Response
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700">Conversation</Label>
                          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border">
                            {chatMessages.length === 0 ? (
                              <div className="text-center text-gray-500 py-12">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-sm">Start a conversation by pasting a seller's message</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {chatMessages.map((message) => (
                                  <div key={message.id} className={`p-3 rounded-lg ${
                                    message.type === 'ai' 
                                      ? 'bg-blue-100 text-blue-900' 
                                      : 'bg-gray-200 text-gray-900'
                                  }`}>
                                    <div className="font-semibold text-xs mb-1">
                                      {message.type === 'ai' ? 'AI Assistant' : 'Seller Message'}
                                    </div>
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    {message.type === 'ai' && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(message.content);
                                          toast({ title: "Copied to clipboard" });
                                        }}
                                        className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                      >
                                        <Copy className="w-3 h-3 mr-1 inline" />
                                        Copy
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <h3 className="text-xl font-bold text-center text-gray-900">Image Analyzer</h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700">Upload Conversation Screenshot</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            {uploadedImage ? (
                              <div className="space-y-4">
                                <img src={uploadedImage} alt="Uploaded" className="max-w-full h-48 mx-auto rounded-lg" />
                                <p className="text-green-600 font-semibold">Image uploaded successfully!</p>
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
                          <Button
                            onClick={analyzeImage}
                            disabled={isAnalyzing || !uploadedImage}
                            className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold disabled:opacity-50"
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Analyze Conversation
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-gray-700">Analysis Results</Label>
                          <div className="bg-gray-50 rounded-lg p-4 h-64 border">
                            {analysisResult ? (
                              <div className="space-y-4">
                                <div className="bg-white p-3 rounded border">
                                  <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                                  <p className="text-sm text-gray-700 mb-2"><strong>Sentiment:</strong> {analysisResult.sentiment}</p>
                                  <p className="text-sm text-gray-700 mb-2"><strong>Price Flexibility:</strong> {analysisResult.priceFlexibility}</p>
                                  <p className="text-sm text-gray-700 mb-2"><strong>Urgency:</strong> {analysisResult.urgency}</p>
                                  <p className="text-sm text-gray-700"><strong>Suggestion:</strong> {analysisResult.suggestedResponse}</p>
                                </div>

                                {/* Better Deals for Image Analyzer */}
                                <div className="bg-white p-3 rounded border">
                                  <h4 className="font-semibold text-gray-900 mb-2">Better Deals Found</h4>
                                  <div className="space-y-2">
                                    {betterDeals.slice(0, 2).map((deal, index) => (
                                      <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">{deal.title}</span>
                                        <span className="text-green-600 font-semibold">Save {deal.savings}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-12">
                                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-sm">Upload and analyze an image to see AI insights</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </section>
        )}

        {activeTab === 'active' && (
          <section className="bg-white text-gray-900 p-8 rounded-xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Active Negotiations</h3>
            </div>
            
            {negotiationTabs.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-700 mb-2">No Active Negotiations</h4>
                <p className="text-gray-500 mb-6">Start your first negotiation to begin saving money</p>
                <Button
                  onClick={() => setActiveTab('negotiate')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3"
                >
                  Start New Negotiation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {negotiationTabs.map((tab) => (
                  <div key={tab.id} className="bg-gray-50 p-6 rounded-lg border hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => openActiveNegotiation(tab)}>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{tab.title || 'New Negotiation'}</h4>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span><strong>Category:</strong> {tab.category || 'Not selected'}</span>
                          <span><strong>Platform:</strong> {tab.platform || 'Not selected'}</span>
                          {tab.originalPrice > 0 && <span><strong>Price:</strong> ${tab.originalPrice.toLocaleString()}</span>}
                          {tab.currentOffer && <span><strong>Offer:</strong> ${tab.currentOffer.toLocaleString()}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-emerald-100 text-emerald-700 font-semibold">Active</Badge>
                          <span className="text-xs text-gray-500">Created {tab.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => closeNegotiationTab(tab.id)}
                        variant="destructive"
                        size="sm"
                        className="ml-4"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'history' && (
          <section className="bg-white text-gray-900 p-8 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Negotiation History</h3>
            <div className="space-y-4">
              {completedDeals.map((deal) => (
                <div key={deal.id} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{deal.title}</h4>
                    <Badge className="bg-green-100 text-green-700 font-semibold">Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{deal.platform} • Completed {deal.completedAt.toLocaleDateString()}</p>
                  <div className="flex gap-6 text-sm">
                    <span><strong>Original:</strong> <span className="line-through">${deal.originalPrice.toLocaleString()}</span></span>
                    <span><strong>Final:</strong> <span className="text-green-600 font-bold">${deal.finalPrice.toLocaleString()}</span></span>
                    <span className="text-green-600 font-bold">Saved ${deal.savings.toLocaleString()} ({deal.savingsPercentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="bg-white text-gray-900 p-8 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Savings by Category</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Cars</span>
                    <span className="font-bold text-green-600">$2,500</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Electronics</span>
                    <span className="font-bold text-green-600">$250</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Success Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Success Rate</span>
                    <span className="font-bold text-blue-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Avg. Response Time</span>
                    <span className="font-bold text-blue-600">2.3 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Deal Completion Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="bg-white text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
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
                className={`flex-1 h-12 font-semibold transition-all duration-300 ${
                  dealClosed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Yes, Deal Closed!
              </Button>
              <Button
                onClick={() => setDealClosed(false)}
                className={`flex-1 h-12 font-semibold transition-all duration-300 ${
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
                  className="h-12 text-lg border-2 border-green-300 focus:border-green-500"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setShowDealDialog(false)}
                variant="outline"
                className="flex-1 h-12 font-semibold border-2 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDealCompletion}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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