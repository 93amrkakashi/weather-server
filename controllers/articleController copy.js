const ArticleModel = require('../models/articleModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

cloudinary.config({
  cloud_name: 'dplzhsjcg',
  api_key: '647475915879921',
  api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
});


// Function to upload a single image to Cloudinary

const uploadImageToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'main_images', resource_type: 'image' });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

// Function to upload multiple images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  try {
    const promises = files.map(async (file) => {
      // console.log(file);
      const result = await cloudinary.uploader.upload(file.tempFilePath, { 
        folder: 'article_images', 
        resource_type: 'auto'
      });
      
      return result.secure_url;
    });

    return Promise.all(promises);
  } catch (error) {
    throw error;
  }
};


// Controller function to get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المقالات" });
  }
};

// Controller function to get an article by ID
const getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await ArticleModel.findById(id);
    
    if (!article) {
      return res.status(404).json({ error: "المقال غير موجود" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المقال" });
  }
};

// Controller function to create an article with images
const createArticleWithImages = async (req, res) => {
  try {
    const { title, body } = req.body;
    const file = req.file;

    console.log(file.path);
console.log(title, body)
    // Check for required fields
    // if (!title || !body || !Array.isArray(articleImages)) {
    //   return res.status(400).json({ error: "يجب توفير جميع الحقول المطلوبة" });
    // }

    // Upload images to Cloudinary
    const articleImageUrls = await uploadImagesToCloudinary(req.files);

    // Create the article
    const newArticle = new ArticleModel({
      title,
      body,
      images: articleImageUrls,
    });

    // Save the article to the database
    const savedArticle = await newArticle.save();

    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء المقال" });
  }
};


// Controller function to delete an article by ID
const deleteArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ error: "المقال غير موجود" });
    }

    res.status(200).json({ message: "تم حذف المقال بنجاح" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف المقال" });
  }
};

// Controller function to update an article by ID
const updateArticleById = async (req, res) => {
  const { id } = req.params;
  const { title, body, mainImage, images } = req.body;

  try {
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      id,
      { title, body, mainImage, images },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: "المقال غير موجود" });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تعديل المقال" });
  }
};
const uploadImages =  async (req, res) => {
  try {
    const articleImages = req.files;
console.log(articleImages)
    // رفع الملفات إلى Cloudinary
    const uploads = articleImages.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
      return result.secure_url;
    });

    // انتظر حتى يتم رفع جميع الملفات وثم أرجع روابطها
    const uploadedUrls = await Promise.all(uploads);

    // قد يكون لديك معالج إضافي هنا لاستخدام روابط الملفات

    res.status(200).json({ message: 'تم تحميل الملفات بنجاح', uploadedUrls });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحميل الملفات' });
  }
}



// **********************
// const createArticleWithImages = async (req, res, files) => {
//   try {
//     const { title, body, articleImages } = req.body;
// console.log(req.files)
//     // Check for required fields
//     if (!title || !body) {
//       return res.status(400).json({ error: "يجب توفير جميع الحقول المطلوبة" });
//     }

//     const saveBase64Images = async (base64Images) => {
//       const savedFilePaths = [];

//       for (let i = 0; i < base64Images.length; i++) {
//         const base64Image = base64Images[i];
//         const imagePath = `./uploads/image_${Date.now()}_${i + 1}.png`;

//         await fs.writeFile(imagePath, base64Image, 'base64');
//         savedFilePaths.push(imagePath);
//       }

//       return savedFilePaths;
//     };

//     const imagePaths = await saveBase64Images(articleImages);

//     const newArticle = new ArticleModel({
//       title,
//       body,
//       images: imagePaths,
//     });

//     const savedArticle = await newArticle.save();

//     res.status(201).json(savedArticle);
//   } catch (error) {
//     console.error("Error creating article:", error);
//     res.status(500).json({ error: "حدث خطأ أثناء إنشاء المقال" });
//   }
// };




module.exports = {
  getAllArticles,
  getArticleById,
  createArticleWithImages,
  deleteArticleById,
  updateArticleById,
  uploadImages
};