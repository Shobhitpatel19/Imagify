/* eslint-disable no-undef */
import axios from 'axios';

async function playground(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic',
      data,
      {
        headers: {
          Authorization: 'Bearer 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',
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
