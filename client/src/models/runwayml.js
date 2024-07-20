/* eslint-disable no-undef */

async function runwayml(data) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_RUNWAYML_URL}`,
      {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` },
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
