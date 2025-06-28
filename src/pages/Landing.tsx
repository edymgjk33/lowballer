import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, MessageSquare, Zap, Target, Shield, Clock, ArrowRight, CheckCircle, TrendingDown, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Lowbal</h1>
                <p className="text-sm text-gray-600">AI-Powered Negotiation Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-green-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  Try Lowbal Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              Trusted by 50,000+ smart shoppers
            </div>
            <h2 className="text-6xl font-bold text-gray-900 leading-tight">
              Never Pay
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Full Price </span>
              Again
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Lowbal uses advanced AI to craft perfect negotiation messages and calculate optimal counter-offers for any online marketplace. Save thousands on cars, furniture, electronics, and more.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">73%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$1,247</div>
                <div className="text-sm text-gray-600">Avg. Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.3M</div>
                <div className="text-sm text-gray-600">Deals Closed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-lg px-8 py-4">
                  Start Negotiating Now
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 border-2 hover:bg-gray-50">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -translate-y-16 translate-x-16"></div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Person successfully negotiating online deals"
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-semibold text-gray-900 line-through">$1,200</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <span className="text-green-700 font-medium">Your Offer:</span>
                  <span className="text-2xl font-bold text-green-800">$850</span>
                </div>
                <div className="text-center p-3 bg-green-600 text-white rounded-xl font-medium">
                  💰 You saved $350 (29% off)!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Logos Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Works on All Major Platforms</h3>
            <p className="text-gray-600">Optimized strategies for every marketplace</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            {/* Facebook Marketplace */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">f</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </div>
            
            {/* Craigslist */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">CL</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Craigslist</span>
            </div>
            
            {/* eBay */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">e</span>
              </div>
              <span className="text-sm font-medium text-gray-700">eBay</span>
            </div>
            
            {/* Zillow */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Zillow</span>
            </div>
            
            {/* OfferUp */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-sm font-medium text-gray-700">OfferUp</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">How Lowbal Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes thousands of successful negotiations to craft the perfect strategy for your specific situation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop"
                  alt="Input listing details on smartphone"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-lg"
                />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">1. Input Listing Details</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Paste the item title, price, and platform. Add any extra context about the seller or condition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"
                  alt="AI analyzing negotiation data"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-lg"
                />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">2. AI Calculates Strategy</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our algorithm analyzes market data, platform patterns, and pricing psychology to determine the optimal offer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop"
                  alt="Successful negotiation message on phone"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-lg"
                />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">3. Send Perfect Message</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Copy our AI-crafted message that's proven to get positive responses and close deals at lower prices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">Why Lowbal Gets Results</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on proven negotiation psychology and trained on thousands of successful deals
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Smart Platform Recognition</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Different platforms require different approaches. Our AI knows Facebook Marketplace sellers behave differently than Craigslist users.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Psychology-Based Messaging</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Messages crafted using proven negotiation techniques that build rapport while maintaining leverage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Price-Aware Calculations</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      High-value items need conservative offers, while cheaper items can handle aggressive discounts. We calculate the sweet spot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop"
                alt="Successful negotiation analytics dashboard"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">73%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">50K+</div>
                    <div className="text-sm text-gray-600">Happy Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h3 className="text-5xl font-bold text-white mb-8">
            Ready to Save Money on Your Next Purchase?
          </h3>
          <p className="text-xl text-green-100 mb-10 leading-relaxed">
            Join thousands of smart shoppers who use Lowbal to negotiate better deals every day.
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              Start Negotiating Free
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
          <p className="text-green-200 mt-6 text-lg">
            No signup required • Works instantly • Free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Lowbal</span>
          </div>
          <p className="text-center text-gray-400 text-lg">
            © 2024 Lowbal. AI-powered negotiation made simple.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;