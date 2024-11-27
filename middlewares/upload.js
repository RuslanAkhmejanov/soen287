import multer from 'multer';
import path from 'path';

const fields = [
  { name: 'logo', maxCount: 1 },
  { name: 'homePageBackgroundPic', maxCount: 1 },
  { name: 'authPageBackgroundPic', maxCount: 1 },
  { name: 'staffMembers[0][image]', maxCount: 1 },
  { name: 'staffMembers[1][image]', maxCount: 1 },
  { name: 'staffMembers[2][image]', maxCount: 1 },
  { name: 'staffMembers[3][image]', maxCount: 1 },
  { name: 'staffMembers[4][image]', maxCount: 1 },
  { name: 'staffMembers[5][image]', maxCount: 1 },
  { name: 'staffMembers[6][image]', maxCount: 1 },
  { name: 'staffMembers[7][image]', maxCount: 1 },
  { name: 'staffMembers[8][image]', maxCount: 1 },
  { name: 'staffMembers[9][image]', maxCount: 1 },
  { name: 'staffMembers[10][image]', maxCount: 1 },
  { name: 'services[0][image]', maxCount: 1 },
  { name: 'services[1][image]', maxCount: 1 },
  { name: 'services[2][image]', maxCount: 1 },
  { name: 'services[3][image]', maxCount: 1 },
  { name: 'services[4][image]', maxCount: 1 },
  { name: 'services[5][image]', maxCount: 1 },
  { name: 'services[6][image]', maxCount: 1 },
  { name: 'services[7][image]', maxCount: 1 },
  { name: 'services[8][image]', maxCount: 1 },
  { name: 'services[9][image]', maxCount: 1 },
  { name: 'services[10][image]', maxCount: 1 },

];
const allowedExtensions = ['.jpeg', '.jpg', '.png', '.svg', '.gif', '.avif'];
const allowedLogoExtensions = ['.svg', '.png'];

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const checkLogoFileType = (file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedLogoExtensions.includes(extname)) {
    return cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type for logo. Only .svg or .png are allowed.'));
  }
};

// Check file type
const checkFileType = (file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extname)) {
    return cb(null, true); // Accept file
  } else {
    cb(new Error('Error: Images Only!'));
  }
};

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'logo') {
    // Apply logo-specific filter
    checkLogoFileType(file, cb);
  } else {
    // Apply general file type filter for other fields
    checkFileType(file, cb);
  }
};

// Create a multer instance with the defined configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB
  },
});

export const uploadMulterFields = upload.fields(fields);

// Define reusable middleware for specific fields
// export const uploadBusinessAssets2 = (req, res, next) => {
//   console.log(fields);
//   const staffMembers = req.body.staffMembers;
//   const services = req.body.services;
//   if (staffMembers) {
//     staffMembers.forEach((_, index) => {
//       fields.push({ name: `staffMembers[${index}][image]`, maxCount: 1 });
//     });
//   }
//   if (services) {
//     services.forEach((_, index) => {
//       fields.push({ name: `services[${index}][image]`, maxCount: 1 });
//     });
//   }
//   upload.fields(fields);
//   next();
// };

export default upload;
