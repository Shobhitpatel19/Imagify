import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
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
      alert("Please generate an image first");
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

    // "http://localhost:8000/api/v1/post"
    setSharing(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/post`, {
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
    const temp = getRandomJoke();
    setJoke(temp);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (model) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(handleJokes, 5500);
    return () => clearInterval(intervalId); // cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className="relative overflow-hidden w-full">
        <Navbar btnText="Community" />

        <div className="bg-black min-h-screen flex flex-col items-center">
          <div className="px-4 mt-10 mb-16 text-8xl text-white text-center font-regular text-6xl pt-8 max-sm:text-7xl ">
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
          <div className="text-white px-4 pt-4 text-center">
            Unleash your creativity with Imagify, the powerful tool that
            transforms your text into beautiful images effortlessly.
          </div>

          

          {/*  Dropdown menu  */}
          <div className="relative w-44">
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Model
      </label>
      <button
        onClick={toggleDropdown}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg flex items-center justify-between"
      >
        {selectedModel || 'Toggle Dropdown'}
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="dropdownMenu"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {models.map((model, index) => (
              <li key={index}>
                <a
                  onClick={() => handleItemClick(model)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {model}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

          {/* Name Input Field */}
          <div className="flex flex-col items-center w-full px-4">
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

            {/* Prompt Input Field */}
            <div className="w-full max-w-md mt-4">
              <div className="flex flex-col w-full items-center justify-between gap-2">
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
                <div className="flex justify-center items-center">
                  <button
                    onClick={handleGenerate}
                    className="duration-300 m-2 px-4 py-2 text-blue-500 border-2 border-blue-600 rounded-lg shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>
                  {/* Surprise Me Button */}
                  <button
                    onClick={handleSurpriseMe}
                    className="duration-300 px-4 py-2 text-purple-500 border-2 border-violet-600 rounded-lg shadow-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    Surprise Me
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Jokes Section */}
          <div className="flex flex-col items-center justify-center w-full max-w-md mt-4">
            <h1 className="text-xl text-white">
              {joke ? joke : "Jokes will appear here."}
            </h1>
          </div>

          {/* Image Box */}
          <div className="mt-4 flex justify-center items-center">
            <div className="flex justify-center items-center relative w-96 h-96 bg-gray-900 rounded-md overflow-hidden max-sm:w-72 max-sm:h-72">
              {loading ? (
                <div>
                  <Loader />
                  <img
                    src={imageUrl || preview} // Use imageUrl if available, otherwise use preview
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.5]"
                  />
                </div>
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
              className="duration-300 px-4 py-2 text-green-500 border-2 border-green-700 rounded-md shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Download
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="duration-300 px-4 py-2 text-purple-500 border-2 border-violet-600 rounded-md shadow-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {sharing ? "Sharing, please wait..." : "Share with community"}
            </button>
          </div>

          {/* Note */}
          <div className="flex flex-col items-center w-full max-w-md mx-auto mt-4">
            <h1 className="text-green-500">
              If a particular model isn{"'"}t working, please feel free to try
              another model.
            </h1>
          </div>
        </div>
        <div className="lshadow absolute w-[30%] h-[25%] bg-pink-500 top-[-15%] left-[-10%] rounded-[50%] blur-[150px]"></div>
        <div className="lshadow absolute w-[20%] h-[40%] bg-green-500 top-[45%] left-[-15%] rounded-[50%] blur-[150px]"></div>
        <div className="rshadow absolute w-[20%] h-[40%] bg-violet-500 top-[80%] right-[-10%] rounded-[50%] blur-[150px]"></div>
        <div className="rshadow absolute w-[20%] h-[40%] bg-blue-500 top-[15%] right-[-15%] rounded-[50%] blur-[150px]"></div>
      </div>
    </>
  );
};

export default Home;
