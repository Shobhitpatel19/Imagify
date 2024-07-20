import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import preview from "../assets/preview.png";
import { blobToDataURL } from "../utils/blobToDataURL";
import { getRandomPrompt, getRandomJoke } from "../utils/getRandom";
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
  const [sharing, setSharing] = useState(false);
  const [joke, setJoke] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(prompt);
    setPrompt(randomPrompt);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);

    try {
      let blob;
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
      alert("Please try again or choose another model!!");
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

    setSharing(true);
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
    } finally {
      setSharing(false);
    }
  };

  const handleJokes = () => {
    setTimeout(() => {
      const temp = getRandomJoke(joke);
      setJoke(temp);
    }, 500);
  };

  return (
    <>
      <Navbar btnText="Community" />

      <div className="bg-black min-h-screen flex flex-col items-center">
        <div className="text-white text-center font-bold text-6xl pt-8 font-light">
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
        <div className="text-white px-2 pt-4 text-center">
          Unleash your creativity with Imagify, the powerful tool that
          transforms your text into beautiful images effortlessly.
        </div>

        {/* Dropdown Menu */}
        <div className="relative group pt-8 z-50">
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

        <div className="flex flex-col items-center w-full px-4">
          {/* Name Input Field */}
          <div className="w-full max-w-md mt-4">
            <textarea
              id="name"
              name="name"
              value={name}
              autoComplete="off"
              onChange={handleNameChange}
              className="custom-scrollbar block w-full px-3 py-2 border bg-transparent border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white resize-none"
              placeholder="Enter your name"
              rows="1"
              spellCheck="false"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            className="mt-4 px-4 py-2 text-purple-500 border-2 border-violet-600 rounded-md shadow-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Surprise Me
          </button>

          {/* Prompt Input Field */}
          <div className="w-full max-w-md mt-4">
            <div className="flex w-full items-center justify-between">
              <textarea
                id="prompt"
                name="prompt"
                value={prompt}
                autoComplete="off"
                onChange={handlePromptChange}
                className="custom-scrollbar block w-full px-3 py-2 border bg-transparent border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white resize-none"
                placeholder="Enter your prompt"
                rows="1"
                spellCheck="false"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <button
                onClick={handleGenerate}
                className="ml-2 px-4 py-2 text-blue-500 border-2 border-blue-600 rounded-lg shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* Jokes Section */}
        <div className="flex flex-col items-center justify-center w-full max-w-md mt-4">
          <h1 className="text-2xl font-bold text-white">Jokes</h1>
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
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pb-10 mt-4">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-green-500 border-2 border-green-700 rounded-md shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Download
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-4 py-2 text-purple-500 border-2 border-violet-600 rounded-md shadow-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {sharing ? "Sharing, please wait..." : "Share with community"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
