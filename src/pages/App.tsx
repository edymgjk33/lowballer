import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from '../components/AppHeader';
import AppHero from '../components/AppHero';
import CategorySelector from '../components/CategorySelector';
import ListingForm from '../components/ListingForm';
import NegotiationResults from '../components/NegotiationResults';
import ListingUrlParser from '../components/ListingUrlParser';
import AIConversationChat from '../components/AIConversationChat';
import ConversationImageAnalyzer from '../components/ConversationImageAnalyzer';
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleListingParsed = (data: {
    title: string;
    price: string;
    platform: string;
    description?: string;
  }) => {
    setListingTitle(data.title);
    setListingPrice(data.price);
    setPlatform(data.platform);
    if (data.description) {
      setExtraNotes(data.description);
    }
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including category selection.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedOffer = calculateCounterOffer(price, platform, selectedCategory);
      const message = await generateNegotiationMessage(listingTitle, price, calculatedOffer, platform, extraNotes, selectedCategory);
      
      setCounterOffer(calculatedOffer.toString());
      setNegotiationMessage(message);
      
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AppHero />

        {/* Category Selection */}
        <div className="mb-12">
          <CategorySelector 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="negotiate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg rounded-2xl p-2 h-16">
            <TabsTrigger value="negotiate" className="text-lg font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Generate Offer
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-lg font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              AI Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="analyze" className="text-lg font-medium h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Analyze Conversation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="negotiate" className="space-y-8">
            {/* URL Parser Section */}
            <ListingUrlParser onListingParsed={handleListingParsed} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <ListingForm
                  listingTitle={listingTitle}
                  setListingTitle={setListingTitle}
                  listingPrice={listingPrice}
                  setListingPrice={setListingPrice}
                  platform={platform}
                  setPlatform={setPlatform}
                  extraNotes={extraNotes}
                  setExtraNotes={setExtraNotes}
                  isLoading={isLoading}
                  onGenerateOffer={handleGenerateOffer}
                  selectedCategory={selectedCategory}
                />
              </div>

              <div className="space-y-8">
                <NegotiationResults
                  counterOffer={counterOffer}
                  negotiationMessage={negotiationMessage}
                  listingPrice={listingPrice}
                  onCopyToClipboard={copyToClipboard}
                  selectedCategory={selectedCategory}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <AIConversationChat selectedCategory={selectedCategory} />
          </TabsContent>

          <TabsContent value="analyze">
            <ConversationImageAnalyzer selectedCategory={selectedCategory} />
          </TabsContent>
        </Tabs>

        {/* Success Stories */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-green-100">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Recent Success Stories by Category</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-2xl font-bold text-green-600 mb-2">$2,400 saved</div>
              <div className="text-gray-600">Used Car - Honda Civic</div>
              <div className="text-sm text-gray-500 mt-1">Automotive Category</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600 mb-2">$450 saved</div>
              <div className="text-gray-600">MacBook Pro</div>
              <div className="text-sm text-gray-500 mt-1">Electronics Category</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 mb-2">$850 saved</div>
              <div className="text-gray-600">Vintage Dining Set</div>
              <div className="text-sm text-gray-500 mt-1">Furniture Category</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            This is AI-generated guidance and does not guarantee a result. Always be respectful and honest in your negotiations. 
            Results may vary based on market conditions and seller preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppPage;