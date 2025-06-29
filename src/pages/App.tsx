import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from '../components/AppHeader';
import NegotiationTabs from '../components/NegotiationTabs';
import ReviewsTab from '../components/ReviewsTab';
import OrderHistory from '../components/OrderHistory';
import SavingsTracker from '../components/SavingsTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Star, History, TrendingUp, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <AppHeader />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={createNewNegotiation}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <Plus className="w-8 h-8 text-white" />
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
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-2 h-20 border border-green-100">
            <TabsTrigger 
              value="negotiate" 
              className="text-lg font-medium h-16 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Negotiate ({negotiationTabs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="text-lg font-medium h-16 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Star className="w-5 h-5 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-lg font-medium h-16 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <History className="w-5 h-5 mr-2" />
              History ({totalDeals})
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-lg font-medium h-16 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
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
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Savings Analytics</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <span className="text-green-700 font-medium">Total Saved</span>
                    <span className="text-2xl font-bold text-green-800">${totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <span className="text-blue-700 font-medium">Deals Completed</span>
                    <span className="text-2xl font-bold text-blue-800">{totalDeals}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <span className="text-purple-700 font-medium">Average Savings</span>
                    <span className="text-2xl font-bold text-purple-800">${averageSavings}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h3>
                <div className="space-y-4">
                  {['cars', 'electronics', 'furniture'].map(category => {
                    const categoryDeals = completedDeals.filter(deal => deal.category === category);
                    const categorySavings = categoryDeals.reduce((sum, deal) => sum + deal.savings, 0);
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="capitalize font-medium">{category}</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">${categorySavings}</div>
                          <div className="text-sm text-gray-500">{categoryDeals.length} deals</div>
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
  );
};

export default AppPage;