import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Search } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const statusText = error?.statusText || error?.message || 'Unknown Error';
  const status = error?.status || 'Error';
  const is404 = status === 404 || statusText.includes('404') || statusText.includes('Not Found');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="text-center px-4 max-w-md w-full">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#008b8b]" />
          </div>
          <div className="absolute -inset-2 bg-[#008b8b]/10 rounded-full blur-xl"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-2">
          {is404 ? 'No Page Found' : 'Unexpected Application Error!'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6">
          {is404 
            ? "The page you're looking for doesn't exist or has been moved." 
            : `${status} — ${statusText}`}
        </p>

        {!is404 && (
          <div className="mb-4 text-left bg-gray-50 p-3 rounded text-sm text-gray-700">
            <strong>Developer hint:</strong>
            <div className="mt-2">Provide an <code>errorElement</code> prop on the route or an ErrorBoundary to render friendly errors.</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link 
            to="/" 
            className="px-6 py-3 bg-[#008b8b] hover:bg-[#007a7a] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 border-2 border-gray-300 hover:border-[#008b8b] text-gray-700 hover:text-[#008b8b] rounded-lg font-semibold transition-all"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
