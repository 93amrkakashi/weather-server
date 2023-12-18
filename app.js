const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

cloudinary.config({
  cloud_name: 'dplzhsjcg',
  api_key: '647475915879921',
  api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
});
const app = express();
const port = 3000;


const upload = multer({ dest: 'uploads/' });
const uploadImage =  async (req,res) => {
  let file = req.file
  console.log(file)
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'main_images', resource_type: 'image' });
    // return result.secure_url;
    return res.status(200).json(result.secure_url);
  } catch (error) {
    throw error;
  }
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/upload',upload.single('image'),uploadImage );

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});