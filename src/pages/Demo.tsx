
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-green-600 hover:text-green-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lowbal Demo</h1>
                <p className="text-sm text-gray-600">See how it works</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Watch Lowbal in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our AI-powered negotiation assistant helps you save money on every purchase
          </p>
        </div>

        <Card className="border-green-100 shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="w-6 h-6 mr-2" />
                Play Demo Video
              </Button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Demo: Negotiating a $1,200 Couch Down to $850</h3>
            <p className="text-gray-600 mb-6">
              Watch as we demonstrate how Lowbal analyzes a Facebook Marketplace listing, calculates the perfect counter-offer, 
              and generates a persuasive message that successfully negotiates the price down by 29%.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Input Details</h4>
                <p className="text-sm text-gray-600">Paste listing info or URL</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-600">Calculate optimal offer</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Success</h4>
                <p className="text-sm text-gray-600">$350 saved!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Try Lowbal Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Demo;
