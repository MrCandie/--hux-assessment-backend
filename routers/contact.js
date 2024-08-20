const express = require("express");
const {
  createContact,
  listContacts,
  getContact,
} = require("../controllers/contact");
const { protect } = require("../middleware");

const router = express.Router();

router.post("/", protect, createContact);
router.get("/", protect, listContacts);
router.get("/:contactId", protect, getContact);

module.exports = router;
