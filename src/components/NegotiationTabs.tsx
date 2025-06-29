import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MessageSquare, Sparkles, Send, Link, Image, Bot } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import CategorySelector from './CategorySelector';
import ListingForm from './ListingForm';
import NegotiationResults from './NegotiationResults';
import AIConversationChat from './AIConversationChat';
import ListingUrlParser from './ListingUrlParser';
import ConversationImageAnalyzer from './ConversationImageAnalyzer';
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
  const [activeSubTab, setActiveSubTab] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleListingParsed = (tabId: string, data: {
    title: string;
    price: string;
    platform: string;
    description?: string;
  }) => {
    onUpdateTab(tabId, {
      title: data.title,
      originalPrice: parseFloat(data.price) || 0,
      platform: data.platform
    });
    setActiveSubTab('form');
  };

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
        <div className="w-32 h-32 bg-gradient-to-br from-green-100 via-green-200 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <MessageSquare className="w-16 h-16 text-green-600" />
        </div>
        <h3 className="text-4xl font-bold text-gray-900 mb-6">Start Your First Negotiation</h3>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create a new negotiation tab to begin saving money with AI-powered strategies. 
          Use our advanced tools to parse listings, analyze conversations, and get perfect responses.
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-6 h-6 mr-4" />
          Create New Negotiation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-green-100">
        <div className="flex items-center gap-3 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 min-w-0 group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl scale-105'
                  : 'hover:bg-gray-100 text-gray-700 hover:scale-102'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={`w-3 h-3 rounded-full ${
                tab.status === 'active' 
                  ? 'bg-green-400 animate-pulse' 
                  : 'bg-gray-400'
              }`} />
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-bold truncate max-w-32">
                  {tab.title || 'New Negotiation'}
                </div>
                {tab.category && (
                  <div className={`text-xs truncate ${
                    activeTab === tab.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {tab.category.replace('-', ' ')}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`h-8 w-8 p-0 flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-red-100 text-red-500'
                }`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={onCreateNew}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-12 w-12 rounded-2xl hover:bg-green-100 text-green-600 hover:scale-110 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Active Tab Content */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
            <CardContent className="p-10">
              <div className="space-y-10">
                {/* Category Selection */}
                {!tab.category && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8">
                      <Sparkles className="w-4 h-4" />
                      Step 1: Choose Your Category
                    </div>
                    <CategorySelector
                      selectedCategory={tab.category}
                      onCategorySelect={(category) => 
                        onUpdateTab(tab.id, { category })
                      }
                    />
                  </div>
                )}

                {/* Main Interface */}
                {tab.category && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Category: {tab.category.charAt(0).toUpperCase() + tab.category.slice(1).replace('-', ' ')}
                      </div>
                    </div>

                    {/* Sub-tabs for different input methods */}
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-2 h-16 border border-gray-200">
                        <TabsTrigger 
                          value="form" 
                          className="text-base font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Manual Entry
                        </TabsTrigger>
                        <TabsTrigger 
                          value="url" 
                          className="text-base font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                        >
                          <Link className="w-4 h-4 mr-2" />
                          URL Parser
                        </TabsTrigger>
                        <TabsTrigger 
                          value="chat" 
                          className="text-base font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          AI Chat
                        </TabsTrigger>
                        <TabsTrigger 
                          value="image" 
                          className="text-base font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Image Analyzer
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="form" className="space-y-8">
                        <div className="grid lg:grid-cols-2 gap-8">
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
                      </TabsContent>

                      <TabsContent value="url" className="space-y-8">
                        <div className="max-w-4xl mx-auto">
                          <ListingUrlParser 
                            onListingParsed={(data) => handleListingParsed(tab.id, data)}
                          />
                          
                          {(tab.title || tab.originalPrice > 0) && (
                            <div className="mt-8 grid lg:grid-cols-2 gap-8">
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
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="chat" className="space-y-8">
                        <AIConversationChat selectedCategory={tab.category} />
                      </TabsContent>

                      <TabsContent value="image" className="space-y-8">
                        <ConversationImageAnalyzer selectedCategory={tab.category} />
                      </TabsContent>
                    </Tabs>

                    {/* Enhanced Chat Interface */}
                    {tab.currentOffer && activeSubTab === 'form' && (
                      <div className="border-t-2 border-gray-100 pt-10">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
                          <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            Live Negotiation Thread
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Active
                            </div>
                          </h3>
                          
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto mb-6 shadow-xl border border-white/50">
                            {tab.messages.length === 0 ? (
                              <div className="text-center py-12 text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                  <MessageSquare className="w-8 h-8 text-gray-300" />
                                </div>
                                <h4 className="text-xl font-medium text-gray-700 mb-3">Ready to Start Negotiating</h4>
                                <p className="text-gray-500 max-w-md mx-auto">
                                  Your AI-generated message is ready. Copy it and send to the seller, then paste their response here to continue the conversation.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {tab.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                  >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                                      message.type === 'ai' 
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                        : message.type === 'seller'
                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                    }`}>
                                      <span className="text-white font-bold text-sm">
                                        {message.type === 'ai' ? 'AI' : message.type === 'seller' ? 'S' : 'U'}
                                      </span>
                                    </div>
                                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                      <div className={`inline-block p-6 rounded-2xl max-w-[85%] shadow-lg ${
                                        message.type === 'ai'
                                          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-blue-900'
                                          : message.type === 'seller'
                                          ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 text-orange-900'
                                          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-900'
                                      }`}>
                                        <p className="text-base leading-relaxed">{message.content}</p>
                                        {message.type === 'ai' && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              navigator.clipboard.writeText(message.content);
                                              toast({
                                                title: "Copied!",
                                                description: "AI message copied to clipboard.",
                                              });
                                            }}
                                            className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                          >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Copy Message
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-500 mt-2 font-medium">
                                        {message.timestamp.toLocaleTimeString()} • {message.timestamp.toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-4">
                            <input
                              type="text"
                              placeholder="Paste the seller's response here or type your message..."
                              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 transition-colors text-base bg-white/80 backdrop-blur-sm"
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
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-base shadow-xl hover:shadow-2xl transition-all duration-300">
                              <Send className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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