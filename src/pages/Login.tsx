import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Placeholder authentication - replace with Supabase later
    try {
      if (email && password) {
        // Simulate login success
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Login Successful",
          description: "Welcome back to Lowbal!",
        });
        navigate('/app');
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop&auto=format"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* Enhanced Creative Logo */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="w-14 h-14 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl flex items-center justify-center">
                  <div className="text-transparent bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text font-black text-2xl">L</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Lowbal</h1>
          </div>
          <p className="text-gray-200 text-xl font-bold">Welcome back! Sign in to your account</p>
        </div>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/20">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl text-center font-black text-gray-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg font-black text-gray-900">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 pl-14 text-lg border-2 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 transition-all duration-300 rounded-2xl font-bold shadow-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="password" className="text-lg font-black text-gray-900">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-16 pl-14 pr-14 text-lg border-2 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 transition-all duration-300 rounded-2xl font-bold shadow-lg"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 border-0" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-4"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center space-y-6">
              <p className="text-lg text-gray-700 font-bold">
                Don't have an account?{" "}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-black transition-colors">
                  Sign up for free
                </Link>
              </p>
              <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors font-bold">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;