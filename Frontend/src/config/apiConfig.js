export const imgbbAPI = `https://api.imgbb.com/1/upload?key=${"cfe71e9e26a59994e591b6744b110c0f"}`;
import axios from "axios";

export const handleUploadToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // Thêm file ảnh vào formData

  try {
    const response = await axios.post(imgbbAPI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Image uploaded successfully:", response.data);
    return response.data.data.url; // Trả về URL ảnh từ ImgBB
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    return null;
  }
};
// import axios from "axios";

// export const handleUploadToImgBB = async (file) => {
//   const apiKey = "cfe71e9e26a59994e591b6744b110c0f";
//   const formData = new FormData();
//   formData.append("image", file);

//   try {
//     const response = await axios.post(
//       `https://api.imgbb.com/1/upload?key=${apiKey}`,
//       formData
//     );
//     return response.data.data.url;
//   } catch (error) {
//     console.error("Failed to upload image to ImgBB:", error);
//     return null;
//   }
// };
