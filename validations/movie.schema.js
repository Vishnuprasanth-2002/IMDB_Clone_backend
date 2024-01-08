const Joi = require("joi");

const addMovieSchema = Joi.object({
  movie_name: Joi.string().required(),
  image: Joi.string().required(),
  release_year: Joi.number().required(),
  movie_desc: Joi.string().required(),
});
const updateMovieSchema = Joi.object({
  movie_name: Joi.string().optional(),
  image: Joi.string().optional(),
  release_year: Joi.number().optional(),
  movie_desc: Joi.string().optional(),
});
module.exports = { addMovieSchema, updateMovieSchema };
