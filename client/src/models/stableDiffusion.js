/* eslint-disable no-undef */
import axios from "axios";

async function stableDiffusion(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      data,
      {
        headers: {
          Authorization: 'Bearer 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',
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
