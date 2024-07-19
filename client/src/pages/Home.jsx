import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import preview from "../assets/preview.png";
import { blobToDataURL } from "../utils/blobToDataURL";
import {
  AbsoluteReality,
  playground,
  runwayml,
  stableDiffusion,
} from "../models";

const Home = () => {
  const navigate = useNavigate();
  const models = [
    "Stable Diffusion",
    "Playground AI",
    "AbsoluteReality",
    "Runwayml",
  ];
  const [selectedModel, setSelectedModel] = useState("Runwayml");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerate = async () => {
    if(!prompt){
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);

    try {
      let blob
      if (selectedModel === "Stable Diffusion") {
        blob = await stableDiffusion({ inputs: prompt });
      } else if (selectedModel === "Playground AI") {
        blob = await playground({ inputs: prompt });
      } else if (selectedModel === "AbsoluteReality") {
        blob = await AbsoluteReality({ inputs: prompt });
      } else {
        blob = await runwayml({ inputs: prompt });
      }

      if (!blob || blob.type === "application/json") {
        alert("Please try again");
        return Promise.reject(new Error("There is some error from server"));
      }

      const dataUrl = await blobToDataURL(blob);
      setImageUrl(dataUrl);  
    } catch (err) {
      alert(
        "Please try again or choose another model!!"
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${"generated_image"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No image to download");
    }
  };

  const handleShare = async () => {
    if (!name) {
      alert("Please enter a name!!");
      return;
    }
    if (!prompt) {
      alert("Please enter a prompt!!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/post", {
        name,
        model: selectedModel,
        prompt,
        url: imageUrl,
      });

      if (response.status === 200) {
        navigate("/community");
      } else {
        alert("Failed to share image. Please try again.");
      }
    } catch (error) {
      console.error("Error in sharing image: ", error);
      alert("Failed to share image. Please try again.");
    }
  };

  return (
    <>
      <Navbar btnText="Community" />

      <div className="bg-black min-h-screen">
        <div className="text-white text-center font-bold text-6xl pt-2 font-light">
          From{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">
            Words
          </span>{" "}
          to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">
            Visuals
          </span>{" "}
          in seconds
        </div>
        <div className="text-white px-2 pt-8 text-center">
          Unleash your creativity with Imagify, the powerful tool that transforms your text into beautiful images effortlessly.
        </div>

        {/* Dropdown Menu */}
        <div className="flex items-center justify-center pt-8 z-50">
          <div className="relative group">
            <button className="rounded-lg text-white border-2 border-gray-500 w-52 py-3 px-2 flex justify-between shadow-md">
              {selectedModel}
            </button>
            <ul className="dropdown-menu hidden group-hover:block absolute text-gray-700 pt-1 w-52 z-10">
              {models.map((model, index) => (
                <li key={index}>
                  <a
                    onClick={() => setSelectedModel(model)}
                    className="w-full mb-1 rounded-md bg-gray-200 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap cursor-pointer"
                    style={{ userSelect: "none" }} // Prevent text selection
                  >
                    {model}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex w-full justify-center flex-col items-center">
          {/* Name Input Field */}
          <div className="w-full flex flex-col items-center mt-4">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              autoComplete="off"
              onChange={handleNameChange}
              className="block w-1/3 px-3 py-2 border bg-transparent border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white mt-2"
              placeholder="Enter your name"
            />
          </div>

          {/* Prompt Input Field */}
          <div className="w-full flex flex-col items-center mt-4 px-4">
            <div className="flex w-full items-center justify-center gap-1 mt-2">
              <input
                type="text"
                id="prompt"
                name="prompt"
                value={prompt}
                autoComplete="off"
                onChange={handlePromptChange}
                className="block w-1/3 px-3 py-2 border bg-transparent border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white mt-2"
                placeholder="Enter your prompt"
              />
              <button
                onClick={handleGenerate}
                className="px-2 py-[5.5px] text-blue-500 hover:bg-blue-900 uppercase border-blue-600 border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* Image Box */}
        <div className="mt-4 flex justify-center items-center">
          <div className="flex justify-center items-center relative w-72 h-72 bg-gray-900 rounded-md overflow-hidden">
            {loading ? (
              <Loader />
            ) : (
              <img
                src={imageUrl || preview} // Use imageUrl if available, otherwise use preview
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover opacity-100"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 pb-10 mt-4">
          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="px-2 py-2 text-green-500 border-2 border-green-700 rounded-md shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Download
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-2 py-2 text-purple-500 border-2 border-violet-600 rounded-md shadow-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Share with Community
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
