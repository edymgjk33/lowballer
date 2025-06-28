import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sparkles } from "lucide-react";

interface ListingFormProps {
  listingTitle: string;
  setListingTitle: (value: string) => void;
  listingPrice: string;
  setListingPrice: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  extraNotes: string;
  setExtraNotes: (value: string) => void;
  isLoading: boolean;
  onGenerateOffer: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({
  listingTitle,
  setListingTitle,
  listingPrice,
  setListingPrice,
  platform,
  setPlatform,
  extraNotes,
  setExtraNotes,
  isLoading,
  onGenerateOffer
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Listing Details
        </CardTitle>
        <p className="text-gray-600">Enter the details of the item you want to negotiate for</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="title" className="text-base font-medium">Listing Title or Description</Label>
          <Input
            id="title"
            placeholder="e.g., iPhone 14 Pro, 2018 Honda Civic, Vintage Couch"
            value={listingTitle}
            onChange={(e) => setListingTitle(e.target.value)}
            className="h-12 text-base border-2 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="price" className="text-base font-medium">Listing Price ($)</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter the asking price"
            value={listingPrice}
            onChange={(e) => setListingPrice(e.target.value)}
            className="h-12 text-base border-2 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="platform" className="text-base font-medium">Platform</Label>
          <Select onValueChange={setPlatform}>
            <SelectTrigger className="h-12 text-base border-2 focus:border-green-500 transition-colors">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Facebook">Facebook Marketplace</SelectItem>
              <SelectItem value="Craigslist">Craigslist</SelectItem>
              <SelectItem value="Zillow">Zillow</SelectItem>
              <SelectItem value="eBay">eBay</SelectItem>
              <SelectItem value="OfferUp">OfferUp</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">Extra Notes / Seller Info (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional context about the item or seller..."
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            className="min-h-[100px] text-base border-2 focus:border-green-500 transition-colors resize-none"
            rows={4}
          />
        </div>

        <Button 
          onClick={onGenerateOffer}
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              Generating Your Strategy...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Generate Offer & Message
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingForm;