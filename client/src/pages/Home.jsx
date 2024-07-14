import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import Navbar from "../components/Navbar";
import preview from "../assets/preview.png";

const Home = () => {
  const models = [
    "Stable Diffusion",
    "Playground AI",
    "AbsoluteReality",
    "Runwayml",
    "prompthero",
  ];
  const [selectedOption, setSelectedOption] = useState("Stable Diffusion");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerate = () => {
    console.log("generate");
  };

  const handleDownload = () => {
    console.log("Download");
  };
  const handleShare = () => {
    console.log("Share");
  };

  return (
    <>
      <Navbar btnText="Community" />

      {/* Dropdown Menu */}
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <>
            <Button variant="contained" {...bindTrigger(popupState)}>
              {selectedOption}
            </Button>
            <Menu {...bindMenu(popupState)}>
              {models.map((model, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setSelectedOption(model);
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
      <div className="mt-4">
        <div className="relative w-64 h-64 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={preview} // Ensure 'preview' correctly points to your image path
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        </div>
      </div>

        {/* Generate and Download Button */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Generate
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
