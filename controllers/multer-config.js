const multer = require('multer');

const storage = multer.diskStorage({
  destination: '/tmp', // يتم تحديد المسار إلى /tmp بدلاً من /var/task/uploads
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

