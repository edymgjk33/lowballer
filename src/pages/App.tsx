import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from '../components/AppHeader';
import NegotiationTabs from '../components/NegotiationTabs';
import ReviewsTab from '../components/ReviewsTab';
import OrderHistory from '../components/OrderHistory';
import SavingsTracker from '../components/SavingsTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Star, History, TrendingUp, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [activeMainTab, setActiveMainTab] = useState('negotiate');
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
    },
    {
      id: '3',
      title: 'Vintage Dining Set',
      category: 'furniture',
      platform: 'Facebook Marketplace',
      originalPrice: 800,
      finalPrice: 550,
      savings: 250,
      savingsPercentage: 31,
      completedAt: new Date('2024-01-05'),
      dealClosed: true
    }
  ]);
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
    setActiveMainTab('negotiate');
    
    toast({
      title: "New Negotiation Started",
      description: "A new negotiation tab has been created.",
    });
  };

  const updateNegotiationTab = (tabId: string, updates: Partial<NegotiationTab>) => {
    setNegotiationTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    );
  };

  const closeNegotiationTab = (tabId: string) => {
    const tab = negotiationTabs.find(t => t.id === tabId);
    if (!tab) return;

    // Show deal completion dialog
    const dealClosed = window.confirm('Did you close this deal?');
    
    if (dealClosed) {
      const finalPriceStr = window.prompt('What was the final price?');
      const finalPrice = finalPriceStr ? parseFloat(finalPriceStr) : tab.originalPrice;
      
      if (finalPrice && finalPrice < tab.originalPrice) {
        const savings = tab.originalPrice - finalPrice;
        const savingsPercentage = Math.round((savings / tab.originalPrice) * 100);
        
        const completedDeal: CompletedDeal = {
          id: tabId,
          title: tab.title,
          category: tab.category,
          platform: tab.platform,
          originalPrice: tab.originalPrice,
          finalPrice,
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
    
    setNegotiationTabs(prev => prev.filter(t => t.id !== tabId));
  };

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&auto=format"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        <AppHeader />

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={createNewNegotiation}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 border-0"
          >
            <Plus className="w-10 h-10 text-white" />
          </Button>
        </div>

        {/* Savings Tracker Banner */}
        <SavingsTracker 
          totalSavings={totalSavings}
          totalDeals={totalDeals}
          averageSavings={averageSavings}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main Tabs */}
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/20 backdrop-blur-xl shadow-2xl rounded-3xl p-3 h-24 border border-white/20">
              <TabsTrigger 
                value="negotiate" 
                className="text-lg font-bold h-18 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
              >
                <MessageSquare className="w-6 h-6 mr-3" />
                Negotiate ({negotiationTabs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="text-lg font-bold h-18 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
              >
                <Star className="w-6 h-6 mr-3" />
                Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="text-lg font-bold h-18 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
              >
                <History className="w-6 h-6 mr-3" />
                History ({totalDeals})
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-lg font-bold h-18 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="negotiate" className="space-y-8">
              <NegotiationTabs
                tabs={negotiationTabs}
                onUpdateTab={updateNegotiationTab}
                onCloseTab={closeNegotiationTab}
                onCreateNew={createNewNegotiation}
              />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>

            <TabsContent value="history">
              <OrderHistory deals={completedDeals} />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  <h3 className="text-3xl font-black text-white mb-8">Savings Analytics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30">
                      <span className="text-emerald-300 font-bold text-lg">Total Saved</span>
                      <span className="text-3xl font-black text-emerald-400">${totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-cyan-500/30">
                      <span className="text-cyan-300 font-bold text-lg">Deals Completed</span>
                      <span className="text-3xl font-black text-cyan-400">{totalDeals}</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30">
                      <span className="text-blue-300 font-bold text-lg">Average Savings</span>
                      <span className="text-3xl font-black text-blue-400">${averageSavings}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  <h3 className="text-3xl font-black text-white mb-8">Category Breakdown</h3>
                  <div className="space-y-4">
                    {['cars', 'electronics', 'furniture'].map(category => {
                      const categoryDeals = completedDeals.filter(deal => deal.category === category);
                      const categorySavings = categoryDeals.reduce((sum, deal) => sum + deal.savings, 0);
                      return (
                        <div key={category} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                          <span className="capitalize font-bold text-white text-lg">{category}</span>
                          <div className="text-right">
                            <div className="font-black text-emerald-400 text-xl">${categorySavings}</div>
                            <div className="text-sm text-gray-300 font-medium">{categoryDeals.length} deals</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AppPage;