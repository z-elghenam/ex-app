const Joi = require("joi");

// Register validation
const validateRegister = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "any.required": "First name is required",
    }),

    lastName: Joi.string().min(2).max(50).required().messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "any.required": "Last name is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
        )
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),

    phone: Joi.string()
      .pattern(/^[+]?[1-9]?[0-9]{7,15}$/)
      .optional()
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),

    dateOfBirth: Joi.date().max("now").optional().messages({
      "date.max": "Date of birth cannot be in the future",
    }),

    role: Joi.string().valid("CLIENT", "GUIDE", "ADMIN").optional().messages({
      "any.only": "Role must be either CLIENT, GUIDE, or ADMIN",
    }),
  });

  return schema.validate(data);
};

// Login validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data);
};

// Forgot password validation
const validateForgotPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
  });

  return schema.validate(data);
};

// Reset password validation
const validateResetPassword = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
        )
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
