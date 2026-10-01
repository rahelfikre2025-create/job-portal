import React, { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Search, MapPin, Briefcase, DollarSign, Filter, X, Clock, Building2, Sparkles } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Category = [];

const Categories = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("all");
    const [jobType, setJobType] = useState("all");
    const [salaryRange, setSalaryRange] = useState("all");
    const [experience, setExperience] = useState("all");
    const [industry, setIndustry] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useGetAllJobs();
    const { allJobs = [] } = useSelector((store) => store.job || {});

    // Handler for category buttons
    const searchjobHandler = (searchQuery) => {
        dispatch(setSearchedQuery(searchQuery));
        dispatch({ type: 'jobs/setSearchedExact', payload: false });
        navigate("/browse");
    }

    // Advanced search handler with intelligent filtering
    const handleSearch = () => {
        // Build search query with all criteria
        let searchQuery = query.trim();
        
        // Collect all active filters (excluding "all")
        const activeFilters = [];
        if (location && location !== "all") activeFilters.push(location);
        if (jobType && jobType !== "all") activeFilters.push(jobType);
        if (salaryRange && salaryRange !== "all") activeFilters.push(salaryRange);
        if (experience && experience !== "all") activeFilters.push(experience);
        if (industry && industry !== "all") activeFilters.push(industry);
        
        // Combine search query with filters
        if (activeFilters.length > 0) {
            if (searchQuery) {
                searchQuery = `${searchQuery} ${activeFilters.join(' ')}`;
            } else {
                searchQuery = activeFilters.join(' ');
            }
        }

        if (searchQuery) {
            // Use partial search for flexible matching (first letter, first name, etc.)
            dispatch(setSearchedQuery(searchQuery));
            dispatch({ type: 'jobs/setSearchedExact', payload: false });
            navigate("/browse");
        } else {
            // If no search criteria, show all jobs
            dispatch(setSearchedQuery(""));
            dispatch({ type: 'jobs/setSearchedExact', payload: false });
            navigate("/browse");
        }
    }

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setQuery("");
        setLocation("all");
        setJobType("all");
        setSalaryRange("all");
        setExperience("all");
        setIndustry("all");
        dispatch(setSearchedQuery(""));
        dispatch({ type: 'jobs/setSearchedExact', payload: false });
    }

    // Check if any filters are active
    const hasActiveFilters = location !== "all" || jobType !== "all" || salaryRange !== "all" || experience !== "all" || industry !== "all" || query.trim() !== "";

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10"> 
            
            {/* Professional Search Bar with Filters */}
            <div className="flex flex-col items-center my-6 sm:my-8 md:my-10">
                {/* Main Search Container */}
                <div className="w-full max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Search Input Section */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 p-2 sm:p-3 md:p-4">
                            <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-50 to-white rounded-xl sm:rounded-l-xl sm:rounded-r-none px-3 sm:px-4 h-[48px] sm:h-[52px] md:h-[56px] border-2 border-gray-200 focus-within:border-[#008b8b] focus-within:ring-2 focus-within:ring-[#008b8b]/20 transition-all duration-300">
                                <div className="relative flex-shrink-0">
                                    <Search className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#008b8b] animate-pulse" />
                                    <div className="absolute -inset-1 bg-[#008b8b]/10 rounded-full blur-sm"></div>
                                </div>
                                <input
                                    type="text"
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search jobs by title, company, skills..."
                                    className="outline-none border-none w-full bg-transparent text-sm sm:text-base md:text-lg text-gray-700 placeholder-gray-400 font-medium h-full"
                                    value={query}
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <Button 
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-[#008b8b] to-[#006d6d] hover:from-[#007a7a] hover:to-[#005d5d] text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl px-4 sm:px-6 md:px-8 h-[48px] sm:h-[52px] md:h-[56px] flex items-center justify-center gap-2 font-bold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform active:scale-95"
                            >
                                <div className="relative">
                                    <Search className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                                </div>
                                <span className="hidden sm:inline">Search</span>
                                <span className="sm:hidden">Go</span>
                            </Button>
                        </div>

                        {/* Advanced Filters Section */}
                        <div className="border-t border-gray-200 bg-gray-50">
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 hover:text-[#008b8b] transition-colors"
                                    >
                                        <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span>Advanced Filters</span>
                                        {hasActiveFilters && (
                                            <span className="ml-1 px-2 py-0.5 bg-[#008b8b] text-white text-xs rounded-full">
                                                {[location !== "all", jobType !== "all", salaryRange !== "all", experience !== "all", industry !== "all"].filter(Boolean).length}
                                            </span>
                                        )}
                                    </button>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span>Clear All</span>
                                        </button>
                                    )}
                                </div>

                                {/* Filters Grid */}
                                {showFilters && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                                        {/* Location Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Location
                                            </label>
                                            <Select value={location} onValueChange={setLocation}>
                                                <SelectTrigger className="w-full bg-white border-gray-300 h-[48px] sm:h-[52px] md:h-[56px] text-sm sm:text-base md:text-lg px-4 py-3 sm:py-4">
                                                    <SelectValue placeholder="Any Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Location</SelectItem>
                                                    <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                                                    <SelectItem value="Adama">Adama</SelectItem>
                                                    <SelectItem value="Hawassa">Hawassa</SelectItem>
                                                    <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                                                    <SelectItem value="Jimma">Jimma</SelectItem>
                                                    <SelectItem value="Bahir Dar">Bahir Dar</SelectItem>
                                                    <SelectItem value="Mekelle">Mekelle</SelectItem>
                                                    <SelectItem value="Gondar">Gondar</SelectItem>
                                                    <SelectItem value="Remote">Remote</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Job Type Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                Job Type
                                            </label>
                                            <Select value={jobType} onValueChange={setJobType}>
                                                <SelectTrigger className="w-full bg-white border-gray-300 h-[48px] sm:h-[52px] md:h-[56px] text-sm sm:text-base md:text-lg px-4 py-3 sm:py-4">
                                                    <SelectValue placeholder="Any Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Type</SelectItem>
                                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Internship">Internship</SelectItem>
                                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Salary Range Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Salary Range
                                            </label>
                                            <Select value={salaryRange} onValueChange={setSalaryRange}>
                                                <SelectTrigger className="w-full bg-white border-gray-300 h-[48px] sm:h-[52px] md:h-[56px] text-sm sm:text-base md:text-lg px-4 py-3 sm:py-4">
                                                    <SelectValue placeholder="Any Salary" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Salary</SelectItem>
                                                    <SelectItem value="0-50k">0 - 50k ETB</SelectItem>
                                                    <SelectItem value="50k-100k">50k - 100k ETB</SelectItem>
                                                    <SelectItem value="100k-200k">100k - 200k ETB</SelectItem>
                                                    <SelectItem value="200k+">200k+ ETB</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Experience Level Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Experience
                                            </label>
                                            <Select value={experience} onValueChange={setExperience}>
                                                <SelectTrigger className="w-full bg-white border-gray-300 h-[48px] sm:h-[52px] md:h-[56px] text-sm sm:text-base md:text-lg px-4 py-3 sm:py-4">
                                                    <SelectValue placeholder="Any Experience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Experience</SelectItem>
                                                    <SelectItem value="0-3 years">0-3 years</SelectItem>
                                                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                                                    <SelectItem value="5-7 years">5-7 years</SelectItem>
                                                    <SelectItem value="7+ years">7+ years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Industry Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                Industry
                                            </label>
                                            <Select value={industry} onValueChange={setIndustry}>
                                                <SelectTrigger className="w-full bg-white border-gray-300 h-[48px] sm:h-[52px] md:h-[56px] text-sm sm:text-base md:text-lg px-4 py-3 sm:py-4">
                                                    <SelectValue placeholder="Any Industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Industry</SelectItem>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Construction">Construction</SelectItem>
                                                    <SelectItem value="Art and MultiMedia">Art and MultiMedia</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="Management and Admnistration">Management and Administration</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Hospitality and Tourism">Hospitality and Tourism</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {/* Active Filters Display */}
                                {(location !== "all" || jobType !== "all" || salaryRange !== "all" || experience !== "all" || industry !== "all") && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {location !== "all" && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008b8b]/10 text-[#008b8b] rounded-full text-xs sm:text-sm">
                                                <MapPin className="h-3 w-3" />
                                                {location}
                                                <button onClick={() => setLocation("all")} className="ml-1 hover:text-red-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {jobType !== "all" && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008b8b]/10 text-[#008b8b] rounded-full text-xs sm:text-sm">
                                                <Briefcase className="h-3 w-3" />
                                                {jobType}
                                                <button onClick={() => setJobType("all")} className="ml-1 hover:text-red-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {salaryRange !== "all" && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008b8b]/10 text-[#008b8b] rounded-full text-xs sm:text-sm">
                                                <DollarSign className="h-3 w-3" />
                                                {salaryRange}
                                                <button onClick={() => setSalaryRange("all")} className="ml-1 hover:text-red-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {experience !== "all" && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008b8b]/10 text-[#008b8b] rounded-full text-xs sm:text-sm">
                                                <Clock className="h-3 w-3" />
                                                {experience}
                                                <button onClick={() => setExperience("all")} className="ml-1 hover:text-red-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {industry !== "all" && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008b8b]/10 text-[#008b8b] rounded-full text-xs sm:text-sm">
                                                <Building2 className="h-3 w-3" />
                                                {industry}
                                                <button onClick={() => setIndustry("all")} className="ml-1 hover:text-red-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* EXISTING: CATEGORIES SECTION */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-center text-blue-600 mt-6 sm:mt-10">
                    
                </h1>
                <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                    
                </p>
            </div>
            
            <Carousel className="w-full max-w-4xl mx-auto mb-10 sm:mb-20"> 
                <CarouselContent>
                    {Category.map((category, index) => {
                        return (
                            // Increased basis for better visibility on larger screens
                            <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                                <Button 
                                    onClick={() => searchjobHandler(category)}
                                    // Styled the buttons for a cleaner, modern look
                                    className="w-full bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300 font-medium h-10 sm:h-12 text-xs sm:text-sm md:text-base"
                                    variant="outline"
                                >
                                    {category}
                                </Button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    );
};

export default Categories;