/* eslint-disable no-undef */
import axios from 'axios';

async function playground(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic',
      data,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob' 
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in playground:', error);
  }
}

export default playground;
