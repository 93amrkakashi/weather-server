const express = require("express");
const router = express.Router();
const { getAllArticles, getArticleById, deleteArticleById, updateArticleById, uploadImages, createarticle, uploadImage, deleteImage } = require("../controllers/articleController copy");
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();





// get all articles
router.get('/', getAllArticles);

// get one article
router.get('/:id', getArticleById);
router.post('/', createarticle);


router.post('/uploadimages', upload.array('images', 10), uploadImages);
router.delete('/deleteimage', deleteImage);


// delete a article
router.delete('/:id', deleteArticleById);

// update a article
router.patch('/:id', updateArticleById);





module.exports = router