import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from '../components/AppHeader';
import AppHero from '../components/AppHero';
import ListingForm from '../components/ListingForm';
import NegotiationResults from '../components/NegotiationResults';
import ListingUrlParser from '../components/ListingUrlParser';
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';

const AppPage = () => {
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
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AppHero />

        {/* URL Parser Section */}
        <ListingUrlParser onListingParsed={handleListingParsed} />

        {/* grid layout with input form and results */}
        <div className="grid lg:grid-cols-2 gap-8">
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
          />

          <NegotiationResults
            counterOffer={counterOffer}
            negotiationMessage={negotiationMessage}
            listingPrice={listingPrice}
            onCopyToClipboard={copyToClipboard}
          />
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

export default AppPage;
