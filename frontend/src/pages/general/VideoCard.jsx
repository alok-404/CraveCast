import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftIcon as CommentOutline,
  BookmarkIcon as SaveOutline,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as SaveSolid,
} from "@heroicons/react/24/solid";

export default function VideoCard({
  id,
  src,
  foodPartner,
  name,
  description,
  setVideoRef,
}) {
  const navigate = useNavigate();
  const vidRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [localPaused, setLocalPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (setVideoRef) setVideoRef(id, vidRef.current);
  }, [setVideoRef, id]);

  // Fetch initial status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/food/${id}/status`,
          {
            withCredentials: true,
          }
        );
        setLikeCount(res.data.likeCount);
        setCommentCount(res.data.commentCount);
        setSaveCount(res.data.saveCount);
        setLiked(res.data.likedByUser);
        setSaved(res.data.savedByUser);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Please login first!");
          navigate("/login");
        }
      }
    };
    fetchStatus();
  }, [id, navigate]);

  const onTap = () => {
    const v = vidRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setLocalPaused(false);
    } else {
      v.pause();
      setLocalPaused(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = vidRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Like/Unlike
  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));
    try {
      await axios.post(
        `http://localhost:3000/api/food/${id}/like`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setLiked(!nextLiked);
      setLikeCount((prev) => (nextLiked ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Save/Unsave
  const handleSave = async () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    setSaveCount((prev) => (nextSaved ? prev + 1 : Math.max(prev - 1, 0)));
    try {
      await axios.post(
        `http://localhost:3000/api/food/${id}/save`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setSaved(!nextSaved);
      setSaveCount((prev) => (nextSaved ? Math.max(prev - 1, 0) : prev + 1));
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food/${id}/comments`,
        {
          withCredentials: true,
        }
      );
      setComments(res.data.comments);
      setCommentCount(res.data.comments.length);
      setShowComments(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/api/food/${id}/comment`,
        { text: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data.comment]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/food/${id}/comment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };



  

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-black"
      onClick={onTap}
    >
      <video
        ref={vidRef}
        data-vidid={id}
        src={src}
        playsInline
        loop
        muted={muted}
        preload="metadata"
        className="h-full w-full object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex justify-between items-end p-4">
        <div className="text-white max-w-[70%] mb-16">
          <div className="font-bold mb-2">{name}</div>
          <div className="text-sm leading-snug">{description}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/food-partner/${foodPartner}`);
            }}
            className="text-sm mt-2 px-3 py-1 rounded bg-blue-500 text-white font-semibold"
          >
            Visit store
          </button>
        </div>

        {/* Right buttons */}
        <div className="flex flex-col gap-6 items-center mr-2 pointer-events-auto mb-20">
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center"
            >
              {liked ? (
                <HeartSolid className="w-7 h-7 text-red-500" />
              ) : (
                <HeartOutline className="w-7 h-7 text-white" />
              )}
            </button>
            <span className="text-white text-xs mt-1">{likeCount}</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchComments();
              }}
              className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center"
            >
              <CommentOutline className="w-7 h-7 text-white" />
            </button>
            <span className="text-white text-xs mt-1">{commentCount}</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center"
            >
              {saved ? (
                <SaveSolid className="w-7 h-7 text-amber-400" />
              ) : (
                <SaveOutline className="w-7 h-7 text-white" />
              )}
            </button>
            <span className="text-white text-xs mt-1">{saveCount}</span>
          </div>

          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center"
          >
            {muted ? (
              <SpeakerXMarkIcon className="w-7 h-7 text-white" />
            ) : (
              <SpeakerWaveIcon className="w-7 h-7 text-white" />
            )}
          </button>
        </div>
      </div>

      {localPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded">
          Paused
        </div>
      )}

      {/* Comments overlay */}
      {showComments && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-end z-50"
          onClick={() => setShowComments(false)}
        >
          <div
            className="bg-white w-full h-1/2 rounded-t-xl p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-3">Comments</h2>
            <div className="space-y-2 mb-4">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between items-center"
                  >
                    <p>
                      <b>
                        {c.user
                          ? `${c.user.fullName.firstName} ${c.user.fullName.lastName}`
                          : "Anonymous"}
                        :
                      </b>{" "}
                      {c.text}
                    </p>

                    <button
                      onClick={() => deleteComment(c._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </div>

            <div className="flex">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow border p-2 rounded-l"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={addComment}
                className="bg-blue-500 text-white px-4 rounded-r"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
