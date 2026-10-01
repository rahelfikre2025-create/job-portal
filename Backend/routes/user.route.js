import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  resetPassword,
  resetPasswordWithCode,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUploadProfile, profileOrFileFields } from "../middleware/multer.js";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/user.controller.js";
import { validateRegister, validateLogin, validateUpdateProfile, validateForgotPassword, validateResetPasswordWithCode, validateResetPassword } from "../middleware/validation.js";

const router = express.Router();

// Accept either `profilePhoto` or `file` from the client for registration/profile update
router.route("/register").post(profileOrFileFields, validateRegister, register);
router.route("/login").post(validateLogin, login);
router.route("/logout").post(logout);
router.route("/profile/update")
  .post(authenticateToken, profileOrFileFields, validateUpdateProfile, updateProfile);

// Notifications
router.route('/notifications').get(authenticateToken, getNotifications);
router.route('/notifications/:id/read').post(authenticateToken, markNotificationRead);
router.route('/notifications/read-all').post(authenticateToken, markAllNotificationsRead);

// Password reset
router.route('/forgot-password').post(validateForgotPassword, forgotPassword);
// new endpoint to reset using an emailed code
router.route('/reset-password-with-code').post(validateResetPasswordWithCode, resetPasswordWithCode);
router.route('/reset-password/:token').post(validateResetPassword, resetPassword);

export default router;