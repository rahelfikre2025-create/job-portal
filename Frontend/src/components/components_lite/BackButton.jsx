import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = ({ fallback = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the back button on specific routes
  const hideOn = ['/', '/home', '/login', '/register'];
  const pathname = (location.pathname || '').toLowerCase();
  if (hideOn.includes(pathname)) return null;

  const goBack = () => {
    try {
      navigate(-1);
    } catch (err) {
      navigate(fallback);
    }
  };

  return (
    <div className="px-6 py-3 border-b bg-white">
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
    </div>
  );
};

export default BackButton;
