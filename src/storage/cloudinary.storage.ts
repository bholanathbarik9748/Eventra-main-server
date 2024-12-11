import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    format: async () => 'png', // Set file format (e.g., jpg, png)
    public_id: (req, file) => file.originalname, // Optional: Use original file name
  } as unknown as any, // Override the type check
});
