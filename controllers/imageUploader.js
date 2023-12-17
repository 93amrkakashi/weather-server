// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: 'dplzhsjcg',
//   api_key: '647475915879921',
//   api_secret: 'Imin4iP_gvg-IquwnTEkpdKPnp4',
// });

// const uploadMainImage = async (file) => {
//   try {
//     if (!file) {
//       throw new Error("يجب توفير ملف صورة رئيسية");
//     }

//     const result = await cloudinary.uploader.upload(file.path, { folder: 'main_images', resource_type: 'image' });
//     return result.secure_url;
//   } catch (error) {
//     throw error;
//   }
// };




// const uploadArticleImages = async (req,res) => {
//   try {
//     const promises = req.files.map((file) =>
//       cloudinary.uploader.upload(file.path, { folder: 'article_images', resource_type: 'image' })
//     );
//     const results = await Promise.all(promises);
//     return results.map((result) => result.secure_url);
//   } catch (error) {
//     throw error;
//   }
// };


// module.exports = {uploadMainImage ,uploadArticleImages };
