import React, { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
// 💡 New imports for modern UI elements
import { Loader2 } from "lucide-react"; 

export default function FoodReels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const videoRefs = useRef(new Map());
  const [playingId, setPlayingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all food reels - LOGIC UNCHANGED
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/food", {
          withCredentials: true,
        });
        // Filter out items without a food partner early to prevent errors
        setVideos(res.data.foodItems.filter((item) => item.foodPartner));
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          // Changed alert to a more subtle redirection message
          console.warn("Authentication failed. Redirecting to login.");
          navigate("/user/login"); // redirect to login page
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [navigate]);

  // IntersectionObserver for autoplay & Keyboard navigation - LOGIC UNCHANGED
  useEffect(() => {
    const opts = { root: null, rootMargin: "0px", threshold: 0.75 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const vid = entry.target;
        const id = vid.dataset.vidid;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
          setPlayingId(id);
        } else {
          vid.pause();
          setPlayingId((curr) => (curr === id ? null : curr));
        }
      });
    }, opts);

    videoRefs.current.forEach((node) => node && observer.observe(node));

    const onKey = (e) => {
      if (!containerRef.current) return;
      if (e.key === "ArrowDown" || e.key === " ") { // Added Spacebar for scroll
        containerRef.current.scrollBy({
          top: containerRef.current.clientHeight, // Use clientHeight for full view scroll
          behavior: "smooth",
        });
      } else if (e.key === "ArrowUp") {
        containerRef.current.scrollBy({
          top: -containerRef.current.clientHeight, // Use clientHeight for full view scroll
          behavior: "smooth",
        });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [videos]);

  // setVideoRef function - LOGIC UNCHANGED
  const setVideoRef = (id, node) => {
    videoRefs.current.set(String(id), node);
  };

  if (loading) {
    return (
      // 💡 Enhanced Loading UI
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" /> {/* Using Lucide icon for spinner */}
        <p className="mt-4 text-lg font-semibold tracking-wide">
          Buffering delicious moments...
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">No Reels Available</h1>
            <p className="text-gray-400">
                It looks like there are no food reels posted yet. Check back later!
            </p>
            <button 
                onClick={() => navigate('/')} 
                className="mt-6 bg-brand-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition"
            >
                Go to Home
            </button>
        </div>
     );
  }

  return (
    // 💡 Outer container with smooth scrolling, hiding scrollbar
    <div className="bg-black h-screen w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth 
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {videos
          // 💡 Removed .filter() here as it's better handled in useEffect, but kept for safety if data changes.
          .filter((item) => item.foodPartner) 
          .map((item) => (
            <section
              key={item._id}
              // 💡 Section UI: Full screen height and width, centering content
              className="h-screen w-full snap-start flex items-center justify-center relative bg-gray-900" 
            >
              <VideoCard
                id={item._id}
                src={item.video}
                name={item.name}
                description={item.description}
                foodPartner={item.foodPartner} // <-- Passed whole object now, assuming it contains name/details for UI
                setVideoRef={setVideoRef}
                isPlaying={String(playingId) === String(item._id)}
              />
            </section>
          ))}
      </div>
    </div>
  );
}