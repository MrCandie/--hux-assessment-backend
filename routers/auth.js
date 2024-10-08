const express = require("express");
const { login, signup } = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);

module.exports = router;
