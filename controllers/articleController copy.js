const ArticleModel = require('../models/articleModel');
const cloudinary = require('cloudinary').v2;



cloudinary.config({
  cloud_name: 'dplzhsjcg',
  api_key: '647475915879921',
  api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
});





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


// Controller function to delete an article by ID
const deleteArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await ArticleModel.findById(id);
    const imageIds = article.all_images.map(img => `article_images/${img.split('article_images/')[1].split('.')[0]}`);
    if (imageIds.length > 0) {
      const deletionResult = await cloudinary.api.delete_resources(imageIds);
    }

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
  const { title_ar,title_fr, body_ar, body_fr,mainImage, all_images  } = req.body;

  try {
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      id,
      { title_ar,title_fr, body_ar, body_fr,mainImage, all_images},
      // { new: true }
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


const createarticle = async (req, res) => {
  const { title_ar,title_fr, body_ar, body_fr,mainImage, all_images } = req.body;
  console.log(req.body)
  try {

    const articleData = { title_ar,title_fr, body_ar, body_fr,mainImage, all_images};
    const createdArticle = await ArticleModel.create(articleData);
    console.log(articleData);

    res.status(201).json(createdArticle);
  } catch (err) {
    console.log(req.body)
    console.error("Error :", err);
    res.status(400).json({ error: "errrr" });
  }
};

// const uploadImage =  async (req,res) => {
//   console.log(req.files)
//   let file = req.files
//   try {
//     const result = await cloudinary.uploader.upload(file.path, { folder: 'article_images', resource_type: 'image' });
//     // return result.secure_url;
//     return res.status(200).json(result.secure_url);
//   } catch (error) {
//     throw error;
//   }
// }

const uploadImages = async (req, res) => {
  try {
    const files = req.files;
    console.log(files)
    const uploadPromises = files.map(async (file, index) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'article_images',
        resource_type: 'image',
      });
      return result.secure_url;
    });
    const uploadedUrls = await Promise.all(uploadPromises);
    res.status(200).json({
      uploadedUrls,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء تحميل الملفات',
    });
  }
};


const uploadImage =  async (req,res) => {
  console.log(req.file)
  let file = req.file
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'article_images', resource_type: 'image' });
    // return result.secure_url;
    return res.status(200).json(result.secure_url);
  } catch (error) {
    console.log(error)
    throw error;
  }
}



const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    console.log(imageId)
    const deletionResult = await cloudinary.uploader.destroy(imageId);
    if (deletionResult.result !== 'ok') {
      return res.status(500).json({ error: "فشلت عملية حذف الصورة" });
    }
    res.status(200).json({ message: "تم حذف الصورة بنجاح" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف الصورة" });
  }
};


module.exports = {
  getAllArticles,
  getArticleById,
  deleteArticleById,
  updateArticleById,
  uploadImages,
  createarticle,
  uploadImage,
  deleteImage
};