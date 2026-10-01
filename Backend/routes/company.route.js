import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import { validateCompanyRegister, validateUpdateCompany } from "../middleware/validation.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUploadFile } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(authenticateToken, validateCompanyRegister, registerCompany);
router.route("/get").get(authenticateToken, getAllCompanies);
router.route("/get/:id").get(authenticateToken, getCompanyById);
router.route("/update/:id").put(authenticateToken, singleUploadFile, validateUpdateCompany, updateCompany);

export default router;