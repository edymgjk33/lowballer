
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

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
          onClick={onGenerateOffer}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isLoading ? 'Generating...' : 'Generate Offer & Message'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingForm;
