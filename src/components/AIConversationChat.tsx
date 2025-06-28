import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Bot, User, Copy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIConversationChatProps {
  selectedCategory: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIConversationChat: React.FC<AIConversationChatProps> = ({ selectedCategory }) => {
  const [sellerMessage, setSellerMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Simulate AI response based on category and message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = {
        'real-estate': [
          "I understand you're interested in the property. Based on current market conditions in this area, I'd like to discuss the pricing. Would you consider $X for a quick closing?",
          "Thank you for your interest. I've been pre-approved for financing and can close within 30 days. Given the current market, would you be open to negotiating on the price?",
          "I appreciate you getting back to me. I've done some research on comparable properties in the neighborhood, and I'm prepared to make a competitive offer. Can we discuss the terms?"
        ],
        'cars': [
          "Thanks for the quick response! I've had the vehicle inspected by a mechanic and I'm very interested. Based on the current market value and condition, would you consider $X?",
          "I appreciate you showing me the car. I'm ready to purchase today with cash. Given the mileage and condition, would you be open to $X?",
          "Thank you for your time today. I've researched similar vehicles in the area and I'm prepared to make a fair offer. Would $X work for you?"
        ],
        'electronics': [
          "Thanks for the details! I've checked the current market prices for this model and I'm very interested. Would you consider $X for a quick sale?",
          "I appreciate the information. I'm ready to pick it up today with cash. Based on the condition and current retail prices, would $X be acceptable?",
          "Thank you for getting back to me. I've been looking for this exact model and I'm prepared to purchase immediately. Would you accept $X?"
        ],
        'default': [
          "Thank you for your response. I'm very interested in your item and ready to purchase quickly. Based on current market conditions, would you consider $X?",
          "I appreciate you getting back to me. I'm a serious buyer and can complete the transaction today. Would you be open to negotiating on the price?",
          "Thanks for the information. I've done some research on similar items and I'm prepared to make a fair offer. Can we discuss the pricing?"
        ]
      };

      const categoryResponses = responses[selectedCategory as keyof typeof responses] || responses.default;
      const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "AI Response Generated",
        description: "Your negotiation response is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!sellerMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter the seller's message first.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category first to get specialized responses.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: sellerMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    generateAIResponse(sellerMessage);
    setSellerMessage('');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            AI Conversation Assistant
          </CardTitle>
          <p className="text-gray-600">Paste the seller's message and get AI-powered responses</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="seller-message" className="text-base font-medium">
              Seller's Message from Facebook/Platform
            </Label>
            <Textarea
              id="seller-message"
              placeholder="Paste the seller's message here... e.g., 'Hi, thanks for your interest in my car. The price is firm at $15,000.'"
              value={sellerMessage}
              onChange={(e) => setSellerMessage(e.target.value)}
              className="min-h-[120px] text-base border-2 focus:border-blue-500 transition-colors resize-none"
              rows={5}
            />
          </div>

          {selectedCategory && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                <Sparkles className="w-4 h-4" />
                Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
              </div>
              <p className="text-sm text-blue-600">
                AI responses will be optimized for {selectedCategory.replace('-', ' ')} negotiations
              </p>
            </div>
          )}

          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !sellerMessage.trim()}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-base font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Generating Response...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-3" />
                Get AI Response
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Conversation Section */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            Conversation Thread
          </CardTitle>
          <p className="text-gray-600">Your negotiation conversation with AI assistance</p>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Start Your Conversation</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Paste a seller's message to get AI-powered negotiation responses
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'ai' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-gray-500 to-gray-600'
                  }`}>
                    {message.type === 'ai' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'ai' ? 'text-left' : 'text-right'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-[85%] ${
                      message.type === 'ai'
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'bg-gray-100 border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.type === 'ai' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className="mt-2 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConversationChat;