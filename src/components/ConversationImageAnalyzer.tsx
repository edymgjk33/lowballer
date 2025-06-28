import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Sparkles, Eye, MessageSquare, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversationImageAnalyzerProps {
  selectedCategory: string;
}

interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  suggestedResponse: string;
  negotiationTips: string[];
  priceAnalysis?: {
    mentionedPrice?: string;
    priceFlexibility: 'high' | 'medium' | 'low';
  };
}

const ConversationImageAnalyzer: React.FC<ConversationImageAnalyzerProps> = ({ selectedCategory }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeConversation = async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload a conversation screenshot first.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category first for specialized analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis results based on category
      const mockResults: Record<string, AnalysisResult> = {
        'cars': {
          sentiment: 'neutral',
          keyPoints: [
            'Seller mentions recent maintenance',
            'Price seems negotiable based on language',
            'Seller is motivated to sell quickly',
            'No major red flags detected'
          ],
          suggestedResponse: "Thank you for the details about the recent maintenance - that's exactly what I was hoping to hear. I've been looking for a well-maintained vehicle like this. Based on the current market and the fact that you're looking to sell quickly, would you consider $X? I can come see it this weekend and complete the purchase immediately if we can agree on the price.",
          negotiationTips: [
            'Emphasize the quick sale benefit',
            'Acknowledge the maintenance positively',
            'Show you\'re a serious, ready buyer',
            'Suggest immediate viewing/purchase'
          ],
          priceAnalysis: {
            mentionedPrice: '$15,000',
            priceFlexibility: 'medium'
          }
        },
        'electronics': {
          sentiment: 'positive',
          keyPoints: [
            'Item is in excellent condition',
            'Original packaging included',
            'Seller seems flexible on timing',
            'Multiple interested buyers mentioned'
          ],
          suggestedResponse: "I really appreciate you including the original packaging - that shows how well you've cared for it. I understand you have other interested buyers, but I'm ready to purchase today with cash. Would you consider $X for a quick, hassle-free transaction?",
          negotiationTips: [
            'Act quickly due to competition',
            'Emphasize cash payment',
            'Acknowledge item condition',
            'Offer convenience of immediate sale'
          ],
          priceAnalysis: {
            mentionedPrice: '$800',
            priceFlexibility: 'high'
          }
        },
        'furniture': {
          sentiment: 'neutral',
          keyPoints: [
            'Seller mentions moving timeline',
            'Furniture is from smoke-free home',
            'Some wear mentioned but honest',
            'Seller seems reasonable'
          ],
          suggestedResponse: "I understand you're moving and need to sell quickly - I can definitely help with that timeline. The fact that it's from a smoke-free home is important to me. Given the timeline pressure and the minor wear you mentioned, would $X work? I can arrange pickup this week to help with your moving schedule.",
          negotiationTips: [
            'Leverage the moving timeline',
            'Offer pickup convenience',
            'Acknowledge honesty about condition',
            'Emphasize helping their situation'
          ],
          priceAnalysis: {
            mentionedPrice: '$400',
            priceFlexibility: 'high'
          }
        }
      };

      const result = mockResults[selectedCategory] || mockResults['electronics'];
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: "Your conversation has been analyzed with AI insights.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            Conversation Image Analyzer
          </CardTitle>
          <p className="text-gray-600">Upload a screenshot of your conversation for AI analysis</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Upload Conversation Screenshot</Label>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded conversation" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-600">Click to upload a different image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Upload Conversation Screenshot</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {selectedCategory && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 font-medium mb-1">
                <Sparkles className="w-4 h-4" />
                Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
              </div>
              <p className="text-sm text-purple-600">
                Analysis will be optimized for {selectedCategory.replace('-', ' ')} conversations
              </p>
            </div>
          )}

          <Button 
            onClick={analyzeConversation}
            disabled={isAnalyzing || !uploadedImage}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-base font-medium"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Analyzing Conversation...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 mr-3" />
                Analyze Conversation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            AI Analysis Results
          </CardTitle>
          <p className="text-gray-600">Insights and recommendations from your conversation</p>
        </CardHeader>
        <CardContent>
          {!analysisResult ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Analyze</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Upload a conversation screenshot to get AI-powered insights and negotiation advice
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sentiment Analysis */}
              <div className={`p-4 rounded-xl border ${getSentimentColor(analysisResult.sentiment)}`}>
                <div className="flex items-center gap-2 font-medium mb-2">
                  <span className="text-lg">{getSentimentIcon(analysisResult.sentiment)}</span>
                  Conversation Sentiment: {analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)}
                </div>
              </div>

              {/* Price Analysis */}
              {analysisResult.priceAnalysis && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                    <TrendingDown className="w-4 h-4" />
                    Price Analysis
                  </div>
                  <div className="space-y-1 text-sm text-blue-600">
                    {analysisResult.priceAnalysis.mentionedPrice && (
                      <p>Mentioned Price: {analysisResult.priceAnalysis.mentionedPrice}</p>
                    )}
                    <p>Price Flexibility: {analysisResult.priceAnalysis.priceFlexibility}</p>
                  </div>
                </div>
              )}

              {/* Key Points */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Conversation Points</h4>
                <ul className="space-y-2">
                  {analysisResult.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Suggested Response</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(analysisResult.suggestedResponse)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {analysisResult.suggestedResponse}
                  </p>
                </div>
              </div>

              {/* Negotiation Tips */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Negotiation Tips</h4>
                <ul className="space-y-2">
                  {analysisResult.negotiationTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationImageAnalyzer;