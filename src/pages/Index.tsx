
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, DollarSign, MessageSquare, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [listingTitle, setListingTitle] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateCounterOffer = (price: number, selectedPlatform: string): number => {
    let percentage = 0;
    
    if ((selectedPlatform === 'Zillow' || selectedPlatform === 'Facebook') && price > 5000) {
      percentage = Math.random() * 0.1 + 0.1; // 10-20%
    } else if ((selectedPlatform === 'eBay' || selectedPlatform === 'Craigslist') && price < 500) {
      percentage = Math.random() * 0.1 + 0.2; // 20-30%
    } else {
      percentage = Math.random() * 0.1 + 0.15; // 15-25% for other cases
    }
    
    const reducedPrice = price * (1 - percentage);
    
    // Round down to nearest 10 or 50
    if (reducedPrice > 100) {
      return Math.floor(reducedPrice / 50) * 50;
    } else {
      return Math.floor(reducedPrice / 10) * 10;
    }
  };

  const generateNegotiationMessage = async (title: string, originalPrice: number, offer: number, platform: string, notes: string) => {
    const prompt = `Create a polite, confident negotiation message for the following:
    - Item: ${title}
    - Original Price: $${originalPrice}
    - My Offer: $${offer}
    - Platform: ${platform}
    - Additional Context: ${notes}
    
    Guidelines:
    - Be respectful but confident
    - Use phrases like "Would you consider," "Based on the market," or "Happy to move forward if we can agree"
    - Keep it concise (2-3 sentences)
    - Sound professional but friendly
    - Don't be aggressive or pushy
    - Focus on being ready to move forward with the deal`;

    try {
      // This is a placeholder for GPT-4 integration
      // In a real implementation, you would call the OpenAI API here
      console.log('Generating message with prompt:', prompt);
      
      // Simulated AI response for demo purposes
      const templates = [
        `Hi! I'm very interested in your ${title}. Based on similar listings I've seen, would you consider $${offer}? I'm ready to pick it up/move forward today if we can agree on this price.`,
        `Hello! Your ${title} looks great. I've been researching the market and wondering if you'd be open to $${offer}? Happy to arrange pickup at your convenience if this works for you.`,
        `Hi there! I'm interested in purchasing your ${title}. Would you consider accepting $${offer}? I'm a serious buyer and can complete the transaction quickly if we can agree on this.`
      ];
      
      return templates[Math.floor(Math.random() * templates.length)];
    } catch (error) {
      console.error('Error generating message:', error);
      return `Hi! I'm very interested in your ${title}. Would you consider $${offer}? I'm ready to move forward if we can agree on this price. Thank you!`;
    }
  };

  const handleGenerateOffer = async () => {
    if (!listingTitle || !listingPrice || !platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in the listing title, price, and platform.",
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
      const calculatedOffer = calculateCounterOffer(price, platform);
      const message = await generateNegotiationMessage(listingTitle, price, calculatedOffer, platform, extraNotes);
      
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DealDrop AI</h1>
              <p className="text-sm text-gray-600">Negotiate Better Deals Instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Negotiate Smarter with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered counter-offers and persuasive messages to help you secure better deals on any platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Listing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Listing Title or Description</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 14 Pro, 2018 Honda Civic, Vintage Couch"
                  value={listingTitle}
                  onChange={(e) => setListingTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="price">Listing Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter the asking price"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Facebook">Facebook Marketplace</SelectItem>
                    <SelectItem value="Craigslist">Craigslist</SelectItem>
                    <SelectItem value="Zillow">Zillow</SelectItem>
                    <SelectItem value="eBay">eBay</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Extra Notes / Seller Info (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional context about the item or seller..."
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateOffer}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading ? 'Generating...' : 'Generate Offer & Message'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-lg border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                AI-Generated Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {counterOffer && negotiationMessage ? (
                <>
                  <div>
                    <Label className="text-lg font-semibold text-green-700">
                      AI-Suggested Counter Offer
                    </Label>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-800">
                        ${counterOffer}
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        {listingPrice && `${Math.round(((parseFloat(listingPrice) - parseFloat(counterOffer)) / parseFloat(listingPrice)) * 100)}% off original price`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-lg font-semibold text-green-700">
                        Negotiation Message
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(negotiationMessage)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 leading-relaxed">
                        {negotiationMessage}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Fill out the form and click "Generate" to see your AI-powered negotiation strategy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            This is AI-generated guidance and does not guarantee a result. Always be respectful and honest in your negotiations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
