import React, { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
  import API from "../../api/api";

export default function FoodReels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const videoRefs = useRef(new Map());
  const [playingId, setPlayingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all food reels
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/food", {
          withCredentials: true,
        });
        setVideos(res.data.foodItems);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Please login first!");
          navigate("/user/login"); // redirect to login page
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [navigate]);

  // IntersectionObserver for autoplay
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
      if (e.key === "ArrowDown") {
        containerRef.current.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowUp") {
        containerRef.current.scrollBy({
          top: -window.innerHeight,
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

  const setVideoRef = (id, node) => {
    videoRefs.current.set(String(id), node);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading videos...
      </div>
    );
  }

  return (
    <div className="bg-black h-screen w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {videos
          .filter((item) => item.foodPartner)
          .map((item) => (
            <section
              key={item._id}
              className="h-screen w-full snap-start flex items-center justify-center relative"
            >
              <VideoCard
                id={item._id}
                src={item.video}
                name={item.name}
                description={item.description}
                foodPartner={item.foodPartner?._id || null} // <-- safe
                setVideoRef={setVideoRef}
                isPlaying={String(playingId) === String(item._id)}
              />
            </section>
          ))}
      </div>
    </div>
  );
}
