const express = require("express");
const {
  viewProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/user");

const { protect } = require("../middleware");

const router = express.Router();

router.get("/", protect, viewProfile);
router.patch("/", protect, updateProfile);
router.delete("/", protect, deleteAccount);

module.exports = router;
