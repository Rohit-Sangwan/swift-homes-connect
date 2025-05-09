
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  providerId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ providerId, onReviewSubmitted }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuthStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a review.",
          variant: "destructive",
        });
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          provider_id: providerId,
          user_id: userId,
          rating,
          comment: comment.trim() || null
        });
        
      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: "Failed to submit your review. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Reset form
      setRating(0);
      setComment('');
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      // Call the callback to refresh reviews
      onReviewSubmitted();
      
    } catch (error) {
      console.error('Error in review submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn === false) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="mb-2 text-gray-600">Please log in to leave a review</p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = '/auth'}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-medium mb-3">Write a Review</h3>
      
      {/* Star Rating */}
      <div className="flex items-center mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="cursor-pointer"
            >
              <Star
                size={24}
                className={`
                  ${((hoveredStar !== null ? hoveredStar >= star : rating >= star) 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-300")
                  }
                `}
              />
            </span>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
        </span>
      </div>
      
      {/* Comment */}
      <Textarea
        placeholder="Tell us about your experience with this service provider..."
        className="resize-none mb-4"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-brand-blue hover:bg-brand-blue/90"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
