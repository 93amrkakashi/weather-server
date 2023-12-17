const express = require("express");
const router = express.Router();
const multer = require('multer');
const ArticleModel = require('../models/articleModel');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { getAllArticles, getArticleById, createArticleWithImages, deleteArticleById, updateArticleById } = require("../controllers/articleController copy");
cloudinary.config({
  cloud_name: 'dplzhsjcg',
  api_key: '647475915879921',
  api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
});

// get all articles
router.get('/', getAllArticles);

// get one article
router.get('/:id', getArticleById);

// create a article
router.post('/', createArticleWithImages );
router
  .route("/upload")
  .post(
    upload.any(),
    async (req, res, next) => {
      try {
        const uploadPromises = req.files.map(async (file, index) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
            resource_type: "image",
          });
          return {
            ProductPhotoPerview: result.secure_url,
            cloudinaryId: result.public_id,
          };
        });
        const uploadedImages = await Promise.all(uploadPromises);
        res.status(200).json({
          status: "success",
          product: uploadedImages,
        });
      } catch (error) {
        return res.status(500).json({
          status: "fail",
          message: error,
        });
      }
    }
  );

  


// delete a article
router.delete('/:id', deleteArticleById);

// update a article
router.patch('/:id', updateArticleById);





module.exports = router