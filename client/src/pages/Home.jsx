import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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
  const [blobData, setBlobData] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerate = async () => {
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

      setBlobData(blob);

      const base64Url = await blobToDataURL(blobData);
      setImageUrl(base64Url);
    } catch (err) {
      alert("Error in Generating Image. Please use another model or try again after some time.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${name || "generated_image"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No image to download");
    }
  };
  
  const handleShare = async() => {
    if(!name){
      alert("Please enter a name!!");
      return;
    }
    if(!prompt){
      alert("Please enter a prompt!!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/post', {
        name,
        model: selectedModel,
        prompt,
        url: imageUrl,
      });
      
      if (response.status === 200) {
        navigate('/community');
      } else {
        alert("Failed to share image.Please try again after some time.");
      }
    } catch (error) {
      console.error("Error in sharing image:", error);
      alert("Error in sharing image.Please try again after some time.");
    }
  };

  return (
    <>
      <Navbar btnText="Community" />

      {/* Dropdown Menu */}
      <div>Select a Model</div>
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <>
            <Button variant="contained" {...bindTrigger(popupState)}>
              {selectedModel}
            </Button>
            <Menu {...bindMenu(popupState)}>
              {models.map((model, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setSelectedModel(model);
                    popupState.close();
                  }}
                >
                  {model}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </PopupState>

      {/* Name Input Field */}
      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your name"
        />
      </div>

      {/* Prompt Input Field */}
      <div className="mt-4">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700"
        >
          Prompt
        </label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your prompt"
        />
      </div>

      {/* Image Box */}
      <div className="mt-4 flex justify-center">
        <div className="relative w-64 h-64 bg-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <Loader />
          ) : (
            <img
              src={imageUrl || preview} // Use imageUrl if available, otherwise use preview
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
        </div>
      </div>

      {/* Generate and Download Button */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {
            loading ? "Generating..." : "Generate"

          }
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Download
        </button>
      </div>

      {/* Share Button */}
      <div>
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Share with Community
        </button>
      </div>
    </>
  );
};

export default Home;
