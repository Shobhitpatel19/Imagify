export const blobToDataURL = (blob) => {
  if (!blob || !(blob instanceof Blob) || blob.size === 0) {
    return Promise.reject(new Error("Invalid or empty Blob object provided"));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Failed to read the Blob object as a Data URL"));

    try {
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(new Error("Error reading Blob object: " + error.message));
    }
  });
};
