import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageSquare, TrendingUp, Award, Users } from "lucide-react";

interface Review {
  id: string;
  user: string;
  rating: number;
  title: string;
  content: string;
  savings: number;
  category: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

const ReviewsTab = () => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const reviews: Review[] = [
    {
      id: '1',
      user: 'Sarah M.',
      rating: 5,
      title: 'Saved $2,400 on my car purchase!',
      content: 'I was skeptical at first, but Lowbal\'s AI really works! The negotiation message it generated was perfect - professional but firm. The seller responded positively and we settled on a price $2,400 lower than asking. The category-specific tips for car buying were spot on.',
      savings: 2400,
      category: 'cars',
      date: new Date('2024-01-20'),
      helpful: 23,
      verified: true
    },
    {
      id: '2',
      user: 'Mike R.',
      rating: 5,
      title: 'Perfect for electronics deals',
      content: 'Used this for buying a MacBook Pro and it worked amazingly. The AI understood that electronics depreciate quickly and crafted a message that emphasized immediate pickup and cash payment. Saved $350 and the whole process was smooth.',
      savings: 350,
      category: 'electronics',
      date: new Date('2024-01-18'),
      helpful: 18,
      verified: true
    },
    {
      id: '3',
      user: 'Jennifer L.',
      rating: 4,
      title: 'Great for furniture shopping',
      content: 'The furniture category tips were really helpful. The AI suggested mentioning that I could handle pickup myself, which seemed to make the seller more flexible on price. Saved $200 on a dining set. Only wish it had more platform-specific strategies.',
      savings: 200,
      category: 'furniture',
      date: new Date('2024-01-15'),
      helpful: 12,
      verified: true
    },
    {
      id: '4',
      user: 'David K.',
      rating: 5,
      title: 'Real estate negotiation success',
      content: 'Even worked for real estate! The conservative approach for high-value items was perfect. The AI helped me craft an offer that was competitive but not insulting. Saved $15,000 on my home purchase by following the strategy.',
      savings: 15000,
      category: 'real-estate',
      date: new Date('2024-01-12'),
      helpful: 31,
      verified: true
    },
    {
      id: '5',
      user: 'Lisa T.',
      rating: 5,
      title: 'Multiple successful negotiations',
      content: 'I\'ve used Lowbal for 5 different purchases now - from a motorcycle to kitchen appliances. The success rate is incredible. The AI learns from each category and provides tailored advice. My total savings so far: $3,200!',
      savings: 3200,
      category: 'multiple',
      date: new Date('2024-01-10'),
      helpful: 27,
      verified: true
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalSavings = reviews.reduce((sum, review) => sum + review.savings, 0);

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-800 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-yellow-700 font-medium">Average Rating</div>
            <div className="flex justify-center mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-800 mb-1">
              ${totalSavings.toLocaleString()}
            </div>
            <div className="text-green-700 font-medium">Total Savings</div>
            <div className="text-sm text-green-600 mt-1">From reviews</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-1">
              {reviews.length}
            </div>
            <div className="text-blue-700 font-medium">Total Reviews</div>
            <div className="text-sm text-blue-600 mt-1">Verified users</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-800 mb-1">
              96%
            </div>
            <div className="text-purple-700 font-medium">Success Rate</div>
            <div className="text-sm text-purple-600 mt-1">Positive outcomes</div>
          </CardContent>
        </Card>
      </div>

      {/* Write Review Section */}
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            Share Your Success Story
          </CardTitle>
          <p className="text-gray-600">Help others by sharing your negotiation experience</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            {renderStars(newRating, true, setNewRating)}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              placeholder="Tell us about your experience with Lowbal. How much did you save? What category was it? Any tips for other users?"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-[120px] border-2 focus:border-green-500 transition-colors"
            />
          </div>
          
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            Submit Review
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">User Reviews</h3>
        
        {reviews.map((review) => (
          <Card key={review.id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {review.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                      {review.verified && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Saved ${review.savings.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {review.category.replace('-', ' ')}
                  </div>
                </div>
              </div>
              
              <h5 className="font-bold text-lg text-gray-900 mb-3">
                {review.title}
              </h5>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.content}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful ({review.helpful})
                </Button>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Category: {review.category.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>Verified Purchase</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;