import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Logo from '@/components/Logo';

const RateFlightPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // In a real app, we would get this from query params or location state
  const bookingId = location.state?.bookingId || 'BK0536';

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    if (comment.length < 10) {
      setError('Please provide a comment with at least 10 characters');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 1500);
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" data-id="3ytj3rmqb" data-path="src/pages/RateFlightPage.tsx">
      <Header data-id="utlkrouki" data-path="src/pages/RateFlightPage.tsx" />
      
      <div className="flex-grow flex justify-center items-center p-4" data-id="uad4fguc5" data-path="src/pages/RateFlightPage.tsx">
        <div className="bg-gray-100 rounded-lg p-10 max-w-md w-full shadow-lg" data-id="smu7yom85" data-path="src/pages/RateFlightPage.tsx">
          {success ?
          <div className="text-center py-6" data-id="4wrhtuims" data-path="src/pages/RateFlightPage.tsx">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" data-id="fpx0x7wj9" data-path="src/pages/RateFlightPage.tsx">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="4tr69p78m" data-path="src/pages/RateFlightPage.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" data-id="22llp3z4c" data-path="src/pages/RateFlightPage.tsx"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-center mb-2" data-id="1g6ii5w3y" data-path="src/pages/RateFlightPage.tsx">Thank You for Your Feedback!</h1>
              <p className="text-gray-600" data-id="cyukh4vlj" data-path="src/pages/RateFlightPage.tsx">Your rating has been successfully submitted.</p>
            </div> :

          <>
              <h1 className="text-3xl font-bold text-center mb-1" data-id="6m01zl3oo" data-path="src/pages/RateFlightPage.tsx">Rate Our Service</h1>
              <p className="text-center text-gray-600 mb-6" data-id="lmwwcdu14" data-path="src/pages/RateFlightPage.tsx">Booking ID: {bookingId}</p>
              
              <div className="flex justify-center mb-8" data-id="behk7asrc" data-path="src/pages/RateFlightPage.tsx">
                {[1, 2, 3, 4, 5].map((star) =>
              <button
                key={star}
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none mx-1" data-id="f9qzpoejp" data-path="src/pages/RateFlightPage.tsx">

                    <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill={star <= rating ? "#FFD700" : "#C0C0C0"}
                  xmlns="http://www.w3.org/2000/svg" data-id="i6k15y07k" data-path="src/pages/RateFlightPage.tsx">

                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" data-id="yfftlz6as" data-path="src/pages/RateFlightPage.tsx" />
                    </svg>
                  </button>
              )}
              </div>
              
              <div className="mb-6" data-id="ffodguh9w" data-path="src/pages/RateFlightPage.tsx">
                <h2 className="text-xl font-bold mb-2" data-id="ier46qg7n" data-path="src/pages/RateFlightPage.tsx">Your Comment:</h2>
                <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={`w-full h-24 p-3 bg-white rounded-md ${error ? 'border-red-500' : ''}`} data-id="80t6j2t9v" data-path="src/pages/RateFlightPage.tsx" />
                {error && <p className="text-red-500 text-sm mt-1" data-id="slvy3qa8n" data-path="src/pages/RateFlightPage.tsx">{error}</p>}
              </div>
              
              {error && <p className="text-red-500 text-sm mb-4 text-center" data-id="qeg0jsqyy" data-path="src/pages/RateFlightPage.tsx">{error}</p>}
              
              <div className="grid grid-cols-2 gap-4" data-id="u4mmrgs2u" data-path="src/pages/RateFlightPage.tsx">
                <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 py-6 text-lg" data-id="3744k94tt" data-path="src/pages/RateFlightPage.tsx">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                <Button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 py-6 text-lg" data-id="4wrk5ria1" data-path="src/pages/RateFlightPage.tsx">
                  Skip
                </Button>
              </div>
            </>
          }
        </div>
      </div>
      
      <div className="p-4 mt-6 text-center" data-id="x3zvy77h3" data-path="src/pages/RateFlightPage.tsx">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline" data-id="c3oak9j9c" data-path="src/pages/RateFlightPage.tsx">
          Return to Homepage
        </button>
      </div>
    </div>);

};

export default RateFlightPage;