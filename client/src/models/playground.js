/* eslint-disable no-undef */
import axios from 'axios';

async function playground(data) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_PLAYGROUND_URL}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob' 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in playground:', error);
  }
}

export default playground;
