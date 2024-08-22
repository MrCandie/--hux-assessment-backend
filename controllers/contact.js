const Contact = require("../models/contact");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

exports.createContact = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phone, email, birthday, relationship } =
    req.body;

  if (!firstName || !lastName || !phone)
    return next(
      new AppError("First name,last name and phone number are required!", 400)
    );

  const data = {
    firstName,
    lastName,
    email,
    phone,
    birthday,
    relationship,
    user: req.user.id,
    userId: req.user.id,
  };

  const contact = await Contact.create(data);

  return res.status(200).json({
    status: "Success",
    data: contact,
  });
});

exports.listContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id }).select(
    "firstName lastName phone email relationship birthday"
  );

  return res.status(200).json({
    status: "Success",
    data: contacts,
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  if (!contactId) return next(new AppError("Invalid contact ID", 400));

  const contact = await Contact.findById(contactId);

  if (!contact) return next(new AppError("Contact not found", 404));

  if (contact.userId !== req.user.id)
    return next(new AppError("Contact not found", 404));

  return res.status(200).json({
    status: "Success",
    data: contact,
  });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  if (!contactId) return next(new AppError("Invalid contact ID", 400));

  const { firstName, lastName, email, phone, relationship, birthday } =
    req.body;

  const getContact = await Contact.findById(contactId);

  if (!getContact) return next(new AppError("Contact not found", 404));

  if (getContact.userId !== req.user.id)
    return next(new AppError("Contact not found", 404));

  const contact = await Contact.findByIdAndUpdate(
    contactId,
    {
      firstName,
      lastName,
      email,
      phone,
      relationship,
      birthday,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: "Success",
    data: contact,
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  if (!contactId) return next(new AppError("Invalid contact ID", 400));

  const getContact = await Contact.findById(contactId);

  if (!getContact) return next(new AppError("Contact not found", 404));

  if (getContact.userId !== req.user.id)
    return next(new AppError("Contact not found", 404));

  const contact = await Contact.findByIdAndDelete(contactId);

  return res.status(204).json({
    status: "Success",
    data: null,
  });
});
