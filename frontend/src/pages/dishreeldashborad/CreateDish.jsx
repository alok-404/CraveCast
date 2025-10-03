import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateDish = () => {
  const { register, handleSubmit, reset } = useForm();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        toast.error("❌ Please select an image for the dish!");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", selectedFile); // for dish image

      const response = await axios.post(
        "http://localhost:3000/api/dish/",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data);
      toast.success("✅ Dish created successfully!");
      reset();
      setPreviewUrl(null);
      setSelectedFile(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    }
  };

  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("❌ Only image files are allowed!");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-amber-100 via-orange-200 to-yellow-100 p-6 gap-6">
      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🍽 Create Dish
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Dish Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Enter dish name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Write a short description..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Dish Image
            </label>

            {!selectedFile ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFilePreview}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 file:text-sm file:font-semibold 
                  file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("changeFileDish").click()}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="file"
                  id="changeFileDish"
                  accept="image/*"
                  onChange={handleFilePreview}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Create Dish
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">👀 Preview</h3>
        {previewUrl && (
          <>
            <img src={previewUrl} alt="Dish" className="mt-4 w-full rounded-lg shadow-md" />
            <p className="mt-2 text-sm text-gray-600">
              File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateDish;
