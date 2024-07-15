export const blobToDataURL = (blob) => {
  if (!blob || !(blob instanceof Blob)) {
    return Promise.reject(new Error("Invalid Blob object provided"));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
