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
  const [generatedOffer, setGeneratedOffer] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL Parser states
  const [url, setUrl] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  // AI Chat states
  const [sellerMessage, setSellerMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Image Analyzer states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dialog states
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [closingTabId, setClosingTabId] = useState('');
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  const { toast } = useToast();

  const createNewNegotiation = () => {
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
    setActiveTab('negotiate');
    
    toast({
      title: "New Negotiation Started",
      description: "A new negotiation tab has been created.",
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
    setShowDealDialog(false);
    setClosingTabId('');
    setDealClosed(false);
    setFinalPrice('');
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a category.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const price = parseFloat(listingPrice);
      const calculatedOffer = calculateCounterOffer(price, platform, selectedCategory);
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
      setListingTitle("MacBook Pro 13\" M2 - Like New");
      setListingPrice("1200");
      setPlatform("Facebook Marketplace");
      setExtraNotes("Barely used, original packaging included");
      
      toast({
        title: "URL Parsed Successfully!",
        description: "Listing information has been extracted.",
      });
      
      setUrl('');
      setActiveSubTab('form');
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
    if (!sellerMessage.trim() || !selectedCategory) {
      toast({
        title: "Message Required",
        description: "Please enter a message and select a category.",
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
        title: "AI Response Generated!",
        description: "Your personalized response is ready.",
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
      
      toast({
        title: "Analysis Complete!",
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
    { title: "MacBook Pro 13\" M2", savings: "$90", platform: "Facebook Marketplace" },
    { title: "iPad Pro 12.9\"", savings: "$50", platform: "Craigslist" },
    { title: "Galaxy Z Fold Used", savings: "$130", platform: "eBay" }
  ];

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 1000;

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
        <button 
          onClick={createNewNegotiation}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          New Tab
        </button>
      </section>

      {activeTab === 'new' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          {!selectedCategory ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">Choose Your Category</h3>
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700 font-bold">
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                </div>
                <Button
                  onClick={() => setSelectedCategory('')}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  Change Category
                </Button>
              </div>

              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 rounded-xl p-1 h-12">
                  <TabsTrigger value="form" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL Parser
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">
                    <Bot className="w-4 h-4 mr-2" />
                    AI Chat
                  </TabsTrigger>
                  <TabsTrigger value="image" className="text-sm font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">
                    <Image className="w-4 h-4 mr-2" />
                    Image Analyzer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    {/* Center Panel - AI Strategy */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">🤖 AI-Generated Strategy</h3>
                      <div className="border border-dashed border-gray-300 rounded-lg p-6 h-[300px] overflow-y-auto">
                        {generatedOffer && generatedMessage ? (
                          <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-bold text-green-800 mb-2">Suggested Offer:</h4>
                              <div className="text-2xl font-bold text-green-600">${generatedOffer}</div>
                              {listingPrice && (
                                <div className="text-sm text-green-700 mt-1">
                                  Save ${(parseFloat(listingPrice) - parseFloat(generatedOffer)).toLocaleString()} 
                                  ({Math.round(((parseFloat(listingPrice) - parseFloat(generatedOffer)) / parseFloat(listingPrice)) * 100)}% off)
                                </div>
                              )}
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-bold text-blue-800 mb-2">Negotiation Message:</h4>
                              <p className="text-sm text-blue-700 leading-relaxed">{generatedMessage}</p>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedMessage);
                                  toast({
                                    title: "Copied!",
                                    description: "Message copied to clipboard.",
                                  });
                                }}
                                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                Copy Message
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center">
                            Fill in the listing details to see your personalized negotiation strategy.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel - Better Deals */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">💡 Better Deals Found</h3>
                      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                        {betterDeals.map((deal, index) => (
                          <div key={index} className="bg-gray-100 rounded-lg p-3 shadow-sm hover:bg-gray-200 transition-colors">
                            <p className="font-semibold text-gray-900">{deal.title}</p>
                            <p className="text-sm text-green-600 font-medium">Save {deal.savings} • {deal.platform}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <h3 className="text-xl font-bold text-center">Smart URL Parser</h3>
                    <div className="space-y-4">
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
                  </div>
                </TabsContent>

                <TabsContent value="chat">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">AI Chat Assistant</h3>
                      <textarea
                        placeholder="Paste the seller's message here..."
                        value={sellerMessage}
                        onChange={(e) => setSellerMessage(e.target.value)}
                        className="w-full p-4 rounded-lg border border-gray-300 text-black h-32"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={isChatLoading || !sellerMessage.trim()}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all font-bold disabled:opacity-50"
                      >
                        {isChatLoading ? (
                          <>
                            <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Generating Response...
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 mr-2 inline" />
                            Get AI Response
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Conversation</h3>
                      <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                        {chatMessages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            Start a conversation by pasting a seller's message
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {chatMessages.map((message) => (
                              <div key={message.id} className={`p-3 rounded-lg ${
                                message.type === 'ai' 
                                  ? 'bg-blue-100 text-blue-900' 
                                  : 'bg-gray-200 text-gray-900'
                              }`}>
                                <div className="font-bold text-xs mb-1">
                                  {message.type === 'ai' ? 'AI Assistant' : 'Seller Message'}
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image">
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
                        <div className="text-center text-gray-500 py-8">
                          Upload and analyze an image to see AI insights
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

      {activeTab === 'negotiate' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">💬 Active Negotiations</h3>
            <button
              onClick={createNewNegotiation}
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
                onClick={createNewNegotiation}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                Create New Negotiation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {negotiationTabs.map((tab) => (
                <div key={tab.id} className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{tab.title || 'New Negotiation'}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Category: {tab.category || 'Not selected'}</span>
                      <span>Platform: {tab.platform || 'Not selected'}</span>
                      {tab.originalPrice > 0 && <span>Price: ${tab.originalPrice.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                    <button
                      onClick={() => closeNegotiationTab(tab.id)}
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