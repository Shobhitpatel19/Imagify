/* eslint-disable no-undef */
import axios from "axios";

async function stableDiffusion(data) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_STABLEDIFFUSION_URL}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        responseType: "blob", 
      }
    );

    const result = response.data;
    return result;
  } catch (error) {
    console.log("Error generating image by stable Diffusion: ", error);
  }
}

export default stableDiffusion;
