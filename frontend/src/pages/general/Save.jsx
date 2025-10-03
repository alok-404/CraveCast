import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bookmark, Loader2, VideoOff } from "lucide-react"; // 💡 Added Lucide Icons
import API from "../../api/api";
// Note: axios is imported but you should use the imported API instance for consistency
// const Save = () => { // Changed the function to use the imported API
const Save = () => {
  const [savedReels, setSavedReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedReels = async () => {
      try {
        // 💡 Use the imported API instance for consistency
        const API_URL = "/food/user/saved-reels";

        // Using API instance (assuming it's configured with the base URL and credentials)
        const res = await API.get(API_URL, { withCredentials: true });

        setSavedReels(res.data.savedReels);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load saved reels");
        setLoading(false);
      }
    };
    fetchSavedReels();
  }, []); // LOGIC UNTOUCHED

  // ------------------ UI Rendering ------------------

  if (loading)
    // 💡 Enhanced Loading State
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="ml-3 text-lg text-gray-700">Fetching your saved favorites...</p>
      </div>
    );

  if (!savedReels.length)
    // 💡 Enhanced Empty State
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <VideoOff className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Nothing saved here!</h2>
        <p className="text-gray-500">Find some delicious reels and hit the bookmark button!</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      
      {/* 💡 Heading with Icon */}
      <div className="flex items-center mb-8">
        <Bookmark className="w-8 h-8 text-red-500 mr-3" fill="red" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Saved Cravings</h1>
      </div>

      {/* 💡 Responsive Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {savedReels.map((reel) => (
          <div
            key={reel._id}
            // 💡 Card Styling: Modern, lifted appearance on hover
            className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer 
                        hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
          >
            {/* Video Thumbnail/Element */}
            <div className="relative w-full aspect-[9/16] bg-black">
              <video
                src={reel.video}
                // 💡 Removed controls here to make it look like a thumbnail gallery
                // Controls can be added on click to play the full reel in a modal/new page
                className="w-full h-full object-cover transition duration-300 group-hover:opacity-80"
                loop
                muted
              ></video>
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              
              {/* Reel Name */}
              <h2 className="font-bold text-white text-sm truncate">{reel.name}</h2>
              
              {/* Partner Name */}
              <p className="text-xs text-gray-300 mt-0.5 truncate">
                By: <span className="font-medium">{reel.foodPartner?.businessName || "Unknown Partner"}</span>
              </p>
            </div>
            
            {/* 💡 Optional Hover Effect: Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.31 2.706-1.638l10.866 6.035a2.25 2.25 0 0 1 0 3.945l-10.866 6.035A2.25 2.25 0 0 1 4.5 18.347V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Save;