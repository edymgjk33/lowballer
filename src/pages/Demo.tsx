import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ArrowLeft, Play, CheckCircle, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-green-600 hover:text-green-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Lowbal Demo</h1>
                  <p className="text-sm text-gray-600">See how it works</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Watch Lowbal in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See how our AI-powered negotiation assistant helps you save money on every purchase
          </p>
        </div>

        <Card className="border-0 shadow-2xl mb-12 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl relative z-10 text-lg px-8 py-4">
                <Play className="w-6 h-6 mr-3" />
                Play Demo Video
              </Button>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Demo: Negotiating a $1,200 Couch Down to $850</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Watch as we demonstrate how Lowbal analyzes a Facebook Marketplace listing, calculates the perfect counter-offer, 
              and generates a persuasive message that successfully negotiates the price down by 29%.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-bold text-lg mb-3">Input Details</h4>
                <p className="text-sm text-gray-600">Paste listing info or URL</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-bold text-lg mb-3">AI Analysis</h4>
                <p className="text-sm text-gray-600">Calculate optimal offer</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3">Success</h4>
                <p className="text-sm text-gray-600">$350 saved!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results showcase */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-green-100 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Demo Results</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Original Price:</span>
                <span className="font-semibold text-gray-900 line-through">$1,200</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <span className="text-green-700 font-medium">Final Price:</span>
                <span className="text-2xl font-bold text-green-800">$850</span>
              </div>
              <div className="text-center p-4 bg-green-600 text-white rounded-xl font-medium">
                <TrendingDown className="w-5 h-5 inline mr-2" />
                You saved $350 (29% off)!
              </div>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                alt="Successful negotiation celebration"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              Try Lowbal Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Demo;