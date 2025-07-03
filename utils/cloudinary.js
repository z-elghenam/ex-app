const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Image URL
 */
const uploadToCloudinary = (buffer, folder = 'tour-booking', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image',
      transformation: [
        {
          quality: 'auto:good',
          fetch_format: 'auto',
          width: 800,
          height: 800,
          crop: 'limit'
        }
      ],
      ...options
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Failed to upload image'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(new Error('Failed to delete image'));
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Get public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  // Extract public ID from Cloudinary URL
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split('.')[0];
  
  // Include folder if present
  const folderIndex = parts.findIndex(part => part === 'tour-booking');
  if (folderIndex !== -1) {
    return `tour-booking/${publicId}`;
  }
  
  return publicId;
};

/**
 * Upload multiple images
 * @param {Array<Buffer>} buffers - Array of image buffers
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<string>>} - Array of image URLs
 */
const uploadMultipleToCloudinary = async (buffers, folder = 'tour-booking') => {
  try {
    const uploadPromises = buffers.map(buffer => 
      uploadToCloudinary(buffer, folder)
    );
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  uploadMultipleToCloudinary
};