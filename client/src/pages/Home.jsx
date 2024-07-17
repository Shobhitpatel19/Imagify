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

      <div className="bg-black ">
      <div className="text-white text-center font-bold text-6xl font-['Mona-Sans Light'] pt-2">Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500"> Powerful</span> model or <br />image in seconds</div>
      <div className="text-white px-2 pt-8 text-center">Meet Imagify. the powerful photo generator who will turn any image into a unique artwork in seconds.</div>
        {/* Dropdown Menu */}
      {/* <div className="text-3xl">
          <PopupState  variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <Button  variant="contained" {...bindTrigger(popupState)}>
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
      </div> */}

      <div className="flex items-center justify-center pt-8 z-50">
      <div class="main-wrapper relative group">
        <button class="rounded-lg text-white border-2 border-gray-500 w-52 py-3 px-2 flex justify-between shadow-md">
                Enter generator name 
        </button>
        <ul class="z-50 dropdown-menu group-hover:block hidden absolute text-gray-700 pt-1  ">
          <li>
            <a href="#" class="w-[210px] mb-1 rounded-md  bg-gray-200 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap" >stableDiffusion</a>
          </li>
          <li>
            <a href="#" class="w-[210px] mb-1 rounded-md  bg-gray-200 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap" >AbsoluteReality</a>
          </li>
          <li>
            <a href="#" class="w-[210px] mb-1 rounded-md  bg-gray-200 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap" >Playground</a>
          </li>
          <li>
            <a href="#" class="w-[210px] mb-1 rounded-md  bg-gray-200 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap" >Runwayml</a>
          </li>
          
</ul>
  </div>
      </div>


<div className="flex w-full justify-center flex-col items-center">
      {/* Name Input Field */}
      <div className="w-full flex flex-col items-center  ">
        <label
          htmlFor="name"
          // className="block text-sm font-medium text-white"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          className=" block w-[30%] px-3 py-2 border bg-transparent border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white mx-8"
          placeholder="Enter your name"
        />
      </div>

      {/* Prompt Input Field */}
      <div className="w-full flex flex-col items-center px-4 mt-3">
        {/* <label
          htmlFor="prompt"
          // className="block text-sm font-medium text-gray-700"
        >
          Prompt
        </label> */}
 <div className="flex w-full items-center justify-center gap-1">
 <input
          type="text"
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="mt-1 block w-[40%] px-3 py-2 border border-gray-600 bg-transparent rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your prompt"
        />

<button
          onClick={handleGenerate}
          className="px-2 py-[5.5px] text-blue-500 hover:bg-blue-900 uppercase border-blue-600 border-2 rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {
            loading ? "Generating..." : "Generate"

          }
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
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
        </div>
      </div>
<div className="flex items-center justify-center gap-1 pb-10">
      {/* Generate and Download Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleDownload}
          className="px-2 py-2 text-green-500 border-2 border-green-700 rounded-md shadow-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Download
        </button>
      </div>

      {/* Share Button */}
      <div>
</div>   

<button
          onClick={handleShare}
          className="px-2 py-2 text-purple-500 border-2 border-violet-600 rounded-md shadow-md hover:bg-purple-900   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mt-4"
        >
          Share with Community
        </button>
</div>        
        
      </div>
    </>
  );
};

export default Home;
