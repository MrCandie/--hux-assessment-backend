const express = require("express");
const {
  createContact,
  listContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contact");
const { protect } = require("../middleware");

const router = express.Router();

router.post("/", protect, createContact);
router.get("/", protect, listContacts);
router.get("/:contactId", protect, getContact);
router.patch("/:contactId", protect, updateContact);
router.delete("/:contactId", protect, deleteContact);

module.exports = router;
