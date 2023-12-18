const express = require("express");
const router = express.Router();
const { getAllArticles, getArticleById, deleteArticleById, updateArticleById, uploadImage, uploadImages, createarticle } = require("../controllers/articleController copy");
const multer = require('multer');

const upload = multer();




// get all articles
router.get('/', getAllArticles);

// get one article
router.get('/:id', getArticleById);
router.post('/', createarticle);

// create a article
// router.post('/', createArticleWithImages );


// router.post('/upload',upload.single('image'),uploadImage );
router.post('/upload', upload.array('images', 5), uploadImages);

// delete a article
router.delete('/:id', deleteArticleById);

// update a article
router.patch('/:id', updateArticleById);





module.exports = router