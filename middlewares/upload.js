import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// File filter
const fileFilter = (req, file, cb) => {
  checkFileType(file, cb);
};

// Create a multer instance with the defined configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB
  },
});

// Define reusable middleware for specific fields
export const uploadBusinessAssets = upload.fields([
  { name: 'logo', maxCount: 1 },       // Single file for 'logo'
  { name: 'backgroundPic', maxCount: 1 }, // Single file for 'backgroundPic'
]);

const safeParseJSON = (json) => {
    try {
        return typeof json === 'string' ? JSON.parse(json) : json;
    } catch (error) {
        console.error('JSON parsing error:', error);
        return [];
    }
};

// Middleware to handle dynamic staff member image fields
export const uploadStaffMemberImages = (req, res, next) => {
  const staffMemberFields = [];
  if (req.body.staffMembers) {
    const staffMembers = safeParseJSON(req.body.staffMembers || "[]");
    Object.keys(staffMembers).forEach(index => {
      staffMemberFields.push({ name: `staffMembers[${index}][image]`, maxCount: 1 });
    });
  }

  const uploadStaffMember = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit files to 5MB
    },
  }).fields(staffMemberFields);

  uploadStaffMember(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).send({ error: 'File upload failed', details: err.message });
    }
    next();
  });
};

// Middleware to handle dynamic service image fields
export const uploadServiceImages = (req, res, next) => {
  const serviceFields = [];
  if (req.body.services) {
    const services = safeParseJSON(req.body.services || "[]");
    Object.keys(services).forEach(index => {
      serviceFields.push({ name: `services[${index}][image]`, maxCount: 1 });
    });
  }

  const uploadService = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit files to 5MB
    },
  }).fields(serviceFields);

  uploadService(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).send({ error: 'File upload failed', details: err.message });
    }
    next();
  });
};

export default upload;

