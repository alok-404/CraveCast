const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName) {
   
    try {
    const result = await imagekit.upload({
        file: file.buffer, // required
        fileName: fileName,
        folder:"Zomato-Reel-Style" // required
    })

  


    return result; 
    
    } catch (err) {
    console.error("ImageKit upload error:", err?.message || err);
    throw new Error("File upload failed"); // controller me handle kar lena
  }// Return the URL of the uploaded file
}

module.exports = {
    uploadFile
}

