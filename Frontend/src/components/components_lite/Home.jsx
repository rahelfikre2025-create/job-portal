import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// Navbar and Footer are provided by RootLayout
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetRecommendedJobs from "@/hooks/useGetRecommendedJobs";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, error } = useGetAllJobs(); // Trigger data fetch
  const jobs = useSelector((state) => (state.job && state.job.allJobs) || (state.jobs && state.jobs.allJobs) || []); // Access Redux state (safe fallback for both keys)

  // Debug logs removed for production; rely on React DevTools for inspection
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  // Fetch recommendations for job seekers so they appear at the top of Home upon login
  const rec = useGetRecommendedJobs();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/recruiter/companies");
    }
  }, [user, navigate]);

  return (
    <div>
      <Header />

      {user && user.role === 'Job Seeker' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {rec.loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-gray-600">Loading recommendations...</div>
            </div>
          ) : rec.error ? (
            <div className="text-red-500">{rec.error}</div>
          ) : (rec.results && rec.results.length > 0) && (() => {
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
        </div>
      )}

      <Categories />
    </div>
  );
};

export default Home;