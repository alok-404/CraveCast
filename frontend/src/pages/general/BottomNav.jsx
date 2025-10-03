import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookmarkIcon as SaveOutline,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as SaveSolid } from "@heroicons/react/24/solid";

export default function BottomNav() {
  const navigate = useNavigate();
  const current = "home"; // change dynamically

  return (
    <div className="fixed bottom-0 w-full bg-black text-white flex justify-around py-2 border-t border-gray-700">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center text-xs"
      >
        <HomeIcon className="w-6 h-6" />
        Home
      </button>
      <button
        onClick={() => navigate("/search")}
        className="flex flex-col items-center text-xs"
      >
        <MagnifyingGlassIcon className="w-6 h-6" />
        Search
      </button>
      <button
        onClick={() => navigate("/saved")}
        className="flex flex-col items-center text-xs"
      >
        {current === "saved" ? (
          <SaveSolid className="w-6 h-6 text-amber-400" />
        ) : (
          <SaveOutline className="w-6 h-6" />
        )}
        Saved
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center text-xs"
      >
        <UserIcon className="w-6 h-6" />
        Profile
      </button>
    </div>
  );
}
