import React, { useState } from "react";
import axios from "axios";

const ReelForm = () => {
  const [name, setName] = useState("");
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("video", video); // URL from ImageKit or upload here

    try {
      await axios.post("http://localhost:3000/api/food/", formData, { withCredentials: true });

      alert("Reel uploaded successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Reel Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload Reel
      </button>
    </form>
  );
};

export default ReelForm;
