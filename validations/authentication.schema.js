const Joi = require("joi");

const signUpSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().allow(""),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  user_name: Joi.string()
    .min(5)
    .pattern(new RegExp("^[a-zA-Z0-9^_-]"))
    .required(),
  user_password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,}$"))
    .required(),
  phone_no: Joi.string().allow("").pattern(new RegExp("^[0-9]{7,15}$")),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  user_password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,}$"))
    .required(),
});

const updateSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
  user_name: Joi.string()
    .min(5)
    .pattern(new RegExp("^[a-zA-Z0-9^_-]"))
    .optional(),
  user_password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,20}$"))
    .optional(),
  phone_no: Joi.string().optional().pattern(new RegExp("^[0-9]{7,15}$")),
});
const updatePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,}$"))
    .required(),
});
const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});
const updateNewPasswordSchema = Joi.object({
  new_password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,}$"))
    .required(),
});
module.exports = {
  signUpSchema,
  loginSchema,
  updateSchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  updateNewPasswordSchema,
};
