import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Target, Shield, Clock, ArrowRight, CheckCircle, TrendingDown, Users, Star, Sparkles, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Enhanced Creative Logo */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-white/90 to-white/70 rounded-xl flex items-center justify-center">
                    <div className="text-transparent bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text font-black text-xl">L</div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Lowbal
                </h1>
                <p className="text-sm text-gray-300 font-medium">AI-Powered Negotiation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 transition-all duration-300 font-bold text-lg px-6 py-3 rounded-xl border border-white/20">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black px-8 py-3 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-lg">
                  Try Lowbal Free
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-6 py-3 rounded-full text-sm font-bold border border-emerald-500/30">
              <Star className="w-5 h-5 text-yellow-400" />
              Trusted by 50,000+ smart shoppers
            </div>
            <h2 className="text-7xl font-black text-white leading-tight">
              Never Pay
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> Full Price </span>
              Again
            </h2>
            <p className="text-2xl text-gray-300 leading-relaxed font-medium">
              Lowbal uses advanced AI to craft perfect negotiation messages and calculate optimal counter-offers for any online marketplace. Save thousands on cars, furniture, electronics, and more.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 py-8">
              <div className="text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20">
                <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">73%</div>
                <div className="text-sm text-gray-300 font-medium">Success Rate</div>
              </div>
              <div className="text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">$1,247</div>
                <div className="text-sm text-gray-300 font-medium">Avg. Savings</div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">2.3M</div>
                <div className="text-sm text-gray-300 font-medium">Deals Closed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 border-0 w-full sm:w-auto">
                  Start Negotiating Now
                  <Zap className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-6 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-xl font-black transition-all duration-300 hover:scale-105 bg-white/5">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">Works on all platforms</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop&auto=format"
                alt="Person successfully negotiating online deals"
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-2xl"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                  <span className="text-gray-200 font-bold">Original Price:</span>
                  <span className="font-black text-white line-through text-xl">$1,200</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-200 font-black">Your Offer:</span>
                  <span className="text-3xl font-black text-emerald-300">$850</span>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-black text-lg shadow-xl">
                  💰 You saved $350 (29% off)!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Logos Section */}
      <div className="bg-black/30 backdrop-blur-xl py-20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-white mb-6">Works on All Major Platforms</h3>
            <p className="text-xl text-gray-200 font-bold">Optimized strategies for every marketplace</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {/* Facebook Marketplace */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl">f</span>
              </div>
              <span className="text-sm font-black text-white">Facebook</span>
            </div>
            
            {/* Craigslist */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-xl">CL</span>
              </div>
              <span className="text-sm font-black text-white">Craigslist</span>
            </div>
            
            {/* eBay */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl">e</span>
              </div>
              <span className="text-sm font-black text-white">eBay</span>
            </div>
            
            {/* Zillow */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl">Z</span>
              </div>
              <span className="text-sm font-black text-white">Zillow</span>
            </div>
            
            {/* OfferUp */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl">O</span>
              </div>
              <span className="text-sm font-black text-white">OfferUp</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-6xl font-black text-white mb-8">How Lowbal Works</h3>
            <p className="text-2xl text-gray-200 max-w-4xl mx-auto font-bold">
              Our AI analyzes thousands of successful negotiations to craft the perfect strategy for your specific situation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 group bg-white/95 backdrop-blur-xl border border-gray-200 transform hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop&auto=format"
                  alt="Input listing details on smartphone"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-2xl"
                />
                <h4 className="text-2xl font-black text-gray-900 mb-4">1. Input Listing Details</h4>
                <p className="text-gray-800 text-lg leading-relaxed font-bold">
                  Paste the item title, price, and platform. Add any extra context about the seller or condition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group bg-white/95 backdrop-blur-xl border border-gray-200 transform hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&auto=format"
                  alt="AI analyzing negotiation data"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-2xl"
                />
                <h4 className="text-2xl font-black text-gray-900 mb-4">2. AI Calculates Strategy</h4>
                <p className="text-gray-800 text-lg leading-relaxed font-bold">
                  Our algorithm analyzes market data, platform patterns, and pricing psychology to determine the optimal offer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group bg-white/95 backdrop-blur-xl border border-gray-200 transform hover:scale-105">
              <CardContent className="p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <MessageSquare className="w-12 h-12 text-white" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop&auto=format"
                  alt="Successful negotiation message on phone"
                  className="w-full h-48 object-cover rounded-2xl mb-8 shadow-2xl"
                />
                <h4 className="text-2xl font-black text-gray-900 mb-4">3. Send Perfect Message</h4>
                <p className="text-gray-800 text-lg leading-relaxed font-bold">
                  Copy our AI-crafted message that's proven to get positive responses and close deals at lower prices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/30 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-6xl font-black text-white mb-8">Why Lowbal Gets Results</h3>
            <p className="text-2xl text-gray-200 max-w-4xl mx-auto font-bold">
              Built on proven negotiation psychology and trained on thousands of successful deals
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="space-y-12">
                <div className="flex gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-white mb-4">Smart Platform Recognition</h4>
                    <p className="text-gray-200 text-xl leading-relaxed font-bold">
                      Different platforms require different approaches. Our AI knows Facebook Marketplace sellers behave differently than Craigslist users.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-white mb-4">Psychology-Based Messaging</h4>
                    <p className="text-gray-200 text-xl leading-relaxed font-bold">
                      Messages crafted using proven negotiation techniques that build rapport while maintaining leverage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-white mb-4">Price-Aware Calculations</h4>
                    <p className="text-gray-200 text-xl leading-relaxed font-bold">
                      High-value items need conservative offers, while cheaper items can handle aggressive discounts. We calculate the sweet spot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop&auto=format"
                alt="Successful negotiation analytics dashboard"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-emerald-500/30">
                    <TrendingDown className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-emerald-400">73%</div>
                    <div className="text-sm text-gray-200 font-bold">Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-cyan-500/30">
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-cyan-400">50K+</div>
                    <div className="text-sm text-gray-200 font-bold">Happy Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h3 className="text-6xl font-black text-white mb-10">
            Ready to Save Money on Your Next Purchase?
          </h3>
          <p className="text-2xl text-white mb-12 leading-relaxed font-bold">
            Join thousands of smart shoppers who use Lowbal to negotiate better deals every day.
          </p>
          <Link to="/app">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-black">
              Start Negotiating Free
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </Link>
          <p className="text-white mt-8 text-xl font-bold">
            No signup required • Works instantly • Free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/50 backdrop-blur-xl py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-white/90 to-white/70 rounded-xl flex items-center justify-center">
                  <div className="text-transparent bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text font-black text-lg">L</div>
                </div>
              </div>
            </div>
            <span className="text-3xl font-black text-white">Lowbal</span>
          </div>
          <p className="text-center text-gray-200 text-xl font-bold">
            © 2024 Lowbal. AI-powered negotiation made simple.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;