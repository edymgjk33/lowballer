import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MessageSquare, Sparkles, Send } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import CategorySelector from './CategorySelector';
import ListingForm from './ListingForm';
import NegotiationResults from './NegotiationResults';
import AIConversationChat from './AIConversationChat';
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';
import { useToast } from "@/hooks/use-toast";

interface NegotiationTabsProps {
  tabs: NegotiationTab[];
  onUpdateTab: (tabId: string, updates: Partial<NegotiationTab>) => void;
  onCloseTab: (tabId: string) => void;
  onCreateNew: () => void;
}

const NegotiationTabs: React.FC<NegotiationTabsProps> = ({
  tabs,
  onUpdateTab,
  onCloseTab,
  onCreateNew
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleGenerateOffer = async (tab: NegotiationTab) => {
    if (!tab.title || !tab.originalPrice || !tab.platform || !tab.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedOffer = calculateCounterOffer(tab.originalPrice, tab.platform, tab.category);
      const message = await generateNegotiationMessage(
        tab.title, 
        tab.originalPrice, 
        calculatedOffer, 
        tab.platform, 
        '', 
        tab.category
      );
      
      onUpdateTab(tab.id, {
        currentOffer: calculatedOffer,
        messages: [
          ...tab.messages,
          {
            id: Date.now().toString(),
            type: 'ai',
            content: message,
            timestamp: new Date()
          }
        ]
      });
      
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

  if (tabs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <MessageSquare className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Start Your First Negotiation</h3>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create a new negotiation tab to begin saving money with AI-powered strategies
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-3" />
          Create New Negotiation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-green-100">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 min-w-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate max-w-32">
                {tab.title || 'New Negotiation'}
              </span>
              {tab.status === 'active' && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`h-6 w-6 p-0 flex-shrink-0 ${
                  activeTab === tab.id ? 'hover:bg-white/20' : 'hover:bg-red-100'
                }`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <Button
            onClick={onCreateNew}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-10 w-10 rounded-xl hover:bg-green-100 text-green-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Tab Content */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Category Selection */}
                {!tab.category && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Category</h3>
                    <CategorySelector
                      selectedCategory={tab.category}
                      onCategorySelect={(category) => 
                        onUpdateTab(tab.id, { category })
                      }
                    />
                  </div>
                )}

                {/* Listing Form */}
                {tab.category && (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ListingForm
                        listingTitle={tab.title}
                        setListingTitle={(title) => onUpdateTab(tab.id, { title })}
                        listingPrice={tab.originalPrice.toString()}
                        setListingPrice={(price) => onUpdateTab(tab.id, { originalPrice: parseFloat(price) || 0 })}
                        platform={tab.platform}
                        setPlatform={(platform) => onUpdateTab(tab.id, { platform })}
                        extraNotes=""
                        setExtraNotes={() => {}}
                        isLoading={isLoading}
                        onGenerateOffer={() => handleGenerateOffer(tab)}
                        selectedCategory={tab.category}
                      />
                    </div>

                    <div className="space-y-6">
                      <NegotiationResults
                        counterOffer={tab.currentOffer?.toString() || ''}
                        negotiationMessage={tab.messages.find(m => m.type === 'ai')?.content || ''}
                        listingPrice={tab.originalPrice.toString()}
                        onCopyToClipboard={(text) => {
                          navigator.clipboard.writeText(text);
                          toast({
                            title: "Copied!",
                            description: "Message copied to clipboard.",
                          });
                        }}
                        selectedCategory={tab.category}
                      />
                    </div>
                  </div>
                )}

                {/* Chat Interface */}
                {tab.currentOffer && (
                  <div className="border-t pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      Conversation Thread
                    </h3>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 max-h-96 overflow-y-auto mb-4">
                      {tab.messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Start the conversation by sending your AI-generated message to the seller</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tab.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'ai' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                  : message.type === 'seller'
                                  ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                                  : 'bg-gradient-to-br from-gray-500 to-gray-600'
                              }`}>
                                <span className="text-white text-xs font-bold">
                                  {message.type === 'ai' ? 'AI' : message.type === 'seller' ? 'S' : 'U'}
                                </span>
                              </div>
                              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-4 rounded-2xl max-w-[85%] ${
                                  message.type === 'ai'
                                    ? 'bg-blue-50 border border-blue-200 text-blue-900'
                                    : message.type === 'seller'
                                    ? 'bg-orange-50 border border-orange-200 text-orange-900'
                                    : 'bg-gray-100 border border-gray-200 text-gray-900'
                                }`}>
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your message or paste seller's response..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            const content = e.currentTarget.value.trim();
                            onUpdateTab(tab.id, {
                              messages: [
                                ...tab.messages,
                                {
                                  id: Date.now().toString(),
                                  type: 'user',
                                  content,
                                  timestamp: new Date()
                                }
                              ]
                            });
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default NegotiationTabs;