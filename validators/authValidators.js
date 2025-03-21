const joi = require("joi");

const signupSchema = joi.object({
  name: joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 50 characters",
  }),

  email: joi.string().min(6).max(60).required().email({ tlds: { allow: ["com", "net"] } }).messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "string.min": "Email should have at least 6 characters",
    "string.max": "Email should not exceed 60 characters",
  }),

  password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")).messages({
    "string.empty": "Password is required",
    "string.pattern.base": "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
  }),

  role: joi.string().valid("user", "admin").required().messages({
    "any.only": "Role must be either 'user' or 'admin'",
    "string.empty": "Role is required",
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  password: joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = { signupSchema, loginSchema };
