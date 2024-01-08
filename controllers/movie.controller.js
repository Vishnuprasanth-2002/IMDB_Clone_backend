const { models, Sequelize, sequelize } = require("../config/sequelize-config");
const Op = Sequelize.Op;
const config = require("../config/config");
const ratings = require("../models/ratings");

const addMovieController = async (req, res, next) => {
  try {
    const searchMovie = await models.movies.findAll({
      attributes: ["movie_name"],
      where: { movie_name: req.body.movie_name },
    });
    if (searchMovie.length == 0) {
      const movieCreate = await models.movies.create({
        movie_name: req.body.movie_name,
        image: req.body.image,
        release_year: req.body.release_year,
        movie_desc: req.body.movie_desc,
        user_id: req.decoded.user_id,
      });
      res.json({
        movieCreate,
      });
    } else {
      return next({
        status: 400,
        message: "movie already exits",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
const getAllMovieController = async (req, res, next) => {
  let whereQuery = {};
  let sort_name;
  if (req.query.search) {
    whereQuery.movie_name = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  }
  if (req.query.movie_name) {
    sort_name = req.query.movie_name;
  }
  try {
    const pageSize = parseInt(req.query.pagesize) || 3;
    const page = parseInt(req.query.page) || 1;

    const { count, rows: movies } = await models.movies.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      attributes: ["movie_id", "movie_name", "release_year", "image"],
      where: whereQuery,
      order: [["movie_name", sort_name ? sort_name : "ASC"]],
      distinct: true,
      include: [
        {
          model: models.ratings,
          as: "ratings",
          attributes: ["rating"],
        },
      ],
    });

    const oneMovie = movies.map((m) => {
      const overallRating = m.ratings.length
        ? m.ratings.reduce((total, rating) => total + rating.rating, 0) /
          m.ratings.length
        : 0;
      return {
        movie_id: m.movie_id,
        movie_name: m.movie_name,
        release_year: m.release_year,
        image: m.image,
        rating: overallRating,
      };
    });

    res.json({
      totalMovies: count,
      movies: oneMovie,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

const getMovieController = async (req, res, next) => {
  try {
    const getMovie = await models.movies.findOne({
      attributes: [
        "movie_id",
        "movie_name",
        "release_year",
        "image",
        "movie_desc",
      ],
      where: { movie_id: req.params.id },
      include: [
        {
          model: models.ratings,
          as: "ratings",
          attributes: ["rating"],
          include: [
            {
              model: models.users,
              as: "userRating",
              attributes: ["user_name"],
            },
          ],
        },
        {
          model: models.users,
          as: "addedBy",
          attributes: ["user_name"],
        },
      ],
      logging: true,
    });

    const ratings = getMovie.ratings.map((rating) => ({
      rating: rating.rating,
      ratedBy: rating.userRating.user_name,
    }));

    const overallRating = getMovie.ratings.length
      ? getMovie.ratings.reduce((total, rating) => total + rating.rating, 0) /
        getMovie.ratings.length
      : 0;

    const movieWithFormattedData = {
      movie_id: getMovie.movie_id,
      movie_name: getMovie.movie_name,
      release_year: getMovie.release_year,
      movie_desc: getMovie.movie_desc,
      image: getMovie.image,
      addedBy: getMovie.addedBy.user_name,
      ratings,
      overallRating,
    };

    res.json(movieWithFormattedData);
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
const updateMovieController = async (req, res, next) => {
  try {
    const searchMovie = await models.movies.findOne({
      where: { movie_id: req.params.id },
    });
    if (searchMovie === null) {
      return next({
        status: 400,
        message: "Movie not found",
      });
    } else {
      if (req.decoded.user_id !== searchMovie.user_id) {
        return next({
          status: 400,
          message: "You cannot edit this movie",
        });
      } else {
        const updateMovie = await models.movies.update(
          {
            movie_name: req.body.movie_name,
            image: req.body.image,
            release_year: req.body.release_year,
            movie_desc: req.body.movie_desc,
          },
          {
            where: {
              movie_id: req.params.id,
            },
            returning: true,
          }
        );

        res.json({
          updateMovie,
        });
      }
    }
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};
const deleteMovieController = async (req, res, next) => {
  try {
    const getMovie = await models.movies.findOne({
      where: { movie_id: req.params.id },
    });
    if (!getMovie) {
      return next({
        status: 400,
        message: "Movie not found",
      });
    }
    if (req.decoded.user_id !== getMovie.user_id) {
      return next({
        status: 403,
        message: "You don't have access to this movie",
      });
    } else {
      // const result = await sequelize.transaction(async () => {
      const deleteMovie = await models.movies.destroy({
        where: { movie_id: req.params.id },
        returning: true,
      });

      res.json({ deleteMovie });
      // });
    }
  } catch (error) {
    return next({
      status: 400,
      message: error.message,
    });
  }
};
const imageController = async (req, res) => {
  console.log("\n req.file...", req.file);
  return res.json({
    file: req.file,
  });
};
module.exports = {
  addMovieController,
  getAllMovieController,
  getMovieController,
  updateMovieController,
  deleteMovieController,
  imageController,
};
