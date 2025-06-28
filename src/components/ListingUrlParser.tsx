import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ListingUrlParserProps {
  onListingParsed: (data: {
    title: string;
    price: string;
    platform: string;
    description?: string;
  }) => void;
}

const ListingUrlParser = ({ onListingParsed }: ListingUrlParserProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectPlatform = (url: string): string => {
    if (url.includes('facebook.com') || url.includes('fb.com')) return 'Facebook Marketplace';
    if (url.includes('craigslist.org')) return 'Craigslist';
    if (url.includes('ebay.com')) return 'eBay';
    if (url.includes('zillow.com')) return 'Zillow';
    if (url.includes('offerup.com')) return 'OfferUp';
    return 'Other';
  };

  const parseUrl = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a listing URL to parse.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Placeholder URL parsing - replace with actual backend parsing when Supabase is connected
      const platform = detectPlatform(url);
      
      // Simulated parsing results
      const mockData = {
        title: "Sample Item Title (Parsed)",
        price: "1000",
        platform: platform,
        description: "This listing was parsed from the provided URL. Connect to Supabase for actual parsing functionality."
      };

      onListingParsed(mockData);
      
      toast({
        title: "URL Parsed Successfully",
        description: "The listing information has been extracted and populated in the form.",
      });
      
      setUrl('');
    } catch (error) {
      toast({
        title: "Parsing Failed",
        description: "Unable to parse the listing URL. Please try entering the details manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Link className="w-6 h-6 text-white" />
          </div>
          Quick Parse Listing URL
        </CardTitle>
        <p className="text-gray-600">Paste any listing URL to automatically extract details</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="listing-url" className="text-base font-medium">Paste Listing URL</Label>
            <Input
              id="listing-url"
              type="url"
              placeholder="https://facebook.com/marketplace/item/... or any listing URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
            />
          </div>
          <Button 
            onClick={parseUrl} 
            disabled={isLoading || !url}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Parsing URL...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Parse Listing Information
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Supports Facebook Marketplace, Craigslist, eBay, Zillow, OfferUp, and more
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingUrlParser;