const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const { formatISO } = require("date-fns");
const { uploadMainImage, uploadArticleImages } = require("./imageUploader");
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// get all articles
const getarticles = async (req, res) => {
  const articless = await articles.find({}).sort({ createdAt: -1 });
  res.status(200).json(articless);
};

// get one article
const getarticle = async (req, res) => {
  const { id } = req.params;
  const article = await articles.findById(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "this article does not exist" });
  }
  if (!article) {
    return res.status(400).json({ error: "this article does not exist" });
  }
  res.status(200).json(article);
};

// // create a article
// const createarticle = async (req, res) => {
//   const { title, body, images, h_image } = req.body;
//   try {
//     const article = await articles.create({
//       title,
//       body,
//       images,
//       h_image,
//     });
//     res.status(200).json(article);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// delete a article
const deletearticle = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "this blog does not exist" });
  }
  const article = await articles.findOneAndDelete({ _id: id });

  if (!article) {
    return res.status(400).json({ error: "this article does not exist" });
  }
  res.status(200).json(article);
};

// update a article
const updatearticle = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid({ id })) {
    return res.status(400).json({ error: "this article does not exist" });
  }
  console.log(id);

  const article = await articles.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!article) {
    return res.status(400).json({ error: "this article does not exist" });
  }
  res.status(200).json(article);
};


// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// cloudinary.config({
//   cloud_name: 'dplzhsjcg',
//   api_key: '647475915879921',
//   api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
// });

// دالة لرفع الصور إلى Cloudinary
// const uploadImages = async (imageBuffers) => {
//   try {
//     const uploadPromises = imageBuffers.map(async (imageBuffer) => {
//       const result = await cloudinary.uploader.upload(imageBuffer.toString('base64'), {
//         resource_type: 'auto',
//       });
//       console.log('Image uploaded successfully:', result.url);
//       return result.url;
//     });

//     const imageUrls = await Promise.all(uploadPromises);
//     return imageUrls;
//   } catch (error) {
//     console.error('Error uploading images:', error.message);
//     throw error;
//   }
// };

// دالة لإنشاء مقال مع رفع الصور
// const createarticle = async (req, res) => {
//   try {
//     // Middleware for handling file uploads using Multer
//     const upload = multer({ storage: multer.memoryStorage() });

//     // Use Multer middleware for 'images' field only in this route
//     upload.array('images')(req, res, async (err) => {
//       if (err) {
//         console.error('Multer error:', err);
//         return res.status(500).json({ error: 'Error handling file uploads', details: err.message });
//       }

//       // Access the uploaded files in req.files
//       const imageBuffers = req.files.map(file => file.buffer);

//       if (!imageBuffers || imageBuffers.length === 0) {
//         return res.status(400).json({ error: 'No images uploaded' });
//       }

//       try {
//         // Upload images to Cloudinary
//         const imageUrls = await uploadImages(imageBuffers);

//         // Create article using the uploaded images
//         const { title, body, h_image } = req.body;
//         const article = await articles.create({
//           title,
//           body,
//           images: imageUrls,
//           h_image,
//         });

//         return res.status(200).json(article);
//       } catch (error) {
//         console.error('Error creating article:', error);
//         return res.status(500).json({ error: 'Error creating article', details: error.message });
//       }
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return res.status(500).json({ error: 'Unexpected error', details: error.message });
//   }
// };
const createarticle = async (req, res) => {
  const { title, body } = req.body;
  const { mainImage, articleImages } = req.files;

  try {
    // تأكد من وجود جميع الحقول المطلوبة
    // if (!mainImage || !articleImages) {
    //   return res.status(400).json({ error: "يجب توفير جميع الحقول المطلوبة" });
    // }

    // تأكد من وجود ملف واحد على الأقل في mainImage
    // if (!mainImage[0]) {
    //   return res.status(400).json({ error: "يجب توفير ملف صورة رئيسية واحد على الأقل" });
    // }

    // تأكد من وجود ملف واحد على الأقل في articleImages
    // if (!articleImages[0]) {
    //   return res.status(400).json({ error: "يجب توفير ملف صورة واحد على الأقل في صور المقال" });
    // }

    // رفع الصور
    const mainImageUrl = await uploadMainImage(mainImage);
    const articleImageUrls = await uploadArticleImages(articleImages);

    // إنشاء المقال
    const articleData = { title, body, mainImage: mainImageUrl, images: articleImageUrls };
    const createdArticle = await articleModel.create(articleData);
    console.log(articleData);

    res.status(201).json(createdArticle);
  } catch (err) {
    // إذا حدث خطأ في رفع الصور
    console.error("Error uploading images:", err);
    res.status(400).json({ error: "فشل في رفع الصورة أو الصور" });
  }
};









module.exports = {
  createarticle,
  getarticles,
  getarticle,
  updatearticle,
  deletearticle,
};
