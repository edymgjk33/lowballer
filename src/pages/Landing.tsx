import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, MessageSquare, Zap, Target, Shield, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lowbal</h1>
                <p className="text-sm text-gray-600">AI-Powered Negotiation Assistant</p>
              </div>
            </div>
            <Link to="/signup">
              <Button className="bg-green-600 hover:bg-green-700">
                Try Lowbal Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Never Pay Full Price Again
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Lowbal uses advanced AI to craft perfect negotiation messages and calculate optimal counter-offers for any online marketplace. Save thousands on cars, furniture, electronics, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  Start Negotiating Now
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Works on all platforms</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                alt="Person using laptop for online shopping"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-green-100 rounded flex items-center px-3">
                  <span className="text-green-700 font-semibold">Counter-offer: $850 (15% off)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How Lowbal Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes thousands of successful negotiations to craft the perfect strategy for your specific situation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop"
                  alt="Input listing details"
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-4">1. Input Listing Details</h4>
                <p className="text-gray-600">
                  Paste the item title, price, and platform. Add any extra context about the seller or condition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop"
                  alt="AI processing data"
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-4">2. AI Calculates Strategy</h4>
                <p className="text-gray-600">
                  Our algorithm analyzes market data, platform patterns, and pricing psychology to determine the optimal offer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop"
                  alt="Sending negotiation message"
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
                <h4 className="text-xl font-bold text-gray-900 mb-4">3. Send Perfect Message</h4>
                <p className="text-gray-600">
                  Copy our AI-crafted message that's proven to get positive responses and close deals at lower prices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Lowbal Gets Results</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on proven negotiation psychology and trained on thousands of successful deals
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Smart Platform Recognition</h4>
                    <p className="text-gray-600">
                      Different platforms require different approaches. Our AI knows Facebook Marketplace sellers behave differently than Craigslist users.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Psychology-Based Messaging</h4>
                    <p className="text-gray-600">
                      Messages crafted using proven negotiation techniques that build rapport while maintaining leverage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Price-Aware Calculations</h4>
                    <p className="text-gray-600">
                      High-value items need conservative offers, while cheaper items can handle aggressive discounts. We calculate the sweet spot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=500&fit=crop"
                alt="Successful negotiation results"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600">73%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Works on All Major Platforms</h3>
            <p className="text-xl text-gray-600">
              Optimized strategies for every major marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Facebook Marketplace", desc: "Social proof strategies" },
              { name: "Craigslist", desc: "Direct approach tactics" },
              { name: "Zillow", desc: "Real estate negotiation" },
              { name: "eBay", desc: "Auction psychology" },
              { name: "OfferUp", desc: "Mobile-first messaging" }
            ].map((platform, index) => (
              <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{platform.name}</h4>
                  <p className="text-sm text-gray-600">{platform.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Save Money on Your Next Purchase?
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of smart shoppers who use Lowbal to negotiate better deals every day.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Negotiating Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-green-200 mt-4 text-sm">
            No signup required • Works instantly • Free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Lowbal</span>
          </div>
          <p className="text-center text-gray-400">
            © 2024 Lowbal. AI-powered negotiation made simple.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
