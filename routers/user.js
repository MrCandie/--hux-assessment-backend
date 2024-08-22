const express = require("express");
const { viewProfile } = require("../controllers/user");

const { protect } = require("../middleware");

const router = express.Router();

router.get("/", protect, viewProfile);

module.exports = router;
