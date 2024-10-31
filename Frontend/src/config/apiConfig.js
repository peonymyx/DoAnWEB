import axios from "axios";

const API_KEY = "cfe71e9e26a59994e591b6744b110c0f";
export const imgbbAPI = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

export const handleUploadToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // Add image file to formData
  console.log("imageFile:", imageFile);
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    console.log("Uploading image:", imageFile);
    console.log("Uploading123:", imgbbAPI, formData);
    const response = await axios.post(imgbbAPI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Image uploaded successfully:", response.data);
    return response.data.data.url; // Return image URL from ImgBB
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      console.log("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error message:", error.message);
    }
    console.log("Error config:", error.config);
    return null;
  }
};
