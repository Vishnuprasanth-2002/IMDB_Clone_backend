const Joi = require("joi");

const addRatingSchema = Joi.object({
  rating: Joi.number().max(5).required(),
});
module.exports = { addRatingSchema };
