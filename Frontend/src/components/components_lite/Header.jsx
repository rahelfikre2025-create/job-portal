import React, { useState } from "react";
// Button, Search, PiBuildingOfficeBold, useDispatch, useNavigate are now relevant for the search bar logic
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
// Note: heroIllustration import is no longer needed for this background style.

const Header = () => {
    // State/dispatch/navigate hooks are retained for future search logic implementation
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Placeholder function for search submission
    const handleSearch = (e) => {
        e.preventDefault();
        // Replace with actual search dispatch/navigation as needed
        // dispatch(setSearchedQuery({ query, category, location }));
        // navigate(`/browse?q=${encodeURIComponent(query)}&cat=${encodeURIComponent(category)}&loc=${encodeURIComponent(location)}`);
    };

    return (
        // 1. THE MAIN CONTAINER for the Background Image
        // NOTE: We remove the 'container' and 'mx-auto' class here to achieve full width.
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] w-full overflow-hidden"> 
            
            {/* 2. THE BACKGROUND IMAGE WITH STYLING - Fully Responsive */}
            <div
                className="absolute inset-0 hero-background bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "linear-gradient(rgba(11,18,32,0.30), rgba(11,18,32,0.55)), url('/background.jpg')",
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'scroll',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                role="img"
                aria-label="Job portal hero background"
            >
                {/* Additional overlay for better text readability on all devices */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
            </div>

            {/* 4. THE CONTENT LAYER (Headline and Search Fields) */}
            {/* Use 'container mx-auto' here to center the content over the full-width image */}
            <div className="relative z-10 h-full flex flex-col justify-center pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 container mx-auto text-white"> 
                
                {/* Top Text */}
                <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-light">We have many great job offers you deserve!</p>
                
                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                    Your Dream <br className="hidden sm:block"/> Job is Waiting
                </h1>
                
               
                
            </div>
        </div>
    );
};

export default Header;