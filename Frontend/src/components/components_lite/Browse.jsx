import React, { useEffect } from "react";
// Navbar is provided by RootLayout
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetRecommendedJobs from "@/hooks/useGetRecommendedJobs";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Browse = () => {
  const { loading, error } = useGetAllJobs();
  const { allJobs = [], searchedQuery = "" } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth || {});
  const rec = useGetRecommendedJobs();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
      // Reset exact flag when leaving browse
      dispatch({ type: 'jobs/setSearchedExact', payload: false });
    };
  }, [dispatch]);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate("/Home")}
              variant="outline"
              className="flex items-center gap-2 hover:bg-[#008b8b] hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Button>
          </div>
          <h1 className="font-bold text-lg sm:text-xl mb-2">
            {searchedQuery ? `Search Results for "${searchedQuery}"` : "All Jobs"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Found {allJobs.length} {allJobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#008b8b]"></div>
              <p className="mt-4 text-gray-600">Searching jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-10">
            <span className="text-red-500 text-lg">Error: {error}</span>
          </div>
        ) : (
          <>
            {user && user.role === 'Job Seeker' && rec && rec.results && rec.results.length > 0 && (() => {
              const filtered = rec.results.filter(r => (typeof r.skillScore !== 'undefined' ? Number(r.skillScore) : Number(r.matchScore || 0)) > 10);
              if (filtered.length === 0) return null;
              return (
                <div className="mb-6">
                  <h2 className="font-semibold mb-3">Recommended for you</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {filtered.slice(0,3).map((r) => (
                      <div
                        key={r.job._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/description/${r.job._id}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/description/${r.job._id}`); }}
                        className="p-4 border rounded bg-white cursor-pointer hover:shadow-lg focus:shadow-outline"
                        aria-label={`Open job details for ${r.job.title}`}
                      >
                        <div className="font-semibold">{r.job.title}</div>
                        <div className="text-sm text-gray-600">{r.job.company?.name || ''}</div>
                        <div className="text-xs text-gray-500 mt-2">Match: {r.matchScore}% • Skills: {r.skillsMatched}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()} 

            {allJobs.length === 0 ? (
              <div className="fixed inset-0 flex items-center justify-center bg-slate-100">
                <div className="text-center px-4">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <Search className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#008b8b]" />
                    </div>
                    <div className="absolute -inset-2 bg-[#008b8b]/10 rounded-full blur-xl"></div>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                    No Job Found
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6">
                    {searchedQuery 
                      ? `No jobs match your search "${searchedQuery}"` 
                      : "No jobs available at the moment"}
                  </p>
                  <Button
                    onClick={() => navigate("/Home")}
                    className="bg-[#008b8b] hover:bg-[#007a7a] text-white px-6 py-3 flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base font-semibold">Back to Home</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allJobs.map((job) => {
                  return <Job1 key={job._id} job={job} />;
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;