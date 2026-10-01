import React, { useEffect, useState } from "react";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Filter, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const { allJobs = [], searchedQuery = "" } = useSelector((store) => store.job || {});
  const [filterJobs, setFilterJobs] = useState(allJobs || []);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If no search query is provided, reset to all jobs
    //     if (searchedQuery)
    if (!searchedQuery || searchedQuery.trim() === "") {
      setFilterJobs(allJobs);
      return;
    }

    // Filter based on the searched query across various fields (title, description, etc.)
    const filteredJobs = allJobs.filter((job) => {
      const query = String(searchedQuery).toLowerCase();
      const title = String(job.title ?? "").toLowerCase();
      const description = String(job.description ?? "").toLowerCase();
      const location = String(job.location ?? "").toLowerCase();
      const experience = String(job.experience ?? "").toLowerCase();
      const salary = String(job.salary ?? "").toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        location.includes(query) ||
        experience.includes(query) ||
        salary.includes(query)
      );
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
          {/* Filter Card - Hidden on mobile unless toggled, visible on desktop */}
          <div className={`w-full lg:w-1/5 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-4">
              <FilterCard />
            </div>
          </div>

          {/* Jobs Grid */}
          {filterJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center py-10 min-h-[60vh]">
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
            <div className="flex-1 min-h-[60vh] lg:h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterJobs.map((job, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    key={job._id ?? job.id ?? idx}
                  >
                    <Job1 job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 