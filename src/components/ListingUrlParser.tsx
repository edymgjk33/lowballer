
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Loader2 } from "lucide-react";
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
    <Card className="border-green-100 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5 text-green-600" />
          Parse Listing URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="listing-url">Paste Listing URL</Label>
            <Input
              id="listing-url"
              type="url"
              placeholder="https://facebook.com/marketplace/item/... or any listing URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button 
            onClick={parseUrl} 
            disabled={isLoading || !url}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Parsing URL...
              </>
            ) : (
              'Parse Listing Information'
            )}
          </Button>
          <p className="text-xs text-gray-500">
            Supports Facebook Marketplace, Craigslist, eBay, Zillow, OfferUp, and more
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingUrlParser;
