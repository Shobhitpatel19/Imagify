/* eslint-disable no-undef */

async function runwayml(data) {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        headers: { Authorization: 'Bearer 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' },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  } catch (err) {
    console.log(
      "There is an error while generating Image using runwayml :- ",
      err
    );
  }
}

export default runwayml;
