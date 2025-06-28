
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, MessageSquare } from "lucide-react";

interface NegotiationResultsProps {
  counterOffer: string;
  negotiationMessage: string;
  listingPrice: string;
  onCopyToClipboard: (text: string) => void;
}

const NegotiationResults: React.FC<NegotiationResultsProps> = ({
  counterOffer,
  negotiationMessage,
  listingPrice,
  onCopyToClipboard
}) => {
  return (
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
                  onClick={() => onCopyToClipboard(negotiationMessage)}
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
  );
};

export default NegotiationResults;
