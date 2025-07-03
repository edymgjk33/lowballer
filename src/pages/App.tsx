import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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

const AppPage = () => {
  const [listingTitle, setListingTitle] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [generatedOffer, setGeneratedOffer] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const { toast } = useToast();

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const price = parseFloat(listingPrice);
      const calculatedOffer = calculateCounterOffer(price, platform);
      const message = await generateNegotiationMessage(
        listingTitle, 
        price, 
        calculatedOffer, 
        platform, 
        extraNotes
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

  const betterDeals = [
    {
      title: "MacBook Pro 13\" M2",
      savings: "$90",
      platform: "Facebook Marketplace"
    },
    {
      title: "iPad Pro 12.9\"",
      savings: "$50",
      platform: "Craigslist"
    },
    {
      title: "Galaxy Z Fold Used",
      savings: "$130",
      platform: "eBay"
    }
  ];

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
          <h2 className="text-2xl font-bold">$3,000</h2>
        </div>
        <div className="bg-green-500 p-4 rounded-xl shadow-md">
          <p className="text-sm text-white/80">Deals Closed</p>
          <h2 className="text-2xl font-bold">3</h2>
        </div>
        <div className="bg-green-400 p-4 rounded-xl shadow-md">
          <p className="text-sm text-white/80">Avg. Savings</p>
          <h2 className="text-2xl font-bold">$1,000</h2>
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
        <section className="bg-white text-black p-6 rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Select a category & listing to see your personalized negotiation strategy.
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
        </section>
      )}

      {activeTab === 'history' && (
        <section className="bg-white text-black p-6 rounded-xl shadow-xl">
          <h3 className="text-2xl font-bold mb-6">🔁 Negotiation History</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">2019 Honda Civic</h4>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Facebook Marketplace • Completed Jan 15, 2024</p>
              <div className="flex gap-4 text-sm">
                <span>Original: <span className="line-through">$18,000</span></span>
                <span>Final: <span className="text-green-600 font-bold">$15,500</span></span>
                <span className="text-green-600 font-bold">Saved $2,500 (14%)</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">MacBook Pro 13"</h4>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Craigslist • Completed Jan 10, 2024</p>
              <div className="flex gap-4 text-sm">
                <span>Original: <span className="line-through">$1,200</span></span>
                <span>Final: <span className="text-green-600 font-bold">$950</span></span>
                <span className="text-green-600 font-bold">Saved $250 (21%)</span>
              </div>
            </div>
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
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">🪑 Furniture</span>
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
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Best Deal</span>
                  <span className="font-bold text-blue-600">31% off</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default AppPage;