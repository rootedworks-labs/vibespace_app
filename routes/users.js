// In routes/users.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const followController = require('../controllers/followController'); // Added: Import the new controller
const authMiddleware = require('../middleware/auth');
const { usernameRule, updateProfileRules, searchUsersRules, validate } = require('../middleware/validation');

// --- Multer Configuration for Avatar Uploads ---
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  },
});

// --- New User Search Route ---
// Placed before dynamic routes to avoid conflicts
router.get(
  '/search',
  authMiddleware.authenticate,
  searchUsersRules(),
  validate,
  userController.searchUsers
);

// --- Routes for the Current User (/me) ---
router.get('/me', authMiddleware.authenticate, userController.getCurrentUser);

// --- New: Route to export user data ---
router.get(
  '/me/data',
  authMiddleware.authenticate,
  userController.exportUserData
);

router.post(
  '/me/avatar',
  authMiddleware.authenticate,
  avatarUpload.single('avatar'),
  userController.uploadAvatar
);

router.delete(
  '/me',
  authMiddleware.authenticate,
  userController.deleteCurrentUser
);

router.patch(
  '/me',
  authMiddleware.authenticate,
  updateProfileRules(),
  validate,
  userController.updateProfile
);

// --- New Follow System Routes ---
// These routes allow the authenticated user to follow or unfollow another user by their username.
router.post(
  '/:username/follow',
  authMiddleware.authenticate,
  usernameRule(),
  validate,
  followController.followUser
);

router.delete(
  '/:username/follow',
  authMiddleware.authenticate,
  usernameRule(),
  validate,
  followController.unfollowUser
);


// TODO: This route is causing a crash because `userController.getUsers` is not a function.
// It has been temporarily commented out. Ensure `getUsers` is defined and exported in `userController.js`.
// router.get('/', userController.getUsers);


module.exports = router;